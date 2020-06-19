import Vehicles from './vehicles.js';
import Entretiens from '../entretien/entretiens';
import Societes from '../societe/societes.js';
import Licences from '../licence/licences';
import Volumes from '../volume/volumes.js';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Organisms from '../organism/organisms.js';
import PayementTimes from '../payementTime/payementTimes';
import Colors from '../color/colors.js';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import Documents from '../document/documents';
import Energies from '../energy/energies'
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const affectVehicleData = vehicle => {
    try{
        vehicle.lastKmUpdate = vehicle.kms[vehicle.kms.length-1].reportDate
        vehicle.km = vehicle.kms[vehicle.kms.length-1].kmValue
        if(vehicle.payementFormat == "CRB"){
            vehicle.property = false
        }else{
            vehicle.property = true
        }
        if(vehicle.societe != null && vehicle.societe.length > 0){
            vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(vehicle.societe)});
        }else{
            vehicle.societe = {_id:""};
        }
        if(vehicle.shared){
            vehicle.sharedTo = Societes.findOne({_id:new Mongo.ObjectID(vehicle.sharedTo)});
        }else{
            vehicle.sharedTo = {_id:""};
        }
        if(vehicle.brand != null && vehicle.brand.length > 0){
            vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(vehicle.brand)});
        }else{
            vehicle.brand = {_id:""};
        }
        if(vehicle.model != null && vehicle.model.length > 0){
            vehicle.model = Models.findOne({_id:new Mongo.ObjectID(vehicle.model)});
        }else{
            vehicle.model = {_id:""};
        }
        if(vehicle.payementOrg != null && vehicle.payementOrg.length > 0){
            vehicle.payementOrg = Organisms.findOne({_id:new Mongo.ObjectID(vehicle.payementOrg)});
        }else{
            vehicle.payementOrg = {_id:""};
        }
        if(vehicle.color != null && vehicle.color.length > 0){
            vehicle.color = Colors.findOne({_id:new Mongo.ObjectID(vehicle.color)});
        }else{
            vehicle.color = {_id:""};
        }
        if(vehicle.volume != null && vehicle.volume.length > 0){
            vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(vehicle.volume)});
        }else{
            vehicle.volume = {_id:""};
        }
        if(vehicle.energy != null && vehicle.energy.length > 0){
            vehicle.energy = Energies.findOne({_id:new Mongo.ObjectID(vehicle.energy)});
        }else{
            vehicle.energy = {_id:""};
        }
        if(vehicle.payementTime != null && vehicle.payementTime.length > 0){
            vehicle.payementTime = PayementTimes.findOne({_id:new Mongo.ObjectID(vehicle.payementTime)});
        }else{
            vehicle.payementTime = {_id:""};
        }
        vehicle.equipements = Equipements.find({vehicle:vehicle._id._str}).fetch() || {};
        vehicle.equipements.forEach((e,ei) => {
            e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
            if(e.controlTech != null && e.controlTech.length > 0){
                e.controlTech = Documents.findOne({_id:new Mongo.ObjectID(e.controlTech)});
            }else{
                e.controlTech = {_id:""};
            }
        });
        if(vehicle.cg != null && vehicle.cg.length > 0){
            vehicle.cg = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cg)});
        }else{
            vehicle.cg = {_id:""};
        }
        if(vehicle.cv != null && vehicle.cv.length > 0){
            vehicle.cv = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cv)});
        }else{
            vehicle.cv = {_id:""};
        }
        if(
            parseInt(vehicle.purchasePrice) > 0 &&
            parseInt(vehicle.insurancePaid) > 0 &&
            vehicle.payementBeginDate != "" &&
            vehicle.payementEndDate != "" &&
            vehicle.payementTime != "" &&
            parseInt(vehicle.monthlyPayement) > 0 &&
            vehicle.payementOrg != "" &&
            vehicle.payementFormat != ""
        ){
            vehicle.financialInfosComplete = true;
        }else{
            vehicle.financialInfosComplete = false;
        }
    }catch(e){
        console.error(e)
    }
}

