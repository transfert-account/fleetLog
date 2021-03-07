import AccCharacteristics from './accCharacteristics.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        accCharacteristics(obj, args){
            return AccCharacteristics.find().fetch() || {};
        }
    },
    Mutation:{
        addAccCharacteristic(obj, {name},{user}){
            if(user._id){
                AccCharacteristics.insert({
                    _id:new Mongo.ObjectID(),
                    name:name
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteAccCharacteristic(obj, {_id},{user}){
            if(user._id){
                AccCharacteristics.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}