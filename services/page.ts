import { inject, injectable } from 'inversify';
import { IPageModel, IPageRepository } from '../models/Ipage';
import TYPES from '../constant/types';
// import { NotFoundError } from 'restify-errors';

@injectable()
export default class UserService {

  constructor (@inject(TYPES.PageRepository) private pageRepository: IPageRepository) {}

  public async getPage(id : string) {
    return await this.pageRepository.Page.findOne({_id : id});
  }

  public async getPages() {
    return await this.pageRepository.Page.find();
  }

  public async createPage(pageObject : IPageModel) {
    return await new this.pageRepository.Page({
        title : pageObject.title,
        url : pageObject.url,
        body : pageObject.body
    }).save();
  }

  public async updatePage(id : string, pageObject : IPageModel) {
    let page = await this.pageRepository.Page.findOne({_id : id});

    if(page){
        page.title = pageObject.title;
        page.url = pageObject.url;
        page.body = pageObject.body;
        page.save();
    }

    return page;
  }

  public async deletePage(id : string) {
    return await this.pageRepository.Page.deleteOne({_id : id});
  }
}