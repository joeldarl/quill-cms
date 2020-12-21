import IPage, { IPageModel } from "../../models/Ipage";

export default interface IPageService {
    getPage(id : string) : Promise<any>;
    getPages() : Promise<object[]>;
    createPage(postObject : IPageModel) : Promise<object>;
    updatePage(id : string, postObject : IPageModel) : Promise<any>;
    deletePage(id : string) : Promise<object>;
}