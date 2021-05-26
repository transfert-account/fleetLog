import React, { Component } from 'react';
import { Input, Button, Table, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import BigIconButton from '../elements/BigIconButton';
import EntretienRow from '../molecules/EntretienRow';
import CustomFilterSegment from '../molecules/CustomFilterSegment';
import EntretienMenu from '../molecules/EntretienMenu';

import CustomFilter from '../atoms/CustomFilter';
import VehiclePicker from '../atoms/VehiclePicker';

import { gql } from 'apollo-server-express';


class Entretiens extends Component {

    state={
        entretienFilter:"",
        newVehicle:"",
        openAddEntretien:false,
        archiveFilter:false,
        typeFilter:"all",
        filters:[
            {
                infos:"archiveFilterInfos",
                filter:"archiveFilter"
            },{
                infos:"typeFilterInfos",
                filter:"typeFilter"
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
        typeFilterInfos:{
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
                    key: 'mandatory',
                    initial: false,
                    text: 'Entretiens obligatoire',
                    value: "mandatory",
                    color:"blue",
                    click:()=>{this.setFromControlFilter("mandatory")},
                    label: { color: 'blue', empty: true, circular: true }
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
            
            displayed = displayed.filter(e =>{
                if(this.state.typeFilter == "all"){
                    return true
                }else{
                    return (this.state.typeFilter == e.type)
                }
            })
            if(this.state.entretienFilter.length>0){
                displayed = displayed.filter(e =>
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
                    vehicle{
                        _id
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
                        shared
                        sharedTo{
                            _id
                            name
                        }
                    }
                    notes{
                        text
                    }
                    type
                    originControl{
                        key
                        name
                    }
                    originNature{
                        _id
                        name
                    }
                    archived
                    user
                }
            }
        `,
        buEntretiensQuery : gql`
            query buEntretiens{
                buEntretiens{
                    _id
                    vehicle{
                        _id
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
                        shared
                        sharedTo{
                            _id
                            name
                        }
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
            typeFilter:value
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
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadEntretiens();
    }
    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
                <EntretienMenu active="entretiens"/>
                <Input style={{justifySelf:"stretch"}} name="entretienFilter" onChange={this.handleChange} icon='search' placeholder='Rechercher une immatriculation'/>
                <div style={{display:"flex",justifyContent:"flex-end"}}>
                    <BigIconButton icon="plus" color="blue" onClick={this.showAddEntretien} tooltip="Créer un entretien curatif"/>
                </div>
                <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}}>
                    {this.state.filters.map(f=>{
                        return(
                            <CustomFilter key={f.infos} infos={this.state[f.infos]} active={this.state[f.filter]}/>
                        )
                    })}
                </CustomFilterSegment>
                <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Véhicule</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Nature</Table.HeaderCell>
                                <Table.HeaderCell>Note</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.entretiens()}
                        </Table.Body>
                    </Table>
                </div>
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddEntretien} onClose={this.closeAddEntretien} closeIcon>
                    <Modal.Header>
                        Création d'un entretien curatif
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