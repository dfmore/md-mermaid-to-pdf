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
- [Usage Methods](#usage-methods)
- [Features](#features)
- [Output Quality](#output-quality)
- [Supported Markdown](#supported-markdown)
- [Technical Details](#technical-details)
- [Troubleshooting](#troubleshooting)
- [Advanced Configuration](#advanced-configuration)

---

## Installation

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Internet connection** - For initial setup and PDF generation

**Check if you have Node.js:**
```bash
node --version
# Should show v16.0.0 or higher
```

**If you need to install Node.js:**
1. Download from https://nodejs.org/
2. Choose the LTS (Long Term Support) version
3. Run the installer with default settings
4. Restart your terminal/Cursor
5. Verify: `node --version`

### Setup Steps

```bash
# 1. Clone or download this project
cd path/to/md-mermaid-to-pdf

# 2. Install dependencies
npm install
```

This installs ~300MB of packages including:
- **puppeteer** (~280MB) - Headless Chrome browser for PDF rendering
- **marked** (~100KB) - Markdown parser with GFM support
- **shiki** (~15MB) - Syntax highlighter with themes
- **gray-matter** (~50KB) - YAML frontmatter parser

The installation takes 2-5 minutes because it downloads a full Chromium browser.

### Verify Installation

```bash
# Create a test file
echo "# Hello World" > test.md

# Convert it
md-convert.bat test.md

# Check for output
# You should see: ✅ Successfully converted to PDF: test.pdf
```

---

## Cursor Integration

Convert any Markdown file to PDF directly from Cursor with one command.

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

## Usage Methods

### Method 1: Windows Batch File (Easiest)

```bash
# Basic usage - creates input.pdf
md-convert.bat input.md

# Specify output path
md-convert.bat input.md output.pdf

# With full paths
md-convert.bat "C:\docs\report.md" "C:\reports\report.pdf"
```

### Method 2: Node Script (Cross-Platform)

```bash
# Basic usage
node md-to-pdf-puppeteer.js input.md

# With custom output
node md-to-pdf-puppeteer.js input.md custom-output.pdf

# Full paths
node md-to-pdf-puppeteer.js "/path/to/input.md" "/path/to/output.pdf"
```

### Method 3: NPM Script

```bash
# Run via package.json script
npm run convert input.md
```

### Method 4: Cursor IDE Task

See [Cursor Integration](#cursor-integration) section above for full details.

---

## Features

- ✅ **Full Markdown Support** - GitHub Flavored Markdown (GFM)
- ✅ **Mermaid Diagrams** - Flowcharts, sequence diagrams, class diagrams, etc.
- ✅ **Syntax Highlighting** - Beautiful code blocks via Shiki
- ✅ **Frontmatter Support** - YAML metadata for title, author, date
- ✅ **Professional Typography** - Inter font family, proper spacing
- ✅ **Standard Format** - A4 portrait with 0.5" margins
- ✅ **Tables & Lists** - Fully supported with proper formatting
- ✅ **Images & Links** - Preserved and functional
- ✅ **No External Software** - Everything installed via npm
- ✅ **Cursor Integration** - One-click PDF generation from IDE
- ✅ **Portable** - Copy to any machine with Node.js

---

## Output Quality

PDFs are generated with professional styling:

### Page Format
- **Size**: A4 portrait (210mm × 297mm)
- **Margins**: 0.5 inches on all sides
- **Line Height**: 1.4 for comfortable reading

### Typography
- **Body Font**: Inter, 11pt, #222222
- **Headings**: Inter Bold/Semi-bold
  - H1: 20pt, bold
  - H2: 16pt, #2d3748
  - H3: 14pt, semi-bold
  - H4: 13pt
  - H5: 12pt
  - H6: 11pt, bold

### Code Blocks
- **Font**: SF Mono (macOS), Consolas (Windows), monospace
- **Size**: 8pt
- **Background**: Light gray (#f6f8fa)
- **Border**: 1px solid #e1e4e8
- **Padding**: 8px
- **Syntax Highlighting**: GitHub Light theme via Shiki

### Mermaid Diagrams
- **Rendering**: High-quality SVG via Mermaid.js
- **Background**: Light gray (#f6f8fa)
- **Alignment**: Centered
- **Theme**: Default Mermaid theme

### Other Elements
- **Tables**: Bordered with alternating row colors
- **Blockquotes**: Left border, gray background
- **Links**: Blue underlined, preserved in PDF
- **Images**: Embedded with proper scaling

---

## Supported Markdown

### Mermaid Diagrams

All Mermaid diagram types are supported:

\`\`\`mermaid
graph LR
    A[Start] --> B[Process]
    B --> C[Decision]
    C -->|Yes| D[End]
    C -->|No| B
\`\`\`

\`\`\`mermaid
sequenceDiagram
    Alice->>Bob: Hello Bob
    Bob-->>Alice: Hi Alice
\`\`\`

\`\`\`mermaid
classDiagram
    Animal <|-- Dog
    Animal : +int age
    Animal : +String name
    Animal: +makeSound()
\`\`\`

### Code Blocks with Syntax Highlighting

Supported languages include: JavaScript, TypeScript, Python, Bash, JSON, YAML, Markdown, C, and many more.

\`\`\`javascript
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const total = calculateTotal([
  { name: 'Item 1', price: 10 },
  { name: 'Item 2', price: 20 }
]);
console.log(`Total: $${total}`);
\`\`\`

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

### YAML Frontmatter

```yaml
---
title: My Document
author: John Doe
date: 2024-01-15
description: A comprehensive guide
---
```

The frontmatter is parsed and can be used to set document metadata.

### Standard Markdown Elements

#### Headings
```markdown
# H1 Heading
## H2 Heading
### H3 Heading
#### H4 Heading
##### H5 Heading
###### H6 Heading
```

#### Text Formatting
- **Bold** with `**text**`
- *Italic* with `*text*`
- `Inline code` with \`code\`
- ~~Strikethrough~~ with `~~text~~`

#### Lists

**Unordered:**
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

**Ordered:**
1. First item
2. Second item
   1. Nested item
   2. Another nested item
3. Third item

#### Tables

```markdown
| Feature | Supported | Notes |
|---------|-----------|-------|
| Tables | ✅ | Full support |
| Alignment | ✅ | Left, center, right |
| Cell merging | ❌ | Not supported |
```

#### Blockquotes

```markdown
> This is a blockquote.
> It can span multiple lines.
>
> And multiple paragraphs.
```

#### Links and Images

```markdown
[Link text](https://example.com)
![Alt text](image.png)
![Image with title](image.png "Image Title")
```

---

## Technical Details

### Architecture

**Conversion Pipeline:**
1. Read Markdown file with `fs.promises`
2. Parse frontmatter with `gray-matter`
3. Convert Markdown to HTML with `marked`
4. Apply syntax highlighting with `shiki`
5. Inject Mermaid.js for diagram rendering
6. Render HTML to PDF with `puppeteer`
7. Write PDF to disk

### Dependencies

**Local (installed via npm):**
- **puppeteer** (^24.25.0) - Headless Chrome (~280MB)
- **marked** (^16.4.1) - Markdown parser (~100KB)
- **shiki** (^3.13.0) - Syntax highlighter (~15MB)
- **gray-matter** (^4.0.3) - Frontmatter parser (~50KB)

**External (loaded from CDN during PDF generation):**
- **Mermaid.js** (~1MB) - From jsDelivr CDN
- **Inter Font** (~100KB per weight) - From Google Fonts

### Internet Requirements

Internet connection is required for:
1. **Initial setup** - Downloading npm packages
2. **PDF generation** - Loading CDN resources (Mermaid.js, fonts)

**Why CDN?**
- Keeps project size small (~300MB vs ~400MB)
- Always uses latest stable library versions
- Standard practice for web rendering
- Browser caching improves performance

**Offline support:** Not currently available, but could be added by bundling CDN resources locally.

### Project Structure

```
md-mermaid-to-pdf/
├── md-convert.bat             # Windows batch script
├── md-to-pdf-puppeteer.js    # Main converter (505 lines)
├── package.json               # Dependencies & scripts
├── package-lock.json          # Locked versions
├── README.md                  # This file
└── node_modules/              # Dependencies (after npm install)
    ├── puppeteer/             # ~280MB
    ├── marked/
    ├── shiki/
    └── gray-matter/
```

### Performance

**Typical conversion times:**
- Small file (< 10KB): 1-2 seconds
- Medium file (10-100KB): 2-5 seconds
- Large file (100KB-1MB): 5-15 seconds
- Very large file (> 1MB): 15-60 seconds

**Factors affecting speed:**
- File size
- Number of code blocks (syntax highlighting)
- Number of Mermaid diagrams
- Number of images
- Internet connection speed (for CDN resources)

---

## Troubleshooting

### "node: command not found"

**Problem:** Node.js is not installed or not in your PATH.

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal/Cursor
3. Verify: `node --version`

### "Cannot find module 'puppeteer'"

**Problem:** Dependencies are not installed.

**Solution:**
```bash
npm install
```

### "Failed to launch Chrome"

**Problem:** Puppeteer's Chromium browser is corrupted or missing.

**Solution:**
```bash
# Force reinstall Puppeteer
npm install puppeteer --force
```

### PDF generation hangs or fails

**Problem:** Network issue preventing CDN resource loading.

**Solution:**
1. Check your internet connection
2. Try accessing https://cdn.jsdelivr.net in your browser
3. Check if a firewall is blocking connections
4. Verify proxy settings if behind corporate firewall

### "Permission denied" or file access errors

**Problem:** Insufficient permissions or file is locked.

**Solution:**
- Ensure output directory is writable
- Close any programs with the PDF open
- Run terminal as administrator (Windows)
- Check folder permissions
- Don't install in system directories

### Slow installation

**This is normal.** Puppeteer downloads a 280MB Chromium browser. On slower connections, this can take 5-10 minutes.

**Solution:**
- Be patient during first install
- Use faster internet connection if available
- Or download node_modules from another machine

### Cursor task doesn't work

**Problem:** Task configuration path is incorrect.

**Solution:**
1. Check the path in your tasks.json
2. Use absolute paths: `C:/Users/.../md-to-pdf-puppeteer.js`
3. Use forward slashes `/` even on Windows
4. Verify file exists at specified path

### Mermaid diagrams not rendering

**Problem:** Network issue or Mermaid syntax error.

**Solution:**
1. Check internet connection (Mermaid loads from CDN)
2. Validate Mermaid syntax at https://mermaid.live
3. Check console output for errors

---

## Advanced Configuration

### Customizing PDF Output

Edit `md-to-pdf-puppeteer.js` to customize the `MarkdownToPdfConverter` class:

```javascript
const converter = new MarkdownToPdfConverter({
  format: 'Letter',  // Change from A4 to Letter
  margin: {
    top: '1in',
    right: '1in',
    bottom: '1in',
    left: '1in'
  },
  displayHeaderFooter: true,
  headerTemplate: '<div style="font-size: 10px;">Header</div>',
  footerTemplate: '<div style="font-size: 10px;">Page <span class="pageNumber"></span></div>'
});
```

### Changing Fonts

Modify the CSS in the HTML template (line ~90 in md-to-pdf-puppeteer.js):

```css
body {
  font-family: 'Roboto', sans-serif;  /* Change from Inter */
  font-size: 12pt;  /* Change from 11pt */
}
```

Don't forget to update the Google Fonts import.

### Custom Syntax Highlighting Theme

Change the Shiki theme (line ~26):

```javascript
this.highlighter = await createHighlighter({
  themes: ['github-dark'],  // Change from github-light
  langs: ['javascript', 'python', 'bash', ...]
});
```

Available themes: `github-light`, `github-dark`, `monokai`, `nord`, `dracula`, etc.

### Mermaid Theme

Modify the Mermaid initialization (line ~360):

```javascript
mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',  // Change from default
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  }
});
```

---

## System Requirements

### Minimum
- **Node.js**: v16.0.0 or higher
- **RAM**: 512MB available
- **Disk Space**: 400MB (for dependencies)
- **OS**: Windows 10/11, macOS 10.13+, or Linux
- **Internet**: Required for setup and PDF generation

### Recommended
- **Node.js**: v18.0.0 or higher (LTS)
- **RAM**: 2GB available
- **Disk Space**: 1GB free
- **Internet**: Stable broadband connection
- **CPU**: Multi-core for faster PDF generation

---

## Portability

This project is fully portable:

1. **Copy the entire folder** to any location or machine
2. **Ensure Node.js is installed** on the target machine
3. **Run `npm install`** (only if node_modules is not included)
4. **Start converting**

**Including node_modules:**
- Pro: No need to run npm install on new machine
- Con: Folder size is ~300MB
- Note: Works across same OS/architecture only

---

## Updating

### Update Dependencies

```bash
# Update all packages to latest versions
npm update

# Check for outdated packages
npm outdated

# Update specific package
npm install puppeteer@latest
```

### Update the Converter

If the converter script is updated:
1. Download the new `md-to-pdf-puppeteer.js`
2. Replace the old file
3. No need to reinstall dependencies

---

## Uninstallation

To remove the project completely:

```bash
# Windows
cd ..
rmdir /s md-mermaid-to-pdf

# macOS/Linux
cd ..
rm -rf md-mermaid-to-pdf
```

No global packages or system changes are made, so this removes everything.

---

## License

MIT

---

## Credits

Built with:
- [Puppeteer](https://pptr.dev/) - Headless Chrome automation
- [Marked](https://marked.js.org/) - Markdown parser
- [Shiki](https://shiki.matsu.io/) - Syntax highlighter
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) - Frontmatter parser
- [Mermaid](https://mermaid.js.org/) - Diagram rendering
- [Inter Font](https://rsms.me/inter/) - Typography

---

## Support

For issues, questions, or feature requests:
1. Check this README for solutions
2. Review the [Troubleshooting](#troubleshooting) section
3. Verify your Node.js version: `node --version`
4. Test with a simple markdown file first
5. Check internet connectivity for CDN resources
