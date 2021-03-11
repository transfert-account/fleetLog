import Functions from '../common/functions';
import Documents from '../document/documents';

export default {
    Query : {
        storedObject(obj, { name }, { user }){
            return {};
        },
        async storedObjects(obj, args, { user }){
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                    let data = await Functions.getStoredObjectsList()
                    if(data.readSucces){
                        resolve(data.list)
                    }else{
                        reject(["fail"])
                    }
                }).then(list=>{
                    storedObjects = list.map(x=>{return{name:x.Key}})
                    storedObjects.map((so,i)=>{
                        so.doc = Documents.find({_id:new Mongo.ObjectID(so.name.split(".")[0].split("_")[9])}).fetch()[0]
                        console.log("===="+i+"====")
                        docbyid = Documents.find({_id:new Mongo.ObjectID(so.name.split(".")[0].split("_")[9])}).fetch()[0]
                        docbyname = Documents.find({name:so.name}).fetch()[0]
                        console.log("byid : ");
                        console.log(docbyid);
                        console.log("byname : ");
                        console.log(docbyname);
                        console.log("============")
                        if(so.doc != null && so.doc.length > 0){
                            so.doc = Documents.findOne({_id:new Mongo.ObjectID(so.doc)});
                        }else{
                            so.doc = {_id:""};
                        }
                    })
                    return storedObjects;
                }).catch(e=>{
                    return [{e}];
                });
            }
        },
        async getSignedStoredObjectDownloadLink(obj, {name},{user}){
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                    let linkGenerationInfo = await Functions.getSignedStoredObjectDownloadLink(name)
                    resolve(linkGenerationInfo)
                }).then((linkGenerationInfo)=>{
                    return linkGenerationInfo.link;
                }).catch(e=>{
                    return e;
                });
            }
        }
    }
}