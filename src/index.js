import app from "./app.js";
import { PORT } from './config.js'

import { createClient } from 'redis';

const client = createClient({
    host: 'localhost',
    //host: 'myredis.pohiql.ng.0001.use1.cache.amazonaws.com',
    port: 6379
})

//client.on('error',(err)=> console.log(err.message))

const startup = async()=>{
    await client.connect()
    app.listen(PORT)
    console.log('Server running on port', PORT);
}
startup()

export {client}