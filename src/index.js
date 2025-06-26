// Import the STATE module and initialize the state database

const STATE = require('STATE') // Import custom STATE module for managing local state and drive
const statedb = STATE(__filename) // Bind STATE to this module file for namespaced storage
const { sdb, get } = statedb(fallback_module) // Initialize state DB with fallback data and get tools


module.exports = input_integer

let input_id = 0
// const sheet = new CSSStyleSheet()
// const theme = get_theme()
// sheet.replaceSync(theme)

// async function input_integer (opts,protocol) {
  
//   console.log('input_integer in index')
//   // Get the sid and state database for this instance
//   const { id, sdb } = await get(opts.sid)
//   console.log('sid:', input_id)
//   // This object maps dataset keys to their update handlers (called on changes)

//   const on = {
//     style: inject
//   }


//    // Load config from drive/data/opts.json (fallback will provide defaults)
//   const config = await sdb.get(`data/${id}.opts.json`)
//   console.log(`Loaded config for "${id}":`, config)
//   // Destructure input min/max or default to 0/1000

//   const { min = 0, max = 1000 } = config
//   const name = `input-integr-${input_id++}`

//   // Setup protocol communication with the outside (like parent component)

//   const notify = protocol({ from: name }, listen)

//   // Create root element and shadow DOM

//   const el = document.createElement('div')
//   const shadow = el.attachShadow({ mode: 'closed' })

//    // Create input element
//   const input = document.createElement('input')
//   input.type = 'number'
//   input.min = min // opts.min
//   input.max = max // opts.max
  
//   // Bind input events to their handlers

//   input.onkeyup = (e) => handle_onkeyup(e, input, min, max)
//   input.onmouseleave = (e) => handle_onmouseleave_and_blur(e, input, min)
//   input.onblur = (e) => handle_onmouseleave_and_blur(e, input, min)
  
//   // Add the input to the shadow DOM

//   shadow.append(input)
//   //shadow.adoptedStyleSheets = [sheet]
  
//   // Watch for updates in drive (e.g., style changes)

//   const subs = await sdb.watch(onbatch)

//   // Return the main element

//   return el

//   // Handle incoming messages (e.g., update the input value)

//   function listen (message) {
//     const { type, data } = message
//     if (type === 'update') {
//       input.value = data
//     }
//   }
  

//   // ============ Inner functions ============

//   // Handle keyup events for live validation
//   function handle_onkeyup (e, input, min, max) {
//     const val = Number(e.target.value)
//     const val_len = val.toString().length // e.target.value.length
//     const min_len = min.toString().length

//     if (val > max) {
//       input.value = max
//     }  else if (val_len === min_len && val < min) {
//       input.value = input.value = min // 1872
//     }

//     // Notify parent or subscriber of the updated value
//     notify({ from: name, type: 'update', data: val })
//   }

//   // Handle when mouse leaves input or input loses focus
//   function handle_onmouseleave_and_blur (e, input, min) {
//     const val = Number(e.target.value)
//     if (val < min) input.value = ''
//   }
// }



//   // Injects CSS into shadow DOM using adopted stylesheets

// function inject (data) {
//     const sheet = new CSSStyleSheet()
//     sheet.replaceSync(data)
//     shadow.adoptedStyleSheets = [sheet]
//   }

//     // Triggered whenever a watched dataset is updated

//   function onbatch (batch) {
//     for (const { type, data } of batch) {
//       on[type] && on[type](data)
//     }
//   }



async function input_integer (opts, protocol) {
  console.log('input_integer in index')

  try {
    // Get the sid and state database for this instance
    const { id1, sdb } = await get(opts.sid)
    console.log('sid:', opts.sid, '→ resolved id:', id)

    const on = {
      style: inject
    }

    // Load config from drive/data/opts.json (fallback will provide defaults)
    const config = await sdb.get(`data/${id}.opts.json`)
    console.log(`Loaded config for "${id}":`, config)

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

  } catch (error) {
    console.error('❌ Error in input_integer:', error)
    throw error // rethrow in case caller wants to handle it
  }
}



// ============ Fallback Setup for STATE ============

// This fallback_module function is required for STATE initialization
function fallback_module () {
  return {
    api: fallback_instance,// Used to customize API (like styles or icons)
   _: {
       // ✅ You still need `$` here in fallback_module
      }
  }
}
// Returns the fallback structure for drive datasets like styles and data

function fallback_instance () {
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
      _: {}
    }
  
  }