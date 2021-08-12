import {expect} from 'chai';
import sinon from 'sinon';
import { Request, Response,NextFunction } from 'express'

import * as userController from '../../server/controllers/user'
import * as validator from '../../server/util/validator'
import {User} from '../../server/models';
import dbInit from '../../server/db/init';

describe('User authentication', () => {
    before(async function(done){
        dbInit()
        const user = new User({
            email: 'test@test.com',
            password: '123123'
        })
        await user.save()
        done();
    })

    describe('User sign up', function(){
        it('User sign up success', function(done){
            const req = {
                body: {
                    id: '1',
                    email: '123@test.com', 
                    password: '123123',
                }
            };
    
            const res = {
                statusCode: 500,
                status: function(code:number){
                    this.statusCode = code | 500;
                    return this;
                }
            };
            const next = {}
    
            const stubValidator = sinon.stub(validator, 'requestValidator')
            stubValidator.returns([]);
    
            userController.signup(req as Request, res as Response, next as NextFunction).then(() => {
                expect(res.statusCode).to.equal(201);
                done();
            });
            
            stubValidator.restore();
        });
    
        it('User sign up validation failed', function(done){
            
            const stubValidator = sinon.stub(validator, 'requestValidator')
            stubValidator.returns([{
                location: 'body',
                param: "",
                value: "any",
                msg: "any",
                nestedErrors: undefined
            }]);

            const req = {}
            const res = {}
            const next = {}
    
            userController.signup(req as Request, res as Response, next as NextFunction).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);
            })
            .then(() => {
                done();
            });

            stubValidator.restore();
        });

        it('Sign up email exist', function(done){
            const req = {
                body: {
                    id: '1',
                    email: 'test@test.com',
                    password: '123123'
                }
            };
            const res = {}
            const next = {}
    
            userController.signup(req as Request, res as Response, next as NextFunction).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 422);
            })
            .then(() => {
                done();
            })
        });
    })

    describe('User login', function(){
        it('User email not found', function(done){
            const req = {
                body: {
                    email: 'failtest@test.com'
                }
            };
            const res = {}
            const next = {}
    
            userController.login(req as Request, res as Response, next as NextFunction).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 401);
                done();
            })
        });

        it('User password not matched', function(done){
            const req = {
                body: {
                    id: '1',
                    email: 'test@test.com',
                    password: '456456'
                }
            };
            const res = {}
            const next = {}
            
            const stubValidator = sinon.stub(validator, 'passwordValidator')
            stubValidator.returns(Promise.resolve(false));

            userController.login(req as Request, res as Response, next as NextFunction).then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 401);
            })
            .then(() => {
                done();
                stubValidator.restore();
            });

        });

        it('User login success', function(done){
            const req = {
                body: {
                    id: '1',
                    email: 'test@test.com',
                    password: '123123'
                }
            };

            const res = {
                statusCode: 500,
                status: function(code:number){
                    this.statusCode = code;
                    return this;
                }
            };
            const next = {}

            const stubValidator = sinon.stub(validator, 'passwordValidator')
            stubValidator.returns(Promise.resolve(true));

            userController.login(req as Request, res as Response, next as NextFunction).then(() => {
                expect(res.statusCode).to.be.equal(201);
            })
            .then(() => {
                done();
                stubValidator.restore();
            });
        })
    })
   
    after(function(done) {
        User.destroy({})
            .then(() => {
                done();
            });
    });
})