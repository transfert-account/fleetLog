import Vehicles from '../vehicle/vehicles';
import Licences from '../licence/licences';
import Locations from '../location/locations';
import Entretiens from '../licence/licences';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        testThis(obj, args,{user}){
            Licences.remove({})
            return "true";
        }
    }
}