module.exports = class User{
    constructor(id, username, password, email, tags, reqInPeriod, reqLimit){
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.tags = tags;
        this.reqInPeriod = reqInPeriod;
        this.reqLimit = reqLimit;
    }

    getUserObject(){
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            tags: this.tags,
            reqInPeriod: this.reqInPeriod,
            reqLimit: this.reqLimit
        }
    }
}