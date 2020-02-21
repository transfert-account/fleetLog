import Colors from './colors.js';
import Locations from '../location/locations';
import Vehicles from '../vehicle/vehicles';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        colors(obj, args){
            return Colors.find().fetch() || {};
        }
    },
    Mutation:{
        addColor(obj, {name,hex},{user}){
            if(user._id){
                Colors.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    hex:hex
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteColor(obj, {_id},{user}){
            if(user._id){
                let nV = Vehicles.find({color:_id}).fetch().length
                let nL = Locations.find({color:_id}).fetch().length
                if(nV + nL > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' vehicule(s) lié(s)'})}
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' location(s) liée(s)'})}
                    return qrm;
                }else{
                    Colors.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}