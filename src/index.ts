import path from 'path'
import program from 'commander'
import fs from 'fs'
import shelljs from 'shelljs'

const EOL = '\n'

program
  .command('svgr <input> <ouput>')
  .name('svgr')
  .usage('/path/to/svgfiles')
  .action((input: string, output: string) => {
    const root = process.cwd()
    const sourceDir = path.resolve(root, input)
    const outDir = path.resolve(root, output)
    const configPath = path.join(__dirname, './svgrrc.js')

    console.log(`sourceDir : ${sourceDir}`)
    console.log(`outDir : ${outDir}`)
    const command = `svgr --ext tsx --config-file "${configPath}" -d "${outDir}" "${sourceDir}"`
    console.log(`command : ${command}`)
    shelljs.exec(command, (code: number, stdout: string, stderr: string) => {
      console.log('svgr Exit code:', code)
      if (code) {
        console.log('svgr stderr:', stderr)
        process.exit(code)
      }
      const dir = fs.readdirSync(outDir)
      let data = ''
      const importList: string[] = []
      const exportList: string[] = []
      dir.forEach(filename => {
        console.log(filename)
        const file = path.parse(filename)
        if (file.base === 'index.ts') return
        if (file.base === 'index.tsx') return
        const stats = fs.statSync(path.join(outDir, filename))
        if (file.ext === '.tsx' && stats.isFile()) {
          data += `export { default as ${file.name} } from './${file.name}'${EOL}`
        }
        if (stats.isDirectory() && fs.existsSync(path.join(outDir, filename, 'index.ts'))) {
          importList.push(`import * as ${file.name.toLowerCase()} from './${file.name}'${EOL}`)
          exportList.push(`export const ${file.name} = ${file.name.toLowerCase()}${EOL}`)
        }
      })
      data = importList.join('') + EOL + exportList.join('') + EOL + data
      fs.writeFileSync(path.join(outDir, 'index.ts'), data)
      console.log('svgr output:', stdout)
    })
  })
