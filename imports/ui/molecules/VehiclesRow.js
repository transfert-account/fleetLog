import React, { Component, Fragment } from 'react'
import { Table, Icon, Message, Input, Label, Button, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import SocietePicker from '../atoms/SocietePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class VehiclesRow extends Component {

    state={
        _id:this.props.vehicle._id,
        newSociete:this.props.vehicle.societe._id,
        newRegistration:this.props.vehicle.registration,
        newFirstRegistrationDate:this.props.vehicle.firstRegistrationDate,
        newKm:this.props.vehicle.km,
        newLastKmUpdate:this.props.vehicle.lastKmUpdate,
        newBrand:this.props.vehicle.brand,
        newModel:this.props.vehicle.model,
        newVolume:this.props.vehicle.volume.meterCube,
        newPayload:this.props.vehicle.payload,
        newColor:this.props.vehicle.color,
        newInsurancePaid:this.props.vehicle.insurancePaid,
        newPayementBeginDate:this.props.vehicle.payementBeginDate,
        newProperty:this.props.vehicle.property,
        openDelete:false,
        openDocs:false,
        editing:false,
        editVehicleQuery : gql`
            mutation editVehicle($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$insurancePaid:Float!,$payementBeginDate:String!,$property:Boolean!){
                editVehicle(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,payementBeginDate:$payementBeginDate,property:$property)
            }
        `,
        deleteVehicleQuery : gql`
            mutation deleteVehicle($_id:String!){
                deleteVehicle(_id:$_id)
            }
        `,
    }

    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    
    navigateToVehicle = () => {
        this.props.history.push("/parc/vehicle/"+this.state._id);
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })    

    showDocs = () => {
        this.setState({openDocs:true})
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
 
    closeDocs = () => {
        this.setState({openDocs:false})
    }
    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }

    toggleProperty = () => {
        this.setState({
            newProperty:!this.state.newProperty
        })
    }
    
    closeEdit = () => {
        this.setState({editing:false})
    }
    showEdit = () => {
        this.setState({editing:true})
    }

    

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editVehicleQuery,
            variables:{
                _id:this.state._id,
                societe:this.state.newSociete,
                registration:this.state.newRegistration,
                firstRegistrationDate:this.state.newFirstRegistrationDate,
                km:parseFloat(this.state.newKm),
                lastKmUpdate:this.state.newLastKmUpdate,
                brand:this.state.newBrand,
                model:this.state.newModel,
                volume:parseFloat(this.state.newVolume),
                payload:parseFloat(this.state.newPayload),
                color:this.state.newColor,
                insurancePaid:parseFloat(this.state.newInsurancePaid),
                payementBeginDate:this.state.newPayementBeginDate,
                property:this.state.newProperty
            }
        }).then(({data})=>{
            this.props.loadVehicles();
        })
    }

    downloadDoc = doc => {
        
    }
    
    uploadDoc = doc => {
        
    }

    getPayementProgress = () => {
        let totalMonths = this.props.vehicle.purchasePrice/this.props.vehicle.monthlyPayement;
        let monthsDone = parseInt(moment().diff(moment(this.props.vehicle.payementBeginDate,"DD/MM/YYYY"),'months', true));
        let monthsLeft = totalMonths - monthsDone;
        return <Label color={parseInt(monthsLeft) == 0 ? "green" : "orange"}> {parseInt(monthsLeft)} mois restant avant propriété</Label>
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.vehicle.societe.name}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.registration}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.firstRegistrationDate}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</Table.Cell>
                    <Table.Cell>{moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.brand}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.model}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.volume.meterCube+" m²"}</Table.Cell>
                    <Table.Cell>{this.props.vehicle.payload} t.</Table.Cell>
                    <Table.Cell>
                        {this.getPayementProgress()}
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button circular style={{color:"#a29bfe"}} inverted icon icon='folder open' onClick={this.showDocs}/>
                        <Button circular style={{color:"#2980b9"}} inverted icon icon='arrow right' onClick={this.navigateToVehicle}/>
                    </Table.Cell>
                </Table.Row>
                <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                    <Modal.Header>
                        Documents relatifs au vehicle immatriculé : {this.props.vehicle.registration}
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
                <Modal closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmation de suppression 
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                Veuillez confirmer vouloir supprimer le véhicule immatriculé : {this.props.vehicle.registration}
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="red" onClick={this.deleteVehicle}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
    
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withRouter(withUserContext(VehiclesRow));