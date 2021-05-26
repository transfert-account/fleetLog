import Vehicles from '../vehicle/vehicles';
import Societes from '../societe/societes.js';
import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Energies from '../energy/energies'

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
        ctrlStats(obj,{ctrlType},args){
            let ctrls = [];
            if(ctrlType == "obli"){
                ctrls = Functions.getObli().map(o=>{return({
                    control:o,
                    affected:0,
                    unaffected:0,
                    total:0,
                    noOccurrence:0,
                    inTime:0,
                    soon:0,
                    late:0
                })});
            }else{
                ctrls = Functions.getPrev().map(o=>{return({
                    control:o,
                    affected:0,
                    unaffected:0,
                    total:0,
                    noOccurrence:0,
                    inTime:0,
                    soon:0,
                    late:0
                })});
            }
            let vs = Vehicles.find().fetch();
            vs.forEach(v=>{//Pour chaque véhicule
                v.ctrls = (ctrlType == "obli" ? v.obli : v.prev)
                ctrls.forEach(o=>{//Pour chaque contrôle existant
                    if(v.ctrls.filter(vo=>vo.key == o.control.key).length == 0){
                        o.unaffected++;
                    }else{
                        o.affected++;
                    }
                    o.total++;
                })
                v.ctrls.forEach(o=>{//Pour chaque contrôle affecté au véhicule, ex : o = {key:"p1",lastOccurence:"1250"}
                    let c = ctrls.filter(oc=>oc.control.key == o.key)[0]//ex : c = {name:"Essuie glaces",key:"p1",unit:"km",frequency:"10000"}
                    if(o.lastOccurrence == "none"){
                        c.noOccurrence++;
                    }else{
                        if(c.control.unit == "km"){
                            let left = parseInt(v.km - (parseInt(o.lastOccurrence) + parseInt(c.control.frequency)));
                            if(left>=0){
                                c.late++;
                            }else{
                                if(left>-2000){
                                    c.soon++;
                                }else{
                                    c.inTime++;
                                }
                            }
                        }else{
                            let time = moment(o.lastOccurrence,"DD/MM/YYYY").add(c.control.frequency,(c.control.unit == "m" ? "M" : c.control.unit)).format("DD/MM/YYYY")
                            if(moment(time, "DD/MM/YYYY").diff(moment())){
                                if(moment(time, "DD/MM/YYYY").diff(moment(),'days') > 25){
                                    c.inTime++;
                                }else{
                                    c.soon++;
                                }
                            }else{
                                c.late++;
                            }
                        }
                    }
                })
            })
            return ctrls;
        },
        vehiclesByControl(obj,{key},args){
            let res = {control:{},lastOccurrence:"",vehiclesOccurrences:[]}
            if(key[0] == "o"){
                res.control = Functions.getObli().filter(c=>c.key == key)[0]
                res.vehiclesOccurrences = Vehicles.find({obli:{$elemMatch:{key:key}}}).fetch();
                res.vehiclesOccurrences.forEach(v=>affectVehicleData(v))
                res.vehiclesOccurrences = res.vehiclesOccurrences.map(v=>{return({vehicle:v,lastOccurrence:v.obli.filter(o=>o.key == key)[0].lastOccurrence,entretien:v.obli.filter(o=>o.key == key)[0].entretien})})
            }else{
                res.control = Functions.getPrev().filter(c=>c.key == key)[0]
                res.vehiclesOccurrences = Vehicles.find({prev:{$elemMatch:{key:key}}}).fetch();
                res.vehiclesOccurrences.forEach(v=>affectVehicleData(v))
                res.vehiclesOccurrences = res.vehiclesOccurrences.map(v=>{return({vehicle:v,lastOccurrence:v.prev.filter(o=>o.key == key)[0].lastOccurrence,entretien:v.prev.filter(o=>o.key == key)[0].entretien})})
            }
            return res;
        }
    }
}