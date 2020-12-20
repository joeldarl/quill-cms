import { prop, getModelForClass } from '@typegoose/typegoose';
import { IPostTypeRepository } from './Ipost-type';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';

class PostType {
    _id!: ObjectId;

    @prop({ required: true })
    public title: string

    @prop({ required: true, default: Date.now })
    public date: Date

    @prop({ required: true })
    public body: string
}

@injectable()
export default class PostRepository implements IPostTypeRepository {
    public PostType = getModelForClass(PostType);
}