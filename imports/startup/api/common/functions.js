import AWS from 'aws-sdk';
import moment from 'moment';
import Documents from '../document/documents';
import { Mongo } from 'meteor/mongo';

const bound = Meteor.bindEnvironment((callback) => {callback();});

export default {
    getObli : () => [
        {name:"Technique",key:"o1",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Hayon",key:"o2",unit:"m",frequency:"6",alertUnit:"d",alert:"21"},
        {name:"Tachymètre",key:"o3",unit:"y",frequency:"4",alertUnit:"m",alert:"3"},
        {name:"Po... TBD",key:"o4",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"}
    ],
    getPrev : () => [
        {name:"Essuie glaces",key:"p1",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Batterie",key:"p2",unit:"m",frequency:"6",alertUnit:"km",alert:"100"},
        {name:"Plaque",key:"p3",unit:"y",frequency:"4",alertUnit:"km",alert:"100"},
        {name:"Disque",key:"p4",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Pneumatiques",key:"p5",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Bougies",key:"p6",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Ammortisseurs",key:"p7",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Filtre habitacle",key:"p8",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Filtre gazoil",key:"p9",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Filtre à air",key:"p10",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Filtre à huile",key:"p11",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"},
        {name:"Liquide de frein",key:"p12",unit:"km",frequency:"10000",alertUnit:"km",alert:"100"}
    ],
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
    getSignedStoredObjectDownloadLink: async (name) => {
        return new Promise((resolve, reject) => {
            try{
                let s3 = new AWS.S3({
                    region: 'eu-west-3',
                    apiVersion: '2006-03-01',
                    signatureVersion: 'v4'
                });
                const params = {
                    Bucket: "wg-logistique",
                    Key: name ,
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
    shipToBucket : async (file,societe,type,docId) => {
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
                        resolve({uploadSucces:true,data:data,fileInfo:fileInfo})
                    }
                });
            })
        })
    },
    deleteObjectAndDoc : async (name,docId) => {
        return new Promise((resolve,reject)=>{
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01',
                signatureVersion: 'v4'
            });
            let params = {
                Bucket: "wg-logistique", 
                Key: name
            };
            s3.deleteObject(params, function(err, data) {
                bound(()=>{
                    if(err){
                        resolve({deleteSucces:false,err:err})
                    }else{
                        Documents.remove({
                            _id:new Mongo.ObjectID(docId)
                        });
                        resolve({deleteSucces:true})
                    }
                });
            });
        })
    },
    deleteObject : async (name) => {
        return new Promise((resolve,reject)=>{
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01',
                signatureVersion: 'v4'
            });
            let params = {
                Bucket: "wg-logistique", 
                Key: name
            };
            s3.deleteObject(params, function(err, data) {
                bound(()=>{
                    if(err){
                        resolve({deleteSucces:false,err:err})
                    }else{
                        resolve({deleteSucces:true})
                    }
                });
            });
        });
    },
    getStoredObjectsList : async () => {
        return new Promise((resolve,rejectAllStoredObjects)=>{
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            })
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01',
                signatureVersion: 'v4'
            });
            const params = {
                Bucket: "wg-logistique"
            }
            const listAllKeys = (params, out = []) => new Promise((resolve, reject) => {
                s3.listObjectsV2(params).promise().then(({Contents, IsTruncated, NextContinuationToken}) => {
                    out.push(...Contents);
                    !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, {ContinuationToken: NextContinuationToken}), out));
                }).catch(reject);
            });
            listAllKeys(params).then(data=>{
                resolve({readSucces:true,list:data})
            }).catch(err=>{
                reject({readSucces:false,error:err})
            });
        });
    }
}