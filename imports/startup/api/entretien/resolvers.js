import Entretiens from './entretiens';
import InterventionNature from '../interventionNature/interventionNatures';
import Vehicles from '../vehicle/vehicles';
import Commandes from '../commande/commandes';
import Pieces from '../piece/pieces';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Energies from '../energy/energies';
import Societes from '../societe/societes';
import Documents from '../document/documents';
import Functions from '../common/functions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const affectEntretienData = (e,i,entretiens) => {
    try{
        e.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});
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
        if(e.vehicle.shared){
            e.vehicle.sharedTo = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.sharedTo)});
        }else{
            e.vehicle.sharedTo = {_id:""};
        }
        if(e.originNature != null){
            e.originNature = InterventionNature.findOne({_id:new Mongo.ObjectID(e.originNature)});
        }else{e.originNature = null;}
        if(e.originControl != null){
            if(e.originControl[0] == "o"){
                e.originControl = Functions.getObli().filter(c=>c.key == e.originControl)[0];
            }else{
                e.originControl = Functions.prev().filter(c=>c.key == e.originControl)[0];
            }
        }else{
            e.originControl = null;
        }
    }catch(err){
        console.log(err)
    }
}

const affectEntretienFullData = e => {
    try{
        e.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});
        e.vehicle.lastKmUpdate = e.vehicle.kms[e.vehicle.kms.length-1].reportDate
        e.vehicle.km = e.vehicle.kms[e.vehicle.kms.length-1].kmValue
        //Societe du vehicule
        if(e.vehicle.societe != null && e.vehicle.societe.length > 0){
            e.vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.societe)});
        }else{
            e.vehicle.societe = {_id:"",name:""};
        }
        //Marque
        if(e.vehicle.brand != null && e.vehicle.brand.length > 0){
            e.vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(e.vehicle.brand)});
        }else{
            e.vehicle.brand = {_id:""};
        }
        //Model
        if(e.vehicle.model != null && e.vehicle.model.length > 0){
            e.vehicle.model = Models.findOne({_id:new Mongo.ObjectID(e.vehicle.model)});
        }else{
            e.vehicle.model = {_id:""};
        }
        //Energie
        if(e.vehicle.energy != null && e.vehicle.energy.length > 0){
            e.vehicle.energy = Energies.findOne({_id:new Mongo.ObjectID(e.vehicle.energy)});
        }else{
            e.vehicle.energy = {_id:""};
        }
        //Vehicule opéré par
        if(e.vehicle.shared){
            e.vehicle.sharedTo = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.sharedTo)});
        }else{
            e.vehicle.sharedTo = {_id:""};
        }
        //Origin : nature / controle
        if(e.originNature != null){
            e.originControl = null;
            e.originNature = InterventionNature.findOne({_id:new Mongo.ObjectID(e.originNature)});
        }else{
            e.originNature = null;
            if(e.originControl[0] == "o"){
                e.originControl = Functions.getObli().filter(c=>c.key == e.originControl)[0];
            }else{
                e.originControl = Functions.getPrev().filter(c=>c.key == e.originControl)[0];
            }
        }
        //Pieces
        e.piecesQty.map(p=>{
            p.piece = Pieces.find({_id:new Mongo.ObjectID(p.piece)}).fetch()[0];
        })
        //Docs
        if(e.ficheInter != null && e.ficheInter.length > 0){
            e.ficheInter = Documents.findOne({_id:new Mongo.ObjectID(e.ficheInter)});
        }else{
            e.ficheInter = {_id:""};
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
            affectEntretienFullData(entretien)            
            return entretien;
        }
    },
    Mutation:{
        createEntretien(obj, {vehicle,nature,pieces},{user}){
            if(user._id){
                let v = Vehicles.findOne({_id:new Mongo.ObjectID(vehicle)});
                let newId = new Mongo.ObjectID()._str;
                console.log(newId);
                Entretiens.insert({
                    _id:new Mongo.ObjectID(newId),
                    type:"cura",
                    originNature:nature,
                    originControl:null,
                    vehicle:vehicle,
                    piecesQty:JSON.parse(pieces),
                    status:0,
                    time:0,
                    notes:[{
                        _id:new Mongo.ObjectID(),
                        text:"Entretien curatif généré manuellement",
                        date:moment().format('DD/MM/YYYY HH:mm:ss')
                    }],
                    archived:false,
                    user:"",
                });
                return [{status:true,message:'Création réussie',obj:newId}];
            }
            throw new Error('Unauthorized');
        },
        createEntretienFromControl(obj, {vehicle,control},{user}){
            if(user._id){
                let entretienId = new Mongo.ObjectID()
                let v = Vehicles.findOne({_id:new Mongo.ObjectID(vehicle)});
                Entretiens.insert({
                    _id:entretienId,
                    type:(control[0]=="o" ? "obli" : "prev"),
                    originNature:null,
                    originControl:control,
                    vehicle:vehicle,
                    piecesQty:[],
                    status:0,
                    time:0,
                    notes:[{
                        _id:new Mongo.ObjectID(),
                        text:"Entretien généré manuellement par le contrôle lié au véhicule " + v.registration,
                        date:moment().format('DD/MM/YYYY HH:mm:ss')
                    }],
                    archived:false,
                    user:"",
                });
                Vehicles.update(
                    {
                        _id: new Mongo.ObjectID(vehicle),
                        [(control[0] == "o" ? "obli" : "prev")+".key"]: control
                    }, {
                        $set: {
                            [(control[0] == "o" ? "obli" : "prev")+".$.entretien"]: entretienId._str
                        }
                    }
                )
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteEntretien(obj, {_id},{user}){
            if(user._id){
                let e = Entretiens.findOne({_id:new Mongo.ObjectID(_id)});
                if(e.type != "cura"){
                    Vehicles.update(
                        {
                            _id: new Mongo.ObjectID(e.vehicle),
                            [(e.originControl[0] == "o" ? "obli" : "prev")+".key"]: e.originControl
                        }, {
                            $set: {
                                [(e.originControl[0] == "o" ? "obli" : "prev")+".$.entretien"]: null
                            }
                        }
                    )
                }
                Entretiens.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
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
        addNote(obj, {_id,note},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $push: {
                            "notes": {
                                _id: new Mongo.ObjectID(),
                                text:note,
                                date:moment().format('DD/MM/YYYY HH:mm:ss')
                            }
                        }
                    }
                ); 
                return [{status:true,message:'Note sauvegardée'}];
            }
            throw new Error('Unauthorized');
        },
        deleteNote(obj, {entretien,_id},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id:new Mongo.ObjectID(entretien)
                    },{
                        $pull: {
                            "notes": {
                                _id: new Mongo.ObjectID(_id)
                            }
                        }
                    }
                )
                return [{status:true,message:'Note supprimée'}];
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
        editPieces(obj, {_id,pieces},{user}){
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "piecesQty":JSON.parse(pieces),
                        }
                    }
                ); 
                return [{status:true,message:'Pièces sauvegardées'}];
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