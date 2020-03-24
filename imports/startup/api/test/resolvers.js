import Entretiens from '../entretien/entretiens';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        testThis(obj, args,{user}){
            if(user._id){
                try{
                    Entretiens.update(
                        {},
                        {
                            $set: {
                                user:"",
                                occurenceDate:""
                            }
                        },
                        {multi:true}
                    ); 
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