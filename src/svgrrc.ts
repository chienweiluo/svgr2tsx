/* eslint-disable */
module.exports = {
  icon: true,
  replaceAttrValues: {
    '#000': 'currentColor',
    '#000000': 'currentColor',
    black: 'currentColor',
  },
  svgoConfig: {
    plugins: {
      removeXMLNS: true,
    },
  },
  prettier: false,
  // @ts-ignore
  template({ types: t, template }, opts, { imports, componentName, props, jsx, exports }) {
    const typeScriptTpl = template.smart({ plugins: ['typescript'] })
    jsx.openingElement.name.name = 'Svg'
    jsx.closingElement.name.name = 'Svg'
    return typeScriptTpl.ast`
    import React from 'react'

    const ${componentName} = (props: React.ComponentPropsWithRef('svg')) => ${jsx}
    export default ${componentName}
  `
  },
}
