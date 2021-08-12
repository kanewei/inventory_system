import { setProductDefaultInventory, handleProductPreOder } from './redisTool'
import { Product, Order } from '../models'

const DailyProcess = async (): Promise<void> => {
    const products = await Product.findAll()

    const promises = products.map(async (product) => {
        setProductDefaultInventory(product.id, product.defaultInventory)
        const preOderCount = handleProductPreOder(product.id)
        product.currentInventory = product.defaultInventory - preOderCount
        // Update daily inventory
        await product.save()

        // Handle pre-order
        const orders = await Order.findAll({where: {product_id: product.id, arrival_date: null}, order: [['create_at', 'ASC']], limit: preOderCount})
        const orderPromise = orders.map(async (order) => {
            order.arrival_date = new Date()
            await order.save()
        })
        await Promise.all(orderPromise)
    })
    await Promise.all(promises)
}

export {
    DailyProcess
}