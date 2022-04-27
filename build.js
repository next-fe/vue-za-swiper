const shell = require('shelljs')

shell.cd('./packages/vue2')
shell.exec('npm run build', {
  async: true
})

shell.cd('../vue3')
shell.exec('npm run build')

