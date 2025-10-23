# Markdown to PDF Converter

Convert Markdown files with Mermaid diagrams to professional PDFs. Simple, standalone script - no complex setup required.

## Quick Start

```bash
# 1. Install dependencies (first time only)
npm install

# 2. Convert a markdown file
md-convert.bat your-file.md

# Or use Node directly
node md-to-pdf-puppeteer.js your-file.md

# Or use NPM script
npm run convert your-file.md
```

## Installation

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Internet connection** (for first-time setup and during PDF generation)

### Setup Steps

```bash
# 1. Clone or download this project
cd C:\Users\moreird\GitHub\md-mermaid-to-pdf

# 2. Install dependencies
npm install
```

This will install all required packages (~300MB including Chromium browser):
- **puppeteer** - Headless Chrome for PDF rendering
- **marked** - Markdown parser
- **shiki** - Syntax highlighting
- **gray-matter** - YAML frontmatter support

**Note**: During PDF generation, the converter loads Mermaid.js and Inter fonts from CDN, so an internet connection is required when creating PDFs.

## Usage

### Option 1: Batch Script (Easiest - Windows)

```bash
md-convert.bat input.md
# Creates: input.pdf (in same directory)

md-convert.bat input.md output.pdf
# Creates: output.pdf
```

### Option 2: Node Script

```bash
node md-to-pdf-puppeteer.js input.md
node md-to-pdf-puppeteer.js input.md custom-output.pdf
```

### Option 3: NPM Script

```bash
npm run convert input.md
```

### Option 4: Cursor Task (If Configured)

If you've set up a Cursor task:
1. Open any `.md` file in Cursor
2. Press `Ctrl+Shift+P`
3. Select "Tasks: Run Task" → "Convert MD to PDF"
4. PDF appears in same directory

## Features

- ✅ **Converts Markdown to PDF** - Full GFM support
- ✅ **Mermaid Diagrams** - Flowcharts, sequence diagrams, etc.
- ✅ **Syntax Highlighting** - Beautiful code blocks via Shiki
- ✅ **Frontmatter Support** - YAML metadata
- ✅ **Professional Styling** - Inter font, proper spacing
- ✅ **Standard Format** - A4 portrait, 0.5" margins
- ✅ **Tables & Lists** - Fully supported
- ✅ **Images & Links** - Preserved
- ✅ **No External Software** - Everything via npm

## Supported Markdown

### Mermaid Diagrams

\`\`\`mermaid
graph LR
    A[Start] --> B[Process]
    B --> C[End]
\`\`\`

### Code Blocks with Syntax Highlighting

\`\`\`javascript
function hello() {
  console.log('Hello World');
}
\`\`\`

Supported languages: JavaScript, TypeScript, Python, Bash, JSON, YAML, Markdown, C, and more.

### Frontmatter

```yaml
---
title: My Document
author: John Doe
date: 2024-01-15
---
```

### Standard Markdown

- Headings (H1-H6)
- **Bold**, *italic*, `code`
- Lists (ordered/unordered)
- Tables
- Blockquotes
- Links and images

## Output Styling

The converter produces professional PDFs with:

- **Page Format**: A4 portrait, 0.5 inch margins
- **Body Font**: Inter, 11pt, #222222
- **Headings**: Inter Bold/Semi-bold
  - H1: 20pt
  - H2: 16pt (#2d3748)
  - H3: 14pt
  - H4: 13pt
- **Code Blocks**: SF Mono/Consolas, 8pt, light gray background
- **Mermaid Diagrams**: Centered with gray background
- **Line Height**: 1.4 for comfortable reading

## Project Structure

```
md-mermaid-to-pdf/
├── md-convert.bat             # Windows batch script
├── md-to-pdf-puppeteer.js    # Main converter script
├── package.json               # Dependencies & scripts
├── README.md                  # This file
├── PROJECT-SUMMARY.md         # Project overview
├── SETUP-INSTRUCTIONS.md      # Detailed setup guide
└── node_modules/              # Dependencies (after npm install)
```

## How It Works

1. **Markdown Parsing**: Uses `marked` to parse Markdown syntax
2. **Syntax Highlighting**: Uses `shiki` for beautiful code blocks
3. **Mermaid Rendering**: Loads Mermaid.js from CDN for diagram support
4. **PDF Generation**: Uses `puppeteer` (headless Chrome) to render HTML to PDF
5. **Font Loading**: Uses Inter font from Google Fonts CDN

## Requirements

### What's Installed Locally (via npm)
- All JavaScript dependencies are bundled in `node_modules`
- Puppeteer includes its own Chromium browser
- No system-level packages needed

### What's Loaded from CDN (requires internet)
- **Mermaid.js** (~1MB) - For diagram rendering
- **Inter Font** - For professional typography

## Troubleshooting

### "Failed to launch Chrome"

```bash
# Reinstall Puppeteer with fresh Chromium download
npm install puppeteer --force
```

### "Cannot find module"

```bash
# Install/reinstall all dependencies
npm install
```

### PDF generation fails

- Ensure you have internet connectivity (for CDN resources)
- Check that Node.js is v16 or higher: `node --version`
- Try running with full path: `node C:\path\to\md-to-pdf-puppeteer.js file.md`

### "Permission denied" or file access errors

- Ensure the output directory is writable
- Close any programs that might have the output PDF open
- Run from a directory you have write access to

## Advanced Configuration

The converter can be customized by modifying `md-to-pdf-puppeteer.js`:

- Page format (A4, Letter, etc.)
- Margins
- Fonts and colors
- Syntax highlighting theme
- Mermaid theme

See the `MarkdownToPdfConverter` class constructor for options.

## Portability

This project is fully portable:

1. **Copy the entire folder** to any machine with Node.js
2. **Run `npm install`** to download dependencies
3. **Start converting** immediately

All dependencies are self-contained in `node_modules`.

## License

MIT

## Support

For issues or questions, see `SETUP-INSTRUCTIONS.md` for detailed setup information.
