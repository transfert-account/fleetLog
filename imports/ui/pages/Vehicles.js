import React, { Component, Fragment } from 'react';
import { Modal, Icon, Menu, Input, Dimmer, Loader, Table, Button, Form, Message, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import VehiclesRow from '../molecules/VehiclesRow';
import CustomFilterSegment from '../molecules/CustomFilterSegment';

import BigButtonIcon from '../elements/BigIconButton';

import ModalDatePicker from '../atoms/ModalDatePicker';
import CustomFilter from '../atoms/CustomFilter';
import SocietePicker from '../atoms/SocietePicker';
import RegistrationInput from '../atoms/RegistrationInput';
import VolumePicker from '../atoms/VolumePicker';
import ColorPicker from '../atoms/ColorPicker';
import ModelPicker from '../atoms/ModelPicker';
import BrandPicker from '../atoms/BrandPicker';
import EnergyPicker from '../atoms/EnergyPicker';

import { gql } from 'apollo-server-express';
import moment from 'moment';

export class Vehicles extends Component {

    state={
        loading:true,
        fullLoaded:false,
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
        financeFilter:"all",
        sharedFilter:false,
        openAddVehicle:false,
        openReadMassKmUpdate:false,
        openDatePicker:false,
        datePickerTarget:"",
        massKmUpdateFile:"",
        idReportVehicles:[],
        filters:[
            {
                infos:"financeFilterInfos",
                filter:"financeFilter"
            },{
                infos:"archiveFilterInfos",
                filter:"archiveFilter"
            },{
                infos:"sharedFilterInfos",
                filter:"sharedFilter"
            },{
                infos:"reportLateFilterInfos",
                filter:"reportLateFilter"
            },{
                infos:"docsFilterInfos",
                filter:"docsFilter"
            }
        ],
        financeFilterInfos:{
            icon:"euro",            
            options:[
                {
                    key: 'financeall',
                    initial: true,
                    text: 'Tous les véhicules',
                    value: "all",
                    color:"green",
                    click:()=>{this.setFinanceFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'financemissing',
                    initial: false,
                    text: 'Infos de financement manquantes',
                    value: "missing",
                    color:"red",
                    click:()=>{this.setFinanceFilter("missing")},
                    label: { color: 'red', empty: true, circular: true },
                },
                {
                    key: 'financecomplete',
                    initial: false,
                    text: 'Infos de financement complètes',
                    value: "complete",
                    color:"blue",
                    click:()=>{this.setFinanceFilter("complete")},
                    label: { color: 'blue', empty: true, circular: true },
                }
            ]
        },
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
        sharedFilterInfos:{
            icon:"handshake",            
            options:[
                {
                    key: 'sharedfalse',
                    initial: true,
                    text: 'Tous les véhicules',
                    value: false,
                    color:"green",
                    click:()=>{this.setSharedFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'sharedtrue',
                    initial: false,
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
                    text: 'Relevé > 2 sem.',
                    value: "2w",
                    color:"orange",
                    click:()=>{this.setReportLateFilter("2w")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'report4w',
                    initial: false,
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
        vehiclesFilter:"",
        vehiclesRaw:[],
        vehicles : () => {
            if(!this.state.loading){
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
                displayed = displayed.filter(v =>{
                    if(this.state.financeFilter != "all"){
                        if(this.state.financeFilter == "missing"){
                            return !v.financialInfosComplete
                        }
                        if(this.state.financeFilter == "complete"){
                            return v.financialInfosComplete
                        }
                    }else{
                        return true;
                    }
                });
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
                if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                    displayed = displayed.filter(v =>
                        v.societe._id == this.props.societeFilter || v.sharedTo._id == this.props.societeFilter
                    );
                }
                displayed.sort((a, b) => a.registration.localeCompare(b.registration))
                return displayed.map(i =>(
                    <VehiclesRow loadVehicles={this.loadVehicles} hideSociete={this.props.userLimited} societesRaw={this.state.societesRaw} key={i._id} vehicle={i}/>
                ))
            }
        },
        addVehicleQuery : gql`
            mutation addVehicle($societe:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$energy:String!){
                addVehicle(societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,energy:$energy){
                    status
                    message
                }
            }
        `,
        vehiclesQuery : gql`
            query vehicles($full:Boolean!){
                vehicles(full:$full){
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
                    financialInfosComplete
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
                    selling
                    broken
                }
            }
        `,
        buVehiclesQuery : gql`
            query buVehicles($full:Boolean!){
                buVehicles(full:$full){
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
                    energy{
                        _id
                        name
                    }
                    insurancePaid
                    financialInfosComplete
                    payementBeginDate
                    property
                    purchasePrice
                    monthlyPayement
                    payementOrg{
                        _id
                        name
                    }
                    payementFormat
                    archived
                    archiveReason
                    archiveDate
                    cg{
                        _id
                    }
                    cv{
                        _id
                    }
                    shared
                    sharedTo{
                        _id
                        name
                    }
                    selling
                    broken
                }
            }
        `,
        massKmUpdateVehiclesValidationQuery : gql`
            query massKmUpdateVehiclesValidation($jsonFromExcelFile:String!){
                massKmUpdateVehiclesValidation(jsonFromExcelFile:$jsonFromExcelFile){
                    nbTotal
                    nbFound
                    message
                    vehicles{
                        IMMAT
                        KMS
                        found
                        vehicle{
                            _id
                            registration
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
                            energy{
                                _id
                                name
                            }
                        }
                    }
                }
            }
        `,
        applyMassKmUpdateQuery : gql`
            mutation applyMassKmUpdate($massKmUpdateMap:String!){
                applyMassKmUpdate(massKmUpdateMap:$massKmUpdateMap){
                    status
                    message
                }
            }
        `
    }

    /*SHOW AND HIDE MODALS*/
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
    showMassKmUpdate = () => {
        this.setState({
            openReadMassKmUpdate:true
        })
    }
    closeReadMassKmUpdate = () => {
        this.setState({
            openReadMassKmUpdate:false,
            massKmUpdate:""
        })
    }
    showMassKmUpdateIdentityReport = () => {
        this.setState({
            openMassKmUpdateIdentityReport:true
        })
    }
    closeMassKmUpdateIdentityReport = () => {
        this.setState({
            openMassKmUpdateIdentityReport:false
        })
    }

    /*CHANGE HANDLERS*/
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
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })
    handleChangeBrand = (e, { value }) => this.setState({ newBrand:value })
    handleChangeModel = (e, { value }) => this.setState({ newModel:value })
    handleChangeEnergy = (e, { value }) => this.setState({ newEnergy:value })
    handleChangeOrganism = (e, { value }) => this.setState({ newPayementOrg:value })
    handleChangeColor = (e, { value }) => this.setState({ newColor:value })
    handleMassKmUpdateInputFile = e => {
        if(e.target.validity.valid ){
            this.setState({
                massKmUpdateFile:e.target.files[0]
            })
        }
    }
    
    /*FILTERS HANDLERS*/
    switchArchiveFilter = v => {
        this.setState({
            archiveFilter:v
        })
        this.loadVehicles();
    }
    setFinanceFilter = v => {
        this.setState({
            financeFilter:v
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
    setSharedFilter = value => {
        this.setState({
            sharedFilter:value
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
                    color:this.state.newColor
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
    readMassKmUpdateFile = () => {
        let reader = new FileReader();
        reader.onload = e => {
            let wb = XLSX.read(e.target.result,{type:'binary'});
            this.requireVehiclesIdentification(JSON.stringify(XLSX.utils.sheet_to_row_object_array(wb.Sheets[wb.SheetNames[0]])));
        }
        reader.readAsBinaryString(this.state.massKmUpdateFile)
    }
    requireVehiclesIdentification = kms => {
        this.closeReadMassKmUpdate();
        this.setState({
            massKmsJsonValues:kms
        })
        this.showMassKmUpdateIdentityReport();
        this.props.client.query({
            query:this.state.massKmUpdateVehiclesValidationQuery,
            variables:{
                jsonFromExcelFile:kms
            }
        }).then(({data})=>{
            this.setState({
                idReportNbTotal:data.massKmUpdateVehiclesValidation.nbTotal,
                idReportNbFound:data.massKmUpdateVehiclesValidation.nbFound,
                idReportVehicles:data.massKmUpdateVehiclesValidation.vehicles
            })
            this.props.toast({
                message:data.massKmUpdateVehiclesValidation.message,
                type:(data.massKmUpdateVehiclesValidation.nbTotal == data.massKmUpdateVehiclesValidation.nbFound ? "success":"warning")
            });
        })
    }
    applyMassKmUpdate = () => {
        let massKmUpdateMap = this.state.idReportVehicles.filter(v=>v.found).map(v=>{return({_id:v.vehicle._id,km:v.KMS,registration:v.vehicle.registration})});
        this.props.client.mutate({
            mutation:this.state.applyMassKmUpdateQuery,
            variables:{
                massKmUpdateMap:JSON.stringify(massKmUpdateMap)
            }
        }).then(({data})=>{
            data.applyMassKmUpdate.map(qrm=>{
                if(qrm.status){
                    this.closeMassKmUpdateIdentityReport();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicles();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    loadVehicles = () => {
        let vehiculesQuery = (this.props.userLimited ? this.state.buVehiclesQuery : this.state.vehiclesQuery);
        this.props.client.query({
            query: vehiculesQuery,
            variables:{
                full:false
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let vehicles = (this.props.userLimited ? data.buVehicles : data.vehicles);
            this.setState({
                loading:false,
                vehiclesRaw:vehicles,
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
            });
            this.loadVehiclesFull();
        })
    }
    loadVehiclesFull = () => {
        let vehiculesQuery = (this.props.userLimited ? this.state.buVehiclesQuery : this.state.vehiclesQuery);
        this.props.client.query({
            query: vehiculesQuery,
            variables:{
                full:true
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let vehicles = (this.props.userLimited ? data.buVehicles : data.vehicles);
            this.setState({
                fullLoaded:true,
                vehiclesRaw:vehicles,
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

    /*CONTENT GETTERS*/
    getAddVehicleDisabled = () => {
        if(this.state.newSociete == "" ||
            this.state.newRegistration == "" ||
            this.state.newFirstRegistrationDate == "" ||
            this.state.newKm == "" ||
            this.state.newLastKmUpdate == "" ||
            this.state.newBrand == "" ||
            this.state.newModel == "" ||
            this.state.newVolume == "" ||
            this.state.newPayload == 0 ||
            this.state.newColor == "" ||
            this.state.newEnergy == ""
        ){
            return true;
        }else{
            return false;
        }
    }
    getFileInfosMessage = () => {
        if(this.state.massKmUpdateFile != ""){
            return (
                <Message color="blue" style={{placeSelf:"stretch",margin:"0",display:"grid",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto auto auto 1fr"}}>
                    <p className="gridLabel">Nom du fichier :</p>
                    <p className="gridValue">{this.state.massKmUpdateFile.name}</p>
                    <p className="gridLabel">Taille du fichier:</p>
                    <p className="gridValue">{parseFloat(this.state.massKmUpdateFile.size/1048576).toFixed(2)} Mo</p>
                </Message>
            )
        }else{
            return (
                <Message style={{placeSelf:"stretch",margin:"0",display:"grid",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto auto auto 1fr"}}>
                    <p className="gridLabel">Nom du fichier :</p>
                    <p className="gridValue">Aucun fichier</p>
                    <p className="gridLabel">Taille du fichier:</p>
                    <p className="gridValue">0 Mo</p>
                </Message>
            )
        }
    }
    getLastReportCell = vehicle => {
        let days = parseInt(moment().diff(moment(vehicle.lastKmUpdate, "DD/MM/YYYY"),'days'));
        if(days < 14){
            return (
                <Label color={"green"}> 
                    {moment(vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                </Label>
            )
        }
        if(days >= 28){
            return (
                <Label color={"red"}> 
                    {moment(vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                </Label>
            )
        }
        if(days >= 14){
            return (
                <Label color={"orange"}> 
                    {moment(vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                </Label>
            )
        }
    }
    getTableHeader = () => {
        if(this.props.userLimited){
            return(
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Spécificité</Table.HeaderCell>
                        <Table.HeaderCell>Immatriculation</Table.HeaderCell>
                        <Table.HeaderCell>Kilométrage</Table.HeaderCell>
                        <Table.HeaderCell>Dernier relevé</Table.HeaderCell>
                        <Table.HeaderCell>Marque, Modèle & Energie</Table.HeaderCell>
                        <Table.HeaderCell>Volume</Table.HeaderCell>
                        <Table.HeaderCell>Charge utile</Table.HeaderCell>
                        <Table.HeaderCell>Infos financement</Table.HeaderCell>
                        <Table.HeaderCell>Propriété</Table.HeaderCell>
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
                        <Table.HeaderCell>Spécificité</Table.HeaderCell>
                        <Table.HeaderCell>Immatriculation</Table.HeaderCell>
                        <Table.HeaderCell>Kilométrage</Table.HeaderCell>
                        <Table.HeaderCell>Dernier relevé</Table.HeaderCell>
                        <Table.HeaderCell>Marque, Modèle & Energie</Table.HeaderCell>
                        <Table.HeaderCell>Volume</Table.HeaderCell>
                        <Table.HeaderCell>Charge utile</Table.HeaderCell>
                        <Table.HeaderCell>Infos financement</Table.HeaderCell>
                        <Table.HeaderCell>Propriété</Table.HeaderCell>
                        <Table.HeaderCell>Documents</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>    
                    </Table.Row>
                </Table.Header>
            )
        }
    }

    /*COMPONENTS LIFECYCLE*/
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
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <BigButtonIcon icon="dashboard" color="green" onClick={this.showMassKmUpdate} tooltip="Mise à jour de masse des compteurs"/>
                        <BigButtonIcon icon="plus" color="blue" onClick={this.showAddVehicle} tooltip="Ajouter un véhicule"/>
                    </div>
                    <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}} fullLoaded={this.state.fullLoaded} entryLoaded={this.state.vehiclesRaw.length} entryLoadedText={"véhicules"}>
                        <CustomFilter infos={this.state.archiveFilterInfos} active={this.state.archiveFilter} />
                        <CustomFilter infos={this.state.financeFilterInfos} active={this.state.financeFilter} />
                        <CustomFilter infos={this.state.sharedFilterInfos} active={this.state.sharedFilter} />
                        <CustomFilter infos={this.state.reportLateFilterInfos} active={this.state.reportLateFilter} />
                        <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
                    </CustomFilterSegment>
                    <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        <Table style={{marginBottom:"0"}} celled selectable compact>
                            {this.getTableHeader()}
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
                        <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                            <Form.Field style={{gridColumnEnd:"span 2"}}><label>Societe</label>
                                <SocietePicker error={this.state.newSociete == ""} restrictToVisibility groupAppears={false} onChange={this.handleChangeSociete}/>
                            </Form.Field>
                            <RegistrationInput error={this.state.newRegistration == ""} onChange={this.handleRegistrationChange} name="newRegistration"/>
                            <Form.Field error={this.state.newFirstRegistrationDate == ""}><label>Date de première immatriculation</label>
                                <input onChange={this.handleChange} value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} placeholder="Première immatriculation" name="newFirstRegistrationDate"/>
                            </Form.Field>
                            <Form.Field error={this.state.newKm == ""}><label>Kilométrage</label>
                                <input onChange={this.handleChange} name="newKm"/>
                            </Form.Field>
                            <Form.Field error={this.state.newLastKmUpdate == ""}><label>Date de relevé</label>
                                <input onChange={this.handleChange} value={this.state.newLastKmUpdate} onFocus={()=>{this.showDatePicker("newLastKmUpdate")}} name="newLastKmUpdate"/>
                            </Form.Field>
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
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddVehicle}>Annuler</Button>
                        <Button color="blue" disabled={this.getAddVehicleDisabled()} onClick={this.addVehicle}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size="large" closeOnDimmerClick={false} open={this.state.openReadMassKmUpdate} onClose={this.closeReadMassKmUpdate} closeIcon>
                    <Modal.Header>
                        Mise à jour de masse des compteurs kilomètriques : importation du fichier (1/2)
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridGap:"16px"}}>
                            <Input onChange={e=>this.handleMassKmUpdateInputFile(e)} type='file'/>
                            {this.getFileInfosMessage()}
                            <Table compact="very" celled>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>IMMAT</Table.HeaderCell>
                                        <Table.HeaderCell>KMS</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell>TE-123-ST</Table.Cell>
                                        <Table.Cell>52325</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>TE-234-ST</Table.Cell>
                                        <Table.Cell>21240</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>TE-456-ST</Table.Cell>
                                        <Table.Cell>74864</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>TE-567-ST</Table.Cell>
                                        <Table.Cell>13054</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>TE-678-ST</Table.Cell>
                                        <Table.Cell>78690</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>...</Table.Cell>
                                        <Table.Cell>...</Table.Cell>
                                    </Table.Row>
                                    <Table.Row>
                                        <Table.Cell>...</Table.Cell>
                                        <Table.Cell>...</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                            <Message color="orange"
                                header="Structure du fichier"
                                list={[
                                    "Le respect de la structure du fichier excel est indispensable pour sa lecture. Cette structure est décrite sur l'exemple ci-contre.",
                                    "Les relevés kilomètriques doivent se trouver dans les colonnes A et B de la première feuille de calcul du fichier.",
                                    "La feuille de calcul ne doit contenir aucune autre données que les relevés kilométriques.",
                                    "La ligne 1 du fichier est résérvée aux entêtes des colonnes.",
                                    "Les relevés commence à la ligne 2.",
                                    "La colonne A est révérvée aux immatriculation, son entête est ''IMMAT''.",
                                    "La colonne B est révérvée aux valeurs des relevés, son entête est ''KMS'', la valeur est un chiffre entier.",
                                    "Le format de l'immatriculation du véhicule doit être le même qu'affiché dans l'interface : XX-123-YY."
                            ]}/>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeReadMassKmUpdate}>Annuler</Button>
                        <Button color="blue" disabled={this.state.massKmUpdateFile == ""} onClick={this.readMassKmUpdateFile}>Traiter le fichier</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size="large" closeOnDimmerClick={false} open={this.state.openMassKmUpdateIdentityReport} onClose={this.closeMassKmUpdateIdentityReport} closeIcon>
                    <Modal.Header>
                        Mise à jour de masse des compteurs kilomètriques : validation des données (2/2)
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Table compact="very" celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center">#</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Immatriculation</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Véhicule</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center" colSpan="2">Précedent relevé</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center" colSpan="2">Nouveau relevé</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.idReportVehicles.map((v,i)=>{
                                    if(v.found){
                                        return(
                                            <Table.Row key={"massUpdate"+v.IMMAT}>
                                                <Table.Cell textAlign="center"><Button>#{i+1}</Button></Table.Cell>
                                                <Table.Cell textAlign="center">{v.IMMAT}</Table.Cell>
                                                <Table.Cell>{v.vehicle.brand.name + " - " + v.vehicle.model.name + " (" + v.vehicle.energy.name + ")"}</Table.Cell>
                                                <Table.Cell textAlign="center">{this.getLastReportCell(v.vehicle)}</Table.Cell>
                                                <Table.Cell>{v.vehicle.km} Km</Table.Cell>
                                                <Table.Cell textAlign="center">
                                                    <Label color={(v.KMS - v.vehicle.km > 0 ? "green" : "grey")}> 
                                                        + {v.KMS - v.vehicle.km} Km
                                                    </Label>
                                                </Table.Cell>
                                                <Table.Cell>{v.KMS} Km</Table.Cell>
                                            </Table.Row>
                                        )
                                    }else{
                                        return(
                                            <Table.Row>
                                                <Table.Cell textAlign="center"><Button color='red'>#{i+1}</Button></Table.Cell>
                                                <Table.Cell textAlign="center">{v.IMMAT}</Table.Cell>
                                                <Table.Cell colSpan="5" textAlign='center'>
                                                    <Icon color='red' name='cancel' size='large'/>
                                                    Immatriculation non reconnue
                                                    <Icon color='red' name='cancel' size='large'/>
                                                </Table.Cell>
                                            </Table.Row>
                                        )
                                    }
                                })}
                            </Table.Body>
                        </Table>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeMassKmUpdateIdentityReport}>Annuler</Button>
                        <Button color="blue" onClick={this.applyMassKmUpdate}>Confirmer la mise à jour des compteurs</Button>
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