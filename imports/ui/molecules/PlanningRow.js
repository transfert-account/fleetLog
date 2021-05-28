import React, { Component } from 'react';
import { Table, Icon, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from "../atoms/ActionsGridCell";

export class PlanningRow extends Component {

    state={
        rowActionsUnaffected:[
            {color:"green",click:()=>{this.triggerAffectToMe()},icon:"calendar check outline",tooltip:"S'affecter l'entretien"},
            {color:"blue",click:()=>{this.navigate()},icon:"arrow right",tooltip:"Voir l'entretien"}
        ],
        rowActionsAffected:[
            {color:"red",click:()=>{this.triggerReleaseEntretien()},icon:"calendar check outline",tooltip:"Désaffecter l'entretien"},
            {color:"blue",click:()=>{this.navigate()},icon:"arrow right",tooltip:"Voir l'entretien"}
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
    getRowActionsAffected = () => {
        let actions = [];
        if(this.props.user._id == this.props.entretien.user._id || this.props.user.isAdmin){
            actions.push({color:"red",click:()=>{this.triggerReleaseEntretien()},icon:"calendar check outline",tooltip:"Désaffecter l'entretien"})
        }
        actions.push({color:"blue",click:()=>{this.navigate()},icon:"arrow right",tooltip:"Voir l'entretien"})
        return (actions)
    }
    getEntretienOriginCell = () => {
        if(this.props.entretien.originNature != null){
            return this.props.entretien.originNature.name
        }else{
            return this.props.entretien.originControl.name
        }
    }

    render() {
        if(this.props.active == "selectedDay"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    <Table.Cell textAlign="center">{this.props.entretien.user.firstname + " " +this.props.entretien.user.lastname}<br/>{this.props.entretien.societe.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    {this.getEntretienTypeCell()}
                    <Table.Cell textAlign="center">{this.getEntretienOriginCell()}</Table.Cell>
                    <ActionsGridCell actions={this.getRowActionsAffected()}/>
                </Table.Row>
            )
        }
        if(this.props.active == "affectedToMe"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    <Table.Cell textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    {this.getEntretienTypeCell()}
                    <Table.Cell textAlign="center">{this.getEntretienOriginCell()}</Table.Cell>
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
                    <Table.Cell textAlign="center">{this.props.entretien.societe.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    {this.getEntretienTypeCell()}
                    <Table.Cell textAlign="center">{this.getEntretienOriginCell()}</Table.Cell>
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