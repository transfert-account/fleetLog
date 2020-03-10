import React, { Component, Fragment } from 'react'
import { Table, Icon, Message, Input, Label, Button, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class VehiclesRow extends Component {

    state={
        _id:this.props.vehicle._id,
        newSociete:this.props.vehicle.societe._id,
        displayDoc:false,
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
        editing:false,
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

    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
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

    toggleDisplayDoc = () => {
        this.setState({
            displayDoc:!this.state.displayDoc
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
        if(parseInt(monthsLeft <= 0) || this.props.vehicle.payementFormat == "CPT"){
            return <Table.Cell textAlign="center"><Label color="green">Propriété</Label></Table.Cell>
        }else{
            if(this.props.vehicle.payementFormat == "CRB"){
                return <Table.Cell textAlign="center"><Label color="orange"> {parseInt(monthsLeft)} mois restant</Label></Table.Cell>
            }
            if(this.props.vehicle.payementFormat == "CRC"){
                return <Table.Cell textAlign="center"><Label color="green"> {parseInt(monthsLeft)} mois restant</Label></Table.Cell>
            }
        }
    }

    getLastReportCell = () => {
        if(this.state.reportLateFilter == "all"){return true}else{
            let days = parseInt(moment().diff(moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY"),'days'));
            if(days < 14){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"green"}> 
                            {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
            if(days >= 28){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"red"}> 
                            {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
            if(days >= 14){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"orange"}> 
                            {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
        }
    }

    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign="center">{this.props.vehicle.societe.name}</Table.Cell>
        }
    }

    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <Label style={{cursor:"pointer"}} onClick={this.toggleDisplayDoc} color={this.props.vehicle.cg._id == "" ? "red" : "green"} image={this.state.displayDoc}>
                    <Icon style={{margin:"0"}} name='folder' />
                    {(this.state.displayDoc ?
                        <Label.Detail>Carte grise</Label.Detail>
                        :
                        ""
                    )}
                </Label>
                <Label style={{cursor:"pointer"}} onClick={this.toggleDisplayDoc} color={this.props.vehicle.cv._id == "" ? "red" : "green"} image={this.state.displayDoc}>
                    <Icon style={{margin:"0"}} name='folder' />
                    {(this.state.displayDoc ?
                        <Label.Detail>Carte verte</Label.Detail>
                        :
                        ""
                    )}
                </Label>
            </Table.Cell>
        )
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    {this.getSocieteCell()}
                    <Table.Cell textAlign="center">{this.props.vehicle.registration}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.firstRegistrationDate}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.energy.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</Table.Cell>
                    {this.getLastReportCell()}
                    <Table.Cell textAlign="center">{this.props.vehicle.brand.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.model.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.volume.meterCube+" m²"}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.payload} t.</Table.Cell>
                    {this.getPayementProgress()}
                    {this.getDocsStates()}
                    <Table.Cell textAlign="center">
                        <Button circular style={{color:"#2980b9"}} inverted icon icon='arrow right' onClick={this.navigateToVehicle}/>
                    </Table.Cell>
                </Table.Row>
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