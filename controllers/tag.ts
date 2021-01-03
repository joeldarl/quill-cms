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
        res.render('admin/tags/read', {tags : tags, title : 'Tags'});
    }

    @httpGet('/create', auth.required)
    public async viewCreateTag(req : Request, res: Response) {
        res.render('admin/tags/create', {title: 'Create Tag'});
    }

    @httpPost('/create', auth.required)
    public async createTag(req : Request, res: Response) {
        try {
            let tag = await this.tagService.createTag(req.body);
            req.flash('notifications', 'Tag created.');
            res.redirect('/admin/tags');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                res.render('admin/tags/create', {tag : req.body, title: 'Create Tag'});
            }
        }
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdateTag(req : Request, res: Response) {
        let tag = await this.tagService.getTag(req.params.id);
        res.render('admin/tags/edit', {tag : tag, title : 'Edit Tag'});
    }

    @httpPost('/update/:id', auth.required)
    public async updateTag(req : Request, res: Response) {
        try {
            await this.tagService.updateTag(req.params.id, req.body);
            req.flash('notifications', 'Tag updated.');
            res.redirect('/admin/tags');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                req.body._id = req.params.id;
                res.render('admin/tags/edit', {tag : req.body, title: 'Edit Tag'});
            }
        }
    }

    @httpGet('/delete/:id', auth.required)
    public async deleteTag(req : Request, res: Response) {
        await this.tagService.deleteTag(req.params.id);
        req.flash('notifications', 'Tag deleted.');
        res.redirect('/admin/tags');
    }

    @httpGet('/:id', auth.required)
    public async getTag(req : Request, res: Response) {
        let post = await this.tagService.getTag(req.params.id);
        res.render('admin/tags/read', {post});
    }
}