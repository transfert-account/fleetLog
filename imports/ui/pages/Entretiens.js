import React, { Component } from 'react';
import { Icon, Input, Button, Table, Modal, Form, Message } from 'semantic-ui-react';
import DropdownFilter from '../atoms/DropdownFilter';
import { UserContext } from '../../contexts/UserContext';
import EntretienRow from '../molecules/EntretienRow';
import VehiclePicker from '../atoms/VehiclePicker';
import { gql } from 'apollo-server-express';

class Entretiens extends Component {

    state={
        entretienFilter:"",
        newVehicle:"",
        filterArchive:false,
        openAddEntretien:false,
        docsFilter:"all",
        orderStatusFilter:"all",
        entretiensRaw:[],
        entretiens : () => {
            let displayed = Array.from(this.state.entretiensRaw);
            displayed = displayed.filter(e =>
                e.archived == this.state.filterArchive
            );
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(e =>
                    e.societe._id == this.props.societeFilter
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
                <EntretienRow loadEntretiens={this.loadEntretiens} key={e._id} entretien={e}/>
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
    
    closeAddEntretien = () => {
        this.setState({
            openAddEntretien:false
        })
    }

    //ARCHIVE FILTER
    getArchiveFilterColor = (color,active) => {
        if(this.state.filterArchive == active){
            return color;
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

    setOrderStatusFilter = value => {
        this.setState({
            orderStatusFilter:value
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
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"1fr auto"}}>
                <Input style={{justifySelf:"stretch"}} name="entretienFilter" onChange={this.handleChange} icon='search' placeholder='Rechercher une immatriculation, un titre ou une description' />
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddEntretien} icon labelPosition='right'>Créer un entretien<Icon name='plus'/></Button>
                <div style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"auto auto auto",gridGap:"16px"}}>
                    <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                        <Icon name='archive'/>
                        <Button.Group style={{placeSelf:"center"}}>
                            <Button color={this.getArchiveFilterColor("green",false)} onClick={this.switchArchiveFilter}>En cours</Button>
                            <Button color={this.getArchiveFilterColor("orange",true)} onClick={this.switchArchiveFilter}>Archives</Button>
                        </Button.Group>
                    </Message>
                    <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                        <Icon name='shipping fast'/>
                        <Button.Group style={{placeSelf:"center"}}>
                            <Button color={this.getOrderStatusColor("blue","all")} onClick={()=>{this.setOrderStatusFilter("all")}}>Tous</Button>
                            <Button color={this.getOrderStatusColor("green","ready")} onClick={()=>{this.setOrderStatusFilter("ready")}}>Entretiens prêts</Button>
                            <Button color={this.getOrderStatusColor("orange","waiting")} onClick={()=>{this.setOrderStatusFilter("waiting")}}>Commandes en livraison</Button>
                            <Button color={this.getOrderStatusColor("red","toDo")} onClick={()=>{this.setOrderStatusFilter("toDo")}}>Commandes à passer</Button>
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
                    <Table style={{marginBottom:"0"}} celled selectable color={this.getArchiveFilterColor()} compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Societe</Table.HeaderCell>
                                <Table.HeaderCell>Vehicule</Table.HeaderCell>
                                <Table.HeaderCell>Titre</Table.HeaderCell>
                                <Table.HeaderCell>Description de l'entretien</Table.HeaderCell>
                                <Table.HeaderCell>A commander</Table.HeaderCell>
                                <Table.HeaderCell>Commandé</Table.HeaderCell>
                                <Table.HeaderCell>Prêt</Table.HeaderCell>
                                <Table.HeaderCell>Documents</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
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
                                <VehiclePicker hideLocations={true} onChange={this.handleChangeVehicle}/>
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