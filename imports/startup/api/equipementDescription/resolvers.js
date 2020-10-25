import EquipementDescriptions from './equipementDescriptions.js';
import Equipements from '../equipement/equipements';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        equipementDescriptions(obj, args){
            return EquipementDescriptions.find().fetch() || {};
        }
    },
    Mutation:{
        addEquipementDescription(obj, {name,controlPeriodValue,controlPeriodUnit,alertStepValue,alertStepUnit,unitType},{user}){
            if(user._id){
                EquipementDescriptions.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    controlPeriodValue:controlPeriodValue,
                    controlPeriodUnit:controlPeriodUnit,
                    alertStepValue:alertStepValue,
                    alertStepUnit:alertStepUnit,
                    unitType:unitType
                });
                return [{status:true,message:'Création du contrôle réussi'}];
            }
            throw new Error('Unauthorized');
        },
        editEquipementDescription(obj, {_id,name,controlPeriodValue,controlPeriodUnit,alertStepValue,alertStepUnit,unitType},{user}){
            if(user._id){
                EquipementDescriptions.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "name":name,
                            "controlPeriodValue":controlPeriodValue,
                            "controlPeriodUnit":controlPeriodUnit,
                            "alertStepValue":alertStepValue,
                            "alertStepUnit":alertStepUnit,
                            "unitType":unitType

                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        deleteEquipementDescription(obj, {_id},{user}){
            if(user._id){
                let nE = Equipements.find({equipementDescription:_id}).fetch().length
                if(nE > 0){
                    let qrm = [];
                    if(nE > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nE + ' véhicule(s) lié(s)'})}
                    return qrm;
                }else{
                    EquipementDescriptions.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}