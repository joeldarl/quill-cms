import IUser, { IUserModel } from "../../models/interfaces/Iuser";

export default interface IUserService {
    login(user: IUserModel) : Promise<any>;
    getUser(id : string) : Promise<any>;
    getUsers() : Promise<object[]>;
    createUser(postObject : IUserModel) : Promise<object>;
    updateUser(id : string, postObject : IUserModel) : Promise<void>;
    deleteUser(id: string, cookies : any) : Promise<any>;
}