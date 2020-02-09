import Vehicles from '../vehicle/vehicles'
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        testThis(obj, args,{user}){
            /*Vehicles.update(
                {}, {
                    $set: {
                        "archived":false,
                        "archiveReason":"",
                        "archiveDate":""
                    }
                },{multi:true}
            );*/
            return "true";
        }
    }
}