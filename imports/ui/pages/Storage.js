import React, { Component } from 'react';
import { Input, Table, Button, Icon, Label, Progress } from 'semantic-ui-react';
import AdministrationMenu from '../molecules/AdministrationMenu';
import StoredObjectRow from '../molecules/StoredObjectRow';
import MultiDropdown from '../atoms/MultiDropdown';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-server-express';
import moment from 'moment';
import 'moment/locale/fr';

export class Storage extends Component {

  state = {
    storedObjectsFilter:"",
    storedObjectsQuery:gql`
      query storedObjects{
        storedObjects{
          name
          size
          type
          debug
          linkedObjInfos
          doc{
            _id
            name
            size
            path
            originalFilename
            ext
            type
            mimetype
            storageDate
          }
        }
      },
    `,
    types:[
      {
        obj:"noref",name:"Non référencés",color:"red",types:[
          {type:"noref",name:"Non référencés",color:"red"},
        ]
      },{
        obj:"unlinked",name:"Orphelins",color:"orange",types:[
          {type:"unlinked",name:"Orphelins",color:"orange"},
        ]
      },
      {
        obj:"vehicles",name:"Vehicles",color:"blue",types:[
          {type:"cg",name:"Carte grise",color:"blue"},
          {type:"cv",name:"Carte verte",color:"blue"},
          {type:"crf",name:"Cerfa de vente",color:"blue"},
          {type:"ida",name:"Piece d'ID acheteur",color:"blue"},
          {type:"scg",name:"Carte grise barrée",color:"blue"}
        ]
      },{
        obj:"locations",name:"Locations",color:"blue",types:[
          {type:"cg",name:"Carte grise",color:"blue"},
          {type:"cv",name:"Carte verte",color:"blue"},
          {type:"contrat",name:"Contrat de location",color:"blue"},
          {type:"restitution",name:"Justificatif de restitution",color:"blue"}
        ]
      },{
        obj:"accidents",name:"Accidents",color:"blue",types:[
          {type:"constat",name:"Constat",color:"blue"},
          {type:"rapportExp",name:"Rapport de l'expert",color:"blue"},
          {type:"facture",name:"Facture",color:"blue"},
          {type:"questionary",name:"Questionnaire",color:"blue"}
        ]
      },{
        obj:"batiments",name:"Batiments",color:"blue",types:[
          {type:"ficheInter",name:"Fiche d'intervention",color:"blue"}
        ]
      },{
        obj:"entretiens",name:"Entretiens",color:"blue",types:[
          {type:"ficheInter",name:"Fiche d'intervention",color:"blue"}
        ]
      },{
        obj:"equipements",name:"Equipements",color:"blue",types:[
          {type:"controlTech",name:"Contrôle technique",color:"blue"}
        ]
      },{
        obj:"licences",name:"Licences",color:"blue",types:[
          {type:"licence",name:"Licence",color:"blue"}
        ]
      }
    ],
    selectedType : "",
    selectedSubtype : "",
    storedObjectsRaw:[],
    storedObjects : () => {
      let displayed = Array.from(this.state.storedObjectsRaw);
      displayed = displayed.filter(d=>d.name.toLowerCase().includes(this.state.storedObjectsFilter.toLowerCase()));
      if(this.state.selectedSubtype != ""){
        if(this.state.selectedSubtype == "noref" || this.state.selectedSubtype == "unlinked"){
          displayed = displayed.filter(d=>{return d.type == this.state.selectedSubtype;})
        }else{
          displayed = displayed.filter(d=>{return d.name.split("_")[1] == this.state.selectedSubtype})
        }
      }
      return displayed.map(so=>(<StoredObjectRow loadStoredObjects={this.loadStoredObjects} key={so.name} so={so}/>))
    }
  }

  handleFilter = e => {
    this.setState({
      storedObjectsFilter : e.target.value
    })
  }

  componentDidMount = () => {
    moment.locale('fr');
    this.loadStoredObjects();
  }

  loadStoredObjects = () => {
    this.props.client.query({
      query: this.state.storedObjectsQuery,
      fetchPolicy:"network-only"
    }).then(({data}) => {
      this.setState({
        storedObjectsRaw:data.storedObjects
      })
    })
  }

  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr"}}>
        <div style={{display:"grid",marginBottom:"0",gridTemplateColumns:"auto 1fr", gridGap:"32px"}}>
          <AdministrationMenu active="storage"/>
          <Input name="storageFilter" onChange={this.handleFilter} size='massive' icon='search' placeholder='Rechercher un objet ...' />
        </div>
        <div style={{display:"grid",gridTemplateColumns:"auto auto auto 1fr auto auto"}}>
          <MultiDropdown onChange={(value)=>this.setState({selectedType:value})} options={this.state.types.map(x=>{return({key:x.obj,text:x.name,value:x.obj,label:{color:x.color,empty:true,circular:true}})})}/>
          <MultiDropdown onChange={(value)=>this.setState({selectedSubtype:value})} options={(this.state.types.filter(x=>x.obj == this.state.selectedType)[0] ? this.state.types.filter(x=>x.obj == this.state.selectedType)[0].types.map(x=>{return({key:x.type,text:x.name,value:x.type,label:{color:x.color,empty:true,circular:true}})}) : [])}/>
          <Button color="red" onClick={()=>this.setState({selectedSubtype:""})}><Icon style={{margin:"0"}} name="cancel"/></Button>
          <Progress color="green" progress="percent" style={{margin:"auto 32px"}} value={parseInt(parseFloat(((this.state.storedObjectsRaw.reduce((a,b)=>a + b.size,0)/1048576)))/5120*100).toFixed(1)} total={100} />
          <Label size="large" style={{gridColumnStart:"5",placeSelf:"center",margin:"0 4px"}}>{parseFloat(this.state.storedObjectsRaw.reduce((a,b)=>a + b.size,0)/1048576).toFixed(2)} Mo utilisés</Label>
          <Label size="large" style={{gridColumnStart:"6",placeSelf:"center",margin:"0 4px"}}>{this.state.storedObjectsRaw.length} objets stockés</Label>
        </div>
        <div style={{display:"block",overflowY:"auto",justifySelf:"stretch"}}>
          <Table compact selectable color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">Nom de l'objet</Table.HeaderCell>                
                <Table.HeaderCell textAlign="center">Taille du fichier</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Nom original</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Type de document</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Objet lié à </Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.storedObjects()}
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Storage));
