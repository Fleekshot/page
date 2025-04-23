document.addEventListener('DOMContentLoaded', () => {
  // 1) Yjs setup
  const ydoc = new Y.Doc();
  const wsUrl =
    (window.location.protocol === 'https:' ? 'wss://' : 'ws://') +
    window.location.host;
  // “collab-editor-room” is the shared room name
  const provider = new Y.WebsocketProvider(wsUrl, 'collab-editor-room', ydoc);
  const ytext = ydoc.getText('editor');

  // 2) Editor binding
  const editor = document.getElementById('editor');

  // When remote updates arrive, update the DIV (preserving cursor roughly)
  ytext.observe(() => {
    const sel = window.getSelection();
    const range = sel.rangeCount ? sel.getRangeAt(0) : null;

    editor.innerHTML = ytext.toString();

    if (range) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
  });

  // On local edits, push the full HTML into Y.Text
  editor.addEventListener('input', () => {
    ytext.delete(0, ytext.length);
    ytext.insert(0, editor.innerHTML);
  });

  // 3) Image-menu logic
  const addImageBtn = document.getElementById('addImage');
  const imageMenu = document.getElementById('imageMenu');
  const importFileBtn = document.getElementById('importFile');
  const importUrlBtn = document.getElementById('importUrl');
  const fileInput = document.getElementById('fileInput');

  addImageBtn.addEventListener('click', e => {
    e.stopPropagation();
    imageMenu.classList.toggle('show');
  });
  document.addEventListener('click', () => {
    imageMenu.classList.remove('show');
  });

  // File import
  importFileBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.execCommand('insertImage', false, reader.result);
      // triggers input → updates Yjs
    };
    reader.readAsDataURL(file);
  });

  // URL import
  importUrlBtn.addEventListener('click', () => {
    const url = prompt('Enter image URL');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  });
});
