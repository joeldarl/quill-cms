import { controller, httpGet, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import { inject } from 'inversify';
import PostTypeService from '../services/post-type';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');

@controller('/admin/post-types')
export class PostTypeController {

    constructor(@inject(TYPES.PostTypeService) private postTypeService: PostTypeService) {}

    @httpGet('/', auth.required)
    public async getPostTypes(req : Request, res: Response) {
        let postTypes = await this.postTypeService.getPostTypes();
        res.render('admin/post-types/read', {postTypes : postTypes});
    }

    @httpGet('/create', auth.required)
    public async viewCreatePostType(req : Request, res: Response) {
        res.render('admin/post-types/create');
    }

    @httpPost('/create', auth.required)
    public async createPostType(req : Request, res: Response) {
        let postType = await this.postTypeService.createPostType(req.body);
        if(postType)
        res.redirect('/admin/post-types');
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdatePostType(req : Request, res: Response) {
        let postType = await this.postTypeService.getPostType(req.params.id);
        res.render('admin/post-types/edit', {postType : postType});
    }

    @httpPost('/update/:id', auth.required)
    public async updatePostType(req : Request, res: Response) {
        let post = await this.postTypeService.updatePostType(req.params.id, req.body);
        res.redirect('/admin/post-types');
    }

    @httpGet('/delete/:id', auth.required)
    public async deletePostType(req : Request, res: Response) {
        await this.postTypeService.deletePostType(req.params.id);
        res.redirect('/admin/post-types');
    }

    @httpGet('/:id', auth.required)
    public async getPostType(req : Request, res: Response) {
        let post = await this.postTypeService.getPostType(req.params.id);
        res.render('admin/post-types/read', {post});
    }
}