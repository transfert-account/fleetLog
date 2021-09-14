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
    },
    {
        key:"check_km",
        name:"Vérification cohérence km_value / km last report",
        function : "check_km_value_km_report",
        lastExecuted:"dd/mm/yyyy"
    },
    {
        key:"check_vehicles_infos",
        name:"Vérification de l'intégrité des données véhicules",
        function : "check_vehicles_infos_integrity",
        lastExecuted:"dd/mm/yyyy"
    }
]

export default {
    Query : {
        jobs(obj,arg,{user}){
            return jobs.map(j=>{
                let lastExe = JobLogs.findOne({job:j.key},{sort:{_id:-1}})
                j.lastExecuted = (lastExe ? lastExe.timeStart : "")
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
                if(key == "check_km"){
                    Functions.check_km_value_km_report("check_km",_id,timeStart);
                }
                if(key == "check_vehicles_infos"){
                    Functions.check_vehicles_infos_integrity("check_vehicles_infos",_id,timeStart);
                }
                return [{status:true,message:key + " running",obj:_id}];
            }
            throw new Error('Unauthorized');
        }
    }
}