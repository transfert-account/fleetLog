import Licences from './licences';
import Vehicles from '../vehicle/vehicles';
import Societes from '../societe/societes';
import Locations from '../location/locations';
import Volumes from '../volume/volumes';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        licence(obj, {_id}, { user }){
            return Licences.find({_id:_id}).fetch() || {};
        },
        licences(obj, args){
            let licences = Licences.find().fetch() || {};
            licences.forEach((l,i) => {
                if(l.societe != null && l.societe.length > 0){
                    licences[i].societe = Societes.findOne({_id:new Mongo.ObjectID(l.societe)});
                }else{
                    licences[i].societe = {_id:"",name:""};
                }
                if(l.vehicle != null && l.vehicle != undefined && l.vehicle != ""){
                    let vehicleId = l.vehicle
                    l.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(vehicleId)});
                    if(l.vehicle == null || l.vehicle == undefined || l.vehicle == ""){
                        l.vehicle = Locations.findOne({_id:new Mongo.ObjectID(vehicleId)});
                    }
                    if(l.vehicle.volume != null && l.vehicle.volume.length > 0){
                        l.vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(l.vehicle.volume)});
                    }else{
                        l.vehicle.volume = {_id:""};
                    }
                }
                if(l.licence != null && l.licence.length > 0){
                    l.licence = Documents.findOne({_id:new Mongo.ObjectID(l.licence)});
                }else{
                    l.licence = {_id:""};
                }
            });
            return licences;
        },
        buLicences(obj, args, { user }){
            let userFull = Meteor.users.findOne({_id:user._id});
            let licences = Licences.find({societe:userFull.settings.visibility}).fetch() || {};
            licences.forEach(l => {
                if(l.societe != null && l.societe.length > 0){
                    licences.societe = Societes.findOne({_id:new Mongo.ObjectID(l.societe)});
                }else{
                    licences.societe = {_id:"",name:""};
                }
                if(l.vehicle != null && l.vehicle != undefined && l.vehicle != ""){
                    let vehicleId = l.vehicle
                    l.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(vehicleId)});
                    if(l.vehicle == null || l.vehicle == undefined || l.vehicle == ""){
                        l.vehicle = Locations.findOne({_id:new Mongo.ObjectID(vehicleId)});
                    }
                    if(l.vehicle.volume != null && l.vehicle.volume.length > 0){
                        l.vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(l.vehicle.volume)});
                    }else{
                        l.vehicle.volume = {_id:""};
                    }
                }
                if(l.licence != null && l.licence.length > 0){
                    l.licence = Documents.findOne({_id:new Mongo.ObjectID(l.licence)});
                }else{
                    l.licence = {_id:""};
                }
            });
            return licences;
        }
    },
    Mutation:{
        addLicence(obj, {societe,number,vehicle,endDate},{user}){
            if(user._id){
                if(vehicle != ""){   
                    let licence = Licences.findOne({vehicle:vehicle});
                    if(licence != undefined){
                        return [{status:false,message:'Création impossible : véhicule déjà associé'}];
                    }
                }
                Licences.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    licence:"",
                    number:number,
                    vehicle:vehicle,
                    endDate:endDate,
                    shiftName:""
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteLicence(obj, {_id},{user}){
            if(user._id){
                Licences.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editLicence(obj, {_id,societe,number,shiftName,endDate},{user}){
            if(user._id){
                let licence = Licences.findOne({_id:new Mongo.ObjectID(_id)});
                if(licence.vehicle != "" && licence.vehicle != null && licence.vehicle != undefined && societe != licence.societe){
                    return [{status:false,message:'Modification de société impossible : véhicule affecté'}];
                }
                Licences.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "number":number,
                            "shiftName":shiftName,
                            "endDate":endDate
                        }
                    }
                ); 
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        unlinkLicence(obj, {_id},{user}){
            if(user._id){
                Licences.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "vehicle":""
                        }
                    }
                ); 
                return [{status:true,message:'Licence dissociée'}];
            }
            throw new Error('Unauthorized');
        },
        linkLicence(obj, {_id,vehicle},{user}){
            let licence = Licences.findOne({vehicle:vehicle});
            if(licence != undefined){
                return [{status:false,message:'Association impossible : véhicule déjà associé'}];
            }
            if(user._id){
                Licences.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "vehicle":vehicle
                        }
                    }
                ); 
                return [{status:true,message:'Véhicule associé à la licence'}];
            }
            throw new Error('Unauthorized');
        },
        async uploadLicenceDocument(obj, {_id,type,file,size},{user}){
            if(user._id){
                if(type != "licence"){
                    return [{status:false,message:'Type de fichier innatendu (licence)'}];
                }
                let licence = Licences.findOne({_id:new Mongo.ObjectID(_id)});
                let societe = Societes.findOne({_id:new Mongo.ObjectID(licence.societe)});
                let docId = new Mongo.ObjectID();
                let oldFile = null;
                let deleteOld = false;
                if(type == "licence"){
                    if(licence.licence != null && licence.licence != undefined && licence.licence != ""){
                        deleteOld = true;
                        oldFile = Documents.findOne({_id:new Mongo.ObjectID(licence.licence)})
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
                        Licences.update(
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