import React, { Component } from 'react';
import { Table, Button, Icon, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

export class PlanningRow extends Component {
    
    navigate = () => {
        this.props.navigateToEntretien(this.props.entretien._id);
    }

    triggerAffectToMe = () => {
        this.props.triggerAffectToMe(this.props.entretien._id)
    }

    render() {
        if(this.props.active == "unaffected"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    <Table.Cell style={{padding:"4px 32px"}} >{this.props.entretien.vehicle.registration}</Table.Cell>
                    <Table.Cell style={{padding:"4px 32px"}} >{this.props.entretien.title}</Table.Cell>
                    <Table.Cell>
                        <Button circular style={{color:"#3498db"}} inverted icon icon='arrow right' onClick={this.navigate}/>
                        <Button circular style={{color:"#2ecc71"}} inverted icon icon='calendar check outline' onClick={this.triggerAffectToMe}/>
                    </Table.Cell>
                </Table.Row>
            )
        }
        if(this.props.active == "affectedToMe"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    <Table.Cell style={{padding:"4px 32px"}} >{this.props.entretien.vehicle.registration}</Table.Cell>
                    <Table.Cell style={{padding:"4px 32px"}} >{this.props.entretien.title}</Table.Cell>
                    <Table.Cell style={{padding:"0"}} textAlign='center'>
                        {this.props.entretien.occurenceDate}
                    </Table.Cell>
                    <Table.Cell>
                        <Button circular style={{color:"#3498db"}} inverted icon icon='arrow right' onClick={this.navigate}/>
                    </Table.Cell>
                </Table.Row>
            )
        }
        if(this.props.active == "selectedDay"){
            return (
                <Table.Row key={this.props.entretien._id}>
                    <Table.Cell style={{padding:"4px 32px"}} >{this.props.entretien.vehicle.registration}</Table.Cell>
                    <Table.Cell style={{padding:"4px 32px"}} >{this.props.entretien.title}</Table.Cell>
                    <Table.Cell>
                        <Button circular style={{color:"#3498db"}} inverted icon icon='arrow right' onClick={this.navigate}/>
                    </Table.Cell>
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