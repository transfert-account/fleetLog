import Vehicles from '../vehicle/vehicles';
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
                    Vehicles.update({},{$unset: {archiveReason:"",brokenReason:""}},{multi:true});
                    Vehicles.update(
                        {},{
                            $set: {
                                crf:"",
                                ida:"",
                                scg:"",
                                sold:false,
                            }
                        },
                        {multi:true}
                    );
                    /*
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
                    return [{status:true,message:'Nuked : archiveReason & brokenReason unset 1, new sold docs mass initiated to blank + sold:false'}];
                }catch(e){
                    throw e;
                    return [{status:false,message:e.message}];
                }
                
            }
            throw new Error('Unauthorized');
        }
    }
}