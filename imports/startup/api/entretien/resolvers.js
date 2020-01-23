import Entretiens from './entretiens';
import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations';
import Pieces from '../piece/pieces';
import Societes from '../societe/societes';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        entretiens(obj, args,{user}){
            let entretiens = Entretiens.find().fetch() || {};
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
        entretiensOfTheDay(obj, {date},{user}){
            let entretiens = Entretiens.find({user:user._id}).fetch().filter(e=>moment(e.occurenceDate,"DD/MM/YYYY").isSame(date, 'day'))
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
            if(entretien.vehicle.societe != null && entretien.vehicle.societe.length > 0){
                entretien.societe = Societes.findOne({_id:new Mongo.ObjectID(entretien.vehicle.societe)});
            }else{
                entretien.societe = {_id:"",name:""};
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
                    occurenceDate:null,
                    user:""
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        deleteEntretien(obj, {_id},{user}){
            if(user._id){
                Entretiens.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true;
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
                return true;
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
                return true;
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
                return true;
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
                return true;
            }
            throw new Error('Unauthorized');
        }
    }
}