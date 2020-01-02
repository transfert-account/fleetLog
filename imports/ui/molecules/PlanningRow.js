import React, { Component } from 'react';
import { Table, Button, Icon, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

export class PlanningRow extends Component {
    
    navigate = () => {
        this.props.navigateToEntretien(this.props.entretien._id);
    }

    render() {
        return (
            <Table.Row key={this.props.entretien._id}>
                <Table.Cell style={{padding:"4px 32px"}} >{this.props.entretien.vehicle.registration}</Table.Cell>
                <Table.Cell style={{padding:"0"}} textAlign='center'>
                    {this.props.entretien.user}
                </Table.Cell>
                <Table.Cell>
                    <Button onClick={this.navigate} color="blue" animated='fade'>
                        <Button.Content hidden>Détails</Button.Content>
                        <Button.Content visible>
                            <Icon name='arrow right' />
                        </Button.Content>
                    </Button>
                </Table.Cell>
            </Table.Row>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
  export default withUserContext(PlanningRow);