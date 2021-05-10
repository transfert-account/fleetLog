import React, { Component } from 'react';
import { Icon, Menu, Input, Button, Table, Modal, Form, Loader, Message } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import LicenceRow from '../molecules/LicenceRow';
import CustomFilterSegment from '../molecules/CustomFilterSegment';
import ParcMenu from '../molecules/ParcMenu';

import BigButtonIcon from '../elements/BigIconButton';

import CustomFilter from '../atoms/CustomFilter';

import SocietePicker from '../atoms/SocietePicker';
import VehiclePicker from '../atoms/VehiclePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';

import { gql } from 'apollo-server-express';
import moment from 'moment';

export class Licences extends Component {

    state={
        loading:true,
        licenceFilter:"",
        endDateFilter:"all",
        freeLicenceFilter:"all",
        docsFilter:"all",
        openAddLicence:false,
        newSociete:"",
        newNumber:"",
        newEndDate:"",
        newVehicle:"",
        filters:[
            {
                infos:"endDateInfos",
                filter:"endDateFilter"
            },{
                infos:"freeLicenceFilterInfos",
                filter:"freeLicenceFilter"
            },{
                infos:"docsFilterInfos",
                filter:"docsFilter"
            }
        ],
        endDateInfos:{
            icon:"calendar check",            
            options:[
                {
                    key: 'enddateall',
                    initial: true,
                    text: 'Toutes les licences',
                    value: "all",
                    color:"green",
                    click:()=>{this.setEndDateFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'enddatesoon',
                    initial: false,
                    text: 'En fin de validité',
                    value: "soon",
                    color:"orange",
                    click:()=>{this.setEndDateFilter("soon")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'enddateover',
                    initial: false,
                    text: 'Périmée',
                    value: "over",
                    color:"red",
                    click:()=>{this.setEndDateFilter("over")},
                    label: { color: 'red', empty: true, circular: true },
                }
            ]
        },
        freeLicenceFilterInfos:{
            icon:"drivers license",
            options:[
                {
                    key: 'freetrue',
                    initial: true,
                    text: 'Toutes les licences',
                    value: "all",
                    color:"green",
                    click:()=>{this.setFreeLicenceFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'freefalse',
                    initial: false,
                    text: 'Licence sans vehicule',
                    value: "free",
                    color:"orange",
                    click:()=>{this.setFreeLicenceFilter("free")},
                    label: { color: 'orange', empty: true, circular: true }
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
        societesRaw: [],
        licencesRaw : [],
        licences : () => {
            let displayed = Array.from(this.state.licencesRaw);
            if(this.state.endDateFilter != "all"){
                displayed = displayed.filter(l=>{
                    let daysLeft = parseInt(moment(l.endDate,"DD/MM/YYYY").diff(moment(),'days', true))
                    if(this.state.endDateFilter == "soon"){
                        if(daysLeft <= 28){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        if(daysLeft <= 0){
                            return true
                        }else{
                            return false
                        }
                    }
                });
            }
            if(this.state.freeLicenceFilter != "all"){
                displayed = displayed.filter(l=>{
                    if(l.vehicle._id == null){
                        return true
                    }else{
                        return false
                    }
                });
            }
            displayed = displayed.filter(l =>{
                if(this.state.docsFilter == "all"){return true}else{
                    if(l.licence._id == "" || l.licence._id == ""){
                        return true
                    }else{
                        return false
                    }
                }}
            )
            if(this.state.licenceFilter.length>0){
                displayed = displayed.filter(l =>
                    l.shiftName.toLowerCase().includes(this.state.licenceFilter.toLowerCase()) ||
                    l.vehicle.registration.toLowerCase().includes(this.state.licenceFilter.toLowerCase()) ||
                    l.number.toLowerCase().includes(this.state.licenceFilter.toLowerCase()) 
                );
                if(displayed.length == 0){
                    return(
                        <Table.Row key={"none"}>
                            <Table.Cell width={16} colSpan='14' textAlign="center">
                            <p>Aucune licence ne correspond à ce filtre</p>
                            </Table.Cell>
                        </Table.Row>
                    )
                }
            }
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(l =>
                    l.societe._id == this.props.societeFilter
                );
            }
            return displayed.map(l =>(
                <LicenceRow userLimited={this.props.userLimited} hideSociete={this.props.userLimited} loadLicences={this.loadLicences} societesRaw={this.state.societesRaw} key={l._id} licence={l}/>
            ))
        },
        addLicenceQuery : gql`
            mutation addLicence($societe:String!,$number:String!,$vehicle:String,$endDate:String!){
                addLicence(societe:$societe,number:$number,vehicle:$vehicle,endDate:$endDate){
                    status
                    message
                }
            }
        `,
        licencesQuery : gql`
            query licences{
                licences{
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    number
                    shiftName
                    endDate
                    licence{
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
                    vehicle{
                        _id
                        registration
                        km
                        volume{
                            _id
                            meterCube
                        }
                        payload
                    }
                }
            }
        `,
        buLicencesQuery : gql`
            query buLicences{
                buLicences{
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    number
                    shiftName
                    endDate
                    licence{
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
                    vehicle{
                    _id
                    registration
                    km
                    volume{
                        _id
                        meterCube
                    }
                    payload
                    }
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
    /*SHOW AND HIDE MODALS*/
    showAddLicence = () => {
        this.setState({
            openAddLicence:true
        })
    }
    closeAddLicence = () => {
        this.setState({
            newVehicle:"",
            openAddLicence:false
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
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    handleFilter = e => {
        this.setState({
            licenceFilter : e.target.value
        })
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    /*FILTERS HANDLERS*/
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }
    setEndDateFilter = value => {
        this.setState({
            endDateFilter:value
        })
    }
    setFreeLicenceFilter = value => {
        this.setState({
            freeLicenceFilter:value
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
    loadLicences = () => {
        let licencesQuery = (this.props.userLimited ? this.state.buLicencesQuery : this.state.licencesQuery);
        this.props.client.query({
            query:licencesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let licences = (this.props.userLimited ? data.buLicences : data.licences);
            this.setState({
                loading:false,
                licencesRaw:licences
            })
        })
    }
    addLicence = () => {
        this.props.client.mutate({
            mutation:this.state.addLicenceQuery,
            variables:{
                societe:this.state.newSociete,
                number:this.state.newNumber,
                vehicle:this.state.newVehicle,
                endDate:this.state.newEndDate
            }
        }).then(({data})=>{
            data.addLicence.map(qrm=>{
                if(qrm.status){
                    this.closeAddLicence()
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLicences();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    /*CONTENT GETTERS*/
    getTableHeader = () => {
        if(this.props.userLimited){
            return(
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Numero de licence</Table.HeaderCell>
                        <Table.HeaderCell>Véhicule associé</Table.HeaderCell>
                        <Table.HeaderCell>Nom de tournée</Table.HeaderCell>
                        <Table.HeaderCell>Fin de validité</Table.HeaderCell>
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
                        <Table.HeaderCell>Numero de licence</Table.HeaderCell>
                        <Table.HeaderCell>Véhicule associé</Table.HeaderCell>
                        <Table.HeaderCell>Nom de tournée</Table.HeaderCell>
                        <Table.HeaderCell>Fin de validité</Table.HeaderCell>
                        <Table.HeaderCell>Documents</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadLicences();
        this.loadSocietes();
    }

    render() {
        if(this.state.loading){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loading)}>Chargement des licences</Loader>
                </div>
            )
        }else{
            return (
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
                    <ParcMenu active="licences"/>
                    <Input style={{justifySelf:"stretch"}} name="storeFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher une tournée, un numéro de licence ou une immatriculation' />
                    <div style={{display:"flex",justifyContent:"flex-end"}}>
                        <BigButtonIcon icon="plus" color="blue" onClick={this.showAddLicence} tooltip="Ajouter une licence"/>
                    </div>
                    <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}}>
                        <CustomFilter infos={this.state.endDateInfos} active={this.state.endDateFilter} />
                        <CustomFilter infos={this.state.freeLicenceFilterInfos} active={this.state.freeLicenceFilter} />
                        <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
                    </CustomFilterSegment>
                    <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                        <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                            {this.getTableHeader()}
                            <Table.Body>
                                {this.state.licences()}
                            </Table.Body>
                        </Table>
                    </div>
                    <Modal closeOnDimmerClick={false} open={this.state.openAddLicence} onClose={this.closeAddLicence} closeIcon>
                        <Modal.Header>
                            Création de la licence
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Societe</label>
                                    <SocietePicker restrictToVisibility groupAppears={false} onChange={this.handleChangeSociete}/>
                                </Form.Field>
                                <Form.Field><label>Numero de licence</label><input onChange={this.handleChange} placeholder="Numero de licence" name="newNumber"/></Form.Field>
                                <Form.Field>
                                    <label>Véhicule associé</label>
                                    <VehiclePicker userRestricted={this.props.userLimited} onChange={this.handleChangeVehicle}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Date de fin de validité</label>
                                    <Input value={this.state.newEndDate} placeholder="Fin de validité" onFocus={()=>{this.showDatePicker("newEndDate")}} name="newEndDate"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="blue" onClick={this.addLicence}>Créer</Button>
                        </Modal.Actions>
                    </Modal>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </div>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Licences);