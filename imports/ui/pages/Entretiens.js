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
                    text: 'Entretiens ouverts',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    initial: false,
                    text: 'Entretiens clos',
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
                    color:"grey",
                    click:()=>{this.setFromControlFilter("curative")},
                    label: { color: 'grey', empty: true, circular: true }
                }
            ]
        },
        entretiensRaw:[],
        entretiens : () => {
            let displayed = Array.from(this.state.entretiensRaw);
            displayed = displayed.filter(e =>this.state.archiveFilter ? e.status == 3 : e.status < 3);
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(e =>e.societe._id == this.props.societeFilter);
            }
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
                            <Table.Cell colSpan='9' textAlign="center">
                            <p>Aucune entretien ne correspond à ce filtre</p>
                            </Table.Cell>
                        </Table.Row>
                    )
                }
            }
            if(displayed.length == 0){
                return(
                    <Table.Row key={"none"}>
                        <Table.Cell colSpan='9' textAlign="center">
                            <p>Aucun entretien</p>
                        </Table.Cell>
                    </Table.Row>
                )
            }
            displayed.sort((a, b) => a.vehicle.registration.localeCompare(b.vehicle.registration))
            return displayed.map(e =>(
                <EntretienRow loadEntretiens={this.loadEntretiens} key={e._id} entretien={e}/>
            ))
        },
        entretiensQuery : gql`
            query entretiens{
                entretiens{
                    _id
                    societe{
                        _id
                        name
                    }
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
                    occurenceDate
                    status
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
                    user{
                        _id
                        firstname
                        lastname
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
        this.props.client.query({
            query:this.state.entretiensQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                entretiensRaw:data.entretiens
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
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto 1fr"}}>
                <EntretienMenu active="entretiens"/>
                <Input style={{justifySelf:"stretch"}} name="entretienFilter" onChange={this.handleChange} icon='search' placeholder='Rechercher une immatriculation'/>
                <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 2"}}>
                    {this.state.filters.map(f=>{
                        return(
                            <CustomFilter key={f.infos} infos={this.state[f.infos]} active={this.state[f.filter]}/>
                        )
                    })}
                </CustomFilterSegment>
                <div style={{gridRowStart:"3",gridColumnEnd:"span 2",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Propriétaire</Table.HeaderCell>
                                <Table.HeaderCell>Véhicule</Table.HeaderCell>
                                <Table.HeaderCell>Type</Table.HeaderCell>
                                <Table.HeaderCell>Nature</Table.HeaderCell>
                                <Table.HeaderCell>Note</Table.HeaderCell>
                                <Table.HeaderCell>Status</Table.HeaderCell>
                                <Table.HeaderCell>Affecté à</Table.HeaderCell>
                                <Table.HeaderCell>Date</Table.HeaderCell>
                                <Table.HeaderCell collapsing>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.entretiens()}
                        </Table.Body>
                    </Table>
                </div>
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