# Markdown to PDF Converter

Convert Markdown files with Mermaid diagrams and code blocks to PDF. Built for technical documentation with native Cursor IDE integration.

https://github.com/user-attachments/assets/5f5ddd09-66f3-407b-be05-ade41b87668a

> **Quick Demo:** Convert any `.md` file to PDF directly from Cursor with one keyboard shortcut.

---

## Why This Converter?

Unlike basic Markdown converters, this tool excels at technical documentation:

- 🎯 **Built for Mermaid** - All diagram types: flowcharts, sequence, class, state, ER, Gantt, etc.
- 💻 **Code-focused** - Syntax highlighting for 100+ languages via Shiki (GitHub theme)
- 📐 **Diagram quality** - High-resolution SVG rendering, centered layout, proper backgrounds
- 🎨 **Code aesthetics** - Monospace fonts, syntax colors, proper spacing
- ⚡ **Fast rendering** - Headless Chrome engine handles complex diagrams efficiently
- 🔧 **Cursor native** - One-click PDF generation from your editor
- 📦 **Self-contained** - No LaTeX, Pandoc, or external tools needed

**Perfect for:** API documentation, technical specs, architecture diagrams, code tutorials, engineering notes.

---

## Installation

### Prerequisites: Node.js v16+

**Check if already installed:**
```powershell
node --version
```

**If not installed, choose one method:**

```powershell
# Method 1: winget (Windows 11/10 - easiest)
winget install OpenJS.NodeJS.LTS

# Method 2: Chocolatey
choco install nodejs-lts

# Method 3: Manual installer
# Download from https://nodejs.org/ (LTS version)
```

**After installation:** Close and reopen PowerShell to refresh PATH.

### Setup This Project

```powershell
# Navigate to project folder
cd C:\path\to\md-mermaid-to-pdf

# Install dependencies (~300MB, takes 2-5 min)
npm install

# Test it works
echo "# Test`n``````javascript`nconst x = 1;`n```````n``````mermaid`ngraph LR`n    A-->B`n``````" > test.md
.\md-convert.bat test.md
```

If you see `✅ Successfully converted to PDF: test.pdf`, you're ready!

---

## Usage

### From Command Line

```powershell
.\md-convert.bat your-file.md
```

### From Cursor (Recommended)

**One-time setup:** Edit `C:\Users\{YourName}\AppData\Roaming\Cursor\User\settings.json` and add:

```json
"tasks.version": "2.0.0",
"tasks.tasks": [
  {
    "label": "Convert MD to PDF",
    "type": "shell",
    "command": "node C:/Users/YourName/GitHub/md-mermaid-to-pdf/md-to-pdf-puppeteer.js \"${file}\"",
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

Replace `C:/Users/YourName/GitHub/md-mermaid-to-pdf/` with your actual path (use forward slashes).

**Then use it:**
1. Open any `.md` file in Cursor
2. `Ctrl+Shift+P` → "Tasks: Run Task" → "Convert MD to PDF"
3. PDF appears in same directory

---

## What It Supports

### All Mermaid Diagram Types

```
✅ Flowcharts (graph TD, graph LR)
✅ Sequence diagrams
✅ Class diagrams
✅ State diagrams
✅ Entity Relationship diagrams
✅ Gantt charts
✅ Pie charts
✅ Git graphs
✅ User journeys
✅ Quadrant charts
```

All diagrams render as high-quality SVG, centered with proper styling.

### Syntax Highlighting for 100+ Languages

**Common languages:**
JavaScript, TypeScript, Python, Go, Rust, C/C++/C#, Java, Bash, PowerShell, JSON, YAML, SQL, HTML, CSS, Markdown, Docker, Terraform

**Code blocks get:**
- Monospace fonts (SF Mono, Consolas)
- GitHub Light syntax colors
- Light gray background
- Proper indentation

### Standard Markdown

- Headings (H1-H6)
- **Bold**, *italic*, `code`
- Lists, tables, blockquotes
- Links, images
- YAML frontmatter

---

## Output Format

- A4 portrait pages
- Inter font family (11pt body, 20pt-11pt headings)
- 0.5" margins
- High-resolution diagram rendering
- Clean code block formatting

---

## Troubleshooting

**"node is not recognized"**
- Restart PowerShell after installing Node.js
- Or manually add to PATH: `$env:Path += ";C:\Program Files\nodejs\"`

**"Cannot find module 'puppeteer'"**
- Run `npm install` in the project directory

**"Failed to launch Chrome"**
- Run `npm install puppeteer --force`

**Mermaid diagrams not rendering**
- Check internet connection (Mermaid loads from CDN)
- Validate syntax at https://mermaid.live

**Cursor task not working**
- Use absolute path with forward slashes in settings.json
- Verify the file exists at that path
- Restart Cursor after editing settings

---

## How It Works

1. Parses Markdown with `marked` (GitHub Flavored Markdown)
2. Extracts YAML frontmatter with `gray-matter`
3. Highlights code blocks with `shiki`
4. Loads Mermaid.js from CDN for diagrams
5. Renders HTML to PDF with `puppeteer` (headless Chrome)
6. Saves high-quality PDF to disk

**Dependencies:** puppeteer (~280MB), marked, shiki (~15MB), gray-matter  
**CDN Resources:** Mermaid.js (~1MB), Inter Font (~400KB)  
**Internet required:** Yes, for CDN resources during PDF generation

---

## License

MIT

---

## Credits

Built with [Puppeteer](https://pptr.dev/), [Marked](https://marked.js.org/), [Shiki](https://shiki.matsu.io/), [Gray Matter](https://github.com/jonschlinkert/gray-matter), [Mermaid](https://mermaid.js.org/), and [Inter Font](https://rsms.me/inter/).
