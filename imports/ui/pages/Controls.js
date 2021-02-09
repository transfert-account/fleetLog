import React, { Component, Fragment } from 'react';
import { Icon, Menu, Input, Header, Modal, Form, Button, Dropdown } from 'semantic-ui-react';
import BigButtonIcon from '../elements/BigIconButton';
import CustomFilterSegment from '../molecules/CustomFilterSegment';
import CustomFilter from '../atoms/CustomFilter';
import ModalDatePicker from '../atoms/ModalDatePicker';
import VehiclePicker from '../atoms/VehiclePicker';
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
        entretienCreatedFilter:"all",
        newControlVehicle:"",
        newEquipement:null,
        hideLastControlDate:"hide",
        hideLastControlKm:"hide",
        datePickerTarget:"",
        newAttachementDate:"",
        newLastControlDate:"",
        updateControlType:"",
        newUpdatedControlDate:"",
        newUpdatedControlKm:"",
        newLastControlKm:"",
        filters:[
            {
                infos:"controlFilterInfos",
                filter:"controlFilter"
            },{
                infos:"docsFilterInfos",
                filter:"docsFilter"
            },{
                infos:"entretienCreatedFilterInfos",
                filter:"entretienCreatedFilter"
            }
        ],
        controlFilterInfos:{
            icon:"clipboard check",
            options:[
                {
                    key: 'timeall',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"green",
                    click:()=>{this.setControlFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'timesoon',
                    initial: false,
                    text: "Seuil d'alerte",
                    value: "soon",
                    color:"orange",
                    click:()=>{this.setControlFilter("soon")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'timelate',
                    initial: false,
                    text: 'Limite dépassée',
                    value: "over",
                    color:"red",
                    click:()=>{this.setControlFilter("over")},
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
                    text: 'Tous les entretiens',
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
        entretienCreatedFilterInfos:{
            icon:"calendar outline",            
            options:[
                {
                    key: 'calendar',
                    initial: true,
                    text: 'Tous les contrôles',
                    value: "all",
                    color:"green",
                    click:()=>{this.setEntretienCreatedFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'calendar outline',
                    initial: false,
                    text: 'Entretien créé',
                    value: "created",
                    color:"blue",
                    click:()=>{this.setEntretienCreatedFilter("created")},
                    label: { color: 'blue', empty: true, circular: true },
                },
                {
                    key: 'calendar outline',
                    initial: false,
                    text: 'Entretiens inexistant',
                    value: "notCreated",
                    color:"orange",
                    click:()=>{this.setEntretienCreatedFilter("notCreated")},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        vehiclesEquipedByControlsQuery : gql`
            query vehiclesEquipedByControls{
                vehiclesEquipedByControls{
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
                        entretienCreated
                        entretien{
                            _id
                        }
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
        buVehiclesEquipedByControlsQuery : gql`
            query buVehiclesEquipedByControls{
                buVehiclesEquipedByControls{
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
                        entretienCreated
                        entretien{
                            _id
                        }
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
        attachEquipementToVehicleQuery : gql`
            mutation attachEquipementToVehicle($vehicle:String!,$equipementDescription:String!,$attachementDate:String!,$lastControl:String!){
                attachEquipementToVehicle(vehicle:$vehicle,equipementDescription:$equipementDescription,attachementDate:$attachementDate,lastControl:$lastControl){
                    status
                    message
                }
            }
        `,
        vehiclesRaw:[],
        equipementDescriptionsRaw:[],
        vehicles : () => {
            if(this.state.vehiclesRaw.length == 0){
                return(
                    <Header>Aucun contrôle associé en base</Header>
                )
            }
            let displayed = JSON.parse(JSON.stringify((this.state.vehiclesRaw)));
            displayed = displayed.filter(v =>
                v.archived == false
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
            if(this.state.entretienCreatedFilter != "all"){
                if(this.state.entretienCreatedFilter == "created"){
                    displayed.forEach(c=>{
                        c.equipements = c.equipements.filter(e=>e.entretienCreated);
                    })
                }
                if(this.state.entretienCreatedFilter == "notCreated"){
                    displayed.forEach(c=>{
                        c.equipements = c.equipements.filter(e=>!e.entretienCreated);
                    })
                }
            }
            if(this.state.vehiclesFiler.length>0){
                displayed = displayed.filter(i =>
                    i.registration.toLowerCase().includes(this.state.vehiclesFiler.toLowerCase())
                );
                if(displayed.length == 0){
                    return(
                        <Header>Aucun véhicule ne correspond à ce filtre</Header>
                    )
                }
            }
            displayed.sort((a, b) => a.registration.localeCompare(b.registration))
            return displayed.map(i =>(
                <ControlRow hideSociete={this.props.userLimited} loadVehicles={this.loadVehicles} equipementDescriptionsRaw={this.state.equipementDescriptionsRaw} key={i._id} vehicle={i}/>
            ))
        },
        equipementDescriptions : () => {
            return this.state.equipementDescriptionsRaw.map(e => {return{text:e.name,key:e._id,value:e._id}})
        },
    }

    /*SHOW AND HIDE MODALS*/
    showAddControl = () => {
        this.setState({
            openAddControl:true
        })
    }
    closeAddControl = () => {
        this.setState({
            openAddControl:false
        })
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    /*CHANGE HANDLERS*/
    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
        });
    }
    handleFilter = e =>{
        this.setState({
        vehiclesFiler:e.target.value
        });
    }
    handleChangeVehicle = _id => {
        this.setState({ newControlVehicle:_id })
    }
    handleChangeEquipement = (e, { value }) => {
        if(this.state.equipementDescriptionsRaw.filter(x=>x._id == value)[0].controlPeriodUnit=="km"){
            this.setState({ newEquipement:value, hideLastControlKm:"",hideLastControlDate:"hide"})
        }else{
            this.setState({ newEquipement:value, hideLastControlDate:"",hideLastControlKm:"hide"})
        }
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    /*FILTERS HANDLERS*/
    setControlFilter = value => {
        this.setState({
            controlFilter:value
        })
    }
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }
    setEntretienCreatedFilter = value => {
        this.setState({
            entretienCreatedFilter:value
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
    addControl = () => {
        let newLastControl = "";
        if(this.state.equipementDescriptionsRaw.filter(x=>x._id == this.state.newEquipement)[0].controlPeriodUnit=="km"){
            newLastControl = this.state.newLastControlKm;
        }else{
            newLastControl = this.state.newLastControlDate;
        }
        this.props.client.mutate({
            mutation:this.state.attachEquipementToVehicleQuery,
            variables:{
                vehicle:this.state.newControlVehicle,
                equipementDescription:this.state.newEquipement,
                lastControl:newLastControl,
                attachementDate:this.state.newAttachementDate
            }
        }).then(({data})=>{
            this.closeAddControl();
            data.attachEquipementToVehicle.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicles();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    loadVehicles = () => {
        let vehiclesEquipedByControlsQuery = (this.props.userLimited ? this.state.buVehiclesEquipedByControlsQuery : this.state.vehiclesEquipedByControlsQuery);
        this.props.client.query({
            query:vehiclesEquipedByControlsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let vehiclesEquipedByControls = (this.props.userLimited ? data.buVehiclesEquipedByControls : data.vehiclesEquipedByControls);
            vehiclesEquipedByControls.map(v=>{
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
                vehiclesRaw:vehiclesEquipedByControls
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
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/
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
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
                    <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                        <Menu.Item color="blue" name='vehicules' onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                        <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                        <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                        <Menu.Item color="blue" name='locations' onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                    </Menu>
                    <Input style={{justifySelf:"stretch"}} onChange={this.handleFilter} icon='search' placeholder='Rechercher une immatriculation' />
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <BigButtonIcon icon="plus" color="blue" onClick={this.showAddControl} tooltip="Ajouter un contrôle obligatoire sur un véhicule"/>
                    </div>
                    <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}}>
                        <CustomFilter infos={this.state.controlFilterInfos} active={this.state.controlFilter} />
                        <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
                        <CustomFilter infos={this.state.entretienCreatedFilterInfos} active={this.state.entretienCreatedFilter} />
                    </CustomFilterSegment>
                    <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        {this.state.vehicles()}
                    </div>
                </div>
                <Modal closeOnDimmerClick={false} open={this.state.openAddControl} onClose={this.closeAddControl} closeIcon>
                    <Modal.Header>
                        Ajout d'un contrôle obligatoire
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                            <Form.Field>
                                <label>Véhicule concerné</label>
                                <VehiclePicker hideLocations userRestricted={this.props.userLimited} onChange={this.handleChangeVehicle}/>
                            </Form.Field>
                            <Form.Field><label>Contrôle</label><Dropdown placeholder='Choisir un contrôle' search selection onChange={this.handleChangeEquipement} options={this.state.equipementDescriptions()}/></Form.Field>
                            <Form.Field><label>Attaché le </label><input onChange={this.handleChange} value={this.state.newAttachementDate} onFocus={()=>{this.showDatePicker("newAttachementDate")}} placeholder="Date de rattachement"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlDate}><label>Dernier controle (date)</label><input onChange={this.handleChange} value={this.state.newLastControlDate} onFocus={()=>{this.showDatePicker("newLastControlDate")}} placeholder="Date du dernier contrôle"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlKm}><label>Kilométrage au dernier controle</label><input onChange={this.handleChange} value={this.state.newLastControlKm} name="newLastControlKm" placeholder="Kilométrage au dernier contrôle"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddControl}>Annuler</Button>
                        <Button color="blue" onClick={this.addControl}>Créer</Button>
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

export default wrappedInUserContext = withUserContext(Controls);