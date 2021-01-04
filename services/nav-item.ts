import { inject, injectable } from 'inversify';
import INavItem, { INavItemModel, INavItemRepository } from '../models/interfaces/Inav-item';
import INavItemService from './interfaces/Inav-item';
import TYPES from '../constant/types';

@injectable()
export default class NavItemService implements INavItemService{

  constructor (@inject(TYPES.NavItemRepository) private navItemRepository: INavItemRepository) {}

  public async getNavItem(id : string) {
    return await this.navItemRepository.NavItem.findOne({_id : id});
  }

  public async getNavItems() {
    return await this.navItemRepository.NavItem.find().sort('order');
  }

  public async createNavItem(navItemObject : INavItem) {
    let navItem = await new this.navItemRepository.NavItem();

    let count : number = await this.navItemRepository.NavItem.count();
    
    navItem.order = count + 1;
    navItem.title = navItemObject.title;

    if(navItemObject.url.charAt(0) != '/')
    navItemObject.url = '/' + navItemObject.url;
    navItem.url = navItemObject.url;

    return await navItem.save();
  }

  public async updateNavItem(id : string, navItemObject : INavItem) {
    if(navItemObject.url.charAt(0) != '/')
    navItemObject.url = '/' + navItemObject.url;

    return await this.navItemRepository.NavItem.updateOne({_id : id}, {
      title : navItemObject.title,
      url : navItemObject.url,
    }, { runValidators: true });
  }

  public async deleteNavItem(id : string) {
    return await this.navItemRepository.NavItem.deleteOne({_id : id});
  }

  public async orderUpdate(ids : Array<number>) {
    for(var i = 0; i < ids.length; i++) {
        let navItem = await this.navItemRepository.NavItem.findOne({_id: ids[i]});
        if(navItem){
            navItem.order = i + 1;
            navItem.save();
        }
    }
    
    return true;
  }
}