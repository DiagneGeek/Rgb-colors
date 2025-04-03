const validCssPropName = (name) => ({
  bg: 'background',
  fs: 'font-size',
  fw: 'font-weight',
  ff: 'font-family',
  tc: 'color',
  ls: 'letter-spacing',
  radius: 'border-radius',
  justify: 'justify-content',
  items: 'align-items',
  shadow: 'box-shadow',
  m: 'margin',
  p: 'padding',
  dis: 'display',
  w: 'width',
  h: 'height',
  pos: 'position',
  'pos-b': 'bottom',
  'pos-t': 'top',
  'pos-l': 'left',
  'pos-r': 'right',
  size: ['width', 'height'],
  mx: ['margin-left', 'margin-right'],
  my: ['margin-top', 'margin-bottom'],
  mt: 'margin-top',
  mb: 'margin-bottom',
  ml: 'margin-left',
  mr: 'margin-right',
  px: ['padding-left', 'padding-right'],
  py: ['padding-top', 'padding-bottom'],
  pl: 'padding-left',
  pr: 'padding-right',
  pt: 'padding-top',
  pb: 'padding-bottom',
  'txt-a': 'text-align',
  'txt-deco': 'text-decoration',
  'border-b': 'border-bottom',
  'min-h': 'min-height',
  'max-h': 'max-height',
  'min-w': 'min-width',
  'max-w': 'max-width',
  'cols': 'grid-template-columns',
  'rows': 'grid-template-rows',
  'flex-d': 'flex-direction',
  'bord-w': 'border-width',
  'bord-c': 'border-color'
})[name] || name;

const validCssPropValue = (value, el, diCssConfig) => {
  if (value.includes('[') && diCssConfig && diCssConfig.variables) {
    let variables = diCssConfig.variables
    for (let v of Object.keys(variables)) {
      value = replaceAll(value, `[${v}]`, variables[v])
    }
    if (value.includes('[')) {
      return err(`${value.slice(value.indexOf('[')+1, value.indexOf(']')).trim()} is not defined on diCssConfig.variables`)
    }
  }
  
  value = replaceAll(value, '_', ' ').trim()
  
  if (value.includes('(this.childLen)')) {
    value = value.replace('(this.childLen)', el.children.length)
  }
  
  if (value.includes('linear(')) return value.replace('linear(', 'linear-gradient(')
  
  if (value.includes('radial(')) return value.replace('radial(', 'radial-gradient(')
  
  return {
    full: '100%',
    'scr-x': '100vw',
    'scr-y': '100svh',
    between: 'space-between',
    around: 'space-around',
    '1/2': '50%',
    '1/3': '33%',
    '1/4': '25%',
    'col': 'column',
    'col-r': 'column-reverse',
    'row-r': 'row-reverse',
    'sm': diCssConfig?.sm || '0.875rem',
    'lg': diCssConfig?.lg || '1.125rem',
    'xl': diCssConfig?.xl || '1.25rem',
  } [value] || value
}


const useDStyle = (el, input, diCssConfig = null) => {
  let styles = input.split(' ')
  let output = {}
  for (let style of styles) {
    let isSpecial = false;
    [isSpecial, output] = useSpecials(style, output, diCssConfig,el)
    if (isSpecial) continue
    let styleOutput = {}
    
    if (!style.includes(':')) return err(`${style} is not valid`)
    
    let [name, value] = style.split(':')
    if (!name.trim() || !value.trim()) {
      return err(`${style} is not valid`)
    }
    
    if (name == 'snippet') {
      if (!diCssConfig.snippets[value]) return err(`the Snippet "${value}" is not defined.`);
      output = {
        ...output,
        ...useDStyle(el, diCssConfig.snippets[value], config)
      }
      continue
    }
    
    value = replaceAll(value, '_', ' ').trim()
    name = validCssPropName(name)
    value = validCssPropValue(value, el, diCssConfig)
    if (typeof name == 'object') {
      for (let prop of name) {
        if (!CSS.supports(prop, value) && !value.startsWith('--')) return err(`The ${name} property or the ${value} is not recognized!`);
        styleOutput[prop] = value
      }
    } else {
      if (!CSS.supports(name, value) && !value.startsWith('--')) return err(`The ${name} property or the ${value} value is not recognized!`);
      styleOutput[name] = value
    }
    output = { ...output, ...styleOutput }
  }
  
  return output
}

