import React, { Component } from 'react';
import { Input, Table, Button, Icon } from 'semantic-ui-react';
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
          debug
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
    ],
    selectedType : "",
    selectedSubtype : "",
    storedObjectsRaw:[],
    storedObjects : () => {
      let displayed = Array.from(this.state.storedObjectsRaw);
      displayed = displayed.filter(d=>d.name.toLowerCase().includes(this.state.storedObjectsFilter.toLowerCase()));
      if(this.state.selectedSubtype != ""){
        displayed = displayed.filter(d=>{
          return d.name.split("_")[1] == this.state.selectedSubtype
        })
      }
      return displayed.map(so=>(
        <StoredObjectRow key={so.name} so={so}/>
      ))
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
        <div>
          <MultiDropdown onChange={(value)=>this.setState({selectedType:value})} options={this.state.types.map(x=>{return({key:x.obj,text:x.name,value:x.obj,label:{color:'blue',empty:true,circular:true}})})}/>
          <MultiDropdown onChange={(value)=>this.setState({selectedSubtype:value})} options={(this.state.types.filter(x=>x.obj == this.state.selectedType)[0] ? this.state.types.filter(x=>x.obj == this.state.selectedType)[0].types.map(x=>{return({key:x.type,text:x.name,value:x.type,label:{color:'blue',empty:true,circular:true}})}) : [])}/>
          <Button color="red" onClick={()=>this.setState({selectedSubtype:""})}><Icon style={{margin:"0"}} name="cancel"/></Button>
        </div>
        <div style={{display:"block",overflowY:"auto",justifySelf:"stretch"}}>
          <Table compact selectable striped color="blue">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="center">Nom de l'objet</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Nom original du fichier</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Type</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Format</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Taille du fichier</Table.HeaderCell>
                <Table.HeaderCell textAlign="center">Date de stockage</Table.HeaderCell>
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
