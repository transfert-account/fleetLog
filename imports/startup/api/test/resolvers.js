import Vehicles from '../vehicle/vehicles';
import Licences from '../licence/licences';
import Locations from '../location/locations';
import Entretiens from '../licence/licences';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        testThis(obj, args,{user}){
            if(user._id){
                Entretiens.update(
                    {}, {
                        $set: {
                            "user":"",
                            "occurenceDate":""
                        }
                    }
                ); 
                return [{status:true,message:'Entretien affecté'}];
            }
            throw new Error('Unauthorized');
            return "true";
        }
    }
}