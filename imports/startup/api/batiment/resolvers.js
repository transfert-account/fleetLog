import Batiments from './batiments.js';
import Societes from '../societe/societes';
import { Mongo } from 'meteor/mongo';

const affectBatimentControls = batiment => {
    batiment.controls = Batiments.find({societe:batiment.societe._id._str}).fetch()
}

export default {
    Query : {
        batiment(obj, args, {user}){
            let societes = Societes.findOne({_id:user.settings.visibility}) || {};
            let batiments = societes.map(s=>{return{societe:s,controls:[]}});
            batiments.map(b=>affectBatimentControls(b))
            return batiments;
        },
        batiments(obj, args, {user}){
            let societes = Societes.find().fetch() || {};
            let batiments = societes.map(s=>{return{societe:s,controls:[]}});
            batiments.map(b=>affectBatimentControls(b))
            return batiments;
        }
    },
    Mutation:{
        addBatimentControl(obj, {societe,name,delay,lastExecution},{user}){
            if(user._id){
                Batiments.insert({
                    _id:new Mongo.ObjectID(),
                    societe:societe,
                    name:name,
                    delay:delay,
                    lastExecution:lastExecution
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editBatimentControl(obj, {_id,name,phone,mail,address},{user}){
            if(user._id){
                Batiments.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "name":name,
                            "phone":phone,
                            "mail":mail,
                            "address":address
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        updateBatimentControl(obj, {_id,name,phone,mail,address},{user}){
            if(user._id){
                Batiments.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "name":name,
                            "phone":phone,
                            "mail":mail,
                            "address":address
                        }
                    }
                );                
                return [{status:true,message:'Modifications sauvegardées'}];
            }
            throw new Error('Unauthorized');
        },
        deleteBatimentControl(obj, {_id},{user}){
            if(user._id){
                let nL = Locations.find({batiment:_id}).fetch().length
                if(nL > 0){
                    let qrm = [];
                    if(nL > 0){qrm.push({status:false,message:'Suppresion impossible, ' + nL + ' location(s) liée(s)'})}
                    return qrm;
                }else{
                    Batiments.remove({
                        _id:new Mongo.ObjectID(_id)
                    });
                    return [{status:true,message:'Suppression réussie'}];
                }
            }
            throw new Error('Unauthorized');
        },
    }
}