import AWS from 'aws-sdk';
import moment from 'moment';

export default {
    shipToBucket : async (file,societe,type) => {
        return new Promise((resolve,reject)=>{
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
}