import { inject, injectable } from 'inversify';
import { IUserModel, IUserRepository } from '../models/interfaces/Iuser';
import TYPES from '../constant/types';
import jwt from 'jsonwebtoken';
import IUserService from './interfaces/Iuser';
import "reflect-metadata";

@injectable()
export default class UserService implements IUserService {

  constructor (@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async login(user: IUserModel) {
    let userObject = await this.userRepository.User.findOne({email: user.email});
    
    if(!userObject){
      return userObject;
    }
    if (!userObject.validatePassword(user.password)){
      userObject.token = '';
    }
    else {
      userObject.token = userObject.generateJWT();
    }
    return userObject;
  }

  // Creating a new user
  public async createUser(userObject : IUserModel){
    let user = await new this.userRepository.User({email: userObject.email});
    user.setPassword(userObject.password);
    return await user.save();
  };

  public async getUsers() {
    return await this.userRepository.User.find();
  };

  public async getUser(id : string) {
    return await this.userRepository.User.findOne({_id: id});
  }

  public async updateUser(id : string, body : IUserModel) {
    // TODO: Add update user feature.
    return;
  }

  public async deleteUser(id: string, cookies : any) {
    let secret : any = process.env.JWT_SECRET;
    let user = jwt.decode(cookies.auth, secret);

    if (user && user.id == id) {
        return {};
    }

    return this.userRepository.User.deleteOne({_id: id});
  }
  
}