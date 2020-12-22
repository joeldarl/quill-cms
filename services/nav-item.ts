import { inject, injectable } from 'inversify';
import { INavItemModel, INavItemRepository } from '../models/interfaces/Inav-item';
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

  public async createNavItem(navItemObject : INavItemModel) {
    let navItem = await new this.navItemRepository.NavItem();

    let count : number = await this.navItemRepository.NavItem.count();
    
    navItem.order = count + 1;
    navItem.title = navItemObject.title;
    navItem.url = navItemObject.url;
    navItem.save();

    return navItem;
  }

  public async updateNavItem(id : string, navItemObject : INavItemModel) {
    let navItem = await this.navItemRepository.NavItem.findOne({_id : id});

    if(navItem){
        navItem.title = navItemObject.title;
        navItem.url = navItemObject.url;
        navItem.save();
    }

    return navItem;
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