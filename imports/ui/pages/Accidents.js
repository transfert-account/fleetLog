import React, { Component } from 'react';
import { Input, Button, Table, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import CustomFilterSegment from '../molecules/CustomFilterSegment';
import VehicleAgglomeratedAccidentsRow from '../molecules/VehicleAgglomeratedAccidentsRow';

import BigButtonIcon from '../elements/BigIconButton';

import VehiclePicker from '../atoms/VehiclePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import CustomFilter from '../atoms/CustomFilter';

import { gql } from 'apollo-server-express';

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
    filters:[
      {
          infos:"archiveFilterInfos",
          filter:"archiveFilter"
      },{
          infos:"constatSentFilterInfos",
          filter:"constatSentFilter"
      },{
          infos:"docsFilterInfos",
          filter:"docsFilter"
      }
    ],
    archiveFilterInfos:{
      icon:"archive",            
      options:[
          {
              key: 'archivefalse',
              initial: true,
              text: 'Accidents actuels',
              value: false,
              color:"green",
              click:()=>{this.switchArchiveFilter(false)},
              label: { color: 'green', empty: true, circular: true },
          },
          {
              key: 'archivetrue',
              initial: false,
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
                initial: true,
                text: 'Tous les accidents',
                value: "all",
                color:"green",
                click:()=>{this.setConstatSentFilter("all")},
                label: { color: 'green', empty: true, circular: true },
            },
            {
                key: 'constatNotSent',
                initial: false,
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
                initial: true,
                text: 'Tous les accidents',
                value: "all",
                color:"green",
                click:()=>{this.setDocsFilter("all")},
                label: { color: 'green', empty: true, circular: true },
            },
            {
                key: 'docsmissing',
                initial: false,
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
    vehicleAgglomeratedAccidents : () => {
      let displayed = Array.from(JSON.parse(JSON.stringify(this.state.accidentsRaw)));
      if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
        displayed = displayed.filter(a =>
            a.societe._id == this.props.societeFilter
        );
      }
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        accs = accs.filter(a=>a.archived == this.state.archiveFilter)
        accs = accs.filter(a =>{
          if(this.state.docsFilter == "all"){return true}else{
              if(a.rapportExp._id == "" || a.constat._id == "" || a.facture._id == ""){
                return true
              }else{
                return false
              }
          }}
        )
        accs = accs.filter(a =>{
          if(this.state.constatSentFilter == "all"){return true}else{
              if(a.constatSent){
                return false
              }else{
                return true
              }
          }
        });
        vehicle.accidents = accs;
      });
      if(this.state.accidentFilter.length>0){
        displayed = displayed.filter(v =>
          v.registration.toLowerCase().includes(this.state.accidentFilter.toLowerCase())
        );
      }
      displayed = displayed.filter(v => v.accidents.length > 0);
      if(displayed.length == 0){
        return(
          <Table.Row key={"none"}>
            <Table.Cell colSpan='10' textAlign="center">
              <p>Aucun accident ne correspond à ce filtre</p>
            </Table.Cell>
          </Table.Row>
        )
      }
      return displayed.map(v =>{
        return(
          <VehicleAgglomeratedAccidentsRow archiveFilter={this.state.archiveFilter} docsFilter={this.state.docsFilter} constatSentFilter={this.state.constatSentFilter} archiveFilter={this.state.archiveFilter} hideSociete={this.props.userLimited} loadAccidents={this.loadAccidents} key={v._id} vehicle={v}/>
        )
      })
    },
    addAccidentQuery : gql`
        mutation addAccident($vehicle:String!,$occurenceDate:String!){
          addAccident(vehicle:$vehicle,occurenceDate:$occurenceDate){
            status
            message
          }
        }
    `,
    vehiclesByAccidentsQuery: gql`
      query vehiclesByAccidents{
        vehiclesByAccidents{
          _id
          societe{
            _id
            trikey
            name
          }
          km
          lastKmUpdate
          registration
          archived
          brand{
            _id
            name
          }
          model{
            _id
            name
          }
          energy{
            _id
            name
          }
          accidents{
            _id
            societe{
              _id
              trikey
              name
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
      }
    `,
    buVehiclesByAccidentsQuery: gql`
      query buVehiclesByAccidents{
        buVehiclesByAccidents{
          _id
          societe{
            _id
            trikey
            name
          }
          km
          lastKmUpdate
          registration
          archived
          brand{
            _id
            name
          }
          model{
            _id
            name
          }
          energy{
            _id
            name
          }
          accidents{
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
      }
    `,
  }
  /*SHOW AND HIDE MODALS*/
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
  showDatePicker = target => {
    this.setState({openDatePicker:true,datePickerTarget:target})
  }
  closeDatePicker = () => {
    this.setState({openDatePicker:false,datePickerTarget:""})
  }
  /*CHANGE HANDLERS*/
  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }
  handleChangeVehicle = _id => {
    this.setState({ newVehicle:_id })
  }
  onSelectDatePicker = date => {
    this.setState({
      [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
    })
  }
  /*FILTERS HANDLERS*/
  handleFilter = e =>{
    this.setState({
        accidentFilter:e.target.value
    });
  }
  setDocsFilter = value => {
    this.setState({
      docsFilter:value
    })
  }
  switchArchiveFilter = v => {
      this.setState({
          archiveFilter:v
      })
      this.loadAccidents();
  }
  setConstatSentFilter = value => {
    this.setState({
      constatSentFilter:value
    })
  }
  resetAll = () => {
    let filterNewValues = {};
    this.state.filters.forEach(f=>{
        filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
    })
    this.setState(filterNewValues);
  }
  /*DB READ AND WRITE*/
  loadAccidents = () => {
    let accidentsQuery = (this.props.userLimited ? this.state.buVehiclesByAccidentsQuery : this.state.vehiclesByAccidentsQuery);
    this.props.client.query({
        query:accidentsQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        let accidents = (this.props.userLimited ? data.buVehiclesByAccidents : data.vehiclesByAccidents);
        this.setState({
          accidentsRaw:accidents
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
  /*CONTENT GETTERS*/
  /*COMPONENTS LIFECYCLE*/
  componentDidMount = () => {
    this.loadAccidents();
  }
  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
        <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="accidentFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher une immatriculation' />
        <div style={{display:"flex",justifyContent:"flex-end"}}>
            <BigButtonIcon icon="plus" color="blue" onClick={this.showAddAccident} tooltip="Nouvel accident"/>
        </div>
        <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}}>
          <CustomFilter infos={this.state.archiveFilterInfos} active={this.state.archiveFilter} />
          <CustomFilter infos={this.state.constatSentFilterInfos} active={this.state.constatSentFilter} />
          <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
        </CustomFilterSegment>
        <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
          {this.state.vehicleAgglomeratedAccidents()}
        </div>
        <Modal closeOnDimmerClick={false} open={this.state.openAddAccident} onClose={this.closeAddAccident} closeIcon>
            <Modal.Header>
              Création du rapport d'accident
            </Modal.Header>
            <Modal.Content style={{textAlign:"center"}}>
                <Form style={{display:"grid",gridTemplateRows:"1fr",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                  <Form.Field>
                    <label>Véhicule concerné</label>
                    <VehiclePicker defaultValue={this.state.newVehicle} onChange={this.handleChangeVehicle}/>
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