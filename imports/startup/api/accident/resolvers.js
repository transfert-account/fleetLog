import Accidents from './accidents.js';
import Vehicles from '../vehicle/vehicles.js';
import Locations from '../location/locations.js';
import Societes from '../societe/societes';
import Models from '../model/models';
import Brands from '../brand/brands';
import Energies from '../energy/energies';
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
        let v = Vehicles.findOne({_id:new Mongo.ObjectID(a.vehicle)});
        if(v == null || v == undefined){
            v = Locations.findOne({_id:new Mongo.ObjectID(a.vehicle)});
        }
        a.vehicle = v;
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
            a.vehicle.energy = Energies.findOne({_id:new Mongo.ObjectID(a.vehicle.energy)});
        }else{
            a.vehicle.energy = {_id:""};
        }
        if(a.vehicle.societe != null && a.vehicle.societe.length > 0){
            a.vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(a.vehicle.societe)});
        }else{
            a.vehicle.societe = {_id:""};
        }
        if(a.vehicle.shared && a.vehicle.sharedTo != null && a.vehicle.sharedTo.length > 0){
            a.vehicle.sharedTo = Societes.findOne({_id:new Mongo.ObjectID(a.vehicle.sharedTo)});
        }else{
            a.vehicle.sharedTo = {_id:""};
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
    if(a.questionary != null && a.questionary.length > 0){
        a.questionary = Documents.findOne({_id:new Mongo.ObjectID(a.questionary)});
    }else{
        a.questionary = {_id:""};
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
                let v;
                v = Vehicles.findOne({_id:new Mongo.ObjectID(vehicle)});
                if(v == null){
                    v = Locations.findOne({_id:new Mongo.ObjectID(vehicle)});
                }
                Accidents.insert({
                    _id:new Mongo.ObjectID(),
                    societe:v.societe,
                    vehicle:vehicle,
                    occurenceDate:occurenceDate,
                    driver:"",
                    description:"",
                    dateExpert:"",
                    dateTravaux:"",
                    rapportExp:"",
                    constat:"",
                    facture:"",
                    questionary:"",
                    constatSent:"no",
                    archived:false,
                    responsabilite:0,
                    reglementAssureur:0,
                    chargeSinistre:0,
                    montantInterne:0,
                    status:true,
                    answers:[
                        {
                          page:1,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""}
                          ]
                        },{
                          page:2,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""},
                            {index:3,status:"virgin",answer:""},
                            {index:4,status:"virgin",answer:""}
                          ]
                        },{
                          page:3,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""},
                            {index:3,status:"virgin",answer:""}
                          ]
                        },{
                          page:4,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""},
                            {index:3,status:"virgin",answer:""},
                            {index:4,status:"virgin",answer:""}
                          ]
                        },{
                          page:5,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""},
                            {index:3,status:"virgin",answer:""},
                            {index:4,status:"virgin",answer:""}
                          ]
                        },{
                          page:6,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""}
                          ]
                        },{
                          page:7,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""},
                            {index:3,status:"virgin",answer:""}
                          ]
                        },{
                          page:8,
                          fields:[
                            {index:1,status:"virgin",answer:""},
                            {index:2,status:"virgin",answer:""}
                          ]
                        }
                    ]
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editAccident(obj, {_id,occurenceDate,driver,dateExpert,dateTravaux,constatSent},{user}){
            if(user._id){
                Accidents.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "occurenceDate":occurenceDate,
                            "driver":driver,
                            "dateExpert":dateExpert,
                            "dateTravaux":dateTravaux,
                            "constatSent":constatSent
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
                if(type != "constat" && type != "rapportExp" && type != "facture" && type != "questionary"){
                    return [{status:false,message:'Type de fichier innatendu (constat/rapportExp/facture/questionary)'}];
                }
                let accident = Accidents.findOne({_id:new Mongo.ObjectID(_id)});
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(accident.vehicle)});
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