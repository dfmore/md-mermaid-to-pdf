#!/usr/bin/env node

import { resolve, dirname, basename, extname } from 'path';
import { readFile, writeFile } from 'fs/promises';
import matter from 'gray-matter';
import puppeteer from 'puppeteer';
import { createHighlighter } from 'shiki';

/**
 * Parse command line arguments for PDF conversion scripts
 * @param {string} scriptName - Name of the script for usage message
 * @param {string} extraUsageInfo - Additional usage information (optional)
 * @returns {{inputPath: string, outputPath: string}}
 */
export function parseArgs(scriptName, extraUsageInfo = '') {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`Usage: node ${scriptName} <input.md> [output.pdf]`);
    console.log('If output.pdf is not specified, it will be generated in the same directory as input.md');
    if (extraUsageInfo) {
      console.log(extraUsageInfo);
    }
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

/**
 * Common Puppeteer launch arguments for PDF generation
 */
export const PUPPETEER_ARGS = [
  '--no-sandbox', 
  '--disable-setuid-sandbox', 
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu',
  '--disable-web-security',
  '--disable-features=VizDisplayCompositor'
];

/**
 * Common Shiki highlighter language support
 */
export const SHIKI_LANGS = [
  'c', 'python', 'javascript', 'typescript', 'bash', 'json', 'yaml', 
  'markdown', 'ruby', 'sql', 'html', 'css', 'java', 'go', 'rust', 
  'php', 'csharp', 'cpp'
];

/**
 * Common CSS font sizes (to ensure consistency across all scripts)
 */
export const CSS_FONT_SIZES = {
  table: '8pt',           // Document tables (portrait/landscape)
  tableSlides: '9pt',     // Slides tables (slightly larger for presentation)
  codeBlock: '8pt',       // Document code blocks
  codeBlockSlides: '10pt', // Slides code blocks
  inlineCode: '8pt',      // Document inline code
  inlineCodeSlides: '10pt', // Slides inline code
  mermaid: '8pt'          // Mermaid diagram font (consistent across all)
};

/**
 * Generate Mermaid initialization JavaScript code
 * @param {string} comment - Comment describing the initialization context
 * @returns {string} JavaScript code for Mermaid initialization
 */
export function getMermaidInitScript(comment) {
  return `
    // Initialize Mermaid with ${comment}
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
    });`;
}

/**
 * Create walkTokens function for marked configuration
 * Handles code blocks with syntax highlighting and Mermaid diagrams
 * @param {object} highlighter - Shiki highlighter instance
 * @returns {function} walkTokens function for marked
 */
export function createWalkTokens(highlighter) {
  return (token) => {
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
}

/**
 * Initialize Shiki highlighter (shared across all converters)
 * @returns {Promise<object>} Shiki highlighter instance
 */
export async function initHighlighter() {
  console.log('Initializing Shiki highlighter...');
  const highlighter = await createHighlighter({
    themes: ['github-light'],
    langs: SHIKI_LANGS
  });
  console.log('Shiki highlighter ready');
  return highlighter;
}

/**
 * Common document conversion logic (for portrait/landscape)
 * @param {string} markdownPath - Path to markdown file
 * @param {string} outputPath - Path for output PDF
 * @param {object} highlighter - Shiki highlighter instance
 * @param {function} generateHtml - Function to generate HTML from markdown
 * @param {function} htmlToPdf - Function to convert HTML to PDF
 * @returns {Promise<string>} Path to generated PDF
 */
export async function convertDocument(markdownPath, outputPath, highlighter, generateHtml, htmlToPdf) {
  console.log(`Reading markdown file: ${markdownPath}`);
  const markdownContent = await readFile(resolve(markdownPath), 'utf8');
  console.log(`File size: ${markdownContent.length} characters`);
  
  const { data: frontMatter, content } = matter(markdownContent);
  console.log(`Content size after frontmatter: ${content.length} characters`);
  
  const html = await generateHtml(content, frontMatter, highlighter);
  console.log(`Generated HTML size: ${html.length} characters`);
  
  const pdf = await htmlToPdf(html);
  console.log(`Generated PDF size: ${pdf.length} bytes`);
  
  await writeFile(resolve(outputPath), pdf);
  return resolve(outputPath);
}

/**
 * Common HTML to PDF conversion using Puppeteer
 * @param {string} html - HTML content to convert
 * @param {object} options - Conversion options
 * @param {number} options.viewportWidth - Viewport width in pixels
 * @param {number} options.viewportHeight - Viewport height in pixels
 * @param {boolean} options.landscape - Whether PDF should be landscape
 * @param {object} options.margin - PDF margins
 * @param {boolean} options.displayHeaderFooter - Display header/footer
 * @param {boolean} options.printBackground - Print background colors
 * @param {string} options.logMessage - Message to log before PDF generation
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function htmlToPdf(html, options) {
  const {
    viewportWidth,
    viewportHeight,
    landscape,
    margin,
    displayHeaderFooter,
    printBackground,
    logMessage
  } = options;

  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: PUPPETEER_ARGS
  });
  
  try {
    console.log('Creating new page...');
    const page = await browser.newPage();
    
    await page.setViewport({ width: viewportWidth, height: viewportHeight, deviceScaleFactor: 1 });
    
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
    
    console.log(logMessage);
    const pdf = await page.pdf({
      format: 'A4',
      landscape,
      margin,
      displayHeaderFooter,
      printBackground,
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

