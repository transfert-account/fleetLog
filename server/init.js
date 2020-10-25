import '../imports/startup/server';
import { Accounts } from "meteor/accounts-base";
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import Entretiens from '../imports/startup/api/entretien/entretiens';
import Equipements from '../imports/startup/api/equipement/equipements';
import EquipementDescriptions from '../imports/startup/api/equipementDescription/equipementDescriptions';
import Vehicles from '../imports/startup/api/vehicle/vehicles';


Accounts.onCreateUser(function(options, user) {    
    // Use provided profile in options, or create an empty object
    user.profile = options.profile || {};
    user.profile.firstname = options.profile.firstname;
    user.profile.lastname = options.profile.lastname;
    user.profile.avatar = (Math.floor(Math.random()*260)+1).toString().padStart(3,"0")+".png"
    user.settings = options.settings || {};
    if(Meteor.users.find().count() == 0){
        user.settings.isOwner = true;
        user.settings.isAdmin = true;
        user.settings.activated = true;
    }else{
        user.settings.isOwner = options.settings.isAdmin;
        user.settings.isAdmin = options.settings.isOwner;
        user.settings.activated = false;
    }
    user.settings.visibility = options.settings.visibility;
    // Returns the user object
    return user;
});

let entretiensCreationFromControlAlertStep = {
    name: 'entretiensCreationFromControlAlertStep',
    schedule : parser => {
        return parser.recur().on(3).hour();
    },
    job : () => {
        let controls = Equipements.find().fetch()
        controls.forEach(c=>{
            c.equipementDescription = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(c.equipementDescription)})
            c.vehicle = Vehicles.findOne({_id:new Mongo.ObjectID(c.vehicle)})
        })
        controls.map(c=>{
            let nextControl = 0;
            let alertStep = 0;
            let creationNeeded = false;
            if(c.equipementDescription.unitType == "t"){
                if(c.equipementDescription.controlPeriodUnit == "y"){
                    nextControl = moment(c.lastControl,"DD/MM/YYYY").add(c.equipementDescription.controlPeriodValue,"Y");
                }
                if(c.equipementDescription.controlPeriodUnit == "m"){
                    nextControl = moment(c.lastControl,"DD/MM/YYYY").add(c.equipementDescription.controlPeriodValue,'M');
                }
                if(c.equipementDescription.alertStepUnit == "y"){
                    alertStep = moment(c.lastControl,"DD/MM/YYYY").add(c.equipementDescription.alertStepValue,"Y");
                }
                if(c.equipementDescription.alertStepUnit == "m"){
                    alertStep = moment(c.lastControl,"DD/MM/YYYY").add(c.equipementDescription.alertStepValue,'M');
                }
                if(moment(alertStep, "DD/MM/YYYY").diff(moment())<0 || moment(nextControl, "DD/MM/YYYY").diff(moment())<0){
                    creationNeeded = true
                }
            }
            if(c.equipementDescription.unitType == "d"){
                nextControl = (parseInt(c.lastControl) + parseInt(c.equipementDescription.controlPeriodValue)) - parseInt(c.vehicle.km)
                if(nextControl<c.equipementDescription.alertStepValue || nextControl<0){
                    creationNeeded = true
                }
            }
            if(creationNeeded){
                if(c.entretienCreated == false){
                    let e = Equipements.findOne({_id:c._id})
                    let ed = EquipementDescriptions.findOne({_id:new Mongo.ObjectID(e.equipementDescription)})
                    let v = Vehicles.findOne({_id:new Mongo.ObjectID(e.vehicle)});
                    let entretienId = new Mongo.ObjectID();
                    try {
                        Entretiens.insert({
                            _id:entretienId,
                            piece:"",
                            title:"Contrôle : " + ed.name + " sur " + v.registration,
                            description:"Entretien généré automatiquement par le contrôle lié au véhicule " + v.registration,
                            vehicle:e.vehicle,
                            ficheInter:"",
                            archived:false,
                            occurenceDate:"",
                            user:"",
                            time:0,
                            status:1,
                            societe:v.societe,
                            fromControl:true,
                            control:c._id._str
                        });
                        Equipements.update(
                            {
                                _id:c._id
                            },{
                                $set: {
                                    entretien:entretienId._str,
                                    entretienCreated:true
                                }
                            }
                        );
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
        })
    }
}
SyncedCron.add(entretiensCreationFromControlAlertStep);

SyncedCron.config({logger:()=>{}});
SyncedCron.start();