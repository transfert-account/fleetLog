import Entretiens from '../entretien/entretiens';
import Vehicles from '../vehicle/vehicles';
import Models from '../model/models';
import Volumes from '../volume/volumes';
import Locations from '../location/locations';
import Licences from '../licence/licences';
import Societes from '../societe/societes';
import Accidents from '../accident/accidents';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

/*const affectDashboardData = d => {
    d.vehicleCV = {total:0,affected:0,missing:0};
    d.vehicleCG = {total:0,affected:0,missing:0};
    d.locationCV = {total:0,affected:0,missing:0};
    d.locationCG = {total:0,affected:0,missing:0};
    d.locationContrat = {total:0,affected:0,missing:0};
    d.locationRestitution = {total:0,affected:0,missing:0};
    d.batimentsFicheInter = {total:0,affected:0,missing:0};
    d.entretiensFicheInter = {total:0,affected:0,missing:0};
    d.controlsFicheInter = {total:0,affected:0,missing:0};
    d.licencesLicence = {total:0,affected:0,missing:0};
    d.accidentsConstat = {total:0,affected:0,missing:0};
    d.accidentsExpert = {total:0,affected:0,missing:0};
    d.accidentsFacture = {total:0,affected:0,missing:0};
    d.vehicles = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().length
    d.vehiclesLate = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().filter(v=>moment().diff(moment(v.kms[v.kms.length-1].reportDate,"DD/MM/YYYY"),'days', true)>9).length
    d.vehiclesVeryLate = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().filter(v=>moment().diff(moment(v.kms[v.kms.length-1].reportDate,"DD/MM/YYYY"),'days', true)>14).length
    d.vehiclesLate = d.vehiclesLate - d.vehiclesVeryLate
    d.vehicles = d.vehicles - d.vehiclesLate - d.vehiclesVeryLate
    let locationsRaw = Locations.find({societe:d.societe._id._str,archived:false}).fetch();
    locationsRaw.map(l=>{
        if(l.cv != ""){
            d.locationCV.total += 1;
            d.locationCV.affected += 1;
        }else{
            d.locationCV.total += 1;
            d.locationCV.missing += 1;
        }
        if(l.cg != ""){
            d.locationCG.total += 1;
            d.locationCG.affected += 1;
        }else{
            d.locationCG.total += 1;
            d.locationCG.missing += 1;
        }
        if(l.contrat != ""){
            d.locationContrat.total += 1;
            d.locationContrat.affected += 1;
        }else{
            d.locationContrat.total += 1;
            d.locationContrat.missing += 1;
        }
        if(l.restitution != ""){
            d.locationRestitution.total += 1;
            d.locationRestitution.affected += 1;
        }else{
            d.locationRestitution.total += 1;
            d.locationRestitution.missing += 1;
        }
    })
    d.locations = locationsRaw.length
    d.locationsLate = locationsRaw.filter(l=>moment().diff(moment(l.kms[l.kms.length-1].reportDate,"DD/MM/YYYY"),'days', true)>9).length
    d.locationsVeryLate = locationsRaw.filter(l=>moment().diff(moment(l.kms[l.kms.length-1].reportDate,"DD/MM/YYYY"),'days', true)>14).length
    d.locationsLate = d.locationsLate - d.locationsVeryLate
    d.locations = d.locations - d.locationsLate - d.locationsVeryLate
    d.controlsTotal = 0;
    d.controlsOk = 0;
    d.controlsUrgent = 0;
    d.controlsLate = 0;
    Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v=>{
        if(v.cv != ""){
            d.vehicleCV.total += 1;
            d.vehicleCV.affected += 1;
        }else{
            d.vehicleCV.total += 1;
            d.vehicleCV.missing += 1;
        }
        if(v.cg != ""){
            d.vehicleCG.total += 1;
            d.vehicleCG.affected += 1;
        }else{
            d.vehicleCG.total += 1;
            d.vehicleCG.missing += 1;
        }
        v.equipements = Equipements.find({vehicle:v._id._str}).fetch() || {};
        v.equipements.forEach(e => {
            e.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)}) || {};
        });
        v.equipements.map(e=>{
            if(e.ficheInter != ""){
                d.controlsFicheInter.total += 1;
                d.controlsFicheInter.affected += 1;    
            }else{
                d.controlsFicheInter.total += 1;
                d.controlsFicheInter.missing += 1;    
            }
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
    let licencesRaw = Licences.find({societe:d.societe._id._str}).fetch();
    licencesRaw.map(l=>{
        if(l.licence != ""){
            d.licencesLicence.total += 1;
            d.licencesLicence.affected += 1;
        }else{
            d.licencesLicence.total += 1;
            d.licencesLicence.missing += 1;
        }
    })
    d.licences = licencesRaw.filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)>=14).length;
    d.licencesEndSoon = licencesRaw.filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<14).filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)>0).length
    d.licencesOver = licencesRaw.filter(l=>moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true)<0).length
    d.licenceFree = Licences.find({societe:d.societe._id._str,vehicle:""}).fetch().length;
    d.licenceAffected = d.licences - d.licenceFree;
    let batimentsRaw = Batiments.find({societe:d.societe._id._str}).fetch()
    batimentsRaw.map(b=>{
        if(b.ficheInter != ""){
            d.batimentsFicheInter.total += 1;
            d.batimentsFicheInter.affected += 1;
        }else{
            d.batimentsFicheInter.total += 1;
            d.batimentsFicheInter.missing += 1;
        }
    })
    d.batiments = batimentsRaw.filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)>=14).length;                
    d.batimentsEndSoon = batimentsRaw.filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)<14).filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)>0).length
    d.batimentsOver = batimentsRaw.filter(l=>moment(l.lastExecution,"DD/MM/YYYY").add(l.delay,"days").diff(moment(),'days', true)<0).length
    let accidentsRaw = Accidents.find({societe:d.societe._id._str}).fetch();
    accidentsRaw.map(a=>{
        if(!a.archived){
            if(a.constat != ""){
                d.accidentsConstat.total += 1;
                d.accidentsConstat.affected += 1;
            }else{
                d.accidentsConstat.total += 1;
                d.accidentsConstat.missing += 1;
            }
            if(a.rapportExp != ""){
                d.accidentsExpert.total += 1;
                d.accidentsExpert.affected += 1;
            }else{
                d.accidentsExpert.total += 1;
                d.accidentsExpert.missing += 1;
            }
            if(a.facture != ""){
                d.accidentsFacture.total += 1;
                d.accidentsFacture.affected += 1;
            }else{
                d.accidentsFacture.total += 1;
                d.accidentsFacture.missing += 1;
            }
        }
    })

    d.accidentsThisYear = accidentsRaw.filter(a=>{return moment(a.occurenceDate,"DD/MM/YYYY").year() == new Date().getFullYear()}).length;
    d.accidentsOpened = accidentsRaw.filter(a=>{return a.archived == false}).length;
    d.totalAccidentsCost = accidentsRaw.reduce((a, b)=> a + b.reglementAssureur + b.chargeSinistre + b.montantInterne, 0);

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
        if(e.ficheInter != ""){
            d.entretiensFicheInter.total += 1;
            d.entretiensFicheInter.affected += 1;    
        }else{
            d.entretiensFicheInter.total += 1;
            d.entretiensFicheInter.missing += 1;    
        }
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
    let vsRaw = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch();
    d.vehiclesVolumeRepartition = [];
    d.vehiclesModelRepartition = [];
    vsRaw.map(v=>{
        v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)})
        v.volume = Volumes.findOne({_id:new Mongo.ObjectID(v.volume)})
    })
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
    d.avgKm = 0;
    Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().map(v =>d.avgKm += v.kms[v.kms.length-1].kmValue)
    let nbV = Vehicles.find({societe:d.societe._id._str,archived:false}).fetch().length
    if(d.avgKm != 0 && nbV != 0){
        d.avgKm = parseInt(d.avgKm / nbV)
    }
}*/

