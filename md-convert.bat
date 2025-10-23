@echo off
REM Markdown to PDF Converter Batch Script
REM Usage: md-convert.bat <input.md> [output.pdf]

setlocal

if "%~1"=="" (
    echo Usage: md-convert.bat ^<input.md^> [output.pdf]
    echo.
    echo Converts a Markdown file to PDF with Mermaid diagram support
    echo If output path is not provided, PDF will be created in same directory as input
    exit /b 1
)

REM Get the directory where this batch file is located
set SCRIPT_DIR=%~dp0

REM Run the converter
node "%SCRIPT_DIR%md-to-pdf-puppeteer.js" %*
