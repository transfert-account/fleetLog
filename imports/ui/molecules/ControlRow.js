import React, { Component, Fragment } from 'react'
import { Table, Dropdown, Button, Modal, Form, Label, Icon, Header } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ControlEquipementRow from './ControlEquipementRow';
import ModalDatePicker from '../atoms/ModalDatePicker';
import DocStateLabel from '../atoms/DocStateLabel';
import gql from 'graphql-tag';
import 'moment/locale/fr';

class ControlRow extends Component {

    state={
        vehicle:this.props.vehicle._id,
        openAttachEquipement:false,
        newEquipement:null,
        dissociatingTarget:null,
        updateControlTarget:null,
        openDissociateEquipement:false,
        openUpdateControl:false,
        hideLastControlDate:"hide",
        hideLastControlKm:"hide",
        datePickerTarget:"",
        newAttachementDate:"",
        newLastControlDate:"",
        updateControlType:"",
        newUpdatedControlDate:"",
        newUpdatedControlKm:"",
        newLastControlKm:"",
        editing:false,
        equipementDescriptions : () => {
            return this.props.equipementDescriptionsRaw.map(e => {return{text:e.name,key:e._id,value:e._id}})
        },
        attachEquipementToVehicleQuery : gql`
            mutation attachEquipementToVehicle($vehicle:String!,$equipementDescription:String!,$attachementDate:String!,$lastControl:String!){
                attachEquipementToVehicle(vehicle:$vehicle,equipementDescription:$equipementDescription,attachementDate:$attachementDate,lastControl:$lastControl)
            }
        `,
    }
    
