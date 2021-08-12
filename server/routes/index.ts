import { Router } from 'express'
import userRouter from './user'
import productRouter from './product'
import orderRouter from './order'

const router = Router()

router.use('/user', userRouter)
router.use('/product', productRouter)
router.use('/order', orderRouter)

export default router