const useSpecials = (target, output, config, el) => {
  let isSpecial = true
  const specials = {
    flex: 'display',
    grid: 'display',
    inline: 'display',
    block: 'display',
    hidden: 'visibility',
    shadow: { 'box-shadow': `0.3px 0.3px 2px ${config?.variables?.primary || config?.variables?.contrast || config?.variables?.secondary || "black"}` },
    border: { 'border': `solid 1px ${config?.variables?.primary || config?.variables?.contrast || config?.variables?.secondary || "black"}` },
    'inline-flex': 'display',
    'inline-block': 'display',
    'center': { 'align-items': 'center', 'justify-content': 'center' }
  }
  
  if (target.includes('&')) {
    const [eff, action] = target.split('&')
    if (eff == 'md') {
      if (window.innerWidth >=768 && window.innerWidth <= 1024) {
        output = {...output, ...useDStyle(el, action, config)}
      }
    }
    return [true, output]
  }
  
  
  if (specials[target]) {
    const value = specials[target]
    if (typeof value == 'object') {
      for (let prop of Object.keys(value)) {
        output[prop] = value[prop]
      }
    } else {
      output[value] = target
    }
  } else {
    isSpecial = false
  }
  
  return [isSpecial, output]
}

const dgCss = {
  update: (name, newVal) => this[name] = newVal
}

const initObserver = (config) => {
  const observer = new MutationObserver((mutationsList) => {
    mutationsList.forEach((mutation) => {
      if (mutation.type === "childList") {
        if (!mutation.addedNodes) return
        for (let node of mutation.addedNodes) {
          if (node.nodeType == 3 || !node.attributes) continue
          if (node.hasAttribute('di-style')) {
            let input = node.getAttribute('di-style')
            Object.assign(node.style, useDStyle(node, input, config));
          }
        }
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true })
}

const init = (config = null) => {
  if (config && config.variables) {
    for (let v of Object.keys(config.variables)) {
      config.variables[v] = replaceAll(config.variables[v], '_', ' ').trim()
    }
  }
  dgCss.config = config
  initObserver(config)
  assignGlobalStyle(config)
  document.querySelectorAll("[di-style]").forEach(el => {
    if (el.tagName == 'SCRIPT') return
    const input = el.getAttribute('di-style').trim()
    if (input == '') return
    Object.assign(el.style, useDStyle(el, input, config));
  })
}

dgCss.init = init

const assignGlobalStyle = (config) => {
  if (config && config.globals) {
    for (let selecter of Object.keys(config.globals)) {
      document.querySelectorAll(selecter).forEach(el => {
        if (el.tagName == 'SCRIPT') return
        Object.assign(el.style, useDStyle(el, config.globals[selecter], config))
      })
    }
  }
}



const useConditions = (eff, style, el) => {
  if (eff == 'hover') {
    el.addEventListener('mouseenter', () => {
      
    })
  }
}

//         <<<<<<<<<<  UTILITIES  >>>>>>>>>>>

function replaceAll(str, from, to) {
  if (!str || from == undefined || to == undefined) {
    throw new SyntaxError(`something is wrong on ${str}`)
  }
  str = str.replace(from, to)
  if (str.includes(from)) str = replaceAll(str, from, to)
  return str
}

function err(message) {
  console.log('%c' + 'diCss: ' + message, 'font-weight:700; color:transparent; -webkit-background-clip: text; background-image: linear-gradient(to right, red, blue)')
}

export default dgCss