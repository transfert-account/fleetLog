import Commandes from './commandes';
import Pieces from '../piece/pieces';
import { Mongo } from 'meteor/mongo';

export default {
    Query : {
        commandesByEntretien(obj, {entretien},{user}){
            let commandes = Commandes.find({entretien:entretien}).fetch() || {};
            commandes.forEach(c => {
                c.piece = Pieces.findOne({_id:new Mongo.ObjectID(c.piece)});
            });
            return commandes;
        },
    },
    Mutation:{
        addCommande(obj, {entretien,piece},{user}){
            if(user._id){
                Commandes.insert({
                    _id:new Mongo.ObjectID(),
                    entretien:entretien,
                    piece:piece,
                    status:1
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        deleteCommande(obj, {_id},{user}){
            if(user._id){
                Commandes.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return true;
            }
            throw new Error('Unauthorized');
        },
        editCommandeStatus(obj, {_id,status},{user}){
            if(user._id){
                Commandes.update(
                    {
                        _id: new Mongo.ObjectID(_id)
                    }, {
                        $set: {
                            "status":status
                        }
                    }
                ); 
                return true;
            }
            throw new Error('Unauthorized');
        }
    }
}