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

let entretiensCreationFromControlAlertStep = {
    name: 'entretiensCreationFromControlAlertStep',
    schedule : parser => {
        return parser.recur().on(3).hour();
    },
    job : () => {
        let vehicles = Vehicles.find().fetch().map(v=>({_id:v._id,km:v.km,cs:v.controls}));
        vehicles.map(v=>{v.cs_merged.map(cs=>{
            cs.control = Controls.findOne({_id:new Mongo.ObjectID(cs._id)})
        })})
        vehicles.map(v=>{v.cs_merged.map(cs=>{
            cs.creationNeeded = false;
            if(cs.entretien == null || cs.entretien == ""){
                if(cs.lastOccurrence != "none" && cs.lastOccurrence != ""){
                    if(cs.control.unit == "km"){//DISTANCE
                        if(parseInt(v.km) > parseInt(cs.lastOccurrence) + parseInt(cs.control.frequency) - parseInt(cs.control.alert)){
                            cs.creationNeeded = true
                        }
                    }else{//TIME
                        if(cs.control.unit == "m"){cs.control.unit = "M"}
                        if(cs.control.alertUnit == "m"){cs.control.alertUnit = "M"}
                        if(moment().isAfter(moment(cs.lastOccurrence,"DD/MM/YYYY").add(cs.control.frequency,cs.control.unit).subtract(cs.control.alert,cs.control.alertUnit))){
                            cs.creationNeeded = true
                        }
                    }
                }
            }
        })})
        vehicles.map(v=>{v.cs_merged.filter(cs=>cs.creationNeeded).map(cs=>{
            let entretienId = new Mongo.ObjectID()
            let vehicle = Vehicles.findOne({_id:v._id})
            Entretiens.insert({
                _id:entretienId,
                societe:vehicle.societe,
                type:(cs.control.key[0]=="o" ? "obli" : "prev"),
                originNature:null,
                originControl:cs.control.key,
                occurenceDate:"",
                kmAtFinish:0,
                vehicle:vehicle._id._str,
                piecesQty:[],
                status:0,
                time:0,
                notes:[{
                    _id:new Mongo.ObjectID(),
                    text:"Entretien généré automatique par le contrôle " + cs.control.name + " lié au véhicule " + vehicle.registration + " (" + moment().format('DD/MM/YYYY HH:mm:ss') + ")" ,
                    date:moment().format('DD/MM/YYYY HH:mm:ss')
                }],
                archived:false,
                user:"",
            });
            Vehicles.update(
                {
                    _id: vehicle._id,
                    "controls._id": cs.control._id
                }, {
                    $set: {
                        "controls.$.entretien": entretienId._str
                    }
                }
            )
        })})
    }
}
SyncedCron.add(entretiensCreationFromControlAlertStep);

SyncedCron.config({logger:()=>{}});
SyncedCron.start();