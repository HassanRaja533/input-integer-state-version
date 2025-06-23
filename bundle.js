(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (__filename){(function (){
// Import the STATE module and initialize the state database

const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools


module.exports = input_integer

let input_id = 0
// const sheet = new CSSStyleSheet()
// const theme = get_theme()
// sheet.replaceSync(theme)

async function input_integer (opts,protocol) {
  
  // Get the sid and state database for this instance
  const { id, sdb } = await get(opts.sid)

  // This object maps dataset keys to their update handlers (called on changes)

  const on = {
    style: inject
  }


   // Load config from drive/data/opts.json (fallback will provide defaults)
  const config = await sdb.get(`data/${id}.opts.json`)
  
  // Destructure input min/max or default to 0/1000

  const { min = 0, max = 1000 } = config
  const name = `input-integr-${input_id++}`

  // Setup protocol communication with the outside (like parent component)

  const notify = protocol({ from: name }, listen)

  // Create root element and shadow DOM

  const el = document.createElement('div')
  const shadow = el.attachShadow({ mode: 'closed' })

   // Create input element
  const input = document.createElement('input')
  input.type = 'number'
  input.min = min // opts.min
  input.max = max // opts.max
  
  // Bind input events to their handlers

  input.onkeyup = (e) => handle_onkeyup(e, input, min, max)
  input.onmouseleave = (e) => handle_onmouseleave_and_blur(e, input, min)
  input.onblur = (e) => handle_onmouseleave_and_blur(e, input, min)
  
  // Add the input to the shadow DOM

  shadow.append(input)
  //shadow.adoptedStyleSheets = [sheet]
  
  // Watch for updates in drive (e.g., style changes)

  const subs = await sdb.watch(onbatch)

  // Return the main element

  return el

  // Handle incoming messages (e.g., update the input value)

  function listen (message) {
    const { type, data } = message
    if (type === 'update') {
      input.value = data
    }
  }
  

  // ============ Inner functions ============

  // Handle keyup events for live validation
  function handle_onkeyup (e, input, min, max) {
    const val = Number(e.target.value)
    const val_len = val.toString().length // e.target.value.length
    const min_len = min.toString().length

    if (val > max) {
      input.value = max
    }  else if (val_len === min_len && val < min) {
      input.value = input.value = min // 1872
    }

    // Notify parent or subscriber of the updated value
    notify({ from: name, type: 'update', data: val })
  }

  // Handle when mouse leaves input or input loses focus
  function handle_onmouseleave_and_blur (e, input, min) {
    const val = Number(e.target.value)
    if (val < min) input.value = ''
  }
}



  // Injects CSS into shadow DOM using adopted stylesheets

function inject (data) {
    const sheet = new CSSStyleSheet()
    sheet.replaceSync(data)
    shadow.adoptedStyleSheets = [sheet]
  }

    // Triggered whenever a watched dataset is updated

  function onbatch (batch) {
    for (const { type, data } of batch) {
      on[type] && on[type](data)
    }
  }


// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    api: fallback_instance // Used to customize API (like styles or icons)
   
  }
}
// Returns the fallback structure for drive datasets like styles and data
function fallback_instance () {
  return {
    drive: {
      // Style directory with a default theme
      'style/': {
        'theme.css': {
          raw: `
            :host {
              --b: 0, 0%;
              --color-white: var(--b), 100%;
              --color-black: var(--b), 0%;
              --color-grey: var(--b), 85%;
              --bg-color: var(--color-grey);
              --shadow-xy: 0 0;
              --shadow-blur: 8px;
              --shadow-color: var(--color-white);
              --shadow-opacity: 0;
              --shadow-opacity-focus: 0.65;
            }

            input {
              text-align: left;
              align-items: center;
              font-size: 1.4rem;
              font-weight: 200;
              color: hsla(var(--color-black), 1);
              background-color: hsla(var(--bg-color), 1);
              padding: 8px 12px;
              box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
              transition: font-size 0.3s, color 0.3s, background-color 0.3s, box-shadow 0.3s ease-in-out;
              outline: none;
              border: 1px solid hsla(var(--bg-color), 1);
              border-radius: 8px;
            }

            input:focus {
              --shadow-color: var(--color-black);
              --shadow-opacity: var(--shadow-opacity-focus);
              --shadow-xy: 4px 4px;
              box-shadow: var(--shadow-xy) var(--shadow-blur) hsla(var(--shadow-color), var(--shadow-opacity));
            }

            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
              -webkit-appearance: none;
            }
          `
        }
      },

      // Data directory with input configuration for age and birth year
      'data/': {
        'age.opts.json': {
          value: {
            min: 1,
            max: 150
          }
        },
        'birthyear.opts.json': {
          value: {
            min: 1872,
            max: 2025
          }
        }
      }
    },
    
    // No submodules used
    _: {}
  }
}
}).call(this)}).call(this,"/src/index.js")
},{"STATE":2}],2:[function(require,module,exports){
// // src/node_modules/STATE.js

// module.exports = function (filename) {
//   return function (fallback_module) {
//     return {
//       sdb: {
//         watch: async function () {
//           return []
//         }
//       },
//       get: async function () {
//         return {
//           id: Math.random().toString(36).substring(2),
//           sdb: {
//             watch: async function () {
//               return []
//             }
//           }
//         }
//       }
//     }
//   }
// }

},{}],3:[function(require,module,exports){
const hash = '895579bb57e5c57fc66e031377cba6c73a313703'
const prefix = 'https://raw.githubusercontent.com/alyhxn/playproject/' + hash + '/'
const init_url = prefix + 'doc/state/example/init.js'
const args = arguments

fetch(init_url).then(res => res.text()).then(async source => {
  const module = { exports: {} }
  const f = new Function('module', 'require', source)
  f(module, require)
  const init = module.exports
  await init(args, prefix)
  require('./page')
})
},{"./page":4}],4:[function(require,module,exports){
(function (__filename){(function (){
// page.js
const STATE = require('../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)


const input_integer = require('..')

const opts1 = { sid: 'age' }
const opts2 = { sid: 'birthyear' }
const state = {}

function protocol (message, notify) {
  const { from } = message
  state[from] = { value: 0, notify }
  return listen
}

function listen (message) {
  return message
}

async function main () {
  const input1 = await input_integer(opts1, protocol)
  const input2 = await input_integer(opts2, protocol)

  const title = 'My Demo Title'
  const sub_title = 'My Demo Title'

  const page = document.createElement('div')

  page.innerHTML = `
    <h1>${title}</h1>
    <h2>${sub_title}</h2>
    <h3> Enter Your Age</h3>
    <x></x>
    <h3>Enter Your Year of Birth</h3>
    <y></y>
  `

  page.querySelector('x').replaceWith(input1)
  page.querySelector('y').replaceWith(input2)

  document.body.append(page)
}

main()

}).call(this)}).call(this,"/web/page.js")
},{"..":1,"../src/node_modules/STATE":2}]},{},[3]);
