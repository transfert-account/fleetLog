import AccWeathers from './accWeathers.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        accWeathers(obj, args){
            return AccWeathers.find().fetch() || {};
        }
    },
    Mutation:{
        addAccWeather(obj, {name},{user}){
            if(user._id){
                AccWeathers.insert({
                    _id:new Mongo.ObjectID(),
                    name:name
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteAccWeather(obj, {_id},{user}){
            if(user._id){
                AccWeathers.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}