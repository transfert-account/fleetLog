import React, { Component, Fragment } from 'react';
import { Table, Popup, Button, Modal, Form, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ControlOccurrenceRow extends Component {

    state={
        openDatePicker:false,
        newLastControlDate:"",
        newLastControlKm:"",
        createEntretienFromControlQuery: gql`
            mutation createEntretienFromControl($vehicle:String!,$control:String!){
                createEntretienFromControl(vehicle:$vehicle,control:$control){
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
    addEntretien = v => {
        this.props.client.mutate({
            mutation:this.state.createEntretienFromControlQuery,
            variables:{
                vehicle:this.props.vehicle._id,
                control:this.props.c.control.key
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
    formatUnit = u => {
        if(u=="d")return"jours"
        if(u=="m")return"mois"
        if(u=="y")return"ans"
        if(u=="km")return"km"
        return "unité inconnue"
    }
    getEcheanceCell = c => {
        let color = "";
        let text = "";
        if(!c.selected){
            return (
                <Table.Cell textAlign="center">
                </Table.Cell>
            )
        }
        if(c.lastOccurrence == "none"){
            return (
                <Table.Cell textAlign="center">
                    <Label size="large" color={"grey"}>
                        Aucun contrôle précedent
                    </Label>
                </Table.Cell>
            )
        }else{
            if(parseInt(this.props.c.lastOccurrence) > parseInt(this.props.vehicle.km)){
                return (
                    <Table.Cell textAlign="center">
                        <Label size="large" color={"red"}>
                            Kilométrage du contrôle supérieur à celui du véhicule
                        </Label>
                    </Table.Cell>
                )
            }
            if(this.props.c.control.unit == "km"){
                let left = parseInt(this.props.vehicle.km - (parseInt(this.props.c.lastOccurrence) + parseInt(this.props.c.control.frequency)));
                if(left>=0){
                    color = "red"
                    text = " de retard"
                }else{
                    text = " restant"
                    if(left>-2000){color = "orange"}else{
                        if(left<=-2000){color = "green"}else{
                            color = "grey"
                        }
                    }
                }
                return (
                    <Table.Cell textAlign="center">
                        <Label size="large" color={color}>
                            {Math.abs(left).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " " + this.formatUnit("km") + text}
                        </Label>
                    </Table.Cell>
                )
            }else{
                let res = this.getTimeFromNow(moment(c.lastOccurrence,"DD/MM/YYYY").add(c.control.frequency,(this.props.c.control.unit == "m" ? "M" : this.props.c.control.unit)).format("DD/MM/YYYY"))
                return (
                    <Table.Cell textAlign="center">
                        <Label size="large" color={res.color}>
                            {res.text}
                        </Label>
                    </Table.Cell>
                )
            }
        }
    }
    getTimeFromNow = (time) => {
        let days = moment(time, "DD/MM/YYYY").diff(moment(),'days')
        if(days > 0){
            if(days > 25){
                return {text: Math.abs(days) + " jours restant",color:"green"}
            }else{
                return {text: Math.abs(days) + " jours restant",color:"orange"}
            }
        }else{
            return {text: Math.abs(days) + " jours de retard",color:"red"}
        }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {
        return (
            <Fragment>
                <Table.Row key={this.props.c.control.key}>
                    <Table.Cell collapsing textAlign="right">{this.props.c.control.name}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">
                        <Button.Group>
                            <Button onClick={()=>this.props.switchControl(false,this.props.c.control.key,false)} color={(this.props.c.selected ? "" : "grey")}>Non éligible</Button>
                            <Button onClick={()=>this.props.switchControl(true,this.props.c.control.key,false)} color={(this.props.c.selected ? "green" : "")}>Éligible</Button>
                        </Button.Group>
                    </Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.props.c.control.frequency + " " + this.formatUnit(this.props.c.control.unit)}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.props.c.control.alert + " " + this.formatUnit(this.props.c.control.alertUnit)}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{(this.props.c.lastOccurrence == "none" || !this.props.c.selected ? "-" : this.props.c.lastOccurrence + " " + (this.props.c.control.unit == "km" ? "km" : ""))}</Table.Cell>
                    {this.getEcheanceCell(this.props.c)}
                    <Table.Cell collapsing textAlign="center">
                        <Popup trigger={<Button disabled={!this.props.c.selected || this.props.c.entretien != null && this.props.c.entretien != ""} icon onClick={()=>this.addEntretien(this.props.c.control.key)} icon="alternate calendar outline"/>}>
                            Créer l'entretien
                        </Popup>
                        <Popup trigger={<Button style={{marginLeft:"32px"}} disabled={!this.props.c.selected || this.props.c.entretien == null || this.props.c.entretien == ""} color="blue" icon onClick={()=>this.props.history.push("/entretien/"+this.props.c.entretien)} icon="wrench"/>}>
                            Voir l'entretien
                        </Popup>
                        <Popup trigger={<Button disabled={!this.props.c.selected} color="blue" icon onClick={()=>this.props.history.push("/entretien/controls/"+this.props.c.control.key)} icon="clipboard check"/>}>
                            Voir le contrôle
                        </Popup>
                    </Table.Cell>
                </Table.Row>
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