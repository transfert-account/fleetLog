import React, { Component, Fragment } from 'react';
import { Modal, Icon, Menu, Input, Dimmer, Loader, Table, Button, Form, Divider, Header } from 'semantic-ui-react';
import ModalDatePicker from '../atoms/ModalDatePicker';
import DropdownFilter from '../atoms/DropdownFilter';
import { UserContext } from '../../contexts/UserContext';
import VehiclesRow from '../molecules/VehiclesRow';
import SocietePicker from '../atoms/SocietePicker';
import RegistrationInput from '../atoms/RegistrationInput';
import PayementFormatPicker from '../atoms/PayementFormatPicker';
import PayementTimePicker from '../atoms/PayementTimePicker';
import VolumePicker from '../atoms/VolumePicker';
import ColorPicker from '../atoms/ColorPicker';
import ModelPicker from '../atoms/ModelPicker';
import BrandPicker from '../atoms/BrandPicker';
import EnergyPicker from '../atoms/EnergyPicker';
import OrganismPicker from '../atoms/OrganismPicker';
import { gql } from 'apollo-server-express';
import moment from 'moment';

class Vehicles extends Component {

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
        newEnergy:"",
        newInsurancePaid:"",
        newPayementBeginDate:"",
        newPurchasePrice:"",
        newPayementTime:"",
        newMonthlyPayement:"",
        newPayementOrg:"",
        newPayementFormat:"",
        archiveFilter:false,
        reportLateFilter:"all",
        docsFilter:"all",
        sharedFilter:false,
        openAddVehicle:false,
        openDatePicker:false,
        datePickerTarget:"",
        maxPage:1,
        currentPage:1,
        archiveFilterInfos:{
            icon:"archive",            
            options:[
                {
                    key: 'archivefalse',
                    text: 'Véhicules actuels',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    text: 'Véhicules archivés',
                    value: true,
                    color:"orange",
                    click:()=>{this.switchArchiveFilter(true)},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        sharedFilterInfos:{
            icon:"handshake",            
            options:[
                {
                    key: 'sharedfalse',
                    text: 'Tous les véhicules',
                    value: false,
                    color:"green",
                    click:()=>{this.setSharedFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'sharedtrue',
                    text: 'Véhicules en prêt',
                    value: true,
                    color:"teal",
                    click:()=>{this.setSharedFilter(true)},
                    label: { color: 'teal', empty: true, circular: true }
                }
            ]
        },
        reportLateFilterInfos:{
            icon:"dashboard",            
            options:[
                {
                    key: 'reportall',
                    text: 'Tous les véhicules',
                    value: "all",
                    color:"green",
                    click:()=>{this.setReportLateFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'report2w',
                    text: 'Relevé > 2 sem.',
                    value: "2w",
                    color:"orange",
                    click:()=>{this.setReportLateFilter("2w")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'report4w',
                    text: 'Relevé > 4 sem.',
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
                    text: 'Tous les véhicules',
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
        vehiclesFilter:"",
        vehiclesRaw:[],
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
                v.archived == this.state.archiveFilter
            );
            if(this.state.sharedFilter){
                displayed = displayed.filter(v => v.shared);
            }
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(v =>
                    v.societe._id == this.props.societeFilter || v.sharedTo._id == this.props.societeFilter
                );
            }
            displayed = displayed.filter(v =>{
                if(this.state.docsFilter == "all"){return true}else{
                    if(v.cg._id == "" || v.cv._id == ""){
                        return true
                    }else{
                        return false
                    }
                }}
            )
            displayed = displayed.filter(v =>{
                if(this.state.reportLateFilter == "all"){return true}else{
                    let days = parseInt(moment().diff(moment(v.lastKmUpdate, "DD/MM/YYYY"),'days'));
                    if(this.state.reportLateFilter == "2w"){
                        if(days >= 14){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        if(days >= 28){
                            return true
                        }else{
                            return false
                        }
                    }
                }
            });
            if(this.state.vehiclesFilter.length>0){
                displayed = displayed.filter(i =>
                    i.registration.toLowerCase().includes(this.state.vehiclesFilter.toLowerCase()) ||
                    i.brand.name.toLowerCase().includes(this.state.vehiclesFilter.toLowerCase()) ||
                    i.model.name.toLowerCase().includes(this.state.vehiclesFilter.toLowerCase())
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
            //displayed = displayed.slice((this.state.currentPage - 1) * this.state.rowByPage, this.state.currentPage * this.state.rowByPage);
            return displayed.map(i =>(
                <VehiclesRow loadVehicles={this.loadVehicles} societesRaw={this.state.societesRaw} key={i._id} vehicle={i}/>
            ))
        },
        addVehicleQuery : gql`
            mutation addVehicle($societe:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$insurancePaid:Float!,$payementTime:String!,$payementBeginDate:String!,$purchasePrice:Float,$monthlyPayement:Float,$payementOrg:String,$payementFormat:String,$energy:String!){
                addVehicle(societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,payementTime:$payementTime,payementBeginDate:$payementBeginDate,purchasePrice:$purchasePrice,monthlyPayement:$monthlyPayement,payementOrg:$payementOrg,payementFormat:$payementFormat,energy:$energy){
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
                        name
                    }
                    registration
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
                    energy{
                        _id
                        name
                    }
                    cg{
                        _id
                    }
                    cv{
                        _id
                    }
                    payementBeginDate
                    property
                    purchasePrice
                    monthlyPayement
                    payementTime{
                        _id
                    }
                    payementFormat
                    archived
                    shared
                    sharedTo{
                        _id
                        name
                    }
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
                    energy:this.state.newEnergy,
                    payload:parseFloat(this.state.newPayload),
                    color:this.state.newColor,
                    insurancePaid:parseFloat(this.state.newInsurancePaid),
                    payementBeginDate:this.state.newPayementBeginDate,
                    payementTime:this.state.newPayementTime,
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
            vehiclesFilter:e.target.value
        });
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

    handleChangePayementFormat = value => {
        this.setState({ newPayementFormat:value })
    }

    handleRegistrationChange = value => {
        this.setState({
            newRegistration : value
        })
    }

    handleChangePayementTime = (e, obj) => {
        let newMonthlyPayement = this.state.newPurchasePrice / parseInt(obj.options.filter(o=>o.key == obj.value)[0].text.split(" ")[0]);
        this.setState({
            newPayementTime:obj.value,
            newMonthlyPayement:newMonthlyPayement.toFixed(2)
        })
    }

    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })

    handleChangeBrand = (e, { value }) => this.setState({ newBrand:value })

    handleChangeModel = (e, { value }) => this.setState({ newModel:value })

    handleChangeEnergy = (e, { value }) => this.setState({ newEnergy:value })

    handleChangeOrganism = (e, { value }) => this.setState({ newPayementOrg:value })

    handleChangeColor = (e, { value }) => this.setState({ newColor:value })

    loadVehicles = () => {
        this.props.client.query({
            query:this.state.vehiclesQuery,
            variables:{
                archive:this.state.archiveFilter
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                vehiclesRaw:data.vehicles,
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
                newEnergy:"",
                newInsurancePaid:"",
                newPayementBeginDate:"",
                newPurchasePrice:"",
                newMonthlyPayement:"",
                newPayementOrg:"",
                newPayementFormat:""
            })
        })
    }

    getAddVehicleDisabled = () => {
        if(this.state.newSociete == "" || this.state.newRegistration == "" || this.state.newFirstRegistrationDate == "" || this.state.newKm == "" || this.state.newLastKmUpdate == "" || this.state.newBrand == "" || this.state.newModel == "" || this.state.newVolume == "" || this.state.newPayload == 0 || this.state.newColor == "" || this.state.newEnergy == "" || this.state.newInsurancePaid == "" || this.state.newPayementBeginDate == "" || this.state.newPurchasePrice == "" || this.state.newMonthlyPayement == "" || this.state.newPayementOrg == "" || this.state.newPayementFormat == ""){
            return true;
        }else{
            return false;
        }
    }

    //ARCHIVE FILTER
    switchArchiveFilter = v => {
        this.setState({
            archiveFilter:v
        })
        this.loadVehicles();
    }

    //REPORT LATE FILTER
    setReportLateFilter = value => {
        this.setState({
            reportLateFilter:value
        })
    }

    //MISSING DOCS FILTER
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }

    //SHARED FILTER
    setSharedFilter = value => {
        this.setState({
            sharedFilter:value
        })
    }

    componentDidMount = () => {
        this.loadVehicles();
    }

    render() {
        return (
            <Fragment>
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
                    <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                        <Menu.Item color="blue" name='vehicules' active onClick={()=>{this.props.history.push("/parc/vehicles")}}><Icon name='truck'/>Vehicules</Menu.Item>
                        <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/parc/controls")}}><Icon name='clipboard check'/>Contrôles</Menu.Item>
                        <Menu.Item color="blue" name='licences' onClick={()=>{this.props.history.push("/parc/licences")}}><Icon name='drivers license'/>Licences</Menu.Item>
                        <Menu.Item color="blue" name='locations' onClick={()=>{this.props.history.push("/parc/locations")}} ><Icon name="calendar alternate outline"/> Locations</Menu.Item>
                    </Menu>
                    <Input style={{justifySelf:"stretch"}} name="vehiclesFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher une immatriculation, une marque ou un modèle' />
                    <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddVehicle} icon labelPosition='right'>Ajouter un véhicule<Icon name='plus'/></Button>
                    <div style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                        <DropdownFilter infos={this.state.archiveFilterInfos} active={this.state.archiveFilter} />
                        <DropdownFilter infos={this.state.sharedFilterInfos} active={this.state.sharedFilter} />
                        <DropdownFilter infos={this.state.reportLateFilterInfos} active={this.state.reportLateFilter} />
                        <DropdownFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
                    </div>
                    <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        <Table style={{marginBottom:"0"}} celled selectable compact>
                            <Table.Header>
                                <Table.Row textAlign='center'>
                                    <Table.HeaderCell>Societe</Table.HeaderCell>
                                    <Table.HeaderCell>Immatriculation</Table.HeaderCell>
                                    <Table.HeaderCell>Date d'immatriculation</Table.HeaderCell>
                                    <Table.HeaderCell>Energie</Table.HeaderCell>
                                    <Table.HeaderCell>Kilométrage</Table.HeaderCell>
                                    <Table.HeaderCell>Dernier relevé</Table.HeaderCell>
                                    <Table.HeaderCell>Marque</Table.HeaderCell>
                                    <Table.HeaderCell>Modèle</Table.HeaderCell>
                                    <Table.HeaderCell>Volume</Table.HeaderCell>
                                    <Table.HeaderCell>Charge utile</Table.HeaderCell>
                                    <Table.HeaderCell>Propriété</Table.HeaderCell>
                                    <Table.HeaderCell>Documents</Table.HeaderCell>
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
                            <Form.Field ><label>Societe</label>
                                <SocietePicker error={this.state.newSociete == ""} restrictToVisibility groupAppears={false} onChange={this.handleChangeSociete}/>
                            </Form.Field>
                            <RegistrationInput error={this.state.newRegistration == ""} onChange={this.handleRegistrationChange} name="newRegistration"/>
                            <Form.Field error={this.state.newFirstRegistrationDate == ""}><label>Date de première immatriculation</label><input onChange={this.handleChange} value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} placeholder="Première immatriculation" name="newFirstRegistrationDate"/></Form.Field>
                            <Divider style={{gridColumnEnd:"span 3",height:"23px"}} horizontal>
                                <Header as='h4'>
                                    <Icon name='clipboard' />
                                    Details
                                </Header>
                            </Divider>
                            <Form.Field error={this.state.newKm == ""}><label>Kilométrage</label><input onChange={this.handleChange} name="newKm"/></Form.Field>
                            <Form.Field error={this.state.newLastKmUpdate == ""}><label>Date de relevé</label><input onChange={this.handleChange} value={this.state.newLastKmUpdate} onFocus={()=>{this.showDatePicker("newLastKmUpdate")}} name="newLastKmUpdate"/></Form.Field>
                            <Form.Field><label>Marque</label>
                                <BrandPicker error={this.state.newBrand == ""} onChange={this.handleChangeBrand}/>
                            </Form.Field>
                            <Form.Field><label>Modèle</label>
                                <ModelPicker error={this.state.newModel == ""} onChange={this.handleChangeModel}/>
                            </Form.Field>
                            <Form.Field><label>Energie</label>
                                <EnergyPicker error={this.state.newEnergy == ""} onChange={this.handleChangeEnergy}/>
                            </Form.Field>
                            <Form.Field><label>Volume</label>
                                <VolumePicker error={this.state.newVolume == ""} onChange={this.handleChangeVolume}/>
                            </Form.Field>
                            <Form.Field error={this.state.newPayload == 0}><label>Charge utile</label><input onChange={this.handleChange} name="newPayload"/></Form.Field>
                            <Form.Field><label>Couleur</label>
                                <ColorPicker error={this.state.newColor == ""} onChange={this.handleChangeColor}/>
                            </Form.Field>
                            <Divider style={{gridColumnEnd:"span 3",height:"23px"}} horizontal>
                                <Header as='h4'>
                                    <Icon name='euro' />
                                    Finances
                                </Header>
                            </Divider>
                            <Form.Field error={this.state.newPurchasePrice == ""}><label>Prix à l'achat</label><input onChange={this.handleChange} name="newPurchasePrice"/></Form.Field>
                            <Form.Field><label>Durée de financement</label>
                                <PayementTimePicker error={this.state.newPayementTime == ""} onChange={this.handleChangePayementTime}/>
                            </Form.Field>
                            <Form.Field><label>Organisme de financement</label>
                                <OrganismPicker error={this.state.newPayementOrg == ""} onChange={this.handleChangeOrganism}/>
                            </Form.Field>
                            <Form.Field error={this.state.newInsurancePaid == ""}><label>Montant de l'assurance</label><input onChange={this.handleChange} name="newInsurancePaid"/></Form.Field>
                            <Form.Field style={{gridColumnStart:"2"}}><label>Type de financement</label>
                                <PayementFormatPicker error={this.state.newPayementFormat == ""} change={this.handleChangePayementFormat}/>
                            </Form.Field>
                            <Form.Field error={this.state.newPayementBeginDate == ""}><label>Date de début du payement</label><input onChange={this.handleChange} value={this.state.newPayementBeginDate} onFocus={()=>{this.showDatePicker("newPayementBeginDate")}} name="newPayementBeginDate"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddVehicle}>Annuler</Button>
                        <Button color="blue" disabled={this.getAddVehicleDisabled()} onClick={this.addVehicle}>Créer</Button>
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