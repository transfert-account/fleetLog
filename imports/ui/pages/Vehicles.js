import React, { Component, Fragment } from 'react';
import { Modal,Dropdown,Icon,Menu,Input,Dimmer,Loader,Table,Button,Form } from 'semantic-ui-react';
import ModalDatePicker from '../atoms/ModalDatePicker'
import { UserContext } from '../../contexts/UserContext';
import VehiclesRow from '../molecules/VehiclesRow';
import { gql } from 'apollo-server-express';

export class Vehicles extends Component {

  state={
    newSociete:"",
    newRegistration:"",
    newFirstRegistrationDate:"",
    newKm:"",
    newLastKmUpdate:"",
    newBrand:"",
    newModel:"",
    newVolume:0,
    newPayload:0,
    newColor:"",
    newInsurancePaid:"",
    newEndDate:"",
    newProperty:"",
    openAddVehicle:false,
    openDatePicker:false,
    datePickerTarget:"",
    maxPage:1,
    currentPage:1,
    vehiclesFiler:"",
    vehiclesRaw:[],
    societesRaw:[],
    vehicles : () => {
        if(this.state.vehiclesRaw.length==0){
            return(
                <Table.Row key={"none"}>
                    <Table.Cell width={16} colSpan='14' textAlign="center">
                        Le terme recherché n'apparait nul part dans les données.
                    </Table.Cell>
                </Table.Row>
            )
        }
        let displayed = Array.from(this.state.vehiclesRaw);
        if(this.state.vehiclesFiler.length>1){
            displayed = displayed.filter(i =>
                i.societe.name.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                i.registration.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                i.brand.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                i.model.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase())
            );
            if(displayed.length == 0){
              return(
                <Table.Row key={"none"}>
                  <Table.Cell width={16} colSpan='14' textAlign="center">
                    <p>Aucun consommable répondant à ce filtre</p>
                  </Table.Cell>
                </Table.Row>
              )
            }
        }
        //displayed = displayed.slice((this.state.currentPage - 1) * this.state.rowByPage, this.state.currentPage * this.state.rowByPage);
        return displayed.map(i =>(
            <VehiclesRow loadVehicles={this.loadVehicles} societesRaw={this.state.societesRaw} key={i._id} vehicle={i}/>
        ))
    },
    addVehicleQuery : gql`
        mutation addVehicle($societe:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:Float!,$payload:Float!,$color:String!,$insurancePaid:Float!,$endDate:String!,$property:Boolean!){
            addVehicle(societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,endDate:$endDate,property:$property){
                _id
                societe{
                    _id
                    trikey
                    name
                }
                registration
                firstRegistrationDate
                km
                lastKmUpdate
                brand
                model
                volume
                payload
                color
                cg
                insurancePaid
                cv
                endDate
                property
            }
        }
    `,
    vehiclesQuery : gql`
        query vehicles{
            vehicles{
                _id
                societe{
                    _id
                    trikey
                    name
                }
                registration
                firstRegistrationDate
                km
                lastKmUpdate
                brand
                model
                volume
                payload
                color
                cg
                insurancePaid
                cv
                endDate
                property
            }
        }
    `,
    societesQuery : gql`
        query societes{
            societes{
                _id
                trikey
                name
            }
        }
    `,
  }

  closeAddVehicle = () => {
    this.setState({openAddVehicle:false})
  }

  showAddVehicle = () => {
    this.setState({openAddVehicle:true})
  }

  showDatePicker = target => {
    this.setState({openDatePicker:true,datePickerTarget:target})
  }

  closeDatePicker = target => {
    this.setState({openDatePicker:false,datePickerTarget:""})
  }

  onSelectDatePicker = date => {
    this.setState({
        [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
    })
  }

  addVehicle = () => {
    this.closeAddVehicle()
    this.props.client.mutate({
        mutation:this.state.addVehicleQuery,
        variables:{
            societe:this.state.newSociete,
            registration:this.state.newRegistration,
            firstRegistrationDate:this.state.newFirstRegistrationDate,
            km:parseFloat(this.state.newKm),
            lastKmUpdate:this.state.newLastKmUpdate,
            brand:this.state.newBrand,
            model:this.state.newModel,
            volume:parseFloat(this.state.newVolume),
            payload:parseFloat(this.state.newPayload),
            color:this.state.newColor,
            insurancePaid:parseFloat(this.state.newInsurancePaid),
            endDate:this.state.newEndDate,
            property:(this.state.newProperty=="on")
        }
    }).then(({data})=>{
        this.loadVehicles();
    })
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  handleFilter = e =>{
    this.setState({
      vehiclesFiler:e
    });
  }

  handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

  loadVehicles = () => {
    this.props.client.query({
        query:this.state.vehiclesQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
            vehiclesRaw:data.vehicles
        })
    })
  }

  loadSocietes = () => {
    this.props.client.query({
        query:this.state.societesQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        data.societes.push({_id:"noidthisisgroupvisibility",name:"Groupe",trikey:"GRP"})
        this.setState({
            societesRaw:data.societes
        })
    })
  }

  componentDidMount = () => {
    this.loadVehicles();
    this.loadSocietes();
  }

  render() {
    return (
        <Fragment>
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 3fr 1fr 1fr"}}>
                <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                    <Menu.Item color="blue" name='vehicules' active onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                    <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                    <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                    <Menu.Item color="blue" name='rentals' onClick={()=>{this.props.history.push("/parc/rentals")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                </Menu>
                <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="vehiclesFiler" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher un vehicule ... (3 caractères minimum)' />
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddVehicle} icon labelPosition='right'>Ajouter un véhicule<Icon name='plus'/></Button>
                <div style={{gridRowStart:"2",gridColumnEnd:"span 4",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Societe</Table.HeaderCell>
                                <Table.HeaderCell>Registration</Table.HeaderCell>
                                <Table.HeaderCell>FirstRegistrationDate</Table.HeaderCell>
                                <Table.HeaderCell>Km</Table.HeaderCell>
                                <Table.HeaderCell>LastKmUpdate</Table.HeaderCell>
                                <Table.HeaderCell>Brand</Table.HeaderCell>
                                <Table.HeaderCell>Model</Table.HeaderCell>
                                <Table.HeaderCell>Volume</Table.HeaderCell>
                                <Table.HeaderCell>Payload</Table.HeaderCell>
                                <Table.HeaderCell>Color</Table.HeaderCell>
                                <Table.HeaderCell>InsurancePaid</Table.HeaderCell>
                                <Table.HeaderCell>EndDate</Table.HeaderCell>
                                <Table.HeaderCell>Property</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.vehicles()}
                        </Table.Body>
                    </Table>
                    <Dimmer inverted active={this.state.loading}>
                        <Loader size='massive'>Chargement des vehicules ...</Loader>
                    </Dimmer>
                </div>
            </div>
            <Modal closeOnDimmerClick={false} open={this.state.openAddVehicle} onClose={this.closeAddVehicle} closeIcon>
                <Modal.Header>
                    Création du véhicule
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateRows:"1fr 1fr 1fr",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                        <Form.Field><label>Societe</label><Dropdown placeholder='Choisir un société' search selection onChange={this.handleChangeSociete} options={this.state.societesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} name="newSociete" /></Form.Field>
                        <Form.Field><label>Registration</label><input onChange={this.handleChange} placeholder="registration" name="newRegistration"/></Form.Field>
                        <Form.Field><label>FirstRegistrationDate</label><input onChange={this.handleChange} value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} placeholder="firstRegistrationDate" name="newFirstRegistrationDate"/></Form.Field>
                        <Form.Field><label>Km</label><input onChange={this.handleChange} placeholder="km" name="newKm"/></Form.Field>
                        <Form.Field><label>LastKmUpdate</label><input onChange={this.handleChange} value={this.state.newLastKmUpdate} placeholder="lastKmUpdate" onFocus={()=>{this.showDatePicker("newLastKmUpdate")}} name="newLastKmUpdate"/></Form.Field>
                        <Form.Field><label>Brand</label><input onChange={this.handleChange} placeholder="brand" name="newBrand"/></Form.Field>
                        <Form.Field><label>Model</label><input onChange={this.handleChange} placeholder="model" name="newModel"/></Form.Field>
                        <Form.Field><label>Volume</label><input onChange={this.handleChange} placeholder="volume" name="newVolume"/></Form.Field>
                        <Form.Field><label>Payload</label><input onChange={this.handleChange} placeholder="payload" name="newPayload"/></Form.Field>
                        <Form.Field><label>Color</label><input onChange={this.handleChange} placeholder="color" name="newColor"/></Form.Field>
                        <Form.Field><label>InsurancePaid</label><input onChange={this.handleChange} placeholder="insurancePaid" name="newInsurancePaid"/></Form.Field>
                        <Form.Field><label>EndDate</label><input onChange={this.handleChange} value={this.state.newEndDate} onFocus={()=>{this.showDatePicker("newEndDate")}} placeholder="endDate" name="newEndDate"/></Form.Field>
                        <Form.Field><label>Property</label><Input type="checkbox" onChange={this.handleChange} name="newProperty"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.addVehicle}>Créer</Button>
                </Modal.Actions>
            </Modal>
            <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
        </Fragment>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Vehicles);