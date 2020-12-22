import { prop, getModelForClass } from '@typegoose/typegoose';
import { instanceMethod } from 'typegoose';
import { IUserRepository } from './interfaces/Iuser';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';
const crypto = require('crypto');

class User {
    _id!: ObjectId;
    token!: string;
    password!: string;
    
    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public hash!: string;

    @prop({ required: true })
    public salt!: string;

    @instanceMethod
    public generateJWT (){
        const today = new Date();
        const expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + 60);
        const secret : any = process.env.JWT_SECRET;
    
        return jwt.sign({
            email: this.email,
            id: this._id,
            exp: expirationDate.getTime() / 1000,
        }, secret);
    };

    @instanceMethod
    public setPassword(password : string) {
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    };
    
    @instanceMethod
    public validatePassword(password : string) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
    };

    toAuthJSON = () => {
        return {
            _id: this._id,
            email: this.email,
            token: this.generateJWT(),
        };
    };
}

@injectable()
export default class UserRepository implements IUserRepository {
    public User = getModelForClass(User);
}