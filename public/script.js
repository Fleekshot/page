const socket = io();
const editor = document.getElementById('editor');

// Auto-resize the textarea to fit content
function autoResize() {
  editor.style.height = 'auto';
  editor.style.height = editor.scrollHeight + 'px';
}

// Initialize with server content
socket.on('init', content => {
  editor.value = content;
  autoResize();
});

// On local edits, resize & emit entire document
editor.addEventListener('input', () => {
  autoResize();
  socket.emit('edit', editor.value);
});

// On remote updates, keep cursor pos & resize
socket.on('update', content => {
  const cursor = editor.selectionStart;
  editor.value = content;
  autoResize();
  editor.selectionStart = editor.selectionEnd = cursor;
});
