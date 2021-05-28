import BatimentControls, { BATIMENT_CONTROLS } from './batimentControls.js';
import Societes from '../societe/societes';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const affectBatimentControlData = batimentControl => {
    batimentControl.societe = Societes.findOne({_id:new Mongo.ObjectID(batimentControl.societe)})
    if(batimentControl.ficheInter != null && batimentControl.ficheInter.length > 0){
        batimentControl.ficheInter = Documents.findOne({_id:new Mongo.ObjectID(batimentControl.ficheInter)});
    }else{
        batimentControl.ficheInter = {_id:""};
    }
}

export default {
    Query : {
        batimentControls(obj, args, {user}){
            let batimentControls = BATIMENT_CONTROLS(user);
            batimentControls.map(b=>affectBatimentControlData(b))
            return batimentControls;
        }
    },
    Mutation:{
        addBatimentControl(obj, {societe,name,delay,lastExecution},{user}){
            if(user._id){
                BatimentControls.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    name:name,
                    delay:delay,
                    ficheInter:"",
                    lastExecution:lastExecution
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        addBatimentControlGlobal(obj, {name,delay,lastExecution},{user}){
            if(user._id){
                let societes = Societes.find().fetch();
                societes.map(s=>{
                    BatimentControls.insert({
                        _id:new Mongo.ObjectID(),
                        societe:s._id._str,
                        name:name,
                        delay:delay,
                        ficheInter:"",
                        lastExecution:lastExecution
                    });
                })
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editBatimentControl(obj, {_id,name,delay},{user}){
            if(user._id){
                BatimentControls.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "name":name,
                            "delay":delay
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        updateBatimentControl(obj, {_id,lastExecution},{user}){
            if(user._id){
                BatimentControls.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "lastExecution":lastExecution
                        }
                    }
                );                
                return [{status:true,message:'Date du dernier contrôle sauvegardée'}];
            }
            throw new Error('Unauthorized');
        },
        deleteBatimentControl(obj, {_id},{user}){
            if(user._id){
                BatimentControls.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
        async uploadBatimentControlDocument(obj, {_id,type,file,size},{user}){
            if(user._id){
                if(type != "ficheInter"){
                    return [{status:false,message:'Type de fichier innatendu (ficheInter)'}];
                }
                let batimentControl = BatimentControls.findOne({_id:new Mongo.ObjectID(_id)});
                let societe = Societes.findOne({_id:new Mongo.ObjectID(batimentControl.societe)});
                let docId = new Mongo.ObjectID();
                return await new Promise(async (resolve,reject)=>{
                    await new Promise(async (resolve,reject)=>{
                        let uploadInfo = await Functions.shipToBucket(await file,societe,type,docId)
                        if(uploadInfo.uploadSucces){
                            resolve(uploadInfo)
                        }else{
                            reject(uploadInfo)
                        }
                    }).then((uploadInfo)=>{
                        Documents.insert({
                            _id:docId,
                            name:uploadInfo.fileInfo.docName,
                            size:size,
                            path:uploadInfo.data.Location,
                            originalFilename:uploadInfo.fileInfo.originalFilename,
                            ext:uploadInfo.fileInfo.ext,
                            mimetype:uploadInfo.fileInfo.mimetype,
                            type:type,
                            storageDate:moment().format('DD/MM/YYYY HH:mm:ss')
                        });
                        BatimentControls.update(
                            {
                                _id: new Mongo.ObjectID(_id)
                            }, {
                                $set: {
                                    [type]:docId._str
                                }
                            }   
                        )
                        resolve(uploadInfo)
                    }).catch(e=>{
                        reject(e)
                    })
                }).then((uploadInfo)=>{
                    return [{status:true,message:'Document sauvegardé'}];
                }).catch(e=>{
                    return [{status:false,message:'Erreur durant le traitement : ' + e}];
                });
            }
        }
    }
}