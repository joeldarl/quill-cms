import { prop, getModelForClass } from '@typegoose/typegoose';
import { INavItemRepository } from './Inav-item';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';

class NavItem {
    _id!: ObjectId;

    @prop({ required: true })
    public title: string

    @prop({ required: true, default: Date.now })
    public date: Date

    @prop({ required: true, unique: true })
    public url: string

    @prop({ required: true })
    public order: Number 
}

@injectable()
export default class NavItemRepository implements INavItemRepository {
    public NavItem = getModelForClass(NavItem);
}