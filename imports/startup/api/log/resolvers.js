import moment from 'moment';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        log(obj, {_id}, { user }){
            return Licences.find({_id:_id}).fetch() || {};
        },
        logs(obj, args){
            return Licences.find({_id:_id}).fetch() || {};
            return licences;
        }
    }
}