import ExportTemplates from './ExportTemplates.js';
import { Mongo } from 'meteor/mongo';
export default {
    Query : {
        exportTemplates(obj, {type}, {user}){
            return ExportTemplates.find({type:type}).fetch() || {};
        }
    },
    Mutation:{
        addExportTemplate(obj, {name,type,scope,columns},{user}){
            if(user._id){
                ExportTemplates.insert({
                    _id:new Mongo.ObjectID(),
                    name:name,
                    type:type,
                    scope:scope,
                    columns:JSON.parse(columns)
                });
                return [{status:true,message:'Création réussie'}];
            }
            throw new Error('Unauthorized');
        },
        deleteExportTemplate(obj, {_id},{user}){
            if(user._id){
                ExportTemplates.remove({
                    _id:new Mongo.ObjectID(_id)
                });
                return [{status:true,message:'Suppression réussie'}];
            }
            throw new Error('Unauthorized');
        },
    }
}