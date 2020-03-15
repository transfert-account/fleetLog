import React, { Component } from 'react';
import { Icon, Input, Button, Table, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
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
    openAddAccident:false,
    accidentsRaw:[],
    accidents : () => {
      let displayed = Array.from(this.state.accidentsRaw);
      if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
        displayed = displayed.filter(a =>
            a.societe._id == this.props.societeFilter
        );
      }
      if(this.state.accidentFilter.length>0){
          displayed = displayed.filter(a =>
              a.vehicle.registration.toLowerCase().includes(this.state.accidentFilter.toLowerCase())
          );
      }
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
          <AccidentRow loadAccidents={this.loadAccidents} key={a._id} accident={a}/>
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
    accidentsQuery : gql`
      query accidents{
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

  loadAccidents = () => {
    this.props.client.query({
        query:this.state.accidentsQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
          accidentsRaw:data.accidents
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
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
        <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="accidentFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher un véhicule' />
        <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddAccident} icon labelPosition='right'>Nouvel accident<Icon name='plus'/></Button>
        <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
            <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                <Table.Header>
                    <Table.Row textAlign='center'>
                      <Table.HeaderCell>Societe</Table.HeaderCell>
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