import React, { Component, Fragment } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Table, Label, Icon, Header, Statistic, Segment, SegmentGroup } from 'semantic-ui-react';
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

    navigateToBatiments = () => {
        this.setSocieteFilter()
        this.props.history.push("//batiments");
    }

    navigateToAccidents = () => {
        this.setSocieteFilter()
        this.props.history.push("/accidentologie");
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

    getDocIndicatorCell = (cell,onClick) => {
        let data = this.props.dashboard[cell]
        return(
            <Table.Cell textAlign="center">
                <Label onClick={onClick} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(data.affected,"green")} image>
                    <Icon style={{margin:"0"}} name='folder'/>
                    <Label.Detail>{data.affected}</Label.Detail>
                </Label>
                <Label onClick={onClick} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(data.missing,"red")} image>
                    <Icon style={{margin:"0"}} name='folder'/>
                    <Label.Detail>{data.missing}</Label.Detail>
                </Label>
            </Table.Cell>
        )
    }

    getParcDiv = () => {
        return (
            <div style={{display:"grid",gridTemplateRows:"auto"}}>
                <div style={{margin:"16px 0"}}>
                    <Header textAlign="left" as='h3'>
                        PARC
                    </Header>
                    <Table style={{gridColumnEnd:"span 2"}} color="blue" selectable celled compact="very">
                        <Table.Body>
                        <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='drivers license' />
                                        <Header.Content>Licences</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Total :
                                    <Label onClick={this.navigateToLicences} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.licences,"green")} image>
                                        <Icon style={{margin:"0"}} name='file text' />
                                        <Label.Detail>{this.props.dashboard.licences}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Fin proche :
                                    <Label onClick={this.navigateToLicences} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.licencesEndSoon,"orange")} image>
                                        <Icon style={{margin:"0"}} name='clock' />
                                        <Label.Detail>{this.props.dashboard.licencesEndSoon}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Dépassée :
                                    <Label onClick={this.navigateToLicences} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.licencesOver,"red")} image>
                                        <Icon style={{margin:"0"}} name='warning sign' />
                                        <Label.Detail>{this.props.dashboard.licencesOver}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='warehouse'/>
                                        <Header.Content>Contrôles batiments</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Total :
                                    <Label onClick={this.navigateToBatiments} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.batiments,"green")} image>
                                        <Icon style={{margin:"0"}} name='warehouse' />
                                        <Label.Detail>{this.props.dashboard.batiments}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Execution proche :
                                    <Label onClick={this.navigateToBatiments} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.batimentsEndSoon,"orange")} image>
                                        <Icon style={{margin:"0"}} name='clock' />
                                        <Label.Detail>{this.props.dashboard.batimentsEndSoon}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    En retard :
                                    <Label onClick={this.navigateToBatiments} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.batimentsOver,"red")} image>
                                        <Icon style={{margin:"0"}} name='warning sign' />
                                        <Label.Detail>{this.props.dashboard.batimentsOver}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='fire'/>
                                        <Header.Content>Accidents ({new Date().getFullYear()})</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Cette année :
                                    <Label onClick={this.navigateToAccidents} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.accidentsThisYear,"green")} image>
                                        <Icon style={{margin:"0"}} name='file text' />
                                        <Label.Detail>{this.props.dashboard.accidentsThisYear}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Ouvert :
                                    <Label onClick={this.navigateToAccidents} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.accidentsOpened,"orange")} image>
                                        <Icon style={{margin:"0"}} name='clock' />
                                        <Label.Detail>{this.props.dashboard.accidentsOpened}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Réparations :
                                    <Label onClick={this.navigateToAccidents} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.totalAccidentsCost,"grey")} image>
                                        <Icon style={{margin:"0"}} name='euro' />
                                        <Label.Detail>{this.props.dashboard.totalAccidentsCost.toFixed(2)}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        )
    }

    getVehiclesDiv = () => {
        return (
            <div style={{display:"grid",gridTemplateRows:"auto"}}>
                <div style={{margin:"16px 0"}}>
                    <Header textAlign="left" as='h3'>
                        VÉHICULES
                    </Header>
                    <Table style={{gridColumnEnd:"span 2"}} color="blue" selectable celled compact="very">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='truck' />
                                        <Header.Content>Vehicules</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Total :
                                    <Label onClick={this.navigateToVehicles} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.vehicles,"green")} image>
                                        <Icon style={{margin:"0"}} name='truck' />
                                        <Label.Detail>{this.props.dashboard.vehicles}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Relevé > 14j. : 
                                    <Label onClick={this.navigateToVehicles} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.vehiclesLate,"orange")} image>
                                        <Icon style={{margin:"0"}} name='dashboard' />
                                        <Label.Detail>{this.props.dashboard.vehiclesLate}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Relevé > 28j. : 
                                    <Label onClick={this.navigateToVehicles} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.vehiclesVeryLate,"red")} image>
                                        <Icon style={{margin:"0"}} name='warning sign' />
                                        <Label.Detail>{this.props.dashboard.vehiclesVeryLate}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='truck' />
                                        <Header.Content>Location</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Total :
                                    <Label onClick={this.navigateToLocations} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.locations,"green")} image>
                                        <Icon style={{margin:"0"}} name='truck' />
                                        <Label.Detail>{this.props.dashboard.locations}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Relevé > 14j. :
                                    <Label onClick={this.navigateToLocations} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.locationsLate,"orange")} image>
                                        <Icon style={{margin:"0"}} name='dashboard' />
                                        <Label.Detail>{this.props.dashboard.locationsLate}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Relevé > 28j. :
                                    <Label onClick={this.navigateToLocations} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.locationsVeryLate,"red")} image>
                                        <Icon style={{margin:"0"}} name='warning sign' />
                                        <Label.Detail>{this.props.dashboard.locationsVeryLate}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>
            </div>
        )
    }

    getVehiclesStats = () => {
        return (
            <div style={{placeSelf:"stretch",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",margin:"16px 0"}}>
                <Statistic color='blue' size="small">
                    <Statistic.Value>{this.props.dashboard.vehicles}</Statistic.Value>
                    <Statistic.Label>véhicules</Statistic.Label>
                </Statistic>
                <Statistic color='blue' size="small">
                    <Statistic.Value>{this.props.dashboard.avgKm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Statistic.Value>
                    <Statistic.Label>kilomètres en moyenne</Statistic.Label>
                </Statistic>
                <Statistic color='blue' size="small">
                    <Statistic.Value>
                        {(this.props.dashboard.vehicles != 0 ? ((((this.props.dashboard.nbOwned + this.props.dashboard.nbCRC) / (this.props.dashboard.nbOwned + this.props.dashboard.nbCRC + this.props.dashboard.nbCRB))*100).toFixed(1)): "-")} %
                    </Statistic.Value>
                    <Statistic.Label>de véhicules en propriété</Statistic.Label>
                </Statistic>
            </div>
        )
    }

    getRepartitionDiv = () => {
        return (
            <div style={{display:"grid",gridTemplateRows:"auto"}}>
                <div style={{margin:"16px 0"}}>
                    <Header textAlign="left" as='h3'>
                        RÉPARTITION DES VÉHICULES
                    </Header>
                    <div style={{display:"grid",gridGap:"16px",gridTemplateColumns:"1fr 1fr"}}>
                        <Table color="blue" selectable celled compact="very" style={{alignSelf:"start",margin:"0"}}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center" width="1">Volume</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center" width="3">Nombre</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.props.dashboard.vehiclesVolumeRepartition.map(v=>{
                                    return (
                                        <Table.Row key={v.key}>
                                            <Table.Cell textAlign="right">
                                                {v.label} m²
                                            </Table.Cell>
                                            <Table.Cell textAlign="right">
                                                {v.value}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                        <Table color="blue" selectable celled compact="very" style={{alignSelf:"start",margin:"0"}}>
                            <Table.Header>
                                <Table.HeaderCell textAlign="center" width="1">Marque</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center" width="3">Nombre</Table.HeaderCell>
                            </Table.Header>
                            <Table.Body>
                                {this.props.dashboard.vehiclesModelRepartition.map(m=>{
                                    return (
                                        <Table.Row key={m.key}>
                                            <Table.Cell textAlign="right">
                                                {m.label}
                                            </Table.Cell>
                                            <Table.Cell textAlign="right">
                                                {m.value}
                                            </Table.Cell>
                                        </Table.Row>
                                    )
                                })}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }

    getEntretiensStats = () => {
        return (
            <div style={{placeSelf:"stretch",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",margin:"16px 0"}}>
                <Statistic color='blue' size="small">
                    <Statistic.Value>{this.props.dashboard.controlsTotal}</Statistic.Value>
                    <Statistic.Label>Equipements à contrôle obligatoire équipés</Statistic.Label>
                </Statistic>
                <Statistic color='blue' size="small">
                    <Statistic.Value>{this.props.dashboard.entretiensTotalNotArchived}</Statistic.Value>
                    <Statistic.Label>Entretiens ouvert</Statistic.Label>
                </Statistic>
                <Statistic color='blue' size="small">
                <Statistic.Value>{this.props.dashboard.commandesTotalNotArchived}</Statistic.Value>
                    <Statistic.Label>Commande ouvertes</Statistic.Label>
                </Statistic>
            </div>
        )
    }

    getEntretiensDiv = () => {
        return (
            <div style={{display:"grid",gridTemplateRows:"auto 1fr"}}>
                <div style={{margin:"16px 0"}}>
                    <Header textAlign="left" as='h3'>
                        SUIVI DES VÉHICULES
                    </Header>
                    <Table color="blue" selectable celled compact="very">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='clipboard check' />
                                        <Header.Content>Contrôles</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    En règle :
                                    <Label onClick={this.navigateToControls} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.controlsOk,"green")} image>
                                        <Icon style={{margin:"0"}} name='clipboard check' />
                                        <Label.Detail>{this.props.dashboard.controlsOk}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Proche du seuil :
                                    <Label onClick={this.navigateToControls} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.controlsUrgent,"orange")} image>
                                        <Icon style={{margin:"0"}} name='clock outline' />
                                        <Label.Detail>{this.props.dashboard.controlsUrgent}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    En retard :
                                    <Label onClick={this.navigateToControls} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.controlsLate,"red")} image>
                                        <Icon style={{margin:"0"}} name='warning sign' />
                                        <Label.Detail>{this.props.dashboard.controlsLate}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='wrench' />
                                        <Header.Content>Entretiens</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Pas prêt :
                                    <Label onClick={this.navigateToEntretiens} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.entretiens,"grey")} image>
                                        <Icon style={{margin:"0"}} name='sync' />
                                        <Label.Detail>{this.props.dashboard.entretiensNotReady}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Prêt, à assigner :
                                    <Label onClick={this.navigateToEntretiens} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.entretiensReadyUnaffected,"orange")} image>
                                        <Icon style={{margin:"0"}} name='user plus' />
                                        <Label.Detail>{this.props.dashboard.entretiensReadyUnaffected}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    Prêt et assigné :
                                    <Label onClick={this.navigateToEntretiens} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.entretiensReadyAffected,"green")} image>
                                        <Icon style={{margin:"0"}} name='user outline' />
                                        <Label.Detail>{this.props.dashboard.entretiensReadyAffected}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell textAlign="right">
                                    <Header as='h4'>
                                        <Icon name='shipping fast' />
                                        <Header.Content>Commandes</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    A passer :
                                    <Label onClick={this.navigateToCommandes} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.commandesToDo,"grey")} image>
                                        <Icon style={{margin:"0"}} name='cart' />
                                        <Label.Detail>{this.props.dashboard.commandesToDo}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
                                    En livraison :
                                    <Label onClick={this.navigateToCommandes} style={{marginLeft:"4px",cursor:"pointer"}} color={this.getColorIfAny(this.props.dashboard.commandesDone,"orange")} image>
                                        <Icon style={{margin:"0"}} name='shipping fast' />
                                        <Label.Detail>{this.props.dashboard.commandesDone}</Label.Detail>
                                    </Label>
                                </Table.Cell>
                                <Table.Cell textAlign="right">
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
            </div>
        )
    }

    getDocumentsDiv = () => {
        return (
            <div style={{display:"grid",gridTemplateRows:"auto"}}>
                <div style={{margin:"16px 0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Header textAlign="left" as='h3'>
                        DOCUMENTS
                    </Header>
                    <div style={{display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
                        <Table color="blue" selectable celled compact="very">
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={1}></Table.Cell>
                                    <Table.Cell textAlign="center" width={1}>
                                        <Header as='h4'>
                                            <Header.Content>Carte verte</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" width={1}>
                                        <Header as='h4'>
                                            <Header.Content>Carte grise</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" width={1}>
                                        <Header as='h4'>
                                            <Header.Content>Contrat de location</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" width={1}>
                                        <Header as='h4'>
                                            <Header.Content>Justifcatif de restitution</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="right">
                                        <Header as='h4'>
                                            <Header.Content>Vehicules</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {this.getDocIndicatorCell("vehicleCV",this.navigateToVehicles)}
                                    {this.getDocIndicatorCell("vehicleCG",this.navigateToVehicles)}
                                    <Table.Cell textAlign="right">
                                    </Table.Cell>
                                    <Table.Cell textAlign="right">
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="right">
                                        <Header as='h4'>
                                            <Header.Content>Location</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {this.getDocIndicatorCell("locationCV",this.navigateToLocations)}
                                    {this.getDocIndicatorCell("locationCG",this.navigateToLocations)}
                                    {this.getDocIndicatorCell("locationContrat",this.navigateToLocations)}
                                    {this.getDocIndicatorCell("locationRestitution",this.navigateToLocations)}
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Table color="blue" selectable celled compact="very">
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell textAlign="right" width={1}></Table.Cell>
                                    <Table.Cell textAlign="center" width={4}>
                                        <Header as='h4'>
                                            <Header.Content>Fiche d'intervention</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="right">
                                        <Header as='h4'>
                                            <Header.Content>Entretiens</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {this.getDocIndicatorCell("entretiensFicheInter",this.navigateToEntretiens)}
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="right">
                                        <Header as='h4'>
                                            <Header.Content>Contrôles technique</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {this.getDocIndicatorCell("controlsFicheInter",this.navigateToControls)}
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="right">
                                        <Header as='h4'>
                                            <Header.Content>Contrôles batiment</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {this.getDocIndicatorCell("batimentsFicheInter",this.navigateToBatiments)}
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Table color="blue" selectable celled compact="very">
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={1}></Table.Cell>
                                    <Table.Cell textAlign="center" width={4}>
                                        <Header as='h4'>
                                            <Header.Content>Licence</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="right">
                                        <Header as='h4'>
                                            <Header.Content>Licence</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {this.getDocIndicatorCell("licencesLicence",this.navigateToLicences)}
                                </Table.Row>
                            </Table.Body>
                        </Table>
                        <Table color="blue" selectable celled compact="very">
                            <Table.Body>
                                <Table.Row>
                                    <Table.Cell width={1}></Table.Cell>
                                    <Table.Cell textAlign="center" width={1}>
                                        <Header as='h4'>
                                            <Header.Content>Constat</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" width={1}>
                                        <Header as='h4'>
                                            <Header.Content>Rapport expert</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    <Table.Cell textAlign="center" width={1}>
                                        <Header as='h4'>
                                            <Header.Content>Facture</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell textAlign="right">
                                        <Header as='h4'>
                                            <Header.Content>Accidents</Header.Content>
                                        </Header>
                                    </Table.Cell>
                                    {this.getDocIndicatorCell("accidentsConstat",this.navigateToAccidents)}
                                    {this.getDocIndicatorCell("accidentsExpert",this.navigateToAccidents)}
                                    {this.getDocIndicatorCell("accidentsFacture",this.navigateToAccidents)}
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <Fragment>
                <div style={{display:"flex",placeSelf:'stretch',flexDirection:"column",overflowY:"auto",paddingRight:"16px"}}>
                    {this.getVehiclesStats()}
                    {this.getEntretiensStats()}
                    {this.getVehiclesDiv()}
                    {this.getEntretiensDiv()}
                    {this.getRepartitionDiv()}
                </div>
                <div style={{display:"flex",placeSelf:'stretch',flexDirection:"column",overflowY:"auto",paddingRight:"16px"}}>
                    {this.getParcDiv()}
                    {this.getDocumentsDiv()}
                </div>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withRouter(withUserContext(DashboardUnit));