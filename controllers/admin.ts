import { controller, httpGet, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import { inject } from 'inversify';
import UserService from '../services/user';
import { Request, Response } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');

@controller('/admin')
export class AdminController {

    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    @httpGet('/', auth.required)
    public getUsers(req : Request, res: Response) {
        let users = this.userService.getUsers();
        return res.render('admin/users/read', {users, title: 'Users'})
    }
}