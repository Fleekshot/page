# Collaborative Text Editor

A simple multiplayer text page that grows beyond the first screen. All changes are stored on the server in memory until you restart the Codespace.

## Features

- **Live collaborative typing**: everyone sees edits in real time.
- **Infinite scroll**: the page expands past the first “page” as you type.
- **Server‑side save**: the current document is kept in memory; new users get the full text on join. Resets only when the Codespace restarts.

## Usage

1. **Clone your repo**  
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```

2. **Open in GitHub Codespaces**  
   - Click **Code → Open with Codespaces → New codespace**.  
   - Wait for the container to build (it will run `npm install`).

3. **Start**  
   ```bash
   npm start
   ```
   by default listens on port 3000.

4. **Forward & share**  
   - In Codespaces’ **Ports** tab, forward port 3000 publicly.  
   - Copy the URL and share it—anyone on that link can type together!

## Customization

- Change font, colors, or padding in `public/style.css`.  
- To persist beyond server restarts, replace the in‑memory `documentContent` with a database (e.g. SQLite or Mongo).
