import React, { Component, Fragment } from 'react';
import { Table, Popup, Button, Modal, Form, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ControlOccurrenceRow extends Component {

    state={
        openDatePicker:false,
        openLastOccurence : false,
        newLastControlDate:"",
        newLastControlKm:"",
        unitsRaw:[
            {type:"distance",unit:"km",label:"km"},
            {type:"time",unit:"d",label:"jours"},
            {type:"time",unit:"m",label:"mois"},
            {type:"time",unit:"y",label:"ans"}
        ],
        createEntretienFromControlQuery: gql`
            mutation createEntretienFromControl($vehicle:String!,$control:String!){
                createEntretienFromControl(vehicle:$vehicle,control:$control){
                    status
                    message
                }
            }
        `,
        updateControlLastOccurrenceQuery: gql`
            mutation updateControlLastOccurrence($_id:String!,$vehicle:String!,$lastOccurrence:String!){
                updateControlLastOccurrence(_id:$_id,vehicle:$vehicle,lastOccurrence:$lastOccurrence){
                    status
                    message
                }
            }
        `,
    }
    
    /*SHOW AND HIDE MODALS*/
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    showLastOccurence = () => {
        this.setState({
            openLastOccurence : true
        })
    }
    closeLastOccurence = () => {
        this.setState({
            openLastOccurence : false
        })
    }
    /*CHANGE HANDLERS*/
    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    updateLastOccurence = () => {
        this.props.client.mutate({
            mutation:this.state.updateControlLastOccurrenceQuery,
            variables:{
                _id:this.props.c.control._id,
                vehicle:this.props.vehicle._id,
                lastOccurrence:(this.state.newLastControlDate != "" ? this.state.newLastControlDate : this.state.newLastControlKm)
            }
        }).then(({data})=>{
            data.updateControlLastOccurrence.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeLastOccurence();
                    this.props.loadVehicle();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    addEntretien = v => {
        this.props.client.mutate({
            mutation:this.state.createEntretienFromControlQuery,
            variables:{
                vehicle:this.props.vehicle._id,
                control:this.props.c.control._id
            }
        }).then(({data})=>{
            data.createEntretienFromControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadVehicle();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    /*CONTENT GETTERS*/
    getUnitLabel = unit => {
        return this.state.unitsRaw.filter(u=>u.unit == unit)[0].label;
    }
    getEcheanceCell = () => {
        return (
            <Table.Cell textAlign="center">
                {this.props.c.nextOccurrence}
                <Label style={{marginLeft:"24px"}} size="large" color={this.props.c.color}>
                    {this.props.c.label}
                </Label>
            </Table.Cell>
        )
    }
    getFrequencyLabel = () => {
        if(this.props.c.control.firstIsDifferent){
            return (this.props.c.control.firstFrequency + " " + this.getUnitLabel(this.props.c.control.unit) + " puis tous les " + this.props.c.control.frequency + " " + this.getUnitLabel(this.props.c.control.unit))
        }else{
            return (this.props.c.control.frequency + " " + this.getUnitLabel(this.props.c.control.unit))
        }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {
        return (
            <Fragment>
                <Table.Row key={this.props.c.control._id}>
                    <Table.Cell collapsing textAlign="right">{this.props.c.control.name}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">
                        <Button.Group>
                            <Button onClick={()=>this.props.switchControl(false,this.props.c.control._id,false)} color={(this.props.c.selected ? "" : "grey")}>Non éligible</Button>
                            <Button onClick={()=>this.props.switchControl(true,this.props.c.control._id,false)} color={(this.props.c.selected ? "green" : "")}>Éligible</Button>
                        </Button.Group>
                    </Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.getFrequencyLabel()}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.props.c.control.alert + " " + this.getUnitLabel(this.props.c.control.alertUnit)}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{(this.props.c.lastOccurrence == "none" || !this.props.c.selected ? "-" : this.props.c.lastOccurrence + " " + (this.props.c.control.unit == "km" ? "km" : ""))}</Table.Cell>
                    {this.getEcheanceCell()}
                    <Table.Cell collapsing textAlign="center">
                        <Popup position='top center' trigger={<Button disabled={!this.props.c.selected || this.props.c.entretien != null && this.props.c.entretien != ""} icon onClick={()=>this.addEntretien(this.props.c.control._id)} icon="calendar plus outline"/>}>
                            Créer l'entretien
                        </Popup>
                        <Popup position='top center' trigger={<Button style={{marginLeft:"24px"}} icon onClick={this.showLastOccurence} icon="edit"/>}>
                            Modifier le dernier contrôle manuellement
                        </Popup>
                        <Popup position='top center' trigger={<Button style={{marginLeft:"24px"}} disabled={!this.props.c.selected || this.props.c.entretien == null || this.props.c.entretien == ""} color="blue" icon onClick={()=>this.props.history.push("/entretien/"+this.props.c.entretien)} icon="wrench"/>}>
                            Voir l'entretien
                        </Popup>
                        <Popup position='top center' trigger={<Button disabled={!this.props.c.selected} color="blue" icon onClick={()=>this.props.history.push("/entretien/control/"+this.props.c.control._id+"/all")} icon="clipboard check"/>}>
                            Voir le contrôle
                        </Popup>
                    </Table.Cell>
                </Table.Row>
                <Modal open={this.state.openLastOccurence} onClose={this.closeLastOccurence} closeIcon>
                    <Modal.Header>
                        Mise à jour de la dernière réalisation du controle : {this.props.c.control.name}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateRows:"1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field className={(this.props.c.control.unit != "km" ? "" : "hide")}>
                                <label>Dernier controle (date)</label>
                                <input onChange={this.handleChange} value={this.state.newLastControlDate} onFocus={()=>{this.showDatePicker("newLastControlDate")}} placeholder="Date du dernier contrôle"/>
                            </Form.Field>
                            <Form.Field className={(this.props.c.control.unit != "km" ? "hide" : "")}>
                                <label>Kilométrage au dernier controle</label>
                                <input onChange={this.handleChange} value={this.state.newLastControlKm} name="newLastControlKm" placeholder="Kilométrage au dernier contrôle"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeLastOccurence}>Annuler</Button>
                        <Button color="blue" onClick={this.updateLastOccurence}>Mettre à jour</Button>
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
export default wrappedInUserContext = withUserContext(ControlOccurrenceRow);