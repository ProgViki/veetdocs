# {{fileName}} Documentation

**Generated on**: {{generationDate}}  
**Language**: {{language}}  
**Total Functions**: {{functionCount}} | **Total Classes**: {{classCount}}

{{#hasOverview}}
## Overview

{{overview}}
{{/hasOverview}}

{{#hasImports}}
## Imports & Dependencies

{{#imports}}
- `{{.}}`  
{{/imports}}
{{/hasImports}}

{{#hasFunctions}}
## Functions

{{#functions}}
### `{{name}}()`
**Line**: {{lineNumber}}  
{{#parameters}}**Parameters**: {{#.}}`{{.}}`{{^last}}, {{/last}}{{/.}}  
{{/parameters}}
{{#returnType}}**Returns**: `{{returnType}}`  
{{/returnType}}
{{#documentation}}
> {{documentation}}
{{/documentation}}

---
{{/functions}}
{{/hasFunctions}}

{{#hasClasses}}
## Classes

{{#classes}}
### `{{name}}`
**Line**: {{lineNumber}}  
{{#documentation}}
> {{documentation}}
{{/documentation}}

{{#hasMethods}}
#### Methods
{{#methods}}
- **`{{name}}()`** (Line {{lineNumber}})
  - Parameters: {{#parameters}}`{{.}}`{{^last}}, {{/last}}{{/parameters}}
  {{#returnType}}- Returns: `{{returnType}}`{{/returnType}}
{{/methods}}
{{/hasMethods}}

---
{{/classes}}
{{/hasClasses}}

{{#hasVariables}}
## Variables & Constants

{{#variables}}
- **`{{name}}`** (Line {{lineNumber}})
  {{#type}}- Type: `{{type}}`{{/type}}
  {{#value}}- Value: `{{value}}`{{/value}}

{{/variables}}
{{/hasVariables}}

{{#hasComments}}
## Comments

{{#comments}}
> **Line {{lineNumber}}**: {{text}}

{{/comments}}
{{/hasComments}}

{{#hasFlowchart}}
## Flowchart

```mermaid
{{flowchart}}