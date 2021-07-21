import Societes from '../societe/societes.js';
import Vehicles, { VEHICLES } from '../vehicle/vehicles.js';
import Locations from '../location/locations.js';
import Entretiens from '../entretien/entretiens';
import Accidents from '../accident/accidents.js';
import Licences from '../licence/licences';

import Documents from '../document/documents';

import Brands from '../brand/brands.js';
import Models from '../model/models.js';
import Energies from '../energy/energies'
import Volumes from '../volume/volumes.js';
import Colors from '../color/colors.js';
import Organisms from '../organism/organisms.js';
import PayementTimes from '../payementTime/payementTimes';

import VehicleArchiveJustifications from '../vehicleArchiveJustification/vehicleArchiveJustifications';
import InterventionNature from '../interventionNature/interventionNatures';

import JobLogs from '../job/jobLogs';

import Controls from "../control/controls.js";

import AWS from 'aws-sdk';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';

const bound = Meteor.bindEnvironment((callback) => {callback();});

const msFormat = "DD/MM/YYYYY - HH:mm:ss.SSS"

const createLogBook = (_id,key,timeStart) => {
    JobLogs.insert({
        _id:_id,
        job:key,
        timeStart:timeStart.format(),
        timeEnd:null,
        executionTime:null,
        logs:[
            {
                timestamp:moment().format(msFormat),
                text:"Début du cron job : [" + key + "]",
                type:"text"
            }
        ]
    })
}
const closeLogBook = (_id,key,timeStart) => {
    JobLogs.update({
        _id:_id
    },{
        $set:{
            timeEnd:moment().format(),
            executionTime:moment().diff(moment(timeStart))
        },
        $push:{
            "logs":
                {
                    timestamp:moment().format(msFormat),
                    text:"Fin du cron job : [" + key + "]",
                    type:"text"
                }
        },
    })
}

pushLog = (_id,text,type,options) => {
    if(type == "text"){
        JobLogs.update({
            _id:_id
        },{
            $push:{
                "logs":
                    {
                        timestamp:moment().format(msFormat),
                        text:text,
                        type:"text"
                    }
            },
        })
    }
    if(type == "link" || type == "colored"){
        JobLogs.update({
            _id:_id
        },{
            $push:{
                "logs":
                    {
                        timestamp:moment().format(msFormat),
                        text:text,
                        options:JSON.stringify(options),
                        type:type
                    }
            },
        })
    }
}
pushLogBreakLine = (_id) => {
    JobLogs.update({
        _id:_id
    },{
        $push:{
            "logs":
                {
                    timestamp:moment().format(msFormat),
                    text:"",
                    type:"br"
                }
        },
    })
}

getControlNextOccurrence = (v,c,o) => {
    let color = "";
    let label = "";
    let nextOccurrence = "";
    let timing = "";
    let frequency = c.frequency;
    if(o.lastOccurrence == "none"){//Aucune données concernant un précedent contrôle
        if(c.firstIsDifferent){
            frequency = c.firstFrequency
        }
        if(c.unit == "km"){
            o.lastOccurrence = 0;//On part du principe que le dernier contrôle remonte a la mise en circulation du véhicule : 0km au compteur
        }else{
            o.lastOccurrence = v.firstRegistrationDate;//On part du principe que le dernier contrôle remonte a la date de mise en circulation du véhicule
        }
    }
    if(c.unit == "km"){
        if(parseInt(o.lastOccurrence) > parseInt(v.kms[v.kms.length-1].kmValue)){//Kilométrage du contrôle supérieur à celui du véhicule
            color = "grey"
            label = "Kilométrage du contrôle supérieur à celui du véhicule"
            nextOccurrence = "error"
            echeance="error"
            timing="error"
        }else{
            nextOccurrence = parseInt(parseInt(o.lastOccurrence) + parseInt(frequency)).toString() + " km";
            let left = parseInt((parseInt(o.lastOccurrence) + parseInt(frequency)) - kmValue);
            echeance = left;
            if(left<0){
                color = "red"
                timing = "late"
                label = Math.abs(left) + " km de retard"
            }else{
                label = Math.abs(left) + " km restant"
                if(left <= c.alert){
                    color = "orange"
                    timing = "soon"
                }else{
                    if(left > c.alert){
                        color = "green"
                        timing = "inTime"
                    }else{
                        color = "grey"
                        timing = "grey"
                    }
                }
            }
        }
    }else{
        nextOccurrence = moment(moment(o.lastOccurrence,"DD/MM/YYYY").add(frequency,(c.unit == "m" ? "M" : c.unit))).format("DD/MM/YYYY");
        let days = moment(moment(o.lastOccurrence,"DD/MM/YYYY").add(frequency,(c.unit == "m" ? "M" : c.unit)).format("DD/MM/YYYY"), "DD/MM/YYYY").diff(moment(),'days')
        echeance = days;
        if(days > 0){
            if(days > moment.duration(parseInt(c.alert),(c.alertUnit == "m" ? "M" : c.alertUnit)).asDays()){
                label = Math.abs(days) + " jours restant";
                color="green";
                timing = "inTime"
            }else{
                label = Math.abs(days) + " jours restant";
                color="orange";
                timing = "soon"
            }
        }else{
            label = Math.abs(days) + " jours de retard";
            timing = "late"
            color = "red";
        }
    }
    let hex = (color == "green" ? "2ecc71" : (color == "orange" ? "f39c12" : (color == "red" ? "ff6b6b" : "777777")))
    return {
        color:color,
        label:label,
        hex:hex,
        echeance:echeance,
        nextOccurrence:nextOccurrence,
        timing:timing
    }
}

