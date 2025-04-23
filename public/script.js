const socket = io();
const editor = document.getElementById('editor');

// Initialize with server content (preserves newlines)
socket.on('init', content => {
  editor.innerText = content;
});

// Whenever the user types, grab the *visible* text (with line breaks)
editor.addEventListener('input', () => {
  const text = editor.innerText;
  socket.emit('edit', text);
});

// When other users’ edits come in, overwrite and restore cursor
socket.on('update', content => {
  const sel = window.getSelection();
  const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

  editor.innerText = content;

  if (range) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
});
