import React, { Component, Fragment } from 'react'
import { Table, Icon, Message, Input, Label, Button, Modal, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import SocietePicker from '../atoms/SocietePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class LocationRow extends Component {

    state={
        _id:this.props.rental._id,
        newSociete:this.props.rental.societe._id,
        newRegistration:this.props.rental.registration,
        newFirstRegistrationDate:this.props.rental.firstRegistrationDate,
        newKm:this.props.rental.km,
        newLastKmUpdate:this.props.rental.lastKmUpdate,
        newBrand:this.props.rental.brand,
        newModel:this.props.rental.model,
        newVolume:this.props.rental.volume.meterCube,
        newPayload:this.props.rental.payload,
        newColor:this.props.rental.color,
        newInsurancePaid:this.props.rental.insurancePaid,
        newPayementBeginDate:this.props.rental.payementBeginDate,
        newProperty:this.props.rental.property,
        openDelete:false,
        openDocs:false,
        editing:false,
        editLocationQuery : gql`
            mutation editLocation($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$km:Int!,$lastKmUpdate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$insurancePaid:Float!,$payementBeginDate:String!,$property:Boolean!){
                editLocation(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,km:$km,lastKmUpdate:$lastKmUpdate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,payementBeginDate:$payementBeginDate,property:$property)
            }
        `,
        deleteLocationQuery : gql`
            mutation deleteLocation($_id:String!){
                deleteLocation(_id:$_id)
            }
        `,
    }

    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    
    navigateToLocation = () => {
        this.props.history.push("/parc/location/"+this.state._id);
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })    

    showDocs = () => {
        this.setState({openDocs:true})
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
 
    closeDocs = () => {
        this.setState({openDocs:false})
    }
    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }

    toggleProperty = () => {
        this.setState({
            newProperty:!this.state.newProperty
        })
    }
    
    closeEdit = () => {
        this.setState({editing:false})
    }
    showEdit = () => {
        this.setState({editing:true})
    }

    saveEdit = () => {
        this.closeEdit();
        this.props.client.mutate({
            mutation:this.state.editLocationQuery,
            variables:{
                _id:this.state._id,
                societe:this.state.newSociete,
                registration:this.state.newRegistration,
                firstRegistrationDate:this.state.newFirstRegistrationDate,
                km:parseFloat(this.state.newKm),
                lastKmUpdate:this.state.newLastKmUpdate,
                brand:this.state.newBrand,
                model:this.state.newModel,
                volume:parseFloat(this.state.newVolume),
                payload:parseFloat(this.state.newPayload),
                color:this.state.newColor,
                insurancePaid:parseFloat(this.state.newInsurancePaid),
                payementBeginDate:this.state.newPayementBeginDate,
                property:this.state.newProperty
            }
        }).then(({data})=>{
            this.props.loadLocation();
        })
    }

    downloadDoc = doc => {
        
    }
    
    uploadDoc = doc => {
        
    }

    getEndDateLabel = () => {
        let daysLeft = parseInt(moment().diff(moment(this.props.rental.endDate,"DD/MM/YYYY"),'days', true))
        if(daysLeft >= 7){
            return <Label color="red"> {moment(this.props.rental.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.rental.endDate}</Label>
        }
        if(daysLeft >= 7){
            return <Label color="orange"> {moment(this.props.rental.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.rental.endDate}</Label>
        }
        return <Label color="green"> {moment(this.props.rental.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.rental.endDate}</Label>
    }

    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign="center">{this.props.rental.societe.name}</Table.Cell>
        }
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    {this.getSocieteCell()}
                    <Table.Cell textAlign="center">{this.props.rental.registration}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</Table.Cell>
                    <Table.Cell textAlign="center">{moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY").fromNow()}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.brand.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.model.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.volume.meterCube+" m²"}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.payload} t.</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.fournisseur.name}</Table.Cell>
                    <Table.Cell textAlign="center">
                        {this.getEndDateLabel()}
                    </Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button circular style={{color:"#a29bfe"}} inverted icon icon='folder open' onClick={this.showDocs}/>
                        <Button circular style={{color:"#2980b9"}} inverted icon icon='arrow right' onClick={this.navigateToLocation}/>
                    </Table.Cell>
                </Table.Row>
                <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                    <Modal.Header>
                        Documents relatifs au location immatriculé : {this.props.rental.registration}
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
                <Modal closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmation de suppression 
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                Veuillez confirmer vouloir supprimer le véhicule immatriculé : {this.props.rental.registration}
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="red" onClick={this.deleteLocation}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
    
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withRouter(withUserContext(LocationRow));