#!/usr/bin/env node

import { marked } from 'marked';
import puppeteer from 'puppeteer';
import matter from 'gray-matter';
import { readFile, writeFile } from 'fs/promises';
import { resolve, dirname, basename, extname } from 'path';
import { createHighlighter } from 'shiki';

class MarkdownToPdfConverter {
  constructor(options = {}) {
    this.options = {
      format: 'A4',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      displayHeaderFooter: false,
      printBackground: true,
      ...options
    };
    this.highlighter = null;
    this.markedConfigured = false;
  }

  async initHighlighter() {
    if (!this.highlighter) {
      console.log('Initializing Shiki highlighter...');
      this.highlighter = await createHighlighter({
        themes: ['github-light'],
        langs: ['c', 'python', 'javascript', 'typescript', 'bash', 'json', 'yaml', 'markdown', 'ruby', 'sql', 'html', 'css', 'java', 'go', 'rust', 'php', 'csharp', 'cpp']
      });
      console.log('Shiki highlighter ready');
    }
  }

  async convert(markdownPath, outputPath) {
    console.log(`Reading markdown file: ${markdownPath}`);
    const markdownContent = await readFile(resolve(markdownPath), 'utf8');
    console.log(`File size: ${markdownContent.length} characters`);
    
    const { data: frontMatter, content } = matter(markdownContent);
    console.log(`Content size after frontmatter: ${content.length} characters`);
    
    await this.initHighlighter();
    
    const html = await this.generateHtml(content, frontMatter);
    console.log(`Generated HTML size: ${html.length} characters`);
    
    const pdf = await this.htmlToPdf(html);
    console.log(`Generated PDF size: ${pdf.length} bytes`);
    
    await writeFile(resolve(outputPath), pdf);
    return resolve(outputPath);
  }

  async generateHtml(markdown, frontMatter = {}) {
    const highlighter = this.highlighter;
    
    // Configure marked only once to avoid stacking
    if (!this.markedConfigured) {
      const walkTokens = (token) => {
        if (token.type === 'code') {
          const code = token.text;
          const language = token.lang || 'text';
          
          if (language === 'mermaid') {
            token.type = 'html';
            token.raw = `<div class="mermaid">${code}</div>`;
            token.text = `<div class="mermaid">${code}</div>`;
            return;
          }
          
          try {
            const html = highlighter.codeToHtml(code, {
              lang: language,
              theme: 'github-light'
            });
            // Convert to html token
            token.type = 'html';
            token.raw = html;
            token.text = html;
          } catch (e) {
            console.warn(`Failed to highlight ${language}, using plain code:`, e.message);
            // Leave as default code block
          }
        }
      };
      
      marked.use({ walkTokens, gfm: true, breaks: false });
      this.markedConfigured = true;
    }
    
    const htmlContent = marked.parse(markdown);
    
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${frontMatter.title || 'Document'}</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10.6.1/dist/mermaid.min.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 0.5in;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #222222;
      margin: 0;
      padding: 0;
      background: white;
      width: 100%;
      overflow-x: hidden;
    }
    
    .container {
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: 'Inter', sans-serif;
      color: #1a1a1a;
      margin: 1.5em 0 0.5em 0;
      page-break-after: avoid !important;
      break-after: avoid-page !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }
    
    h1 { 
      font-size: 20pt; 
      font-weight: 700; 
      margin-top: 0; 
      page-break-before: auto;
    }
    h2 { 
      font-size: 16pt; 
      font-weight: 600; 
      color: #2d3748; 
      page-break-before: auto;
    }
    h3 { 
      font-size: 14pt; 
      font-weight: 600; 
      page-break-before: auto;
    }
    h4 { 
      font-size: 13pt; 
      font-weight: 500; 
    }
    
    p { 
      margin: 0 0 0.8em 0; 
      orphans: 3;
      widows: 3;
    }
    
