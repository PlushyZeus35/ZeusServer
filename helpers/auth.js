const Auth = {}
const JWT = require('./jsonwebtoken')
const Notion = require('./notion')
const bcrypt = require('bcryptjs')

function hashString (string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(string, salt);
}

function validateHash (hashed, toValidate) {
    return bcrypt.compareSync(toValidate, hashed);
}

Auth.validateUserLogin = async (username, password) => {
    const notionUser = await Notion.retrieveUserByUsername(username);
    if(notionUser.length > 0 && password){
        let targetUser = notionUser[0];
        if(validateHash(targetUser.password, password)){
            const token = JWT.signToken(targetUser.getUserObject());
            return {
                status: 200,
                token,
                user: targetUser.getUserObject()
            }
        }else{
            return{
                status: 400,
                error: 'User not valid'
            }
        }
    }else{
        return {
            status: 400,
            error: 'User not valid'
        }
    }
}

Auth.validateTokenMiddleware = (req, res, next) =>{
    const token = req.headers['authorization'];

    if(!token){
        res.status(403).json({
            status: 403,
            error: 'Token required'
        })
        return;
    }
    try{
        const payload = JWT.verifyToken(token);
        req.user = payload;
        next();
    }catch(error){
        res.status(403).json({
            status: 403,
            error: error.name,
        })
    }
}

Auth.validateUserCreation = async (username, password, email, tags, token) => {
    if(!username || !password || !email)
        return { status: false, error: 'username, password or email not specified'}
    
    if(!token.tags.includes('Admin'))
        return { status: false, error: 'user has not permissions'}

    const notionUser = await Notion.retrieveUserByUsername(username);
    if(notionUser.length > 0)
        return { status: false, error: 'username already exists'}

    return {status: true}
}

Auth.createUser = (username, password, email, tags) => {
    return Notion.createUser(username, hashString(password), email, tags)
}

module.exports = Auth;