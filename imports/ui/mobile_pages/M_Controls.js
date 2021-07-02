import React, { Component, Fragment } from 'react';
import { Label, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import EntretienMenu from '../molecules/EntretienMenu';
import ActionsGridCell from '../atoms/ActionsGridCell';
import { gql } from 'apollo-server-express';
import moment from 'moment';
import Societes from '../../startup/api/societe/societes';

export class Controls extends Component {

    state={
        rowActions : c => [
            {color:"blue",click:()=>{this.navigateToControl(c.control.key)},icon:"arrow right",tooltip:"Voir les véhicules concernés"},
        ],
        ctrlStats:[],
        ctrlStatsQuery : gql`
            query ctrlStats($ctrlType:String!,$societe:String!){
                ctrlStats(ctrlType:$ctrlType,societe:$societe){
                    control{
                        key
                        name
                        unit
                        frequency
                    }
                    affected
                    unaffected
                    total
                    inTime
                    soon
                    late
                }
            }
        `
    }

    navigateToControl = key => {
        this.props.history.push("/entretien/controls/" + key);
    }
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    loadCtrls = () => {
        this.props.client.query({
            query:this.state.ctrlStatsQuery,
            variables:{
                ctrlType:this.props.ctrlType,
                societe:this.props.societeFilter
            },
            fetchPolicy:'network-only'
        }).then(({data})=>{
            this.setState({
                ctrlStats:data.ctrlStats
            })
        });
    }

    /*CONTENT GETTERS*/
    formatUnit = u => {
        if(u=="m")return"mois"
        if(u=="y")return"ans"
        if(u=="km")return"km"
        return "unité inconnue"
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadCtrls()
    }

    render() {return (
        <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
            <EntretienMenu active={this.props.ctrlType}/>
            <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">Contrôle</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Fréquence</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">Éligible / Total</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">Non éligible / Total</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">A temps</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">Limite</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">En retard</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.ctrlStats.map(c=>{
                            return (
                                <Table.Row key={c.control.name}>
                                    <Table.Cell>{c.control.name}</Table.Cell>
                                    <Table.Cell textAlign="center">{c.control.frequency + " " + this.formatUnit(c.control.unit)}</Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Label>{c.affected + " / " + c.total}</Label>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Label>{c.unaffected + " / " + c.total}</Label>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Label color={(c.inTime == 0 ? "" : "green")}>{c.inTime}</Label>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Label color={(c.soon == 0 ? "" : "orange")}>{c.soon}</Label>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center">
                                        <Label color={(c.late == 0 ? "" : "red")}>{c.late}</Label>
                                    </Table.Cell>
                                    <ActionsGridCell actions={this.state.rowActions(c)}/>
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </div>
        </div>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(Controls);