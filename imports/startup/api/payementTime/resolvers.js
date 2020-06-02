import PayementTimes from './payementTimes.js';
import Vehicles from '../vehicle/vehicles';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        payementTimes(obj, args){
            return PayementTimes.find().fetch() || {};
        }
    },
    Mutation:{
        addPayementTime(obj, {months},{user}){
            if(user._id){
                PayementTimes.insert({
                    _id:new Mongo.ObjectID(),
                    months:months
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deletePayementTime(obj, {_id},{user}){
            if(user._id){
                let nV = Vehicles.find({payementTime:_id}).fetch().length
                if(nV > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' vehicule(s) lié(s)'})}
                    return qrm;
                }else{
                    PayementTimes.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}