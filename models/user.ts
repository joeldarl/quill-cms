import { prop, getModelForClass } from '@typegoose/typegoose';
import { IUserRepository } from './interfaces/Iuser';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';
import validator from 'validator';
const crypto = require('crypto');

// @index({ email: 1 }, { unique: true })
class User {
    _id!: ObjectId;
    token!: string;
    password!: string;
    
    @prop({ required: [true, "Email is required."], unique : true, 
        validate: { 
            validator : (value) => {
                return validator.isEmail(value)
            },
            message: 'Email format is invalid.'
        }
    })
    public email!: string;

    @prop({ required: [true, "Password is required."] })
    public hash!: string;

    @prop()
    public salt!: string;

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

    public setPassword(password : string) {
        if(!password)
            return false
        this.salt = crypto.randomBytes(16).toString('hex');
        this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    };
    
    public validatePassword(password : string) {
        const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
        return this.hash === hash;
    };

    public isEmailUnique(email : string) {
        return true;
    }

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