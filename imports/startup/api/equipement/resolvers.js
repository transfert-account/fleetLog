import Equipements from './equipements.js';
import Vehicles from '../vehicle/vehicles.js';
import Societes from '../societe/societes.js';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        equipements(obj, args){
            return Equipements.find().fetch() || {};
        }
    },
    Mutation:{
        attachEquipementToVehicle(obj, {vehicle,equipementDescription,attachementDate,lastControl},{user}){
            if(user._id){
                Equipements.insert({
                    _id:new Mongo.ObjectID(),
                    vehicle:vehicle,
                    equipementDescription:equipementDescription,
                    attachementDate:attachementDate,
                    lastControl:lastControl,
                    controlTech:""
                });
                return true
            }
            throw new Error('Unauthorized');
        },
        dissociateEquipement(obj, {id}, {user}){
            if(user._id){
                Equipements.remove({
                    _id:new Mongo.ObjectID(id)
                });
                return true
            }else{
                return false
            }
        },
        updateControlEquipement(obj, {id,updatedControlValue}, {user}){
            if(user._id){
                Equipements.update(
                    {
                        _id: new Mongo.ObjectID(id)
                    }, {
                        $set: {
                            "lastControl":updatedControlValue
                        }
                    }
                );  
                return true
            }else{
                return false
            }
        },
        async uploadControlDocument(obj, {_id,type,file,size},{user}){
            if(user._id){
                if(type != "controlTech"){
                    return [{status:false,message:'Type de fichier innatendu (controlTech)'}];
                }
                let equipement = Equipements.findOne({_id:new Mongo.ObjectID(_id)});
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(equipement.vehicle)});
                let societe = Societes.findOne({_id:new Mongo.ObjectID(vehicle.societe)});
                let docId = new Mongo.ObjectID();
                let oldFile = null;
                let deleteOld = false;
                if(type == "controlTech"){
                    if(equipement.cg != null && equipement.controlTech != undefined && equipement.controlTech != ""){
                        deleteOld = true;
                        oldFile = Documents.findOne({_id:new Mongo.ObjectID(equipement.controlTech)})
                    }
                }
                return await new Promise(async (resolve,reject)=>{
                    await new Promise(async (resolve,reject)=>{
                        let uploadInfo = await Functions.shipToBucket(await file,societe,type,docId,deleteOld,oldFile)
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
                        Equipements.update(
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