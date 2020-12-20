import { controller, httpGet, httpPost, httpPut, httpDelete, request, response, next} from 'inversify-express-utils';
import { inject } from 'inversify';
import IPage, {IPageModel} from '../models/Ipage';
import Page from '../models/page';
import PageService from '../services/page';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');

@controller('/admin/pages')
export class PageController {

    constructor(@inject(TYPES.PageService) private pageService: PageService) {}

    @httpGet('/', auth.required)
    public async getPages(req : Request, res: Response) {
        let pages = await this.pageService.getPages();
        res.render('admin/pages/read', {pages : pages});
    }

    @httpGet('/create', auth.required)
    public async viewCreatePage(req : Request, res: Response) {
        res.render('admin/pages/create');
    }

    @httpPost('/create', auth.required)
    public async createPage(req : Request, res: Response) {
        let page = await this.pageService.createPage(req.body);
        if(page)
        res.redirect('/admin/pages');
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdatePage(req : Request, res: Response) {
        let page = await this.pageService.getPage(req.params.id);
        res.render('admin/pages/edit', {page : page});
    }

    @httpPost('/update/:id', auth.required)
    public async updatePage(req : Request, res: Response) {
        let page = await this.pageService.updatePage(req.params.id, req.body);
        res.redirect('/admin/pages');
    }

    @httpGet('/delete/:id', auth.required)
    public async deletePage(req : Request, res: Response) {
        await this.pageService.deletePage(req.params.id);
        res.redirect('/admin/pages');
    }

    @httpGet('/:id', auth.required)
    public async getPage(req : Request, res: Response) {
        let page = await this.pageService.getPage(req.params.id);
        res.render('admin/pages/read', {page});
    }
}