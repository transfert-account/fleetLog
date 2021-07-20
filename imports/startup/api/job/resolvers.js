import Functions from '../common/functions';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import JobLogs from './jobLogs';

const jobs = [
    {
        key:"entcont",
        name:"Création des entretiens depuis les contrôles",
        function : "entretiensCreationFromControlAlertStep",
        lastExecuted:"dd/mm/yyyy"
    }
]

export default {
    Query : {
        jobs(obj,arg,{user}){
            return jobs.map(j=>{
                j.lastExecuted = JobLogs.findOne({job:j.key},{sort:{_id:-1}}).timeStart
                return j
            });
        },
        jobExecutions(obj,{key},{user}){
            return JobLogs.find({job:key}).fetch();
        },
        jobLogs(obj,{_id},{user}){
            return JobLogs.findOne({_id:new Mongo.ObjectID(_id)}).logs;
        },
    },
    Mutation : {
        playJob(obj,{key},{user}){
            if(user._id){
                let _id = new Mongo.ObjectID();
                let timeStart = moment();
                Functions.createLogBook(_id,key,timeStart);

                if(key == "entcont"){
                    Functions.entretiensCreationFromControlAlertStep("entcont",_id,timeStart);
                }
                return [{status:true,message:key + " running",obj:_id}];
            }
            throw new Error('Unauthorized');
        }
    }
}