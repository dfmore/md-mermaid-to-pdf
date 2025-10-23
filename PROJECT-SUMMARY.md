# Project Summary

## What This Project Is

A standalone Markdown to PDF converter with Mermaid diagram support:
```
C:\Users\moreird\GitHub\md-mermaid-to-pdf\
```

**Key Point**: Simple standalone script - no servers, no complex setup. Just `npm install` and convert.

## Project Files

### Conversion Scripts

- **md-convert.bat** - Windows batch file for easy conversion
  - Simplest usage: `md-convert.bat input.md`
  - No additional arguments needed
  - Creates PDF in same directory as input

- **md-to-pdf-puppeteer.js** - Main converter script
  - No setup required - works after `npm install`
  - Uses: Puppeteer, Marked, Shiki
  - Full Mermaid diagram support
  - Professional styling with Inter font

### Configuration Files

- **package.json** - Dependencies and NPM scripts

### Documentation

- **README.md** - Complete usage guide and feature list
- **PROJECT-SUMMARY.md** - This file (project overview)
- **SETUP-INSTRUCTIONS.md** - Detailed setup and installation guide

## How to Use This Project

### Method 1: Batch File (Easiest)

```bash
cd C:\Users\moreird\GitHub\md-mermaid-to-pdf
md-convert.bat "C:\path\to\your\file.md"
```

Output will be in the same directory as the input file.

### Method 2: Node Script Directly

```bash
cd C:\Users\moreird\GitHub\md-mermaid-to-pdf
node md-to-pdf-puppeteer.js "C:\path\to\your\file.md"
node md-to-pdf-puppeteer.js "C:\path\to\input.md" "C:\path\to\output.pdf"
```

### Method 3: NPM Script

```bash
cd C:\Users\moreird\GitHub\md-mermaid-to-pdf
npm run convert "C:\path\to\your\file.md"
```

### Method 4: Cursor Task (If Configured)

1. Open any Markdown file in Cursor
2. Press `Ctrl+Shift+P`
3. Select "Tasks: Run Task" → "Convert MD to PDF"
4. PDF appears in same directory

## Integration with Cursor (Optional)

If you've set up a Cursor task, configure it like this:

**Task Configuration** (in your workspace `.vscode/tasks.json` or global tasks):
```json
{
  "label": "Convert MD to PDF",
  "type": "shell",
  "command": "node",
  "args": [
    "C:/Users/moreird/GitHub/md-mermaid-to-pdf/md-to-pdf-puppeteer.js",
    "${file}"
  ]
}
```

This allows instant PDF conversion from any open `.md` file.

## Output Quality

The PDF converter produces professional documents with:

- ✅ **Proper formatting** - Clean, readable layout
- ✅ **Mermaid diagrams** - Fully rendered flowcharts, sequence diagrams, etc.
- ✅ **Syntax highlighting** - Code blocks with proper colors via Shiki
- ✅ **Professional fonts** - Inter font family for body text
- ✅ **Standard layout** - A4 portrait with 0.5" margins
- ✅ **Tables and lists** - Properly formatted
- ✅ **Images and links** - Preserved and functional

## Project Architecture

### Design Philosophy
- **Standalone script** - No server, no complex setup
- **Multiple usage methods** - Batch file, Node, or NPM
- **Minimal dependencies** - Only what's necessary (4 npm packages)
- **Simple maintenance** - Standard npm packages
- **Portable** - Copy folder anywhere with Node.js

### Technical Details
- **Puppeteer** - Headless Chrome for PDF rendering
- **Marked** - Markdown to HTML conversion
- **Shiki** - Syntax highlighting for code blocks
- **Gray-matter** - YAML frontmatter parsing
- **Mermaid.js** - Loaded from CDN for diagram rendering
- **Inter Font** - Loaded from Google Fonts CDN

### Internet Requirement
The converter loads these resources from CDN during PDF generation:
- Mermaid.js library (~1MB)
- Inter font files

An internet connection is required when generating PDFs.

## Quick Start Guide

### First Time Setup
```bash
cd C:\Users\moreird\GitHub\md-mermaid-to-pdf
npm install
```

This installs ~300MB of dependencies (including Chromium browser).

### Daily Usage
```bash
# Easiest method - batch file
md-convert.bat your-file.md

# Or use Node directly
node md-to-pdf-puppeteer.js your-file.md

# Or via NPM
npm run convert your-file.md
```

## Dependencies

### Required (Installed Locally via npm)
- **gray-matter** (^4.0.3) - YAML frontmatter parsing
- **marked** (^16.4.1) - Markdown to HTML conversion
- **puppeteer** (^24.25.0) - Headless Chrome for PDF rendering (~280MB)
- **shiki** (^3.13.0) - Syntax highlighting for code blocks

All dependencies are self-contained in `node_modules` after `npm install`.

### External Resources (Loaded from CDN)
- **Mermaid.js** - From jsDelivr CDN
- **Inter Font** - From Google Fonts

These are loaded during PDF generation and require internet connectivity.

## Advantages of This Project

1. **Simple Setup**: Just `npm install` and start converting
2. **No External Software**: No LaTeX, Pandoc, or system packages needed
3. **Multiple Usage Options**: Batch file, Node script, or NPM commands
4. **Portable**: Copy folder anywhere with Node.js installed
5. **Easy to Update**: Standard npm packages (`npm update`)
6. **Professional Output**: A4 format, proper fonts, clean layout
7. **Full Feature Set**: Mermaid, syntax highlighting, tables, images
8. **Self-Contained**: All JavaScript dependencies in `node_modules`

## What Someone Needs to Use This

### Prerequisites
1. **Node.js** (v16 or higher) installed on their system
2. **Internet connection** for:
   - Initial `npm install` (downloads dependencies)
   - PDF generation (loads CDN resources)

### Installation Steps
```bash
# 1. Download/clone the project
# 2. Install dependencies
npm install

# 3. Start converting
md-convert.bat your-file.md
```

That's it! No additional software, no system packages, no configuration.

## File Sizes

- **md-to-pdf-puppeteer.js**: ~505 lines - Complete converter
- **md-convert.bat**: ~15 lines - Simple batch interface
- **package.json**: Minimal configuration
- **node_modules/**: ~300MB after install (includes Chromium)

## Ready to Use

The project is ready to use immediately after `npm install`:

1. **First time**: Run `npm install` (takes a few minutes)
2. **Every time**: Use `md-convert.bat your-file.md`
3. **Output**: PDF in same directory as input file

No additional setup, configuration, or external software needed.
