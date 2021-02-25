import React, { Component, Fragment } from 'react';
import { Header, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import AccidentRow from './AccidentRow';

export class VehicleAgglomeratedAccidentsRow extends Component {

    state={}
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    getTableHeader = () => {
        if(this.props.userLimited){
            return(
              <Table.Header>
                  <Table.Row textAlign='center'>
                    <Table.HeaderCell>Vehicle</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Informations</Table.HeaderCell>
                    <Table.HeaderCell>Circonstances renseignées</Table.HeaderCell>
                    <Table.HeaderCell>Constat Envoyé</Table.HeaderCell>
                    <Table.HeaderCell>Responsabilité</Table.HeaderCell>
                    <Table.HeaderCell>Statut</Table.HeaderCell>
                    <Table.HeaderCell>Document</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
              </Table.Header>
            )
        }else{
            return(
              <Table.Header>
                  <Table.Row textAlign='center'>
                    <Table.HeaderCell>Societe</Table.HeaderCell>
                    <Table.HeaderCell>Vehicle</Table.HeaderCell>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Informations</Table.HeaderCell>
                    <Table.HeaderCell>Circonstances renseignées</Table.HeaderCell>
                    <Table.HeaderCell>Constat Envoyé</Table.HeaderCell>
                    <Table.HeaderCell>Responsabilité</Table.HeaderCell>
                    <Table.HeaderCell>Statut</Table.HeaderCell>
                    <Table.HeaderCell>Document</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
              </Table.Header>
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {
        return(
            <Fragment>
                <Header as="h2" floated="left">{this.props.vehicle.registration}</Header>
                <Header as="h2" floated="right">{this.props.vehicle.brand.name + " " + this.props.vehicle.model.name + " ("+this.props.vehicle.energy.name+")"}</Header>
                <Table celled selectable compact='very'>
                    {this.getTableHeader()}
                    <Table.Body>
                        {this.props.vehicle.accidents.map(a=>
                            <AccidentRow vehicle={this.props.vehicle} hideSociete={this.props.userLimited} loadAccidents={this.loadAccidents} key={a._id} accident={a}/>
                        )}
                    </Table.Body>
                </Table>
            </Fragment>
        )
    }
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(VehicleAgglomeratedAccidentsRow);