import Documents from './documents';
import Societes from '../societe/societes';
import { Mongo } from 'meteor/mongo';
import Functions from '../common/functions';

export default {
    Query : {
        downloadFile(obj, args,{user}){

        }
    },
    Mutation : {
        uploadFile : (obj,{type,file,societe,size},{user}) => {
            if(user._id){
                let ext = filename.split(".")[filename.split(".").length-1]
                societe = Societes.findOne({_id:new Mongo.ObjectID(societe)});
                let uploadPromise = new Promise(async (resolve,reject)=>{
                    let uploadInfo = await Functions.shipToBucket(await file,societe,type,ext)
                    if(uploadInfo.uploadSucces){
                        resolve(uploadInfo)
                    }else{
                        reject(uploadInfo)
                    }
                })
                uploadPromise.then((uploadInfo)=>{
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