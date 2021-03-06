/**
 * Created by kisnowsn 2016/9/8.
 */
process.env.NODE_ENV = 'PROD'
const express = require('express')
const path = require('path')
const app = express()
const router = express.Router()
const cwd = process.cwd()
const mockRoutes = require('../data')
const request = require('request')
const config = require('../config')
app.set('views', cwd)

// middleware
app.use(express.static(path.resolve(cwd, 'dist')))
app.use('/', router)
router.get('/', function (req, res) {
  console.log(req.url)
})
// route
mockRoutes(router)

router.get(`${config.cdnPath}*`, function (req, res, next) {
  var filepath = req.url
  filepath = filepath.split('?')[0].replace(`${config.cdnPath}`, '')
  console.log('filepath', filepath)
  res.sendFile(path.join(cwd, 'dist', filepath))
})

router.get('/ga.js', function (req, res) {
  request('https:// 8.163.com/ga.js').pipe(res)
})

router.get('/index.html', function (req, res) {
  console.log(req.url)
  res.sendFile(path.join(cwd, 'dist/index.html'))
})
router.get('/about.html', function (req, res) {
  console.log(req.url, path.join(cwd, 'dist/about.html'))
  res.sendFile(path.join(cwd, 'dist/about.html'))
})
router.get('/active.html', function (req, res) {
  console.log(req.url)
  res.sendFile(path.join(cwd, 'dist/active.html'))
})
// 404
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  console.log(err.message)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

// port
app.listen(80, err => {
  if (err) {
    console.error(err)
  } else {
    console.info('==> Listening on port %s. Open up http://localhost:%s/ in your browser.', 80, 80)
  }
})
