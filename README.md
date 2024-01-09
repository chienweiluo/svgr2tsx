# SVGR Conversion Script
## Overview
This script is designed to convert SVG files into React TypeScript components. It uses SVGR under the hood to transform SVGs into TSX files, making it easier to integrate SVGs into React projects.

## Requirements
1. Node.js
2. SVGR installed globally or locally in your project

## Usage
Place your SVG files in a designated input directory.

Run the script using the following command:

```
node ./src/index svgr /path/to/svgfiles /path/to/output
```
Replace /path/to/svgfiles with the path to your SVG files and /path/to/output with the path where you want the TSX files to be saved.

The script will convert all SVG files in the specified input directory into React TypeScript components and save them in the output directory.

## Features
Converts SVG files to React TypeScript (.tsx) components.
Automatically generates an index.ts file in the output directory for easy exporting of all components.
Provides console logs for tracking the conversion process.
