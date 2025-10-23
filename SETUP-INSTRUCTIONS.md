# Setup Instructions

## Overview

This project is designed to be simple to set up. The only prerequisite is Node.js - everything else is installed automatically via npm.

## Prerequisites

### Node.js (Required)

You need **Node.js version 16 or higher** installed on your system.

**Check if you have Node.js:**
```bash
node --version
```

If you see a version number (like `v22.16.0`), you're ready to go!

**If you need to install Node.js:**
1. Download from: https://nodejs.org/
2. Choose the LTS (Long Term Support) version
3. Run the installer with default settings
4. Restart your terminal/command prompt
5. Verify: `node --version`

### Internet Connection (Required)

You need internet for:
1. **Initial setup** - To download npm packages (~300MB)
2. **PDF generation** - To load Mermaid.js and fonts from CDN

## Installation

### Step 1: Get the Project

```bash
# If using git
git clone <repository-url>
cd md-mermaid-to-pdf

# Or download and extract the ZIP file, then navigate to the folder
cd C:\Users\moreird\GitHub\md-mermaid-to-pdf
```

### Step 2: Install Dependencies

```bash
npm install
```

This command will:
- Download all required npm packages
- Install Puppeteer (includes Chromium browser ~280MB)
- Set up syntax highlighting (Shiki)
- Install Markdown parser (Marked)
- Install frontmatter parser (Gray-matter)

**Expected output:**
```
added 234 packages in 2m
```

The installation takes a few minutes because it downloads the Chromium browser.

### Step 3: Verify Installation

Test the converter with any markdown file:

```bash
# Create a test file
echo "# Hello World" > test.md

# Convert it
node md-to-pdf-puppeteer.js test.md

# Or use the batch file
md-convert.bat test.md
```

If you see `✅ Successfully converted to PDF: test.pdf`, everything is working!

## What Gets Installed

When you run `npm install`, these packages are downloaded to `node_modules/`:

### Core Dependencies

1. **puppeteer** (^24.25.0) - ~280MB
   - Headless Chrome browser
   - PDF rendering engine
   - Handles HTML to PDF conversion

2. **marked** (^16.4.1) - ~100KB
   - Markdown parser
   - Converts Markdown to HTML
   - Supports GitHub Flavored Markdown (GFM)

3. **shiki** (^3.13.0) - ~15MB
   - Syntax highlighter for code blocks
   - Includes themes and language grammars
   - Professional code formatting

4. **gray-matter** (^4.0.3) - ~50KB
   - YAML frontmatter parser
   - Extracts metadata from Markdown files

**Total size:** ~300MB (mostly Chromium browser)

All dependencies are stored locally in `node_modules/` - nothing is installed globally.

## External Resources (CDN)

During PDF generation, the converter loads these resources from the internet:

1. **Mermaid.js** (~1MB)
   - Source: `https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js`
   - Used for: Rendering diagrams (flowcharts, sequence diagrams, etc.)
   - Cached by browser after first load

2. **Inter Font** (~100KB per weight)
   - Source: `https://fonts.googleapis.com/css2?family=Inter`
   - Used for: Professional typography in PDFs
   - Weights: 400, 500, 600, 700

**Why CDN?** 
- Keeps the project size small
- Always uses latest stable versions
- Standard practice for web rendering

**Offline use:** Not currently supported, but could be added by bundling these files locally.

## Usage After Setup

Once installed, you can convert Markdown files to PDF:

### Windows Batch File (Easiest)
```bash
md-convert.bat your-file.md
```

### Node Script
```bash
node md-to-pdf-puppeteer.js your-file.md
node md-to-pdf-puppeteer.js input.md output.pdf
```

### NPM Script
```bash
npm run convert your-file.md
```

## Troubleshooting

### "node: command not found"

Node.js is not installed or not in your PATH.

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart your terminal
3. Try again

### "Cannot find module 'puppeteer'"

Dependencies are not installed.

**Solution:**
```bash
npm install
```

### "Failed to launch Chrome"

Puppeteer's Chromium browser is corrupted or missing.

**Solution:**
```bash
# Force reinstall Puppeteer
npm install puppeteer --force
```

### PDF generation hangs or fails

Usually a network issue (can't reach CDN).

**Solution:**
1. Check your internet connection
2. Try accessing https://cdn.jsdelivr.net in your browser
3. Check if a firewall is blocking connections

### "Permission denied" or "EACCES" errors

**Solution:**
- Run terminal as administrator (Windows)
- Check folder permissions
- Don't install in system directories

### Slow installation

**This is normal.** Puppeteer downloads a 280MB Chromium browser. On slower connections, this can take 5-10 minutes.

## Updating Dependencies

To update all packages to their latest versions:

```bash
npm update
```

This is safe to do and recommended periodically for security updates.

## Uninstallation

To remove the project:

1. Delete the entire project folder
2. That's it! No global packages or system changes were made.

```bash
# Windows
rmdir /s md-mermaid-to-pdf

# Linux/Mac
rm -rf md-mermaid-to-pdf
```

## System Requirements

### Minimum
- **Node.js**: v16.0.0 or higher
- **RAM**: 512MB available
- **Disk Space**: 400MB (for dependencies)
- **OS**: Windows 10/11, macOS 10.13+, or Linux

### Recommended
- **Node.js**: v18.0.0 or higher (LTS)
- **RAM**: 2GB available
- **Disk Space**: 1GB free
- **Internet**: Stable connection for CDN resources

## Portable Installation

This project is fully portable:

1. **Copy the entire folder** to a USB drive or another computer
2. **Ensure Node.js is installed** on the target machine
3. **Run `npm install`** (only if `node_modules/` is not included)
4. **Start converting**

The `node_modules/` folder can be copied to avoid re-downloading, but it's large (~300MB).

## For Developers

### Project Structure
```
md-mermaid-to-pdf/
├── md-convert.bat             # Windows convenience script
├── md-to-pdf-puppeteer.js    # Main converter (505 lines)
├── package.json               # Dependency configuration
├── package-lock.json          # Locked dependency versions
├── node_modules/              # All dependencies (after npm install)
├── README.md                  # User documentation
├── PROJECT-SUMMARY.md         # Project overview
└── SETUP-INSTRUCTIONS.md      # This file
```

### Modifying the Converter

The converter is in `md-to-pdf-puppeteer.js`. You can customize:
- Page format and margins
- Fonts and colors
- Syntax highlighting theme
- Mermaid theme and configuration
- HTML template structure

See the `MarkdownToPdfConverter` class for options.

## Summary

**What you need:**
- Node.js (v16+)
- Internet connection

**Installation:**
```bash
npm install
```

**Usage:**
```bash
md-convert.bat your-file.md
```

That's it! No complex setup, no system software, no configuration files.
