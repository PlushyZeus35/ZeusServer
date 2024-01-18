var express = require('express');
var router = express.Router();
const Notion = require('../helpers/notion')
const JWT = require('../helpers/jsonwebtoken')

/* GET Index page. */
router.get('/',async (req, res) => {
    res.json({status: true});
})

module.exports = router;