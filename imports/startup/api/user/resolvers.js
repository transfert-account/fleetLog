import Societes from '../societe/societes.js';
import Entretiens from '../entretien/entretiens';

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
        allUsers(obj, args){
            let users = Meteor.users.find({}).fetch() || {};
            users.map(u=>{
                if(u.visibility != null && u.visibility.length > 0){
                    u.societe = Societes.findOne({_id:new Mongo.ObjectID(u.visibility)});
                }else{
                    u.societe = {_id:""};
                }
            })
            return users
        },
        users(obj, args, {user}){
            let users = [];
            if(new RegExp("^[0-9a-fA-F]{24}$").test(user.settings.visibility)){
                let societe = Societes.findOne({_id:new Mongo.ObjectID(user.settings.visibility)})._id._str;
                users = Meteor.users.find({societe:societe}).fetch() || [];
            }else{
                users = Meteor.users.find({}).fetch() || {};
            }
            users = Meteor.users.find({}).fetch() || {};
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
                return [{status:true,message:'Modification sauvegardée'}];
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
                return [{status:true,message:'Modification réussie'}];
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
                return [{status:true,message:'Mise à niveau du compte réussie'}];
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
                return [{status:true,message:'Retrait de droits réussi'}];
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
                    /*Meteor.users.update({
                        _id: ownerUser._id
                    }, {
                        $set: {
                            "settings.isOwner": false,
                        }
                    });*/
                }
                return [{status:true,message:'Transfert de propriété réussie'}];
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
                return [{status:true,message:'Modification réussie'}];
            }
            throw new Error('Unauthorized')
        },
        deleteAccount(obj, {admin,_id},{user}){
            if(user._id){
                const adminUser = Meteor.users.findOne({_id:admin});
                if(adminUser.settings.isAdmin){
                    const res =  Meteor.users.remove(_id);
                    Entretiens.update(
                        {
                            user:_id
                        },
                        {
                            $set: {
                                user:"",
                                occurenceDate:""
                            }
                        },
                        {multi:true}
                    );
                    return [{status:true,message:'Compte supprimé, entretiens libérés'}];
                }
                return [{status:false,message:'Erreur durant la suppression'}];
            }
            throw new Error('Unauthorized')
        }
    }
}