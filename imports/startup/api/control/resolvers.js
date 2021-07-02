import Vehicles, { VEHICLES } from '../vehicle/vehicles';
import Societes from '../societe/societes.js';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Energies from '../energy/energies'
import Controls from '../control/controls';

import Functions from '../common/functions';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';

const affectVehicleData = vehicle => {
    try{
        vehicle.lastKmUpdate = vehicle.kms[vehicle.kms.length-1].reportDate
        vehicle.km = vehicle.kms[vehicle.kms.length-1].kmValue
        if(vehicle.societe != null && vehicle.societe.length > 0){
            vehicle.societe = Societes.findOne({_id:new Mongo.ObjectID(vehicle.societe)});
        }else{
            vehicle.societe = {_id:""};
        }
        if(vehicle.shared){
            vehicle.sharedTo = Societes.findOne({_id:new Mongo.ObjectID(vehicle.sharedTo)});
        }else{
            vehicle.sharedTo = {_id:""};
        }
        if(vehicle.brand != null && vehicle.brand.length > 0){
            vehicle.brand = Brands.findOne({_id:new Mongo.ObjectID(vehicle.brand)});
        }else{
            vehicle.brand = {_id:""};
        }
        if(vehicle.model != null && vehicle.model.length > 0){
            vehicle.model = Models.findOne({_id:new Mongo.ObjectID(vehicle.model)});
        }else{
            vehicle.model = {_id:""};
        }
        
        if(vehicle.energy != null && vehicle.energy.length > 0){
            vehicle.energy = Energies.findOne({_id:new Mongo.ObjectID(vehicle.energy)});
        }else{
            vehicle.energy = {_id:""};
        }
    }catch(e){
        console.error(e)
    }
}

export default {
    Query : {
        ctrlStats(obj,{ctrlType,societe},{user}){
            let controls = Controls.find({ctrlType:ctrlType}).fetch().map(x=>{return({
                control:x,
                affected:0,
                unaffected:0,
                total:0,
                inTime:0,
                soon:0,
                late:0
            })});
            let vehicles = VEHICLES(user);
            if(societe != "noidthisisgroupvisibility"){
                vehicles = vehicles.filter(v=>v.societe == societe)
            }
            vehicles.forEach(v=>{//Pour chaque véhicule
                controls.forEach(c=>{//Pour chaque contrôle existant
                    if(v.controls.filter(vc=>vc._id == c.control._id).length == 0){
                        c.unaffected++;
                    }else{
                        c.affected++;
                    }
                    c.total++;
                })
                v.controls.forEach(o=>{//Pour chaque contrôle affecté au véhicule, ex : o = {_id:"xxxp1",lastOccurence:"1250"}
                    let c = controls.filter(ctrl=>ctrl.control._id._str == o._id)[0]//ex : c.control = {name:"Essuie glaces",_id:"xxxp1",unit:"km",frequency:"10000"}
                    if(c != undefined){//Controle absent de la liste, mauvais type
                        c[Functions.getControlNextOccurrence(v,c.control,o).timing]++;
                    }
                })
            })
            return controls;
        },
        vehiclesByControl(obj,{_id},{user}){
            let res = {control:{},lastOccurrence:"",vehiclesOccurrences:[]}
            res.control = Controls.findOne({_id:new Mongo.ObjectID(_id)})
            res.vehiclesOccurrences = VEHICLES(user).filter(v=>v.controls.filter(c=>c._id == _id).length > 0)
            res.vehiclesOccurrences.forEach(v=>{affectVehicleData(v)})
            res.vehiclesOccurrences = res.vehiclesOccurrences.map(v=>{
                return({vehicle:v,lastOccurrence:v.controls.filter(c=>c._id == _id)[0].lastOccurrence,entretien:v.controls.filter(c=>c._id == _id)[0].entretien,...Functions.getControlNextOccurrence(v,res.control,v.controls.filter(c=>c._id == _id)[0])})
            })
            return res;
        },
        controls(obj,{ctrlType},{user}){
            if(user._id){
                return Controls.find({ctrlType:ctrlType}).fetch()
            }
            throw new Error('Unauthorized');
        }
    },
    Mutation : {
        addControl(obj,{name,firstIsDifferent,firstFrequency,frequency,unit,alert,alertUnit,ctrlType},{user}){
            if(user._id){
                Controls.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    firstIsDifferent:firstIsDifferent,
                    firstFrequency:(firstIsDifferent ? firstFrequency : 0),
                    frequency:frequency,
                    unit:unit,
                    alert:alert,
                    alertUnit:alertUnit,
                    ctrlType:ctrlType
                });
                return [{status:true,message:'Création du contrôle réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteControl(obj,{_id},{user}){
            if(user._id){
                let nV = Vehicles.find({controls:{$elemMatch:{_id:_id}}}).fetch().length
                if(nV > 0){
                    let qrm = [];
                    if(nV > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nV + ' véhicule(s) éligibles lié(s)'})}
                    return qrm;
                }else{
                    Controls.remove({_id:new Mongo.ObjectID(_id)});
                    return [{status:true,message:'Suppression du contrôle réussie'}];
                }
            }
            throw new Error('Unauthorized');
        }
    }
}