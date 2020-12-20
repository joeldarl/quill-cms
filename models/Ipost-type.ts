import { ModelType } from 'typegoose';

export default interface IPostType {
    title: string,
    date: Date,
    body: string
}

export type IPostTypeModel = ModelType<IPostType>;

export interface IPostTypeRepository {
    PostType: IPostTypeModel;
}