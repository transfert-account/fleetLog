import React, { Component, Fragment } from 'react'
import { Table, Label, Icon, Message, Button, Modal, TextArea, Form, Checkbox, Input } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import BigButtonIcon from '../elements/BigIconButton';

import ActionsGridCell from '../atoms/ActionsGridCell';
import ModalDatePicker from '../atoms/ModalDatePicker';
import FileManagementPanel from '../atoms/FileManagementPanel';
import DocStateLabel from '../atoms/DocStateLabel';

import gql from 'graphql-tag';
import _ from 'lodash';

class AccidentRow extends Component {

    state={
        _id:this.props.accident._id,
        details:false,
        editing:false,
        openDocs:false,
        openArchive:false,
        openUnArchive:false,
        newVehicle:this.props.accident.vehicle._id,
        newOccurenceDate:this.props.accident.occurenceDate,
        newDescription:this.props.accident.description,
        newConstatSent:this.props.accident.constatSent,
        newDateExpert:this.props.accident.dateExpert,
        newDateTravaux:this.props.accident.dateTravaux,
        newConstat:null,
        newRapportExp:null,
        newFacture:null,
        newCost:this.props.accident.cost,
        deleteAccidentQuery : gql`
            mutation deleteAccident($_id:String!){
                deleteAccident(_id:$_id){
                    status
                    message
                }
            }
        `,
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
        uploadAccidentDocumentQuery : gql`
            mutation uploadAccidentDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadAccidentDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
        archiveAccidentQuery : gql`
            mutation archiveAccident($_id: String!) {
                archiveAccident(_id:$_id) {
                    status
                    message
                }
            }
        `,
        unArchiveAccidentQuery : gql`
            mutation unArchiveAccident($_id: String!) {
                unArchiveAccident(_id:$_id) {
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
    showArchive = () => {
        this.setState({openArchive:true})
    }
    closeArchive = () => {
        this.setState({openArchive:false})
    }
    showUnArchive = () => {
        this.setState({openUnArchive:true})
    }
    closeUnArchive = () => {
        this.setState({openUnArchive:false})
    }
    closeDetails = () => {
        this.setState({details:false})
    }
    showDetails = () => {
        this.setState({details:true})
    }
    closeEdit = () => {
        this.setState({editing:false})
    }
    showEdit = () => {
        this.setState({editing:true})
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false,newConstat:null,newRapportExp:null})
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
    /*DB READ AND WRITE*/
    editDesc = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editDescAccidentQuery,
            variables:{
                _id:this.state._id,
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
    uploadDocConstat = () => {
        this.props.client.mutate({
            mutation:this.state.uploadAccidentDocumentQuery,
            variables:{
                _id:this.props.accident._id,
                file:this.state.newConstat,
                type:"constat",
                size:this.state.newConstat.size
            }
        }).then(({data})=>{
            data.uploadAccidentDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAccidents();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocRapportExp = () => {
        this.props.client.mutate({
            mutation:this.state.uploadAccidentDocumentQuery,
            variables:{
                _id:this.props.accident._id,
                file:this.state.newRapportExp,
                type:"rapportExp",
                size:this.state.newRapportExp.size
            }
        }).then(({data})=>{
            data.uploadAccidentDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAccidents();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocFacture = () => {
        this.props.client.mutate({
            mutation:this.state.uploadAccidentDocumentQuery,
            variables:{
                _id:this.props.accident._id,
                file:this.state.newFacture,
                type:"facture",
                size:this.state.newFacture.size
            }
        }).then(({data})=>{
            data.uploadAccidentDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadAccidents();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteAccident = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteAccidentQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccidents();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    archiveAccident = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveAccidentQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.archiveAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccidents();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unArchiveAccident = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unArchiveAccidentQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.unArchiveAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccidents();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    editAccident = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editAccidentQuery,
            variables:{
                _id:this.state._id,
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
                    this.loadAccidents();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    loadAccidents = () => {
        this.props.loadAccidents();
    }
    /*CONTENT GETTERS*/
    getConstatSentLabel = () => {
        if(this.props.accident.constatSent){
            return <Label color="green">Constat envoyé</Label>
        }else{
            return <Label color="red">En attente</Label>
        }
    }
    getArchiveButton = () => {
        if(this.props.accident.archived){
            return <BigButtonIcon icon="check" color="green" onClick={this.showUnArchive} tooltip="Désarchiver"/>
        }else{
            return <BigButtonIcon icon="archive" color="orange" onClick={this.showArchive} tooltip="Archiver"/>
        }
    }
    getInfosPanel = () => {
        if(this.state.editing){
            return (
                <Form style={{gridColumnEnd:"span 2",marginTop:"24px",display:"grid",gridTemplateRows:"auto auto auto auto auto auto 1fr auto",gridTemplateColumns:"1fr 1fr",gridGap:"12px"}}>
                    <div className="labelBoard">Societé :</div><div className="valueBoard">{this.props.accident.societe.name}</div>
                    <Form.Field>
                        <label>Date de l'accident</label>
                        <Input defaultValue={this.state.newOccurenceDate} onFocus={()=>{this.showDatePicker("newOccurenceDate")}} name="newOccurenceDate"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Date du passage de l'expert</label>
                        <Input defaultValue={this.state.newDateExpert} onFocus={()=>{this.showDatePicker("newDateExpert")}} name="newDateExpert"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Date des travaux</label>
                        <Input defaultValue={this.state.newDateTravaux} onFocus={()=>{this.showDatePicker("newDateTravaux")}} name="newDateTravaux"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Cout total de l'accident</label>
                        <Input defaultValue={this.props.accident.cost} onChange={this.handleChange} name="newCost"/>
                    </Form.Field>
                    <Form.Field style={{gridColumnEnd:"span 2",placeSelf:"center"}}>
                        <label>Constat envoyé à l'assurance</label>
                        <Checkbox defaultChecked={this.state.newConstatSent} onChange={(e,{checked})=>{this.handleConstatSentChange(checked)}} toggle />
                    </Form.Field>
                    <Button style={{placeSelf:"center stretch",gridRowStart:"8",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={this.closeEdit}>Annuler<Icon name='cancel'/></Button>
                    <Button style={{placeSelf:"center stretch",gridRowStart:"8",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.editAccident}>Sauvegarder<Icon name='check'/></Button>
                </Form>
            )
        }else{
            return(
                <div style={{gridColumnEnd:"span 2",marginTop:"24px",display:"grid",gridTemplateRows:"auto auto auto auto auto auto 1fr",gridTemplateColumns:"1fr 1fr",gridGap:"12px"}}>
                    <div className="labelBoard">Societé :</div><div className="valueBoard">{this.props.accident.societe.name}</div>
                    <div className="labelBoard">Date de l'accident :</div><div className="valueBoard">{this.props.accident.occurenceDate}</div>
                    <div className="labelBoard">Date de passage de l'expert :</div><div className="valueBoard">{this.props.accident.dateExpert}</div>
                    <div className="labelBoard">Date des travaux :</div><div className="valueBoard">{this.props.accident.dateTravaux}</div>
                    <div className="labelBoard">Constat envoyé à l'assurance :</div><div className="valueBoard">{this.getConstatSentLabel()}</div>
                    <div className="labelBoard">Coût total de l'accident:</div><div className="valueBoard">{this.props.accident.cost} €</div>
                    <div style={{gridColumnEnd:"span 2",display:"flex",justifyContent:"center"}}>
                        <DocStateLabel opened color={this.props.accident.constat._id == "" ? "red" : "green"} title="Constat"/>
                        <DocStateLabel opened color={this.props.accident.rapportExp._id == "" ? "red" : "green"} title="Rapport de l'expert"/>
                        <DocStateLabel opened color={this.props.accident.facture._id == "" ? "red" : "green"} title="Facture"/>
                    </div>
                </div>
            )
        }
    }
    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <DocStateLabel color={this.props.accident.constat._id == "" ? "red" : "green"} title="Constat"/>
                <DocStateLabel color={this.props.accident.rapportExp._id == "" ? "red" : "green"} title="Rapport de l'expert"/>
                <DocStateLabel color={this.props.accident.facture._id == "" ? "red" : "green"} title="Facture"/>
            </Table.Cell>
        )
    }
    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return (<Table.Cell style={{textAlign:"center"}}>{this.props.accident.societe.name}</Table.Cell>)
        }
    }
    getRowActions = () => {
        if(this.props.user.isOwner){
            let actions = [
                {color:"blue",click:()=>{this.showDetails()},icon:'edit',tooltip:"Détails de l'accident"},
                {color:"red",click:()=>{this.showDelete()},icon:'trash',tooltip:"Supprimer l'accident"}
            ];
            return actions;
        }else{
            let actions = [
                {color:"blue",click:()=>{this.showDetails()},icon:'edit',tooltip:"Détails de l'accident"}
            ];
            return actions;
        }
    }
    /*COMPONENTS LIFECYCLE*/
    render() {
        return (
            <Fragment>
                <Table.Row>
                    {this.getSocieteCell()}
                    <Table.Cell style={{textAlign:"center"}}>{this.props.accident.vehicle.registration}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.props.accident.occurenceDate}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.props.accident.dateExpert}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.props.accident.dateTravaux}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        {this.getConstatSentLabel()}
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>{this.props.accident.cost} €</Table.Cell>
                    {this.getDocsStates()}
                    <ActionsGridCell actions={this.getRowActions()}/>
                </Table.Row>
                <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmation de suppression 
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid"}}>
                                Veuillez confirmer vouloir supprimer l'accident du véhicule : {this.props.accident.vehicle.registration} ?
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="red" onClick={this.deleteAccident}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size="large" closeOnDimmerClick={false} open={(this.state.details && !this.state.openDocs)} onClose={this.closeDetails} closeIcon>
                    <Modal.Header>
                        Gestion de l'accident du véhicule : {this.props.accident.vehicle.registration}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"auto 1fr 1fr auto",gridTemplateRows:"auto auto"}}>
                        <BigButtonIcon icon="angle double left" color="black" onClick={this.closeDetails} tooltip="Retour aux accidents"/>
                        <Message style={{margin:"0",gridColumnEnd:"span 2"}} icon='truck' header={this.props.accident.vehicle.registration} content={this.props.accident.vehicle.brand.name + " - " + this.props.accident.vehicle.model.name} />
                        <div style={{display:"flex",justifyContent:"flex-end"}}>
                            <BigButtonIcon icon="edit" color="blue" onClick={this.showEdit} tooltip="Éditer l'accident"/>
                            {this.getArchiveButton()}
                            <BigButtonIcon icon="folder open" color="purple" onClick={this.showDocs} tooltip="Gérer les documents"/>
                        </div>
                        {this.getInfosPanel()}
                        <Form style={{gridColumnEnd:"span 2"}}>
                            <Form.Field>
                                <label>Notes concernant l'accident </label>
                                <TextArea style={{height:"100%",width:"100%"}} defaultValue={this.state.newDescription} rows={16} onChange={this.handleEditDesc} placeholder="Notes concernant l'accident"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDetails}>Fermer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size='large' closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                    <Modal.Header>
                        Documents relatifs à l'accident du véhicule : {this.props.accident.vehicle.registration}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"24px"}}>
                            <FileManagementPanel importLocked={this.state.newConstat == null} handleInputFile={this.handleInputFile} fileTarget="newConstat" uploadDoc={this.uploadDocConstat} downloadDoc={this.downloadDocConstat} fileInfos={this.props.accident.constat} title="Constat" type="constat"/>
                            <FileManagementPanel importLocked={this.state.newRapportExp == null} handleInputFile={this.handleInputFile} fileTarget="newRapportExp" uploadDoc={this.uploadDocRapportExp} downloadDoc={this.downloadDocRapportExp} fileInfos={this.props.accident.rapportExp} title="Rapport de l'expert" type="rapportExp"/>
                            <FileManagementPanel importLocked={this.state.newFacture == null} handleInputFile={this.handleInputFile} fileTarget="newFacture" uploadDoc={this.uploadDocFacture} downloadDoc={this.downloadDocFacture} fileInfos={this.props.accident.facture} title="Rapport de l'expert" type="facture"/>
                        </div>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDocs}>Fermer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size='large' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                    <Modal.Header>
                        Archiver l'accident du véhicule : {this.props.accident.vehicle.registration} ?
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="orange" onClick={this.archiveAccident}>Archiver</Button>
                        <Button color="black" onClick={this.closeArchive}>Fermer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size='large' closeOnDimmerClick={false} open={this.state.openUnArchive} onClose={this.closeUnArchive} closeIcon>
                    <Modal.Header>
                        Désrchiver l'accident du véhicule : {this.props.accident.vehicle.registration} ?
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="green" onClick={this.unArchiveAccident}>Désarchiver</Button>
                        <Button color="black" onClick={this.closeUnArchive}>Fermer</Button>
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
  
export default wrappedInUserContext = withUserContext(AccidentRow);