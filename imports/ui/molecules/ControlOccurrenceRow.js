import React, { Component, Fragment } from 'react';
import { Table, Popup, Button, Modal, Form, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class ControlOccurrenceRow extends Component {

    state={
        openDatePicker:false,
        openUpdateControl: false,
        newLastControlDate:"",
        newLastControlKm:"",
        updateControlLastOccurrenceQuery:gql`
            mutation updateControlLastOccurrence($_id:String!,$key:String!,$lastOccurrence:String!){
                updateControlLastOccurrence(_id: $_id,key: $key,lastOccurrence: $lastOccurrence){
                    status
                    message
                }
            }
        `
    }
    
    /*SHOW AND HIDE MODALS*/
    closeUpdateControl = () => {
        this.setState({openUpdateControl:false,newLastControlDate:"",newLastControlKm:""})
    }
    showUpdateControl = () => {
        this.setState({openUpdateControl:true,newLastControlDate:"",newLastControlKm:""})
    }
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
    updateControl = () => {
        console.log(this.state.newLastControlDate)
        this.props.client.mutate({
            mutation:this.state.updateControlLastOccurrenceQuery,
            variables:{
                _id:this.props.vehicle._id,
                key:this.props.c.control.key,
                lastOccurrence:(this.state.newLastControlDate != "" ? this.state.newLastControlDate : this.state.newLastControlKm)
            }
        }).then((data)=>{
            this.closeUpdateControl()
            this.props.loadVehicle();
        });
    }
    /*CONTENT GETTERS*/
    formatUnit = u => {
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

    render() {return (
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
                <Table.Cell collapsing textAlign="center">{(this.props.c.lastOccurrence == "none" || !this.props.c.selected ? "-" : this.props.c.lastOccurrence + " " + (this.props.c.control.unit == "km" ? "km" : ""))}</Table.Cell>
                {this.getEcheanceCell(this.props.c)}
                <Table.Cell collapsing textAlign="center">
                    <Popup trigger={<Button disabled={!this.props.c.selected} color="blue" icon onClick={this.showUpdateControl} icon="alternate calendar outline"/>}>
                        Créer l'entretien
                    </Popup>
                    <Popup trigger={<Button disabled={!this.props.c.selected} color="blue" icon onClick={()=>this.props.history.push("/entretien/controls/"+this.props.c.control.key)} icon="arrow right"/>}>
                        Voir le contrôle
                    </Popup>
                </Table.Cell>
            </Table.Row>
            <Modal open={this.state.openUpdateControl} onClose={this.closeUpdateControl} closeIcon>
                <Modal.Header>
                    Mise à jour du dernier controle : {this.props.c.control.name}
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
                    <Button color="black" onClick={this.closeUpdateControl}>Annuler</Button>
                    <Button color="blue" onClick={this.updateControl}>Mettre à jour</Button>
                </Modal.Actions>
            </Modal>
            <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
        </Fragment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(ControlOccurrenceRow);