import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Table, Label, Icon } from 'semantic-ui-react';

export class DashboardUnit extends Component {

    getColorIfAny = (q,color) => {
        if(q>0){return color}
    }

    render() {
        return (
            <Table celled compact="very">
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell colSpan="14" textAlign="center">{this.props.dashboard.societe.name}</Table.HeaderCell>    
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                <Table.Row>
                        <Table.Cell textAlign="right" colSpan="2" width={2}>Contrôles</Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            En règle :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.controlsOk,"green")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.controlsOk}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Proche du seuil :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.controlsUrgent,"orange")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.controlsUrgent}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            En retard :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.controlsLate,"red")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.controlsLate}</Label.Detail>
                            </Label>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell textAlign="right" colSpan="2" width={2}>Entretiens</Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Pas prêt :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.entretiens,"grey")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.entretiensNotReady}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Prêt, à assigner :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.entretiensReadyUnaffected,"orange")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.entretiensReadyUnaffected}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Prêt et affecté :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.entretiensReadyAffected,"green")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.entretiensReadyAffected}</Label.Detail>
                            </Label>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell textAlign="right" colSpan="2" width={2}>Commande</Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            A passer :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.commandesToDo,"grey")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.commandesToDo}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            En livraison :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.commandesDone,"orange")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.commandesDone}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Réceptionnée :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.commandesReceived,"green")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.commandesReceived}</Label.Detail>
                            </Label>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell textAlign="right" colSpan="2" width={2}>Vehicules</Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Total :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.vehicles,"green")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.vehicles}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Relevé > 14j. : 
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.vehiclesLate,"orange")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.vehiclesLate}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Relevé > 28j. : 
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.vehiclesVeryLate,"red")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.vehiclesVeryLate}</Label.Detail>
                            </Label>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell textAlign="right" colSpan="2" width={2}>Locations</Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Total :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.locations,"green")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.locations}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Relevé > 14j. :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.locationsLate,"orange")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.locationsLate}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Relevé > 28j. :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.locationsVeryLate,"red")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.locationsVeryLate}</Label.Detail>
                            </Label>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell textAlign="right" colSpan="2" width={2}>Licences</Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Total :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.licences,"green")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.licences}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Fin proche :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.licencesEndSoon,"orange")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.licencesEndSoon}</Label.Detail>
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="right" colSpan="4" width={4}>
                            Dépassée :
                            <Label style={{marginLeft:"4px"}} color={this.getColorIfAny(this.props.dashboard.licencesOver,"red")} image>
                                <Icon style={{margin:"0"}} name='truck' />
                                <Label.Detail>{this.props.dashboard.licencesOver}</Label.Detail>
                            </Label>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(DashboardUnit);