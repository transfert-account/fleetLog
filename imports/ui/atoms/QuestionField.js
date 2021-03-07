import React, { Component, Fragment } from 'react';
import { Form, Input, Popup, Button, TextArea } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker';
import BooleanDropdown from '../atoms/BooleanDropdown';
import MultiDropdown from '../atoms/MultiDropdown';
import AccWeatherPicker from '../atoms/AccWeatherPicker';
import AccRoadProfilePicker from '../atoms/AccRoadProfilePicker';
import AccTrackStatePicker from '../atoms/AccTrackStatePicker';
import AccPlacePicker from '../atoms/AccPlacePicker';
import AccCharacteristicPicker from '../atoms/AccCharacteristicPicker';

import { gql } from 'apollo-server-express';
import moment from 'moment';
export class QuestionField extends Component {

    state={
        newDateField:this.props.field.answer,
        openDatePicker:false
    }
    
    /*SHOW AND HIDE MODALS*/
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    /*CHANGE HANDLERS*/
    handleChange = e => {
        this.props.onChange(this.props.field.index-1,e.target.value)
    }
    handleChangeValue = value => {
        this.props.onChange(this.props.field.index-1,value)
    }
    handleChangeDropdown = value => {
        this.props.onChange(this.props.field.index-1,value)
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
        this.props.onChange(this.props.field.index-1,date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0'))
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    cancel = () => {
        this.props.cancel(this.props.field.index-1)
    }
    validate = () => {
        this.props.validate(this.props.field.index-1)
    }
    /*CONTENT GETTERS*/
    getValidateAction = () => {
        if(this.props.field.status == "validated"){
            return <Popup trigger={<Button color="grey" icon="edit" onClick={this.cancel} style={{placeSelf:"center"}}/>}>Annuler la validation de cette réponse</Popup>
        }else{
            return <Popup trigger={<Button color="green" icon="check" onClick={this.validate} style={{placeSelf:"center"}}/>}>Valider cette réponse</Popup>
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
    }

    render() {
        if(this.props.field.expected == "accWeather"){
            if(this.props.field.status == "validated"){
                return(
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <Input value={this.props.field.answer} disabled/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }else{
                return (
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <AccWeatherPicker returnRaw defaultValue={this.props.field.answer} disabled={this.props.field.status == "validated"} onChange={this.handleChangeDropdown}/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }
        }
        if(this.props.field.expected == "accPlace"){
            if(this.props.field.status == "validated"){
                return(
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <Input value={this.props.field.answer} disabled/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }else{
                return (
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <AccPlacePicker returnRaw defaultValue={this.props.field.answer} disabled={this.props.field.status == "validated"} onChange={this.handleChangeDropdown}/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }
        }
        if(this.props.field.expected == "accTrackState"){
            if(this.props.field.status == "validated"){
                return(
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <Input value={this.props.field.answer} disabled/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }else{
                return (
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <AccTrackStatePicker returnRaw defaultValue={this.props.field.answer} disabled={this.props.field.status == "validated"} onChange={this.handleChangeDropdown}/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }
        }
        if(this.props.field.expected == "accRoadProfile"){
            if(this.props.field.status == "validated"){
                return(
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <Input value={this.props.field.answer} disabled/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }else{
                return (
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <AccRoadProfilePicker returnRaw defaultValue={this.props.field.answer} disabled={this.props.field.status == "validated"} onChange={this.handleChangeDropdown}/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }
        }
        if(this.props.field.expected == "accCharacteristic"){
            if(this.props.field.status == "validated"){
                return(
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <Input value={this.props.field.answer} disabled/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }else{
                return (
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <AccCharacteristicPicker returnRaw defaultValue={this.props.field.answer} disabled={this.props.field.status == "validated"} onChange={this.handleChangeDropdown}/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                )
            }
        }
        if(this.props.field.expected == "constat"){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                    <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                        <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                        <MultiDropdown defaultValue={this.props.field.answer} disabled={this.props.field.status == "validated"} onChange={this.handleChangeValue}
                            options={[
                                { key: 'Oui', text: 'Oui', value: "Oui", label: { color: 'green', empty: true, circular: true }},
                                { key: "Non déclaré à l'assureur", text: "Non déclaré à l'assureur", value: "Non déclaré à l'assureur", label: { color: 'black', empty: true, circular: true }},
                                { key: 'Non', text: 'Non', value: "Non", label: { color: 'red', empty: true, circular: true }}
                            ]}
                        />
                    </Form.Field>
                    {this.getValidateAction()}
                </div>
            )
        }
        if(this.props.field.expected == "boolean"){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                    <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                        <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                        <BooleanDropdown defaultValue={this.props.field.answer} disabled={this.props.field.status == "validated"} onChange={this.handleChangeValue}/>
                    </Form.Field>
                    {this.getValidateAction()}
                </div>
            )
        }
        if(this.props.field.expected == "registration"){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                    <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                        <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                        <Input type="text" disabled={true} defaultValue={this.props.field.answer}/>
                    </Form.Field>
                    {this.getValidateAction()}
                </div>
            )
        }
        if(this.props.field.expected == "time"){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                    <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                        <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                        <Input type="time" disabled={this.props.field.status == "validated"} defaultValue={this.props.field.answer} onChange={this.handleChange}/>
                    </Form.Field>
                    {this.getValidateAction()}
                </div>
            )
        }
        if(this.props.field.expected == "date"){
            return (
                <Fragment>
                    <div style={{display:"grid",gridTemplateColumns:"1fr auto",marginRight:"28%"}}>
                        <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                            <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                            <Input disabled={this.props.field.status == "validated"} name="newDateField" onFocus={()=>{this.showDatePicker("newDateField")}} value={this.state.newDateField}/>
                        </Form.Field>
                        {this.getValidateAction()}
                    </div>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </Fragment>
            )
        }
        if(this.props.field.expected == "string"){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",marginRight:"28%"}}>
                    <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                        <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                        <Input disabled={this.props.field.status == "validated"} defaultValue={this.props.field.answer} type="text" onChange={this.handleChange} placeholder={this.props.field.expected} />
                    </Form.Field>
                    {this.getValidateAction()}
                </div>
            )
        }
        if(this.props.field.expected == "text"){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",marginRight:"28%"}}>
                    <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                        <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                        <TextArea rows={5} disabled={this.props.field.status == "validated"} defaultValue={this.props.field.answer} onChange={this.handleChange}/>
                    </Form.Field>
                    {this.getValidateAction()}
                </div>
            )
        }
        if(this.props.field.expected == "float"){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",marginRight:"28%"}}>
                    <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                        <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                        <Input disabled={this.props.field.status == "validated"} type="number" defaultValue={this.props.field.answer} onChange={this.handleChange}/>
                    </Form.Field>
                    {this.getValidateAction()}
                </div>
            )
        }
        return (
            <div style={{display:"grid",gridTemplateColumns:"1fr auto auto",marginRight:"28%"}}>
                <Form.Field style={{margin:"0 16px 16px 30%",textAlign:"left "}}>
                    <label>{this.props.page + "." + this.props.field.index + ") " + this.props.field.label}</label>
                    <Input error disabled type="text" value="Erreur : type de réponse non supportée"/>
                </Form.Field>
                <Popup trigger={<Button color="red" icon="check" style={{placeSelf:"center"}}/>}>Action impossible</Popup>
            </div>
        )
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(QuestionField);