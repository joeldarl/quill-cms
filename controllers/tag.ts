import { controller, httpGet, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import { inject } from 'inversify';
import ITagService from '../services/interfaces/Itag';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');

@controller('/admin/tags')
export class TagController {

    @inject(TYPES.TagService) private tagService: ITagService

    @httpGet('/', auth.required)
    public async getTags(req : Request, res: Response) {
        let tags = await this.tagService.getTags();
        res.render('admin/tags/read', {tags : tags});
    }

    @httpGet('/create', auth.required)
    public async viewCreateTag(req : Request, res: Response) {
        res.render('admin/tags/create');
    }

    @httpPost('/create', auth.required)
    public async createTag(req : Request, res: Response) {
        let tag = await this.tagService.createTag(req.body);
        if(tag)
        res.redirect('/admin/tags');
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdateTag(req : Request, res: Response) {
        let tag = await this.tagService.getTag(req.params.id);
        res.render('admin/tags/edit', {tag : tag});
    }

    @httpPost('/update/:id', auth.required)
    public async updateTag(req : Request, res: Response) {
        let post = await this.tagService.updateTag(req.params.id, req.body);
        res.redirect('/admin/tags');
    }

    @httpGet('/delete/:id', auth.required)
    public async deleteTag(req : Request, res: Response) {
        await this.tagService.deleteTag(req.params.id);
        res.redirect('/admin/tags');
    }

    @httpGet('/:id', auth.required)
    public async getTag(req : Request, res: Response) {
        let post = await this.tagService.getTag(req.params.id);
        res.render('admin/tags/read', {post});
    }
}