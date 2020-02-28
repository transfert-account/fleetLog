import React, { Component } from 'react';
import { Icon, Input, Button, Table, Modal, Form, Message } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import EntretienRow from '../molecules/EntretienRow';
import VehiclePicker from '../atoms/VehiclePicker';
import { gql } from 'apollo-server-express';

class BUEntretiens extends Component {

    state={
        entretienFilter:"",
        newVehicle:"",
        filterArchive:false,
        orderStatusFilter:"all",
        openAddEntretien:false,
        entretiensRaw:[],
        entretiens : () => {
            let displayed = Array.from(this.state.entretiensRaw);
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
            displayed = displayed.filter(e =>
                e.archived == this.state.filterArchive
            );
            return displayed.map(e =>(
                <EntretienRow hideSociete={true} loadEntretiens={this.loadEntretiens} key={e._id} entretien={e}/>
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
        buEntretiensQuery : gql`
            query buEntretiens{
                buEntretiens{
                    _id
                    description
                    archived
                    title
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
                        insurancePaid
                        property
                    }
                }
            }
        `
    }

    handleFilter = e => {
        this.setState({
          filterArchive : e.target.value
        })
    }

    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    handleChangeVehicle = _id => {
        this.setState({ newVehicle:_id })
    }

    showAddEntretien = () => {
        this.setState({
            openAddEntretien:true
        })
    }

    //ARCHIVE FILTER
    getArchiveFilterColor = (color,active) => {
        if(this.state.filterArchive == active){
            return color;
        }
    }

    getArchiveFilterBasic = active => {
        if(this.state.filterArchive == active){
            return true;
        }
    }

    switchArchiveFilter = () => {
        this.setState({
            filterArchive:!this.state.filterArchive
        })
        this.loadEntretiens();
    }

    //ORDER STATUS FILTER
    getOrderStatusColor = (color,filter) => {
        if(this.state.orderStatusFilter == filter){
            return color
        }
    }

    getOrderStatusBasic = (filter) => {
        if(this.state.orderStatusFilter == filter){
            return true
        }
    }

    setOrderStatusFilter = value => {
        this.setState({
            orderStatusFilter:value
        })
    }
    
    closeAddEntretien = () => {
        this.setState({
            openAddEntretien:false
        })
    }

    loadEntretiens = () => {
        this.props.client.query({
            query:this.state.buEntretiensQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                entretiensRaw:data.buEntretiens
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

    componentDidMount = () => {
        this.loadEntretiens();
    }

    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto auto 1fr",gridTemplateColumns:"1fr auto"}}>
                <Input style={{justifySelf:"stretch"}} name="entretienFilter" onChange={this.handleChange} icon='search' placeholder='Rechercher une immatriculation, un titre ou une description' />
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddEntretien} icon labelPosition='right'>Créer un entretien<Icon name='plus'/></Button>
                <div style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                    <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                        <Icon name='archive'/>
                        <Button.Group style={{placeSelf:"center"}}>
                            <Button basic={this.getArchiveFilterBasic(false)} color={this.getArchiveFilterColor("green",false)} onClick={this.switchArchiveFilter}>En cours</Button>
                            <Button basic={this.getArchiveFilterBasic(true)} color={this.getArchiveFilterColor("orange",true)} onClick={this.switchArchiveFilter}>Archives</Button>
                        </Button.Group>
                    </Message>
                    <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                        <Icon name='shipping fast'/>
                        <Button.Group style={{placeSelf:"center"}}>
                            <Button basic={this.getOrderStatusBasic("all")} color={this.getOrderStatusColor("blue","all")} onClick={()=>{this.setOrderStatusFilter("all")}}>Tous</Button>
                            <Button basic={this.getOrderStatusBasic("ready")} color={this.getOrderStatusColor("green","ready")} onClick={()=>{this.setOrderStatusFilter("ready")}}>Entretiens prêts</Button>
                            <Button basic={this.getOrderStatusBasic("waiting")} color={this.getOrderStatusColor("orange","waiting")} onClick={()=>{this.setOrderStatusFilter("waiting")}}>Commandes en livraison</Button>
                            <Button basic={this.getOrderStatusBasic("toDo")} color={this.getOrderStatusColor("red","toDo")} onClick={()=>{this.setOrderStatusFilter("toDo")}}>Commandes à passer</Button>
                        </Button.Group>
                    </Message>
                </div>
                <div style={{gridRowStart:"3",gridColumnEnd:"span 2",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color={this.getArchiveFilterColor()} compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell width="2">Vehicule</Table.HeaderCell>
                                <Table.HeaderCell width="3">Titre</Table.HeaderCell>
                                <Table.HeaderCell width="6">Description de l'entretien</Table.HeaderCell>
                                <Table.HeaderCell width="1">A commander</Table.HeaderCell>
                                <Table.HeaderCell width="1">Commandé</Table.HeaderCell>
                                <Table.HeaderCell width="1">Prêt</Table.HeaderCell>
                                <Table.HeaderCell width="2">Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
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
                                <VehiclePicker societeRestricted={true} hideLocations onChange={this.handleChangeVehicle}/>
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

export default wrappedInUserContext = withUserContext(BUEntretiens);