const getGroupAvgKms = () => {
    let avgKm = 0;
    Vehicles.find({archived:false}).fetch().map(v =>avgKm += v.kms[v.kms.length-1].kmValue)
    let nbV = Vehicles.find({archived:false}).fetch().length
    if(avgKm != 0 && nbV != 0){
        avgKm = parseInt(avgKm / nbV)
        return avgKm;
    }else{
        return 0;
    }
    
}

const docDeepReduce = (ds,prop) => {
    return {
        total:ds.reduce((a, b)=> a + b[prop].total, 0),
        affected:ds.reduce((a, b)=> a + b[prop].affected, 0),
        missing:ds.reduce((a, b)=> a + b[prop].missing, 0)
    }
}

const getGroupVehicleRepartition = type => {
    let vehiclesVolumeRepartition = [];
    let vehiclesModelRepartition = [];
    let vsRawG = Vehicles.find({archived:false}).fetch();
    vsRawG.map(v=>{
        v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)})
        v.volume = Volumes.findOne({_id:new Mongo.ObjectID(v.volume)})
    })
    vsRawG.map(v=>{
        if(type == "vehiclesModelRepartition"){
            if(vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str).length>0){
                vehiclesModelRepartition.filter(mr=>mr.key == v.model._id._str)[0].value++; 
            }else{
                vehiclesModelRepartition.push({key:v.model._id._str,label:v.model.name,value:1})
            }
        }
        if(type == "vehiclesVolumeRepartition"){
            if(vehiclesVolumeRepartition.filter(vr=>vr.key == v.volume._id._str).length>0){
                vehiclesVolumeRepartition.filter(vr=>vr.key == v.volume._id._str)[0].value++; 
            }else{
                vehiclesVolumeRepartition.push({key:v.volume._id._str,label:v.volume.meterCube,value:1})
            }
        }
    })
    if(type == "vehiclesVolumeRepartition"){
        return vehiclesVolumeRepartition;
    }
    if(type == "vehiclesModelRepartition"){
        return vehiclesModelRepartition;
    }
    return {key:"err",label:"err",value:1};
}

