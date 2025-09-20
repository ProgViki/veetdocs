import * as path from 'path';
import { ParsedCode } from '../types';

export async function convertFileToMarkdown(content: string, fileName: string, fileExt: string): Promise<string> {
    const parsedData = parseCode(content, fileExt);
    return generateMarkdown(parsedData, fileName, content, fileExt);
}

function parseCode(content: string, fileExt: string): ParsedCode {
    switch (fileExt) {
        case '.js':
        case '.ts':
            return parseJavaScript(content);
        case '.py':
            return parsePython(content);
        case '.java':
            return parseJava(content);
        default:
            return { functions: [], classes: [], variables: [], imports: [], comments: [] };
    }
}

function parseJavaScript(content: string): ParsedCode {
    const functions: any[] = [];
    const classes: any[] = [];
    const variables: any[] = [];
    const imports: string[] = [];
    const comments: any[] = [];
    
    // Simple regex parsing (in real implementation, use proper AST parser)
    const functionRegex = /(function\s+(\w+)|const\s+(\w+)\s*=\s*\([^)]*\)\s*=>|async\s+function\s+(\w+))/g;
    const classRegex = /class\s+(\w+)/g;
    const variableRegex = /(const|let|var)\s+(\w+)\s*=/g;
    const importRegex = /(import|require)[^;]+/g;
    const commentRegex = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;
    
    let match;
    while ((match = functionRegex.exec(content)) !== null) {
        functions.push({
            name: match[2] || match[3] || match[4],
            parameters: [],
            lineNumber: getLineNumber(content, match.index)
        });
    }
    
    while ((match = classRegex.exec(content)) !== null) {
        classes.push({
            name: match[1],
            lineNumber: getLineNumber(content, match.index)
        });
    }
    
    while ((match = variableRegex.exec(content)) !== null) {
        variables.push({
            name: match[2],
            lineNumber: getLineNumber(content, match.index)
        });
    }
    
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[0]);
    }
    
    while ((match = commentRegex.exec(content)) !== null) {
        comments.push({
            text: match[0],
            lineNumber: getLineNumber(content, match.index),
            type: match[0].startsWith('//') ? 'line' : 'block'
        });
    }
    
    return { functions, classes, variables, imports, comments };
}

function getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
}

function generateMarkdown(parsedData: ParsedCode, fileName: string, originalContent: string, fileExt: string): string {
    return `# ${fileName} Documentation

## Overview
Generated documentation for ${fileName}

## Imports
${parsedData.imports.map(i => `- ${i}`).join('\n')}

## Functions
${parsedData.functions.map(f => `- **${f.name}()** (line ${f.lineNumber})`).join('\n')}

## Classes
${parsedData.classes.map(c => `- **${c.name}** (line ${c.lineNumber})`).join('\n')}

## Variables
${parsedData.variables.map(v => `- ${v.name} (line ${v.lineNumber})`).join('\n')}

## Comments
${parsedData.comments.map(c => `- ${c.text.replace(/\n/g, ' ')} (line ${c.lineNumber})`).join('\n')}

## Source Code
\`\`\`${getLanguageFromExtension(fileExt)}
${originalContent}
\`\`\`
`;
}

function getLanguageFromExtension(fileExt: string): string {
    const map: {[key: string]: string} = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.py': 'python',
        '.java': 'java',
        '.c': 'c',
        '.cpp': 'cpp',
        '.cs': 'csharp',
        '.php': 'php',
        '.rb': 'ruby',
        '.go': 'go'
    };
    return map[fileExt] || 'text';
}

// Placeholder functions for other languages
function parsePython(content: string): ParsedCode {
    // Implement Python parsing logic
    return { functions: [], classes: [], variables: [], imports: [], comments: [] };
}

function parseJava(content: string): ParsedCode {
    // Implement Java parsing logic
    return { functions: [], classes: [], variables: [], imports: [], comments: [] };
}