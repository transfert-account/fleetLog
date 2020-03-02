import AWS from 'aws-sdk';
import moment from 'moment';
import Documents from '../document/documents';
import { Mongo } from 'meteor/mongo';

const bound = Meteor.bindEnvironment((callback) => {callback();});

export default {
    getSignedDocumentDownloadLink: async (_id) => {
        return new Promise((resolve, reject) => {
            try{
                let doc = Documents.findOne({_id:new Mongo.ObjectID(_id)});
                let s3 = new AWS.S3({
                    region: 'eu-west-3',
                    apiVersion: '2006-03-01',
                    signatureVersion: 'v4'
                });
                const params = {
                    Bucket: "wg-logistique",
                    Key: doc.name ,
                    Expires: 60 * 2
                }
                s3.getSignedUrl('getObject', params, function (err, url) {
                    if (err) {
                        reject ({linkGenerationSuccess:false,err:err})
                    }
                    resolve ({linkGenerationSuccess:true,link:url})
                })
            }catch (err) {
                reject ({linkGenerationSuccess:false,err:err})
            }
        })
    },
    shipToBucket : async (file,societe,type,docId,deleteOld,oldFile) => {
        return new Promise((resolve,reject)=>{
            const { createReadStream, filename, mimetype, encoding } = file;
            let ext = filename.split(".")[filename.split(".").length-1]
            let fileInfo = {
                originalFilename:filename,
                ext:ext,
                mimetype:mimetype,
                docName:"doc_"+type+"_"+societe.trikey+"_"+moment().format('YYYY_MM_DD_HH_mm_ss_')+docId+"."+ext
            }
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01'
            });
            /* CHECK ON CREDENTIALS, TO DELETE */
            AWS.config.getCredentials(function(err) {
                if (err) console.log(err.stack);
                // credentials not loaded
                else {
                  console.log("Access key:", AWS.config.credentials.accessKeyId);
                  console.log("Secret access key:", AWS.config.credentials.secretAccessKey);
                }
            });
            /* CHECK ON CREDENTIALS, TO DELETE */
            let fileStream = createReadStream();
            fileStream.on('error', function(err) {
                console.log('File Error', err);
            });
            let uploadParams = {Bucket: 'wg-logistique', Key: fileInfo.docName, Body: fileStream};
            s3.upload(uploadParams, (err, data) => {
                bound(()=>{
                    if (err) {
                        resolve({uploadSucces:false,err:err})
                    }else{
                        if(deleteOld){
                            let params = {
                                Bucket: "wg-logistique", 
                                Key: oldFile.name
                            };
                            s3.deleteObject(params, function(err, data) {
                                bound(()=>{
                                    if(err){
                                        resolve({uploadSucces:false,err:err})
                                    }else{
                                        Documents.remove({
                                            _id:oldFile._id
                                        });
                                        resolve({uploadSucces:true,data:data,fileInfo:fileInfo})
                                    }
                                });
                            });
                        }
                    }
                });
            })
        })
    }
}