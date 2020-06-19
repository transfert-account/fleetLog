import React, { Component } from 'react';
import { Icon, Input, Button, Table, Modal, Form, Message } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import DropdownFilter from '../atoms/DropdownFilter';
import AccidentRow from '../molecules/AccidentRow';
import VehiclePicker from '../atoms/VehiclePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express'

class Accidents extends Component {

  state={
    accidentFilter:"",
    newVehicle:"",
    openDatePicker:false,
    datePickerTarget:"",
    newOccurenceDate:"",
    archiveFilter:false,
    docsFilter: "all",
    constatSentFilter: "all",
    archiveFilterInfos:{
      icon:"archive",            
      options:[
          {
              key: 'archivefalse',
              text: 'Accidents actuels',
              value: false,
              color:"green",
              click:()=>{this.switchArchiveFilter(false)},
              label: { color: 'green', empty: true, circular: true },
          },
          {
              key: 'archivetrue',
              text: 'Accidents archivés',
              value: true,
              color:"orange",
              click:()=>{this.switchArchiveFilter(true)},
              label: { color: 'orange', empty: true, circular: true },
          }
      ]
    },
    constatSentFilterInfos:{
        icon:"mail",            
        options:[
            {
                key: 'constatAll',
                text: 'Tous les accidents',
                value: "all",
                color:"green",
                click:()=>{this.setConstatSentFilter("all")},
                label: { color: 'green', empty: true, circular: true },
            },
            {
                key: 'constatNotSent',
                text: 'Constat à envoyer',
                value: "notSent",
                color:"orange",
                click:()=>{this.setConstatSentFilter("notSent")},
                label: { color: 'orange', empty: true, circular: true },
            }
        ]
    },
    docsFilterInfos:{
        icon:"folder open outline",            
        options:[
            {
                key: 'docsall',
                text: 'Tous les accidents',
                value: "all",
                color:"green",
                click:()=>{this.setDocsFilter("all")},
                label: { color: 'green', empty: true, circular: true },
            },
            {
                key: 'docsmissing',
                text: 'Documents manquants',
                value: "missingDocs",
                color:"red",
                click:()=>{this.setDocsFilter("missingDocs")},
                label: { color: 'red', empty: true, circular: true }
            }
        ]
    },
    openAddAccident:false,
    accidentsRaw:[],
    accidents : () => {
      let displayed = Array.from(this.state.accidentsRaw);
      if(this.state.accidentFilter.length>0){
          displayed = displayed.filter(a =>
              a.vehicle.registration.toLowerCase().includes(this.state.accidentFilter.toLowerCase())
          );
      }
      displayed = displayed.filter(a =>
        a.archived == this.state.archiveFilter
      );
      displayed = displayed.filter(a =>{
        if(this.state.docsFilter == "all"){return true}else{
            if(a.rapportExp._id == "" || a.constat._id == "" || a.facture._id == ""){
                return true
            }else{
                return false
            }
        }}
      )
      displayed = displayed.filter(a =>{
        if(this.state.constatSentFilter == "all"){return true}else{
            if(a.constatSent){
                return false
            }else{
                return true
            }
        }}
      )
      if(displayed.length == 0){
        return(
          <Table.Row key={"none"}>
            <Table.Cell colSpan='9' textAlign="center">
              <p>Aucun accident ne correspond à ce filtre</p>
            </Table.Cell>
          </Table.Row>
        )
      }
      return displayed.map(a =>(
          <AccidentRow hideSociete loadAccidents={this.loadAccidents} key={a._id} accident={a}/>
      ))
    },
    addAccidentQuery : gql`
        mutation addAccident($vehicle:String!,$occurenceDate:String!){
          addAccident(vehicle:$vehicle,occurenceDate:$occurenceDate){
            status
            message
          }
        }
    `,
    buAccidentsQuery : gql`
      query buAccidents{
        buAccidents{
          _id
          societe{
            _id
            trikey
            name
          }
          vehicle{
            _id
            registration
            model{
              _id
              name
            }
            brand{
              _id
              name
            }
          }
          occurenceDate
          description
          dateExpert
          dateTravaux
          constatSent
          cost
          archived
          constat{
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
          rapportExp{
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
          facture{
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
      }
    `
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  handleChangeVehicle = _id => {
    this.setState({ newVehicle:_id })
  }

  handleFilter = e =>{
    this.setState({
        accidentFilter:e.target.value
    });
  }

  showDatePicker = target => {
    this.setState({openDatePicker:true,datePickerTarget:target})
  }

  closeDatePicker = () => {
    this.setState({openDatePicker:false,datePickerTarget:""})
  }

  onSelectDatePicker = date => {
    this.setState({
      [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
    })
  }

  showAddAccident = () => {
    this.setState({
      openAddAccident:true
    })
  }

  closeAddAccident = () => {
    this.setState({
      openAddAccident:false
    })
  }

  //MISSING DOCS FILTER
  setDocsFilter = value => {
    this.setState({
      docsFilter:value
    })
  }

  //ARCHIVE FILTER
  switchArchiveFilter = v => {
      this.setState({
          archiveFilter:v
      })
      this.loadAccidents();
  }

  //CONSTAT SENT FILTER
  setConstatSentFilter = value => {
    this.setState({
      constatSentFilter:value
    })
  }

  loadAccidents = () => {
    this.props.client.query({
        query:this.state.buAccidentsQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
          accidentsRaw:data.buAccidents
        })
    })
  }

