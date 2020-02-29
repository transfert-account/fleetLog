import AWS from 'aws-sdk';
import Documents from './documents';
import Societes from '../societe/societes';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const shipToBucket = async (file,societe,type) => {
    return new Promise(resolve=>{
        const { createReadStream, filename, mimetype, encoding } = file;
        let ext = filename.split(".")[filename.split(".").length-1]
        let fileInfo = {
            originalFilename:filename,
            ext:ext,
            docName:"doc_"+type+"_"+societe.trikey+"_"+moment().format('YYYY_MM_DD_HH_mm_ss')+"."+ext
        }
        let s3 = new AWS.S3({
            region: 'eu-west-3',
            apiVersion: '2006-03-01'
        });
        var fileStream = createReadStream();
        fileStream.on('error', function(err) {
            console.log('File Error', err);
        });
        var uploadParams = {Bucket: 'wg-logistique', Key: fileInfo.docName, Body: fileStream};
        s3.upload(uploadParams, (err, data) => {
            if (err) {
                resolve({uploadSucces:false,err:err})
            } if (data) {
                resolve({uploadSucces:true,data:data,fileInfo:fileInfo})
            }
        })
    })
}

export default {
    Query : {
        downloadFile(obj, args,{user}){

        }
    },
    Mutation : {
        uploadFile : (obj,{type,file,societe},{user}) => {
            if(user._id){
                console.log(file)
                societe = Societes.findOne({_id:new Mongo.ObjectID(societe)});
                let uploadPromise = new Promise(async (resolve,reject)=>{
                    let uploadInfo = await shipToBucket(await file,societe,type)
                    if(uploadInfo.uploadSucces){
                        resolve(uploadInfo)
                    }else{
                        reject(uploadInfo)
                    }
                })
                uploadPromise.then((uploadInfo)=>{
                    console.log(uploadInfo.data)
                    Documents.insert({
                        _id:new Mongo.ObjectID(),
                        name:uploadInfo.fileInfo.docName,
                        size:0,
                        path:uploadInfo.data.Location,
                        originalFilename:uploadInfo.fileInfo.originalFilename,
                        ext:uploadInfo.fileInfo.ext,
                        type:type
                    });
                    return [{status:true,message:'Document sauvegardé'}];
                }).catch((uploadInfo)=>{
                    return [{status:true,message:'Erreur durant le traitement : ' + err}];
                })
            }
            throw new Error('Unauthorized');
        }
    }
}