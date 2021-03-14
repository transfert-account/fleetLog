import Equipements from './equipements.js';
import Vehicles from '../vehicle/vehicles.js';
import Societes from '../societe/societes.js';
import Documents from '../document/documents';
import Functions from '../common/functions';
import Entretiens from '../entretien/entretiens.js';

import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        equipements(obj, args){
            let equipements = Equipements.find().fetch() || {};
            equipements.forEach(e => {
                if(e.entretien != null && e.entretien != undefined && e.entretien != ""){
                    let entretienId = e.entretien
                    e.entretien = Entretiens.findOne({_id:new Mongo.ObjectID(entretienId)});
                }
            });
            return equipements;
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
                    entretienCreated:false,
                    entretien:"",
                    controlTech:""
                });
                return [{status:true,message:"Contrôle associé"}];
            }
            throw new Error('Unauthorized');
        },
        dissociateEquipement(obj, {_id}, {user}){
            Entretiens.remove({
                control:_id
            });
            if(user._id){
                Equipements.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:"Contrôle dissocié"}];
            }else{
                return [{status:false,message:"Erreur durant la dissociation"}];
            }
        },
        updateControlEquipement(obj, {_id,updatedControlValue}, {user}){
            if(user._id){
                Equipements.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "lastControl":updatedControlValue
                        }
                    }
                );  
                return [{status:true,message:"Controôle mis à jour"}];
            }else{
                return [{status:false,message:"Erreur durant la mise à jour"}];
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