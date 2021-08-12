import { Router } from 'express'
import { body } from 'express-validator'

import { User } from '../models'
import * as userController from '../controllers/user'

const userRouter = Router()

userRouter.put('/signup', [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async(value, { req }) => {
        const user = await User.findOne({ where: {email: value} })
        if(user) {
            return Promise.reject('E-Mail address already exists!');
        }
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 })
  ],  userController.signup)

userRouter.post('/login', userController.login)

export default userRouter