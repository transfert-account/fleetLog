import Pieces from './pieces'
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        allPieces(obj, args){
            return Pieces.find().fetch() || {};
        },
        pieces(obj, args){
            return Pieces.find({type:"pie"}).fetch() || {};
        },
        pneus(obj, args){
            return Pieces.find({type:"pne"}).fetch() || {};
        },
        agents(obj, args){
            return Pieces.find({type:"age"}).fetch() || {};
        },
        outils(obj, args){
            return Pieces.find({type:"out"}).fetch() || {};
        }
    },
    Mutation:{
        addPiece(obj, {name,brand,reference,prixHT,type},{user}){
            if(user._id){
                Pieces.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    brand:brand,
                    reference:reference,
                    prixHT:prixHT,
                    type:type
                });
                return [{status:true,message:'Création de la pièce réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deletePiece(obj, {_id},{user}){
            if(user._id){
                Pieces.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression de la pièce réussie'}];
            }
            throw new Error('Unauthorized');
        },
        editPiece(obj, {_id,name,brand,reference,prixHT},{user}){
            if(user._id){
                Pieces.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "name":name,
                            "brand":brand,
                            "reference":reference,
                            "prixHT":prixHT
                        }
                    }
                ); 
                return [{status:true,message:'Modification de la pièce réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}