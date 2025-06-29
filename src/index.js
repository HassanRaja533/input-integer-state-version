// Import the STATE module and initialize the state database
const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools


module.exports = input_integer

let input_id = 0

async function input_integer (opts, protocol) {
    console.log('input_integer in index')
   // Get the sid and state database for this instance
   
    console.log (opts.sid) 
    const { id, sdb } = await get(opts.sid)
    //console.log('sid:', opts.sid, '→ resolved id:', id)

    const on = {
      style: inject
    }

    // Load config from drive/data/opts.json (fallback will provide defaults)
    const config = await sdb.drive.get('data/opts.json')
    //console.log(`Loaded config for "${id}":`, config)

    const { min = 0, max = 1000 } = config
    const name = `input-integr-${input_id++}`

    const notify = protocol({ from: name }, listen)

    const el = document.createElement('div')
    const shadow = el.attachShadow({ mode: 'closed' })

    const input = document.createElement('input')
    input.type = 'number'
    input.min = min
    input.max = max

    input.onkeyup = (e) => handle_onkeyup(e, input, min, max)
    input.onmouseleave = (e) => handle_onmouseleave_and_blur(e, input, min)
    input.onblur = (e) => handle_onmouseleave_and_blur(e, input, min)

    shadow.append(input)

    // Move inject() inside to access shadow
    function inject (data) {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(data)
      shadow.adoptedStyleSheets = [sheet]
    }

    await sdb.watch(onbatch)

    return el

    function listen (message) {
      const { type, data } = message
      if (type === 'update') {
        input.value = data
      }
    }

    function handle_onkeyup (e, input, min, max) {
      const val = Number(e.target.value)
      const val_len = val.toString().length
      const min_len = min.toString().length

      if (val > max) {
        input.value = max
      } else if (val_len === min_len && val < min) {
        input.value = min
      }

      notify({ from: name, type: 'update', data: val })
    }

    function handle_onmouseleave_and_blur (e, input, min) {
      const val = Number(e.target.value)
      if (val < min) input.value = ''
    }

    function onbatch (batch) {
      for (const { type, data } of batch) {
        on[type] && on[type](data)
      }
    }

  } 

// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    drive: {},
    api: fallback_instance,// Used to customize API (like styles or icons)
  }

  function fallback_instance (opts) {
    console.log('make instance:', opts)
    return {
      drive: {
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

        'data/': {
          'opts.json': {
            raw: opts 
          }
        }
      }
    }
  }
}
// Returns the fallback structure for drive datasets like styles and data

