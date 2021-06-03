import React, { Component, Fragment } from 'react'
import { Table, Label, Button } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import DocStateLabel from '../atoms/DocStateLabel';

import moment from 'moment';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class LocationRow extends Component {

    state={
        rowActions:[
            {color:"blue",click:()=>{this.navigateToLocation()},icon:"arrow right",tooltip:"Voir la location"},
        ]
    }

    navigateToLocation = () => {
        this.props.history.push("/parc/location/"+this.props.rental._id);
    }
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
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
    getDescCell = () => {
        return(
            <Table.Cell textAlign="center">{this.props.rental.brand.name + " - " + this.props.rental.model.name + " (" + this.props.rental.energy.name + ")"}</Table.Cell>
        )
    }
    getLastReportCell = () => {
            let days = parseInt(moment().diff(moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY"),'days'));
            if(days < 9){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"green"}> 
                            {moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
            if(days >= 14){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"red"}> 
                            {moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
            }
            if(days >= 9){
                return (
                    <Table.Cell textAlign="center">
                        <Label color={"orange"}> 
                            {moment(this.props.rental.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                        </Label>
                    </Table.Cell>
                )
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

    /*COMPONENTS LIFECYCLE*/
    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell textAlign="center">{this.props.rental.societe.name}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.registration}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</Table.Cell>
                    {this.getLastReportCell()}
                    {this.getDescCell()}
                    <Table.Cell textAlign="center">{this.props.rental.volume.meterCube+" m²"}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.rental.payload} kg</Table.Cell>
                    {this.getEndDateLabel()}
                    <Table.Cell textAlign="center">{this.props.rental.fournisseur.name}</Table.Cell>
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
  
export default wrappedInUserContext = withRouter(withUserContext(LocationRow));