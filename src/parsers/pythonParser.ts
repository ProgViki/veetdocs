import { ParsedCode, FunctionInfo, ClassInfo, VariableInfo, CommentInfo } from '../types';

export function parseJava(content: string): ParsedCode {
    const functions: FunctionInfo[] = [];
    const classes: ClassInfo[] = [];
    const variables: VariableInfo[] = [];
    const imports: string[] = [];
    const comments: CommentInfo[] = [];
    
    const lines = content.split('\n');
    
    // Parse imports
    const importRegex = /^import\s+[\w.*]+;/;
    lines.forEach((line) => {
        if (importRegex.test(line.trim())) {
            imports.push(line.trim());
        }
    });
    
    // Parse functions/methods
    const methodRegex = /(public|private|protected|static|\s) +[\w\<\>\[\]]+\s+(\w+)\s*\([^)]*\)\s*(?:\{?|[^;])/;
    lines.forEach((line, index) => {
        const match = line.match(methodRegex);
        if (match && !line.trim().endsWith(';')) {
            functions.push({
                name: match[2],
                parameters: extractJavaParameters(line),
                lineNumber: index + 1,
                documentation: extractJavaDocumentation(content, index)
            });
        }
    });
    
    // Parse classes
    const classRegex = /^class\s+(\w+)/;
    lines.forEach((line, index) => {
        const match = line.match(classRegex);
        if (match) {
            classes.push({
                name: match[1],
                methods: [],
                properties: [],
                lineNumber: index + 1,
                documentation: extractJavaDocumentation(content, index)
            });
        }
    });
    
    // Parse comments
    parseJavaComments(content, comments);
    
    return { functions, classes, variables, imports, comments };
}

function extractJavaParameters(line: string): string[] {
    const paramMatch = line.match(/\(([^)]*)\)/);
    if (!paramMatch) {return [];}
    
    return paramMatch[1].split(',').map(p => {
        const parts = p.trim().split(' ');
        return parts[parts.length - 1]; // Get just the parameter name
    }).filter(p => p);
}

function extractJavaDocumentation(content: string, lineIndex: number): string {
    const lines = content.split('\n');
    let documentation = '';
    
    for (let i = lineIndex - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line.startsWith('/**')) {
            break;
        } else if (line.startsWith('*')) {
            documentation = line.substring(1).trim() + '\n' + documentation;
        } else if (line.startsWith('//')) {
            documentation = line.substring(2).trim();
            break;
        } else if (line) {
            break;
        }
    }
    
    return documentation.trim();
}

function parseJavaComments(content: string, comments: CommentInfo[]): void {
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