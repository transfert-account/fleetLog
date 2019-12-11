import EquipementDescriptions from './equipementDescriptions.js';
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
                return EquipementDescriptions.find().fetch() || {};
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
                return EquipementDescriptions.find().fetch() || {};
            }
            throw new Error('Unauthorized');
        },
        deleteEquipementDescription(obj, {_id},{user}){
            if(user._id){
                EquipementDescriptions.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return EquipementDescriptions.find().fetch() || {};
            }
            throw new Error('Unauthorized');
        },
    }
}