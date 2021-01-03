import IPage, { IPageModel } from "../../models/interfaces/Ipage";

export default interface IPageService {
    getPage(id : string) : Promise<any>;
    getPages() : Promise<object[]>;
    getPageByUrl(url : string) : Promise<any>;
    createPage(postObject : IPageModel) : Promise<object>;
    updatePage(id : string, postObject : IPageModel) : Promise<any>;
    deletePage(id : string) : Promise<object>;
}