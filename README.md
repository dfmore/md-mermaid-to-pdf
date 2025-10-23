# Markdown to PDF Converter

Convert Markdown files with Mermaid diagrams to professional PDFs. Simple standalone script with excellent Cursor IDE integration.

## Quick Start

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Convert a markdown file
md-convert.bat your-file.md
```

**Or use directly from Cursor IDE** - see [Cursor Integration](#cursor-integration) section below.

---

## Table of Contents

- [Installation](#installation)
- [Cursor Integration](#cursor-integration) ⭐ **Featured**
- [Usage](#usage)
- [Features](#features)
- [Technical Details](#technical-details)

---

## Installation

**Prerequisites:** Node.js v16+ ([download](https://nodejs.org/))

```bash
# Check Node.js is installed
node --version

# Clone/download project and install
cd path/to/md-mermaid-to-pdf
npm install

# Test it
echo "# Hello World" > test.md
md-convert.bat test.md
```

Installation downloads ~300MB (includes Chromium browser). Takes 2-5 minutes.

---

## Cursor Integration

Convert any Markdown file to PDF directly from Cursor with one command.

https://github.com/user/attachments/assets/cursor-demo.mp4

<!-- Replace the video URL above after uploading to GitHub:
1. Edit this file on GitHub
2. Drag your demo.mp4 into the editor
3. GitHub will generate a URL automatically
4. Replace the placeholder URL with the generated one
-->

### Setup

Add this to your Cursor settings file (`C:\Users\{username}\AppData\Roaming\Cursor\User\settings.json`):

```json
"tasks.version": "2.0.0",
"tasks.tasks": [
  {
    "label": "Convert MD to PDF",
    "type": "shell",
    "command": "node C:/Users/moreird/GitHub/md-mermaid-to-pdf/md-to-pdf-puppeteer.js \"${file}\"",
    "group": "build",
    "presentation": {
      "echo": true,
      "reveal": "always",
      "focus": false,
      "panel": "shared",
      "showReuseMessage": true,
      "clear": false
    },
    "problemMatcher": []
  }
]
```

**Update the path** to match your installation directory.

### Usage

1. Open any `.md` file in Cursor
2. Press `Ctrl+Shift+P`
3. Type "Tasks: Run Task"
4. Select "Convert MD to PDF"
5. PDF appears in same directory as the Markdown file

The `${file}` variable automatically uses the currently open file path.

---

## Usage

```bash
# Batch file (Windows)
md-convert.bat input.md

# Node script (cross-platform)
node md-to-pdf-puppeteer.js input.md output.pdf

# NPM
npm run convert input.md

# Cursor IDE
# See Cursor Integration section above
```

---

## Features

- Markdown to PDF with Mermaid diagrams
- Syntax highlighting via Shiki
- YAML frontmatter support
- Professional styling: A4, Inter font, 0.5" margins
- Tables, lists, images, links
- No external software needed

---

## Technical Details

**Dependencies:**
- puppeteer (^24.25.0) - ~280MB
- marked (^16.4.1)
- shiki (^3.13.0)
- gray-matter (^4.0.3)

**CDN Resources (requires internet):**
- Mermaid.js (~1MB)
- Inter Font

**Conversion pipeline:**
1. Parse Markdown with `marked`
2. Extract frontmatter with `gray-matter`
3. Highlight code with `shiki`
4. Render diagrams with Mermaid.js
5. Generate PDF with `puppeteer`
