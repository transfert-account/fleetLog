import React, { Component } from 'react';
import { Icon,Input,Button,Table,Modal,Form } from 'semantic-ui-react';
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
        entretiensRaw:[],
        entretiens : () => {
            let displayed = Array.from(this.state.entretiensRaw);
            if(this.state.entretienFilter.length>1){
                displayed = displayed.filter(e =>
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
                <EntretienRow loadEntretiens={this.loadEntretiens} key={e._id} entretien={e}/>
            ))
        },
        addEntretienQuery : gql`
            mutation addEntretien($vehicle:String!){
              addEntretien(vehicle:$vehicle)
            }
        `,
        entretiensQuery : gql`
            query entretiens{
                entretiens{
                    _id
                    description
                    archived
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
                        brand
                        model
                        volume
                        payload
                        color
                        insurancePaid
                        endDate
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

    filterArchive = () => {
        this.setState({
            filterArchive:!this.state.filterArchive
        })
    }

    getArchiveButtonContent = () => {
        if(this.state.filterArchive){
            return "Afficher les entretiens en cours"
        }else{
            return "Afficher les archives"
        }
    }

    getArchiveButtonColor = () => {
        if(this.state.filterArchive){
            return "green"
        }else{
            return "orange"
        }
    }

    getEntretienTableColor = () => {
        if(this.state.filterArchive){
            return "orange"
        }else{
            return "green"
        }
    }

    getArchiveButtonIcon = () => {
        if(this.state.filterArchive){
            return "truck"
        }else{
            return "archive"
        }
    }
    
    closeAddEntretien = () => {
        this.setState({
            openAddEntretien:false
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
            this.loadEntretiens();
        })
    }

    componentDidMount = () => {
        this.loadEntretiens();
    }

    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
                <Button color={this.getArchiveButtonColor()} style={{justifySelf:"stretch"}} onClick={this.filterArchive} icon labelPosition='right'>{this.getArchiveButtonContent()}<Icon name={this.getArchiveButtonIcon()}/></Button>
                <Input style={{justifySelf:"stretch"}} name="entretienFilter" onChange={this.handleChange} icon='search' placeholder='Rechercher un entretien ...' />
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddEntretien} icon labelPosition='right'>Créer un entretien<Icon name='plus'/></Button>
                <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color={this.getEntretienTableColor()} compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell width="2">Vehicle</Table.HeaderCell>
                                <Table.HeaderCell width="12">Description de l'entretien</Table.HeaderCell>
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
                        <Form style={{display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field>
                                <label>Véhicule associé</label>
                                <VehiclePicker onChange={this.handleChangeVehicle}/>
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