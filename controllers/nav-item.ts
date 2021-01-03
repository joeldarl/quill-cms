import { controller, httpGet, httpPost, httpPut, httpDelete, request, response, next} from 'inversify-express-utils';
import { inject } from 'inversify';
import INavItemService from '../services/interfaces/Inav-item';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');

@controller('/admin/nav-items')
export class NavItemController {

    constructor(@inject(TYPES.NavItemService) private navItemService: INavItemService) {}

    @httpGet('/', auth.required)
    public async getNavItems(req : Request, res: Response) {
        let navItems = await this.navItemService.getNavItems();
        res.render('admin/nav-items/read', {navItems : navItems, title : 'Navigation Items'});
    }

    @httpGet('/create', auth.required)
    public async viewCreateNavItem(req : Request, res: Response) {
        res.render('admin/nav-items/create', {title: 'Create Navigation Item'});
    }

    @httpPost('/create', auth.required)
    public async createNavItem(req : Request, res: Response) {
        try {
            await this.navItemService.createNavItem(req.body);
            req.flash('notifications', 'Navigation item created.');
            res.redirect('/admin/nav-items');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                res.render('admin/nav-items/create', {navItem : req.body, title: 'Create Navigation Item'});
            }
        }
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdateNavItem(req : Request, res: Response) {
        let navItem = await this.navItemService.getNavItem(req.params.id);
        res.render('admin/nav-items/edit', {navItem : navItem, title: 'Edit Navigation Item'});
    }

    @httpPost('/update/:id', auth.required)
    public async updateNavItem(req : Request, res: Response) {
        try {
            await this.navItemService.updateNavItem(req.params.id, req.body);
            req.flash('notifications', 'Navigation item updated.');
            res.redirect('/admin/nav-items');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                req.body._id = req.params.id;
                res.render('admin/nav-items/edit', {navItem : req.body, title: 'Edit Navigation Item'});
            }
        }
    }

    @httpGet('/delete/:id', auth.required)
    public async deleteNavItem(req : Request, res: Response) {
        await this.navItemService.deleteNavItem(req.params.id);
        req.flash('notifications', 'Navigation item deleted.');
        res.redirect('/admin/nav-items');
    }

    @httpPost('/orderUpdate', auth.required)
    public async updateNavItemOrder(req: Request, res: Response) {
        await this.navItemService.orderUpdate(req.body.ids);
        req.flash('notifications', 'Order updated.');
        res.redirect('/admin/nav-items');
    }

    @httpGet('/:id', auth.required)
    public async getNavItem(req : Request, res: Response) {
        return await this.navItemService.getNavItem(req.params.id);
    }
}