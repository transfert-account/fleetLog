import Vehicles from '../vehicle/vehicles';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        testThis(obj, args,{user}){
            if(user._id){
                Vehicles.remove({energy:""});
                Vehicles.remove({societe:""});
                Vehicles.remove({brand:""});
                Vehicles.remove({model:""});
                Vehicles.remove({color:""});
                Vehicles.remove({payementOrg:""});
                try{
                    /*Entretiens.update(
                        {},
                        {
                            $set: {
                                user:"",
                                occurenceDate:""
                            }
                        },
                        {multi:true}
                    );*/ 
                    return [{status:true,message:'Nuked'}];    
                }catch(e){
                    throw e;
                    return [{status:false,message:e.message}];
                }
                
            }
            throw new Error('Unauthorized');
        }
    }
}