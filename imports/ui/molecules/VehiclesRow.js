import React, { Component } from 'react'
import { Table, Icon, Label, Button, Popup, Loader } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import DocStateLabel from '../atoms/DocStateLabel';

import moment from 'moment';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class VehiclesRow extends Component {

    state={
        rowActions:[
            {color:"blue",click:()=>{this.navigateToVehicle()},icon:"arrow right",tooltip:"Voir le véhicule"},
        ]
    }

    navigateToVehicle = () => {
        this.props.history.push("/parc/vehicle/"+this.props.vehicle._id);
    }
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    getLoaderCell = () => {
        return (
            <Table.Cell>
                <Loader inline='centered' active/>
            </Table.Cell>
        )
    }
    getPayementProgress = () => {
        let totalMonths = this.props.vehicle.purchasePrice/this.props.vehicle.monthlyPayement;
        let monthsDone = parseInt(moment().diff(moment(this.props.vehicle.payementBeginDate,"DD/MM/YYYY"),'months', true));
        let monthsLeft = totalMonths - monthsDone;
        if(this.props.vehicle.financialInfosComplete){
            if(parseInt(monthsLeft) <= 0 || this.props.vehicle.payementFormat == "CPT"){
                return <Table.Cell textAlign="center"><Label color="green">Propriété</Label></Table.Cell>
            }else{
                if(this.props.vehicle.payementFormat == "CRB"){
                    return <Table.Cell textAlign="center"><Label color="orange"> {parseInt(monthsLeft)} mois restant</Label></Table.Cell>
                }
                if(this.props.vehicle.payementFormat == "CRC"){
                    return <Table.Cell textAlign="center"><Label color="green"> {parseInt(monthsLeft)} mois restant</Label></Table.Cell>
                }
            }
        }
    }
    getFinancialInfosCompleteCell = () => {
        if(this.props.vehicle.financialInfosComplete){
            return (
                <Table.Cell textAlign='center'>
                    <Icon color='green' name='checkmark' size='large'/>
                </Table.Cell>
            )
        }else{
            return (
                <Table.Cell textAlign='center' colSpan="2">
                    <Icon color='red' name='cancel' size='large'/>
                </Table.Cell>
            )
        }
    }
    getLastReportCell = () => {
        let days = parseInt(moment().diff(moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY"),'days'));
        if(days < 9){
            return (
                <Table.Cell textAlign="center">
                    <Label color="green"> 
                        {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                    </Label>
                </Table.Cell>
            )
        }
        if(days >= 14){
            return (
                <Table.Cell textAlign="center">
                    <Label color="red"> 
                        {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                    </Label>
                </Table.Cell>
            )
        }
        if(days >= 9){
            return (
                <Table.Cell textAlign="center">
                    <Label color="orange"> 
                        {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                    </Label>
                </Table.Cell>
            )
        }
        return (
            <Table.Cell textAlign="center">
                <Label color="black"> 
                    DATE INVALIDE
                </Label>
            </Table.Cell>
        )
    }
    getSpecialCell = () => {
        return(
            <Table.Cell textAlign="center">
                <Popup content={(this.props.vehicle.shared ? (this.props.full && this.props.vehicle.sharedTo ? "En prêt vers " + this.props.vehicle.sharedTo.name : "Chargement ...") : "Le véhicule n'est pas en prêt")} trigger={
                    <Button color={(this.props.vehicle.shared ? "teal":"")} icon="handshake"/>
                }/>
                {this.getSellingButton()}
                <Popup content={(this.props.vehicle.broken ? "Le véhicule est en panne" : "Le véhicule n'est pas en panne")} trigger={
                    <Button color={(this.props.vehicle.broken ? "teal":"")} icon="wrench"/>
                }/>
            </Table.Cell>
        )
    }
    getSellingButton = () => {
        if(this.props.vehicle.selling){
            return (
                <Popup content={"Le véhicule est en vente"} trigger={
                    <Button color={"teal"} icon="cart"/>
                }/>
            )
        }else{
            if(this.props.vehicle.sold){
                return(
                    <Popup content={"Le véhicule est vendu"} trigger={
                        <Button color={"orange"} icon="cart"/>
                    }/>
                )
            }else{
                return(
                    <Popup content={"Le véhicule n'est pas en vente"} trigger={
                        <Button icon="cart"/>
                    }/>
                )
            }
        }
    }
    getDescCell = () => {
        if(this.props.full && this.props.vehicle.brand && this.props.vehicle.model && this.props.vehicle.energy){
            return(
                <Table.Cell textAlign="center">{this.props.vehicle.brand.name + " - " + this.props.vehicle.model.name + " (" + this.props.vehicle.energy.name + ")"}</Table.Cell>
            )
        }else{
            return(
                this.getLoaderCell()
            )
        }
    }
    getVolumeCell = () => {
        if(this.props.full && this.props.vehicle.volume){
            return(
                <Table.Cell textAlign="center">{this.props.vehicle.volume.meterCube+" m²"}</Table.Cell>
            )
        }else{
            return(
                this.getLoaderCell()
            )
        }
    }
    getDocsStates = () => {
        if(this.props.full && this.props.vehicle.cg && this.props.vehicle.cg){
            return (
                <Table.Cell textAlign="center">
                    <DocStateLabel color={this.props.vehicle.cg._id == "" ? "red" : "green"} title="Carte grise"/>
                    <DocStateLabel color={this.props.vehicle.cv._id == "" ? "red" : "green"} title="Carte verte"/>
                </Table.Cell>
            )
        }else{
            return(
                this.getLoaderCell()
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/

    render() {
        if(this.props.full){
            return (
                <Table.Row>
                    <Table.Cell textAlign="center">{this.props.vehicle.societe.name}</Table.Cell>
                    {this.getSpecialCell()}
                    <Table.Cell textAlign="center">{this.props.vehicle.registration}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</Table.Cell>
                    {this.getLastReportCell()}
                    {this.getDescCell()}
                    {this.getVolumeCell()}
                    <Table.Cell textAlign="center">{this.props.vehicle.payload} kg</Table.Cell>
                    {this.getFinancialInfosCompleteCell()}
                    {this.getPayementProgress()}
                    {this.getDocsStates()}
                    <ActionsGridCell actions={this.state.rowActions}/>
                </Table.Row>
            )
        }else{
            return(
                <Table.Row>
                    <Table.Cell textAlign="center">{this.props.vehicle.societe.name}</Table.Cell>
                    {this.getSpecialCell()}
                    <Table.Cell textAlign="center">{this.props.vehicle.registration}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</Table.Cell>
                    {this.getLastReportCell()}
                    {this.getLoaderCell()}
                    {this.getLoaderCell()}
                    <Table.Cell textAlign="center">{this.props.vehicle.payload} kg</Table.Cell>
                    {this.getLoaderCell()}
                    {this.getLoaderCell()}
                    {this.getLoaderCell()}
                    <ActionsGridCell actions={this.state.rowActions}/>
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
  
export default wrappedInUserContext = withRouter(withUserContext(VehiclesRow));