    /*SHOW AND HIDE MODALS*/
    showAttachEquipement = () => {
        this.setState({openAttachEquipement:true})
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeAttachEquipement = () => {
        this.setState({openAttachEquipement:false})
    }
    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    /*CHANGE HANDLERS*/
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    handleChangeEquipement = (e, { value }) => {
        if(this.props.equipementDescriptionsRaw.filter(x=>x._id == value)[0].controlPeriodUnit=="km"){
            this.setState({ newEquipement:value, hideLastControlKm:"",hideLastControlDate:"hide"})
        }else{
            this.setState({ newEquipement:value, hideLastControlDate:"",hideLastControlKm:"hide"})
        }
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    attachEquipement = () => {
        let newLastControl = "";
        if(this.props.equipementDescriptionsRaw.filter(x=>x._id == this.state.newEquipement)[0].controlPeriodUnit=="km"){
            newLastControl = this.state.newLastControlKm;
        }else{
            newLastControl = this.state.newLastControlDate;
        }
        this.closeAttachEquipement();
        this.props.client.mutate({
            mutation:this.state.attachEquipementToVehicleQuery,
            variables:{
                vehicle:this.state.vehicle,
                equipementDescription:this.state.newEquipement,
                lastControl:newLastControl,
                attachementDate:this.state.newAttachementDate
            }
        }).then(({data})=>{
            this.props.loadVehicles();
        })
    }
    
    /*CONTENT GETTERS*/
    getRed = () => {
        if(this.props.vehicle.red > 0){
            return (
                <Label color="red" image>
                    <Icon style={{margin:"0"}} name='warning sign' />
                    <Label.Detail>{this.props.vehicle.red}</Label.Detail>
                </Label>
            )
        }else{
            return (
                <Label color="grey" image>
                    <Icon style={{margin:"0"}} name='warning sign' />
                    <Label.Detail>{this.props.vehicle.red}</Label.Detail>
                </Label>
            )
        }
    }
    getOrange = () => {
        if(this.props.vehicle.orange > 0){
            return (
                <Label color="orange" image>
                    <Icon style={{margin:"0"}} name='clock' />
                    <Label.Detail>{this.props.vehicle.orange}</Label.Detail>
                </Label>
            )
        }else{
            return (
                <Label color="grey" image>
                    <Icon style={{margin:"0"}} name='clock' />
                    <Label.Detail>{this.props.vehicle.orange}</Label.Detail>
                </Label>
            )
        }
    }
    getGreen = () => {
        if(this.props.vehicle.green > 0){
            return (
                <Label color="green" image>
                    <Icon style={{margin:"0"}} name='check' />
                    <Label.Detail>{this.props.vehicle.green}</Label.Detail>
                </Label>
            )
        }else{
            if(this.props.vehicle.red == 0 && this.props.vehicle.orange == 0){
                return (
                    <Label color="green" image>
                        <Icon style={{margin:"0"}} name='check' />
                        <Label.Detail>{this.props.vehicle.green}</Label.Detail>
                    </Label>
                )
            }else{
                return (
                    <Label color="grey" image>
                        <Icon style={{margin:"0"}} name='check' />
                        <Label.Detail>{this.props.vehicle.green}</Label.Detail>
                    </Label>
                )
            }
        }
    }
    getAlertLabel = () => {
        return (
            <div style={{display:"inline"}}>
                {this.getRed()}
                {this.getOrange()}
                {this.getGreen()}
            </div>
        )
    }
    getTableHeader = () => {
        if(this.props.hideSociete){
            return(
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Véhicule</Table.HeaderCell>
                        <Table.HeaderCell>Nom</Table.HeaderCell>
                        <Table.HeaderCell>Attaché le</Table.HeaderCell>
                        <Table.HeaderCell>Dernier contrôle</Table.HeaderCell>
                        <Table.HeaderCell>Prochain contrôle</Table.HeaderCell>
                        <Table.HeaderCell>Documents</Table.HeaderCell>
                        <Table.HeaderCell>Entretien</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }else{
            return(
                <Table.Header>
                    <Table.Row textAlign='center'>
                        <Table.HeaderCell>Société</Table.HeaderCell>
                        <Table.HeaderCell>Véhicule</Table.HeaderCell>
                        <Table.HeaderCell>Nom</Table.HeaderCell>
                        <Table.HeaderCell>Attaché le</Table.HeaderCell>
                        <Table.HeaderCell>Dernier contrôle</Table.HeaderCell>
                        <Table.HeaderCell>Prochain contrôle</Table.HeaderCell>
                        <Table.HeaderCell>Documents</Table.HeaderCell>
                        <Table.HeaderCell>Entretien</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
            )
        }
    }
    getEquipementRows = () => {
        return(
            <Fragment>
                <Header as="h2" floated="left">{this.props.vehicle.registration}</Header>
                <Header as="h2" floated="right">{this.props.vehicle.brand.name + " " + this.props.vehicle.model.name + " ("+this.props.vehicle.energy.name+")"}</Header>
                <Table celled selectable compact='very'>
                    {this.getTableHeader()}
                    <Table.Body>
                        {this.props.vehicle.equipements.map(e=>
                            <ControlEquipementRow hideSociete={this.props.hideSociete} loadVehicles={this.props.loadVehicles} key={e._id} vehicle={this.props.vehicle} equipement={e}/>
                        )}
                    </Table.Body>
                </Table>
            </Fragment>
        )
    }
    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign='center'>{this.props.vehicle.societe.name}</Table.Cell>
        }
    }
    getDocsStates = () => {
        let redDocs = this.props.vehicle.equipements.filter(e=>e.controlTech._id == "").length;
        let greenDocs = this.props.vehicle.equipements.filter(e=>e.controlTech._id != "").length;
        return (
            <Table.Cell textAlign="center">
                {(greenDocs == 0 ? "": <DocStateLabel color="green" title={"("+greenDocs+") Contrôle technique"}/>)}
                {(redDocs == 0 ? "": <DocStateLabel color="red" title={"("+redDocs+") Contrôle technique"}/>)}
                {(redDocs == 0 && greenDocs == 0 ? "Aucun" : "")}
            </Table.Cell>
        )
    }

    /*COMPONENTS LIFECYCLE*/
    
    render() {
        return (
            <Fragment>
                {this.getEquipementRows()}
                <Modal closeOnDimmerClick={false} open={this.state.openAttachEquipement} onClose={this.closeAttachEquipement} closeIcon>
                    <Modal.Header>
                        Attacher un contrôle à ce véhicule :
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",margin:"auto 25%",gridTemplateRows:"1fr 1fr 1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field><label>Contrôle</label><Dropdown placeholder='Choisir un contrôle' search selection onChange={this.handleChangeEquipement} options={this.state.equipementDescriptions()}/></Form.Field>
                            <Form.Field><label>Attaché le </label><input onChange={this.handleChange} value={this.state.newAttachementDate} onFocus={()=>{this.showDatePicker("newAttachementDate")}} placeholder="Date de rattachement"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlDate}><label>Dernier controle (date)</label><input onChange={this.handleChange} value={this.state.newLastControlDate} onFocus={()=>{this.showDatePicker("newLastControlDate")}} placeholder="Date du dernier contrôle"/></Form.Field>
                            <Form.Field className={this.state.hideLastControlKm}><label>Kilométrage au dernier controle</label><input onChange={this.handleChange} value={this.state.newLastControlKm} name="newLastControlKm" placeholder="Kilométrage au dernier contrôle"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAttachEquipement}>Annuler</Button>
                        <Button color="blue" onClick={this.attachEquipement}>Attacher</Button>
                    </Modal.Actions>
                </Modal>
                <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(ControlRow);