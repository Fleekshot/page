const socket = io();
const editor = document.getElementById('editor');

// Resize textarea to fit content
function autoResize() {
  editor.style.height = 'auto';
  editor.style.height = editor.scrollHeight + 'px';
}

// Initialize with full content
socket.on('init', content => {
  editor.value = content;
  autoResize();
});

// Send each local keystroke as an op
editor.addEventListener('input', e => {
  autoResize();

  const cursor = editor.selectionStart;
  let op;

  switch (e.inputType) {
    case 'insertText':
    case 'insertLineBreak': {
      // e.data is the inserted character (newline for line breaks)
      const inserted = e.data === null ? '\n' : e.data;
      const index = cursor - inserted.length;
      op = { index, removed: 0, inserted };
      break;
    }
    case 'deleteContentBackward': {
      // deletion of one character immediately before the cursor
      const index = cursor;
      op = { index, removed: 1, inserted: '' };
      break;
    }
    default: {
      // fallback: replace entire document
      // (rarely used, but ensures you don't lose sync)
      op = { index: 0, removed: editor.value.length, inserted: editor.value };
    }
  }

  socket.emit('operation', op);
});

// Apply incoming ops without moving the local cursor
socket.on('operation', op => {
  // insert/delete at the given index, preserve current selection
  editor.setRangeText(op.inserted, op.index, op.index + op.removed, 'preserve');
  autoResize();
});
