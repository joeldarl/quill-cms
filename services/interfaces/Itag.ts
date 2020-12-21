import ITag, { ITagModel } from "../../models/Itag";

export default interface ITagService {
    getTag(id : string) : Promise<any>;
    getTags() : Promise<object[]>;
    createTag(postObject : ITagModel) : Promise<object>;
    updateTag(id : string, postObject : ITagModel) : Promise<any>;
    deleteTag(id : string) : Promise<object>;
}