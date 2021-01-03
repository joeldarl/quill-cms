import { controller, httpGet, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import { inject } from 'inversify';
import IUserService from '../services/interfaces/Iuser';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';

@controller('/admin/users')
export class UserController {

    constructor(@inject(TYPES.UserService) private userService: IUserService) {}

    @httpGet('/')
    public async getUsers(req : Request, res: Response) {
        let users = await this.userService.getUsers();
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
            req.flash('notifications', 'Login successful.');
            return res.redirect("/admin/posts");
        }
        else {
            req.flash('notifications', 'Login unsuccessful.');
            return res.redirect("/admin/users/login");
        }
    }

    @httpGet('/logout')
    public getLogout(req : Request, res: Response) {
        res.clearCookie('auth');
        return res.redirect('/admin/users/login');
    }

    @httpGet('/register')
    public getRegister(req: Request, res: Response){
        return res.render('admin/users/register', {title: 'Register User'});
    }

    @httpPost('/register')
    public async register(req: Request, res: Response) {
        try {
            await this.userService.createUser(req.body);
            req.flash('notifications', 'User registered.');
            res.redirect('/admin/users');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                res.render('admin/users/register', {tag : req.body, title: 'Register User'});
            }
        }
    }

    @httpGet('/:id')
    public getUser(request: Request){
        return this.userService.getUser(request.params.id);
    }

    @httpGet('/delete/:id')
    public async deleteUser(req: Request, res : Response) {
        await this.userService.deleteUser(req.params.id, req.cookies);
        req.flash('notifications', 'User deleted.');
        return res.redirect('/admin/users');
    }
}