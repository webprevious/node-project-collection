const Koa = require('koa')
let app = new Koa()
const cors = require('koa2-cors')
const bodyparser = require('koa-bodyparser')

app.use(cors())

app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],
  formLimit: '20mb'
}))

// 路由引入
const upload = require('./routes/upload.js')

app.use(upload.routes(), upload.allowedMethods())

app.use(require('koa-static')(__dirname + '/public'))

app.listen(9000, function () {
  console.log('server on port 9000')
})

