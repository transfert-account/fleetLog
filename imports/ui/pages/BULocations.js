import React, { Component, Fragment } from 'react';
import { Modal,Icon,Menu,Input,Dimmer,Loader,Table,Button,Form,Divider,Header,TextArea } from 'semantic-ui-react';
import ModalDatePicker from '../atoms/ModalDatePicker'
import RegistrationInput from '../atoms/RegistrationInput';
import { UserContext } from '../../contexts/UserContext';
import LocationsRow from '../molecules/LocationRow';
import SocietePicker from '../atoms/SocietePicker';
import FournisseurPicker from '../atoms/FournisseurPicker';
import VolumePicker from '../atoms/VolumePicker';
import ColorPicker from '../atoms/ColorPicker';
import ModelPicker from '../atoms/ModelPicker';
import BrandPicker from '../atoms/BrandPicker';
import { gql } from 'apollo-server-express';

export class BULocations extends Component {

  state={
    newSociete:"",
    newFournisseur:"",
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
    newPrice:"",
    newEndDate:"",
    newJustification:"",
    openAddLocation:false,
    openDatePicker:false,
    archiveFilter:false,
    datePickerTarget:"",
    maxPage:1,
    currentPage:1,
    locationsFiler:"",
    locationsRaw:[],
    locations : () => {
        if(this.state.locationsRaw.length==0){
            return(
                <Table.Row key={"none"}>
                    <Table.Cell width={16} colSpan='14' textAlign="center">
                        Le terme recherché n'apparait nul part dans les données.
                    </Table.Cell>
                </Table.Row>
            )
        }
        let displayed = Array.from(this.state.locationsRaw);
        displayed = displayed.filter(l =>
            l.archived == this.state.archiveFilter
        );
        if(this.state.locationsFiler.length>1){
            displayed = displayed.filter(i =>
                i.societe.name.toLowerCase().includes(this.state.locationsFiler.toLowerCase()) ||
                i.registration.toLowerCase().includes(this.state.locationsFiler.toLowerCase()) ||
                i.brand.toLowerCase().includes(this.state.locationsFiler.toLowerCase()) ||
                i.model.toLowerCase().includes(this.state.locationsFiler.toLowerCase())
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
        return displayed.map(l =>(
            <LocationsRow hideSociete={true} loadLocations={this.loadLocations} societesRaw={this.state.societesRaw} key={l._id} rental={l}/>)
        )
    },
    addLocationQuery : gql`
        mutation addLocation($societe:String!,$fournisseur:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$insurancePaid:Float!,$price:Float!,$endDate:String!,$reason:String!){
            addLocation(societe:$societe,fournisseur:$fournisseur,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,price:$price,endDate:$endDate,reason:$reason){
                status
                message
            }
        }
    `,
    buLocationsQuery : gql`
        query buLocations{
            buLocations{
                _id
                societe{
                    _id
                    trikey
                    name
                }
                fournisseur{
                    _id
                    name
                    phone
                    mail
                    address
                }
                registration
                firstRegistrationDate
                km
                kms{
                    _id
                    reportDate
                    kmValue
                }
                lastKmUpdate
                brand{
                    _id
                    name
                }
                model{
                    _id
                    name
                }
                volume{
                    _id
                    meterCube
                }
                payload
                color{
                    _id
                    name
                    hex
                }
                cg
                insurancePaid
                cv
                startDate
                endDate
                price
                rentalContract
                reason
                reparation
                archived
                archiveReason
                archiveDate
            }
        }
    `
  }

  closeAddLocation = () => {
    this.setState({openAddLocation:false})
  }

  showAddLocation = () => {
    this.setState({openAddLocation:true})
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

  addLocation = () => {
    this.closeAddLocation()
    this.props.client.mutate({
        mutation:this.state.addLocationQuery,
        variables:{
            societe:this.state.newSociete,
            registration:this.state.newRegistration,
            firstRegistrationDate:this.state.newFirstRegistrationDate,
            km:parseFloat(this.state.newKm),
            lastKmUpdate:this.state.newLastKmUpdate,
            brand:this.state.newBrand,
            model:this.state.newModel,
            volume:this.state.newVolume,
            payload:parseFloat(this.state.newPayload),
            color:this.state.newColor,
            insurancePaid:parseFloat(this.state.newInsurancePaid),
            price:parseFloat(this.state.newPrice),
            endDate:this.state.newEndDate,
            reason:this.state.newJustification,
            fournisseur:this.state.newFournisseur
        }
    }).then(({data})=>{
        data.addLocation.map(qrm=>{
            if(qrm.status){
                this.props.toast({message:qrm.message,type:"success"});
                this.loadLocations();
            }else{
                this.props.toast({message:qrm.message,type:"error"});
            }
        })
    })
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  handleFilter = e =>{
    this.setState({
      locationsFiler:e
    });
  }

  handleRegistrationChange = value => {
    this.setState({
        newRegistration : value
    })
  }

  handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })

  handleChangeBrand = (e, { value }) => this.setState({ newBrand:value })

  handleChangeModel = (e, { value }) => this.setState({ newModel:value })

  handleChangeColor = (e, { value }) => this.setState({ newColor:value })

  handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

  handleChangeFournisseur = (e, { value }) => this.setState({ newFournisseur:value })

  handleChangePayementFormat = value => {
      this.setState({ newPayementFormat:value })
  }

  handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })

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
    this.loadLocations();
  }

  loadLocations = () => {
    this.props.client.query({
        query:this.state.buLocationsQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
            locationsRaw:data.buLocations
        })
    })
  }

  componentDidMount = () => {
    this.loadLocations();
  }

  render() {
    return (
        <Fragment>
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 3fr 1fr 1fr"}}>
                <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                    <Menu.Item color="blue" name='vehicules' onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                    <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                    <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                    <Menu.Item color="blue" name='locations' active onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                </Menu>
                <Input style={{justifySelf:"stretch"}} name="locationsFiler" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher un vehicule ... (3 caractères minimum)' />
                <Button color={this.getArchiveFilterColor()} style={{justifySelf:"stretch"}} onClick={this.switchArchiveFilter} icon labelPosition='right'>{this.getArchiveButtonContent()} <Icon name={this.getArchiveButtonIcon()} /></Button>
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddLocation} icon labelPosition='right'>Enregistrer une location<Icon name='plus'/></Button>
                <div style={{gridRowStart:"2",gridColumnEnd:"span 4",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color={this.getArchiveFilterColor()} compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Immatriculation</Table.HeaderCell>
                                <Table.HeaderCell>Kilométrage</Table.HeaderCell>
                                <Table.HeaderCell>Dernier relevé</Table.HeaderCell>
                                <Table.HeaderCell>Marque</Table.HeaderCell>
                                <Table.HeaderCell>Modèle</Table.HeaderCell>
                                <Table.HeaderCell>Volume</Table.HeaderCell>
                                <Table.HeaderCell>Charge utile</Table.HeaderCell>
                                <Table.HeaderCell>Fin de contrat</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.locations()}
                        </Table.Body>
                    </Table>
                    <Dimmer inverted active={this.state.loading}>
                        <Loader size='massive'>Chargement des vehicules ...</Loader>
                    </Dimmer>
                </div>
            </div>
            <Modal closeOnDimmerClick={false} open={this.state.openAddLocation} onClose={this.closeAddLocation} closeIcon>
                <Modal.Header>
                    Enregistrement de la location
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                        <Form.Field style={{gridColumnStart:"2",gridColumnEnd:"span 2"}}><label>Societe</label><SocietePicker groupAppears={false} onChange={this.handleChangeSociete}/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Fournisseur</label><FournisseurPicker onChange={this.handleChangeFournisseur}/></Form.Field>
                        <Divider style={{gridColumnEnd:"span 6",height:"23px"}} horizontal>
                            <Header as='h4'>
                                <Icon name='clipboard' />
                                Details
                            </Header>
                        </Divider>
                        <RegistrationInput style={{gridColumnEnd:"span 2"}} onChange={this.handleRegistrationChange} name="newRegistration"/>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Date de première immatriculation</label><input onChange={this.handleChange} value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} name="newFirstRegistrationDate"/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Kilométrage au retrait</label><input onChange={this.handleChange} name="newKm"/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Date de retrait</label><input onChange={this.handleChange} value={this.state.newLastKmUpdate} onFocus={()=>{this.showDatePicker("newLastKmUpdate")}} name="newLastKmUpdate"/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Marque</label><BrandPicker onChange={this.handleChangeBrand}/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Modèle</label><ModelPicker onChange={this.handleChangeModel}/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Volume</label><VolumePicker onChange={this.handleChangeVolume}/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Payload</label><input onChange={this.handleChange} name="newPayload"/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Couleur</label><ColorPicker onChange={this.handleChangeColor}/></Form.Field>
                        <Divider style={{gridColumnEnd:"span 6",height:"23px"}} horizontal>
                            <Header as='h4'>
                                <Icon name='euro' />
                                Finances
                            </Header>
                        </Divider>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Montant facturé</label><input onChange={this.handleChange} name="newPrice"/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Echéance de la location</label><input onChange={this.handleChange} value={this.state.newEndDate} onFocus={()=>{this.showDatePicker("newEndDate")}} name="newEndDate"/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Montant de l'assurance</label><input onChange={this.handleChange} name="newInsurancePaid"/></Form.Field>
                        <Form.Field style={{gridColumnEnd:"span 6"}}><label>Justification de la location</label><TextArea rows={4} onChange={this.handleChange} name="newJustification" placeholder=""/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="black" onClick={this.closeAddLocation}>Annuler</Button>
                    <Button color="blue" onClick={this.addLocation}>Créer</Button>
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

export default wrappedInUserContext = withUserContext(BULocations);