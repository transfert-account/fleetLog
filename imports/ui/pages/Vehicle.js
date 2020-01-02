import React, { Component, Fragment } from 'react'
import { Loader, Label, Button, Icon, Message, Modal, Input, Form, Table } from 'semantic-ui-react';
import ModalDatePicker from '../atoms/ModalDatePicker'
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

class Vehicle extends Component {
    
    state={
        loading:true,
        openDatePicker:false,
        openDelete:false,
        openDocs:false,
        openUpdateKm:false,
        datePickerTarget:"",
        newDateReport:new Date().getDate().toString().padStart(2, '0')+"/"+parseInt(new Date().getMonth()+1).toString().padStart(2, '0')+"/"+new Date().getFullYear().toString().padStart(4, '0'),
        _id:this.props.match.params._id,
        newKm:"",
        vehicleQuery : gql`
            query vehicle($_id:String!){
                vehicle(_id:$_id){
                    
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    registration
                    km
                    kms{
                        reportDate
                        kmValue
                    }
                    lastKmUpdate
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
        `,
        updateKmQuery : gql`
            mutation updateKm($_id:String!,$date:String!,$kmValue:Int!){
                updateKm(_id:$_id,date:$date,kmValue:$kmValue)
            }
        `,
        deleteVehicleQuery : gql`
            mutation deleteVehicle($_id:String!){
                deleteVehicle(_id:$_id)
            }
        `,
        kmsReport : () => {
            if(this.state.vehicle.kms.length==0){
                return(
                    <Table.Row key={"none"}>
                        <Table.Cell colSpan='2' textAlign="center">
                            Aucun relevé.
                        </Table.Cell>
                    </Table.Row>
                )
            }
            //displayed = displayed.slice((this.state.currentPage - 1) * this.state.rowByPage, this.state.currentPage * this.state.rowByPage);
            return this.state.vehicle.kms.map(k =>(
                <Table.Row>
                    <Table.Cell>{k.reportDate}</Table.Cell>
                    <Table.Cell>{k.kmValue}</Table.Cell>
                </Table.Row>
            ))
        }
    }

    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }    

    deleteVehicle = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteVehicleQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            this.props.history.push("/parc/vehicles")
        })
    }

    updateKm = () => {
        this.props.client.mutate({
            mutation:this.state.updateKmQuery,
            variables:{
                _id:this.state._id,
                date:this.state.newDateReport,
                kmValue:parseInt(this.state.newKm)
            }
        }).then(({data})=>{
            this.closeUpdateKm();
            this.loadVehicule();
        })
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }

    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }

    showDelete = () => {
        this.setState({
            openDelete:true
        })
    }
    closeDelete = () => {
        this.setState({
            openDelete:false
        })
    }

    showUpdateKm = () => {
        this.setState({
            openUpdateKm:true
        })
    }
    closeUpdateKm = () => {
        this.setState({
            openUpdateKm:false
        })
    }

    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
    }
    
    downloadDoc = doc => {
        
    }
    uploadDoc = doc => {
        
    }

    loadVehicule = () => {
        this.props.client.query({
            query:this.state.vehicleQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:this.props.match.params._id
            }
        }).then(({data})=>{
            this.setState({
                vehicle:data.vehicle,
                loading:false
            })
        })
    }

    loadChart = () => {
        let ctx = document.getElementById('myChart').getContext('2d');//use ref not getelement by id
        let myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
                datasets: [{
                    label: '# of Votes',
                    data: [12, 19, 3, 5, 2, 3],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    componentDidMount = () => {
        this.loadVehicule();
        //this.loadChart();
    }

    render() {
        if(this.state.loading){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loading)}>Chargement du véhicule</Loader>
                </div>
            )
        }else{
            return (
                <Fragment>
                    <div style={{display:"grid",gridGap:"24px",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"auto auto"}}>
                        <Message size='huge' style={{margin:"0",gridRowStart:"1",gridColumnStart:"1"}} icon='truck' header={this.state.vehicle.registration} content={this.state.vehicle.brand + " - " + this.state.vehicle.model} />
                        <div>
                            <p style={{margin:"0",fontWeight:"bold",fontSize:"2.6em"}}>
                                {this.state.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km
                            </p>
                            <p style={{margin:"0",fontWeight:"bold",fontSize:"1.2em"}}>
                                (relevé {moment(this.state.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()})
                            </p>
                        </div>
                        <div className="formBoard" style={{display:"grid",gridTemplateColumns:"auto 1fr",gridRowStart:"3",gridColumnStart:"1",gridGap:"6px 24px"}}>
                            <div className="labelBoard">Societé :</div><div className="valueBoard">{this.state.vehicle.societe.name}</div>
                            <div className="labelBoard">Immatriculation :</div><div className="valueBoard">{this.state.vehicle.registration}</div>
                            <div className="labelBoard">Première immatriculation :</div><div className="valueBoard">{this.state.vehicle.firstRegistrationDate}</div>
                            <div className="labelBoard">Volume :</div><div className="valueBoard">{this.state.vehicle.volume+" m²"}</div>
                            <div className="labelBoard">Charge utile :</div><div className="valueBoard">{this.state.vehicle.payload+" t."}</div>
                            <div className="labelBoard">Couleur :</div><div className="valueBoard">{this.state.vehicle.color}</div>
                            <div className="labelBoard">Montant de l'assurance :</div><div className="valueBoard">{this.state.vehicle.insurancePaid}</div>
                            <div className="labelBoard">Date de fin :</div><div className="valueBoard">{this.state.vehicle.endDate}</div>
                            <div className="labelBoard">Propriété :</div>
                            <div className="valueBoard">
                                {(
                                    this.state.vehicle.property?<Label color='green' horizontal>
                                        Owned
                                    </Label>:<Label color='red' horizontal>
                                        Rental
                                    </Label>
                                )}
                            </div>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridRowStart:"1",gridColumnStart:"2",gridGap:"16px"}}>
                            <Button color="green" style={{placeSelf:"stretch"}} onClick={this.showUpdateKm} icon labelPosition='right'>MaJ kilométrage<Icon name='dashboard'/></Button>
                            <Button color="purple" style={{placeSelf:"stretch"}} onClick={this.showDocs} icon labelPosition='right'>Gérer les documents<Icon name='folder'/></Button>
                            <Button color="blue" style={{placeSelf:"stretch"}} onClick={this.editInfos} icon labelPosition='right'>Editer le véhicule<Icon name='edit'/></Button>
                            <Button color="red" style={{placeSelf:"stretch"}} onClick={this.showDelete} icon labelPosition='right'>Supprimer le vehicule<Icon name='trash'/></Button>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 3fr",gridRowStart:"2",gridColumnStart:"2",gridGap:"16px"}}>
                            <Table basic="very">
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Date</Table.HeaderCell>
                                        <Table.HeaderCell>Km</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.state.kmsReport()}
                                </Table.Body>
                            </Table>
                            <canvas id="myChart" style={{placeSelf:"stretch"}}></canvas>
                        </div>
                    </div>
                    <Modal size='small' closeOnDimmerClick={false} open={this.state.openUpdateKm} onClose={this.closeUpdateKm} closeIcon>
                        <Modal.Header>
                            Mettre à jour le kilométrage du vehicle immatriculé : {this.state.vehicle.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form>
                                <Form.Field>
                                    <label>Valeur relevée en Km</label>
                                    <Input icon='dashboard' iconPosition='left' placeholder='Kilométrage...' onChange={this.handleChange} name="newKm"/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Date du relevé</label>
                                    <Input icon='calendar' iconPosition='left' value={this.state.newDateReport} onFocus={()=>{this.showDatePicker("newDateReport")}} onChange={this.handleChange} name="newDateReport"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeUpdateKm}>Annuler</Button>
                            <Button color="blue" onClick={this.updateKm}>Mettre à jour</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs au vehicle immatriculé : {this.state.vehicle.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"1fr auto 1fr",gridGap:"0 24px"}}>
                                <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 1</p>
                                <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 2</p>
                                <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                    <p className="gridLabel">Nom du fichier :</p>
                                    <p className="gridValue">Doc Name XYZ</p>
                                    <p className="gridLabel">Taille du fichier:</p>
                                    <p className="gridValue">1234 kB</p>
                                    <p className="gridLabel">Enregistré le :</p>
                                    <p className="gridValue">01/02/2019</p>
                                </Message>
                                <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                    <p className="gridLabel">Nom du fichier :</p>
                                    <p className="gridValue">Doc Name XYZ</p>
                                    <p className="gridLabel">Taille du fichier:</p>
                                    <p className="gridValue">1234 kB</p>
                                    <p className="gridLabel">Enregistré le :</p>
                                    <p className="gridValue">01/02/2019</p>
                                </Message>
                                <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                                <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                                <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                                <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDocs}>Fermer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer le vehicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteVehicle}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </Fragment>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withRouter(withUserContext(Vehicle));