import Functions from '../common/functions';
import Documents from '../document/documents';
import Vehicles from '../vehicle/vehicles';
import Locations from '../location/locations'
import Accidents from '../accident/accidents'
import Batiments from '../batiment/batiments'
import Entretiens from '../entretien/entretiens'
import Equipements from '../equipement/equipements'
import Licences from '../licence/licences'

const TYPES = [
    {
      getLinkedObjInfos:(v)=>v.registration,
      obj:"vehicles",name:"Vehicles",col:Vehicles,types:[
        {type:"cg",name:"Carte grise"},
        {type:"cv",name:"Carte verte"},
        {type:"crf",name:"Cerfa de vente"},
        {type:"ida",name:"Piece d'ID acheteur"},
        {type:"scg",name:"Carte grise barrée"}
      ]
    },{
      getLinkedObjInfos:(l)=>l.registration,
      obj:"locations",name:"Locations",col:Locations,types:[
        {type:"cg",name:"Carte grise"},
        {type:"cv",name:"Carte verte"},
        {type:"contrat",name:"Contrat de location"},
        {type:"restitution",name:"Justificatif de restitution"}
      ]
    },{
      getLinkedObjInfos:(a)=>{
        let v = {};
        v = Vehicles.findOne({_id:a._id})
        if(!v){
          v = Locations.findOne({_id:a._id})
        }
        return (v.registration + " (" + a.occurenceDate + ")")
      },
      obj:"accidents",name:"Accidents",col:Accidents,types:[
        {type:"constat",name:"Constat"},
        {type:"rapportExp",name:"Rapport de l'expert"},
        {type:"facture",name:"Facture"},
        {type:"questionary",name:"Questionnaire"}
      ]
    },{
      getLinkedObjInfos:(b)=>"Not supported yet",
      obj:"batiments",name:"Batiments",col:Batiments,types:[
        {type:"ficheInter",name:"Fiche d'intervention"}
      ]
    },{
      getLinkedObjInfos:(e)=>"Not supported yet",
      obj:"entretiens",name:"Entretiens",col:Entretiens,types:[
        {type:"ficheInter",name:"Fiche d'intervention"}
      ]
    },{
      getLinkedObjInfos:(e)=>"Not supported yet",
      obj:"equipements",name:"Equipements",col:Equipements,types:[
        {type:"controlTech",name:"Contrôle technique"}
      ]
    },{
      getLinkedObjInfos:(l)=>l.number,
      obj:"licences",name:"Licences",col:Licences,types:[
        {type:"licence",name:"Licence"}
      ]
    }
  ]

export default {
    Query : {
        storedObject(obj, { name }, { user }){
            return {};
        },
        async getS3BucketCapacity(obj, args, { user }){
          try{
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                  let data = await Functions.getStoredObjectsList()
                  if(data.readSucces){
                    resolve(data.list)
                  }else{
                    reject(["fail"])
                  }
              }).then(list=>{
                return parseInt(parseFloat((list.reduce((a,b)=>a + b.Size,0)/1048576))/5120*100)
              }).catch(e=>{
                return [{e}];
              });
            }
          }catch(e){
            console.error(e)
          }
        },
        async storedObjects(obj, args, { user }){
          try{
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                  let data = await Functions.getStoredObjectsList()
                  if(data.readSucces){
                    resolve(data.list)
                  }else{
                    reject(["fail"])
                  }
              }).then(list=>{
                storedObjects = list.map(x=>{return{name:x.Key,size:x.Size}})
                storedObjects.map((so,i)=>{
                  so.doc = Documents.find({_id:new Mongo.ObjectID(so.name.split(".")[0].split("_")[9])}).fetch()[0]
                  if(so.doc == null || so.doc == undefined){
                    so.doc = {_id:""};
                    so.debug = JSON.stringify([{obj:"noref",type:"noref",objValue:null}])
                    so.linkedObjInfos = "noref";
                    so.type = "noref";
                  }else{
                    let type = so.name.split("_")[1]
                    let possible = [];
                    TYPES.forEach(T=>{T.types.forEach(t=>{if(type == t.type){possible.push({getLinkedObjInfos:T.getLinkedObjInfos,col:T.col,obj:T.obj,subtype:t.type})}})})
                    so.res = []
                    so.linkedObjInfos = "";
                    possible.forEach(p=>{
                      let res = p.col.findOne({[p.subtype]:so.doc._id._str})
                      if(res != null){
                        so.res.push({obj:p.obj,type:p.subtype,objValue:res})
                        so.linkedObjInfos = p.getLinkedObjInfos(res);
                        so.type = type
                      }
                    })
                    if(possible.length == 0){
                      so.res.push({obj:"unknown type",type:"unknown type",objValue:null})
                      so.linkedObjInfos = "unknown type";
                      so.type = "unknown type";
                    }
                    if(so.res.length == 0){
                      so.res.push({obj:"unlinked",type:"unlinked",objValue:null})
                      so.linkedObjInfos = "unlinked";
                      so.type = "unlinked";
                    }
                    so.debug = JSON.stringify(so.res)
                  }
                })
                console.log(storedObjects.length)
                return storedObjects;
              }).catch(e=>{
                return [{e}];
              });
            }
          }catch(e){
            console.error(e)
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
        },
        async deleteObjectAndDoc (obj, {name,docId},{user}) {
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                  let deleteInfos = await Functions.deleteObjectAndDoc(name,docId)                  
                  if(deleteInfos.deleteSucces){
                    resolve(deleteInfos)
                  }else{
                    reject(deleteInfos)
                  }
                }).then((deleteInfos)=>{
                    return [{status:true,message:'Suppression réussie'}];
                }).catch(e=>{
                  return [{status:false,message:e}];
                });
            }
        },
        async deleteObject(obj, {name},{user}) {
            if(user._id){
                return await new Promise(async (resolve,reject)=>{
                  let deleteInfos = await Functions.deleteObject(name)
                  if(deleteInfos.deleteSucces){
                    resolve(deleteInfos)
                  }else{
                    reject(deleteInfos)
                  }
                }).then((deleteInfos)=>{
                    return [{status:true,message:'Suppression réussie'}];
                }).catch(e=>{
                  return [{status:false,message:e}];
                });
            }
        },
    }
}