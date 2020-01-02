import Entretiens from './entretiens';
import Vehicles from '../vehicle/vehicles';
import Pieces from '../piece/pieces';
import Societes from '../societe/societes';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        entretiens(obj, args,{user}){
            let entretiens = Entretiens.find().fetch() || {};
            entretiens.forEach((e,i) => {
                e.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});
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
            entretien.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(entretien.vehicle)});
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
                    occurenceDay:0,
                    occurenceMonth:0,
                    occurenceYear:0,
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
        affectEntretien(obj, {_id,occurenceDay,occurenceMonth,occurenceYear},{user}){
            console.log(user)
            if(user._id){
                Entretiens.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "occurenceDay":occurenceDay,
                            "occurenceMonth":occurenceMonth,
                            "occurenceYear":occurenceYear,
                            "user":user._id
                        }
                    }
                ); 
                return true;
            }
            throw new Error('Unauthorized');
        }
        
    }
}