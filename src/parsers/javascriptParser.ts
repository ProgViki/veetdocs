import { ParsedCode, FunctionInfo, ClassInfo, VariableInfo, CommentInfo } from '../types';

export function parseJavaScript(content: string): ParsedCode {
    const functions: FunctionInfo[] = [];
    const classes: ClassInfo[] = [];
    const variables: VariableInfo[] = [];
    const imports: string[] = [];
    const comments: CommentInfo[] = [];
    
    const lines = content.split('\n');
    
    // Parse imports
    const importRegex = /(import|from|require)[^;'"]*['"][^'"]+['"]/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
        imports.push(match[0].trim());
    }
    
    // Parse functions
    const functionRegex = /(function\s+(\w+)|const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|let\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|var\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>|async\s+function\s+(\w+))/g;
    while ((match = functionRegex.exec(content)) !== null) {
        const name = match[2] || match[3] || match[4] || match[5] || match[6];
        const lineNumber = getLineNumber(content, match.index);
        
        functions.push({
            name,
            parameters: extractParameters(content, match.index),
            lineNumber,
            documentation: extractDocumentation(content, match.index)
        });
    }
    
    // Parse classes
    const classRegex = /class\s+(\w+)/g;
    while ((match = classRegex.exec(content)) !== null) {
        const lineNumber = getLineNumber(content, match.index);
        
        classes.push({
            name: match[1],
            methods: [],
            properties: [],
            lineNumber,
            documentation: extractDocumentation(content, match.index)
        });
    }
    
    // Parse variables
    const variableRegex = /(const|let|var)\s+(\w+)\s*=/g;
    while ((match = variableRegex.exec(content)) !== null) {
        const lineNumber = getLineNumber(content, match.index);
        
        variables.push({
            name: match[2],
            lineNumber
        });
    }
    
    // Parse comments
    parseComments(content, comments);
    
    return { functions, classes, variables, imports, comments };
}

function extractParameters(content: string, index: number): string[] {
    const remainingContent = content.substring(index);
    const paramMatch = remainingContent.match(/\(([^)]*)\)/);
    if (!paramMatch) {return [];}
    
    return paramMatch[1].split(',').map(p => p.trim()).filter(p => p);
}

function extractDocumentation(content: string, index: number): string {
    const lines = content.substring(0, index).split('\n');
    const currentLine = lines[lines.length - 1];
    const prevLine = lines[lines.length - 2];
    
    if (prevLine && prevLine.trim().startsWith('//')) {
        return prevLine.trim().substring(2).trim();
    }
    
    return '';
}

function parseComments(content: string, comments: CommentInfo[]): void {
    const lines = content.split('\n');
    
    // Parse single-line comments
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//')) {
            comments.push({
                text: trimmed.substring(2).trim(),
                lineNumber: index + 1,
                type: 'line'
            });
        }
    });
    
    // Parse multi-line comments
    const blockCommentRegex = /\/\*[\s\S]*?\*\//g;
    let match;
    while ((match = blockCommentRegex.exec(content)) !== null) {
        const lineNumber = getLineNumber(content, match.index);
        comments.push({
            text: match[0].replace(/\/\*|\*\//g, '').trim(),
            lineNumber,
            type: 'block'
        });
    }
}

function getLineNumber(content: string, index: number): number {
    return content.substring(0, index).split('\n').length;
}