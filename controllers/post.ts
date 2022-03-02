import { controller, httpGet, httpPost, httpPut, httpDelete} from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import IPostService from '../services/interfaces/Ipost';
import ITagService from '../services/interfaces/Itag';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');
const moment = require('moment');
import ValidationError from 'mongoose';
import { post } from 'typegoose';

@controller('/admin/posts')
export class PostController {

    @inject(TYPES.PostService) private postService: IPostService
    @inject(TYPES.TagService) private tagService: ITagService

    @httpGet('/', auth.required)
    public async getPosts(req : Request, res: Response) {
        let posts = await this.postService.getPosts();
        res.render('admin/posts/read', {posts : posts, moment : moment, title: 'Posts'});
    }

    /**
     * View the post creation screen.
     * @param req 
     * @param res 
     */
    @httpGet('/create', auth.required)
    public async viewCreatePost(req : Request, res: Response) {
        let tags = await this.tagService.getTags();
        res.render('admin/posts/create', {tags : tags, title: 'Create Post'});
    }

    /**
     * Create a post.
     * @param req 
     * @param res 
     */
    @httpPost('/create', auth.required)
    public async createPost(req : Request, res: Response) {
        try {
            await this.postService.createPost(req.body);
            req.flash('notifications', 'Post created.');
            res.redirect('/admin/posts');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                let tags = await this.tagService.getTags();
                res.render('admin/posts/create', {tags : tags, post : req.body, title: 'Create Post'});
            }
        }
    }

    /**
     * View post update screen.
     * @param req 
     * @param res 
     */
    @httpGet('/edit/:id', auth.required)
    public async viewUpdatePost(req : Request, res: Response) {
        let post = await this.postService.getPost(req.params.id);
        let tags = await this.tagService.getTags();
        res.render('admin/posts/edit', {post : post, tags : tags, title: 'Edit Post'});
    }

    @httpPost('/update/:id', auth.required)
    public async updatePost(req : Request, res: Response) {
        try {
            await this.postService.updatePost(req.params.id, req.body);
            req.flash('notifications', 'Post updated.');
            res.redirect('/admin/posts');
        }
        catch (err) {
            if (err.name == 'ValidationError'){
                for (let field in err.errors) {
                    req.flash('errors', err.errors[field].message);
                }
                let tags = await this.tagService.getTags();
                req.body._id = req.params.id;
                res.render('admin/posts/edit', {tags : tags, post : req.body, title: 'Edit Post'});
            }
        }
    }

    @httpGet('/delete/:id', auth.required)
    public async deletePost(req : Request, res: Response) {
        await this.postService.deletePost(req.params.id);
        req.flash('notifications', 'Post deleted.');
        res.redirect('/admin/posts');
    }

    @httpGet('/:id', auth.required)
    public async getPost(req : Request, res: Response) {
        let post = await this.postService.getPost(req.params.id);
        res.render('admin/posts/read', {post});
    }
}