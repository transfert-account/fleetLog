import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations';
import ExportTemplates from '../exportTemplate/ExportTemplates';
import Licences from '../licence/licences';
import Entretiens from '../entretien/entretiens';
import Batiments from '../batimentControl/batimentControls';
import Accidents from '../accident/accidents';
import Pieces from '../piece/pieces';
import Energies from '../energy/energies';
import Functions from '../common/functions';
import { createHmac } from 'crypto'
import moment from 'moment'

import { Mongo } from 'meteor/mongo';
import { set } from 'lodash';
import Controls from '../control/controls';

export default {
    Query : {
        testThis(obj, args,{user}){
            if(user._id){
                try{
                    //NEW
                    Controls.remove({});
                    /*Vehicles.update(
                        {},
                        {   $set:{
                                controls:[]
                            },
                            $unset:{
                                obli:[],
                                prev:[]
                            }
                        },
                        {multi:true}
                    );
                    Pieces.update(
                        {
                            brand:null
                        },{
                            $set:{
                                brand:""
                            }
                        },
                        {multi:true}
                    );
                    Entretiens.remove({});*/

                    /*
                    let as = Accidents.find({}).fetch();
                    as.forEach(a=>{
                        Accidents.update(
                            {
                                _id: a._id
                            },{
                                $set:{
                                    occurenceMonth:parseInt(a.occurenceDate.split("/")[1]),
                                    occurenceYear:parseInt(a.occurenceDate.split("/")[2]),
                                }
                            }
                        );
                    })
                    Vehicles.update(
                        {},{
                            $set:{
                                obli:[],
                                prev:[],
                            }
                        },
                        {multi:true}
                    );
                    Locations.update({},{$set:{archiveJustification:""}});
                    Entretiens.remove({});
                    ExportTemplates.remove({type:"entretien"})
                    let cs = ["batiments","equipements","equipementDescription","commandes"];
                    cs.map(c=> {
                        new Mongo.Collection(c).remove({})
                    })*/



                    //OLD
                    /*let accs = Accidents.find({}).fetch();
                    accs.forEach(acc => {
                        let newresponsabilite;
                        let newreglementAssureur;
                        let newchargeSinistre;
                        let newmontantInterne;
                        if(acc.responsabilite == -1){
                            newresponsabilite = 0;
                        }else{
                            newresponsabilite = acc.responsabilite;
                        }
                        if(acc.reglementAssureur == -1){
                            newreglementAssureur = 0;
                        }else{
                            newreglementAssureur = acc.reglementAssureur;
                        }
                        if(acc.chargeSinistre == -1){
                            newchargeSinistre = 0;
                        }else{
                            newchargeSinistre = acc.chargeSinistre;
                        }
                        if(acc.montantInterne == -1){
                            newmontantInterne = 0;
                        }else{
                            newmontantInterne = acc.montantInterne;
                        }
                        Accidents.update(
                            {
                                _id:acc._id
                            },{
                                $set: {
                                    driver:"",
                                    responsabilite:newresponsabilite,
                                    reglementAssureur:newreglementAssureur,
                                    chargeSinistre:newchargeSinistre,
                                    montantInterne:newmontantInterne
                                }
                            },{multi:true}
                        );
                    });/*
                    /*let e = Energies.find({}).fetch()[0];
                    Locations.update(
                        {},{
                            $set: {
                                energy:e._id._str,
                                accidents:[]
                            }
                        },{multi:true}
                    );
                    Accidents.update(
                        {},{
                            $unset: {
                                cost:"",
                                questions:""
                            }
                        },{multi:true}
                    );
                    Accidents.update(
                        {},{
                            $set: {
                                answers:[
                                    {
                                      page:1,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""}
                                      ]
                                    },{
                                      page:2,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""},
                                        {index:3,status:"virgin",answer:""},
                                        {index:4,status:"virgin",answer:""}
                                      ]
                                    },{
                                      page:3,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""},
                                        {index:3,status:"virgin",answer:""}
                                      ]
                                    },{
                                      page:4,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""},
                                        {index:3,status:"virgin",answer:""},
                                        {index:4,status:"virgin",answer:""}
                                      ]
                                    },{
                                      page:5,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""},
                                        {index:3,status:"virgin",answer:""},
                                        {index:4,status:"virgin",answer:""}
                                      ]
                                    },{
                                      page:6,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""}
                                      ]
                                    },{
                                      page:7,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""},
                                        {index:3,status:"virgin",answer:""}
                                      ]
                                    },{
                                      page:8,
                                      fields:[
                                        {index:1,status:"virgin",answer:""},
                                        {index:2,status:"virgin",answer:""}
                                      ]
                                    }
                                ]
                            }
                        },{multi:true}
                    );
                    let vs = Vehicles.find({}).fetch();
                    vs.forEach(v=>{
                        Vehicles.update(
                            {
                                _id:v._id
                            },{
                                $push: {
                                    "brokenHistory": {
                                        _id: new Mongo.ObjectID(),
                                        date:new Date().getDate().toString().padStart(2,0) + '/' + parseInt(new Date().getMonth()+1).toString().padStart(2,0) + '/' + new Date().getFullYear() + " " + parseInt(new Date().getUTCHours()+1).toString().padStart(2,0) + ":" + parseInt(new Date().getUTCMinutes()).toString().padStart(2,0) + ":" + parseInt(new Date().getUTCSeconds()).toString().padStart(2,0),
                                        content:v.brokenReason,
                                        statut:v.broken
                                    }
                                }
                            }
                        )
                        if(v.archived && v.archiveReason != ""){
                            VehicleArchiveJustifications.insert({
                                _id:new Mongo.ObjectID(),
                                justification:v.archiveReason
                            },(err,archJust)=>{
                                Vehicles.update(
                                    {
                                        _id:v._id
                                    },{
                                        $set: {
                                            archiveJustification:archJust._str,
                                        }
                                    }
                                );
                            });
                        }
                        Vehicles.update({_id:v._id},{$unset: {archiveReason:"",brokenReason:""}});
                    })
                    Vehicles.update(
                        {},{
                            $set: {
                                crf:"",
                                ida:"",
                                scg:"",
                                sold:false,
                                soldOnDate:"",
                            }
                        },
                        {multi:true}
                    );
                    let licences = Licences.find({}).fetch();
                    let nuked = 0;
                    licences.map(l=>{
                        if(l.vehicle.length > 0){
                            let vehicles = Vehicles.find({_id:l.vehicle}).fetch();
                            if(vehicles.length == 0){
                                nuked++;
                                Licences.update(
                                    {
                                        _id:l._id
                                    },
                                    {
                                        $set: {
                                            vehicle:""
                                        }
                                    },
                                    {multi:true}
                                );
                            }
                        }
                    })
                    Vehicles.update(
                        {},{
                            $set: {
                                selling:false,
                                sellingReason:"",
                                sellingSince:"",
                                broken:false,
                                brokenReason:"",
                                brokenSince:""
                            }
                        },
                        {multi:true}
                    );
                    Entretiens.update(
                        {},{
                            $set: {
                                fromControl:false,
                                control:null
                            }
                        },
                        {multi:true}
                    );
                    Equipements.update(
                        {},{
                            $set: {
                                entretienCreated:false,
                                entretien:""
                            }
                        },
                        {multi:true}
                    );*/
                    /*
                    data.map(v=>{
                        Vehicles.update(
                            {
                                _id: new Mongo.ObjectID(v._id)
                            },{
                                $set: {
                                    monthlyPayement:v.monthlyPayement
                                }
                            }
                        );
                    })*/
                    return [{status:true,message:'brand null is now empty string and all old controls unaffected and all entretiens deleted'}];
                }catch(e){
                    throw e;
                    return [{status:false,message:e.message}];
                }
                
            }
            throw new Error('Unauthorized');
        },
    },
    Mutation:{
        nukeDeleteById(obj, {_id,object,pass},{user}){
            if(user._id){
                if(createHmac('sha256', pass).update('I love my dog').digest('hex') == process.env.NUKE_CODE){
                    if(object == "accident"){
                        Accidents.remove({
                            _id:new Mongo.ObjectID(_id)
                        });
                        return [{status:true,message:'Suppression réussie',obj:JSON.stringify({})}];
                    }
                    return [{status:false,message:'UNKNOWN OBJECT',obj:JSON.stringify({})}];
                }
                return [{status:false,message:'BAD DEV KEY',obj:JSON.stringify({})}];
            }
            throw new Error('Unauthorized');
        },
    }
}