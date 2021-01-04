import { inject, injectable } from 'inversify';
import ITag, { ITagModel, ITagRepository } from '../models/interfaces/Itag';
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

  public async createTag(tagObject : ITag) {
    return await new this.tagRepository.Tag({
        title : tagObject.title,
    }).save();
  }

  public async updateTag(id : string, tagObject : ITag) {
    return await this.tagRepository.Tag.updateOne({_id : id}, {
      title : tagObject.title,
    }, { runValidators: true });
  }

  public async deleteTag(id : string) {
    let tag = await this.tagRepository.Tag.findOne({_id : id});
    return await tag?.remove();
  }
}