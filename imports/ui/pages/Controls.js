import React, { Component, Fragment } from 'react';
import { Icon, Menu, Input, Dimmer, Loader, Table, Message, Button } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ControlRow from '../molecules/ControlRow';
import { gql } from 'apollo-server-express';
import moment from 'moment';
import 'moment/locale/fr';

export class Controls extends Component {

    state={
        vehiclesFiler:"",
        controlFilter:"all",
        docsFilter:"all",
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
                    archived
                    firstRegistrationDate
                    km
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
                    insurancePaid
                    property
                    equipements{
                        _id
                        equipementDescription{
                            _id
                            name
                            controlPeriodValue
                            controlPeriodUnit
                            alertStepValue
                            alertStepUnit
                            unitType
                        }
                        attachementDate
                        lastControl
                        controlTech{
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
        equipementDescriptionsQuery : gql`
            query equipementDescriptions{
                equipementDescriptions{
                    _id
                    name
                    controlPeriodValue
                    controlPeriodUnit
                    alertStepValue
                    alertStepUnit
                    unitType
                }
            }
        `,
        vehiclesRaw:[],
        equipementDescriptionsRaw:[],
        vehicles : () => {
            if(this.state.vehiclesRaw.length == 0){
                return(
                    <Table.Row key={"none"}>
                        <Table.Cell width={16} colSpan='11' textAlign="center">
                            Aucun véhicule en base
                        </Table.Cell>
                    </Table.Row>
                )
            }
            let displayed = Array.from(this.state.vehiclesRaw);
            displayed = displayed.filter(v =>
                v.archived == false // exclut les véhicules archivés
            );
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(v =>
                    v.societe._id == this.props.societeFilter
                );
            }
            if(this.state.controlFilter != "all"){
                displayed = displayed.filter(v=>{
                    if(this.state.controlFilter == "soon"){
                        if(v.orange > 0 || v.red > 0){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        if(v.red > 0){
                            return true
                        }else{
                            return false
                        }
                    }       
                })
            }
            if(this.state.docsFilter != "all"){
                displayed = displayed.filter(v=>{
                    if(this.state.docsFilter == "missingDocs"){
                        if(v.redDocs > 0 ){
                            return true
                        }else{
                            return false
                        }
                    }      
                })
            }
            if(this.state.vehiclesFiler.length>0){
                displayed = displayed.filter(i =>
                    i.registration.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                    i.brand.name.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase()) ||
                    i.model.name.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase())
                );
                if(displayed.length == 0){
                return(
                    <Table.Row key={"none"}>
                    <Table.Cell width={16} colSpan='11' textAlign="center">
                        <p>Aucun véhicule ne correspond à ce filtre</p>
                    </Table.Cell>
                    </Table.Row>
                )
                }
            }
            displayed.sort((a, b) => a.registration.localeCompare(b.registration))
            return displayed.map(i =>(
                <ControlRow loadVehicles={this.loadVehicles} equipementDescriptionsRaw={this.state.equipementDescriptionsRaw} key={i._id} vehicle={i}/>
            ))
        },
        
    }