export default {
    Query : {
        dashboards(obj, args,{user}){
            return []
            let dashboards = [];
            let societes = Societes.find().fetch() || {};
            societes.map(s=>{
                dashboards.push({societe:s})
            })
            dashboards.map(d=>{
                affectDashboardData(d)
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
                nbOwned:dashboards.reduce((a, b)=> a + b.nbOwned, 0),
                nbCRB:dashboards.reduce((a, b)=> a + b.nbCRB, 0),
                nbCRC:dashboards.reduce((a, b)=> a + b.nbCRC, 0),
                licenceAffected:dashboards.reduce((a, b)=> a + b.licenceAffected, 0),
                licenceFree:dashboards.reduce((a, b)=> a + b.licenceFree, 0),
                avgKm:getGroupAvgKms(),
                vehicleCV:docDeepReduce(dashboards,"vehicleCV"),
                vehicleCG:docDeepReduce(dashboards,"vehicleCG"),
                locationCV:docDeepReduce(dashboards,"locationCV"),
                locationCG:docDeepReduce(dashboards,"locationCG"),
                locationContrat:docDeepReduce(dashboards,"locationContrat"),
                locationRestitution:docDeepReduce(dashboards,"locationRestitution"),
                entretiensFicheInter:docDeepReduce(dashboards,"entretiensFicheInter"),
                controlsFicheInter:docDeepReduce(dashboards,"controlsFicheInter"),
                batimentsFicheInter:docDeepReduce(dashboards,"batimentsFicheInter"),
                licencesLicence:docDeepReduce(dashboards,"licencesLicence"),
                accidentsConstat:docDeepReduce(dashboards,"accidentsConstat"),
                accidentsExpert:docDeepReduce(dashboards,"accidentsExpert"),
                accidentsFacture:docDeepReduce(dashboards,"accidentsFacture"),
                vehiclesVolumeRepartition:getGroupVehicleRepartition("vehiclesVolumeRepartition"),
                vehiclesModelRepartition:getGroupVehicleRepartition("vehiclesModelRepartition")
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
                affectDashboardData(d)
            })
            return dashboard[0];
        }
    }
}