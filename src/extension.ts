import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs-extra';
import { convertFileToDoc } from './converters/docConverter';
import { convertFileToMarkdown } from './converters/mdConverter';
import { generateFlowchart } from './converters/flowchartGenerator';
import { getCodeFiles } from './utils/fileUtils';
import { ConversionOptions } from './types';

export function activate(context: vscode.ExtensionContext) {
    // Register file conversion command
    const convertFileDisposable = vscode.commands.registerCommand(
        'veetdocs.convertFile', 
        async (uri: vscode.Uri) => {
            await handleConversion(uri, false);
        }
    );

    // Register folder conversion command
    const convertFolderDisposable = vscode.commands.registerCommand(
        'veetdocs.convertFolder', 
        async (uri: vscode.Uri) => {
            await handleConversion(uri, true);
        }
    );

    context.subscriptions.push(convertFileDisposable, convertFolderDisposable);
}

async function handleConversion(uri: vscode.Uri, isFolder: boolean): Promise<void> {
    try {
        const outputFormat = await vscode.window.showQuickPick(
            ['Markdown (.md)', 'Word Document (.docx)', 'Both'],
            { placeHolder: 'Select output format' }
        );

        if (!outputFormat) {
            return;
        }

        const options: Partial<ConversionOptions> = {
            outputFormat: outputFormat.includes('Markdown') ? 'markdown' : 
                         outputFormat.includes('Word') ? 'docx' : 'both',
            includeSourceCode: true,
            includeFlowcharts: true
        };

        const defaultName = isFolder ? 
            'documentation' : 
            `${path.basename(uri.fsPath, path.extname(uri.fsPath))}_documentation`;

        const outputUri = await vscode.window.showSaveDialog({
            filters: {
                'Documents': options.outputFormat === 'markdown' ? ['md'] : 
                           options.outputFormat === 'docx' ? ['docx'] : ['*']
            },
            defaultUri: vscode.Uri.file(path.join(path.dirname(uri.fsPath), defaultName))
        });

        if (!outputUri) {
            return;
        }

        if (isFolder) {
            await convertFolder(uri.fsPath, outputUri.fsPath, options as ConversionOptions);
            vscode.window.showInformationMessage('Folder documentation generated successfully!');
        } else {
            await convertFile(uri.fsPath, outputUri.fsPath, options as ConversionOptions);
            vscode.window.showInformationMessage('File documentation generated successfully!');
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function convertFile(filePath: string, outputPath: string, options: ConversionOptions): Promise<void> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        const fileName = path.basename(filePath);
        const fileExt = path.extname(filePath).toLowerCase();

        const outputs: string[] = [];

        if (options.outputFormat === 'markdown' || options.outputFormat === 'both') {
            const mdContent = await convertFileToMarkdown(content, fileName, fileExt);
            const mdOutput = options.outputFormat === 'both' ? 
                outputPath.replace(path.extname(outputPath), '.md') : outputPath;
            await fs.writeFile(mdOutput, mdContent);
            outputs.push(mdOutput);
        }

        if (options.outputFormat === 'docx' || options.outputFormat === 'both') {
            const docContent = await convertFileToDoc(content, fileName, fileExt);
            const docOutput = options.outputFormat === 'both' ? 
                outputPath.replace(path.extname(outputPath), '.docx') : outputPath;
            await fs.writeFile(docOutput, docContent);
            outputs.push(docOutput);
        }

        if (options.includeFlowcharts) {
            const flowchart = await generateFlowchart(content, fileExt);
            const flowchartPath = outputPath.replace(path.extname(outputPath), '_flowchart.md');
            await fs.writeFile(flowchartPath, flowchart);
            outputs.push(flowchartPath);
        }

        vscode.window.showInformationMessage(`Generated: ${outputs.join(', ')}`);
    } catch (error) {
        throw new Error(`Failed to convert file: ${error instanceof Error ? error.message : String(error)}`);
    }
}

async function convertFolder(folderPath: string, outputPath: string, options: ConversionOptions): Promise<void> {
    try {
        const files = await getCodeFiles(folderPath);
        let allContent = '';

        for (const file of files) {
            const content = await fs.readFile(file, 'utf-8');
            const fileName = path.basename(file);
            allContent += `# ${fileName}\n\n`;
            allContent += '```' + path.extname(file).substring(1) + '\n';
            allContent += content + '\n```\n\n';
        }

        const outputs: string[] = [];

        if (options.outputFormat === 'markdown' || options.outputFormat === 'both') {
            const mdOutput = options.outputFormat === 'both' ? 
                outputPath.replace(path.extname(outputPath), '.md') : outputPath;
            await fs.writeFile(mdOutput, allContent);
            outputs.push(mdOutput);
        }

        if (options.outputFormat === 'docx' || options.outputFormat === 'both') {
            const docOutput = options.outputFormat === 'both' ? 
                outputPath.replace(path.extname(outputPath), '.docx') : outputPath;
            // Implementation for doc conversion would go here
            outputs.push(docOutput);
        }

        vscode.window.showInformationMessage(`Generated: ${outputs.join(', ')}`);
    } catch (error) {
        throw new Error(`Failed to convert folder: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export function deactivate() {}