import INavItem, { INavItemModel } from "../../models/Inav-item";

export default interface INavItemService {
    getNavItem(id : string) : Promise<any>;
    getNavItems() : Promise<object[]>;
    createNavItem(postObject : INavItemModel) : Promise<object>;
    updateNavItem(id : string, postObject : INavItemModel) : Promise<any>;
    deleteNavItem(id : string) : Promise<object>;
    orderUpdate(ids : Array<number>) : Promise<boolean>;
}