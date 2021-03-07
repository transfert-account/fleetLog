import AccTrackStates from './accTrackStates.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        accTrackStates(obj, args){
            return AccTrackStates.find().fetch() || {};
        }
    },
    Mutation:{
        addAccTrackState(obj, {name},{user}){
            if(user._id){
                AccTrackStates.insert({
                    _id:new Mongo.ObjectID(),
                    name:name
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteAccTrackState(obj, {_id},{user}){
            if(user._id){
                AccTrackStates.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}