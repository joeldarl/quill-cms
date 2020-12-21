import { inject, injectable } from 'inversify';
import TYPES from '../constant/types';
import IUploadService from './interfaces/Iupload';
import path from 'path';
const fse = require('fs-extra');

@injectable()
export default class UploadService implements IUploadService {
    public async getUploads() {
        var files : string[] = this.searchDir('public/uploads');

        files = files.filter(function (file){
            return ['.png', '.jpg', '.gif', '.jpeg'].includes(path.extname(file).toLowerCase());
        });
    
        for(var i = 0; i < files.length; i++){
            files[i] = files[i].replace("public", "");
            files[i] = files[i].replace(/\\/g, "/");
        }

        return files;
    }

    public async deleteUpload(file : File) {
        return fse.unlink('public' + file);
    }

    // Recursive search for files within a given folder path
    public searchDir(startPath : string) : Array<string>{
        if (!fse.existsSync(startPath)){
            return [];
        }

        var files = fse.readdirSync(startPath);
        var found : any = [];

        for(var i = 0; i < files.length; i++){
            var filename = path.join(startPath,files[i]);
            var stat = fse.lstatSync(filename);
            if (stat.isDirectory()){
                found = found.concat(this.searchDir(filename));
            }
            else {
                found.push(filename);
            };
        };

        return found;
    };
}