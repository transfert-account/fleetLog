import LocationArchiveJustifications from './locationArchiveJustifications.js';
import Locations from '../location/locations';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        locationArchiveJustifications(obj, args){
            return LocationArchiveJustifications.find().fetch() || {};
        }
    },
    Mutation:{
        addLocationArchiveJustification(obj, {justification},{user}){
            if(user._id){
                LocationArchiveJustifications.insert({
                    _id:new Mongo.ObjectID(),
                    justification:justification
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteLocationArchiveJustification(obj, {_id},{user}){
            if(user._id){
                let nV = Locations.find({archiveJustification:_id}).fetch().length
                if(nV > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' vehicule(s) de location lié(s)'})}
                    return qrm;
                }else{
                    LocationArchiveJustifications.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}