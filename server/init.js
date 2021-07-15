import '../imports/startup/server';
import { Accounts } from "meteor/accounts-base";
import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import Entretiens from '../imports/startup/api/entretien/entretiens';
import Vehicles from '../imports/startup/api/vehicle/vehicles';
import Functions from '../imports/startup/api/common/functions';
import Controls from '../imports/startup/api/control/controls';


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

//CRON JOBS
const entretiensCreationFromControlAlertStep = {
    name: 'entretiensCreationFromControlAlertStep',
    schedule : parser => {
        return parser.recur().on(3).hour();
    },
    job : Functions.entretiensCreationFromControlAlertStep
}

SyncedCron.add(entretiensCreationFromControlAlertStep);

SyncedCron.config({logger:()=>{}});
SyncedCron.start();