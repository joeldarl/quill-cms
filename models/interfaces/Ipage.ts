import { ModelType } from 'typegoose';

export default interface IPage {
    title: string,
    date: Date,
    url: string,
    body: string
}

export type IPageModel = ModelType<IPage>;

export interface IPageRepository {
    Page: IPageModel;
}