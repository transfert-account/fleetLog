import Vehicles from '../vehicle/vehicles';
import Licences from '../licence/licences';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        testThis(obj, args,{user}){
            if(user._id){
                /*Vehicles.remove({energy:""});
                Vehicles.remove({societe:""});
                Vehicles.remove({brand:""});
                Vehicles.remove({model:""});
                Vehicles.remove({color:""});
                Vehicles.remove({payementOrg:""});*/
                try{
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
                    return [{status:true,message:'Nuked : ' + nuked}];    
                }catch(e){
                    throw e;
                    return [{status:false,message:e.message}];
                }
                
            }
            throw new Error('Unauthorized');
        }
    }
}