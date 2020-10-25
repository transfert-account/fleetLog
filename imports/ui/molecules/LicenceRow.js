import React, { Component, Fragment } from 'react'
import { Table, Dropdown, Icon, Message, Input, Button, Modal, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import VehiclePicker from '../atoms/VehiclePicker';
import FileManagementPanel from '../atoms/FileManagementPanel';
import ModalDatePicker from '../atoms/ModalDatePicker';
import DocStateLabel from '../atoms/DocStateLabel';

import moment from 'moment';
import gql from 'graphql-tag';

class LicenceRow extends Component {

    state={
        _id:this.props.licence._id,
        editing:false,
        openDocs:false,
        openUnlink:false,
        openLink:false,
        openDatePicker:false,
        newLicence:null,
        newSociete:this.props.licence.societe._id,
        newNumber:this.props.licence.number,
        newShiftName:this.props.licence.shiftName,
        newVehicle:this.props.licence.vehicle._id,
        newEndDate:this.props.licence.endDate,
        deleteLicenceQuery : gql`
            mutation deleteLicence($_id:String!){
                deleteLicence(_id:$_id){
                    status
                    message
                }
            }
        `,
        editLicenceQuery : gql`
            mutation editLicence($_id:String!,$societe:String!,$number:String!,$shiftName:String!,$endDate:String!){
                editLicence(_id:$_id,societe:$societe,number:$number,shiftName:$shiftName,endDate:$endDate){
                    status
                    message
                }
            }
        `,
        unlinkLicenceQuery : gql`
            mutation unlinkLicence($_id:String!){
                unlinkLicence(_id:$_id){
                    status
                    message
                }
            }
        `,
        linkLicenceQuery : gql`
            mutation linkLicence($_id:String!$vehicle:String!){
                linkLicence(_id:$_id,vehicle:$vehicle){
                    status
                    message
                }
            }
        `,
        uploadLicenceDocumentQuery : gql`
            mutation uploadLicenceDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadLicenceDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
    }
    /*SHOW AND HIDE MODALS*/
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
    closeUnlink = () => {
        this.setState({openUnlink:false})
    }
    showUnlink = () => {
        this.setState({openUnlink:true})
    }
    closeLink = () => {
        this.setState({openLink:false})
    }
    showLink = () => {
        this.setState({openLink:true})
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
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
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    handleChangeVehicle = _id => {
        this.setState({ newVehicle:_id })
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    deleteLicence = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteLicenceQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteLicence.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadLicences();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocLicence = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLicenceDocumentQuery,
            variables:{
                _id:this.props.licence._id,
                file:this.state.newLicence,
                type:"licence",
                size:this.state.newLicence.size
            }
        }).then(({data})=>{
            data.uploadLicenceDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadLicences();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    saveEdit = () => {
        let newSociete;
        if(this.props.hideSociete){
            newSociete = this.props.licence.societe._id;
        }else{
            newSociete = this.state.newSociete;
        }
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editLicenceQuery,
            variables:{
                _id:this.state._id,
                societe:newSociete,
                number:this.state.newNumber,
                shiftName:this.state.newShiftName,
                endDate:this.state.newEndDate
            }
        }).then(({data})=>{
            data.editLicence.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadLicences();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unlinkLicence = () => {
        this.props.client.mutate({
            mutation:this.state.unlinkLicenceQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unlinkLicence.map(qrm=>{
                if(qrm.status){
                    this.closeUnlink();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadLicences();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    linkLicence = () => {
        this.props.client.mutate({
            mutation:this.state.linkLicenceQuery,
            variables:{
                _id:this.state._id,
                vehicle:this.state.newVehicle
            }
        }).then(({data})=>{
            data.linkLicence.map(qrm=>{
                if(qrm.status){
                    this.closeLink();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadLicences();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    /*CONTENT GETTERS*/
    getEndDateCell = () => {
        let daysLeft = parseInt(moment(this.props.licence.endDate,"DD/MM/YYYY").diff(moment(),'days', true))
        if(daysLeft <= 0){
            return (
                <Table.Cell textAlign="center">
                    {this.props.licence.endDate}
                    <Label style={{marginLeft:"16px"}} color="red"> {moment(this.props.licence.endDate, "DD/MM/YYYY").fromNow()}</Label>
                </Table.Cell>
            )
        }
        if(daysLeft > 0 && daysLeft <= 28){
            return (
                <Table.Cell textAlign="center">
                    {this.props.licence.endDate}
                    <Label style={{marginLeft:"16px"}} color="orange"> {moment(this.props.licence.endDate, "DD/MM/YYYY").fromNow()}</Label>
                </Table.Cell>
            )
        }
        return (
            <Table.Cell textAlign="center">
                {this.props.licence.endDate}
                <Label style={{marginLeft:"16px"}} color="green"> {moment(this.props.licence.endDate, "DD/MM/YYYY").fromNow()}</Label>
            </Table.Cell>
        )
    }
    getEditSocieteCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign="center"><Dropdown value={this.state.newSociete} placeholder='Choisir un société' search selection onChange={this.handleChangeSociete} options={this.props.societesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} name="newSociete" /></Table.Cell>
        }
    }
    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign="center">{this.props.licence.societe.name}</Table.Cell>
        }
    }
    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <DocStateLabel color={this.props.licence.licence._id == "" ? "red" : "green"} title="Licence"/>
            </Table.Cell>
        )
    }
    getRowActions = () => {
        if(this.props.user.isOwner){
            let actions = [
                {color:"blue",click:()=>{this.showEdit()},icon:'edit',tooltip:"Editer la licence"},
                {color:"purple",click:()=>{this.showDocs()},icon:'folder open',tooltip:"Gérer les documents"},
                {color:"red",click:()=>{this.showDelete()},icon:'trash',tooltip:"Supprimer la licence"}
            ];
            if(this.props.licence.vehicle._id != "" && this.props.licence.vehicle._id != null && this.props.licence.vehicle._id != undefined){
                actions.unshift({color:"red",click:()=>{this.showUnlink()},icon:'unlinkify',tooltip:"Dissocier le véhicule de la licence"})
            }else{
                actions.unshift({color:"green",click:()=>{this.showLink()},icon:'linkify',tooltip:"Associer un véhicule de la licence"})
            }
            return actions;
        }else{
            let actions = [
                {color:"blue",click:()=>{this.showEdit()},icon:'edit',tooltip:"Editer la licence"},
                {color:"purple",click:()=>{this.showDocs()},icon:'folder open',tooltip:"Gérer les documents"}
            ];
            if(this.props.licence.vehicle._id != "" && this.props.licence.vehicle._id != null && this.props.licence.vehicle._id != undefined){
                actions.unshift({color:"red",click:()=>{this.showUnlink()},icon:'unlinkify',tooltip:"Dissocier le véhicule de la licence"})
            }else{
                actions.unshift({color:"green",click:()=>{this.showLink()},icon:'linkify',tooltip:"Associer un véhicule de la licence"})
            }
            return actions;
        }
    }
    /*COMPONENTS LIFECYCLE*/
    render() {
        if(this.state.editing){
            return (
                <Fragment>
                    <Table.Row>
                        {this.getEditSocieteCell()}
                        <Table.Cell textAlign="center">
                            <Input value={this.state.newNumber} onChange={this.handleChange} placeholder="Numero de licence" name="newNumber"/>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            {this.props.licence.vehicle.registration}
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            <Input defaultValue={this.state.newShiftName} onChange={this.handleChange} placeholder="Nom de tournée" name="newShiftName"/>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            <Input value={this.state.newEndDate} onChange={this.handleChange} onFocus={()=>{this.showDatePicker("newEndDate")}} name="newEndDate"/>
                        </Table.Cell>
                        {this.getDocsStates()}
                        <Table.Cell textAlign="center">
                            <Button onClick={this.closeEdit} color="red">Annuler</Button>
                            <Button onClick={this.saveEdit} color="green">Sauvegarder</Button>
                        </Table.Cell>
                    </Table.Row>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </Fragment>
            )
        }else{
            return (
                <Fragment>
                    <Table.Row>
                        {this.getSocieteCell()}
                        <Table.Cell textAlign="center">{this.props.licence.number}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.licence.vehicle.registration}</Table.Cell>
                        <Table.Cell textAlign="center">{this.props.licence.shiftName}</Table.Cell>
                        {this.getEndDateCell()}
                        {this.getDocsStates()}
                        <ActionsGridCell actions={this.getRowActions()}/>
                    </Table.Row>
                    <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Veuillez confirmer vouloir supprimer la licence : {this.props.licence.number} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteLicence}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openUnlink} onClose={this.closeUnlink} closeIcon>
                        <Modal.Header>
                            Dissocier la licence {this.props.licence.number} de son véhicule ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeUnlink}>Annuler</Button>
                            <Button color="red" onClick={this.unlinkLicence}>Dissocier</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openLink} onClose={this.closeLink} closeIcon>
                        <Modal.Header>
                            Associer la licence à un véhicule
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <VehiclePicker societeRestricted={this.props.licence.societe._id} onChange={this.handleChangeVehicle}/>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeLink}>Annuler</Button>
                            <Button color="green" onClick={this.linkLicence}>Associer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs à la licence : {this.props.licence.number}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"24px"}}>
                                <FileManagementPanel importLocked={this.state.newLicence == null} handleInputFile={this.handleInputFile} fileTarget="newLicence" uploadDoc={this.uploadDocLicence} fileInfos={this.props.licence.licence} title="Licence" type="licence"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDocs}>Fermer</Button>
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
  
export default wrappedInUserContext = withUserContext(LicenceRow);