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

import AWS from 'aws-sdk';
import moment from 'moment';
import { Mongo } from 'meteor/mongo';
import Functions from '../common/functions';


const bound = Meteor.bindEnvironment((callback) => {callback();});

export default {
    ////////////////////////////////////
    ///////// CONTROLS GETTER //////////
    ////////////////////////////////////
    getObli : () => [
        {name:"Technique",key:"o1",unit:"y",frequency:"2",alertUnit:"m",alert:"2"},
        {name:"Hayon",key:"o2",unit:"m",frequency:"6",alertUnit:"m",alert:"1"},
        {name:"Tachymètre",key:"o3",unit:"y",frequency:"2",alertUnit:"m",alert:"2"},
        {name:"Pollution",key:"o4",unit:"y",frequency:"2",alertUnit:"m",alert:"2"}
    ],
    getPrev : () => [
        {name:"Essuie glaces",key:"p1",unit:"m",frequency:"6",alertUnit:"1",alert:"1"},
        {name:"Batterie",key:"p2",unit:"y",frequency:"4",alertUnit:"m",alert:"4"},
        {name:"Plaque",key:"p3",unit:"km",frequency:"40000",alertUnit:"km",alert:"4000"},
        {name:"Disque",key:"p4",unit:"km",frequency:"80000",alertUnit:"km",alert:"8000"},
        {name:"Pneumatiques (!)",key:"p5",unit:"km",frequency:"20000",alertUnit:"km",alert:"2000"},
        {name:"Bougies",key:"p6",unit:"km",frequency:"60000",alertUnit:"km",alert:"6000"},
        {name:"Ammortisseurs",key:"p7",unit:"km",frequency:"80000",alertUnit:"km",alert:"8000"},
        {name:"Filtre habitacle",key:"p8",unit:"km",frequency:"40000",alertUnit:"km",alert:"4000"},
        {name:"Filtre gazoil",key:"p9",unit:"km",frequency:"40000",alertUnit:"km",alert:"4000"},
        {name:"Filtre à air",key:"p10",unit:"km",frequency:"40000",alertUnit:"km",alert:"4000"},
        {name:"Filtre à huile",key:"p11",unit:"km",frequency:"30000",alertUnit:"km",alert:"3000"},
        {name:"Liquide de frein",key:"p12",unit:"y",frequency:"2",alertUnit:"m",alert:"2"}
    ],

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
        /*if(acs.length > 0){
            console.log(vehicle.registration + " " + month.month.name + " " + acs.length)
            console.log(acs.map(a=>a.occurenceDate))
        }*/
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