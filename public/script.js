const socket = io();
const editor = document.getElementById('editor');

let lastValue = '';
let isApplyingRemote = false;

// Auto-resize the textarea to fit content
function autoResize() {
  editor.style.height = 'auto';
  editor.style.height = editor.scrollHeight + 'px';
}

// Initialize with server content
socket.on('init', content => {
  lastValue = content;
  editor.value = content;
  autoResize();
});

// Compute diff between lastValue and current, emit single op
editor.addEventListener('input', () => {
  if (isApplyingRemote) return;

  autoResize();
  const newValue = editor.value;
  const oldValue = lastValue;

  // 1) Find start of diff
  let start = 0;
  while (
    start < oldValue.length &&
    start < newValue.length &&
    oldValue[start] === newValue[start]
  ) {
    start++;
  }

  // 2) Find common tail length
  let oldEnd = oldValue.length - 1;
  let newEnd = newValue.length - 1;
  let tail = 0;
  while (
    oldEnd >= start &&
    newEnd >= start &&
    oldValue[oldEnd] === newValue[newEnd]
  ) {
    oldEnd--;
    newEnd--;
    tail++;
  }

  // 3) Compute removed/inserted
  const removed = oldValue.length - start - tail;
  const inserted = newValue.length - start - tail;
  const insertedText = newValue.slice(start, start + inserted);

  // 4) Build op and emit
  const op = { index: start, removed, inserted: insertedText };
  socket.emit('operation', op);

  // 5) Update lastValue
  lastValue = newValue;
});

// Apply incoming operations without shifting the local cursor
socket.on('operation', op => {
  const { index, removed, inserted } = op;

  // Prevent our own input listener from firing
  isApplyingRemote = true;

  // Apply the change in-place, preserving selection
  editor.setRangeText(inserted, index, index + removed, 'preserve');
  isApplyingRemote = false;

  // Update our snapshot and resize
  lastValue = editor.value;
  autoResize();
});
