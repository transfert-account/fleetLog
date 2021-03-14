import Batiments from './batiments.js';
import Societes from '../societe/societes';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const affectBatimentControls = batiment => {
    batiment.controls = Batiments.find({societe:batiment.societe._id._str}).fetch()
    batiment.controls.map(bc=>{
        if(bc.ficheInter != null && bc.ficheInter.length > 0){
            bc.ficheInter = Documents.findOne({_id:new Mongo.ObjectID(bc.ficheInter)});
        }else{
            bc.ficheInter = {_id:""};
        }
    })
}

export default {
    Query : {
        batiment(obj, args, {user}){
            let societes = Societes.findOne({_id:user.settings.visibility}) || {};
            let batiments = societes.map(s=>{return{societe:s,controls:[]}});
            batiments.map(b=>affectBatimentControls(b))
            return batiments;
        },
        batiments(obj, args, {user}){
            let societes = Societes.find().fetch() || {};
            let batiments = societes.map(s=>{return{societe:s,controls:[]}});
            batiments.map(b=>affectBatimentControls(b))
            return batiments;
        },
        buBatiments(obj, args, {user}){
            let societes = Societes.find({_id: new Mongo.ObjectID(user.settings.visibility)}).fetch() || {};
            let batiments = societes.map(s=>{return{societe:s,controls:[]}});
            batiments.map(b=>affectBatimentControls(b))
            return batiments;
        }
    },
    Mutation:{
        addBatimentControl(obj, {societe,name,delay,lastExecution},{user}){
            if(user._id){
                Batiments.insert({
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
                    Batiments.insert({
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
                Batiments.update(
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
                Batiments.update(
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
                Batiments.remove({
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
                let batimentControl = Batiments.findOne({_id:new Mongo.ObjectID(_id)});
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
                        Batiments.update(
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