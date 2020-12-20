import { controller, httpGet, httpPost, httpPut, httpDelete, request, response, next} from 'inversify-express-utils';
import { inject } from 'inversify';
import INavItem, {INavItemModel} from '../models/Inav-item';
import NavItemService from '../services/nav-item';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');

@controller('/admin/nav-items')
export class NavItemController {

    constructor(@inject(TYPES.NavItemService) private navItemService: NavItemService) {}

    @httpGet('/', auth.required)
    public async getNavItems(req : Request, res: Response) {
        let navItems = await this.navItemService.getNavItems();
        res.render('admin/nav-items/read', {navItems : navItems});
    }

    @httpGet('/create', auth.required)
    public async viewCreateNavItem(req : Request, res: Response) {
        res.render('admin/nav-items/create');
    }

    @httpPost('/create', auth.required)
    public async createNavItem(req : Request, res: Response) {
        let navItem = await this.navItemService.createNavItem(req.body);
        res.redirect('/admin/nav-items');
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdateNavItem(req : Request, res: Response) {
        let navItem = await this.navItemService.getNavItem(req.params.id);
        res.render('admin/nav-items/edit', {navItem : navItem});
    }

    @httpPost('/update/:id', auth.required)
    public async updateNavItem(req : Request, res: Response) {
        let navItem = await this.navItemService.updateNavItem(req.params.id, req.body);
        res.redirect('/admin/nav-items');
    }

    @httpGet('/delete/:id', auth.required)
    public async deleteNavItem(req : Request, res: Response) {
        await this.navItemService.deleteNavItem(req.params.id);
        res.redirect('/admin/nav-items');
    }

    @httpPost('/orderUpdate', auth.required)
    public async updateNavItemOrder(req: Request, res: Response) {
        await this.navItemService.orderUpdate(req.body.ids);
        res.redirect('/admin/nav-items');
    }

    @httpGet('/:id', auth.required)
    public async getNavItem(req : Request, res: Response) {
        return await this.navItemService.getNavItem(req.params.id);
    }
}