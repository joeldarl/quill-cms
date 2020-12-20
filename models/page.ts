import { prop, getModelForClass } from '@typegoose/typegoose';
import { IPageRepository } from './Ipage';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';

class Page {
    _id!: ObjectId;

    @prop({ required: true })
    public title: string

    @prop({ required: true, default: Date.now })
    public date: Date

    @prop({ required: true, unique: true })
    public url: string

    @prop({ required: true })
    public body: string
}

@injectable()
export default class PageRepository implements IPageRepository {
    public Page = getModelForClass(Page);
}