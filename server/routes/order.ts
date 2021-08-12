import { Router } from 'express'
import * as orderController from '../controllers/order'

const orderRouter = Router()

orderRouter.put('/order/:id', orderController.order)
orderRouter.put('/preorder/:id', orderController.preOrder)
orderRouter.get('/order/orders', orderController.getOrders)

export default orderRouter