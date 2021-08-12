
import { Request, Response, NextFunction } from 'express'
import { Product } from '../../models'
import HttpException from '../../util/httpException'
import authMiddleWare from '../../middlewares/auth'

export const getAll = async (req: Request, res: Response, next: NextFunction): Promise<HttpException|void> => {
    try {
        // Authorization Pass
        const isAuth = authMiddleWare(req)
        if(isAuth instanceof HttpException) {
            throw isAuth
        }

        const products = await Product.findAll()
        res.status(201).json({products:products});
    } catch(err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
    return;
}

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<HttpException|void> => {
    const itemId = req.params.itemId;
    
    try {
        // Authorization Pass
        const isAuth = authMiddleWare(req)
        if(isAuth instanceof HttpException) {
            throw isAuth
        }

        const product = await Product.findByPk(itemId)

        if(!product){
            const error = new HttpException(404, "", new Error('Product not found'));
            throw error;
        }
        res.status(201).json({product:product});
        return;
    }catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
          return err;
    }
}