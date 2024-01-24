require('dotenv').config();
module.exports = {
    TOKENS: {
        NOTION: process.env.NOTION_API_KEY
    },
    NOTION_DATABASES: {
        USERS: process.env.NOTION_USERS_DBID,
        REQUESTS: process.env.NOTION_REQUESTS_DBID,
        FINANCE: process.env.NOTION_FINANCE_DBID
    },
    ENVIRONMENT: process.env.ZEUS_SERVER_ENV,
    JWT: {
        SECRET: process.env.JWT_SECRET,
        ALGORITHM: process.env.JWT_ALG,
        EXPIRATION: process.env.JWT_EXPIRATION,
    },
    FILES: {
        MAX_SIZE: 50
    }
}