const fs = require('fs')
const fse = require('fs-extra')
const childProcess = require('child_process')

if (fs.existsSync('./build')) {
  fse.removeSync('./build')
}

if (fs.existsSync('./dist')) {
  fse.removeSync('./dist')
}

// Build server first
childProcess.execSync('babel server -s -D -d dist', { stdio: 'inherit' })

// Run 'react-scripts build' script
childProcess.execSync('react-scripts build', { stdio: 'inherit' })

// Move app build to server/build directory
fse.moveSync('./build', './dist/build', { overwrite: true })