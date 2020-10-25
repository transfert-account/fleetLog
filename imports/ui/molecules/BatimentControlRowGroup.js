import React, { Component, Fragment } from 'react'
import { Table, Header } from 'semantic-ui-react';
import BatimentControlRow from './BatimentControlRow'
import { UserContext } from '../../contexts/UserContext';
import moment from 'moment'

class BatimentControlRowGroup extends Component {

    state={
        getControlRows : () => {
            if(this.props.batiment.controls.length == 0){
                return (
                    <Table.Row error>
                        <Table.Cell colSpan={7} textAlign="center">
                            Aucun contrôle pour la société ({this.props.batiment.societe.name})
                        </Table.Cell>
                    </Table.Row>
                )
            }else{
                let displayed = Array.from(this.props.batiment.controls)
                if(this.props.batimentFilter != ""){
                    displayed = displayed.filter(c => 
                        c.name.toLowerCase().includes(this.props.batimentFilter.toLowerCase())
                    );
                }
                if(this.props.timeLeftFilter != "all"){
                    displayed = displayed.filter(c => {
                        let nextDate = moment(c.lastExecution,"DD/MM/YYYY").add(c.delay, 'days');
                        let daysLeft = parseInt(nextDate.diff(moment(),'day', true))
                        if(this.props.timeLeftFilter == "soon"){
                            if(daysLeft <= 56){
                                return true
                            }else{
                                return false
                            }
                        }
                        if(this.props.timeLeftFilter == "very"){
                            if(daysLeft <= 28){
                                return true
                            }else{
                                return false
                            }
                        }
                        if(this.props.timeLeftFilter == "over"){
                            if(daysLeft <= 0){
                                return true
                            }else{
                                return false
                            }
                        }
                    });
                }
                displayed = displayed.filter(b =>{
                    if(this.props.docsFilter == "all"){return true}else{
                        if(b.ficheInter._id == ""){
                            return true
                        }else{
                            return false
                        }
                    }}
                )
                return(
                    <Fragment>
                        <Header as="h2" floated="left">{this.props.batiment.societe.name}</Header>
                        <Header as="h2" floated="right">{displayed.length + " contrôles de batiments"}</Header>
                        <Table style={{marginBottom:"16px"}} celled selectable color="blue" compact>
                            <Table.Header>
                                <Table.Row textAlign='center'>
                                    <Table.HeaderCell>Contrôle</Table.HeaderCell>
                                    <Table.HeaderCell>Délai</Table.HeaderCell>
                                    <Table.HeaderCell>Dernière exécution</Table.HeaderCell>
                                    <Table.HeaderCell>Avant prochaine exécution</Table.HeaderCell>
                                    <Table.HeaderCell>Documents</Table.HeaderCell>
                                    <Table.HeaderCell>Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {displayed.map(c=>
                                    <BatimentControlRow key={c._id} loadBatiments={this.props.loadBatiments} societe={this.props.batiment.societe} control={c}/>
                                )}
                            </Table.Body>
                        </Table>
                    </Fragment>
                )
            }
        }
    }

    render() {
        return (
            <Fragment>
                {this.state.getControlRows()}
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(BatimentControlRowGroup);