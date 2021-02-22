import Vehicles from '../vehicle/vehicles';
import VehicleArchiveJustifications from '../vehicleArchiveJustification/vehicleArchiveJustifications';
import Licences from '../licence/licences';
import Equipements from '../equipement/equipements';
import Entretiens from '../entretien/entretiens';
import Batiments from '../batiment/batiments';
import Accidents from '../accident/accidents';
import { Mongo } from 'meteor/mongo';
import Vehicle from '../../../ui/pages/Vehicle';

export default {
    Query : {
        testThis(obj, args,{user}){
            if(user._id){
                try{
                    Accidents.update(
                        {},{
                            $set: {
                                responsabilite:50,
                                reglementAssureur:0,
                                chargeSinistre:0,
                                montantInterne:0,
                                status:true
                            }
                        },{multi:true}
                    );
                    /*
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
                        console.log(v.registration + " : " + v.monthlyPayement)
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
                    return [{status:true,message:'Empty answers for all accidents'}];
                }catch(e){
                    throw e;
                    return [{status:false,message:e.message}];
                }
                
            }
            throw new Error('Unauthorized');
        }
    }
}