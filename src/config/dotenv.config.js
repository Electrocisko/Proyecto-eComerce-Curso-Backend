import dotenv from 'dotenv';

let aux = process.env.NODE_ENV+'.env'

dotenv.config({
    path: aux
});

export default {
    app: {
        PORT:process.env.PORT || 8080,
        NODE_ENV: process.env.NODE_ENV || 'development',
        HOST: process.env.HOST || '127.0.0.1',
        LOGS: process.env.LOGS || 'silly'
    },
    mongo:{
        MONGO_URL:process.env.MONGO_URL
    }
}