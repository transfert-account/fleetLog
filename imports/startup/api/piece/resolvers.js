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
        addPiece(obj, {name,type},{user}){
            if(user._id){
                Pieces.insert({
                    _id:new Mongo.ObjectID(),
                    type:type,
                    name:name
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        deletePiece(obj, {_id},{user}){
            if(user._id){
                Pieces.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        editPiece(obj, {_id,name},{user}){
            if(user._id){
                Pieces.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "name":name
                        }
                    }
                ); 
                return true;
            }
            throw new Error('Unauthorized');
        },
    }
}