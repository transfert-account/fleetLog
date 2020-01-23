import Locations from './locations.js';
import Societes from '../societe/societes.js';
import Volumes from '../volume/volumes.js';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        location(obj, {_id}, { user }){
            let location = Locations.findOne({_id:new Mongo.ObjectID(_id)});
            location.lastKmUpdate = location.kms[location.kms.length-1].reportDate
            location.km = location.kms[location.kms.length-1].kmValue
            if(location.payementFormat == "CRB"){
                location.property = false
            }else{
                location.property = true
            }
            location.property
            if(location.societe != null && location.societe.length > 0){
                location.societe = Societes.findOne({_id:new Mongo.ObjectID(location.societe)});
            }else{
                location.societe = {_id:""};
            }
            if(location.volume != null && location.volume.length > 0){
                location.volume = Volumes.findOne({_id:new Mongo.ObjectID(location.volume)});
            }else{
                location.volume = {_id:""};
            }
            location.equipements = Equipements.find({location:location._id._str}).fetch() || {};
            location.equipements.forEach((e,ei) => {
                e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
            });
            return location;
        },
        locations(obj, args){
            let locations = Locations.find().fetch() || {};
            locations.forEach((l,i) => {
                l.lastKmUpdate = l.kms[l.kms.length-1].reportDate
                l.km = l.kms[l.kms.length-1].kmValue
                if(l.payementFormat == "CRB"){
                    l.property = false
                }else{
                    l.property = true
                }
                if(l.volume != null && l.volume.length > 0){
                    l.volume = Volumes.findOne({_id:new Mongo.ObjectID(l.volume)});
                }else{
                    l.volume = {_id:""};
                }
                if(l.societe != null && l.societe.length > 0){
                    locations[i].societe = Societes.findOne({_id:new Mongo.ObjectID(l.societe)});
                }else{
                    locations[i].societe = {_id:""};
                }
                l.equipements = Equipements.find({location:l._id._str}).fetch() || {};
                l.equipements.forEach((e,ei) => {
                    e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                });
            });
            return locations;
        }
    },
    Mutation:{
        addLocation(obj, {societe,registration,firstRegistrationDate,km,lastKmUpdate,brand,model,volume,payload,color,insurancePaid,endDate,price,reason},{user}){
            if(user._id){
                Locations.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    registration:registration,
                    firstRegistrationDate:firstRegistrationDate,
                    brand:brand,
                    model:model,
                    volume:volume,
                    payload:payload,
                    color:color,
                    insurancePaid:insurancePaid,
                    kms:[{
                        _id: new Mongo.ObjectID(),
                        kmValue:km,
                        reportDate:lastKmUpdate
                    }],
                    startDate:lastKmUpdate,
                    endDate:endDate,
                    price:price,
                    reason:reason,
                    reparation:0,
                    rentalContract:""
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        editLocation(obj, {_id,societe,registration,firstRegistrationDate,brand,model,volume,payload,color,insurancePaid,startDate,endDate,reason,price},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "societe":societe,
                            "registration":registration,
                            "firstRegistrationDate":firstRegistrationDate,
                            "brand":brand,
                            "model":model,
                            "volume":volume,
                            "payload":payload,
                            "color":color,
                            "insurancePaid":insurancePaid,
                            "startDate":startDate,
                            "endDate":endDate,
                            "reason":reason,
                            "price":price
                        }
                    }
                );                
                return true;
            }
            throw new Error('Unauthorized');
        },
        updateLocKm(obj, {_id,date,kmValue},{user}){
            if(user._id){
                let location = Locations.findOne({_id:new Mongo.ObjectID(_id)});
                if(!moment(location.kms[location.kms.length-1].reportDate, "DD/MM/YYYY").diff(moment(date, "DD/MM/YYYY"))){
                    throw new Error("Dernier relevé plus recent");
                }
                if(location.kms[location.kms.length-1].kmValue > kmValue){
                    throw new Error("Kilométrage incohérent");
                }
                /*if(moment(location.lastKmUpdate, "DD/MM/YYYY").diff(moment())){
                    throw new Error("Date de relevé dans le futur");
                }*/
                Locations.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "lastKmUpdate":date,
                            "km":kmValue
                        }
                    }   
                )
                Locations.update(
                    {
                        _id:new Mongo.ObjectID(_id)
                    },{
                        $push: {
                            "kms": {
                                _id: new Mongo.ObjectID(),
                                reportDate:date,
                                kmValue:kmValue
                            }
                        }
                    }
                )
                return true;
            }
            throw new Error('Unauthorized');
        },
        deleteLocKm(obj, {location,_id},{user}){
            if(user._id){
                Locations.update(
                    {
                        _id:new Mongo.ObjectID(location)
                    },{
                        $pull: {
                            "kms": {
                                _id: new Mongo.ObjectID(_id)
                            }
                        }
                    }
                )
                return true;
            }
            throw new Error('Unauthorized');
        },
        deleteLocation(obj, {_id},{user}){
            if(user._id){
                Locations.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
    }
}