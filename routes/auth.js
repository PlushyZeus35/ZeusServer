var express = require('express');
var router = express.Router();
const Auth = require('../helpers/auth')
const Notion = require('../helpers/notion')
const CONSTANTS = require('../constants')

router.get('/token',async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    res.json(await Auth.validateUserLogin(username, password));
    Notion.createRequestLog(req.ip, CONSTANTS.SERVICES.AUTHENTICATION, username);
})

router.post('/user', Auth.validateTokenMiddleware, async (req, res) => {
    const { username, password, email, tags } = req.body;
    const token = req.headers['authorization'];
    const tagsSplit = tags ? tags.split(';') : [];
    const validation = await Auth.validateUserCreation(username, password, email, tagsSplit, req.user);
    if(validation.status){
        const user = await Auth.createUser(username, password, email, tagsSplit);
        res.json({status: 200, user: user.getUserObject()})
    }else{
        res.json({status: 400, error: validation.error});
    }
})

module.exports = router;