import { inject, injectable } from 'inversify';
import { ITagModel, ITagRepository } from '../models/Itag';
import ITagService from './interfaces/Itag';
import TYPES from '../constant/types';

@injectable()
export default class TagService implements ITagService{

  constructor (@inject(TYPES.TagRepository) private tagRepository: ITagRepository) {}

  public async getTag(id : string) {
    return await this.tagRepository.Tag.findOne({_id : id});
  }

  public async getTags() {
    return await this.tagRepository.Tag.find();
  }

  public async createTag(tagObject : ITagModel) {
    return await new this.tagRepository.Tag({
        title : tagObject.title,
    }).save();
  }

  public async updateTag(id : string, tagObject : ITagModel) {
    let tag = await this.tagRepository.Tag.findOne({_id : id});

    if(tag){
        tag.title = tagObject.title;
        tag.save();
    }

    return tag;
  }

  public async deleteTag(id : string) {
    let tag = await this.tagRepository.Tag.findOne({_id : id});
    return await tag?.remove();
  }
}