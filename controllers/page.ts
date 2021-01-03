import { controller, httpGet, httpPost, httpPut, httpDelete, request, response, next} from 'inversify-express-utils';
import { inject } from 'inversify';
import IPageService from '../services/interfaces/Ipage';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');

@controller('/admin/pages')
export class PageController {

    constructor(@inject(TYPES.PageService) private pageService: IPageService) {}

    @httpGet('/', auth.required)
    public async getPages(req : Request, res: Response) {
        let pages = await this.pageService.getPages();
        res.render('admin/pages/read', {pages : pages, title : 'Pages'});
    }

    @httpGet('/create', auth.required)
    public async viewCreatePage(req : Request, res: Response) {
        res.render('admin/pages/create', {title: 'Create Page'});
    }

    @httpPost('/create', auth.required)
    public async createPage(req : Request, res: Response) {
        try {
            await this.pageService.createPage(req.body);
            req.flash('notifications', 'Page created.');
            res.redirect('/admin/pages');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                res.render('admin/pages/create', {page : req.body, title: 'Create Page'});
            }
        }
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdatePage(req : Request, res: Response) {
        let page = await this.pageService.getPage(req.params.id);
        res.render('admin/pages/edit', {page : page, title: 'Edit Page'});
    }

    @httpPost('/update/:id', auth.required)
    public async updatePage(req : Request, res: Response) {
        try {
            await this.pageService.updatePage(req.params.id, req.body);
            req.flash('notifications', 'Page updated.');
            res.redirect('/admin/pages');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                req.body._id = req.params.id;
                res.render('admin/pages/edit', {page : req.body, title: 'Edit Post'});
            }
        }
    }

    @httpGet('/delete/:id', auth.required)
    public async deletePage(req : Request, res: Response) {
        await this.pageService.deletePage(req.params.id);
        req.flash('notifications', 'Page deleted.');
        res.redirect('/admin/pages');
    }

    @httpGet('/:id', auth.required)
    public async getPage(req : Request, res: Response) {
        let page = await this.pageService.getPage(req.params.id);
        res.render('admin/pages/read', {page});
    }
}