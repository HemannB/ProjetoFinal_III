const { exec } = require('child_process')

console.log('Iniciando processo...')

const react = exec('npm run start', { windowsHide: false })

react.stdout.on('data', (data) => {
  console.log(`React: ${data}`)
  if (data.includes('Compiled successfully')) {
    console.log('⚡ React pronto! Iniciando Electron...')
    const electron = exec('npm run electron', { windowsHide: false })
    
    electron.stdout.on('data', (data) => console.log(`Electron: ${data}`))
    electron.stderr.on('data', (data) => console.error(`Electron Error: ${data}`))
  }
})

react.stderr.on('data', (data) => console.error(`React Error: ${data}`))