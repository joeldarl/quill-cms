import { controller, httpGet} from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import IPostService from '../services/interfaces/Ipost';
import INavItemService from '../services/interfaces/Inav-item';
import IPageService from '../services/interfaces/Ipage';
import { Request, Response } from "express";
import TYPES from '../constant/types';
const moment = require('moment');
@controller('')
export class FrontController {

    @inject(TYPES.PostService) private postService: IPostService
    @inject(TYPES.PageService) private pageService: IPageService
    @inject(TYPES.NavItemService) private navItemService: INavItemService

    @httpGet('/')
    public async getBlog(req : Request, res : Response) {
        const {page = 1, limit = 10} = req.query;
    
        let navItems = await this.navItemService.getNavItems();
    
        try {
            let posts = await this.postService.getPostsPaginated(page as number, limit as number, true);
            let pageCount = await this.postService.getPostCount() / (limit as number);

            res.render('blog', {
                title: process.env.TITLE, 
                articles: posts, 
                pageCount: Math.ceil(pageCount), 
                navigation: navItems,
                moment: moment
            })
        }
        catch (err) {
            console.error(err.message);
            return res.sendStatus(400);
        }
    }

    @httpGet('/*')
    public async getPage(req : Request, res : Response) {
        let navItems = await this.navItemService.getNavItems();

        try {
            let page = await this.pageService.getPageByUrl(req.originalUrl);
            if(!page)
                return res.sendStatus(404)
            
                res.render('page', {page, title: process.env.TITLE, navigation: navItems});
        }
        catch(err){
            console.error(err.message);
            return res.sendStatus(400);
        }
    }
}