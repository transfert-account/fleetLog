import Entretiens from '../entretien/entretiens';
import Vehicles from '../vehicle/vehicles';
import Models from '../model/models';
import Volumes from '../volume/volumes';
import Locations from '../location/locations';
import Equipements from '../equipement/equipements';
import EquipementDescriptions from '../equipementDescription/equipementDescriptions';
import Commandes from '../commande/commandes';
import Licences from '../licence/licences';
import Batiments from '../batiment/batiments';
import Societes from '../societe/societes';
import Accidents from '../accident/accidents';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        dashboards(obj, args,{user}){
            let dashboards = [];
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
                d.controlsTotal = 0;
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
                        if(e.color == "green"){
                            d.controlsOk ++;
                            d.controlsTotal ++;
                        }
                        if(e.color == "orange"){
                            d.controlsUrgent ++;
                            d.controlsTotal ++;
                        }
                        if(e.color == "red"){
                            d.controlsLate ++;
                            d.controlsTotal ++;
                        }
                    })
                })
                d.licences = Licences.find({societe:d.societe._id._str}).fetch().length
                d.licencesEndSoon = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<14).length
                d.licencesOver = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<0).length
                d.licenceFree = Licences.find({societe:d.societe._id._str,vehicle:""}).fetch().length;
                d.licenceAffected = d.licences - d.licenceFree;

                d.batiments = Batiments.find({societe:d.societe._id._str}).fetch().length
                d.batimentsEndSoon = Batiments.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)<14).length
                d.batimentsOver = Batiments.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)<0).length

                d.accidentsThisYear = Accidents.find({societe:d.societe._id._str}).fetch().filter(a=>{return moment(a.occurenceDate,"DD/MM/YYYY").year() == new Date().getFullYear()}).length;
                d.accidentsOpened = Accidents.find({societe:d.societe._id._str}).fetch().filter(a=>{return a.constatSent == false}).length;
                d.totalAccidentsCost = Accidents.find({societe:d.societe._id._str}).fetch().reduce((a, b)=> a + b.cost, 0);

                d.commandesToDo = 0;
                d.commandesDone = 0;
                d.commandesReceived = 0;
                d.commandesTotalNotArchived = 0;
                d.entretiensTotalNotArchived = 0;
                let entretiens = Entretiens.find({societe:d.societe._id._str,archived:false}).fetch() || {};
                entretiens.forEach(e => {
                    e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
                });
                entretiens.map(e=>{
                    d.entretiensTotalNotArchived++;
                    let lowestStatus = 3;
                    e.commandes.map(c=>{
                        d.commandesTotalNotArchived++;
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
                let totalKm = 0;
                Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v =>totalKm += v.kms[v.kms.length-1].kmValue)
                if(d.vehicles == 0){
                    d.avgKm = 0
                }else{
                    d.avgKm = parseInt(totalKm / d.vehicles);
                }
                d.nbOwned = 0;
                d.nbCRB = 0
                d.nbCRC = 0
                Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v=>{
                    let totalMonths = v.purchasePrice/v.monthlyPayement;
                    let monthsDone = parseInt(moment().diff(moment(v.payementBeginDate,"DD/MM/YYYY"),'months', true));
                    let monthsLeft = totalMonths - monthsDone;
                    if(parseInt(monthsLeft <= 0) || v.payementFormat == "CPT"){
                        d.nbOwned ++;
                    }else{
                        if(v.payementFormat == "CRB"){
                            d.nbCRB ++;
                        }if(v.payementFormat == "CRC"){
                            d.nbCRC ++;
                        }
                    }
                })
                let vsRaw = Vehicles.find({societe:d.societe._id._str}).fetch();
                vsRaw.map(v=>{
                    v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)})
                    v.volume = Volumes.findOne({_id:new Mongo.ObjectID(v.volume)})
                })
                d.vehiclesVolumeRepartition = [];
                d.vehiclesModelRepartition = [];
                vsRaw.map(v=>{
                    if(d.vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str).length>0){
                        d.vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str)[0].value++; 
                    }else{
                        d.vehiclesModelRepartition.push({key:v.model._id._str,label:v.model.name,value:1})
                    }
                    if(d.vehiclesVolumeRepartition.filter(mr=>mr.key == v.volume._id._str).length>0){
                        d.vehiclesVolumeRepartition.filter(mr=>mr.key == v.volume._id._str)[0].value++; 
                    }else{
                        d.vehiclesVolumeRepartition.push({key:v.volume._id._str,label:v.volume.meterCube,value:1})
                    }
                })
            })
            let totalGlobalKm = 0;
            let globalAvgKm = 0;
            let vehicles = Vehicles.find({archived:false}).fetch().map(v =>totalGlobalKm += v.kms[v.kms.length-1].kmValue)
            if(vehicles != 0){
                globalAvgKm = parseInt(totalGlobalKm /  Vehicles.find({archived:false}).fetch().length)
            }
            let vehiclesVolumeRepartition = [];
            let vehiclesModelRepartition = [];
            let vsRawG = Vehicles.find().fetch();
                vsRawG.map(v=>{
                    v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)})
                    v.volume = Volumes.findOne({_id:new Mongo.ObjectID(v.volume)})
                })
                vsRawG.map(v=>{
                    if(vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str).length>0){
                        vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str)[0].value++; 
                    }else{
                        vehiclesModelRepartition.push({key:v.model._id._str,label:v.model.name,value:1})
                    }
                    if(vehiclesVolumeRepartition.filter(mr=>mr.key == v.volume._id._str).length>0){
                        vehiclesVolumeRepartition.filter(mr=>mr.key == v.volume._id._str)[0].value++; 
                    }else{
                        vehiclesVolumeRepartition.push({key:v.volume._id._str,label:v.volume.meterCube,value:1})
                    }
                })
            let groupDashboard = {
                societe:{_id:"noidthisisgroupvisibility",trikey:"GRP",name:"Groupe"},
                vehicles:dashboards.reduce((a, b) => a + (b.vehicles), 0),
                vehiclesLate:dashboards.reduce((a, b)=> a + b.vehiclesLate, 0),
                vehiclesVeryLate:dashboards.reduce((a, b)=> a + b.vehiclesVeryLate, 0),
                locations:dashboards.reduce((a, b)=> a + b.locations, 0),
                locationsLate:dashboards.reduce((a, b)=> a + b.locationsLate, 0),
                locationsVeryLate:dashboards.reduce((a, b)=> a + b.locationsVeryLate, 0),
                controlsTotal:dashboards.reduce((a, b)=> a + b.controlsTotal, 0),
                controlsOk:dashboards.reduce((a, b)=> a + b.controlsOk, 0),
                controlsUrgent:dashboards.reduce((a, b)=> a + b.controlsUrgent, 0),
                controlsLate:dashboards.reduce((a, b)=> a + b.controlsLate, 0),
                licences:dashboards.reduce((a, b)=> a + b.licences, 0),
                licencesEndSoon:dashboards.reduce((a, b)=> a + b.licencesEndSoon, 0),
                licencesOver:dashboards.reduce((a, b)=> a + b.licencesOver, 0),
                batiments:dashboards.reduce((a, b)=> a + b.batiments, 0),
                batimentsEndSoon:dashboards.reduce((a, b)=> a + b.batimentsEndSoon, 0),
                batimentsOver:dashboards.reduce((a, b)=> a + b.batimentsOver, 0),
                accidentsThisYear:dashboards.reduce((a, b)=> a + b.accidentsThisYear, 0),
                accidentsOpened:dashboards.reduce((a, b)=> a + b.accidentsOpened, 0),
                totalAccidentsCost:dashboards.reduce((a, b)=> a + b.totalAccidentsCost, 0),
                entretiensNotReady:dashboards.reduce((a, b)=> a + b.entretiensNotReady, 0),
                entretiensReadyAffected:dashboards.reduce((a, b)=> a + b.entretiensReadyAffected, 0),
                entretiensReadyUnaffected:dashboards.reduce((a, b)=> a + b.entretiensReadyUnaffected, 0),
                entretiensTotalNotArchived:dashboards.reduce((a, b)=> a + b.entretiensTotalNotArchived, 0),
                commandesToDo:dashboards.reduce((a, b)=> a + b.commandesToDo, 0),
                commandesDone:dashboards.reduce((a, b)=> a + b.commandesDone, 0),
                commandesReceived:dashboards.reduce((a, b)=> a + b.commandesReceived, 0),
                commandesTotalNotArchived:dashboards.reduce((a, b)=> a + b.commandesTotalNotArchived, 0),
                avgKm:globalAvgKm,
                nbOwned:dashboards.reduce((a, b)=> a + b.nbOwned, 0),
                nbCRB:dashboards.reduce((a, b)=> a + b.nbCRB, 0),
                nbCRC:dashboards.reduce((a, b)=> a + b.nbCRC, 0),
                licenceAffected:dashboards.reduce((a, b)=> a + b.licenceAffected, 0),
                licenceFree:dashboards.reduce((a, b)=> a + b.licenceFree, 0),
                vehiclesVolumeRepartition:vehiclesVolumeRepartition,
                vehiclesModelRepartition:vehiclesModelRepartition
            }
            dashboards.push(groupDashboard);
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
                d.controlsTotal = 0;
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
                        if(e.color == "green"){
                            d.controlsOk ++;
                            d.controlsTotal ++;
                        }
                        if(e.color == "orange"){
                            d.controlsUrgent ++;
                            d.controlsTotal ++;
                        }
                        if(e.color == "red"){
                            d.controlsLate ++;
                            d.controlsTotal ++;
                        }
                    })
                })
                d.licences = Licences.find({societe:d.societe._id._str}).fetch().length
                d.licencesEndSoon = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<14).length
                d.licencesOver = Licences.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<0).length
                d.licenceFree = Licences.find({societe:d.societe._id._str,vehicle:""}).fetch().length;

                d.batiments = Batiments.find({societe:d.societe._id._str}).fetch().length
                d.batimentsEndSoon = Batiments.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)<14).length
                d.batimentsOver = Batiments.find({societe:d.societe._id._str}).fetch().filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)<0).length
                
                d.accidentsThisYear = Accidents.find({societe:d.societe._id._str}).fetch().filter(a=>{return moment(a.occurenceDate,"DD/MM/YYYY").year() == new Date().getFullYear()}).length;
                d.accidentsOpened = Accidents.find({societe:d.societe._id._str}).fetch().filter(a=>{return a.constatSent == false}).length;
                d.totalAccidentsCost = Accidents.find({societe:d.societe._id._str}).fetch().reduce((a, b)=> a + b.cost, 0);

                d.licenceAffected = d.licences - d.licenceFree;
                d.commandesToDo = 0;
                d.commandesDone = 0;
                d.commandesReceived = 0;
                d.commandesTotalNotArchived = 0;
                d.entretiensTotalNotArchived = 0;

                let entretiens = Entretiens.find({societe:d.societe._id._str,archived:false}).fetch() || {};
                entretiens.forEach(e => {
                    e.commandes = Commandes.find({entretien:e._id._str}).fetch() || [];
                });
                entretiens.map(e=>{
                    d.entretiensTotalNotArchived++;
                    let lowestStatus = 3;
                    e.commandes.map(c=>{
                        d.commandesTotalNotArchived++;
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
                let totalKm = 0;
                Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v =>totalKm += v.kms[v.kms.length-1].kmValue)
                if(d.vehicles == 0){
                    d.avgKm = 0
                }else{
                    d.avgKm = parseInt(totalKm / d.vehicles)
                }
                d.nbOwned = 0;
                d.nbCRB = 0;
                d.nbCRC = 0;
                Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v=>{
                    let totalMonths = v.purchasePrice/v.monthlyPayement;
                    let monthsDone = parseInt(moment().diff(moment(v.payementBeginDate,"DD/MM/YYYY"),'months', true));
                    let monthsLeft = totalMonths - monthsDone;
                    if(parseInt(monthsLeft <= 0) || v.payementFormat == "CPT"){
                        d.nbOwned ++;
                    }else{
                        if(v.payementFormat == "CRB"){
                            d.nbCRB ++;
                        }if(v.payementFormat == "CRC"){
                            d.nbCRC ++;
                        }
                    }
                })
                let vsRaw = Vehicles.find({societe:d.societe._id._str}).fetch();
                vsRaw.map(v=>{
                    v.model = Models.findOne({_id:v.model})
                    v.volume = Volumes.findOne({_id:v.volume})
                })
                d.vehiclesVolumeRepartition = [];
                d.vehiclesModelRepartition = [];
                vsRaw.map(v=>{
                    if(d.vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str).length>0){
                        d.vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str)[0].value++; 
                    }else{
                        d.vehiclesModelRepartition.push({key:v.model._id._str,label:v.model.name,value:1})
                    }
                    if(d.vehiclesVolumeRepartition.filter(mr=>mr.key == v.volume._id._str).length>0){
                        d.vehiclesVolumeRepartition.filter(mr=>mr.key == v.volume._id._str)[0].value++; 
                    }else{
                        d.vehiclesVolumeRepartition.push({key:v.volume._id._str,label:v.volume.meterCube,value:1})
                    }
                })
            })
            return dashboard[0];
        }
    }
}