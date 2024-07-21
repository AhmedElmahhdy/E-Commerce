import { Router } from 'express'
import * as usercontroolers from './user.controllers.js'

const userRouters = Router()

userRouters.post('/signup',usercontroolers.signUp)
userRouters.get('/verfiy-email/:token',usercontroolers.verfiyEmail)


export default userRouters

