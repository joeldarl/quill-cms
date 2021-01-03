import { controller, httpGet} from 'inversify-express-utils';
import { Request, Response } from "express";
const auth = require('../auth/auth');

@controller('/admin')
export class AdminController {

    @httpGet('/', auth.required)
    public redirectAdmin(req : Request, res: Response) {
        return res.redirect('/admin/posts')
    }
}