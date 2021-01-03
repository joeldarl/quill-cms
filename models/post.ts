import { prop, getModelForClass } from '@typegoose/typegoose';
import IPost, { IPostRepository } from './interfaces/Ipost';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';
import ITag from './interfaces/Itag';

class Post implements IPost{
    @prop({ required: [true, 'Title is required.'] })
    public title: string

    @prop({ required: [true, 'Date is required.'], default: Date.now })
    public date: Date

    @prop({ required: [true, 'Content is required.'] })
    public body: string

    @prop({ ref:'Post' })
    public tags: [ObjectId]
}

@injectable()
export default class PostRepository implements IPostRepository {
    public Post = getModelForClass(Post);
}