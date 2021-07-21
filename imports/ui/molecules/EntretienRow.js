import React, { Component, Fragment } from 'react'
import { Table, Label, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';

import { withRouter } from 'react-router-dom';

class EntretienRow extends Component {

    state={
        status:[{status:0,label:"En attente",color:"blue"},{status:1,label:"Affecté",color:"blue"},{status:2,label:"Réalisé",color:"green"},{status:3,label:"Clos",color:"grey"}],
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
        if(this.props.entretien.type == "obli"){
            return(
                <Label image>
                    <Icon style={{margin:"0"}} name='clipboard check'/>
                    <Label.Detail>OBLIGATOIRE</Label.Detail>
                </Label>
            )
        }else{
            if(this.props.entretien.type == "prev"){
                return(
                    <Label image>
                        <Icon style={{margin:"0"}} name='clipboard check'/>
                        <Label.Detail>PRÉVENTIF</Label.Detail>
                    </Label>
                )
            }else{
                if(this.props.entretien.type == "cura"){
                    return(
                        <Label color="grey" image>
                            <Icon style={{margin:"0"}} name='wrench'/>
                            <Label.Detail>CURATIF</Label.Detail>
                        </Label>
                    )
                }
            }
        }
    }
    getEntretienOrigin = () => {
        console.log(this.props.entretien)
        if(this.props.entretien.originNature != null){
            return this.props.entretien.originNature.name
        }else{
            return this.props.entretien.originControl.name
        }
    }
    getEntretienAffectation = () => {
        if(this.props.entretien.user._id != null){
            return (
                <Fragment>
                    <Table.Cell collapsing textAlign="center">{this.props.entretien.user.lastname + " " + this.props.entretien.user.firstname}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.props.entretien.occurenceDate}</Table.Cell>
                </Fragment>
            )
        }else{
            return <Table.Cell collapsing colSpan="2" textAlign="center">Non affecté</Table.Cell>
        }
    }
    getEntretienStatus = () => {
        let s = this.state.status.filter(s=>s.status == this.props.entretien.status)[0];
        return(
            <Label size="large" style={{margin:"0",placeSelf:"center"}} color={s.color}>
                {s.label}
            </Label>
        )
    }
    
    /*COMPONENTS LIFECYCLE*/
    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell collapsing textAlign="center">{this.props.entretien.societe.name}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.getEntretienType()}</Table.Cell>
                    <Table.Cell collapsing>{this.getEntretienOrigin()}</Table.Cell>
                    <Table.Cell>{this.props.entretien.notes[0].text}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.getEntretienStatus()}</Table.Cell>
                    {this.getEntretienAffectation()}
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