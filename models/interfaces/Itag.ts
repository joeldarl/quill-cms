import { ModelType } from 'typegoose';

export default interface ITag {
    title: string,
    date: Date,
}

export type ITagModel = ModelType<ITag>;

export interface ITagRepository {
    Tag: ITagModel;
}