import { Op } from 'Sequelize'
import HttpException from '../../util/httpException'
import { Request, Response, NextFunction } from 'express'
import { Product, Order } from '../../models'
import authMiddleWare from '../../middlewares/auth'
import { checkOrderToken, checkProductInventory, setProductPreOderInventory } from '../../util/redisTool'

export const order = async (req: Request, res: Response, next: NextFunction): Promise<HttpException|void>  => {
    const itemId = req.params.itemId;

    try{
        // Authorization Pass
        const isAuth = authMiddleWare(req)
        if(isAuth instanceof HttpException) {
            throw isAuth
        }

        // check order token is valid
        if(!checkOrderToken(isAuth.userId, isAuth.orderToken)) {
            const err = new HttpException(401, "", new Error('OrderToken Invalid'));
            throw err
        }

        // check product inventory
        if(!checkProductInventory(itemId)) {
            const err = new HttpException(400, "", new Error('Order product fail'));
            throw err
        }

        const product = await Product.findOne({where: {id: itemId, currentInventory: {[Op.gt]:0}}})
        if(!product) {
            const err = new HttpException(400, "", new Error('Product not found'));
            throw err
        }

        product.currentInventory--
        const porductSave = await product.save()
        if(!porductSave) {
            const err = new HttpException(400, "", new Error('Order product fail'));
            throw err
        }

        const order = new Order({
            user_id: isAuth,
            product_id: itemId,
            arrival_date: new Date()
        });
        
        const result = await order.save();
        res.status(201).json({message: 'Order created!', userId: result.user_id});
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
    return
}

export const preorder = async (req: Request, res: Response, next: NextFunction): Promise<HttpException|void>  => {
    const itemId = req.params.itemId;

    try{
        // Authorization Pass
        const isAuth = authMiddleWare(req)
        if(isAuth instanceof HttpException) {
            throw isAuth
        }

        if(!setProductPreOderInventory(itemId)) {
            const err = new HttpException(400, "", new Error('Product pre-order fail'));
            throw err
        }

        // The arrival data will be filled when product is ordered
        const order = new Order({
            user_id: isAuth,
            product_id: itemId,
            arrival_date: ""
        });
        
        const result = await order.save();
        res.status(201).json({message: 'Order created!', userId: result.user_id});
    }
    catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
    return
}

export const getOrders = async (req: Request, res: Response, next: NextFunction): Promise<HttpException|void>  => {
    try{
        // Authorization Pass
        const isAuth = authMiddleWare(req)
        if(isAuth instanceof HttpException) {
            throw isAuth
        }
        const orders = await Order.findAll({where: {user_id: isAuth.userId}})
        res.status(201).json({orders:orders});
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
}