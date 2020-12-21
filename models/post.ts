import { prop, getModelForClass } from '@typegoose/typegoose';
import IPost, { IPostRepository } from './Ipost';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';
import ITag from './Itag';

class Post implements IPost{
    // _id!: ObjectId;

    @prop({ required: true })
    public title: string

    @prop({ required: true, default: Date.now })
    public date: Date

    @prop({ required: true })
    public body: string

    @prop({ ref:'Post' })
    public tags: [ObjectId]
}

@injectable()
export default class PostRepository implements IPostRepository {
    public Post = getModelForClass(Post);
}