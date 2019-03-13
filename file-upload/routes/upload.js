const router = require('koa-router')()
const multer = require('koa-multer')

// 上传文件配置
let storage = multer.diskStorage({
  //文件保存路径  
  destination: function (req, file, cb) {  
    cb(null, './public/upload/')  
  },
  // 修改文件名称  
  filename: function (req, file, cb) {  
    cb(null, file.originalname)
  } 
})

//加载配置  
let upload = multer({ storage: storage })
//路由  
router.post('/upload', upload.single('file'), async (ctx, next) => {
  ctx.body = {
    code: 0,
    data: 'success'
  }
})

router.get('/test', async ctx => {
  ctx.body = `<form action="http://localhost:9000/getTest" method="post">
  <p>First name: <input type="text" name="fname" /></p>
  <p>Last name: <input type="text" name="lname" /></p>
  <input type="submit" value="Submit" />
</form>`
})

router.get('/file', async ctx => {
  ctx.body = `<form action="http://localhost:9000/upload" method="post" enctype="multipart/form-data">
  <p>选择文件: <input type="file" name="file" /></p>
  <input type="submit" value="Submit" />
</form>`
})

router.post('/getTest', async ctx => {
  ctx.body = {
    code: 1,
    data: ctx.request.body
  }
})

module.exports = router