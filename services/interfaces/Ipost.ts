import IPost, { IPostModel } from "../../models/Ipost";

export default interface IPostService {
    getPost(id : string) : Promise<any>;
    getPosts() : Promise<object[]>;
    createPost(postObject : IPostModel) : Promise<object>;
    updatePost(id : string, postObject : IPostModel) : Promise<object>;
    deletePost(id : string) : Promise<object>;
}