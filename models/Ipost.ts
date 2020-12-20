import { ModelType } from 'typegoose';
import { ObjectId } from 'mongoose';

export default interface IPost {
    title: string,
    date: Date,
    postType: ObjectId
    body: string
}

export type IPostModel = ModelType<IPost>;

export interface IPostRepository {
    Post: IPostModel;
}