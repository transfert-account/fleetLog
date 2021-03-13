import Functions from '../common/functions';
import Documents from '../document/documents';
import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations'
import Accidents from '../accident/accidents'
import Batiments from '../batiment/batiments'
import Entretiens from '../entretien/entretiens'
import Equipements from '../equipement/equipements'
import Licences from '../licence/licences'

const COLS = [{col:Vehicles,obj:"Vehicles"},{col:Locations,obj:"Locations"},{col:Accidents,obj:"Accidents"},{col:Batiments,obj:"Batiments"},{col:Entretiens,obj:"Entretiens"},{col:Equipements,obj:"Equipements"},{col:Licences,obj:"Licences"}]
const TYPES = [
    {
      obj:"vehicles",name:"Vehicles",types:[
        {type:"cg",name:"Carte grise"},
        {type:"cv",name:"Carte verte"},
        {type:"crf",name:"Cerfa de vente"},
        {type:"ida",name:"Piece d'ID acheteur"},
        {type:"scg",name:"Carte grise barrée"}
      ]
    },{
      obj:"locations",name:"Locations",types:[
        {type:"cg",name:"Carte grise"},
        {type:"cv",name:"Carte verte"},
        {type:"contrat",name:"Contrat de location"},
        {type:"restitution",name:"Justificatif de restitution"}
      ]
    },{
      obj:"accidents",name:"Accidents",types:[
        {type:"constat",name:"Constat"},
        {type:"rapportExp",name:"Rapport de l'expert"},
        {type:"facture",name:"Facture"},
        {type:"questionary",name:"Questionnaire"}
      ]
    },{
      obj:"batiments",name:"Batiments",types:[
        {type:"ficheInter",name:"Fiche d'intervention"}
      ]
    },{
      obj:"entretiens",name:"Entretiens",types:[
        {type:"ficheInter",name:"Fiche d'intervention"}
      ]
    },{
      obj:"equipements",name:"Equipements",types:[
        {type:"controlTech",name:"Contrôle technique"}
      ]
    },{
      obj:"licences",name:"Licences",types:[
        {type:"licence",name:"Licence"}
      ]
    }
  ]

export default {
    Query : {
        storedObject(obj, { name }, { user }){
            return {};
        },
        async storedObjects(obj, args, { user }){
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                    let data = await Functions.getStoredObjectsList()
                    if(data.readSucces){
                        resolve(data.list)
                    }else{
                        reject(["fail"])
                    }
                }).then(list=>{
                    storedObjects = list.map(x=>{return{name:x.Key}})
                    storedObjects.map((so,i)=>{
                        so.doc = Documents.find({_id:new Mongo.ObjectID(so.name.split(".")[0].split("_")[9])}).fetch()[0]
                        if(so.doc == null || so.doc == undefined){
                            so.doc = {_id:""};
                            so.debug = JSON.stringify({msg:"NO DOC RELATED IN DB"})
                        }else{
                            so.subtype = so.name.split("_")[1]
                            let possible = [];
                            TYPES.forEach(T=>{
                                T.types.forEach(t=>{
                                    if(so.subtype == t.type){
                                        possible.push({obj:T.obj,subtype:t.type})
                                    }
                                })
                            })
                            so.res = []
                            so.debug = JSON.stringify({msg:"INITIATED"})
                            possible.forEach(p=>{
                              COLS.forEach(c=>{
                                let res = c.col.findOne({[p.subtype]:so.doc._id._str})
                                if(res != null){
                                  so.res.push({obj:c.obj,objValue:res})
                                }
                              })
                            })
                            so.debug = JSON.stringify(so.res)
                        }
                    })
                    return storedObjects;
                }).catch(e=>{
                    return [{e}];
                });
            }
        },
        async getSignedStoredObjectDownloadLink(obj, {name},{user}){
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                    let linkGenerationInfo = await Functions.getSignedStoredObjectDownloadLink(name)
                    resolve(linkGenerationInfo)
                }).then((linkGenerationInfo)=>{
                    return linkGenerationInfo.link;
                }).catch(e=>{
                    return e;
                });
            }
        }
    }
}