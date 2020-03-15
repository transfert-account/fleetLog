import React, { Component, Fragment } from 'react'
import { Table, Icon, Message, Label, Button, Modal } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import DocStateLabel from '../atoms/DocStateLabel';
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
 
    closeDocs = () => {
        this.setState({openDocs:false})
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

    getEndDateLabel = () => {
        let daysLeft = parseInt(moment().diff(moment(this.props.rental.endDate,"DD/MM/YYYY"),'days', true))
        if(daysLeft >= 7){
            return <Table.Cell textAlign="center"><Label color="red"> {moment(this.props.rental.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.rental.endDate}</Label></Table.Cell>
        }
        if(daysLeft >= 7){
            return <Table.Cell textAlign="center"><Label color="orange"> {moment(this.props.rental.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.rental.endDate}</Label></Table.Cell>
        }
        return <Table.Cell textAlign="center"><Label color="green"> {moment(this.props.rental.endDate, "DD/MM/YYYY").fromNow()}, le {this.props.rental.endDate}</Label></Table.Cell>
    }

    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign="center">{this.props.rental.societe.name}</Table.Cell>
        }
    }

    getLastReportCell = () => {
        if(this.state.reportLateFilter == "all"){return true}else{
            let days = parseInt(moment().diff(moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY"),'days'));
            if(days < 14){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"green"}> 
                            {moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
            if(days >= 28){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"red"}> 
                            {moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
            if(days >= 14){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"orange"}> 
                            {moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
        }
    }

    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <DocStateLabel color={this.props.rental.cg._id == "" ? "red" : "green"} title="Carte grise"/>
                <DocStateLabel color={this.props.rental.cg._id == "" ? "red" : "green"} title="Carte verte"/>
                <DocStateLabel color={this.props.rental.contrat._id == "" ? "red" : "green"} title="Contrat de location"/>
                <DocStateLabel color={this.props.rental.restitution._id == "" ? "red" : "green"} title="Restitution"/>
            </Table.Cell>
        )
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    {this.getSocieteCell()}
                    <Table.Cell textAlign="center">{this.props.rental.registration}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</Table.Cell>
                    {this.getLastReportCell()}
                    <Table.Cell textAlign="center">{this.props.rental.brand.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.model.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.volume.meterCube+" m²"}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.payload} t.</Table.Cell>
                    {this.getEndDateLabel()}
                    <Table.Cell textAlign="center">{this.props.rental.fournisseur.name}</Table.Cell>
                    {this.getDocsStates()}
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button circular style={{color:"#2980b9"}} inverted icon icon='arrow right' onClick={this.navigateToLocation}/>
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