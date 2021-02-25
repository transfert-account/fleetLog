import Accidents from './accidents.js';
import Vehicles from '../vehicle/vehicles.js';
import Societes from '../societe/societes';
import Models from '../model/models';
import Brands from '../brand/brands';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const affectData = a => {
    if(a.societe != null && a.societe.length > 0){
        a.societe = Societes.findOne({_id:new Mongo.ObjectID(a.societe)});
    }else{
        a.societe = {_id:""};
    }
    if(a.vehicle != null && a.vehicle.length > 0){
        a.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(a.vehicle)});
        if(a.vehicle.brand != null && a.vehicle.brand.length > 0){
            a.vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(a.vehicle.brand)});
        }else{
            a.vehicle.brand = {_id:""};
        }
        if(a.vehicle.model != null && a.vehicle.model.length > 0){
            a.vehicle.model = Models.findOne({_id:new Mongo.ObjectID(a.vehicle.model)});
        }else{
            a.vehicle.model = {_id:""};
        }
        if(a.vehicle.energy != null && a.vehicle.energy.length > 0){
            a.vehicle.energy = Models.findOne({_id:new Mongo.ObjectID(a.vehicle.energy)});
        }else{
            a.vehicle.energy = {_id:""};
        }
    }else{
        a.vehicle = {_id:""};
    }
    if(a.constat != null && a.constat.length > 0){
        a.constat = Documents.findOne({_id:new Mongo.ObjectID(a.constat)});
    }else{
        a.constat = {_id:""};
    }
    if(a.rapportExp != null && a.rapportExp.length > 0){
        a.rapportExp = Documents.findOne({_id:new Mongo.ObjectID(a.rapportExp)});
    }else{
        a.rapportExp = {_id:""};
    }
    if(a.facture != null && a.facture.length > 0){
        a.facture = Documents.findOne({_id:new Mongo.ObjectID(a.facture)});
    }else{
        a.facture = {_id:""};
    }
}

export default {
    Query : {
        accident(obj, { _id }, {user}){
            let a = Accidents.findOne({_id:new Mongo.ObjectID(_id)});
            affectData(a);
            return a;
        },
        accidents(obj, args, {user}){
            let accidents = Accidents.find({}).fetch();
            accidents.map(a=>affectData(a))
            return accidents;
        },
        buAccidents(obj, args, {user}){
            let accidents = Accidents.find({societe:user.settings.visibility}).fetch();
            accidents.map(a=>affectData(a))
            return accidents;
        }
    },
    Mutation:{
        addAccident(obj, {vehicle,occurenceDate},{user}){
            if(user._id){
                let v = Vehicles.findOne({_id:new Mongo.ObjectID(vehicle)});
                let answers = [];
                for (let i = 0; i != 8 ; i++) {
                    answers.push({body:"",status:"virgin"})
                }
                Accidents.insert({
                    _id:new Mongo.ObjectID(),
                    societe:v.societe,
                    vehicle:vehicle,
                    occurenceDate:occurenceDate,
                    description:"",
                    dateExpert:"",
                    dateTravaux:"",
                    rapportExp:"",
                    constat:"",
                    facture:"",
                    constatSent:false,
                    archived:false,
                    cost:0,
                    answers:answers,
                    responsabilite:-1,
                    reglementAssureur:-1,
                    chargeSinistre:-1,
                    montantInterne:-1,
                    status:false
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editAccident(obj, {_id,occurenceDate,dateExpert,dateTravaux,constatSent,cost},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "occurenceDate":occurenceDate,
                            "dateExpert":dateExpert,
                            "dateTravaux":dateTravaux,
                            "constatSent":constatSent,
                            "cost":cost
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        editPECAccident(obj, {_id,responsabilite,reglementAssureur,chargeSinistre,montantInterne,status},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "responsabilite":responsabilite,
                            "reglementAssureur":reglementAssureur,
                            "chargeSinistre":chargeSinistre,
                            "montantInterne":montantInterne,
                            "status":status
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        editDescAccident(obj, {_id,description},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "description":description
                        }
                    }
                );                
                return [{status:true,message:"Notes concernant l'accident sauvegardées"}];
            }
            throw new Error('Unauthorized');
        },
        deleteAccident(obj, {_id},{user}){
            if(user._id){
                Accidents.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
        archiveAccident(obj, {_id},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":true
                        }
                    }   
                )
                return [{status:true,message:'Archivage réussi'}];
            }
            throw new Error('Unauthorized');
        },
        unArchiveAccident(obj, {_id},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":false
                        }
                    }   
                )
                return [{status:true,message:'Désarchivage réussi'}];
            }
            throw new Error('Unauthorized');
        },
        saveAnswers(obj,{_id,answers},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "answers":JSON.parse(answers)
                        }
                    }   
                )
                return [{status:true,message:'Réponses sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        async uploadAccidentDocument(obj, {_id,type,file,size},{user}){
            if(user._id){
                if(type != "constat" && type != "rapportExp" && type != "facture"){
                    return [{status:false,message:'Type de fichier innatendu (constat/rapportExp/facture)'}];
                }
                let accident = Accidents.findOne({_id:new Mongo.ObjectID(_id)});
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(accident.vehicle)});
                let societe = Societes.findOne({_id:new Mongo.ObjectID(vehicle.societe)});
                let docId = new Mongo.ObjectID();
                let oldFile = null;
                let deleteOld = false;
                if(type == "constat"){
                    if(accident.constat != null && accident.constat != undefined && accident.constat != ""){
                        deleteOld = true;
                        oldFile = Documents.findOne({_id:new Mongo.ObjectID(accident.constat)})
                    }
                }
                if(type == "rapportExp"){
                    if(accident.rapportExp != null && accident.rapportExp != undefined && accident.rapportExp != ""){
                        deleteOld = true;
                        oldFile = Documents.findOne({_id:new Mongo.ObjectID(accident.rapportExp)})
                    }
                }
                if(type == "facture"){
                    if(accident.facture != null && accident.facture != undefined && accident.facture != ""){
                        deleteOld = true;
                        oldFile = Documents.findOne({_id:new Mongo.ObjectID(accident.facture)})
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
                        Accidents.update(
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