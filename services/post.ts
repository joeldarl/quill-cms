import { inject, injectable } from 'inversify';
import { IPostModel, IPostRepository } from '../models/Ipost';
import TYPES from '../constant/types';
// import { NotFoundError } from 'restify-errors';

@injectable()
export default class PostService {

  constructor (@inject(TYPES.PostRepository) private postRepository: IPostRepository) {}

  public async getPost(id : string) {
    return await this.postRepository.Post.findOne({_id : id});
  }

  public async getPosts() {
    return await this.postRepository.Post.find();
  }

  public async createPost(postObject : IPostModel) {
    return await new this.postRepository.Post({
        title : postObject.title,
        postType : postObject.postType,
        body : postObject.body
    }).save();
  }

  public async updatePost(id : string, postObject : IPostModel) {
    let post = await this.postRepository.Post.findOne({_id : id});

    if(post){
        post.title = postObject.title;
        post.postType = postObject.postType;
        post.body = postObject.body;
        post.save();
    }

    return post;
  }

  public async deletePost(id : string) {
    return await this.postRepository.Post.deleteOne({_id : id});
  }
}