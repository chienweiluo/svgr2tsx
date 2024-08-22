"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
const EOL = "\n";
const program = new commander_1.Command();
program
    .command("svgr <input> <ouput>")
    .name("svgr2tsx")
    .usage("/path/to/svgfiles")
    .action((input, output) => {
    const root = process.cwd();
    const sourceDir = path_1.default.resolve(root, input);
    const outDir = path_1.default.resolve(root, output);
    const configPath = path_1.default.join(__dirname, "./svgrrc.js");
    console.log(`sourceDir : ${sourceDir}`);
    console.log(`outDir : ${outDir}`);
    const command = `svgr --ext tsx --config-file "${configPath}" -d "${outDir}" "${sourceDir}"`;
    console.log(`command : ${command}`);
    shelljs_1.default.exec(command, (code, stdout, stderr) => {
        console.log("svgr Exit code:", code);
        if (code) {
            console.log("svgr stderr:", stderr);
            process.exit(code);
        }
        const dir = fs_1.default.readdirSync(outDir);
        let data = "";
        const importList = [];
        const exportList = [];
        dir.forEach((filename) => {
            console.log(filename);
            const file = path_1.default.parse(filename);
            if (file.base === "index.ts")
                return;
            if (file.base === "index.tsx")
                return;
            const stats = fs_1.default.statSync(path_1.default.join(outDir, filename));
            if (file.ext === ".tsx" && stats.isFile()) {
                data += `export { default as ${file.name} } from './${file.name}'${EOL}`;
            }
            if (stats.isDirectory() &&
                fs_1.default.existsSync(path_1.default.join(outDir, filename, "index.ts"))) {
                importList.push(`import * as ${file.name.toLowerCase()} from './${file.name}'${EOL}`);
                exportList.push(`export const ${file.name} = ${file.name.toLowerCase()}${EOL}`);
            }
        });
        data = importList.join("") + EOL + exportList.join("") + EOL + data;
        fs_1.default.writeFileSync(path_1.default.join(outDir, "index.ts"), data);
        console.log("svgr output:", stdout);
    });
});
