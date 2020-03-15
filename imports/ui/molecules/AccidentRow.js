import React, { Component, Fragment } from 'react'
import { Table, Label, Icon, Message, Button, Modal, TextArea, Form, Checkbox, Input } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker';
import FileManagementPanel from '../atoms/FileManagementPanel';
import gql from 'graphql-tag';
import _ from 'lodash';

class AccidentRow extends Component {

    state={
        _id:this.props.accident._id,
        details:false,
        editing:false,
        openDocs:false,
        newVehicle:this.props.accident.vehicle._id,
        newOccurenceDate:this.props.accident.occurenceDate,
        newDescription:this.props.accident.description,
        newConstatSent:this.props.accident.constatSent,
        newDateExpert:this.props.accident.dateExpert,
        newDateTravaux:this.props.accident.dateTravaux,
        newRapportExp:this.props.accident.newRapportExp,
        newConstat:this.props.accident.newConstat,
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

    showDelete = () => {
        this.setState({openDelete:true})
    }
    closeDelete = () => {
        this.setState({openDelete:false})
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
    
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
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

    getConstatSentLabel = () => {
        if(this.props.accident.constatSent){
            return <Label color="green">Constat envoyé</Label>
        }else{
            return <Label color="red">En attente</Label>
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
                <div style={{gridColumnEnd:"span 2",marginTop:"24px",display:"grid",gridTemplateRows:"auto auto auto auto auto auto 1fr auto",gridTemplateColumns:"1fr 1fr",gridGap:"12px"}}>
                    <div className="labelBoard">Societé :</div><div className="valueBoard">{this.props.accident.societe.name}</div>
                    <div className="labelBoard">Date de l'accident :</div><div className="valueBoard">{this.props.accident.occurenceDate}</div>
                    <div className="labelBoard">Date de passage de l'expert :</div><div className="valueBoard">{this.props.accident.dateExpert}</div>
                    <div className="labelBoard">Date des travaux :</div><div className="valueBoard">{this.props.accident.dateTravaux}</div>
                    <div className="labelBoard">Constat envoyé à l'assurance :</div><div className="valueBoard">{this.getConstatSentLabel()}</div>
                    <div className="labelBoard">Coût total de l'accident:</div><div className="valueBoard">{this.props.accident.cost} €</div>
                    <Button color="blue" style={{gridColumnEnd:"span 2",justifySelf:"stretch",gridRowStart:"8"}} onClick={this.showEdit} icon labelPosition='right'>Editer<Icon name='edit'/></Button>
                </div>
            )
        }
    }

    getActionsCell = () => {
        if(this.props.user.isOwner){
            return (
                <Table.Cell textAlign="center">
                    <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showDetails}/>    
                    <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
                </Table.Cell>
            )
        }else{
            return (
                <Table.Cell textAlign="center">
                    <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showDetails}/>    
                </Table.Cell>
            )
        }
    }

    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return (<Table.Cell style={{textAlign:"center"}}>{this.props.accident.societe.name}</Table.Cell>)
        }
    }

    loadAccidents = () => {
        this.props.loadAccidents();
    }

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
                    <Table.Cell style={{textAlign:"center"}}>Docs here soon</Table.Cell>
                    {this.getActionsCell()}
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
                    <Modal.Content style={{textAlign:"center",display:"grid",gridGap:"16px",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"auto auto auto"}}>
                        <Button animated='fade' inverted onClick={this.closeDetails} style={{margin:"0",gridRowEnd:"span 2",gridColumnStart:"1"}} color="grey" size="huge">
                            <Button.Content hidden>
                                <Icon color="black" style={{margin:"0"}} name='list ul' />
                            </Button.Content>
                            <Button.Content visible>
                                <Icon color="black" style={{margin:"0"}} name='angle double left' />
                            </Button.Content>
                        </Button>
                        <Message style={{margin:"0",gridRowEnd:"span 2",gridColumnEnd:"span 2"}} icon='truck' header={this.props.accident.vehicle.registration} content={this.props.accident.vehicle.brand.name + " - " + this.props.accident.vehicle.model.name} />
                        <Button color="purple" animated='fade' inverted onClick={this.showDocs} style={{margin:"0",gridRowEnd:"span 2"}} color="grey" size="huge">
                            <Button.Content hidden>
                                <Icon color="black" style={{margin:"0"}} name='search' />
                            </Button.Content>
                            <Button.Content visible>
                                <Icon color="black" style={{margin:"0"}} name='folder' />
                            </Button.Content>
                        </Button>
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

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(AccidentRow);

//<Input value={this.state.newOccurenceDate} onFocus={()=>{this.showDatePicker("newOccurenceDate")}} placeholder="Date de l'accident"/>