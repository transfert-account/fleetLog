import AccPlaces from './accPlaces.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        accPlaces(obj, args){
            return AccPlaces.find().fetch() || {};
        }
    },
    Mutation:{
        addAccPlace(obj, {name},{user}){
            if(user._id){
                AccPlaces.insert({
                    _id:new Mongo.ObjectID(),
                    name:name
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteAccPlace(obj, {_id},{user}){
            if(user._id){
                AccPlaces.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}