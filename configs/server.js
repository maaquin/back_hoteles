'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import apiLimiter from '../src/middlewares/validar-cant-peticiones.js'
import authRoutes from '../src/auth/auth.routes.js'
import hotelRoutes from '../src/hotels/hotels.routes.js'
import roomRoutes from '../src/rooms/rooms.routes.js'
import eventRoutes from '../src/events/events.routes.js'
import settingsRoutes from '../src/settings/settings.routes.js'
import serviceRoutes from '../src/servicesHasUsers/servicesUsers.routes.js'

import { dbConnection } from './mongo.js'

class Server{
    constructor(){
        this.app = express()
        this.port = process.env.PORT
        this.authPath = '/hotels/v1/auth'
        this.hotelPath = '/hotels/v1/hotel'
        this.roomPath = '/hotels/v1/room'
        this.eventPath = '/hotels/v1/event'
        this.settingsPath = '/hotels/v1/settings'
        this.servicePath = '/hotels/v1/services'

        this.middlewares()
        this.conectarDB()
        this.routes()
    }

    async conectarDB(){
        await dbConnection()
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}))
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(helmet())
        this.app.use(morgan('dev'))
        this.app.use(apiLimiter)
    }

    routes(){
        this.app.use(this.authPath , authRoutes);
        this.app.use(this.hotelPath, hotelRoutes);
        this.app.use(this.roomPath, roomRoutes);
        this.app.use(this.eventPath, eventRoutes);
        this.app.use(this.settingsPath, settingsRoutes);
        this.app.use(this.servicePath, serviceRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port)
        })
    }
}

export default Server