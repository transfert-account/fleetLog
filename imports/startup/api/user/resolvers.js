import Societes from '../societe/societes.js';

export default {
    Query : {
        user(obj, args, { user }){
            let userFull = {};
            if(user != undefined){
                userFull = Meteor.users.findOne({_id:user._id})
                if(userFull.settings.visibility != "noidthisisgroupvisibility"){

                    if(userFull.settings.visibility != null && userFull.settings.visibility.length > 0){
                        userFull.societe = Societes.findOne({_id:new Mongo.ObjectID(userFull.settings.visibility)});
                    }else{
                        userFull.societe = {_id:""};
                    }
                }else{
                    userFull.societe = {_id:"noidthisisgroupvisibility",triKey:'GRP',name:"Groupe"};
                }
            }
            return userFull || {}
        },
        users(obj, args){
            let users = Meteor.users.find({}).fetch() || {};
            users.map(u=>{
                if(u.visibility != null && u.visibility.length > 0){
                    u.societe = Societes.findOne({_id:new Mongo.ObjectID(u.visibility)});
                }else{
                    u.societe = {_id:""};
                }
            })
            return users
        }
    },
    User:{
        email:user => (user._id != null ? user.emails[0].address : null),
        isAdmin:user=> (user._id != null ? user.settings.isAdmin : null),
        isOwner:user=> (user._id != null ? user.settings.isOwner : null),
        activated:user=> (user._id != null ? user.settings.activated : null),
        visibility:user=> (user._id != null ? user.settings.visibility : null),
        verified:user=> (user._id != null ? user.emails[0].verified : null),
        firstname:user=> (user._id != null ? user.profile.firstname : null),
        lastname:user=> (user._id != null ? user.profile.lastname : null),
        avatar:user=> (user._id != null ? user.profile.avatar : "000.png"),
        createdAt:user=> (user._id != null ? user.createdAt : null),
        lastLogin:user=> (user._id != null && user.services.resume.loginTokens.length > 0 ? user.services.resume.loginTokens.slice(-1)[0].when : null),
    },
    Mutation:{
        editUserProfile(obj, {_id,email,firstname,lastname,age},{user}){
            if(user._id){
                const res = Meteor.users.update(
                    {
                        _id: _id
                    }, {
                        $set: {
                            "emails[0].address": email,
                            "profile.firstname": firstname,
                            "profile.lastname": lastname,
                            "profile.age": age
                        }
                    }
                );
                return res;
            }
            throw new Error('Unauthorized')
        },
        setVisibility(obj, {_id,visibility},{user}){
            if(user._id){
                const res = Meteor.users.update(
                    {
                        _id: _id
                    }, {
                        $set: {
                            "settings.visibility": visibility
                        }
                    }
                );
                return Meteor.users.findOne({_id:_id});
            }
            throw new Error('Unauthorized')
        },
        setUserAvatar(obj, {_id,avatar},{user}){
            if(user._id){
                const res = Meteor.users.update(
                    {
                        _id: _id
                    }, {
                        $set: {
                            "profile.avatar": avatar
                        }
                    }
                );
                return Meteor.users.findOne({_id:_id});
            }
            throw new Error('Unauthorized')
        },
        setAdmin(obj, {admin,_id},{user}){
            if(user._id){
                const adminUser = Meteor.users.findOne({_id:admin});
                if(adminUser.settings.isAdmin){
                    const user = Meteor.users.findOne({_id:_id});
                    Meteor.users.update({
                        _id: _id
                    }, {
                        $set: {
                            "settings.isAdmin": true,
                        }
                    });
                }
                const res = Meteor.users.findOne({_id:_id});
                return res;
            }
            throw new Error('Unauthorized')
        },
        unsetAdmin(obj, {admin,_id,societe},{user}){
            if(user._id){
                const adminUser = Meteor.users.findOne({_id:admin});
                if(adminUser.settings.isAdmin){
                    const user = Meteor.users.findOne({_id:_id});
                    Meteor.users.update({
                        _id: _id
                    }, {
                        $set: {
                            "settings.isAdmin": false,
                            "settings.visibility": societe,
                        }
                    });
                }
                const res = Meteor.users.findOne({_id:_id});
                return res;
            }
            throw new Error('Unauthorized')
        },
        setOwner(obj, {owner,_id},{user}){
            if(user._id){
                const ownerUser = Meteor.users.findOne({_id:owner});
                const adminUser = Meteor.users.findOne({_id:_id});
                if(ownerUser.settings.isOwner){
                    Meteor.users.update({
                        _id: adminUser._id
                    }, {
                        $set: {
                            "settings.isOwner": true,
                        }
                    });
                    Meteor.users.update({
                        _id: ownerUser._id
                    }, {
                        $set: {
                            "settings.isOwner": false,
                        }
                    });
                }
                return Meteor.users.find({}).fetch() || {};
            }
            throw new Error('Unauthorized')
        },
        toggleActive(obj, {admin,_id},{user}){
            if(user._id){
                const adminUser = Meteor.users.findOne({_id:admin});
                if(adminUser.settings.isAdmin){
                    const user = Meteor.users.findOne({_id:_id});
                    Meteor.users.update({
                        _id: _id
                    }, {
                        $set: {
                            "settings.activated": !user.settings.activated,
                        }
                    });
                }
                const res = Meteor.users.findOne({_id:_id});
                return res;
            }
            throw new Error('Unauthorized')
        },
        deleteAccount(obj, {admin,_id},{user}){
            if(user._id){
                const adminUser = Meteor.users.findOne({_id:admin});
                if(adminUser.settings.isAdmin){
                    const res =  Meteor.users.remove(_id);
                    return Meteor.users.find({}).fetch() || {};
                }
            }
            throw new Error('Unauthorized')
        }
    }
}