import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../../models'
import { requestValidator, passwordValidator } from '../../util/validator'
import HttpException from '../../util/httpException'
import { generateOrderToken } from '../../util/redisTool'

export const signup = async (req: Request, res: Response, next: NextFunction): Promise<HttpException|void> => {
    try{
        const errors = requestValidator(req);

        if(errors.length !== 0){
            const error = new HttpException(422, "", new Error('Validation failed.'))
            throw error;
        }

        const email = req.body.email;
        const password = req.body.password;

        const isExist = await User.findOne({where: {email: email}});
        if(isExist){
            const error = new HttpException(422, "", new Error('User Exist'));
            throw error;
        }

        const user = new User({
            email: email,
            password: password
        });
        
        const result = await user.save();

        res.status(201).json({message: 'User created!', userId: result.id});
    }catch(err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
          return err;
    }
}

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email = req.body.email;
    const password = req.body.password;

    try{
        const user = await User.findOne({where: {email: email}})

        if(!user){
            const error = new HttpException(404, "", new Error('User not found'));
            throw error;
        }

        const isMatched = await passwordValidator(user, password);

        if(!isMatched){
            const error = new HttpException(400, "", new Error('Wrong password'));
            throw error;
        }

        const token = jwt.sign(
            {
              email: user.email,
              userId: user.id.toString()
            },
            'somesupersecretsecret',
            { expiresIn: '1h' }
          );

        const orderToken = generateOrderToken(user.id)

          res.status(201).json({token: token, orderToken: orderToken, userId: user.id.toString()});
          return;
    }catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
          return err;
    }
}