    handleFilter = e =>{
        this.setState({
        vehiclesFiler:e.target.value
        });
    }

    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
        });
    }

    loadVehicles = () => {
        this.props.client.query({
            query:this.state.vehiclesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            data.vehicles.map(v=>{
                v.redDocs = v.equipements.filter(e=>e.controlTech._id == "").length;
                v.greenDocs = v.equipements.filter(e=>e.controlTech._id != "").length;
                v.red = 0;
                v.orange = 0;
                v.green = 0;
                v.equipements.map(e=>{
                    e.nextControl = 0;
                    e.alertStep = 0;
                    e.color = "green";
                    if(e.equipementDescription.unitType == "t"){
                        if(e.equipementDescription.controlPeriodUnit == "y"){
                            e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,"Y");
                        }
                        if(e.equipementDescription.controlPeriodUnit == "m"){
                            e.nextControl = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.controlPeriodValue,'M');
                        }
                        if(e.equipementDescription.alertStepUnit == "y"){
                            e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,"Y");
                        }
                        if(e.equipementDescription.alertStepUnit == "m"){
                            e.alertStep = moment(e.lastControl,"DD/MM/YYYY").add(e.equipementDescription.alertStepValue,'M');
                        }
                        if(moment(e.alertStep, "DD/MM/YYYY").diff(moment())<0){
                            e.color = "orange"
                        }
                        if(moment(e.nextControl, "DD/MM/YYYY").diff(moment())<0){
                            e.color = "red"
                        }
                    }
                    if(e.equipementDescription.unitType == "d"){
                        e.nextControl = (parseInt(e.lastControl) + parseInt(e.equipementDescription.controlPeriodValue)) - parseInt(v.km)
                        if(e.nextControl<e.equipementDescription.alertStepValue){
                            e.color = "orange";
                        }
                        if(e.nextControl<0){
                            e.color = "red";
                        }
                    }
                    if(e.color == "red"){
                        v.red ++;
                    }
                    if(e.color == "orange"){
                        v.orange ++;
                    }
                    if(e.color == "green"){
                        v.green ++;
                    }
                })
            })
            this.setState({
                vehiclesRaw:data.vehicles
            })
        })
    }

    loadEquipementDescriptions = () => {
        this.props.client.query({
            query:this.state.equipementDescriptionsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                equipementDescriptionsRaw:data.equipementDescriptions
            })
        })
    }

    //CONTROLS END DATE FILTER
    getControlFilterColor = (color,filter) => {
        if(this.state.controlFilter == filter){
            return color
        }
    }

    setControlFilter = value => {
        this.setState({
            controlFilter:value
        })
    }

    //MISSING DOCS FILTER
    getDocsFilterColor = (color,filter) => {
        if(this.state.docsFilter == filter){
            return color
        }
    }

    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }

    componentDidMount = () => {
        this.loadVehicles();
    }

    componentDidMount = () => {
        this.loadVehicles();
        this.loadEquipementDescriptions();
    }

    componentWillMount = () => {
        moment.locale('fr');
    }

    render() {
        return (
            <Fragment>
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto 1fr"}}>
                    <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                        <Menu.Item color="blue" name='vehicules' onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                        <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                        <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                        <Menu.Item color="blue" name='locations' onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                    </Menu>
                    <Input style={{justifySelf:"stretch"}} onChange={this.handleFilter} icon='search' placeholder='Rechercher une immatriculation, une marque ou un modèle' />
                    <div style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                        <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                            <Icon name='clipboard check'/>
                            <Button.Group style={{placeSelf:"center"}}>
                                <Button color={this.getControlFilterColor("green","all")} onClick={()=>{this.setControlFilter("all")}}>Tous</Button>
                                <Button color={this.getControlFilterColor("orange","soon")} onClick={()=>{this.setControlFilter("soon")}}>Seuil d'alerte dépassé</Button>
                                <Button color={this.getControlFilterColor("red","over")} onClick={()=>{this.setControlFilter("over")}}>Limite dépassée</Button>
                            </Button.Group>
                        </Message>
                        <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                            <Icon name='folder open'/>
                            <Button.Group style={{placeSelf:"center"}}>
                                <Button color={this.getDocsFilterColor("green","all")} onClick={()=>{this.setDocsFilter("all")}}>Tous</Button>
                                <Button color={this.getDocsFilterColor("red","missingDocs")} onClick={()=>{this.setDocsFilter("missingDocs")}}>Documents manquants</Button>
                            </Button.Group>
                        </Message>
                    </div>
                    <div style={{gridRowStart:"3",gridColumnEnd:"span 2",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign='center'>Societe</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Immatriculation</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Véhicule</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>OK</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Urgent</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>En retard</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Documents</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.vehicles()}
                            </Table.Body>
                        </Table>
                        <Dimmer inverted active={this.state.loading}>
                            <Loader size='massive'>Chargement des vehicules et de leurs equipements ...</Loader>
                        </Dimmer>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Controls);