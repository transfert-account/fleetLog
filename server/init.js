import '../imports/startup/server';
import { Accounts } from "meteor/accounts-base";
import { Meteor } from 'meteor/meteor';

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
    user.settings.visibility = "noidthisisgroupvisibility";

    // Returns the user object
    return user;
 });