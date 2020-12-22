import { ModelType } from 'typegoose';
import { ObjectId } from 'mongoose';

export default interface IPost {
    title: string,
    date: Date,
    body: string,
    tags: [ObjectId]
}

export type IPostModel = ModelType<IPost>;

export interface IPostRepository {
    Post: IPostModel;
}