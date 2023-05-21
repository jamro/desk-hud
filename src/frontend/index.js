console.log("Hello world!")
const header = document.createElement('h1')
header.innerHTML = 'Hello World!!!'
document.body.appendChild(header)

const reload = document.createElement('a')
reload.innerHTML = 'Reload page'
reload.href = '/'
document.body.appendChild(reload)