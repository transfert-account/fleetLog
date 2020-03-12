import React, { Component, Fragment } from 'react'
import { Table, Input, Button, Label, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker'
import moment from 'moment'

import gql from 'graphql-tag';

class BatimentControlRowGroup extends Component {

    state={
        _id:this.props.control._id,
        newName:this.props.control.name,
        newDelay:this.props.control.delay,
        newLastExecution:this.props.control.lastExecution,
        openDatePicker:false,
        openDelete:false,
        openUpdate:false,
        datePickerTarget:"",
        deleteBatimentControlQuery : gql`
            mutation deleteBatimentControl($_id:String!){
                deleteBatimentControl(_id:$_id){
                    status
                    message
                }
            }
        `,
        editBatimentControlQuery : gql`
            mutation editBatimentControl($_id:String!,$name:String!,$delay:Int!){
                editBatimentControl(_id:$_id,name:$name,delay:$delay){
                    status
                    message
                }
            }
        `,
        updateBatimentControlQuery : gql`
            mutation updateBatimentControl($_id:String!,$lastExecution:String!){
                updateBatimentControl(_id:$_id,lastExecution:$lastExecution){
                    status
                    message
                }
            }
        `
    }

    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
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

    closeUpdate = () => {
        this.setState({openUpdate:false})
    }
    showUpdate = () => {
        this.setState({openUpdate:true})
    }

    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }

    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }

    updateBatimentControl = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.updateBatimentControlQuery,
            variables:{
                _id:this.props.control._id,
                lastExecution:this.state.newLastExecution
            }
        }).then(({data})=>{
            data.updateBatimentControl.map(qrm=>{
                if(qrm.status){
                    this.closeUpdate();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    deleteBatimentControl = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteBatimentControlQuery,
            variables:{
                _id:this.props.control._id,
            }
        }).then(({data})=>{
            data.deleteBatimentControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editBatimentControlQuery,
            variables:{
                _id:this.state._id,
                name:this.state.newName,
                delay:parseInt(this.state.newDelay)
            }
        }).then(({data})=>{
            data.editBatimentControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    getNextExecutionLabel = (date,delay) => {
        let nextDate = moment(date,"DD/MM/YYYY").add(delay, 'days');
        let daysLeft = parseInt(nextDate.diff(moment(),'day', true))
        if(daysLeft <= 0){
            return <Label color="black"> {nextDate.fromNow()}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        if(daysLeft > 0 && daysLeft <= 28){
            return <Label color="red"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        if(daysLeft > 28 && daysLeft <= 56){
            return <Label color="orange"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        return <Label color="green"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
    }

    getActionsCell = () => {
        if(this.props.user.isOwner){
            return (
                <Table.Cell style={{textAlign:"center"}}>
                    <Button circular style={{color:"#2ecc71"}} inverted icon icon='calendar' onClick={this.showUpdate}/>
                    <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showEdit}/>
                    <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
                </Table.Cell>
            )
        }else{
            return (
                <Table.Cell style={{textAlign:"center"}}>
                    <Button circular style={{color:"#2ecc71"}} inverted icon icon='calendar' onClick={this.showUpdate}/>
                    <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showEdit}/>
                </Table.Cell>
            )
        }
    }

    loadBatiments = () => {
        this.props.loadBatiments();
    }

    render() {
        if(this.state.editing){
            return (
                <Table.Row>
                    <Table.Cell textAlign="center">{this.props.societe.name}</Table.Cell>
                    <Table.Cell textAlign="center"><Input defaultValue={this.state.newName} onChange={this.handleChange} placeholder="Nom du crontrôle " name="newName"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input defaultValue={this.state.newDelay} onChange={this.handleChange} placeholder="Delai entre deux exécution" name="newDelay"/></Table.Cell>
                    <Table.Cell textAlign="center">{this.props.control.lastExecution}</Table.Cell>
                    <Table.Cell textAlign="center">{this.getNextExecutionLabel(this.props.control.lastExecution,this.props.control.delay)}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button onClick={this.closeEdit} color="red">Annuler</Button>
                        <Button onClick={this.saveEdit} color="blue">Sauvegarder</Button>
                    </Table.Cell>
                </Table.Row>
            )
        }else{
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell textAlign="center">{this.props.societe.name}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.control.name}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.control.delay} jours</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.control.lastExecution}</Table.Cell>
                        <Table.Cell textAlign="center">{this.getNextExecutionLabel(this.props.control.lastExecution,this.props.control.delay)}</Table.Cell>
                        {this.getActionsCell()}
                    </Table.Row>
                    <Modal closeOnDimmerClick={false} size="small" open={this.state.openUpdate} onClose={this.closeUpdate} closeIcon>
                        <Modal.Header>
                            Mise à jour la date de dernière exécution
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form>
                                <Form.Field><label>Dernière exécution (date)</label><Input onChange={this.handleChange} value={this.state.newLastExecution} onFocus={()=>{this.showDatePicker("newLastExecution")}} placeholder="Date du dernier contrôle"/></Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeUpdate}>Annuler</Button>
                            <Button color="green" onClick={this.updateBatimentControl}>Valider</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal closeOnDimmerClick={false} size="small" open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Suppression du contrôle
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteBatimentControl}>Supprimer le contrôle</Button>
                        </Modal.Actions>
                    </Modal>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
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
  
export default wrappedInUserContext = withUserContext(BatimentControlRowGroup);