# Collaborative Editor with Yjs

A real-time collaborative editor that supports text and inline images, powered by Yjs (CRDT) & y-websocket.  
Changes merge seamlessly, cursors stay independent, and the document lives in memory until the Codespace restarts.

## Features

- **True OT/CRDT** with Yjs — no cursor jumps or overwrite conflicts.  
- **Image import** from local files or URLs.  
- **Infinite page**: grows as you type or insert media.  
- **In-memory** persistence until server restart.

## Setup

1. **Clone your repo**  
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
