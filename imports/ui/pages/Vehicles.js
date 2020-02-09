import React, { Component, Fragment } from 'react';
import { Modal,Icon,Menu,Input,Dimmer,Loader,Table,Button,Form,Divider,Header } from 'semantic-ui-react';
import ModalDatePicker from '../atoms/ModalDatePicker'
import { UserContext } from '../../contexts/UserContext';
import VehiclesRow from '../molecules/VehiclesRow';
import SocietePicker from '../atoms/SocietePicker';
import PayementFormatPicker from '../atoms/PayementFormatPicker';
import VolumePicker from '../atoms/VolumePicker';
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
    newVolume:"",
    newPayload:0,
    newColor:"",
    newInsurancePaid:"",
    newPayementBeginDate:"",
    newPurchasePrice:"",
    newMonthlyPayement:"",
    newPayementOrg:"",
    newPayementFormat:"",
    archiveFilter:false,
    openAddVehicle:false,
    openDatePicker:false,
    datePickerTarget:"",
    maxPage:1,
    currentPage:1,
    vehiclesFiler:"",
    vehiclesRaw:[],
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
        displayed = displayed.filter(v =>
            v.archived == this.state.archiveFilter
        );
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
        mutation addVehicle($societe:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$insurancePaid:Float!,$payementBeginDate:String!,$purchasePrice:Float,$monthlyPayement:Float,$payementOrg:String,$payementFormat:String){
            addVehicle(societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,payementBeginDate:$payementBeginDate,purchasePrice:$purchasePrice,monthlyPayement:$monthlyPayement,payementOrg:$payementOrg,payementFormat:$payementFormat){
                status
                message
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
                volume{
                    _id
                    meterCube
                }
                payload
                color
                cg
                insurancePaid
                cv
                payementBeginDate
                property
                purchasePrice
                monthlyPayement
                payementOrg
                payementFormat
                archived
                archiveReason
                archiveDate
            }
        }
    `
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
    if(this.state.newSociete == "" || this.state.newSociete == "noidthisisvisibilitygroup" || this.state.newVolume == ""){
        this.props.toast({message:"Certains champs du formulaire sont incorrects",type:"error"});
    }else{
        this.closeAddVehicle();
        this.props.client.mutate({
            mutation:this.state.addVehicleQuery,
            variables:{
                societe:this.state.newSociete,
                registration:this.state.newRegistration,
                firstRegistrationDate:this.state.newFirstRegistrationDate,
                km:parseInt(this.state.newKm),
                lastKmUpdate:this.state.newLastKmUpdate,
                brand:this.state.newBrand,
                model:this.state.newModel,
                volume:this.state.newVolume,
                payload:parseFloat(this.state.newPayload),
                color:this.state.newColor,
                insurancePaid:parseFloat(this.state.newInsurancePaid),
                payementBeginDate:this.state.newPayementBeginDate,
                purchasePrice:parseFloat(this.state.newPurchasePrice),
                monthlyPayement:parseFloat(this.state.newMonthlyPayement),
                payementOrg:this.state.newPayementOrg,
                payementFormat:this.state.newPayementFormat
            }
        }).then(({data})=>{
            data.addVehicle.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicles();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
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

  handleChangePayementFormat = value => {
      this.setState({ newPayementFormat:value })
  }

  handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })

  loadVehicles = () => {
    this.props.client.query({
        query:this.state.vehiclesQuery,
        variables:{
            archive:this.state.archiveFilter
        },
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
            vehiclesRaw:data.vehicles
        })
    })
  }

    getArchiveButtonContent = () => {
        if(this.state.archiveFilter){
            return "Affiché : archives"
        }else{
            return "Affiché : valides"
        }
    }

    getArchiveFilterColor = () => {
        if(this.state.archiveFilter){
            return "orange"
        }else{
            return "green"
        }
    }

    getArchiveButtonIcon = () => {
        if(this.state.archiveFilter){
            return "truck"
        }else{
            return "archive"
        }
    }

    switchArchiveFilter = () => {
        if(this.state.archiveFilter){
            this.setState({
                archiveFilter:false
            })
        }else{
            this.setState({
                archiveFilter:true
            })
        }
        this.loadVehicles();
    }

  componentDidMount = () => {
    this.loadVehicles();
  }

  render() {
    return (
        <Fragment>
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 5fr 1fr 1fr"}}>
                <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                    <Menu.Item color="blue" name='vehicules' active onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                    <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                    <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                    <Menu.Item color="blue" name='locations' onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                </Menu>
                <Input style={{justifySelf:"stretch"}} name="vehiclesFiler" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher un vehicule ... (3 caractères minimum)' />
                <Button color={this.getArchiveFilterColor()} style={{justifySelf:"stretch"}} onClick={this.switchArchiveFilter} icon labelPosition='right'>{this.getArchiveButtonContent()} <Icon name={this.getArchiveButtonIcon()} /></Button>
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddVehicle} icon labelPosition='right'>Ajouter un véhicule<Icon name='plus'/></Button>
                <div style={{gridRowStart:"2",gridColumnEnd:"span 4",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color={this.getArchiveFilterColor()} compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Societe</Table.HeaderCell>
                                <Table.HeaderCell>Immatriculation</Table.HeaderCell>
                                <Table.HeaderCell>Date d'immatriculation</Table.HeaderCell>
                                <Table.HeaderCell>Kilométrage</Table.HeaderCell>
                                <Table.HeaderCell>Dernier relevé</Table.HeaderCell>
                                <Table.HeaderCell>Marque</Table.HeaderCell>
                                <Table.HeaderCell>Modèle</Table.HeaderCell>
                                <Table.HeaderCell>Volume</Table.HeaderCell>
                                <Table.HeaderCell>Charge utile</Table.HeaderCell>
                                <Table.HeaderCell>Propriété</Table.HeaderCell>
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
                    <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gridGap:"16px"}}>
                        <Form.Field style={{gridColumnStart:"2"}}><label>Societe</label>
                            <SocietePicker groupAppears={true} onChange={this.handleChangeSociete}/>
                        </Form.Field>
                        <Divider style={{gridColumnEnd:"span 3",height:"23px"}} horizontal>
                            <Header as='h4'>
                                <Icon name='clipboard' />
                                Details
                            </Header>
                        </Divider>
                        <Form.Field><label>Immatriculation</label><input onChange={this.handleChange} name="newRegistration"/></Form.Field>
                        <Form.Field><label>Date de première immatriculation</label><input onChange={this.handleChange} value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} placeholder="firstRegistrationDate" name="newFirstRegistrationDate"/></Form.Field>
                        <Form.Field><label>Kilométrage</label><input onChange={this.handleChange} name="newKm"/></Form.Field>
                        <Form.Field><label>Date de relevé</label><input onChange={this.handleChange} value={this.state.newLastKmUpdate} onFocus={()=>{this.showDatePicker("newLastKmUpdate")}} name="newLastKmUpdate"/></Form.Field>
                        <Form.Field><label>Brand</label><input onChange={this.handleChange} name="newBrand"/></Form.Field>
                        <Form.Field><label>Model</label><input onChange={this.handleChange} name="newModel"/></Form.Field>
                        <Form.Field><label>Volume</label><VolumePicker onChange={this.handleChangeVolume}/></Form.Field>
                        <Form.Field><label>Payload</label><input onChange={this.handleChange} name="newPayload"/></Form.Field>
                        <Form.Field><label>Color</label><input onChange={this.handleChange} name="newColor"/></Form.Field>
                        <Divider style={{gridColumnEnd:"span 3",height:"23px"}} horizontal>
                            <Header as='h4'>
                                <Icon name='euro' />
                                Finances
                            </Header>
                        </Divider>
                        <Form.Field><label>Prix à l'achat</label><input onChange={this.handleChange} name="newPurchasePrice"/></Form.Field>
                        <Form.Field><label>Mensualité</label><input onChange={this.handleChange} name="newMonthlyPayement"/></Form.Field>
                        <Form.Field><label>Organisme de financement</label><input onChange={this.handleChange} name="newPayementOrg"/></Form.Field>
                        
                        <Form.Field><label>Montant de l'assurance</label><input onChange={this.handleChange} name="newInsurancePaid"/></Form.Field>
                        <Form.Field style={{gridColumnStart:"2"}}><label>Type de financement</label>
                            <PayementFormatPicker change={this.handleChangePayementFormat}/>
                        </Form.Field>
                        <Form.Field><label>Date de début du payement</label><input onChange={this.handleChange} value={this.state.newPayementBeginDate} onFocus={()=>{this.showDatePicker("newPayementBeginDate")}} name="newPayementBeginDate"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={this.closeAddVehicle}>Annuler</Button>
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