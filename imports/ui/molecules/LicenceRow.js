import React, { Component, Fragment } from 'react'
import { Table, Dropdown, Icon, Message, Input, Button, Modal, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import VehiclePicker from '../atoms/VehiclePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import moment from 'moment';
import gql from 'graphql-tag';

class LicenceRow extends Component {

    state={
        _id:this.props.licence._id,
        editing:false,
        openDocs:false,
        openDatePicker:false,
        newSociete:this.props.licence.societe._id,
        newNumber:this.props.licence.number,
        newShiftName:this.props.licence.shiftName,
        newVehicle:this.props.licence.vehicle._id,
        newEndDate:this.props.licence.endDate,
        deleteLicenceQuery : gql`
            mutation deleteLicence($_id:String!){
                deleteLicence(_id:$_id)
            }
        `,
        editLicenceQuery : gql`
            mutation editLicence($_id:String!,$societe:String!,$number:String!,$vehicle:String!,$shiftName:String!,$endDate:String!){
                editLicence(_id:$_id,societe:$societe,number:$number,vehicle:$vehicle,shiftName:$shiftName,endDate:$endDate)
            }
        `,
    }

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

    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    
    handleChangeVehicle = _id => {
        this.setState({ newVehicle:_id })
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

    deleteLicence = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteLicenceQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            this.props.loadLicences();
        })
    }

    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
    }

    downloadDoc = doc => {
        
    }
    
    uploadDoc = doc => {
        
    }

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editLicenceQuery,
            variables:{
                _id:this.state._id,
                societe:this.state.newSociete,
                number:this.state.newNumber,
                vehicle:this.state.newVehicle,
                shiftName:this.state.newShiftName,
                endDate:this.state.newEndDate
            }
        }).then(({data})=>{
            this.props.loadLicences();
        })
    }

    getEndDateLabel = () => {
        let daysLeft = parseInt(moment().diff(moment(this.props.licence.endDate,"DD/MM/YYYY"),'days', true))
        if(daysLeft >= 7){
            return <Label color="red"> {moment(this.props.licence.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.licence.endDate}</Label>
        }
        if(daysLeft >= 7){
            return <Label color="orange"> {moment(this.props.licence.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.licence.endDate}</Label>
        }
        return <Label color="green"> {moment(this.props.licence.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.licence.endDate}</Label>
    }

    render() {
        if(this.state.editing){
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell textAlign="center"><Dropdown value={this.state.newSociete} placeholder='Choisir un société' search selection onChange={this.handleChangeSociete} options={this.props.societesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} name="newSociete" /></Table.Cell>
                        <Table.Cell textAlign="center"><Input value={this.state.newNumber} onChange={this.handleChange} placeholder="Numero de licence" name="newNumber"/></Table.Cell>
                        <Table.Cell textAlign="center"><VehiclePicker defaultValue={this.state.newVehicle} onChange={this.handleChangeVehicle}/></Table.Cell>
                        <Table.Cell textAlign="center"><Input defaultValue={this.state.newShiftName} onChange={this.handleChange} placeholder="Nom de tournée" name="newShiftName"/></Table.Cell>
                        <Table.Cell textAlign="center"><Input value={this.state.newEndDate} onChange={this.handleChange} onFocus={()=>{this.showDatePicker("newEndDate")}} name="newEndDate"/></Table.Cell>
                        <Table.Cell style={{textAlign:"center"}}>
                            <Button onClick={this.closeEdit} color="red">Annuler</Button>
                            <Button onClick={this.saveEdit} color="blue">Sauvegarder</Button>
                        </Table.Cell>
                    </Table.Row>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </Fragment>
            )
        }else{
            return (
                <Fragment>
                    <Table.Row>
                        <Table.Cell>{this.props.licence.societe.name}</Table.Cell>
                        <Table.Cell>{this.props.licence.number}</Table.Cell>
                        <Table.Cell>{this.props.licence.vehicle.registration}</Table.Cell>
                        <Table.Cell>{this.props.licence.shiftName}</Table.Cell>
                        <Table.Cell>{this.getEndDateLabel()}</Table.Cell>
                        <Table.Cell style={{textAlign:"center"}}>
                            <Button circular style={{color:"#a29bfe"}} inverted icon icon='folder open' onClick={this.showDocs}/>
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
                                    Veuillez confirmer vouloir supprimer la licence : {this.props.licence.number} ?
                                </Message.Content>
                            </Message>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="red" onClick={this.deleteLicence}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs à la licence : {this.props.licence.number}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"1fr auto 1fr",gridGap:"0 24px"}}>
                                <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 1</p>
                                <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 2</p>
                                <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                    <p className="gridLabel">Nom du fichier :</p>
                                    <p className="gridValue">Doc Name XYZ</p>
                                    <p className="gridLabel">Taille du fichier:</p>
                                    <p className="gridValue">1234 kB</p>
                                    <p className="gridLabel">Enregistré le :</p>
                                    <p className="gridValue">01/02/2019</p>
                                </Message>
                                <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                    <p className="gridLabel">Nom du fichier :</p>
                                    <p className="gridValue">Doc Name XYZ</p>
                                    <p className="gridLabel">Taille du fichier:</p>
                                    <p className="gridValue">1234 kB</p>
                                    <p className="gridLabel">Enregistré le :</p>
                                    <p className="gridValue">01/02/2019</p>
                                </Message>
                                <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                                <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                                <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                                <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDocs}>Fermer</Button>
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