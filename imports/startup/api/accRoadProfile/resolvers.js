import AccRoadProfiles from './accRoadProfiles.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        accRoadProfiles(obj, args){
            return AccRoadProfiles.find().fetch() || {};
        }
    },
    Mutation:{
        addAccRoadProfile(obj, {name},{user}){
            if(user._id){
                AccRoadProfiles.insert({
                    _id:new Mongo.ObjectID(),
                    name:name
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteAccRoadProfile(obj, {_id},{user}){
            if(user._id){
                AccRoadProfiles.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}