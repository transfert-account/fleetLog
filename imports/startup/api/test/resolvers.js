import Vehicles from '../vehicle/vehicles';
import Licences from '../licence/licences';
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
                    })*/
                    Batiments.update(
                        {},{
                            $set: {
                                ficheInter:""
                            }
                        },
                        {multi:true}
                    );
                    Entretiens.update(
                        {},{
                            $set: {
                                ficheInter:""
                            }
                        },
                        {multi:true}
                    );
                    Accidents.update(
                        {},{
                            $set: {
                                constat:"",
                                rapportExp:"",
                                facture:""
                            }
                        },
                        {multi:true}
                    );
                    Licences.update(
                        {},{
                            $set: {
                                licence:""
                            }
                        },
                        {multi:true}
                    );
                    return [{status:true,message:'Nuked : affceted empty documents to every : licences, entretiens, accidents and batiments'}];
                }catch(e){
                    throw e;
                    return [{status:false,message:e.message}];
                }
                
            }
            throw new Error('Unauthorized');
        }
    }
}