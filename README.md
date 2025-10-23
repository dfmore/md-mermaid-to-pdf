# Markdown to PDF Converter

Convert Markdown files with Mermaid diagrams and code blocks to PDF. Built for Cursor IDE with one-click conversion.

https://github.com/user-attachments/assets/5f5ddd09-66f3-407b-be05-ade41b87668a

---

## Quick Start for Cursor Users

### Step 1: Install Node.js (if needed)

Check if you have Node.js:
```powershell
node --version
```

If you see a version number (v16.0.0 or higher), skip to Step 2.

If not, **open PowerShell as Administrator** and run:
```powershell
winget install OpenJS.NodeJS.LTS
```

Then **close and reopen PowerShell** (or restart Cursor).

> **Don't have winget?** Download from https://nodejs.org/ and install the LTS version.

### Step 2: Install This Project

```powershell
cd C:\path\to\md-mermaid-to-pdf
npm install
```

This downloads ~300MB and takes 2-5 minutes. Wait for it to complete.

### Step 3: Add Cursor Task

Open `C:\Users\{YourName}\AppData\Roaming\Cursor\User\settings.json` and add this:

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

**⚠️ Important:** Replace `C:/path/to/md-mermaid-to-pdf/` with your actual installation path. Use forward slashes `/` even on Windows.

**Example:**
```json
"command": "node C:/Users/John/GitHub/md-mermaid-to-pdf/md-to-pdf-puppeteer.js \"${file}\"",
```

### Step 4: Use It

1. Open any `.md` file in Cursor
2. Press `Ctrl+Shift+P`
3. Type "Tasks: Run Task"
4. Select "Convert MD to PDF"
5. PDF appears in the same folder as your `.md` file

Done! You now have one-click PDF conversion in Cursor.

---

## What It Does

- 📄 Converts Markdown to PDF
- 📊 Renders all Mermaid diagram types (flowcharts, sequence, class, state, ER, Gantt, etc.)
- 💻 Syntax highlighting for 100+ languages
- 🔧 One-click conversion from Cursor
- ⚡ Uses headless Chrome - no LaTeX or Pandoc required

---

## CLI Usage (Alternative)

If you prefer command line:

```powershell
# Windows batch file
.\md-convert.bat your-file.md

# Or Node script directly
node md-to-pdf-puppeteer.js your-file.md
node md-to-pdf-puppeteer.js input.md output.pdf
```

---

## Supported Features

**Mermaid diagrams:**
- Flowcharts, sequence diagrams, class diagrams
- State diagrams, ER diagrams, Gantt charts
- Pie charts, git graphs, user journeys

**Code syntax highlighting:**
- 100+ languages (JavaScript, Python, Go, Rust, C/C++, Java, etc.)
- GitHub Light theme
- Monospace fonts with proper indentation

**Standard Markdown:**
- Headings, bold, italic, code
- Lists, tables, blockquotes
- Links, images
- YAML frontmatter

**Output format:**
- A4 portrait pages
- Inter font (11pt body, 20pt headings)
- 0.5" margins

---

## Troubleshooting

**"node is not recognized"**

Node.js isn't installed or not in PATH.

→ Install Node.js using Step 1 above  
→ Restart PowerShell/Cursor after installation

**"Cannot find module 'puppeteer'"**

Dependencies aren't installed.

→ Run `npm install` in the project directory  
→ Wait for it to complete (~300MB download)

**"Failed to launch Chrome"**

Puppeteer's Chrome is corrupted.

→ Run `npm install puppeteer --force`

**Cursor task doesn't work**

Path in settings.json is wrong.

→ Use absolute path with forward slashes: `C:/Users/...`  
→ Verify the file exists at that path  
→ Restart Cursor after editing settings.json

**Mermaid diagrams not rendering**

Internet connection issue.

→ Check you're online (Mermaid loads from CDN)  
→ Test your diagram syntax at https://mermaid.live

**PDF generation takes forever**

First run downloads fonts/libraries from CDN.

→ Be patient on first PDF generation  
→ Subsequent runs are faster (cached)

---

## How It Works

Uses headless Chrome to render Markdown as HTML, then saves as PDF:

1. Parses Markdown with `marked`
2. Extracts YAML frontmatter with `gray-matter`
3. Highlights code with `shiki`
4. Loads Mermaid.js from CDN for diagrams
5. Renders to PDF with `puppeteer`

**Note:** Requires internet connection because Mermaid.js and Inter font load from CDN during PDF generation.