    ul, ol { 
      margin: 0.5em 0; 
      padding-left: 1.2em; 
      page-break-inside: avoid;
    }
    li { 
      margin: 0.2em 0; 
      page-break-inside: avoid;
    }
    
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #e2e8f0;
      padding: 6px 10px;
      text-align: left;
      vertical-align: top;
    }
    
    th {
      background: #f7fafc;
      font-weight: 600;
    }
    
    /* Code blocks with syntax highlighting */
    pre.shiki {
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 8pt;
      padding: 0.8em;
      margin: 0.8em 0;
      border-radius: 4px;
      overflow-x: auto;
      white-space: pre-wrap;
      page-break-inside: avoid;
      break-inside: avoid;
      border: 1px solid #e2e8f0;
      /* Critical: preserve colors when printing to PDF */
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }
    
    /* Inline code (not in pre blocks) */
    :not(pre) > code {
      font-family: 'SF Mono', Monaco, Consolas, monospace;
      font-size: 8pt;
      background: #f1f3f4;
      padding: 2px 4px;
      border-radius: 3px;
    }
    
    /* Inline code within headings should scale with heading size */
    h1 code, h2 code, h3 code, h4 code, h5 code, h6 code {
      font-size: 0.85em;
      background: #f1f3f4;
    }
    
    .mermaid {
      text-align: center;
      margin: 1.5em 0;
      padding: 1em;
      background: #f8f9fa;
      border-radius: 6px;
      overflow-x: auto;
      page-break-inside: avoid;
      break-inside: avoid;
      page-break-before: avoid;
      max-height: 800px;
    }
    
    .mermaid svg {
      max-width: 100%;
      max-height: 750px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    
    /* Force maximum font size in Mermaid diagrams */
    .mermaid svg text,
    .mermaid svg tspan,
    .mermaid svg foreignObject {
      font-size: 8pt !important;
      max-font-size: 8pt !important;
    }
   
    strong { font-weight: 600; }
    em { font-style: italic; }
    
    blockquote {
      border-left: 4px solid #e2e8f0;
      padding-left: 1em;
      margin: 1em 0;
      color: #666;
      page-break-inside: avoid;
    }
    
    /* Better page break handling */
    .page-break {
      page-break-before: always;
      break-before: page;
    }
    
    /* Avoid orphans and widows */
    p, li {
      orphans: 3;
      widows: 3;
    }
    
    /* Ensure content doesn't break awkwardly */
    :is(h1,h2,h3,h4,h5,h6) {
      break-after: avoid-page !important;
      break-inside: avoid !important;
    }

    :is(h1,h2,h3,h4,h5,h6)
      + :is(p, ul, ol, pre, table, blockquote, .mermaid) {
      break-before: avoid-page !important;
    }

    /* Ensure proper spacing between sections */
    h1, h2, h3, h4, h5, h6 {
      clear: both;
    }
  </style>
</head>
<body>
  <div class="container">
    ${htmlContent}
  </div>
  <script>
    // Initialize Mermaid with better settings for A4 portrait
    mermaid.initialize({ 
      startOnLoad: true, 
      theme: 'default',
      themeVariables: {
        fontFamily: 'Inter, sans-serif'
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true
      },
      sequence: {
        useMaxWidth: true
      },
      gantt: {
        useMaxWidth: true
      }
    });
    
      // Ensure proper spacing
      const mermaidElements = document.querySelectorAll('.mermaid');
      mermaidElements.forEach((element, index) => {
        console.log('Processing Mermaid diagram', index + 1);
        // Add a small delay to ensure proper rendering
        setTimeout(() => {
          const svg = element.querySelector('svg');
          if (svg) {
            svg.style.maxWidth = '100%';
            svg.style.height = 'auto';
          }
        }, 100);
      });
    });
  </script>
</body>
</html>`;
  }

  async htmlToPdf(html) {
    console.log('Launching Puppeteer...');
    const browser = await puppeteer.launch({ 
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor'
      ]
    });
    
    try {
      console.log('Creating new page...');
      const page = await browser.newPage();
      
      // Set viewport optimized for A4 portrait
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
      
      console.log('Setting content...');
      await page.setContent(html, { 
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: 30000
      });
      
      console.log('Waiting for fonts to load...');
      await Promise.race([
        page.evaluateHandle('document.fonts.ready'),
        new Promise(resolve => setTimeout(resolve, 10000))
      ]);
      
      console.log('Waiting for Mermaid diagrams to render...');
      try {
        await page.waitForFunction(() => {
          const mermaidElements = document.querySelectorAll('.mermaid');
          if (mermaidElements.length === 0) return true;
          
          return Array.from(mermaidElements).every(el => {
            const svg = el.querySelector('svg');
            return svg && svg.children.length > 0;
          });
        }, { 
          timeout: 30000,
          polling: 1000
        });
        console.log('All Mermaid diagrams rendered successfully');
      } catch (e) {
        console.log('Mermaid rendering timeout, proceeding anyway:', e.message);
      }
      
      // Clean up any potential formatting issues
      await page.evaluate(() => {
        // Remove any empty elements that might cause blank pages
        const emptyElements = document.querySelectorAll('p:empty, div:empty, h1:empty, h2:empty, h3:empty, h4:empty, h5:empty, h6:empty');
        emptyElements.forEach(el => {
          if (el.textContent.trim() === '') {
            el.remove();
          }
        });
        
        // Ensure proper spacing between elements
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, ul, ol, pre, .mermaid');
        elements.forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.marginTop === '0px' && style.marginBottom === '0px') {
            el.style.marginTop = '1em';
            el.style.marginBottom = '1em';
          }
        });
      });
      
      // Additional wait to ensure everything is stable
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('Generating clean A4 portrait PDF...');
      const pdf = await page.pdf({
        format: 'A4',
        landscape: false,
        margin: this.options.margin,
        displayHeaderFooter: this.options.displayHeaderFooter,
        printBackground: this.options.printBackground,
        tagged: true,
        outline: true,
        preferCSSPageSize: true,
        omitBackground: false
      });
      
      console.log('PDF generation complete');
      return pdf;
    } finally {
      await browser.close();
    }
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: node md-to-pdf-puppeteer.js <input.md> [output.pdf]');
    console.log('If output.pdf is not specified, it will be generated in the same directory as input.md');
    process.exit(1);
  }
  
  // Normalize the input path - handle both forward and backward slashes
  let inputPath = args[0];
  
  // Convert backslashes to forward slashes for consistent handling
  inputPath = inputPath.replace(/\\/g, '/');
  
  let outputPath = args[1];
  
  // If no output path specified, generate one based on input
  if (!outputPath) {
    const inputDir = dirname(inputPath);
    const inputBase = basename(inputPath, extname(inputPath));
    outputPath = resolve(inputDir, `${inputBase}.pdf`);
  }
  
  return { inputPath, outputPath };
}

// Main execution
async function main() {
  try {
    const { inputPath, outputPath } = parseArgs();
    
    console.log(`Converting: ${inputPath} -> ${outputPath}`);
    
    const converter = new MarkdownToPdfConverter({
      format: 'A4',
      margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' },
      displayHeaderFooter: false,
      printBackground: true
    });
    
    const resultPath = await converter.convert(inputPath, outputPath);
    console.log(`✅ Successfully converted to PDF: ${resultPath}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

// Always run main when script is executed
main();

