import React, { Component } from 'react';
import { Table, Icon, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from "../atoms/ActionsGridCell";

export class PlanningRow extends Component {

    state={
        rowActionsUnaffected:[
            {color:"blue",click:()=>{this.navigate()},icon:"arrow right",tooltip:"Voir l'entretien"},
            {color:"green",click:()=>{this.triggerAffectToMe()},icon:"calendar check outline",tooltip:"S'affecter l'entretien"},
        ],
        rowActionsAffected:[
            {color:"green",click:()=>{this.navigate()},icon:"arrow right",tooltip:"Voir votre entretien"},
            {color:"red",click:()=>{this.triggerReleaseEntretien()},icon:"calendar check outline",tooltip:"Désaffecter l'entretien"}
        ]
    }
    
    navigate = () => {
        this.props.navigateToEntretien(this.props.entretien._id);
    }
    triggerAffectToMe = () => {
        this.props.triggerAffectToMe(this.props.entretien._id)
    }
    triggerReleaseEntretien = () => {
        this.props.triggerReleaseEntretien(this.props.entretien._id)
    }
    getSocieteCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign="center">{this.props.entretien.societe.name}</Table.Cell>
        }
    }
    getEntretienTypeCell = () => {
        if(this.props.entretien.fromControl){
            return(
                <Table.Cell textAlign="center">
                    <Label color="grey" image>
                        <Icon style={{margin:"0"}} name='clipboard check'/>
                        <Label.Detail>PRÉVENTIF</Label.Detail>
                    </Label>
                </Table.Cell>
            )
        }else{
            return(
                <Table.Cell textAlign="center">
                    <Label image>
                        <Icon style={{margin:"0"}} name='wrench'/>
                        <Label.Detail>CURATIF</Label.Detail>
                    </Label>
                </Table.Cell>
            )
        }
    }
    getUserCell = () => {
        if(!this.props.hideSociete){
            return <Table.Cell textAlign="center">{this.props.entretien.user.firstname + " " +this.props.entretien.user.lastname}<br/>{this.props.entretien.societe.name}</Table.Cell>
        }else{
            return <Table.Cell textAlign="center">{this.props.entretien.user.firstname + " " +this.props.entretien.user.lastname}</Table.Cell>
        }
    }
    getRowActionsAffected = () => {
        let actions = [
            {color:(this.props.user._id == this.props.entretien.user._id ? "green" : "blue"),click:()=>{this.navigate()},icon:"arrow right",tooltip:(this.props.user._id == this.props.entretien.user._id ? "Voir votre entretien" : "Voir l'entretien")},
        ];
        if(this.props.user._id == this.props.entretien.user._id || this.props.user.isAdmin){
            actions.push({color:"red",click:()=>{this.triggerReleaseEntretien()},icon:"calendar check outline",tooltip:"Désaffecter l'entretien"})
        }
        return (actions)
    }

    render() {
        if(this.props.active == "selectedDay"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    {this.getUserCell()}
                    <Table.Cell textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    {this.getEntretienTypeCell()}
                    <Table.Cell textAlign="center">{this.props.entretien.title}</Table.Cell>
                    <ActionsGridCell actions={this.getRowActionsAffected()}/>
                </Table.Row>
            )
        }
        if(this.props.active == "affectedToMe"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    <Table.Cell textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    {this.getEntretienTypeCell()}
                    <Table.Cell textAlign="center">{this.props.entretien.title}</Table.Cell>
                    <Table.Cell style={{padding:"0"}} textAlign='center'>
                        {this.props.entretien.occurenceDate}
                    </Table.Cell>
                    <ActionsGridCell actions={this.state.rowActionsAffected}/>
                </Table.Row>
            )
        }
        if(this.props.active == "unaffected"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    {this.getSocieteCell()}
                    <Table.Cell textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    {this.getEntretienTypeCell()}
                    <Table.Cell textAlign="center">{this.props.entretien.title}</Table.Cell>
                    <ActionsGridCell actions={this.state.rowActionsUnaffected}/>
                </Table.Row>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
  export default withUserContext(PlanningRow);