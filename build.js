const shell = require('shelljs')

shell.cd('./vue2')
shell.exec('npm run build', {
  async: true
})

shell.cd('../vue3')
shell.exec('npm run build')

