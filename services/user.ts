import { inject, injectable } from 'inversify';
import { IUserModel, IUserRepository } from '../models/Iuser';
import TYPES from '../constant/types';
import jwt from 'jsonwebtoken';

@injectable()
export default class UserService {

  constructor (@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  public async login(user: IUserModel) {
    let userObject = await this.userRepository.User.findOne({email: user.email});
    
    if (!userObject){
      return false;
    }
    if (!userObject.validatePassword(user.password)) {
      return false;
    }
    else {
      userObject.token = userObject.generateJWT();
      return userObject;
    }
  }

  // Creating a new user
  public async createUser(userObject : IUserModel){
    let user = await this.userRepository.User.findOne({
      email: userObject.email
    });

    if(user) {
      // User already exists, error needed.
    }
    else {
      user = await new this.userRepository.User({email: userObject.email});
      user.setPassword(userObject.password);
      user.save();
    }

    return user;
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
        return;
    }

    return this.userRepository.User.deleteOne({_id: id});
  }
  
}