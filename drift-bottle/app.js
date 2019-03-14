const Koa = require('koa')
const app = new Koa()
const bodyparser = require('koa-bodyparser')
const path = require('path')
const views = require('koa-views')

// 路由文件加载
const myIndex = require('./routes/index')

// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))

app.use(myIndex.routes(), myIndex.allowedMethods())

app.listen(9999, function () {
  console.log('server is on 9999')
})