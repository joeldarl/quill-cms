import { prop, getModelForClass } from '@typegoose/typegoose';
import { IPostRepository } from './Ipost';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';

class Post {
    _id!: ObjectId;

    @prop({ required: true })
    public title: string

    @prop({ required: true, default: Date.now })
    public date: Date

    @prop({ required: true, unique: true, ref: 'PostType' })
    public postType: ObjectId

    @prop({ required: true })
    public body: string
}

@injectable()
export default class PostRepository implements IPostRepository {
    public Post = getModelForClass(Post);
}