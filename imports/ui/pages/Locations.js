import React, { Component, Fragment } from 'react';
import { Modal, Icon, Menu, Input, Dimmer, Loader, Table, Button, Form, Divider, Header, TextArea } from 'semantic-ui-react';

import { UserContext } from '../../contexts/UserContext';

import CustomFilterSegment from '../molecules/CustomFilterSegment';
import LocationsRow from '../molecules/LocationRow';
import BigButtonIcon from '../elements/BigIconButton';

import CustomFilter from '../atoms/CustomFilter';
import SocietePicker from '../atoms/SocietePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import RegistrationInput from '../atoms/RegistrationInput';
import FournisseurPicker from '../atoms/FournisseurPicker';
import VolumePicker from '../atoms/VolumePicker';
import ColorPicker from '../atoms/ColorPicker';
import ModelPicker from '../atoms/ModelPicker';
import BrandPicker from '../atoms/BrandPicker';
import EnergyPicker from '../atoms/EnergyPicker';

import { gql } from 'apollo-server-express';
import moment from 'moment';

class Locations extends Component {

    state={
        newSociete:"",
        newFournisseur:"",
        newRegistration:"",
        newFirstRegistrationDate:"",
        newKm:"",
        newLastKmUpdate:"",
        newBrand:"",
        newModel:"",
        newEnergy:"",
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
        reportLateFilter:"all",
        docsFilter:"all",
        filters:[
            {
                infos:"archiveFilterInfos",
                filter:"archiveFilter"
            },{
                infos:"reportLateFilterInfos",
                filter:"reportLateFilter"
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
                    text: 'Véhicules actuels',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    initial: false,
                    text: 'Véhicules archivés',
                    value: true,
                    color:"orange",
                    click:()=>{this.switchArchiveFilter(true)},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        reportLateFilterInfos:{
            icon:"dashboard",            
            options:[
                {
                    key: 'reportall',
                    initial: true,
                    text: 'Tous les véhicules',
                    value: "all",
                    color:"green",
                    click:()=>{this.setReportLateFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'report2w',
                    initial: false,
                    text: 'Relevé > 9 jours',
                    value: "2w",
                    color:"orange",
                    click:()=>{this.setReportLateFilter("2w")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'report4w',
                    initial: false,
                    text: 'Relevé > 14 jours',
                    value: "4w",
                    color:"red",
                    click:()=>{this.setReportLateFilter("4w")},
                    label: { color: 'red', empty: true, circular: true }
                }
            ]
        },
        docsFilterInfos:{
            icon:"folder open outline",            
            options:[
                {
                    key: 'docsall',
                    initial: true,
                    text: 'Tous les véhicules',
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
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(l =>
                    l.societe._id == this.props.societeFilter
                );
            }
            displayed = displayed.filter(l =>{
                if(this.state.reportLateFilter == "all"){return true}else{
                    let days = parseInt(moment().diff(moment(l.lastKmUpdate, "DD/MM/YYYY"),'days'));
                    if(this.state.reportLateFilter == "2w"){
                        if(days >= 9){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        if(days >= 14){
                            return true
                        }else{
                            return false
                        }
                    }
                }
            });
            displayed = displayed.filter(v =>{
                if(this.state.docsFilter == "all"){return true}else{
                    if(v.cg._id == "" || v.cv._id == "" || v.contrat._id == "" || v.restitution._id == ""){
                        return true
                    }else{
                        return false
                    }
                }}
            )
            if(this.state.locationsFiler.length>0){
                displayed = displayed.filter(i =>
                    i.registration.toLowerCase().includes(this.state.locationsFiler.toLowerCase()) ||
                    i.fournisseur.name.toLowerCase().includes(this.state.locationsFiler.toLowerCase())
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
            displayed.sort((a, b) => a.registration.localeCompare(b.registration))
            //displayed = displayed.slice((this.state.currentPage - 1) * this.state.rowByPage, this.state.currentPage * this.state.rowByPage);
            return displayed.map(l =>(
                <LocationsRow hideSociete={this.props.userLimited} loadLocations={this.loadLocations} societesRaw={this.state.societesRaw} key={l._id} rental={l}/>)
            )
        },
        addLocationQuery : gql`
            mutation addLocation($societe:String!,$fournisseur:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$energy:String!,$volume:String!,$payload:Float!,$color:String!,$insurancePaid:Float!,$price:Float!,$endDate:String!,$reason:String!){
                addLocation(societe:$societe,fournisseur:$fournisseur,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,energy:$energy,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,price:$price,endDate:$endDate,reason:$reason){
                    status
                    message
                }
            }
        `,
        locationsQuery : gql`
            query locations{
                locations{
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
                    energy{
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
                    insurancePaid
                    startDate
                    endDate
                    price
                    rentalContract
                    reason
                    reparation
                    archived
                    archiveReason
                    archiveDate
                    cg{
                        _id
                    }
                    cv{
                        _id
                    }
                    contrat{
                        _id
                    }
                    restitution
                    {
                        _id
                    }
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
                    energy{
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
                    insurancePaid
                    startDate
                    endDate
                    price
                    rentalContract
                    reason
                    reparation
                    archived
                    archiveReason
                    archiveDate
                    cg{
                        _id
                    }
                    cv{
                        _id
                    }
                    contrat{
                        _id
                    }
                    restitution
                    {
                        _id
                    }
                }
            }
        `
    }

    /*SHOW AND HIDE MODALS*/
    toggleDisplayDoc = () => {
        this.setState({
            displayDoc:!this.state.displayDoc
        })
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
    /*CHANGE HANDLERS*/
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
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
    handleChangeEnergy = (e, { value }) => this.setState({ newEnergy:value })
    handleChangeColor = (e, { value }) => this.setState({ newColor:value })
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    handleChangeFournisseur = (e, { value }) => this.setState({ newFournisseur:value })
    handleChangePayementFormat = value => {
        this.setState({ newPayementFormat:value })
    }
    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })
    
    /*FILTERS HANDLERS*/
    switchArchiveFilter = v => {
        this.setState({
            archiveFilter:v
        })
        this.loadVehicles();
    }
    setReportLateFilter = value => {
        this.setState({
            reportLateFilter:value
        })
    }
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }
    handleFilter = e =>{
        this.setState({
        locationsFiler:e
        });
    }
    resetAll = () => {
        let filterNewValues = {};
        this.state.filters.forEach(f=>{
            filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
        })
        this.setState(filterNewValues);
    }
    /*DB READ AND WRITE*/
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
                energy:this.state.newEnergy,
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
    loadLocations = () => {
        let locationsQuery = (this.props.userLimited ? this.state.buLocationsQuery : this.state.locationsQuery);
        this.props.client.query({
            query:locationsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let locations = (this.props.userLimited ? data.buLocations : data.locations);
            this.setState({
                locationsRaw:locations
            })
        })
    }
    /*CONTENT GETTERS*/
    getTableHeader = () => {
        if(this.props.userLimited){
            return(
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
                        <Table.HeaderCell>Fournisseur</Table.HeaderCell>
                        <Table.HeaderCell>Documents</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }else{
            return(
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Societe</Table.HeaderCell>
                        <Table.HeaderCell>Immatriculation</Table.HeaderCell>
                        <Table.HeaderCell>Kilométrage</Table.HeaderCell>
                        <Table.HeaderCell>Dernier relevé</Table.HeaderCell>
                        <Table.HeaderCell>Marque, Modèle & Energie</Table.HeaderCell>
                        <Table.HeaderCell>Volume</Table.HeaderCell>
                        <Table.HeaderCell>Charge utile</Table.HeaderCell>
                        <Table.HeaderCell>Fin de contrat</Table.HeaderCell>
                        <Table.HeaderCell>Fournisseur</Table.HeaderCell>
                        <Table.HeaderCell>Documents</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadLocations();
    }
    render() {
        return (
            <Fragment>
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
                    <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                        <Menu.Item color="blue" name='vehicules' onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                        <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                        <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                        <Menu.Item color="blue" name='locations' active onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/>Locations</Menu.Item>
                    </Menu>
                    <Input style={{justifySelf:"stretch"}} name="locationsFiler" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher une immatriculation ou un fournisseur' />
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <BigButtonIcon icon="plus" color="blue" onClick={this.showAddLocation} tooltip="Enregistrer une location"/>
                    </div>
                    <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}}>
                        <CustomFilter infos={this.state.archiveFilterInfos} active={this.state.archiveFilter} />
                        <CustomFilter infos={this.state.reportLateFilterInfos} active={this.state.reportLateFilter} />
                        <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
                    </CustomFilterSegment>
                    <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        <Table style={{marginBottom:"0"}} celled selectable compact>
                            {this.getTableHeader()}
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
                            <Form.Field style={{gridColumnEnd:"span 2"}}>
                                <label>Societe</label>
                                <SocietePicker restrictToVisibility groupAppears={false} onChange={this.handleChangeSociete}/>
                            </Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2"}}><label>Fournisseur</label><FournisseurPicker onChange={this.handleChangeFournisseur}/></Form.Field>
                            <RegistrationInput style={{gridColumnEnd:"span 2"}} onChange={this.handleRegistrationChange} name="newRegistration"/>
                            <Divider style={{gridColumnEnd:"span 6",height:"23px"}} horizontal>
                                <Header as='h4'>
                                    <Icon name='clipboard' />
                                    Details
                                </Header>
                            </Divider>
                            <Form.Field style={{gridColumnEnd:"span 2"}}><label>Date de première immatriculation</label><input onChange={this.handleChange} value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} name="newFirstRegistrationDate"/></Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2"}}><label>Kilométrage au retrait</label><input onChange={this.handleChange} name="newKm"/></Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2"}}><label>Date de retrait</label><input onChange={this.handleChange} value={this.state.newLastKmUpdate} onFocus={()=>{this.showDatePicker("newLastKmUpdate")}} name="newLastKmUpdate"/></Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2"}}><label>Marque</label><BrandPicker onChange={this.handleChangeBrand}/></Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2"}}><label>Marque</label><EnergyPicker onChange={this.handleChangeEnergy}/></Form.Field>
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

export default wrappedInUserContext = withUserContext(Locations);