export default {
    Query : {
        vehicle(obj, {_id}, { user }){
            let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
            affectVehicleData(vehicle)
            return vehicle;
        },
        vehicles(obj, args, { user }){
            let vehicles = Vehicles.find().fetch() || {};
            vehicles.forEach(v => {
                affectVehicleData(v)
            });
            return vehicles;
        },
        buVehicles(obj, args,{user}){
            let userFull = Meteor.users.findOne({_id:user._id});
            let vehicles = Vehicles.find({$or:[{sharedTo:userFull.settings.visibility},{societe:userFull.settings.visibility}]}).fetch() || {};
            vehicles.forEach(v => {
                affectVehicleData(v)
            });
            return vehicles;
        }
    },
    Mutation:{
        addVehicle(obj, {societe,registration,firstRegistrationDate,km,lastKmUpdate,brand,model,volume,payload,color,energy},{user}){
            if(user._id){
                Vehicles.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    registration:registration,
                    firstRegistrationDate:firstRegistrationDate,
                    brand:brand,
                    model:model,
                    volume:volume,
                    payload:payload,
                    color:color,
                    kms:[{
                        _id: new Mongo.ObjectID(),
                        kmValue:km,
                        reportDate:lastKmUpdate
                    }],
                    energy:energy,
                    archived:false,
                    archiveReason:"",
                    archiveDate:"",
                    cg:"",
                    cv:"",
                    shared:false,
                    sharedTo:"",
                    sharingReason:"",
                    sharedSince:"",
                    insurancePaid:0,
                    payementBeginDate:"",
                    payementEndDate:"",
                    purchasePrice:0,
                    monthlyPayement:0,
                    payementTime:"",
                    payementOrg:"",
                    payementFormat:""
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editVehicleTech(obj, {_id,societe,registration,firstRegistrationDate,brand,model,volume,payload,color,energy},{user}){
            if(user._id){
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
                if(vehicle.societe != societe){
                    let nL = Licences.find({vehicle:_id}).fetch().length
                    if(nL > 0){
                        return [{status:false,message:'Modification de société impossible : ' + nL + ' licence affectée'}];
                    }
                }
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "registration":registration,
                            "firstRegistrationDate":firstRegistrationDate,
                            "brand":brand,
                            "model":model,
                            "volume":volume,
                            "payload":payload,
                            "color":color,
                            "energy":energy
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        editVehicleFinances(obj, {_id,insurancePaid,endDate,property,purchasePrice,payementOrg,payementBeginDate,payementEndDate,payementTime,payementFormat,monthlyPayement},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "payementTime":payementTime,
                            "insurancePaid":insurancePaid,
                            "endDate":endDate,
                            "property":property,
                            "purchasePrice":purchasePrice,
                            "monthlyPayement":monthlyPayement,
                            "payementOrg":payementOrg,
                            "payementFormat":payementFormat,
                            "payementBeginDate":payementBeginDate,
                            "payementEndDate":payementEndDate
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        updateKm(obj, {_id,date,kmValue},{user}){
            if(user._id){
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
                if(!moment(vehicle.kms[vehicle.kms.length-1].reportDate, "DD/MM/YYYY").diff(moment(date, "DD/MM/YYYY"))){
                    return [{status:false,message:'Dernier relevé plus recent'}];
                }
                if(vehicle.kms[vehicle.kms.length-1].kmValue > kmValue){
                    return [{status:false,message:'Kilométrage du dernier relevé plus élevé'}];
                }
                /*if(moment(vehicle.lastKmUpdate, "DD/MM/YYYY").diff(moment())){
                    throw new Error("Date de relevé dans le futur");
                }*/
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "lastKmUpdate":date,
                            "km":kmValue
                        }
                    }   
                )
                Vehicles.update(
                    {
                        _id:new Mongo.ObjectID(_id)
                    },{
                        $push: {
                            "kms": {
                                _id: new Mongo.ObjectID(),
                                reportDate:date,
                                kmValue:kmValue
                            }
                        }
                    }
                )
                return [{status:true,message:'Nouveau relevé enregsitré'}];
            }
            throw new Error('Unauthorized');
        },
        deleteKm(obj, {vehicle,_id},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id:new Mongo.ObjectID(vehicle)
                    },{
                        $pull: {
                            "kms": {
                                _id: new Mongo.ObjectID(_id)
                            }
                        }
                    }
                )
                return [{status:true,message:'Relevé supprimé'}];
            }
            throw new Error('Unauthorized');
        },
        deleteVehicle(obj, {_id},{user}){
            if(user._id){
                let nL = Licences.find({vehicle:_id}).fetch().length
                let nE = Entretiens.find({vehicle:_id}).fetch().length
                let nQ = Equipements.find({vehicle:_id}).fetch().length
                if(nL + nE + nQ > 0){
                    let qrm = [];
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' licence(s) liée(s)'})}
                    if(nE > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nE + ' entretien(s) lié(s)'})}
                    if(nQ > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nQ + ' contrôle(s) lié(s)'})}
                    return qrm;
                }else{
                    Vehicles.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
        archiveVehicle(obj, {_id,archiveReason},{user}){
            if(archiveReason == ""){
                archiveReason = "Aucune données"
            }
            if(user._id){
                let vehicle = Vehicles.find({_id:new Mongo.ObjectID(_id)}).fetch()[0];
                if(vehicle.shared){
                    return [{status:false,message:"Impossible d'archiver un véhicule en prêt"}];
                }
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":true,
                            "archiveReason":archiveReason,
                            "archiveDate": new Date().getDate().toString().padStart(2,0) + '/' + parseInt(new Date().getMonth()+1).toString().padStart(2,0) + '/' + new Date().getFullYear()
                        }
                    }   
                )
                return [{status:true,message:'Archivage réussi'}];
            }
            throw new Error('Unauthorized');
        },
        unArchiveVehicle(obj, {_id},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":false,
                            "archiveReason":"",
                            "archiveDate":""
                        }
                    }   
                )
                return [{status:true,message:'Désarchivage réussi'}];
            }
            throw new Error('Unauthorized');
        },
        shareVehicle(obj, {_id,sharingReason,target},{user}){
            if(sharingReason == ""){
                sharingReason = "Aucune données"
            }
            if(user._id){
                let vehicle = Vehicles.find({_id:new Mongo.ObjectID(_id)}).fetch()[0];
                if(vehicle.archived){
                    return [{status:false,message:'Impossible de prêter un véhicule archivé'}];
                }
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "shared":true,
                            "sharedTo":target,
                            "sharingReason":sharingReason,
                            "sharedSince": new Date().getDate().toString().padStart(2,0) + '/' + parseInt(new Date().getMonth()+1).toString().padStart(2,0) + '/' + new Date().getFullYear()
                        }
                    }   
                )
                return [{status:true,message:'Prêt réussi'}];
            }
            throw new Error('Unauthorized');
        },
        unshareVehicle(obj, {_id},{user}){
            if(user._id){
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "shared":false,
                            "sharedTo":"",
                            "sharingReason":"",
                            "sharedSince": ""
                        }
                    }   
                )
                return [{status:true,message:'Désarchivage réussi'}];
            }
            throw new Error('Unauthorized');
        },
        async uploadVehicleDocument(obj, {_id,type,file,size},{user}){
            if(user._id){
                if(type != "cv" && type != "cg"){
                    return [{status:false,message:'Type de fichier innatendu (cv/cg)'}];
                }
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(_id)});
                let societe = Societes.findOne({_id:new Mongo.ObjectID(vehicle.societe)});
                let docId = new Mongo.ObjectID();
                let oldFile = null;
                let deleteOld = false;
                if(type == "cg"){
                    if(vehicle.cg != null && vehicle.cg != undefined && vehicle.cg != ""){
                        deleteOld = true;
                        oldFile = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cg)})
                    }
                }
                if(type == "cv"){
                    if(vehicle.cv != null && vehicle.cv != undefined && vehicle.cv != ""){
                        deleteOld = true;
                        oldFile = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cv)})
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
                        Vehicles.update(
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