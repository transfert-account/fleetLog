import Societes from './societes.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        societe(obj, {_id}, { user }){
            return Societes.find().fetch() || {};
        },
        societes(obj, args){
            return Societes.find().fetch() || {};
        }
    },
    Mutation:{
        addSociete(obj, {trikey,name},{user}){
            if(user._id){
                Societes.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    trikey:trikey
                });
                return Societes.find().fetch();
            }
            throw new Error('Unauthorized');
        },
        deleteSociete(obj, {_id},{user}){
            if(user._id){
                Societes.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return Societes.find().fetch();
            }
            throw new Error('Unauthorized');
        },
    }
}