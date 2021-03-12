import Documents from './documents';
import { Mongo } from 'meteor/mongo';
import Functions from '../common/functions';

export default {
    Query : {
        documents(obj, {_id},{user}){
            return Documents.find().fetch()
        },
        async getSignedDocumentDownloadLink(obj, {_id},{user}){
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                    let doc = Documents.findOne({_id:new Mongo.ObjectID(_id)});
                    if(doc != null && doc != undefined){
                        let linkGenerationInfo = await Functions.getSignedDocumentDownloadLink(_id)
                        resolve(linkGenerationInfo)
                    }
                }).then((linkGenerationInfo)=>{
                    return linkGenerationInfo.link;
                }).catch(e=>{
                    return e;
                });
            }
        }
    }
}