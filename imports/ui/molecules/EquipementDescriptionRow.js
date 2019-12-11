import React, { Component, Fragment } from 'react'
import { Dropdown, Table, Icon, Message, Input, Label, Button, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker'
import gql from 'graphql-tag';

class EquipementDescriptionRow extends Component {

    state={
        _id:this.props.equipementDescription._id,
        newName:this.props.equipementDescription.name,
        newControlPeriodValue:this.props.equipementDescription.controlPeriodValue,
        newControlPeriodUnit:this.props.equipementDescription.controlPeriodUnit,
        newAlertStepValue:this.props.equipementDescription.alertStepValue,
        newAlertStepUnit:this.props.equipementDescription.alertStepUnit,
        newUnitType:this.props.equipementDescription.unitType,
        editing:false,
        editEquipementDescriptionQuery : gql`
            mutation editEquipementDescription($_id:String!,$name:String!,$controlPeriodValue:Int!,$controlPeriodUnit:String!,$alertStepValue:Int!,$alertStepUnit:String!,$unitType:String!){
                editEquipementDescription(_id:$_id,name:$name,controlPeriodValue:$controlPeriodValue,controlPeriodUnit:$controlPeriodUnit,alertStepValue:$alertStepValue,alertStepUnit:$alertStepUnit,unitType:$unitType){
                    _id
                    name
                    controlPeriodValue
                    controlPeriodUnit
                    alertStepValue
                    alertStepUnit
                    unitType
                }
            }
        `,
        deleteEquipementDescriptionQuery : gql`
            mutation deleteEquipementDescription($_id:String!){
                deleteEquipementDescription(_id:$_id){
                    _id
                    name
                    controlPeriodValue
                    controlPeriodUnit
                    alertStepValue
                    alertStepUnit
                    unitType
                }
            }
        `,
    }

    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    handleUnitTypeChange = (e, { value }) => {
        this.setState({
            newUnitType:value,
            newControlPeriodUnit:this.props.controlPeriodUnits.filter(cpu=>cpu.type.value == value)[0].units[0].value,
            newAlertStepUnit:this.props.controlPeriodUnits.filter(cpu=>cpu.type.value == value)[0].units[0].value
        })
    }
    handleUnitChange = (target,value) => {
        this.setState({
            [target]:value
        })
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }
    closeDelete = () => {
        this.setState({openDelete:false})
    }
    closeEdit = () => {
        this.setState({editing:false})
    }
    showEdit = () => {
        this.setState({editing:true})
    }

    deleteEquipementDescription = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteEquipementDescriptionQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            this.props.loadEquipementDescriptions();
        })
    }

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editEquipementDescriptionQuery,
            variables:{
                _id:this.state._id,
                name:this.state.newName,
                controlPeriodValue:parseInt(this.state.newControlPeriodValue),
                controlPeriodUnit:this.state.newControlPeriodUnit,
                alertStepValue:parseInt(this.state.newAlertStepValue),
                alertStepUnit:this.state.newAlertStepUnit,
                unitType:this.state.newUnitType
            }
        }).then(({data})=>{
            this.props.loadEquipementDescriptions();
        })
    }

    render() {
        if(this.state.editing){
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell colSpan="14" style={{padding:"32px"}}>
                            <Form style={{display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr 1fr 1fr",gridGap:"32px 128px"}}>
                                <Form.Field><label>Nom</label><input onChange={this.handleChange} value={this.state.newName} placeholder="Nom" name="newName"/></Form.Field>
                                <Form.Field style={{placeSelf:"center stretch"}}><label>Type de controle </label><Dropdown disabled defaultValue={this.state.newUnitType} placeholder='Choisir une unité' search selection onChange={this.handleUnitTypeChange} options={this.props.controlPeriodUnits.map(cpu=>cpu.type)} name="newControlPeriodUnit" /></Form.Field>
                                <Button onClick={this.closeEdit} color="red">Annuler</Button>
                                <Input defaultValue={this.state.newControlPeriodValue} style={{placeSelf:"center stretch"}} label={
                                    <Dropdown defaultValue={this.state.newControlPeriodUnit} options={this.props.controlPeriodUnits.filter(cpu=>cpu.type.value==this.state.newUnitType)[0].units} onChange={(e, { value })=>{this.handleUnitChange("newControlPeriodUnit",value)}} />
                                } labelPosition='right' onChange={this.handleChange} name="newControlPeriodValue" placeholder="Fréquence de controle"/>
                                <Input defaultValue={this.state.newAlertStepValue} style={{placeSelf:"center stretch"}} label={
                                    <Dropdown defaultValue={this.state.newAlertStepUnit} options={this.props.controlPeriodUnits.filter(cpu=>cpu.type.value==this.state.newUnitType)[0].units} onChange={(e, { value })=>{this.handleUnitChange("newAlertStepUnit",value)}} />
                                } labelPosition='right' onChange={this.handleChange} name="newAlertStepValue" placeholder="Seuil d'alerte"/>
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
                        <Table.Cell>{this.props.equipementDescription.name}</Table.Cell>
                        <Table.Cell textAlign="center" >{this.props.equipementDescription.alertStepValue + " " + this.props.controlPeriodUnits.filter(x=>x.type.value == this.props.equipementDescription.unitType)[0].units.filter(u=>u.value == this.props.equipementDescription.alertStepUnit)[0].text}</Table.Cell>
                        <Table.Cell textAlign="center" >{this.props.equipementDescription.controlPeriodValue + " " + this.props.controlPeriodUnits.filter(x=>x.type.value == this.props.equipementDescription.unitType)[0].units.filter(u=>u.value == this.props.equipementDescription.controlPeriodUnit)[0].text}</Table.Cell>
                        <Table.Cell style={{textAlign:"center"}}>
                            <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showEdit}/>    
                            <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
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
                                    Veuillez confirmer vouloir supprimer l'équipement : {this.props.equipementDescription.registration}
                                </Message.Content>
                            </Message>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="red" onClick={this.deleteEquipementDescription}>Supprimer</Button>
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
  
export default wrappedInUserContext = withUserContext(EquipementDescriptionRow);