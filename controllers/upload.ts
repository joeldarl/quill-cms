import { controller, httpGet, httpPost, httpPut, httpDelete, request, response, next} from 'inversify-express-utils';
import { inject } from 'inversify';
import IUploadService from '../services/interfaces/Iupload';
import { Request, Response, NextFunction } from "express";
import TYPES from '../constant/types';
const auth = require('../auth/auth');
const multer = require('multer');
const moment = require('moment');
const fse = require('fs-extra');
import path from 'path';

// SET STORAGE for uploads
const storage = multer.diskStorage({
    destination: async function (req : Request, file : any, cb : any) {
        let date = moment(new Date());
        let path = 'public/uploads/' + date.year() + '/' + parseInt(date.month() + 1);
        await fse.ensureDir(path);
        cb(null, path)
    },
    filename: function (req : Request, file : any, cb : any) {
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, file.originalname);
    }
});

// Multer upload settings
const upload = multer({
    storage: storage,
    fileFilter: function (req : Request, file : any, cb : any) {
        var ext = path.extname(file.originalname);
        if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            return cb(new Error('Only images are allowed.'))
        }
        cb(null, true)
    },
    limits:{
        fileSize: 1024 * 1024
    }
});
@controller('/admin/uploads')
export class UploadController {

    constructor(@inject(TYPES.UploadService) private uploadService: IUploadService) {}

    @httpGet('/', auth.required)
    public async getUploads(req : Request, res: Response) {
        let files = await this.uploadService.getUploads();
        res.render('admin/uploads/read', {files : files});
    }

    @httpPost('/', auth.required, upload.single('file'))
    public async uploadFile(req: Request, res: Response) {
        res.redirect('/admin/uploads');
    }

    @httpPost('/delete', auth.required)
    public async delete(req: Request, res: Response) {
        await this.uploadService.deleteUpload(req.body.file);
        res.redirect('/admin/uploads');
    }
}