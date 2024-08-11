import { Router } from 'express'
import * as userControllers from './user.controllers.js'
import { cheackId } from '../../middleware/finders.middleware.js'
import { authatication } from '../../middleware/authatication.middlewares.js'
import { errorHandler } from '../../middleware/error-handling.js'
import { validationMiddleware } from '../../middleware/validation.middleware.js'
import {  signInShema } from './user.schema.js'

const userRouters = Router()


userRouters.post('/signup',
    validationMiddleware(signInShema),
    errorHandler(userControllers.signUp)
)
userRouters.get('/verfiy-email/:token',userControllers.verfiyEmail)
userRouters.post('/signin',userControllers.signIn)
userRouters.post('/signout',
    errorHandler( authatication()),
    errorHandler(userControllers.signOut)
)




export default userRouters

