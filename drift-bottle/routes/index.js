const router = require('koa-router')()
const redis = require('redis')
const uuid = require('node-uuid')

// 瓶子类型
let type = {
  male: 0,
  female: 1
}

let index = Date.now()

// 扔漂流瓶
function throwBottle (bottle, callback) {
  let redisDB = redis.createClient(6379, 'localhost')
  redisDB.set(index, 'test')
  let bottleId = uuid.v4()
  console.log(bottleId)
  // 漂流瓶创建时间
  bottle.time = bottle.time || Date.now()
  // 根据漂流瓶男女类型，male存到0号数据库，female存到1号数据库
  redisDB.select(type[bottle.type], function () {
    // 使用hash类型作为key保留漂流瓶信息
    redisDB.hmset(bottleId, bottle, function (err, value) {
      if (err) {
        return callback({code: 0, msg: '过一会再试试吧'})
      }
      // 设置生存周期
      redisDB.expire(bottleId, 84000, function () {
        // 释放连接
        redisDB.quit()
      })
      // 扔出成功
      callback({code: 1, msg: '恭喜你，瓶子扔出成功'})
      redisDB.hgetall(bottleId, function (err, value) {
        console.log('err', err)
        console.log('value', value)
      })
    })
  })
}

// 捡漂流瓶
function pickBottle (info, callback) {
  // 根据用户性别选择数据库
  redisDB.select(type[info.type], function () {
    // 随机取一个
    redisDB.randomkey(function (err, bottleId) {
      // 出错了
      if (err) {
        return callback({code: 0, msg: '你捞到了一个海星～'})
      }
      // 没有获取到
      if (!bottleId) {
        return callback({code: 0, msg: '你捞到了一个海星～'})
      }
      // 取到了
      redisDB.hgetall(bottleId, function (err, bottle) {
        // 读取瓶子信息失败
        if (err) {
          return callback({code: 0, msg: '这个瓶子破损了～'})
        }
        // 读取成功，删除该瓶子
        redisDB.del(bottleId, function () {
          redisDB.quit()
        })
        // 成功返回信息
        callback({code: 1, msg: bottle})
      })
    })
  })
}

router.get('/', async ctx => {
  await ctx.render('index', {
    title: '漂流瓶'
  })
})

router.post('/throw', async ctx => {
  console.log(ctx.request.body)
  throwBottle(ctx.request.body, function (res) {
    console.log(res)
  })
  ctx.body = {
    code: 0,
    data: '恭喜'
  }
})

router.post('/pick', async ctx => {
  console.log(ctx.request.body)
  pickBottle(ctx.request.body, function (res) {
    ctx.body = {
      code: 1,
      data: '恭喜'
    }
  })
})



module.exports = router