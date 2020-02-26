import Entretiens from '../entretien/entretiens';
import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations';
import Equipements from '../equipement/equipements'
import EquipementDescriptions from '../equipementDescription/equipementDescriptions'
import Commandes from '../commande/commandes';
import Licences from '../licence/licences';
import Societes from '../societe/societes';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        dashboards(obj, args,{user}){
            let dashboards = []
            let societes = Societes.find().fetch() || {};
            societes.map(s=>{
                dashboards.push({societe:s})
            })
            dashboards.map(d=>{
                d.vehicles = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().length
                d.vehiclesLate = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().filter(v=>moment(v.kms[v.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>14).length
                d.vehiclesVeryLate = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().filter(v=>moment(v.kms[v.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>28).length
                d.locations = Locations.find({societe:d.societe._id._str,archived:false}).fetch().length
                d.locationsLate = Locations.find({societe:d.societe._id._str,archived:false}).fetch().filter(l=>moment(l.kms[l.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>14).length
                d.locationsVeryLate = Locations.find({societe:d.societe._id._str,archived:false}).fetch().filter(l=>moment(l.kms[l.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>28).length
                d.controlsOk = 0;
                d.controlsUrgent = 0;
                d.controlsLate = 0;
                Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v=>{
                    v.equipements = Equipements.find({vehicle:v._id._str}).fetch() || {};
                    v.equipements.forEach(e => {
                        e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                    });
                    v.equipements.map(e=>{
                        e.nextControl = 0;
                        e.alertStep = 0;
                        e.color = "green";
                        if(e.equipementDescription.unitType == "t"){
                            if(e.equipementDescription.controlPeriodUnit == "y"){
                                e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,"Y");
                            }
                            if(e.equipementDescription.controlPeriodUnit == "m"){
                                e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,'M');
                            }
                            if(e.equipementDescription.alertStepUnit == "y"){
                                e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,"Y");
                            }
                            if(e.equipementDescription.alertStepUnit == "m"){
                                e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,'M');
                            }
                            if(moment(e.alertStep, "DD/MM/YYYY").diff(moment())<0){
                                e.color = "orange"
                            }
                            if(moment(e.nextControl, "DD/MM/YYYY").diff(moment())<0){
                                e.color = "red"
                            }
                        }
                        if(e.equipementDescription.unitType == "d"){
                            e.nextControl = (parseInt(e.lastControl) + parseInt(e.equipementDescription.controlPeriodValue)) - parseInt(v.km)
                            if(e.nextControl<e.equipementDescription.alertStepValue){
                                e.color = "orange";
                            }
                            if(e.nextControl<0){
                                e.color = "red";
                            }
                        }
                        if(e.color == "red"){
                            d.controlsOk ++;
                        }
                        if(e.color == "orange"){
                            d.controlsUrgent ++;
                        }
                        if(e.color == "green"){
                            d.controlsLate ++;
                        }
                    })
                })
                d.licences = Licences.find({societe:d.societe._id._str}).fetch().length
                d.licencesEndSoon = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<14).length
                d.licencesOver = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<0).length
                d.commandesToDo = 0;
                d.commandesDone = 0;
                d.commandesReceived = 0;
                let entretiens = Entretiens.find({societe:d.societe._id._str,archived:false}).fetch() || {};
                entretiens.forEach(e => {
                    e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
                });
                entretiens.map(e=>{
                    let lowestStatus = 3;
                    e.commandes.map(c=>{
                        if(c.status == 1){
                            d.commandesToDo++;
                        }
                        if(c.status == 2){
                            d.commandesDone++;
                        }
                        if(c.status == 3){
                            d.commandesReceived++;
                        }
                        if(c.status != 3){
                            lowestStatus = c.status
                        }
                    })
                    if(lowestStatus != 3){
                        e.ready = false
                    }else{
                        e.ready = true
                    }
                })
                
                d.entretiensNotReady = entretiens.filter(e=>!e.ready).length
                entretiens = entretiens.filter(e=>e.ready)
                d.entretiensReadyAffected = entretiens.filter(e=>e.user != "").length
                d.entretiensReadyUnaffected = entretiens.filter(e=>e.user == "").length
            })
            return dashboards;
        },
        dashboard(obj, args,{user}){
            let dashboard = []
            let userFull = Meteor.users.findOne({_id:user._id});
            let societes = Societes.find({_id:new Mongo.ObjectID(userFull.settings.visibility)}).fetch() || {};
            societes.map(s=>{
                dashboard.push({societe:s})
            })
            dashboard.map(d=>{
                d.vehicles = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().length
                d.vehiclesLate = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().filter(v=>moment(v.kms[v.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>14).length
                d.vehiclesVeryLate = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().filter(v=>moment(v.kms[v.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>28).length
                d.locations = Locations.find({societe:d.societe._id._str,archived:false}).fetch().length
                d.locationsLate = Locations.find({societe:d.societe._id._str,archived:false}).fetch().filter(l=>moment(l.kms[l.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>14).length
                d.locationsVeryLate = Locations.find({societe:d.societe._id._str,archived:false}).fetch().filter(l=>moment(l.kms[l.kms.length-1].reportDate,"DD/MM/YYYY").diff(moment(),'days', true)>28).length
                d.controlsOk = 0;
                d.controlsUrgent = 0;
                d.controlsLate = 0;
                Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v=>{
                    v.equipements = Equipements.find({vehicle:v._id._str}).fetch() || {};
                    v.equipements.forEach(e => {
                        e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
                    });
                    v.equipements.map(e=>{
                        e.nextControl = 0;
                        e.alertStep = 0;
                        e.color = "green";
                        if(e.equipementDescription.unitType == "t"){
                            if(e.equipementDescription.controlPeriodUnit == "y"){
                                e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,"Y");
                            }
                            if(e.equipementDescription.controlPeriodUnit == "m"){
                                e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,'M');
                            }
                            if(e.equipementDescription.alertStepUnit == "y"){
                                e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,"Y");
                            }
                            if(e.equipementDescription.alertStepUnit == "m"){
                                e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,'M');
                            }
                            if(moment(e.alertStep, "DD/MM/YYYY").diff(moment())<0){
                                e.color = "orange"
                            }
                            if(moment(e.nextControl, "DD/MM/YYYY").diff(moment())<0){
                                e.color = "red"
                            }
                        }
                        if(e.equipementDescription.unitType == "d"){
                            e.nextControl = (parseInt(e.lastControl) + parseInt(e.equipementDescription.controlPeriodValue)) - parseInt(v.km)
                            if(e.nextControl<e.equipementDescription.alertStepValue){
                                e.color = "orange";
                            }
                            if(e.nextControl<0){
                                e.color = "red";
                            }
                        }
                        if(e.color == "red"){
                            d.controlsOk ++;
                        }
                        if(e.color == "orange"){
                            d.controlsUrgent ++;
                        }
                        if(e.color == "green"){
                            d.controlsLate ++;
                        }
                    })
                })
                d.licences = Licences.find({societe:d.societe._id._str}).fetch().length
                d.licencesEndSoon = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<14).length
                d.licencesOver = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<0).length
                d.commandesToDo = 0;
                d.commandesDone = 0;
                d.commandesReceived = 0;
                let entretiens = Entretiens.find({societe:d.societe._id._str,archived:false}).fetch() || {};
                entretiens.forEach(e => {
                    e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
                });
                entretiens.map(e=>{
                    let lowestStatus = 3;
                    e.commandes.map(c=>{
                        if(c.status == 1){
                            d.commandesToDo++;
                        }
                        if(c.status == 2){
                            d.commandesDone++;
                        }
                        if(c.status == 3){
                            d.commandesReceived++;
                        }
                        if(c.status != 3){
                            lowestStatus = c.status
                        }
                    })
                    if(lowestStatus != 3){
                        e.ready = false
                    }else{
                        e.ready = true
                    }
                })
                
                d.entretiensNotReady = entretiens.filter(e=>!e.ready).length
                entretiens = entretiens.filter(e=>e.ready)
                d.entretiensReadyAffected = entretiens.filter(e=>e.user != "").length
                d.entretiensReadyUnaffected = entretiens.filter(e=>e.user == "").length
            })
            return dashboard[0];
        }
    }
}