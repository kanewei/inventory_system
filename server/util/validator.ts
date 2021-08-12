import check from 'express-validator';
import bcrypt from 'bcryptjs';

import { Request } from 'express'
import { User } from '../models'

const requestValidator = (req:Request): check.ValidationError[] => {
    //console.log(req)
    const errors = check.validationResult(req);
    if(!errors.isEmpty()){
        return errors.array();
    }

    return [];
}

const passwordValidator = (user:User, password:string): Promise<boolean> => {
    const isMatched = bcrypt.compare(password, user.password).then((result: boolean) => {
        return result;
    });

    return isMatched;
}

export  {
    requestValidator,
    passwordValidator
}