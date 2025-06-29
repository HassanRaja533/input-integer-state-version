// page.js
const STATE = require('../src/node_modules/STATE')
const statedb = STATE(__filename)
const { sdb, get } = statedb(fallback_module)


const input_integer = require('../src/index')
module.exports = main
const opts1 = { sid: 'age' }
const opts2 = { sid: 'birthyear' }
const state = {}

function protocol (message, notify) {
  const { from } = message
  state[from] = { value: 0, notify }
  return listen
}

function listen (message) {
  console.log(message) 
}
  
const on = {
  // This will handle all incoming value updates
  value: handleValue
}

// This is the core watch handler
function onbatch(batch) {
  console.log('📦 Watch triggered with batch:', batch)
  for (const { type, data } of batch) {
    if (on[type]) {
      on[type](data)
    }
  }
}

// Called when any input module sends a value update
function handleValue(data) {
  console.log(`✅ SID "${data.id}" value is now:`, data.value)
}

  console.log("Before Main function started") // ✅ check if main is triggered
  
async function main () {
  console.log("Main function started") // ✅ check if main is triggered
   const subs = await sdb.watch(onbatch) 
  const input1 = await input_integer(subs[0], protocol)
  const input2 = await input_integer(subs[1], protocol)
  //console.log("Got input elements", input1, input2)

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

  
  console.log("Page appended")

}
 
main()

function fallback_module() {
  return {
    _: {
     '../src/index': {    
        $:'' ,
        0: { value: { min: 5, max: 50 }  },
        1: { value: { min: 2000, max: 2024 } } ,
        mapping: {
          style: 'style'
        }    
      }
    }
  };
}
