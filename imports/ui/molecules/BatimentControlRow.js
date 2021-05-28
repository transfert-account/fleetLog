import React, { Component, Fragment } from 'react'
import { Table, Input, Button, Label, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import ModalDatePicker from '../atoms/ModalDatePicker'
import DocStateLabel from '../atoms/DocStateLabel';
import FileManagementPanel from '../atoms/FileManagementPanel';

import moment from 'moment'
import gql from 'graphql-tag';

class BatimentControlRow extends Component {

    state={
        _id:this.props.control._id,
        newName:this.props.control.name,
        newDelay:this.props.control.delay,
        newLastExecution:this.props.control.lastExecution,
        openDatePicker:false,
        openDelete:false,
        openUpdate:false,
        newFicheInter:null,
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
        `,
        uploadBatimentControlDocumentQuery : gql`
            mutation uploadBatimentControlDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadBatimentControlDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `
    }
    
    /*SHOW AND HIDE MODALS*/
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
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
    /*CHANGE HANDLERS*/
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
            })
        }
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
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
    loadBatiments = () => {
        this.props.loadBatiments();
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
    uploadDocFicheInter = () => {
        this.props.client.mutate({
            mutation:this.state.uploadBatimentControlDocumentQuery,
            variables:{
                _id:this.props.control._id,
                file:this.state.newFicheInter,
                type:"ficheInter",
                size:this.state.newFicheInter.size
            }
        }).then(({data})=>{
            data.uploadBatimentControlDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    /*CONTENT GETTERS*/
    getNextExecutionLabel = (date,delay) => {
        let nextDate = moment(date,"DD/MM/YYYY").add(delay, 'days');
        let daysLeft = parseInt(nextDate.diff(moment(),'day', true))
        if(daysLeft <= 0){
            return <Label color="red"> {nextDate.fromNow()}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        if(daysLeft > 0 && daysLeft <= 28){
            return <Label color="orange"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        if(daysLeft > 28 && daysLeft <= 56){
            return <Label color="yellow"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
        }
        return <Label color="green"> {moment().to(nextDate)}, le {nextDate.format("DD/MM/YYYY")}</Label>
    }
    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <DocStateLabel color={this.props.control.ficheInter._id == "" ? "red" : "green"} title="Fiche inter."/>
            </Table.Cell>
        )
    }
    getRowActions = () => {
        if(this.props.user.isOwner){
            let actions = [
                {color:"green",click:()=>{this.showUpdate()},icon:'calendar',tooltip:"Mettre à jour le contrôle de batiment"},
                {color:"blue",click:()=>{this.showEdit()},icon:'edit',tooltip:"Editer le contrôle de batiment"},
                {color:"purple",click:()=>{this.showDocs()},icon:'folder open',tooltip:"Gérer les documents"},
                {color:"red",click:()=>{this.showDelete()},icon:'trash',tooltip:"Supprimer le contrôle de batiment"}
            ];
            return actions;
        }else{
            let actions = [
                {color:"green",click:()=>{this.showUpdate()},icon:'calendar',tooltip:"Mettre à jour le contrôle de batiment"},
                {color:"blue",click:()=>{this.showEdit()},icon:'edit',tooltip:"Editer le contrôle de batiment"},
                {color:"purple",click:()=>{this.showDocs()},icon:'folder open',tooltip:"Gérer les documents"}
            ];
            return actions;
        }
    }
    /*COMPONENTS LIFECYCLE*/
    render() {
        if(this.state.editing){
            return (
                <Table.Row>
                    <Table.Cell textAlign="center">{this.props.control.societe.name}</Table.Cell>
                    <Table.Cell textAlign="center"><Input defaultValue={this.state.newName} onChange={this.handleChange} placeholder="Nom du contrôle " name="newName"/></Table.Cell>
                    <Table.Cell textAlign="center"><Input defaultValue={this.state.newDelay} onChange={this.handleChange} placeholder="Delai entre deux exécution" name="newDelay"/></Table.Cell>
                    <Table.Cell textAlign="center">{this.props.control.lastExecution}</Table.Cell>
                    <Table.Cell textAlign="center">{this.getNextExecutionLabel(this.props.control.lastExecution,this.props.control.delay)}</Table.Cell>
                    {this.getDocsStates()}
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
                        <Table.Cell textAlign="center">{this.props.control.societe.name}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.control.name}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.control.delay} jours</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.control.lastExecution}</Table.Cell>
                        <Table.Cell textAlign="center">{this.getNextExecutionLabel(this.props.control.lastExecution,this.props.control.delay)}</Table.Cell>
                        {this.getDocsStates()}
                        <ActionsGridCell actions={this.getRowActions()}/>
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
                    <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs au contrôle {this.props.control.name} de la societe : {this.props.control.societe.name}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"24px"}}>
                                <FileManagementPanel importLocked={this.state.newFicheInter == null} handleInputFile={this.handleInputFile} fileTarget="newFicheInter" uploadDoc={this.uploadDocFicheInter} fileInfos={this.props.control.ficheInter} title="Fiche d'intervention" type="ficheInter"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDocs}>Fermer</Button>
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
  
export default wrappedInUserContext = withUserContext(BatimentControlRow);