# Markdown to PDF Converter

Convert Markdown files with Mermaid diagrams to professional PDFs. Standalone script with native Cursor IDE integration.

<div align="center">
  <video src="./assets/md-mermaid-to-pdf.mp4" width="100%" autoplay loop muted></video>
</div>

> **Quick Demo:** Convert any `.md` file to PDF directly from Cursor with one keyboard shortcut.

---

## Why Use This?

- **Zero setup** - Just `npm install` and start converting
- **Cursor native** - Integrated task for instant PDF generation
- **Professional output** - A4 format, Inter font, syntax highlighting
- **Mermaid diagrams** - Full support for flowcharts, sequence diagrams, etc.
- **No external tools** - Everything bundled via npm

---

## Quick Start

```bash
npm install
md-convert.bat your-file.md
```

**Or use from Cursor:** `Ctrl+Shift+P` → "Tasks: Run Task" → "Convert MD to PDF"

---

## Installation

**Prerequisites:** Node.js v16+ ([download](https://nodejs.org/))

```bash
# Verify Node.js
node --version

# Install dependencies
npm install
```

Downloads ~300MB (includes Chromium). Takes 2-5 minutes.

---

## Cursor Integration

### Setup

Add this to `C:\Users\{username}\AppData\Roaming\Cursor\User\settings.json`:

```json
"tasks.version": "2.0.0",
"tasks.tasks": [
  {
    "label": "Convert MD to PDF",
    "type": "shell",
    "command": "node C:/path/to/md-mermaid-to-pdf/md-to-pdf-puppeteer.js \"${file}\"",
    "group": "build",
    "presentation": {
      "echo": true,
      "reveal": "always",
      "focus": false,
      "panel": "shared"
    }
  }
]
```

**Update the path** to match your installation directory.

### Usage

1. Open any `.md` file in Cursor
2. `Ctrl+Shift+P` → "Tasks: Run Task" → "Convert MD to PDF"
3. PDF appears in same directory

The `${file}` variable automatically references the current open file.

---

## CLI Usage

```bash
# Windows batch file
md-convert.bat input.md

# Node script (cross-platform)
node md-to-pdf-puppeteer.js input.md
node md-to-pdf-puppeteer.js input.md output.pdf

# NPM
npm run convert input.md
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Markdown** | Full GitHub Flavored Markdown support |
| **Mermaid** | Flowcharts, sequence diagrams, class diagrams, etc. |
| **Syntax Highlighting** | Code blocks via Shiki (GitHub Light theme) |
| **Frontmatter** | YAML metadata (title, author, date) |
| **Styling** | A4 portrait, Inter font, 0.5" margins |
| **Elements** | Tables, lists, images, links, blockquotes |
| **Setup** | No external software needed |

---

## Technical Details

### Dependencies

| Package | Version | Size | Purpose |
|---------|---------|------|---------|
| puppeteer | ^24.25.0 | ~280MB | Headless Chrome for PDF rendering |
| marked | ^16.4.1 | ~100KB | Markdown to HTML parser |
| shiki | ^3.13.0 | ~15MB | Syntax highlighting |
| gray-matter | ^4.0.3 | ~50KB | YAML frontmatter parsing |

### External Resources (CDN)

- **Mermaid.js** (~1MB) - Diagram rendering
- **Inter Font** - Professional typography

**Note:** Internet connection required during PDF generation.

### How It Works

1. Parse Markdown with `marked`
2. Extract frontmatter with `gray-matter`
3. Highlight code blocks with `shiki`
4. Inject Mermaid.js for diagram rendering
5. Render HTML to PDF with `puppeteer` (headless Chrome)
6. Save to disk

---

## Troubleshooting

### Common Issues

**"Cannot find module 'puppeteer'"**
```bash
npm install
```

**"Failed to launch Chrome"**
```bash
npm install puppeteer --force
```

**PDF generation fails**
- Ensure internet connection (CDN resources needed)
- Check firewall/proxy settings

**Cursor task not working**
- Verify path in `settings.json` is absolute
- Use forward slashes: `C:/Users/.../md-to-pdf-puppeteer.js`
- Ensure file exists at specified path

---

## Project Structure

```
md-mermaid-to-pdf/
├── assets/                    # Demo videos and media
├── md-convert.bat             # Windows batch script
├── md-to-pdf-puppeteer.js    # Main converter (505 lines)
├── package.json               # Dependencies
├── package-lock.json          # Locked versions
└── node_modules/              # Dependencies (after npm install)
```

---

## License

MIT

---

## Credits

Built with [Puppeteer](https://pptr.dev/), [Marked](https://marked.js.org/), [Shiki](https://shiki.matsu.io/), [Gray Matter](https://github.com/jonschlinkert/gray-matter), [Mermaid](https://mermaid.js.org/), and [Inter Font](https://rsms.me/inter/).
