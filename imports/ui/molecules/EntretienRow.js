import React, { Component, Fragment } from 'react'
import { Table, Label, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import ActionsGridCell from '../atoms/ActionsGridCell';

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
        if(this.props.entretien.originNature != null){
            return this.props.entretien.originNature.name
        }else{
            return this.props.entretien.originControl.name
        }
    }
    
    /*COMPONENTS LIFECYCLE*/
    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell collapsing textAlign="center">{this.props.entretien.societe.name}</Table.Cell>
                    <Table.Cell collapsing textAlign="center">{this.props.entretien.vehicle.registration}</Table.Cell>
                    <Table.Cell collapsing textAlign="right">{this.getEntretienType()}</Table.Cell>
                    <Table.Cell collapsing>{this.getEntretienOrigin()}</Table.Cell>
                    <Table.Cell>{this.props.entretien.notes[0].text}</Table.Cell>
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