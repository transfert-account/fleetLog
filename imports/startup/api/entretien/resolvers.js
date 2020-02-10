import Entretiens from './entretiens';
import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations';
import Commandes from '../commande/commandes';
import Pieces from '../piece/pieces';
import Societes from '../societe/societes';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        entretiens(obj, args,{user}){
            let entretiens = Entretiens.find().fetch() || {};
            entretiens.forEach((e,i) => {
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
                e.piece = Pieces.findOne({_id:new Mongo.ObjectID(e.piece)});
            });
            return entretiens;
        },
        entretiensOfTheDay(obj, {date},{user}){
            let entretiens = Entretiens.find({user:user._id}).fetch().filter(e=>moment(e.occurenceDate,"DD/MM/YYYY").isSame(moment(date,"DD/MM/YYYY"), 'day'))//log this
            entretiens.forEach((e,i) => {
                if(Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)}) == undefined){
                    e.vehicle = Locations.findOne({_id:new Mongo.ObjectID(e.vehicle)});
                }else{
                    e.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});
                }
                e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
                e.commandes.forEach(c => {
                    c.piece = Pieces.findOne({_id:new Mongo.ObjectID(c.piece)});
                });
                if(e.vehicle.societe != null && e.vehicle.societe.length > 0){
                    entretiens[i].societe = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.societe)});
                }else{
                    entretiens[i].societe = {_id:"",name:""};
                }
            });
            return entretiens;
        },
        myEntretiens(obj, args,{user}){
            let entretiens = Entretiens.find({user:user._id}).fetch() || {};
            entretiens.forEach((e,i) => {
                if(Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)}) == undefined){
                    e.vehicle = Locations.findOne({_id:new Mongo.ObjectID(e.vehicle)});
                }else{
                    e.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});    
                }
                if(e.vehicle.societe != null && e.vehicle.societe.length > 0){
                    entretiens[i].societe = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.societe)});
                }else{
                    entretiens[i].societe = {_id:"",name:""};
                }
                e.piece = Pieces.findOne({_id:new Mongo.ObjectID(e.piece)});
            });
            return entretiens;
        },
        unaffectedEntretiens(obj, args,{user}){
            let entretiens = Entretiens.find({user:""}).fetch() || {};
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
                if(Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)}) == undefined){
                    e.vehicle = Locations.findOne({_id:new Mongo.ObjectID(e.vehicle)});
                }else{
                    e.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});    
                }
                if(e.vehicle.societe != null && e.vehicle.societe.length > 0){
                    entretiens[i].societe = Societes.findOne({_id:new Mongo.ObjectID(e.vehicle.societe)});
                }else{
                    entretiens[i].societe = {_id:"",name:""};
                }
                e.piece = Pieces.findOne({_id:new Mongo.ObjectID(e.piece)});
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
            entretien.piece = Pieces.findOne({_id:new Mongo.ObjectID(entretien.piece)});
            return entretien;
        }
    },
    Mutation:{
        addEntretien(obj, {vehicle},{user}){
            if(user._id){
                Entretiens.insert({
                    _id:new Mongo.ObjectID(),
                    piece:"",
                    vehicle:vehicle,
                    description:"",
                    archived:false,
                    occurenceDate:"",
                    user:"",
                    time:0,
                    status:1
                });
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
        }
    }
}