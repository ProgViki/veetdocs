import * as fs from 'fs-extra';
import * as path from 'path';
import { FileInfo } from '../types';

export async function getCodeFiles(folderPath: string): Promise<string[]> {
    const supportedExtensions = ['.js', '.ts', '.py', '.java', '.c', '.cpp', '.cs', '.php', '.rb', '.go'];
    const files: string[] = [];
    
    await scanDir(folderPath, files, supportedExtensions);
    return files;
}

async function scanDir(dir: string, files: string[], supportedExtensions: string[]): Promise<void> {
    const items = await fs.readdir(dir);
    
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
            await scanDir(fullPath, files, supportedExtensions);
        } else if (supportedExtensions.includes(path.extname(item).toLowerCase())) {
            files.push(fullPath);
        }
    }
}

export async function getFileInfo(filePath: string): Promise<FileInfo> {
    const content = await fs.readFile(filePath, 'utf-8');
    const name = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    return {
        path: filePath,
        name,
        content,
        language: getLanguageFromExtension(ext)
    };
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