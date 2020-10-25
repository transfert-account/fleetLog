import React, { Component, Fragment } from 'react'
import { Table, Label, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import DocStateLabel from '../atoms/DocStateLabel';

import { withRouter } from 'react-router-dom';

class EntretienRow extends Component {

    state={
        rowActions:[
            {color:"blue",click:()=>{this.navigateToEntretien()},icon:"arrow right",tooltip:"Voir l'entretien"},
        ]
    }

    navigateToEntretien = () => {
        this.props.history.push("/entretien/"+this.props.entretien._id);
    }
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    getEntretienType = () => {
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
    getSocieteCell = () => {
        if(!this.props.userLimited){
            return <Table.Cell textAlign="center">{this.props.entretien.societe.name}</Table.Cell>
        }
    }
    getOrderState = state => {
        if(state == 1){
            let q = this.props.entretien.commandes.filter(c=>c.status == 1).length;
            if(q>0){
                return (
                    <Table.Cell textAlign="center">
                        <Label color="grey" image>
                            <Icon style={{margin:"0"}} name='clipboard' />
                            <Label.Detail>{q}</Label.Detail>
                        </Label>
                    </Table.Cell>
                )
            }else{
                return(
                    <Table.Cell textAlign="center">
                        <Label image>
                            <Icon style={{margin:"0"}} name='clipboard' />
                            <Label.Detail>{q}</Label.Detail>
                        </Label>
                    </Table.Cell>
                )
            }
        }
        if(state == 2){
            let q = this.props.entretien.commandes.filter(c=>c.status == 2).length;
            if(q>0){
                return(
                    <Table.Cell textAlign="center">
                        <Label color="orange" image>
                            <Icon style={{margin:"0"}} name='truck' />
                            <Label.Detail>{q}</Label.Detail>
                        </Label>
                    </Table.Cell>
                )
            }else{
                return(
                    <Table.Cell textAlign="center">
                        <Label image>
                            <Icon style={{margin:"0"}} name='truck' />
                            <Label.Detail>{q}</Label.Detail>
                        </Label>
                    </Table.Cell>
                )
            }
        }
        if(state == 3){
            let q = this.props.entretien.commandes.filter(c=>c.status == 3).length;
            if(q>0){
                return(
                    <Table.Cell textAlign="center">
                        <Label color="green" image>
                            <Icon style={{margin:"0"}} name='check' />
                            <Label.Detail>{q}</Label.Detail>
                        </Label>
                    </Table.Cell>
                )
            }else{
                return(
                    <Table.Cell textAlign="center">
                        <Label image>
                            <Icon style={{margin:"0"}} name='check' />
                            <Label.Detail>{q}</Label.Detail>
                        </Label>
                    </Table.Cell>
                )
            }
        }
    }
    getDocsStates = () => {
        return (
            <Table.Cell textAlign="center">
                <DocStateLabel color={this.props.entretien.ficheInter._id == "" ? "red" : "green"} title="Fiche inter."/>
            </Table.Cell>
        )
    }
    /*COMPONENTS LIFECYCLE*/
    render() {
        return (
            <Fragment>
                <Table.Row>
                    {this.getSocieteCell()}
                    <Table.Cell textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    {this.getEntretienType()}
                    <Table.Cell>{this.props.entretien.title}</Table.Cell>
                    <Table.Cell>{this.props.entretien.description.substring(0,128)}</Table.Cell>
                    {this.getOrderState(1)}
                    {this.getOrderState(2)}
                    {this.getOrderState(3)}
                    {this.getDocsStates()}
                    <ActionsGridCell actions={this.state.rowActions}/>
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
  
export default wrappedInUserContext = withRouter(withUserContext(EntretienRow));