import Entretiens from './entretiens';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations';
import Commandes from '../commande/commandes';
import Pieces from '../piece/pieces';
import Volumes from '../volume/volumes.js';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Organisms from '../organism/organisms.js';
import Colors from '../color/colors.js';
import Societes from '../societe/societes';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const affectEntretienData = (e,i,entretiens) => {
    try{
        e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
        e.commandes.forEach(c => {
            c.piece = Pieces.findOne({_id:new Mongo.ObjectID(c.piece)});
        });
        if(Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)}) == undefined){
            e.vehicle = Locations.findOne({_id:new Mongo.ObjectID(e.vehicle)});
        }else{
            e.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});
        }
        e.vehicle.lastKmUpdate = e.vehicle.kms[e.vehicle.kms.length-1].reportDate
        e.vehicle.km = e.vehicle.kms[e.vehicle.kms.length-1].kmValue
        if(e.vehicle.societe != null && e.vehicle.societe.length > 0){
            entretiens[i].vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.societe)});
        }else{
            entretiens[i].vehicle.societe = {_id:"",name:""};
        }
        if(e.vehicle.brand != null && e.vehicle.brand.length > 0){
            e.vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(e.vehicle.brand)});
        }else{
            e.vehicle.brand = {_id:""};
        }
        if(e.vehicle.model != null && e.vehicle.model.length > 0){
            e.vehicle.model = Models.findOne({_id:new Mongo.ObjectID(e.vehicle.model)});
        }else{
            e.vehicle.model = {_id:""};
        }
        if(e.vehicle.payementOrg != null && e.vehicle.payementOrg.length > 0){
            e.vehicle.payementOrg = Organisms.findOne({_id:new Mongo.ObjectID(e.vehicle.payementOrg)});
        }else{
            e.vehicle.payementOrg = {_id:""};
        }
        if(e.vehicle.color != null && e.vehicle.color.length > 0){
            e.vehicle.color = Colors.findOne({_id:new Mongo.ObjectID(e.vehicle.color)});
        }else{
            e.vehicle.color = {_id:""};
        }
        if(e.vehicle.volume != null && e.vehicle.volume.length > 0){
            e.vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(e.vehicle.volume)});
        }else{
            e.vehicle.volume = {_id:""};
        }
        if(e.vehicle.shared){
            e.vehicle.sharedTo = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.sharedTo)});
        }else{
            e.vehicle.sharedTo = {_id:""};
        }
        if(e.societe != null && e.societe.length > 0){
            e.societe = Societes.findOne({_id:new Mongo.ObjectID(e.societe)});
        }else{
            e.societe = {_id:"",name:""};
        }
        e.piece = Pieces.findOne({_id:new Mongo.ObjectID(e.piece)});
        if(e.ficheInter != null && e.ficheInter.length > 0){
            e.ficheInter = Documents.findOne({_id:new Mongo.ObjectID(e.ficheInter)});
        }else{
            e.ficheInter = {_id:""};
        }
        if(e.control != null && e.control.length > 0){
            e.control = Equipements.findOne({_id:new Mongo.ObjectID(e.control)});
            if(e.control.equipementDescription != null && e.control.equipementDescription.length > 0){
                e.control.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.control.equipementDescription)});
            }
        }
    }catch(err){
        console.log(err)
    }
}

const affectUserData = e => {
    try{
       if(e.user != ""){
           e.user = Meteor.users.findOne({_id:e.user});
       }
    }catch(e){
        console.log(e)
    }
}


