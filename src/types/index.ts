export interface ParsedCode {
    functions: FunctionInfo[];
    classes: ClassInfo[];
    variables: VariableInfo[];
    imports: string[];
    comments: CommentInfo[];
}

export interface FunctionInfo {
    name: string;
    parameters: string[];
    returnType?: string;
    lineNumber: number;
    documentation?: string;
}

export interface ClassInfo {
    name: string;
    methods: FunctionInfo[];
    properties: VariableInfo[];
    lineNumber: number;
    documentation?: string;
}

export interface VariableInfo {
    name: string;
    type?: string;
    value?: string;
    lineNumber: number;
}

export interface CommentInfo {
    text: string;
    lineNumber: number;
    type: 'line' | 'block';
}

export interface ConversionOptions {
    includeSourceCode: boolean;
    includeFlowcharts: boolean;
    outputFormat: 'markdown' | 'docx' | 'both';
}

export interface FileInfo {
    path: string;
    name: string;
    content: string;
    language: string;
}