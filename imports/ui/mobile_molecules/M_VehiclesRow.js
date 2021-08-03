import React, { Component } from 'react'
import { Segment, Icon, Label, Button, Popup, Loader } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';
import DocStateLabel from '../atoms/DocStateLabel';

import moment from 'moment';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class M_VehiclesRow extends Component {

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
            <div>
                <Loader inline='centered' active/>
            </div>
        )
    }
    getPayementProgress = () => {
        let totalMonths = this.props.vehicle.purchasePrice/this.props.vehicle.monthlyPayement;
        let monthsDone = parseInt(moment().diff(moment(this.props.vehicle.payementBeginDate,"DD/MM/YYYY"),'months', true));
        let monthsLeft = totalMonths - monthsDone;
        if(this.props.vehicle.financialInfosComplete){
            if(parseInt(monthsLeft) <= 0 || this.props.vehicle.payementFormat == "CPT"){
                return <div textAlign="center"><Label color="green">Propriété</Label></div>
            }else{
                if(this.props.vehicle.payementFormat == "CRB"){
                    return <div textAlign="center"><Label color="orange"> {parseInt(monthsLeft)} mois restant</Label></div>
                }
                if(this.props.vehicle.payementFormat == "CRC"){
                    return <div textAlign="center"><Label color="green"> {parseInt(monthsLeft)} mois restant</Label></div>
                }
            }
        }
    }
    getFinancialInfosCompleteCell = () => {
        if(this.props.vehicle.financialInfosComplete){
            return (
                <div textAlign='center'>
                    <Icon color='green' name='checkmark' size='large'/>
                </div>
            )
        }else{
            return (
                <div textAlign='center' colSpan="2">
                    <Icon color='red' name='cancel' size='large'/>
                </div>
            )
        }
    }
    getLastReportCell = () => {
        let days = parseInt(moment().diff(moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY"),'days'));
        if(days < 9){
            return (
                <div textAlign="center">
                    <Label color="green"> 
                        {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                    </Label>
                </div>
            )
        }
        if(days >= 14){
            return (
                <div textAlign="center">
                    <Label color="red"> 
                        {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                    </Label>
                </div>
            )
        }
        if(days >= 9){
            return (
                <div textAlign="center">
                    <Label color="orange"> 
                        {moment(this.props.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()}
                    </Label>
                </div>
            )
        }
    }
    getSpecialCell = () => {
        return(
            <div textAlign="center">
                <Popup content={(this.props.vehicle.shared ? (this.props.full && this.props.vehicle.sharedTo ? "En prêt vers " + this.props.vehicle.sharedTo.name : "Chargement ...") : "Le véhicule n'est pas en prêt")} trigger={
                    <Button circular color={(this.props.vehicle.shared ? "teal":"")} icon="handshake"/>
                }/>
                {this.getSellingButton()}
                <Popup content={(this.props.vehicle.broken ? "Le véhicule est en panne" : "Le véhicule n'est pas en panne")} trigger={
                    <Button circular color={(this.props.vehicle.broken ? "teal":"")} icon="wrench"/>
                }/>
            </div>
        )
    }
    getSellingButton = () => {
        if(this.props.vehicle.selling){
            return (
                <Popup content={"Le véhicule est en vente"} trigger={
                    <Button circular color={"teal"} icon="cart"/>
                }/>
            )
        }else{
            if(this.props.vehicle.sold){
                return(
                    <Popup content={"Le véhicule est vendu"} trigger={
                        <Button circular color={"orange"} icon="cart"/>
                    }/>
                )
            }else{
                return(
                    <Popup content={"Le véhicule n'est pas en vente"} trigger={
                        <Button circular icon="cart"/>
                    }/>
                )
            }
        }
    }
    getDescCell = () => {
        if(this.props.full && this.props.vehicle.brand && this.props.vehicle.model && this.props.vehicle.energy){
            return(
                <div textAlign="center">{this.props.vehicle.brand.name + " - " + this.props.vehicle.model.name + " (" + this.props.vehicle.energy.name + ")"}</div>
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
                <div textAlign="center">{this.props.vehicle.volume.meterCube+" m²"}</div>
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
                <div textAlign="center">
                    <DocStateLabel color={this.props.vehicle.cg._id == "" ? "red" : "green"} title="Carte grise"/>
                    <DocStateLabel color={this.props.vehicle.cv._id == "" ? "red" : "green"} title="Carte verte"/>
                </div>
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
                <Segment onClick={this.navigateToVehicle} style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",cursor:"pointer"}}>
                    
                    {this.getSpecialCell()}
                    <h1 textAlign="center">{this.props.vehicle.registration}</h1>
                    <div textAlign="center">{this.props.vehicle.societe.name}</div>
                    <div textAlign="center">{this.props.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</div>
                    {this.getLastReportCell()}
                    {this.getDescCell()}
                    {this.getVolumeCell()}
                    <div textAlign="center">{this.props.vehicle.payload} kg</div>
                    {this.getFinancialInfosCompleteCell()}
                    {this.getPayementProgress()}
                    {this.getDocsStates()}
                </Segment>
            )
        }else{
            return(
                <Segment>
                    <div textAlign="center">{this.props.vehicle.societe.name}</div>
                    {this.getSpecialCell()}
                    <div textAlign="center">{this.props.vehicle.registration}</div>
                    <div textAlign="center">{this.props.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km</div>
                    {this.getLastReportCell()}
                    {this.getLoaderCell()}
                    {this.getLoaderCell()}
                    <div textAlign="center">{this.props.vehicle.payload} kg</div>
                    {this.getLoaderCell()}
                    {this.getLoaderCell()}
                    {this.getLoaderCell()}
                    <ActionsGridCell actions={this.state.rowActions}/>
                </Segment>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withRouter(withUserContext(M_VehiclesRow));