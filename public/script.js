const socket = io();
const editor = document.getElementById('editor');

// Initialize with server content
socket.on('init', content => {
  editor.textContent = content;
});

// Broadcast edits whenever the user types
editor.addEventListener('input', () => {
  const text = editor.textContent;
  socket.emit('edit', text);
});

// Receive updates from other users
socket.on('update', content => {
  // Save cursor/selection
  const sel = window.getSelection();
  const range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

  // Apply new content
  editor.textContent = content;

  // Restore cursor (basic)
  if (range) {
    sel.removeAllRanges();
    sel.addRange(range);
  }
});
