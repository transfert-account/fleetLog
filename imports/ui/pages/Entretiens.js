import React, { Component } from 'react';
import { Input, Button, Table, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import BigButtonIcon from '../elements/BigIconButton';
import EntretienRow from '../molecules/EntretienRow';
import CustomFilterSegment from '../molecules/CustomFilterSegment';

import CustomFilter from '../atoms/CustomFilter';
import VehiclePicker from '../atoms/VehiclePicker';

import { gql } from 'apollo-server-express';


class Entretiens extends Component {

    state={
        entretienFilter:"",
        newVehicle:"",
        openAddEntretien:false,
        archiveFilter:false,
        docsFilter:"all",
        orderStatusFilter:"all",
        fromControlFilter:"all",
        filters:[
            {
                infos:"archiveFilterInfos",
                filter:"archiveFilter"
            },{
                infos:"ordersFilterInfos",
                filter:"orderStatusFilter"
            },{
                infos:"docsFilterInfos",
                filter:"docsFilter"
            },{
                infos:"fromControlFilterInfos",
                filter:"fromControlFilter"
            }
        ],
        archiveFilterInfos:{
            icon:"archive",            
            options:[
                {
                    key: 'archivefalse',
                    initial: true,
                    text: 'Entretiens actuels',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    initial: false,
                    text: 'Entretiens archivés',
                    value: true,
                    color:"orange",
                    click:()=>{this.switchArchiveFilter(true)},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        ordersFilterInfos:{
            icon:"shipping fast",            
            options:[
                {
                    key: 'orderall',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"green",
                    click:()=>{this.setOrderStatusFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'orderready',
                    initial: false,
                    text: 'Entretiens prêts',
                    value: "ready",
                    color:"blue",
                    click:()=>{this.setOrderStatusFilter("ready")},
                    label: { color: 'blue', empty: true, circular: true }
                },
                {
                    key: 'orderwaiting',
                    initial: false,
                    text: 'Commandes en livraison',
                    value: "waiting",
                    color:"orange",
                    click:()=>{this.setOrderStatusFilter("waiting")},
                    label: { color: 'orange', empty: true, circular: true }
                },
                {
                    key: 'ordertodo',
                    initial: false,
                    text: 'Commandes à passer',
                    value: "toDo",
                    color:"red",
                    click:()=>{this.setOrderStatusFilter("toDo")},
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
        fromControlFilterInfos:{
            icon:"clipboard check",            
            options:[
                {
                    key: 'all',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"green",
                    click:()=>{this.setFromControlFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },{
                    key: 'preventive',
                    initial: false,
                    text: 'Entretiens préventifs',
                    value: "preventive",
                    color:"blue",
                    click:()=>{this.setFromControlFilter("preventive")},
                    label: { color: 'blue', empty: true, circular: true }
                },{
                    key: 'curative',
                    initial: false,
                    text: 'Entretiens curatifs',
                    value: "curative",
                    color:"orange",
                    click:()=>{this.setFromControlFilter("curative")},
                    label: { color: 'orange', empty: true, circular: true }
                }
            ]
        },
        entretiensRaw:[],
        entretiens : () => {
            let displayed = Array.from(this.state.entretiensRaw);
            displayed = displayed.filter(e =>
                e.archived == this.state.archiveFilter
            );
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(e =>
                    e.societe._id == this.props.societeFilter ||
                    e.vehicle.sharedTo._id == this.props.societeFilter
                );
            }
            if(this.state.orderStatusFilter != "all"){
                if(this.state.orderStatusFilter == "ready"){
                    displayed = displayed.filter(e =>{
                        if(e.commandes.filter(c=>c.status != 3).length == 0){
                            return true;
                        }else{
                            return false;
                        }
                    })  
                }
                if(this.state.orderStatusFilter == "waiting"){
                    displayed = displayed.filter(e =>{
                        if(e.commandes.filter(c=>c.status == 2).length > 0){
                            return true;
                        }else{
                            return false;
                        }
                    })
                }
                if(this.state.orderStatusFilter == "toDo"){
                    displayed = displayed.filter(e =>{
                        if(e.commandes.filter(c=>c.status == 1).length > 0){
                            return true;
                        }else{
                            return false;
                        }
                    })
                }
            }
            displayed = displayed.filter(e =>{
                if(this.state.docsFilter == "all"){return true}else{
                    if(e.ficheInter._id == "" || e.ficheInter._id == ""){
                        return true
                    }else{
                        return false
                    }
                }}
            )
            displayed = displayed.filter(e =>{
                if(this.state.fromControlFilter == "all"){return true}else{
                    if(this.state.fromControlFilter == "preventive"){
                        if(e.fromControl){
                            return true
                        }else{
                            return false
                        }
                    }
                    if(this.state.fromControlFilter == "curative"){
                        if(e.fromControl){
                            return false
                        }else{
                            return true
                        }
                    }
                }}
            )
            if(this.state.entretienFilter.length>0){
                displayed = displayed.filter(e =>
                    e.title.toLowerCase().includes(this.state.entretienFilter.toLowerCase()) ||
                    e.description.toLowerCase().includes(this.state.entretienFilter.toLowerCase()) ||
                    e.vehicle.registration.toLowerCase().includes(this.state.entretienFilter.toLowerCase())
                );
                if(displayed.length == 0){
                    return(
                        <Table.Row key={"none"}>
                            <Table.Cell width={16} colSpan='14' textAlign="center">
                            <p>Aucune entretien ne correspond à ce filtre</p>
                            </Table.Cell>
                        </Table.Row>
                    )
                }
            }
            displayed.sort((a, b) => a.vehicle.registration.localeCompare(b.vehicle.registration))
            return displayed.map(e =>(
                <EntretienRow userLimited={this.props.userLimited} loadEntretiens={this.loadEntretiens} key={e._id} entretien={e}/>
            ))
        },
        addEntretienQuery : gql`
            mutation addEntretien($vehicle:String!){
                addEntretien(vehicle:$vehicle){
                    status
                    message
                }
            }
        `,
        entretiensQuery : gql`
            query entretiens{
                entretiens{
                    _id
                    description
                    archived
                    title
                    fromControl
                    control{
                        _id
                        equipementDescription{
                            _id
                            name
                        }
                    }
                    societe{
                        _id
                        trikey
                        name
                    }
                    commandes{
                        _id
                        piece{
                            _id
                            name
                            type
                        }
                        entretien
                        status
                        price
                    }
                    ficheInter{
                        _id
                    }
                    vehicle{
                        _id
                        societe{
                            _id
                            trikey
                            name
                        }
                        registration
                        firstRegistrationDate
                        km
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
                        shared
                        sharedTo{
                            _id
                            name
                        }
                        insurancePaid
                        property
                    }
                }
            }
        `,
        buEntretiensQuery : gql`
            query buEntretiens{
                buEntretiens{
                    _id
                    description
                    archived
                    title
                    fromControl
                    control{
                        _id
                        equipementDescription{
                            _id
                            name
                        }
                    }
                    societe{
                        _id
                        trikey
                        name
                    }
                    commandes{
                        _id
                        piece{
                            _id
                            name
                            type
                        }
                        entretien
                        status
                        price
                    }
                    ficheInter{
                        _id
                    }
                    vehicle{
                        _id
                        societe{
                            _id
                            trikey
                            name
                        }
                        registration
                        firstRegistrationDate
                        km
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
                        shared
                        sharedTo{
                            _id
                            name
                        }
                        insurancePaid
                        property
                    }
                }
            }
        `
    }
    /*SHOW AND HIDE MODALS*/
    showAddEntretien = () => {
        this.setState({
            openAddEntretien:true
        })
    }
    closeAddEntretien = () => {
        this.setState({
            openAddEntretien:false
        })
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
    /*FILTERS HANDLERS*/
    switchArchiveFilter = v => {
        this.setState({
            archiveFilter:v
        })
        this.loadEntretiens();
    }
    setOrderStatusFilter = value => {
        this.setState({
            orderStatusFilter:value
        })
    }
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }
    setFromControlFilter = value => {
        this.setState({
            fromControlFilter:value
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
    loadEntretiens = () => {
        let entretiensQuery = (this.props.userLimited ? this.state.buEntretiensQuery : this.state.entretiensQuery);
        this.props.client.query({
            query:entretiensQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let entretiens = (this.props.userLimited ? data.buEntretiens : data.entretiens);
            this.setState({
                entretiensRaw:entretiens
            })
        })
    }
    addEntretien = () => {
        this.closeAddEntretien()
        this.props.client.mutate({
            mutation:this.state.addEntretienQuery,
            variables:{
                vehicle:this.state.newVehicle
            }
        }).then(({data})=>{
            data.addEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretiens();
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
                        <Table.HeaderCell>Véhicule</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Titre</Table.HeaderCell>
                        <Table.HeaderCell>Description de l'entretien</Table.HeaderCell>
                        <Table.HeaderCell>A commander</Table.HeaderCell>
                        <Table.HeaderCell>Commandé</Table.HeaderCell>
                        <Table.HeaderCell>Prêt</Table.HeaderCell>
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
                        <Table.HeaderCell>Véhicule</Table.HeaderCell>
                        <Table.HeaderCell>Type</Table.HeaderCell>
                        <Table.HeaderCell>Titre</Table.HeaderCell>
                        <Table.HeaderCell>Description de l'entretien</Table.HeaderCell>
                        <Table.HeaderCell>A commander</Table.HeaderCell>
                        <Table.HeaderCell>Commandé</Table.HeaderCell>
                        <Table.HeaderCell>Prêt</Table.HeaderCell>
                        <Table.HeaderCell>Documents</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadEntretiens();
    }
    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"1fr auto"}}>
                <Input style={{justifySelf:"stretch"}} name="entretienFilter" onChange={this.handleChange} icon='search' placeholder='Rechercher une immatriculation'/>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <BigButtonIcon icon="plus" color="blue" onClick={this.showAddEntretien} tooltip="Créer un entretien"/>
                </div>
                <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 2"}}>
                    <CustomFilter infos={this.state.archiveFilterInfos} active={this.state.archiveFilter} />
                    <CustomFilter infos={this.state.ordersFilterInfos} active={this.state.orderStatusFilter} />
                    <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
                    <CustomFilter infos={this.state.fromControlFilterInfos} active={this.state.fromControlFilter} />
                </CustomFilterSegment>
                <div style={{gridRowStart:"3",gridColumnEnd:"span 2",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable compact>
                        {this.getTableHeader()}
                        <Table.Body>
                            {this.state.entretiens()}
                        </Table.Body>
                    </Table>
                </div>
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddEntretien} onClose={this.closeAddEntretien} closeIcon>
                    <Modal.Header>
                        Création de l'entretien
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateRows:"1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field>
                                <label>Véhicule associé</label>
                                <VehiclePicker userRestricted={this.props.userLimited} hideLocations={true} onChange={this.handleChangeVehicle}/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="blue" onClick={this.addEntretien}>Créer</Button>
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Entretiens);