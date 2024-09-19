import { Router } from 'express'
import * as userControllers from './user.controllers.js'
import {  signInShema } from './user.schema.js'
import {checkUser , validationMiddleware,authatication,errorHandler} from '../../middleware/middlewares-index.js'

const userRouters = Router()


userRouters.post('/signup',
    validationMiddleware(signInShema),
    errorHandler(userControllers.signUp)
)
userRouters.get('/verfiy-email/:token',userControllers.verfiyEmail)
.post('/signin',userControllers.signIn)
.post('/signout',
    errorHandler( authatication()),
    errorHandler(userControllers.signOut)
)  
.post('/send-otp',
    checkUser(), 
    errorHandler(userControllers.sendOtp)
)




export default userRouters

