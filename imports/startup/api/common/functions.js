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
            console.log("reached 13")
            const { createReadStream, filename, mimetype, encoding } = file;
            let ext = filename.split(".")[filename.split(".").length-1]
            let fileInfo = {
                originalFilename:filename,
                ext:ext,
                mimetype:mimetype,
                docName:"doc_"+type+"_"+societe.trikey+"_"+moment().format('YYYY_MM_DD_HH_mm_ss_')+docId+"."+ext
            }
            console.log("reached 14")
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01'
            });
            console.log("reached 15")
            let fileStream = createReadStream();
            fileStream.on('error', function(err) {
                console.log('File Error', err);
            });
            console.log("reached 16")
            let uploadParams = {Bucket: 'wg-logistique', Key: fileInfo.docName, Body: fileStream};
            s3.upload(uploadParams, (err, data) => {
                bound(()=>{
                    console.log("reached 17")
                    if (err) {
                        console.log("reached 18")
                        resolve({uploadSucces:false,err:err})
                    }else{
                        console.log("reached 19")
                        if(deleteOld){
                            console.log("reached 20")
                            let params = {
                                Bucket: "wg-logistique", 
                                Key: oldFile.name
                            };
                            console.log("reached 21")
                            s3.deleteObject(params, function(err, data) {
                                bound(()=>{
                                    console.log("reached 22")
                                    if(err){
                                        console.log("reached 23")
                                        resolve({uploadSucces:false,err:err})
                                    }else{
                                        console.log("reached 24")
                                        Documents.remove({
                                            _id:oldFile._id
                                        });
                                        console.log("reached 25")
                                        resolve({uploadSucces:true,data:data,fileInfo:fileInfo})
                                    }
                                });
                            });
                        }else{
                            resolve({uploadSucces:true,data:data,fileInfo:fileInfo})
                        }
                    }
                });
            })
        })
    }
}