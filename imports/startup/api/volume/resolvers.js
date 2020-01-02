import Volumes from './volumes.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        volumes(obj, args){
            return Volumes.find().fetch() || {};
        }
    },
    Mutation:{
        addVolume(obj, {meterCube},{user}){
            if(user._id){
                Volumes.insert({
                    _id:new Mongo.ObjectID(),
                    meterCube:meterCube
                });
                return true
            }
            throw new Error('Unauthorized');
        },
        deleteVolume(obj, {_id},{user}){
            if(user._id){
                Volumes.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true
            }
            throw new Error('Unauthorized');
        },
    }
}