import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Table, Label, Icon, Header, Divider, Statistic } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

export class DashboardUnit extends Component {

    getColorIfAny = (q,color) => {
        if(q>0){return color}
    }

    setSocieteFilter = () => {
        this.props.setSocieteFilter(this.props.dashboard.societe._id)
    }

    navigateToVehicles = () => {
        this.setSocieteFilter()
        this.props.history.push("/parc/vehicles");
    }

    navigateToControls = () => {
        this.setSocieteFilter()
        this.props.history.push("/parc/controls");
    }

    navigateToLicences = () => {
        this.setSocieteFilter()
        this.props.history.push("/parc/licences");
    }

    navigateToLocations = () => {
        this.setSocieteFilter()
        this.props.history.push("/parc/locations");
    }

    navigateToCommandes = () => {
        this.setSocieteFilter()
        this.props.history.push("/entretiens");
    }

    navigateToEntretiens = () => {
        this.setSocieteFilter()
        this.props.history.push("/entretiens");
    }

    render() {
        return (
            <div style={{gridColumnStart:"2"}}>
                <Divider horizontal style={{margin:"32px auto"}}>
                    <Header as='h2'>
                        <Icon name='truck' />
                        Parc
                    </Header>
                </Divider>
                <Statistic.Group widths={4} size="small" >
                    <Statistic color='blue'>
                        <Statistic.Value>{this.props.dashboard.vehicles}</Statistic.Value>
                        <Statistic.Label>véhicules</Statistic.Label>
                    </Statistic>
                    <Statistic color='blue'>
                        <Statistic.Value>{this.props.dashboard.avgKm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Statistic.Value>
                        <Statistic.Label>kilomètres en moyenne</Statistic.Label>
                    </Statistic>
                    <Statistic color='blue'>
                        <Statistic.Value>
                            {(this.props.dashboard.vehicles != 0 ? ((((this.props.dashboard.nbOwned + this.props.dashboard.nbCRC) / (this.props.dashboard.nbOwned + this.props.dashboard.nbCRC + this.props.dashboard.nbCRB))*100).toFixed(1)): "-")} %
                        </Statistic.Value>
                        <Statistic.Label>de véhicules en propriété</Statistic.Label>
                    </Statistic>
                    <Statistic color='blue'>
                        <Statistic.Value>{this.props.dashboard.licenceFree}</Statistic.Value>
                        <Statistic.Label>licences disponibles</Statistic.Label>
                    </Statistic>
                </Statistic.Group>
                <Table color="blue" selectable celled compact="very">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell textAlign="right" colSpan="2" width={2}>
                                <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h4'>
                                    <Icon name='truck' />
                                    <Header.Content>Vehicules</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Total :
                                <Label onClick={this.navigateToVehicles} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.vehicles,"green")} image>
                                    <Icon style={{margin:"0"}} name='truck' />
                                    <Label.Detail>{this.props.dashboard.vehicles}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Relevé > 14j. : 
                                <Label onClick={this.navigateToVehicles} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.vehiclesLate,"orange")} image>
                                    <Icon style={{margin:"0"}} name='dashboard' />
                                    <Label.Detail>{this.props.dashboard.vehiclesLate}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Relevé > 28j. : 
                                <Label onClick={this.navigateToVehicles} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.vehiclesVeryLate,"red")} image>
                                    <Icon style={{margin:"0"}} name='warning sign' />
                                    <Label.Detail>{this.props.dashboard.vehiclesVeryLate}</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right" colSpan="2" width={2}>
                                <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h4'>
                                    <Icon name='truck' />
                                    <Header.Content>Location</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Total :
                                <Label onClick={this.navigateToLocations} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.locations,"green")} image>
                                    <Icon style={{margin:"0"}} name='truck' />
                                    <Label.Detail>{this.props.dashboard.locations}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Relevé > 14j. :
                                <Label onClick={this.navigateToLocations} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.locationsLate,"orange")} image>
                                    <Icon style={{margin:"0"}} name='dashboard' />
                                    <Label.Detail>{this.props.dashboard.locationsLate}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Relevé > 28j. :
                                <Label onClick={this.navigateToLocations} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.locationsVeryLate,"red")} image>
                                    <Icon style={{margin:"0"}} name='warning sign' />
                                    <Label.Detail>{this.props.dashboard.locationsVeryLate}</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right" colSpan="2" width={2}>
                                <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h4'>
                                    <Icon name='drivers license' />
                                    <Header.Content>Licences</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Total :
                                <Label onClick={this.navigateToLicences} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.licences,"green")} image>
                                    <Icon style={{margin:"0"}} name='file text' />
                                    <Label.Detail>{this.props.dashboard.licences}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Fin proche :
                                <Label onClick={this.navigateToLicences} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.licencesEndSoon,"orange")} image>
                                    <Icon style={{margin:"0"}} name='clock' />
                                    <Label.Detail>{this.props.dashboard.licencesEndSoon}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Dépassée :
                                <Label onClick={this.navigateToLicences} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.licencesOver,"red")} image>
                                    <Icon style={{margin:"0"}} name='warning sign' />
                                    <Label.Detail>{this.props.dashboard.licencesOver}</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Divider horizontal style={{margin:"32px auto"}}>
                    <Header as='h2'>
                        <Icon name='truck' />
                        Suivi des vehicles
                    </Header>
                </Divider>
                <Table color="blue" selectable celled compact="very">
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell textAlign="right" colSpan="2" width={2}>
                                <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h4'>
                                    <Icon name='clipboard check' />
                                    <Header.Content>Contrôles</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                En règle :
                                <Label onClick={this.navigateToControls} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.controlsOk,"green")} image>
                                    <Icon style={{margin:"0"}} name='clipboard check' />
                                    <Label.Detail>{this.props.dashboard.controlsOk}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Proche du seuil :
                                <Label onClick={this.navigateToControls} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.controlsUrgent,"orange")} image>
                                    <Icon style={{margin:"0"}} name='clock outline' />
                                    <Label.Detail>{this.props.dashboard.controlsUrgent}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                En retard :
                                <Label onClick={this.navigateToControls} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.controlsLate,"red")} image>
                                    <Icon style={{margin:"0"}} name='warning sign' />
                                    <Label.Detail>{this.props.dashboard.controlsLate}</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right" colSpan="2" width={2}>
                                <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h4'>
                                    <Icon name='wrench' />
                                    <Header.Content>Entretiens</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Pas prêt :
                                <Label onClick={this.navigateToEntretiens} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.entretiens,"grey")} image>
                                    <Icon style={{margin:"0"}} name='sync' />
                                    <Label.Detail>{this.props.dashboard.entretiensNotReady}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Prêt, à assigner :
                                <Label onClick={this.navigateToEntretiens} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.entretiensReadyUnaffected,"orange")} image>
                                    <Icon style={{margin:"0"}} name='user plus' />
                                    <Label.Detail>{this.props.dashboard.entretiensReadyUnaffected}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Prêt et affecté :
                                <Label onClick={this.navigateToEntretiens} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.entretiensReadyAffected,"green")} image>
                                    <Icon style={{margin:"0"}} name='user outline' />
                                    <Label.Detail>{this.props.dashboard.entretiensReadyAffected}</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell textAlign="right" colSpan="2" width={2}>
                                <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h4'>
                                    <Icon name='shipping fast' />
                                    <Header.Content>Commandes</Header.Content>
                                </Header>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                A passer :
                                <Label onClick={this.navigateToCommandes} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.commandesToDo,"grey")} image>
                                    <Icon style={{margin:"0"}} name='cart' />
                                    <Label.Detail>{this.props.dashboard.commandesToDo}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                En livraison :
                                <Label onClick={this.navigateToCommandes} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.commandesDone,"orange")} image>
                                    <Icon style={{margin:"0"}} name='shipping fast' />
                                    <Label.Detail>{this.props.dashboard.commandesDone}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="right" colSpan="4" width={4}>
                                Réceptionnée :
                                <Label onClick={this.navigateToCommandes} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.commandesReceived,"green")} image>
                                    <Icon style={{margin:"0"}} name='box' />
                                    <Label.Detail>{this.props.dashboard.commandesReceived}</Label.Detail>
                                </Label>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withRouter(withUserContext(DashboardUnit));