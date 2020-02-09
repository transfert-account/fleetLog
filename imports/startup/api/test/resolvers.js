import Vehicles from '../vehicle/vehicles';
import Entretiens from '../entretien/entretiens';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        testThis(obj, args,{user}){
            console.log(Entretiens.find({}).fetch())
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