  addAccident = () => {
    this.closeAddAccident()
    this.props.client.mutate({
      mutation:this.state.addAccidentQuery,
      variables:{
        vehicle:this.state.newVehicle,
        occurenceDate:this.state.newOccurenceDate
      }
    }).then(({data})=>{
      data.addAccident.map(qrm=>{
        if(qrm.status){
          this.props.toast({message:qrm.message,type:"success"});
          this.loadAccidents();
        }else{
          this.props.toast({message:qrm.message,type:"error"});
        }
      })
    })
  }

  componentDidMount = () => {
    this.loadAccidents();
  }

  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
        <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="accidentFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher un véhicule' />
        <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddAccident} icon labelPosition='right'>Nouvel accident<Icon name='plus'/></Button>
        <div style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gridGap:"16px"}}>
          <DropdownFilter infos={this.state.archiveFilterInfos} active={this.state.archiveFilter} />
          <DropdownFilter infos={this.state.constatSentFilterInfos} active={this.state.constatSentFilter} />
          <DropdownFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
        </div>
        <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
            <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                <Table.Header>
                    <Table.Row textAlign='center'>
                      <Table.HeaderCell>Vehicle</Table.HeaderCell>
                      <Table.HeaderCell>Date</Table.HeaderCell>
                      <Table.HeaderCell>Date de passage Expert</Table.HeaderCell>
                      <Table.HeaderCell>Date de travaux</Table.HeaderCell>
                      <Table.HeaderCell>Constat Envoyé</Table.HeaderCell>
                      <Table.HeaderCell>Coût</Table.HeaderCell>
                      <Table.HeaderCell>Document</Table.HeaderCell>
                      <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.accidents()}
                </Table.Body>
            </Table>
        </div>
        <Modal closeOnDimmerClick={false} open={this.state.openAddAccident} onClose={this.closeAddAccident} closeIcon>
            <Modal.Header>
              Création du rapport d'accident
            </Modal.Header>
            <Modal.Content style={{textAlign:"center"}}>
                <Form style={{display:"grid",gridTemplateRows:"1fr",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                  <Form.Field>
                    <label>Véhicule concerné</label>
                    <VehiclePicker societeRestricted defaultValue={this.state.newVehicle} onChange={this.handleChangeVehicle}/>
                  </Form.Field>
                  <Form.Field>
                    <label>Date de l'accident</label>
                    <Input value={this.state.newOccurenceDate} onFocus={()=>{this.showDatePicker("newOccurenceDate")}} placeholder="Date de l'accident"/>
                  </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color="black" onClick={this.closeAddAccident}>Annuler</Button>
              <Button color="blue" onClick={this.addAccident}>Créer</Button>
            </Modal.Actions>
        </Modal>
        <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Accidents);