export default {
    Query : {
        entretiens(obj, args,{user}){
            let entretiens = Entretiens.find().fetch() || {};
            entretiens.forEach((e,i) => {
                affectEntretienData(e,i,entretiens);
            });
            return entretiens;
        },
        buEntretiens(obj, args,{user}){
            let userFull = Meteor.users.findOne({_id:user._id});
            let entretiens = Entretiens.find().fetch() || {};
            entretiens.forEach((e,i) => {
                affectEntretienData(e,i,entretiens);
            });
            entretiens = entretiens.filter(e=>{
                return e.vehicle.societe._id == userFull.settings.visibility || e.vehicle.sharedTo._id == userFull.settings.visibility
            });
            return entretiens;
        },
        buEntretiensOfTheDay(obj, {date},{user}){
            let userFull = Meteor.users.findOne({_id:user._id});
            let entretiens = Entretiens.find({societe:userFull.settings.visibility}).fetch().filter(e=>moment(e.occurenceDate,"DD/MM/YYYY").isSame(moment(date,"DD/MM/YYYY"), 'day'))
            entretiens.forEach((e,i) => {
                affectEntretienData(e,i,entretiens);
                affectUserData(e)
            });
            return entretiens;
        },
        entretiensOfTheDay(obj, {date},{user}){
            let entretiens = Entretiens.find().fetch().filter(e=>moment(e.occurenceDate,"DD/MM/YYYY").isSame(moment(date,"DD/MM/YYYY"), 'day'))
            entretiens.forEach((e,i) => {
                affectEntretienData(e,i,entretiens);
                affectUserData(e)
            });
            return entretiens;
        },
        myEntretiens(obj, args,{user}){
            let entretiens = Entretiens.find({user:user._id}).fetch() || {};
            entretiens.forEach((e,i) => {
                affectEntretienData(e,i,entretiens);
            });
            return entretiens;
        },
        unaffectedEntretiens(obj, args,{user}){
            let entretiens = Entretiens.find({user:"",archived:false}).fetch() || {};
            entretiens.forEach((e,i) => {
                e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
                e.commandes.forEach(c => {
                    c.piece = Pieces.findOne({_id:new Mongo.ObjectID(c.piece)});
                });
            });
            entretiens.map(e=>{
                let lowestStatus = 3;
                e.commandes.map(c=>{
                    if(c.status != 3){
                        lowestStatus = c.status
                    }
                })
                if(lowestStatus != 3){
                    e.ready = false
                }else{
                    e.ready = true
                }
            })
            entretiens = entretiens.filter(e=>e.ready);
            entretiens.forEach((e,i) => {
                affectEntretienData(e,i,entretiens);
            });
            return entretiens;
        },
        buUnaffectedEntretiens(obj, args,{user}){
            let userFull = Meteor.users.findOne({_id:user._id});
            let entretiens = Entretiens.find({societe:userFull.settings.visibility,user:""}).fetch() || {};
            entretiens.forEach((e,i) => {
                e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
                e.commandes.forEach(c => {
                    c.piece = Pieces.findOne({_id:new Mongo.ObjectID(c.piece)});
                });
            });
            entretiens.map(e=>{
                let lowestStatus = 3;
                e.commandes.map(c=>{
                    if(c.status != 3){
                        lowestStatus = c.status
                    }
                })
                if(lowestStatus != 3){
                    e.ready = false
                }else{
                    e.ready = true
                }
            })
            entretiens = entretiens.filter(e=>e.ready);
            entretiens.forEach((e,i) => {
                affectEntretienData(e,i,entretiens);
            });
            return entretiens;
        },
        entretien(obj, {_id},{user}){
            let entretien = Entretiens.findOne({_id:new Mongo.ObjectID(_id)});
            if(Vehicles.findOne({_id:new Mongo.ObjectID(entretien.vehicle)}) == undefined){
                entretien.vehicle = Locations.findOne({_id:new Mongo.ObjectID(entretien.vehicle)});
            }else{
                entretien.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(entretien.vehicle)});    
            }
            entretien.vehicle.lastKmUpdate = entretien.vehicle.kms[entretien.vehicle.kms.length-1].reportDate
            entretien.vehicle.km = entretien.vehicle.kms[entretien.vehicle.kms.length-1].kmValue
            if(entretien.vehicle.societe != null && entretien.vehicle.societe.length > 0){
                entretien.vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(entretien.vehicle.societe)});
            }else{
                entretien.vehicle.societe = {_id:"",name:""};
            }
            if(entretien.vehicle.brand != null && entretien.vehicle.brand.length > 0){
                entretien.vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(entretien.vehicle.brand)});
            }else{
                entretien.vehicle.brand = {_id:""};
            }
            if(entretien.vehicle.model != null && entretien.vehicle.model.length > 0){
                entretien.vehicle.model = Models.findOne({_id:new Mongo.ObjectID(entretien.vehicle.model)});
            }else{
                entretien.vehicle.model = {_id:""};
            }
            if(entretien.vehicle.payementOrg != null && entretien.vehicle.payementOrg.length > 0){
                entretien.vehicle.payementOrg = Organisms.findOne({_id:new Mongo.ObjectID(entretien.vehicle.payementOrg)});
            }else{
                entretien.vehicle.payementOrg = {_id:""};
            }
            if(entretien.vehicle.color != null && entretien.vehicle.color.length > 0){
                entretien.vehicle.color = Colors.findOne({_id:new Mongo.ObjectID(entretien.vehicle.color)});
            }else{
                entretien.vehicle.color = {_id:""};
            }
            if(entretien.vehicle.volume != null && entretien.vehicle.volume.length > 0){
                entretien.vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(entretien.vehicle.volume)});
            }else{
                entretien.vehicle.volume = {_id:""};
            }
            entretien.piece = Pieces.findOne({_id:new Mongo.ObjectID(entretien.piece)});
            if(entretien.ficheInter != null && entretien.ficheInter.length > 0){
                entretien.ficheInter = Documents.findOne({_id:new Mongo.ObjectID(entretien.ficheInter)});
            }else{
                entretien.ficheInter = {_id:""};
            }
            if(entretien.control != null && entretien.control.length > 0){
                entretien.control = Equipements.findOne({_id:new Mongo.ObjectID(entretien.control)});
            }
            return entretien;
        }
    },
    Mutation:{
        addEntretien(obj, {vehicle},{user}){
            if(user._id){
                let v = Vehicles.findOne({_id:new Mongo.ObjectID(vehicle)});
                Entretiens.insert({
                    _id:new Mongo.ObjectID(),
                    piece:"",
                    vehicle:vehicle,
                    description:"",
                    title:"",
                    ficheInter:"",
                    archived:false,
                    occurenceDate:"",
                    user:"",
                    time:0,
                    status:1,
                    societe:v.societe,
                    fromControl:false,
                    control:null
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        createEntretienFromControl(obj, {control},{user}){
            if(user._id){
                let e = Equipements.findOne({_id:new Mongo.ObjectID(control)})
                let ed = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)})
                let v = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});
                let entretienId = new Mongo.ObjectID();
                Entretiens.insert({
                    _id:entretienId,
                    piece:"",
                    title:"Contrôle : " + ed.name,
                    description:"Entretien généré manuellement par le contrôle lié au véhicule " + v.registration,
                    vehicle:e.vehicle,
                    ficheInter:"",
                    archived:false,
                    occurenceDate:"",
                    user:"",
                    time:0,
                    status:1,
                    societe:v.societe,
                    fromControl:true,
                    control:control
                });
                Equipements.update(
                    {
                        _id: new Mongo.ObjectID(control)
                    },{
                        $set: {
                            entretien:entretienId._str,
                            entretienCreated:true
                        }
                    },
                    {multi:true}
                );
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteEntretien(obj, {_id},{user}){
            if(user._id){
                let nC = Commandes.find({entretien:_id}).fetch().length
                if(nC > 0){
                    let qrm = [];
                    if(nC > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nC + ' commande(s) liée(s)'})}
                    return qrm;
                }else{
                    Equipements.update(
                        {
                            entretien: _id
                        },{
                            $set: {
                                entretien:"",
                                entretienCreated:false
                            }
                        },
                        {multi:true}
                    );
                    Entretiens.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
        archiveEntretien(obj, {_id,archived},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":archived
                        }
                    }
                ); 
                return [{status:true,message:'Entretien archivé'}];
            }
            throw new Error('Unauthorized');
        },
        disArchiveEntretien(obj, {_id,archived},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "archived":archived
                        }
                    }
                ); 
                return [{status:true,message:'Entretien de nouveau ouvert'}];
            }
            throw new Error('Unauthorized');
        },
        editDesc(obj, {_id,description},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "description":description
                        }
                    }
                ); 
                return [{status:true,message:'Description sauvegardée'}];
            }
            throw new Error('Unauthorized');
        },
        editTitle(obj, {_id,title},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "title":title
                        }
                    }
                ); 
                return [{status:true,message:'Titre sauvegardé'}];
            }
            throw new Error('Unauthorized');
        },
        editInfos(obj, {_id,time,status},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "time":time,
                            "status":status
                        }
                    }
                ); 
                return [{status:true,message:'Informations sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        affectToMe(obj, {_id,occurenceDate},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "user":user._id,
                            "occurenceDate":occurenceDate
                        }
                    }
                ); 
                return [{status:true,message:'Entretien affecté'}];
            }
            throw new Error('Unauthorized');
        },
        release(obj, {_id},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "user":"",
                            "occurenceDate":""
                        }
                    }
                ); 
                return [{status:true,message:'Entretien relaché'}];
            }
            throw new Error('Unauthorized');
        },
        async uploadEntretienDocument(obj, {_id,type,file,size},{user}){
            if(user._id){
                if(type != "ficheInter"){
                    return [{status:false,message:'Type de fichier innatendu (ficheInter)'}];
                }
                let entretien = Entretiens.findOne({_id:new Mongo.ObjectID(_id)});
                let vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(entretien.vehicle)});
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
                        Entretiens.update(
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