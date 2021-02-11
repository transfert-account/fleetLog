import React, { Component, Fragment } from 'react';
import { Button, Form, TextArea, Icon, Checkbox, Input, Segment, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import DocStateLabel from '../atoms/DocStateLabel';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { gql } from 'apollo-server-express';
import _ from 'lodash';
import moment from 'moment';

export class AccidentTabularDeclaration extends Component {

    state={
        datePickerTarget:"",
        newVehicle:this.props.accident.vehicle._id,
        newOccurenceDate:this.props.accident.occurenceDate,
        newConstatSent:this.props.accident.constatSent,
        newDateExpert:this.props.accident.dateExpert,
        newDateTravaux:this.props.accident.dateTravaux,
        newCost:this.props.accident.cost,
        newConstat:null,
        newRapportExp:null,
        newFacture:null,
        openDatePicker:false,
        newDescription:this.props.accident.description,
        editAccidentQuery : gql`
            mutation editAccident($_id:String!,$occurenceDate:String!,$dateExpert:String!,$dateTravaux:String!,$constatSent:Boolean!,$cost:Float!){
                editAccident(_id:$_id,occurenceDate:$occurenceDate,dateExpert:$dateExpert,dateTravaux:$dateTravaux,constatSent:$constatSent,cost:$cost){
                    status
                    message
                }
            }
        `,
        editDescAccidentQuery : gql`
            mutation editDescAccident($_id:String!,$description:String!){
                editDescAccident(_id:$_id,description:$description){
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
    handleEditDesc = (e,{value}) => {
        this.setState({
            newDescription:value
        });
        this.editDesc();
    }
    handleConstatSentChange = checked => {
        this.setState({
            newConstatSent:checked
        });
    }
    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
            })
        }
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    editDesc = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editDescAccidentQuery,
            variables:{
                _id:this.props.accident._id,
                description:this.state.newDescription
            }
        }).then(({data})=>{
            data.editDescAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    },1000);
    editAccident = () => {
        this.props.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editAccidentQuery,
            variables:{
                _id:this.props.accident._id,
                occurenceDate:this.state.newOccurenceDate,
                dateExpert:this.state.newDateExpert,
                dateTravaux:this.state.newDateTravaux,
                constatSent:this.state.newConstatSent,
                cost:parseFloat(this.state.newCost),
            }
        }).then(({data})=>{
            data.editAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAccident();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    /*CONTENT GETTERS*/
    getInfosPanel = () => {
        if(this.props.editing){
            return (
                <Form className="formBoard editing" style={{gridTemplateRows:"auto auto auto auto auto 1fr"}}>
                    <div className="labelBoard">Societé :</div><div className="valueBoard">{this.props.accident.societe.name}</div>
                    <Form.Field>
                        <label>Date de l'accident</label>
                        <Input value={this.state.newOccurenceDate} onFocus={()=>{this.showDatePicker("newOccurenceDate")}} name="newOccurenceDate"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Date du passage de l'expert</label>
                        <Input value={this.state.newDateExpert} onFocus={()=>{this.showDatePicker("newDateExpert")}} name="newDateExpert"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Date des travaux</label>
                        <Input value={this.state.newDateTravaux} onFocus={()=>{this.showDatePicker("newDateTravaux")}} name="newDateTravaux"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Cout total de l'accident</label>
                        <Input defaultValue={this.state.newCost} onChange={this.handleChange} name="newCost"/>
                    </Form.Field>
                    <Form.Field style={{gridColumnEnd:"span 2",placeSelf:"center"}}>
                        <label>Constat envoyé à l'assurance</label>
                        <Checkbox defaultChecked={this.state.newConstatSent} onChange={(e,{checked})=>{this.handleConstatSentChange(checked)}} toggle />
                    </Form.Field>
                    <Button style={{placeSelf:"center stretch",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={this.props.closeEdit}>Annuler<Icon name='cancel'/></Button>
                    <Button style={{placeSelf:"center stretch",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.editAccident}>Sauvegarder<Icon name='check'/></Button>
                </Form>
            )
        }else{
            return(
                <div className="formBoard displaying" style={{gridTemplateRows:"auto auto auto auto auto auto 1fr"}}>
                    <div className="labelBoard">Societé :</div><div className="valueBoard">{this.props.accident.societe.name}</div>
                    <div className="labelBoard">Date de l'accident :</div><div className="valueBoard">{this.props.accident.occurenceDate}</div>
                    <div className="labelBoard">Date de passage de l'expert :</div><div className="valueBoard">{this.props.accident.dateExpert}</div>
                    <div className="labelBoard">Date des travaux :</div><div className="valueBoard">{this.props.accident.dateTravaux}</div>
                    <div className="labelBoard">Constat envoyé à l'assurance :</div><div className="valueBoard">{this.getConstatSentLabel()}</div>
                    <div className="labelBoard">Coût total de l'accident:</div><div className="valueBoard">{this.props.accident.cost} €</div>
                </div>
            )
        }
    }
    getConstatSentLabel = () => {
        if(this.props.accident.constatSent){
            return <Label color="green">Constat envoyé</Label>
        }else{
            return <Label color="red">En attente</Label>
        }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Fragment>
            <Segment attached="bottom" style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto 1fr",placeSelf:"stretch",gridColumnEnd:"span 2"}}>
                {this.getInfosPanel()}
                <div style={{display:"flex",justifyContent:"center"}}>
                    <DocStateLabel opened color={this.props.accident.constat._id == "" ? "red" : "green"} title="Constat"/>
                    <DocStateLabel opened color={this.props.accident.rapportExp._id == "" ? "red" : "green"} title="Rapport de l'expert"/>
                    <DocStateLabel opened color={this.props.accident.facture._id == "" ? "red" : "green"} title="Facture"/>
                </div>
                <Form style={{gridColumnEnd:"span 2",placeSelf:"stretch"}}>
                    <Form.Field style={{margin:"32px 64px"}}>
                        <label>Notes concernant l'accident </label>
                        <TextArea style={{border:"2px solid #d9d9d9",height:"100%",width:"100%"}} defaultValue={this.state.newDescription} onChange={this.handleEditDesc} placeholder="Notes concernant l'accident"/>
                    </Form.Field>
                </Form>
            </Segment>
            <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
        </Fragment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(AccidentTabularDeclaration);