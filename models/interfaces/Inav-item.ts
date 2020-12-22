import { ModelType } from 'typegoose';

export default interface INavItem {
    title: string,
    date: Date,
    url: string,
    order: number
}

export type INavItemModel = ModelType<INavItem>;

export interface INavItemRepository {
    NavItem: INavItemModel;
}