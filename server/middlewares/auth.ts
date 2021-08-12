import { Request } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import HttpException from '../util/httpException'

interface UserData {
  userId: number
  orderToken?: string
}

export default (req: Request): HttpException|UserData => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new HttpException(401, "", new Error('Not authenticated.'));
        return error
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        const error = new HttpException(401, "", new Error('Not authenticated.'));
        return error
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, 'somesupersecretsecret');
    } catch (err) {
      err.statusCode = 500;
      return err
    }
    if (!decodedToken) {
        const error = new HttpException(401, "", new Error('Not authenticated.'));
        return error
    }

    const OrderToken = req.get('OrderToken');

    return {userId:(<JwtPayload>decodedToken).userId as number, orderToken: OrderToken}
}