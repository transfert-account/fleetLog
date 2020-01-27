import React, { Component, Fragment } from 'react'
import { Table, Button } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

class EntretienRow extends Component {

    state={
        _id:this.props.entretien._id
    }

    navigateToEntretien = () => {
        this.props.history.push("/entretien/"+this.state._id);
    }

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.entretien.vehicle.registration}</Table.Cell>
                    <Table.Cell>{this.props.entretien.title}</Table.Cell>
                    <Table.Cell>{this.props.entretien.description.substring(0,128)}</Table.Cell>
                    <Table.Cell style={{textAlign:"center"}}>
                        <Button circular style={{color:"#2980b9"}} inverted icon icon='arrow right' onClick={this.navigateToEntretien}/>
                    </Table.Cell>
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