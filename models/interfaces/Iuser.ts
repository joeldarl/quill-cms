import { ModelType } from '@typegoose/typegoose';

export default interface IUser {
    email: string;
    hash: string;
    salt: string;
    token: string;
    password: string;
    generateJWT: () => string;
    setPassword: (password : string) => void;
    validatePassword: (password : string) => boolean;
}

export type IUserModel = ModelType<IUser>;

export interface IUserRepository {
    User: IUserModel;
}