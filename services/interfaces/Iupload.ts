export default interface IUploadService {
    getUploads() : Promise<string[]>;
    deleteUpload(file : File) : Promise<object>;
}