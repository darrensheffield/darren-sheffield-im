# Darren.Sheffield.im

Static GitHub Pages site for `darren.sheffield.im`.

The site is intentionally plain HTML, CSS, and JavaScript so it can publish directly from the repository root.

## Private area entry

- `darren.html` is a public entry point for the local private workflow.
- The actual private scaffold lives in the sibling directory:
  `../darren-private-local`.
- The public page links to `http://127.0.0.1:4173/` for same-Mac testing when you run the local private server.
- iPad and iPhone testing should use the Mac's LAN hostname or IP, for example `http://your-mac.local:4173/`.
- Do not place real private data in the public repository. Use the local private scaffold for development and CloudKit or an authenticated local endpoint for production data.
