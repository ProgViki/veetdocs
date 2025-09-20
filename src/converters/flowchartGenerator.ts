export async function generateFlowchart(content: string, fileExt: string): Promise<string> {
    let flowchartCode = '';
    
    switch (fileExt) {
        case '.js':
        case '.ts':
            flowchartCode = generateJsFlowchart(content);
            break;
        case '.py':
            flowchartCode = generatePythonFlowchart(content);
            break;
        default:
            flowchartCode = generateGenericFlowchart(content);
    }

    return `# Flowchart

\`\`\`mermaid
flowchart TD
${flowchartCode}
\`\`\`
`;
}

function generateJsFlowchart(content: string): string {
    const functionCalls: string[] = [];
    const functionRegex = /(\w+)\([^)]*\)/g;
    let match;
    
    while ((match = functionRegex.exec(content)) !== null) {
        if (!['console', 'log', 'require', 'import', 'exports', 'module'].includes(match[1])) {
            functionCalls.push(match[1]);
        }
    }
    
    let flowchart = 'Start --> Main;\n';
    functionCalls.forEach((call, index) => {
        flowchart += `Main --> ${call}${index};\n`;
        flowchart += `${call}${index}[${call} function];\n`;
    });
    flowchart += 'Main --> End;';
    
    return flowchart;
}

function generatePythonFlowchart(content: string): string {
    // Implement Python-specific flowchart generation
    return 'Start --> Main;\nMain --> End;';
}

function generateGenericFlowchart(content: string): string {
    // Implement generic flowchart generation
    return 'Start --> Main;\nMain --> End;';
}