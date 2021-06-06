var express = require('express');
var router = express.Router();
var {PuppeteerService} = require('../services/puppeteer.service')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/pup',async function(req, res, next) {
  console.log('/pup')
  const puppeteer = new PuppeteerService();
  let response = await puppeteer.dooseriesth();
  res.send(response)
});

module.exports = router;
