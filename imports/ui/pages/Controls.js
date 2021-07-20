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
        unitsRaw:[
            {type:"distance",unit:"km",label:"km"},
            {type:"time",unit:"d",label:"jours"},
            {type:"time",unit:"m",label:"mois"},
            {type:"time",unit:"y",label:"ans"}
        ],
        ctrlStats:[],
        ctrlStatsQuery : gql`
            query ctrlStats($ctrlType:String!,$societe:String!){
                ctrlStats(ctrlType:$ctrlType,societe:$societe){
                    control{
                        _id
                        name
                        firstIsDifferent
                        firstFrequency
                        unit
                        frequency
                        alert
                        alertUnit
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

    navigateToControl = (_id,filter) => {
        this.props.history.push("/entretien/control/" + _id + "/" + filter);
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
    getUnitLabel = unit => {
        return this.state.unitsRaw.filter(u=>u.unit == unit)[0].label;
    }
    getFrequencyLabel = control => {
        if(control.firstIsDifferent){
            return (control.firstFrequency + " " + this.getUnitLabel(control.unit) + " puis tous les " + control.frequency + " " + this.getUnitLabel(control.unit))
        }else{
            return (control.frequency + " " + this.getUnitLabel(control.unit))
        }
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
                            <Table.HeaderCell textAlign="center">Seuil d'alerte</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">Éligible / Total</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">Non éligible / Total</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">A temps</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">Limite</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center">En retard</Table.HeaderCell>
                            <Table.HeaderCell collapsing textAlign="center"></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.ctrlStats.map(c=>{
                            return (
                                <Table.Row key={c.control.name}>
                                    <Table.Cell>{c.control.name}</Table.Cell>
                                    <Table.Cell textAlign="center">{this.getFrequencyLabel(c.control)}</Table.Cell>
                                    <Table.Cell textAlign="center">{c.control.alert + " " + this.getUnitLabel(c.control.alertUnit)}</Table.Cell>
                                    <Table.Cell style={{cursor:"pointer"}} onClick={()=>this.navigateToControl(c.control._id,"active")} textAlign="center">
                                        <Label>{c.affected + " / " + c.total}</Label>       
                                    </Table.Cell>
                                    <Table.Cell style={{cursor:"pointer"}} onClick={()=>this.navigateToControl(c.control._id,"inactive")} textAlign="center">
                                        <Label>{c.unaffected + " / " + c.total}</Label>
                                    </Table.Cell>
                                    <Table.Cell style={{cursor:"pointer"}} onClick={()=>this.navigateToControl(c.control._id,"inTime")} textAlign="center">
                                        <Label color={(c.inTime == 0 ? "" : "green")}>{c.inTime}</Label>
                                    </Table.Cell>
                                    <Table.Cell style={{cursor:"pointer"}} onClick={()=>this.navigateToControl(c.control._id,"soon")} textAlign="center">
                                        <Label color={(c.soon == 0 ? "" : "orange")}>{c.soon}</Label>
                                    </Table.Cell>
                                    <Table.Cell style={{cursor:"pointer"}} onClick={()=>this.navigateToControl(c.control._id,"late")} textAlign="center">
                                        <Label color={(c.late == 0 ? "" : "red")}>{c.late}</Label>
                                    </Table.Cell>
                                    <Table.Cell style={{cursor:"pointer"}} onClick={()=>this.navigateToControl(c.control._id,"all")} textAlign="center">
                                        <Label style={{whiteSpace:"nowrap"}}>Voir tout</Label>
                                    </Table.Cell>
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