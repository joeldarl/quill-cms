import { inject, injectable } from 'inversify';
import { IPostTypeModel, IPostTypeRepository } from '../models/Ipost-type';
import TYPES from '../constant/types';

@injectable()
export default class UserService {

  constructor (@inject(TYPES.PostTypeRepository) private pageRepository: IPostTypeRepository) {}

  public async getPostType(id : string) {
    return await this.pageRepository.PostType.findOne({_id : id});
  }

  public async getPostTypes() {
    return await this.pageRepository.PostType.find();
  }

  public async createPostType(pageObject : IPostTypeModel) {
    return await new this.pageRepository.PostType({
        title : pageObject.title,
        body : pageObject.body
    }).save();
  }

  public async updatePostType(id : string, pageObject : IPostTypeModel) {
    let page = await this.pageRepository.PostType.findOne({_id : id});

    if(page){
        page.title = pageObject.title;
        page.body = pageObject.body;
        page.save();
    }

    return page;
  }

  public async deletePostType(id : string) {
    return await this.pageRepository.PostType.deleteOne({_id : id});
  }
}