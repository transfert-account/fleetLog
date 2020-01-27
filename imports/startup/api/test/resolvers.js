import Vehicles from '../vehicle/vehicles.js';
import Societes from '../societe/societes.js';
import Volumes from '../volume/volumes.js';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        testThis(obj, args,{user}){
            let vehicles = Vehicles.find().fetch() || {};
            /*vehicles.forEach((v,i) => {
                v.lastKmUpdate = v.kms[v.kms.length-1].reportDate
                v.km = v.kms[v.kms.length-1].kmValue
                if(v.payementFormat == "CRB"){
                    v.property = false
                }else{
                    v.property = true
                }
                if(v.volume != null && v.volume.length > 0){
                    v.volume = Volumes.findOne({_id:new Mongo.ObjectID(v.volume)});
                }else{
                    v.volume = {_id:""};
                }
                if(v.societe != null && v.societe.length > 0){
                    vehicles[i].societe = Societes.findOne({_id:new Mongo.ObjectID(v.societe)});
                }else{
                    vehicles[i].societe = {_id:""};
                }
                v.equipements = Equipements.find({vehicle:v._id._str}).fetch() || {};
                v.equipements.forEach((e,ei) => {
                    e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                });
            });*/
            console.log(vehicles)
            let testString = JSON.stringify(vehicles)
            return testString;
        }
    }
}