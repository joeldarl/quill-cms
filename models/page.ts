import { prop, getModelForClass } from '@typegoose/typegoose';
import { IPageRepository } from './interfaces/Ipage';
import { injectable } from 'inversify';

class Page {
    @prop({ required: [true, "Title is required."] })
    public title: string

    @prop({ required: true, default: Date.now })
    public date: Date

    @prop({ required: [true, "Url is required."], unique: true })
    public url: string

    @prop({ required: [true, "Content is required."] })
    public body: string
}

@injectable()
export default class PageRepository implements IPageRepository {
    public Page = getModelForClass(Page);
}