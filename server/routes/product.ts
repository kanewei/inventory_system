import { Router } from 'express'
import * as productController from '../controllers/product'

const productRouter = Router()

productRouter.get('/', productController.getAll)
productRouter.get('/:id', productController.getById)

export default productRouter