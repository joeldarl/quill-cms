import { controller, httpGet, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import IPostService from '../services/interfaces/Ipost';
import ITagService from '../services/interfaces/Itag';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');
const moment = require('moment');

@controller('/admin/posts')
export class PostController {

    @inject(TYPES.PostService) private postService: IPostService
    @inject(TYPES.TagService) private tagService: ITagService

    @httpGet('/', auth.required)
    public async getPosts(req : Request, res: Response) {
        let posts = await this.postService.getPosts();
        res.render('admin/posts/read', {posts : posts, moment : moment});
    }

    @httpGet('/create', auth.required)
    public async viewCreatePost(req : Request, res: Response) {
        let tags = await this.tagService.getTags();
        res.render('admin/posts/create', {tags : tags});
    }

    @httpPost('/create', auth.required)
    public async createPost(req : Request, res: Response) {
        let post = await this.postService.createPost(req.body);
        if(post)
        res.redirect('/admin/posts');
    }

    @httpGet('/edit/:id', auth.required)
    public async viewUpdatePost(req : Request, res: Response) {
        let post = await this.postService.getPost(req.params.id);
        let tags = await this.tagService.getTags();
        res.render('admin/posts/edit', {post : post, tags : tags});
    }

    @httpPost('/update/:id', auth.required)
    public async updatePost(req : Request, res: Response) {
        let post = await this.postService.updatePost(req.params.id, req.body);
        res.redirect('/admin/posts');
    }

    @httpGet('/delete/:id', auth.required)
    public async deletePost(req : Request, res: Response) {
        await this.postService.deletePost(req.params.id);
        res.redirect('/admin/posts');
    }

    @httpGet('/:id', auth.required)
    public async getPost(req : Request, res: Response) {
        let post = await this.postService.getPost(req.params.id);
        res.render('admin/posts/read', {post});
    }
}