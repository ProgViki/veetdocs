import { convertFileToMarkdown } from './mdConverter';

export async function convertFileToDoc(content: string, fileName: string, fileExt: string): Promise<string> {
    // For now, we'll just convert to Markdown and return as is
    // In a real implementation, you would convert to DOCX format
    return convertFileToMarkdown(content, fileName, fileExt);
}