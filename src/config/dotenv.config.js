import dotenv from 'dotenv';

dotenv.config();

export default {
    app: {
        PORT:process.env.PORT || 8080
    },
    mongo:{
        MONGO_URL:process.env.MONGO_URL
    }
}