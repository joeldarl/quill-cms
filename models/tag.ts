import { prop, getModelForClass, pre } from '@typegoose/typegoose';
import ITag, { ITagRepository } from './Itag';
import { ObjectId } from 'mongoose';
import { injectable } from 'inversify';

@pre<Tag>('remove', async function(){
    await this.model('Post').update({}, { $pull : { tags: { $in: this._id } } } as any, { multi: true });
})

class Tag implements ITag{
    _id!: ObjectId;

    @prop({ required: true })
    public title: string

    @prop({ required: true, default: Date.now })
    public date: Date
}

@injectable()
export default class PostRepository implements ITagRepository {
    public Tag = getModelForClass(Tag);
}