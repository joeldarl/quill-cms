import { controller, httpGet, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import { inject } from 'inversify';
import UserService from '../services/user';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';

@controller('/admin/users')
export class UserController {

    constructor(@inject(TYPES.UserService) private userService: UserService) {}

    @httpGet('/')
    public getUsers(req : Request, res: Response) {
        let users = this.userService.getUsers();
        return res.render('admin/users/read', {users, title: 'Users'});
    }

    @httpGet('/login')
    public getLogin(req : Request, res : Response) {
        return res.render('admin/users/login');
    }

    @httpPost('/login')
    public async login(req : Request, res: Response, next: NextFunction) {
        const userValidate = await this.userService.login(req.body);
        console.log(userValidate);
        if(userValidate) {
            res.cookie('auth', userValidate.token);
            return res.redirect("/admin");
        }
        else {
            return res.redirect("/user/login");
        }
    }

    @httpGet('/logout')
    public getLogout(req : Request, res: Response) {
        res.clearCookie('auth');
        return res.redirect('/admin/users/login');
    }

    @httpGet('/register')
    public getRegister(req: Request, res: Response){
        return res.render('admin/users/register');
    }

    @httpPost('/register')
    public async register(req: Request, res: Response) {
        await this.userService.createUser(req.body);
        return res.redirect('/admin/users/login');
    }

    @httpGet('/:id')
    public getUser(request: Request){
        return this.userService.getUser(request.params.id);
    }

    @httpDelete('/:id')
    public async deleteUser(req: Request, res : Response) {
        await this.userService.deleteUser(req.params.id, req.cookies);
        return res.redirect('/admin/users');
    }
}