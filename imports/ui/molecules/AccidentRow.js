import React, { Component, Fragment } from 'react'
import { Table, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import DocStateLabel from '../atoms/DocStateLabel';

import gql from 'graphql-tag';

class AccidentRow extends Component {

    state={
        _id:this.props.accident._id,
        newVehicle:this.props.vehicle._id,
        newOccurenceDate:this.props.accident.occurenceDate,
        newDescription:this.props.accident.description,
        newConstatSent:this.props.accident.constatSent,
        newDateExpert:this.props.accident.dateExpert,
        newDateTravaux:this.props.accident.dateTravaux,
        newConstat:null,
        newRapportExp:null,
        newFacture:null,
        newCost:this.props.accident.cost
    }

    navigateToAccident = () => {
        this.props.history.push("/accident/"+this.props.accident._id);
    }
    /*SHOW AND HIDE MODALS*/
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
    /*DB READ AND WRITE*/
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
            return (<Table.Cell style={{textAlign:"center"}}>{this.props.vehicle.societe.name}</Table.Cell>)
        }
    }
    getRowActions = () => {
        let actions = [
            {color:"blue",click:()=>{this.navigateToAccident()},icon:'arrow right',tooltip:"Détails de l'accident"}
        ];
        return actions;
    }
    /*COMPONENTS LIFECYCLE*/
    render() {
        return (
            <Fragment>
                <Table.Row>
                    {this.getSocieteCell()}
                    <Table.Cell style={{textAlign:"center"}}>{this.props.vehicle.registration}</Table.Cell>
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