import React, { Component, Fragment } from 'react'
import { Table, Icon, Message, Input, Label, Button, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import SocietePicker from '../atoms/SocietePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
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
        newVolume:this.props.vehicle.volume,
        newPayload:this.props.vehicle.payload,
        newColor:this.props.vehicle.color,
        newInsurancePaid:this.props.vehicle.insurancePaid,
        newEndDate:this.props.vehicle.endDate,
        newProperty:this.props.vehicle.property,
        openDelete:false,
        openDocs:false,
        editing:false,
        editVehicleQuery : gql`
            mutation editVehicle($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:Float!,$payload:Float!,$color:String!,$insurancePaid:Float!,$endDate:String!,$property:Boolean!){
                editVehicle(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,endDate:$endDate,property:$property){
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
                    brand
                    model
                    volume
                    payload
                    color
                    cg
                    insurancePaid
                    cv
                    endDate
                    property
                }
            }
        `,
        deleteVehicleQuery : gql`
            mutation deleteVehicle($_id:String!){
                deleteVehicle(_id:$_id){
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
                    brand
                    model
                    volume
                    payload
                    color
                    cg
                    insurancePaid
                    cv
                    endDate
                    property
                }
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
                endDate:this.state.newEndDate,
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

    render() {
        if(this.state.editing){
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell colSpan="14" style={{padding:"32px"}}>
                            <Form style={{display:"grid",gridTemplateRows:"1fr 1fr 1fr",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Societe</label>
                                    <SocietePicker groupAppears={true} onChange={this.handleChangeSociete} value={this.state.newSociete}/>
                                </Form.Field>
                                <Form.Field><label>Registration</label><input value={this.state.newRegistration} onChange={this.handleChange} placeholder="registration" name="newRegistration"/></Form.Field>
                                <Form.Field><label>FirstRegistrationDate</label><input defaultValue={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} placeholder="firstRegistrationDate" name="newFirstRegistrationDate"/></Form.Field>
                                <Form.Field><label>Km</label><input value={this.state.newKm} type="number" onChange={this.handleChange} placeholder="km" name="newKm"/></Form.Field>
                                <Form.Field><label>LastKmUpdate</label><input defaultValue={this.state.newLastKmUpdate} placeholder="lastKmUpdate" onFocus={()=>{this.showDatePicker("newLastKmUpdate")}} name="newLastKmUpdate"/></Form.Field>
                                <Form.Field><label>Brand</label><input value={this.state.newBrand} onChange={this.handleChange} placeholder="brand" name="newBrand"/></Form.Field>
                                <Form.Field><label>Model</label><input value={this.state.newModel} onChange={this.handleChange} placeholder="model" name="newModel"/></Form.Field>
                                <Form.Field><label>Volume (m²)</label><input value={this.state.newVolume} type="number" onChange={this.handleChange} placeholder="volume" name="newVolume"/></Form.Field>
                                <Form.Field><label>Payload (t)</label><input value={this.state.newPayload} type="number" onChange={this.handleChange} placeholder="payload" name="newPayload"/></Form.Field>
                                <Form.Field><label>Color</label><input value={this.state.newColor} onChange={this.handleChange} placeholder="color" name="newColor"/></Form.Field>
                                <Form.Field><label>InsurancePaid</label><input value={this.state.newInsurancePaid} type="number" onChange={this.handleChange} placeholder="insurancePaid" name="newInsurancePaid"/></Form.Field>
                                <Form.Field><label>EndDate</label><input defaultValue={this.state.newEndDate} onFocus={()=>{this.showDatePicker("newEndDate")}} placeholder="endDate" name="newEndDate"/></Form.Field>
                                <Form.Field><label>Property</label><Input checked={this.state.newProperty} type="checkbox" onChange={this.toggleProperty} name="newProperty"/></Form.Field>
                                <Button onClick={this.closeEdit} color="red">Annuler</Button>
                                <Button onClick={this.saveEdit} color="blue">Sauvegarder</Button>
                            </Form>
                        </Table.Cell>
                    </Table.Row>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </Fragment>
            )
        }else{
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell>{this.props.vehicle.societe.name}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.registration}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.firstRegistrationDate}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.km}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.lastKmUpdate}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.brand}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.model}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.volume+" m²"}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.payload+" t."}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.color}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.insurancePaid}</Table.Cell>
                        <Table.Cell>{this.props.vehicle.endDate}</Table.Cell>
                        <Table.Cell>
                            {(
                                this.props.vehicle.property?<Label color='green' horizontal>
                                    Owned
                                </Label>:<Label color='red' horizontal>
                                    Rental
                                </Label>
                            )}
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
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withRouter(withUserContext(VehiclesRow));