export default {
    createLogBook:createLogBook,
    closeLogBook:closeLogBook,
    ////////////////////////////////////
    //////////// CRON JOBS /////////////
    ////////////////////////////////////
    entretiensCreationFromControlAlertStep : (key,_id,timeStart) => {
        try {
            let vehicles = Vehicles.find().fetch(); // pour chaque vehicule
            vehicles.forEach(v=>{v.controls.map(cs=>{ // pour chanque controle de chaque vehicules
                cs.control = Controls.findOne({_id:new Mongo.ObjectID(cs._id)}) // on affecte la definition du controle en remplacement de son _id
            })})
            pushLogBreakLine(_id)
            pushLog(_id,vehicles.length + " véhicules à traiter.","text",{})
            pushLogBreakLine(_id)
            pushLog(_id,"Calcul des échéances ... ","text",{})
            pushLogBreakLine(_id)
            let totalCheck = 0;
            vehicles.map(v=>{
                v.brand = Brands.findOne({_id:new Mongo.ObjectID(v.brand)})
                v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)})
                v.controls.map(cs=>{ // pour chanque controle de chaque vehicules
                    totalCheck++;
                    cs.creationNeeded = false;
                    if(cs.entretien == null || cs.entretien == ""){
                        let next =  getControlNextOccurrence(v,cs.control,cs); // on determine l'echeance du prochain entretien
                        if(next.timing != "inTime"){
                            pushLog(_id,"","colored",{
                                before:v.registration + " (" + v.brand.name + " "+ v.model.name + "), entretien nécessaire pour : " + cs.control.name + " : ",
                                after:".",
                                colored:next.label,
                                hex:next.hex
                            })
                            cs.creationNeeded = true
                        }
                    }
                })
            })
            pushLogBreakLine(_id)
            pushLog(_id,"Echéance de " + totalCheck + " contrôles vérifiées.","text",{})
            pushLog(_id,"Echéance de " + vehicles.reduce((a,v)=>{return a + v.controls.filter(cs=>cs.creationNeeded).length},0) + " contrôles nécessitant un entretien.","text",{})
            pushLogBreakLine(_id)
            pushLog(_id,"Création des entretiens ... ","text",{})
            pushLogBreakLine(_id)
            vehicles.map(v=>{v.controls.filter(cs=>cs.creationNeeded).map(cs=>{ // pour chaque controle nécessitant la création d'un entretien
                let entretienId = new Mongo.ObjectID()
                let vehicle = Vehicles.findOne({_id:v._id})
                Entretiens.insert({
                    _id:entretienId,
                    societe:vehicle.societe,
                    type:cs.control.ctrlType,
                    originNature:null,
                    originControl:cs.control._id._str,
                    occurenceDate:"",
                    kmAtFinish:0,
                    vehicle:vehicle._id._str,
                    piecesQty:[],
                    status:0,
                    time:0,
                    notes:[{
                        _id:new Mongo.ObjectID(),
                        text:"Entretien généré automatique par le contrôle " + cs.control.name + " lié au véhicule " + vehicle.registration + " (" + moment().format('DD/MM/YYYY HH:mm:ss') + ")" ,
                        date:moment().format('DD/MM/YYYY HH:mm:ss')
                    }],
                    archived:false,
                    user:"",
                });
                Vehicles.update(
                    {
                        _id: vehicle._id,
                        "controls._id": cs.control._id._str
                    }, {
                        $set: {
                            "controls.$.entretien": entretienId._str
                        }
                    }
                )
                pushLog(_id,v.registration + " (" + cs.control.name + ") : entretien créé : ","link",{
                    link:"/entretien/"+entretienId._str,
                    linkLabel:" voir l'entretien"
                })
            })})
            pushLogBreakLine(_id)
            closeLogBook(_id,key,timeStart)
        } catch (error) {
            console.log(error)
        }
    },
    check_km_value_km_report:(key,_id,timeStart) => {
        try {
            let vehicles = Vehicles.find().fetch(); // pour chaque vehicule
            pushLogBreakLine(_id)
            pushLog(_id,vehicles.length + " vehicles to verify.","text",{})
            pushLogBreakLine(_id)
            pushLog(_id,"Verifying consistency ... ","text",{})
            pushLogBreakLine(_id)
            let totalCheck = 0;
            let inconsistency = 0;
            vehicles.map(v=>{
                v.brand = Brands.findOne({_id:new Mongo.ObjectID(v.brand)})
                v.model = Models.findOne({_id:new Mongo.ObjectID(v.model)})
                if(v.km != v.kms[v.kms.length-1].kmValue){
                    pushLog(_id,v.registration + " (" + v.brand.name + " " + v.model.name + ") value=" + v.km + "km, last="  + v.kms[v.kms.length-1].kmValue + "km : ","link",{
                        link:"/parc/vehicles/"+v._id._str,
                        linkLabel:" voir le véhicule"
                    })
                    inconsistency++;
                }
                totalCheck++;
            })
            pushLogBreakLine(_id)
            pushLog(_id,"Km value of " + totalCheck + " vehicles verified.","text",{})
            pushLog(_id,inconsistency + " inconsistency detected.","text",{})
            pushLog(_id,"Solving inconsistency ... ","text",{})
            pushLogBreakLine(_id)
            vehicles.map(v=>{
                if(v.km != v.kms[v.kms.length-1].kmValue){
                    Vehicles.update({
                        _id:v._id
                    },{
                        $set:{
                            km : v.kms[v.kms.length-1].kmValue
                        }
                    })
                }
            })
            closeLogBook(_id,key,timeStart)
        } catch (error) {
            console.log(error)
        }  
    },
    ////////////////////////////////////
    //////////// CHECK KMS /////////////
    ////////////////////////////////////
    checkKmsConsistency : (_id,date,value) => {
        let kms = Vehicles.findOne({_id:new Mongo.ObjectID(_id)}).kms // Recupération de la liste des relevé kilométrique
        if(kms.filter(k=>k.reportDate == date).length > 0){return [{status:false,message:'Un seul relevé kilométrique seulement par jour'}];}
        kms.push({new:true,reportDate:date,kmValue:value}); // Ajout du nouveau relevé
        kms = kms.sort((a,b) => moment(a.reportDate,"DD/MM/YYYY") - moment(b.reportDate,"DD/MM/YYYY")); // Tri des relevé par date
        let index = kms.map(e => (e.new ? true : false)).indexOf(true); // Récuperation de l'index du nouveau relevé
        if(kms[index-1].kmValue < kms[index].kmValue && index == kms.length-1){ // Dernier en date
            return [{status:true,message:'Contrôle de cohérence date/kilométrage ok'}]
        }else{
            if(kms[index-1].kmValue < kms[index].kmValue && kms[index+1].kmValue > kms[index].kmValue){ //Placé entre deux date déjà présente
                return [{status:true,message:'Contrôle de cohérence date/kilométrage ok'}]
            }
        }
        return [{status:false,message:'Echec du contrôle de cohérence date/kilométrage'}];
    },
    checkLocKmsConsistency : (_id,date,value) => {
        let kms = Vehicles.findOne({_id:new Mongo.ObjectID(_id)}).kms // Recupération de la liste des relevé kilométrique
        if(kms.filter(k=>k.reportDate == date).length > 0){return [{status:false,message:'Un seul relevé kilométrique seulement par jour'}];}
        kms.push({new:true,reportDate:date,kmValue:value}); // Ajout du nouveau relevé
        kms = kms.sort((a,b) => moment(a.reportDate,"DD/MM/YYYY") - moment(b.reportDate,"DD/MM/YYYY")); // Tri des relevé par date
        let index = kms.map(e => (e.new ? true : false)).indexOf(true); // Récuperation de l'index du nouveau relevé
        if(kms[index-1].kmValue < kms[index].kmValue && index == kms.length-1){ // Dernier en date
            return [{status:true,message:'Contrôle de cohérence date/kilométrage ok'}]
        }else{
            if(kms[index-1].kmValue < kms[index].kmValue && kms[index+1].kmValue > kms[index].kmValue){ //Placé entre deux date déjà présente
                return [{status:true,message:'Contrôle de cohérence date/kilométrage ok'}]
            }
        }
        return [{status:false,message:'Echec du contrôle de cohérence date/kilométrage'}];
    },
    sortKms : kms => {
        return kms.sort((a,b) => {
            return moment(a.reportDate,"DD/MM/YYYY") - moment(b.reportDate,"DD/MM/YYYY");
        });
    },
    ////////////////////////////////////
    ///////// CONTROLS GETTER //////////
    ////////////////////////////////////
    agglomerateKms : v => {
        let kms = {};
        v.kms.forEach(k=>{
            let d = k.reportDate.split("/");
            if(kms[d[1]+"/"+d[2]] == undefined){
                kms[d[1]+"/"+d[2]] = []
            }
            kms[d[1]+"/"+d[2]].push(k);
        })
        return kms;
    },
    //v est le véhicule
    //c est la définition du controle
    //o est l'occurrence du controle pour ce véhicule
    getControlNextOccurrence : getControlNextOccurrence,
    getObli : () => Controls.find({ctrlType:"obli"}).fetch(),
    getPrev : () => Controls.find({ctrlType:"prev"}).fetch(),
    ////////////////////////////////////
    //// SINGLE DATA ASKER BY ID ///////
    ////////////////////////////////////

    //ACCIDENTS
    ACCIDENT_REQUEST_VEHICLE_ROW_DATA : accident => {
        REQUEST_VEHICLE_ROW_DATA(accident,"vehicle")
    },
    ACCIDENT_REQUEST_VEHICLE_FULL_DATA : accident => {
        REQUEST_VEHICLE_FULL_DATA(accident,"vehicle")
    },

    ////////////////////////////////////
    /////// MULTIPLE DATA ASKER ////////
    ////////////////////////////////////

    //VEHICULE
    VEHICLE_REQUEST_ACCIDENT_LIST : vehicle => {
        vehicle.accidents = Accidents.find({vehicle:vehicle._id._str}).fetch()
    },
    VEHICLE_REQUEST_ACCIDENT_LIST_IN_MONTH : (vehicle,month,year) => {
        let acs = []
        acs  = Accidents.find({vehicle:vehicle._id._str}).fetch();
        acs = acs.filter(a=>parseInt(a.occurenceDate.split("/")[1]) == month && parseInt(a.occurenceDate.split("/")[2]) == year)
        return acs;
    },

    ////////////////////////////////////
    /////////// DATA REQUEST ///////////
    ////////////////////////////////////

    //VEHICLE
    REQUEST_VEHICLE_ROW_DATA : (obj,prop) => {
        let v = Vehicles.findOne({_id:new Mongo.ObjectID(obj[prop])})
        obj[prop] = AFFECT_VEHICLE_ROW_DATA(v)
    },
    REQUEST_VEHICLE_FULL_DATA : (obj,prop) => {
        let v = Vehicles.findOne({_id:new Mongo.ObjectID(obj[prop])})
        obj[prop] = AFFECT_VEHICLE_FULL_DATA(v)
    },
    //ACCIDENT
    REQUEST_ACCIDENT_ROW_DATA : (obj,prop) => {
        let v = Vehicles.findOne({_id:new Mongo.ObjectID(obj[prop])})
        obj[prop] = AFFECT_ACCIDENT_ROW_DATA(v)
    },
    REQUEST_ACCIDENT_FULL_DATA : (obj,prop) => {
        let v = Vehicles.findOne({_id:new Mongo.ObjectID(obj[prop])})
        obj[prop] = AFFECT_ACCIDENT_FULL_DATA(v)
    },
    
    ////////////////////////////////////
    /////////// DATA AFFECT ////////////
    ////////////////////////////////////

    //VEHICLE
    AFFECT_VEHICLE_MINIMAL_DATA : vehicle => {
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
        }catch(e){
            console.error(e)
        }
    },
    AFFECT_VEHICLE_ROW_DATA : vehicle => {
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
            if(vehicle.color != null && vehicle.color.length > 0){
                vehicle.color = Colors.findOne({_id:new Mongo.ObjectID(vehicle.color)});
            }else{
                vehicle.color = {_id:""};
            }
            if(vehicle.volume != null && vehicle.volume.length > 0){
                vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(vehicle.volume)});
            }else{
                vehicle.volume = {_id:""};
            }
            if(vehicle.energy != null && vehicle.energy.length > 0){
                vehicle.energy = Energies.findOne({_id:new Mongo.ObjectID(vehicle.energy)});
            }else{
                vehicle.energy = {_id:""};
            }
            if(vehicle.cg != null && vehicle.cg.length > 0){
                vehicle.cg = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cg)});
            }else{
                vehicle.cg = {_id:""};
            }
            if(vehicle.cv != null && vehicle.cv.length > 0){
                vehicle.cv = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cv)});
            }else{
                vehicle.cv = {_id:""};
            }
            if(vehicle.crf != null && vehicle.crf.length > 0){
                vehicle.crf = Documents.findOne({_id:new Mongo.ObjectID(vehicle.crf)});
            }else{
                vehicle.crf = {_id:""};
            }
            if(vehicle.ida != null && vehicle.ida.length > 0){
                vehicle.ida = Documents.findOne({_id:new Mongo.ObjectID(vehicle.ida)});
            }else{
                vehicle.ida = {_id:""};
            }
            if(vehicle.scg != null && vehicle.scg.length > 0){
                vehicle.scg = Documents.findOne({_id:new Mongo.ObjectID(vehicle.scg)});
            }else{
                vehicle.scg = {_id:""};
            }
        }catch(e){
            console.error(e)
        }
    },
    AFFECT_VEHICLE_FULL_DATA : vehicle => {
        try{
            vehicle.lastKmUpdate = vehicle.kms[vehicle.kms.length-1].reportDate
            vehicle.km = vehicle.kms[vehicle.kms.length-1].kmValue
            if(vehicle.brokenHistory == null || vehicle.brokenHistory.length == 0){
                vehicle.brokenHistory = [];
            }
            if(vehicle.payementFormat == "CRB"){
                vehicle.property = false
            }else{
                vehicle.property = true
            }
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
            if(vehicle.payementOrg != null && vehicle.payementOrg.length > 0){
                vehicle.payementOrg = Organisms.findOne({_id:new Mongo.ObjectID(vehicle.payementOrg)});
            }else{
                vehicle.payementOrg = {_id:""};
            }
            if(vehicle.color != null && vehicle.color.length > 0){
                vehicle.color = Colors.findOne({_id:new Mongo.ObjectID(vehicle.color)});
            }else{
                vehicle.color = {_id:""};
            }
            if(vehicle.volume != null && vehicle.volume.length > 0){
                vehicle.volume = Volumes.findOne({_id:new Mongo.ObjectID(vehicle.volume)});
            }else{
                vehicle.volume = {_id:""};
            }
            if(vehicle.energy != null && vehicle.energy.length > 0){
                vehicle.energy = Energies.findOne({_id:new Mongo.ObjectID(vehicle.energy)});
            }else{
                vehicle.energy = {_id:""};
            }
            if(vehicle.payementTime != null && vehicle.payementTime.length > 0){
                vehicle.payementTime = PayementTimes.findOne({_id:new Mongo.ObjectID(vehicle.payementTime)});
            }else{
                vehicle.payementTime = {_id:""};
            }
            if(vehicle.archived && vehicle.archiveJustification.length > 0){
                vehicle.archiveJustification = VehicleArchiveJustifications.findOne({_id:new Mongo.ObjectID(vehicle.archiveJustification)});
            }else{
                vehicle.archiveJustification = {_id:""};
            }
            if(vehicle.cg != null && vehicle.cg.length > 0){
                vehicle.cg = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cg)});
            }else{
                vehicle.cg = {_id:""};
            }
            if(vehicle.cv != null && vehicle.cv.length > 0){
                vehicle.cv = Documents.findOne({_id:new Mongo.ObjectID(vehicle.cv)});
            }else{
                vehicle.cv = {_id:""};
            }
            if(vehicle.crf != null && vehicle.crf.length > 0){
                vehicle.crf = Documents.findOne({_id:new Mongo.ObjectID(vehicle.crf)});
            }else{
                vehicle.crf = {_id:""};
            }
            if(vehicle.ida != null && vehicle.ida.length > 0){
                vehicle.ida = Documents.findOne({_id:new Mongo.ObjectID(vehicle.ida)});
            }else{
                vehicle.ida = {_id:""};
            }
            if(vehicle.scg != null && vehicle.scg.length > 0){
                vehicle.scg = Documents.findOne({_id:new Mongo.ObjectID(vehicle.scg)});
            }else{
                vehicle.scg = {_id:""};
            }
            if(
                parseInt(vehicle.purchasePrice) > 0 &&
                parseInt(vehicle.insurancePaid) > 0 &&
                vehicle.payementBeginDate != "" &&
                vehicle.payementEndDate != "" &&
                vehicle.payementTime != "" &&
                parseInt(vehicle.monthlyPayement) > 0 &&
                vehicle.payementOrg != "" &&
                vehicle.payementFormat != ""
            ){
                vehicle.financialInfosComplete = true;
            }else{
                vehicle.financialInfosComplete = false;
            }
        }catch(e){
            console.error(e)
        }
    },
    
    //ACCIDENT
    AFFECT_ACCIDENT_ROW_DATA : accident => {
        if(accident.societe != null && accident.societe.length > 0){
            accident.societe = Societes.findOne({_id:new Mongo.ObjectID(accident.societe)});
        }else{
            accident.societe = {_id:""};
        }
        if(accident.constat != null && accident.constat.length > 0){
            accident.constat = Documents.findOne({_id:new Mongo.ObjectID(accident.constat)});
        }else{
            accident.constat = {_id:""};
        }
        if(accident.rapportExp != null && accident.rapportExp.length > 0){
            accident.rapportExp = Documents.findOne({_id:new Mongo.ObjectID(accident.rapportExp)});
        }else{
            accident.rapportExp = {_id:""};
        }
        if(accident.facture != null && accident.facture.length > 0){
            accident.facture = Documents.findOne({_id:new Mongo.ObjectID(accident.facture)});
        }else{
            accident.facture = {_id:""};
        }
        if(accident.questionary != null && accident.questionary.length > 0){
            accident.questionary = Documents.findOne({_id:new Mongo.ObjectID(accident.questionary)});
        }else{
            accident.questionary = {_id:""};
        }
    },
    AFFECT_ACCIDENT_FULL_DATA : accident => {
        if(accident.societe != null && accident.societe.length > 0){
            accident.societe = Societes.findOne({_id:new Mongo.ObjectID(accident.societe)});
        }else{
            accident.societe = {_id:""};
        }
        if(accident.constat != null && accident.constat.length > 0){
            accident.constat = Documents.findOne({_id:new Mongo.ObjectID(accident.constat)});
        }else{
            accident.constat = {_id:""};
        }
        if(accident.rapportExp != null && accident.rapportExp.length > 0){
            accident.rapportExp = Documents.findOne({_id:new Mongo.ObjectID(accident.rapportExp)});
        }else{
            accident.rapportExp = {_id:""};
        }
        if(accident.facture != null && accident.facture.length > 0){
            accident.facture = Documents.findOne({_id:new Mongo.ObjectID(accident.facture)});
        }else{
            accident.facture = {_id:""};
        }
        if(accident.questionary != null && accident.questionary.length > 0){
            accident.questionary = Documents.findOne({_id:new Mongo.ObjectID(accident.questionary)});
        }else{
            accident.questionary = {_id:""};
        }
    },

    ////////////////////////////////////
    //////// AMAZON S3 RELATED /////////
    ////////////////////////////////////
    getSignedDocumentDownloadLink: async (_id) => {
        return new Promise((resolve, reject) => {
            try{
                let doc = Documents.findOne({_id:new Mongo.ObjectID(_id)});
                let s3 = new AWS.S3({
                    region: 'eu-west-3',
                    apiVersion: '2006-03-01',
                    signatureVersion: 'v4'
                });
                const params = {
                    Bucket: "wg-logistique",
                    Key: doc.name ,
                    Expires: 60 * 2
                }
                s3.getSignedUrl('getObject', params, function (err, url) {
                    if (err) {
                        reject ({linkGenerationSuccess:false,err:err})
                    }
                    resolve ({linkGenerationSuccess:true,link:url})
                })
            }catch (err) {
                reject ({linkGenerationSuccess:false,err:err})
            }
        })
    },
    getSignedStoredObjectDownloadLink: async (name) => {
        return new Promise((resolve, reject) => {
            try{
                let s3 = new AWS.S3({
                    region: 'eu-west-3',
                    apiVersion: '2006-03-01',
                    signatureVersion: 'v4'
                });
                const params = {
                    Bucket: "wg-logistique",
                    Key: name ,
                    Expires: 60 * 2
                }
                s3.getSignedUrl('getObject', params, function (err, url) {
                    if (err) {
                        reject ({linkGenerationSuccess:false,err:err})
                    }
                    resolve ({linkGenerationSuccess:true,link:url})
                })
            }catch (err) {
                reject ({linkGenerationSuccess:false,err:err})
            }
        })
    },
    shipToBucket : async (file,societe,type,docId) => {
        return new Promise((resolve,reject)=>{
            const { createReadStream, filename, mimetype, encoding } = file;
            let ext = filename.split(".")[filename.split(".").length-1]
            let fileInfo = {
                originalFilename:filename,
                ext:ext,
                mimetype:mimetype,
                docName:"doc_"+type+"_"+societe.trikey+"_"+moment().format('YYYY_MM_DD_HH_mm_ss_')+docId+"."+ext
            }
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01'
            });
            let fileStream = createReadStream();
            fileStream.on('error', function(err) {
                console.log('File Error', err);
            });
            let uploadParams = {Bucket: 'wg-logistique', Key: fileInfo.docName, Body: fileStream};
            s3.upload(uploadParams, (err, data) => {
                bound(()=>{
                    if (err) {
                        resolve({uploadSucces:false,err:err})
                    }else{
                        resolve({uploadSucces:true,data:data,fileInfo:fileInfo})
                    }
                });
            })
        })
    },
    deleteObjectAndDoc : async (name,docId) => {
        return new Promise((resolve,reject)=>{
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01',
                signatureVersion: 'v4'
            });
            let params = {
                Bucket: "wg-logistique", 
                Key: name
            };
            s3.deleteObject(params, function(err, data) {
                bound(()=>{
                    if(err){
                        resolve({deleteSucces:false,err:err})
                    }else{
                        Documents.remove({
                            _id:new Mongo.ObjectID(docId)
                        });
                        resolve({deleteSucces:true})
                    }
                });
            });
        })
    },
    deleteObject : async (name) => {
        return new Promise((resolve,reject)=>{
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01',
                signatureVersion: 'v4'
            });
            let params = {
                Bucket: "wg-logistique", 
                Key: name
            };
            s3.deleteObject(params, function(err, data) {
                bound(()=>{
                    if(err){
                        resolve({deleteSucces:false,err:err})
                    }else{
                        resolve({deleteSucces:true})
                    }
                });
            });
        });
    },
    getStoredObjectsList : async () => {
        return new Promise((resolve,rejectAllStoredObjects)=>{
            AWS.config.update({
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            })
            let s3 = new AWS.S3({
                region: 'eu-west-3',
                apiVersion: '2006-03-01',
                signatureVersion: 'v4'
            });
            const params = {
                Bucket: "wg-logistique"
            }
            const listAllKeys = (params, out = []) => new Promise((resolve, reject) => {
                s3.listObjectsV2(params).promise().then(({Contents, IsTruncated, NextContinuationToken}) => {
                    out.push(...Contents);
                    !IsTruncated ? resolve(out) : resolve(listAllKeys(Object.assign(params, {ContinuationToken: NextContinuationToken}), out));
                }).catch(reject);
            });
            listAllKeys(params).then(data=>{
                resolve({readSucces:true,list:data})
            }).catch(err=>{
                reject({readSucces:false,error:err})
            });
        });
    }
}