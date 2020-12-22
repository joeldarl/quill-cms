import { inject, injectable, postConstruct } from 'inversify';
import IPost, { IPostModel, IPostRepository } from '../models/interfaces/Ipost';
import TYPES from '../constant/types';
import IPostService from './interfaces/Ipost';
import { post } from 'typegoose';
import { convertToObject } from 'typescript';

@injectable()
export default class PostService implements IPostService {

  constructor (@inject(TYPES.PostRepository) private postRepository: IPostRepository) {}

  public async getPost(id : string) {
    // return new Promise<IPost>((resolve, reject) => {
    //     this.postRepository.Post.findOne({_id : id}, (error: Error, object : IPost)=>{
    //         resolve(object);
    //     });
    // });
    return await this.postRepository.Post.findOne({_id : id});
  }

  public async getPosts() {
    let posts = await this.postRepository.Post.find();
    return (posts) ? posts.map(o => o.toObject()) : [{}];
  }

  public async createPost(postObject : IPostModel) {
    let post = await new this.postRepository.Post({
        title : postObject.title,
        body : postObject.body,
        tags : postObject.tags
    }).save();

    return post;
  }

  public async updatePost(id : string, postObject : IPostModel) {
    let post = await this.postRepository.Post.findOne({_id : id});

    if(post){
        post.title = postObject.title;
        post.body = postObject.body;
        post.tags = postObject.tags;
        post.save();

        return post;
    }
    else
    return {}
  }

  public async deletePost(id : string) {
    return await this.postRepository.Post.deleteOne({_id : id});
  }
}