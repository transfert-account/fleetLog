import InterventionNatures from './interventionNatures.js';
import Locations from '../location/locations';
import Vehicles from '../vehicle/vehicles';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        interventionNatures(obj, args){
            return InterventionNatures.find().fetch() || {};
        }
    },
    Mutation:{
        addInterventionNature(obj, {name},{user}){
            if(user._id){
                InterventionNatures.insert({
                    _id:new Mongo.ObjectID(),
                    name:name
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteInterventionNature(obj, {_id},{user}){
            if(user._id){
                InterventionNatures.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}