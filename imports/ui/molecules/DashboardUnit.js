import React, { Component, Fragment } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Table, Label, Icon, Header, Statistic, Segment, Menu } from 'semantic-ui-react';
import DashboardCard from '../atoms/DashboardCard';
import { withRouter } from 'react-router-dom';

export class DashboardUnit extends Component {

    state={
        activeTab : "vehicles"
    }

    handleTabClick = active => this.setState({ activeTab: active })

    getColorIfAny = (q,color) => {
        if(q>0){return color}
    }

    navigateToVehicles = () => {this.props.history.push("/parc/vehicles");}
    navigateToControls = () => {this.props.history.push("/parc/controls");}
    navigateToLicences = () => {this.props.history.push("/parc/licences");}
    navigateToBatiments = () => {this.props.history.push("/batiments");}
    navigateToAccidents = () => {this.props.history.push("/accidentologie");}
    navigateToLocations = () => {this.props.history.push("/parc/locations");}
    navigateToCommandes = () => {this.props.history.push("/entretiens");}
    navigateToEntretiens = () => {this.props.history.push("/entretiens");}

    getDocIndicatorCell = (cell,onClick) => {
        let data = this.props.dashboard[cell]
        return(
            <Table.Cell textAlign="center">
                <Label size="big" onClick={onClick} style={{cursor:"pointer"}} color={this.getColorIfAny(data.affected,"green")} image>
                    <Icon style={{margin:"0"}} name='folder'/>
                    <Label.Detail>{data.affected}</Label.Detail>
                </Label>
                <Label size="big" onClick={onClick} style={{cursor:"pointer"}} color={this.getColorIfAny(data.missing,"red")} image>
                    <Icon style={{margin:"0"}} name='folder'/>
                    <Label.Detail>{data.missing}</Label.Detail>
                </Label>
            </Table.Cell>
        )
    }

    getVehiclesStats = () => {
        let vehiclesTotal = this.props.dashboard.vehicles + this.props.dashboard.vehiclesLate + this.props.dashboard.vehiclesVeryLate
        return (
            <Fragment>
                <Statistic style={{gridColumnStart:"2"}} color='blue' size="small">
                    <Statistic.Value>{vehiclesTotal}</Statistic.Value>
                    <Statistic.Label>véhicules</Statistic.Label>
                </Statistic>
                <Statistic style={{gridColumnStart:"3"}} color='blue' size="small">
                    <Statistic.Value>{this.props.dashboard.avgKm.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Statistic.Value>
                    <Statistic.Label>kilomètres en moyenne</Statistic.Label>
                </Statistic>
                <Statistic style={{gridColumnStart:"4"}} color='blue' size="small">
                    <Statistic.Value>
                        {(vehiclesTotal != 0 ? ((((this.props.dashboard.nbOwned + this.props.dashboard.nbCRC) / (this.props.dashboard.nbOwned + this.props.dashboard.nbCRC + this.props.dashboard.nbCRB))*100).toFixed(1)): "-")} %
                    </Statistic.Value>
                    <Statistic.Label>de véhicules en propriété</Statistic.Label>
                </Statistic>
            </Fragment>
        )
    }
    getEntretiensStats = () => {
        return (
            <Fragment>
                <Statistic style={{gridColumnStart:"2"}} color='blue' size="small">
                    <Statistic.Value>{this.props.dashboard.controlsTotal}</Statistic.Value>
                    <Statistic.Label>Equipements à contrôle équipés</Statistic.Label>
                </Statistic>
                <Statistic style={{gridColumnStart:"3"}} color='blue' size="small">
                    <Statistic.Value>{this.props.dashboard.entretiensTotalNotArchived}</Statistic.Value>
                    <Statistic.Label>Entretiens ouvert</Statistic.Label>
                </Statistic>
                <Statistic style={{gridColumnStart:"4"}} color='blue' size="small">
                <Statistic.Value>{this.props.dashboard.commandesTotalNotArchived}</Statistic.Value>
                    <Statistic.Label>Commande ouvertes</Statistic.Label>
                </Statistic>
            </Fragment>
        )
    }

    getVehiclesDiv = () => {
        return (
            <Segment.Group style={{gridColumnEnd:"span 5",display:"grid",placeSelf:"start stretch"}}>
                <Segment>
                    <Header style={{marginTop:"16px"}} textAlign="left" as='h2'>
                        <Icon name="dashboard"/>
                        RELEVÉ DES COMPTEURS KILOMÉTRIQUES 
                    </Header>
                </Segment>
                <Segment style={{display:"flex",width:"100%",justifyContent:"space-evenly",padding:"32px"}}>
                    <DashboardCard title="Vehicules" icon="truck"
                        kpis={[{
                            data:this.props.dashboard.vehicles,
                            color:this.getColorIfAny(this.props.dashboard.vehicles,"green"),
                            icon:'check',
                            tooltip:" véhicules avec relevé de compteur à jour",
                            click:this.navigateToVehicles
                        },{
                            data:this.props.dashboard.vehiclesLate,
                            color:this.getColorIfAny(this.props.dashboard.vehiclesLate,"orange"),
                            icon:'dashboard',
                            tooltip:" véhicules avec relevé de compteur remontant à plus de 9 jours",
                            click:this.navigateToVehicles
                        },{
                            data:this.props.dashboard.vehiclesVeryLate,
                            color:this.getColorIfAny(this.props.dashboard.vehiclesVeryLate,"red"),
                            icon:'warning sign',
                            tooltip:" véhicules avec relevé de compteur remontant à plus de 14 jours",
                            click:this.navigateToVehicles
                        }]}
                    />
                    <DashboardCard title="Locations" icon="truck"
                        kpis={[{
                            data:this.props.dashboard.locations,
                            color:this.getColorIfAny(this.props.dashboard.locations,"green"),
                            icon:'check',
                            tooltip:" véhicules avec relevé de compteur à jour",
                            click:this.navigateToLocations
                        },{
                            data:this.props.dashboard.locationsLate,
                            color:this.getColorIfAny(this.props.dashboard.locationsLate,"orange"),
                            icon:'dashboard',
                            tooltip:" véhicules avec relevé de compteur remontant à plus de 9 jours",
                            click:this.navigateToLocations
                        },{
                            data:this.props.dashboard.locationsVeryLate,
                            color:this.getColorIfAny(this.props.dashboard.locationsVeryLate,"red"),
                            icon:'warning sign',
                            tooltip:" véhicules avec relevé de compteur remontant à plus de 14 jours",
                            click:this.navigateToLocations
                        }]}
                    />
                </Segment>
            </Segment.Group>
        )
    }
    getEntretiensDiv = () => {
        return (
            <Segment.Group style={{gridColumnEnd:"span 5",display:"grid",placeSelf:"start stretch"}}>
                <Segment>
                    <Header style={{marginTop:"16px"}} textAlign="left" as='h2'>
                        <Icon name="wrench"/>
                        SUIVI DES VÉHICULES
                    </Header>
                </Segment>
                <Segment style={{display:"flex",width:"100%",justifyContent:"space-evenly",padding:"32px"}}>
                    <DashboardCard title="Équipement à contrôles obligatoires" icon="clipboard check"
                        kpis={[{
                            data:this.props.dashboard.controlsOk,
                            color:this.getColorIfAny(this.props.dashboard.controlsOk,"green"),
                            icon:'clipboard check',
                            tooltip:" équipements à contrôles obligatoire équipé à jour dans leur contrôles",
                            click:this.navigateToControls
                        },{
                            data:this.props.dashboard.controlsUrgent,
                            color:this.getColorIfAny(this.props.dashboard.controlsUrgent,"orange"),
                            icon:'clock outline',
                            tooltip:" équipements à contrôles obligatoire équipé en seuil d'alerte avant contrôle",
                            click:this.navigateToControls
                        },{
                            data:this.props.dashboard.controlsLate,
                            color:this.getColorIfAny(this.props.dashboard.controlsLate,"red"),
                            icon:'warning sign',
                            tooltip:" équipements à contrôles obligatoire équipé avec date limite avant contrôle dépassée",
                            click:this.navigateToControls
                        }]}
                    />
                    <DashboardCard title="Entretiens" icon="wrench"
                        kpis={[{
                            data:this.props.dashboard.entretiensNotReady,
                            color:this.getColorIfAny(this.props.dashboard.entretiensNotReady,"green"),
                            icon:'sync',
                            tooltip:" entretiens en préparation, pas encore assignable",
                            click:this.navigateToEntretiens
                        },{
                            data:this.props.dashboard.entretiensReadyUnaffected,
                            color:this.getColorIfAny(this.props.dashboard.entretiensReadyUnaffected,"orange"),
                            icon:'user plus',
                            tooltip:" entretiens libre et prêts à être assigné",
                            click:this.navigateToEntretiens
                        },{
                            data:this.props.dashboard.entretiensReadyAffected,
                            color:this.getColorIfAny(this.props.dashboard.entretiensReadyAffected,"green"),
                            icon:'user outline',
                            tooltip:" entretiens prêts et déjà assigné",
                            click:this.navigateToEntretiens
                        }]}
                    />
                    <DashboardCard title="Commandes" icon="truck"
                        kpis={[{
                            data:this.props.dashboard.commandesToDo,
                            color:this.getColorIfAny(this.props.dashboard.commandesToDo,"orange"),
                            icon:'cart',
                            tooltip:" commandes à passer",
                            click:this.navigateToCommandes
                        },{
                            data:this.props.dashboard.commandesDone,
                            color:this.getColorIfAny(this.props.dashboard.commandesDone,"green"),
                            icon:'shipping fast',
                            tooltip:" commandes passées et en cours de livraison",
                            click:this.navigateToCommandes
                        },{
                            data:this.props.dashboard.commandesReceived,
                            color:this.getColorIfAny(this.props.dashboard.commandesReceived,"green"),
                            icon:'box',
                            tooltip:" commandes réceptionnées",
                            click:this.navigateToCommandes
                        }]}
                    />
                </Segment>
            </Segment.Group>
        )
    }
    getParcDiv = () => {
        return (
            <Segment.Group style={{gridColumnEnd:"span 5",display:"grid",placeSelf:"start stretch"}}>
                <Segment>
                    <Header style={{marginTop:"16px"}} textAlign="left" as='h2'>
                        <Icon name="folder open outline"/>
                        PARC
                    </Header>
                </Segment>
                <Segment style={{display:"flex",width:"100%",justifyContent:"space-evenly",padding:"32px"}}>
                    <DashboardCard title="Licences" icon="drivers license"
                        kpis={[{
                            data:this.props.dashboard.licences,
                            color:this.getColorIfAny(this.props.dashboard.licences,"green"),
                            icon:'clipboard check',
                            tooltip:" licences en cours de validité",
                            click:this.navigateToLicences
                        },{
                            data:this.props.dashboard.licencesEndSoon,
                            color:this.getColorIfAny(this.props.dashboard.licencesEndSoon,"orange"),
                            icon:'clock outline',
                            tooltip:" licences arrivant bientôt à terme",
                            click:this.navigateToLicences
                        },{
                            data:this.props.dashboard.licencesOver,
                            color:this.getColorIfAny(this.props.dashboard.licencesOver,"red"),
                            icon:'warning sign',
                            tooltip:" licences éxpirée",
                            click:this.navigateToLicences
                        }]}
                    />
                    <DashboardCard title="Contrôles batiments" icon="warehouse"
                        kpis={[{
                            data:this.props.dashboard.batiments,
                            color:this.getColorIfAny(this.props.dashboard.batiments,"green"),
                            icon:'warehouse',
                            tooltip:" contrôles de batiments programmés et dans les temps",
                            click:this.navigateToBatiments
                        },{
                            data:this.props.dashboard.batimentsEndSoon,
                            color:this.getColorIfAny(this.props.dashboard.batimentsEndSoon,"orange"),
                            icon:'clock',
                            tooltip:" contrôles de batiments proche de leur date limite d'exécution",
                            click:this.navigateToBatiments
                        },{
                            data:this.props.dashboard.batimentsOver,
                            color:this.getColorIfAny(this.props.dashboard.batimentsOver,"red"),
                            icon:'warning sign',
                            tooltip:" contrôles de batiment ayant dépassé leur date limite d'exécution",
                            click:this.navigateToBatiments
                        }]}
                    />
                    <DashboardCard title={"Accidents (" + new Date().getFullYear()+")"} icon="fire"
                        kpis={[{
                            data:this.props.dashboard.accidentsThisYear,
                            color:this.getColorIfAny(this.props.dashboard.accidentsThisYear,"grey"),
                            icon:'fire',
                            tooltip:" accidents survenu en " + new Date().getFullYear(),
                            click:this.navigateToAccidents
                        },{
                            data:this.props.dashboard.accidentsOpened,
                            color:this.getColorIfAny(this.props.dashboard.accidentsOpened,"orange"),
                            icon:'open folder outline',
                            tooltip:" accidents en cours de traitement",
                            click:this.navigateToAccidents
                        },{
                            data:this.props.dashboard.totalAccidentsCost,
                            color:this.getColorIfAny(this.props.dashboard.totalAccidentsCost,"grey"),
                            icon:'euro',
                            tooltip:" euros de réparations",
                            click:this.navigateToAccidents
                        }]}
                    />
                </Segment>
            </Segment.Group>
        )
    }
    getDocumentsDiv = () => {
        return (
            <div style={{display:"grid",gridTemplateRows:"auto",gridColumnEnd:"span 5"}}>
                <div style={{margin:"16px 0",display:"grid",gridTemplateRows:"1fr"}}>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                        <Table style={{margin:"0",gridColumnEnd:"span 2"}} color="blue" selectable celled>
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
                                            <Header.Content>Restitution</Header.Content>
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
                        <Table style={{margin:"0"}} color="blue" selectable celled>
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
                        <Table style={{margin:"0"}} color="blue" selectable celled>
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
                        <Table style={{margin:"0",gridColumnEnd:"span 2"}} color="blue" selectable celled>
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
    getRepartitionDiv = () => {
        return (
            <div style={{display:"grid",placeSelf:"stretch",gridColumnEnd:"span 5",gridTemplateColumns:"1fr 1fr",gridGap:"32px"}}>
                <div style={{overflowY:"auto",placeSelf:"stretch"}}>
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
                </div>
                <div style={{overflowY:"auto",placeSelf:"stretch"}}>
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
        )
    }

    getActiveTab = () => {
        if(this.state.activeTab == "vehicles"){return this.getVehiclesDiv()}
        if(this.state.activeTab == "entretiens"){return this.getEntretiensDiv()}
        if(this.state.activeTab == "parc"){return this.getParcDiv()}
        if(this.state.activeTab == "documents"){return this.getDocumentsDiv()}
        if(this.state.activeTab == "repartition"){return this.getRepartitionDiv()}
    }

    render() {
        /*OVERVIEW LABEL CALCULATION*/
        let vehiclesGreen = this.props.dashboard.vehicles + this.props.dashboard.locations;
        let vehiclesOrange = this.props.dashboard.vehiclesLate + this.props.dashboard.locationsLate;
        let vehiclesRed = this.props.dashboard.vehiclesVeryLate + this.props.dashboard.locationsVeryLate;

        let entretiensGreen = this.props.dashboard.entretiensNotReady + this.props.dashboard.controlsOk + this.props.dashboard.commandesDone + this.props.dashboard.commandesReceived;
        let entretiensOrange = this.props.dashboard.controlsUrgent + this.props.dashboard.entretiensReadyUnaffected + this.props.dashboard.commandesToDo;
        let entretiensRed = this.props.dashboard.controlsLate;

        let parcGreen = this.props.dashboard.licences + this.props.dashboard.batiments;
        let parcOrange = this.props.dashboard.licencesEndSoon + this.props.dashboard.batimentsEndSoon + this.props.dashboard.accidentsOpened;
        let parcRed = this.props.dashboard.licencesOver + this.props.dashboard.batimentsOver;

        let documentsGreen = 0 ;
        let documentsRed = 0;

        let docsTypes = ["vehicleCV","vehicleCG","locationCV","locationCG","locationContrat","locationRestitution","entretiensFicheInter","controlsFicheInter","batimentsFicheInter","licencesLicence","accidentsConstat","accidentsExpert","accidentsFacture"]
        docsTypes.map(dt=>{
            documentsGreen += this.props.dashboard[dt].affected
            documentsRed += this.props.dashboard[dt].missing
        })
        return (
            <div style={{height:"calc(100% - 48px)",display:"grid",gridTemplateRows:"auto auto auto minmax(0, 1fr)",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gridGap:"32px",margin:"40px 168px"}}>
                {this.getVehiclesStats()}
                {this.getEntretiensStats()}
                <Menu secondary pointing fluid size='massive' style={{marginTop:"64px",gridColumnEnd:"span 5"}} widths={5}>
                    <Menu.Item color="blue" active={this.state.activeTab == 'vehicles'} onClick={()=>this.handleTabClick('vehicles')}>
                        VÉHICULES
                        <Label size="big" color={this.getColorIfAny(vehiclesGreen,'green')}>{vehiclesGreen}</Label>
                        <Label size="big" color={this.getColorIfAny(vehiclesOrange,'orange')}>{vehiclesOrange}</Label>
                        <Label size="big" color={this.getColorIfAny(vehiclesRed,'red')}>{vehiclesRed}</Label>
                    </Menu.Item>
                    <Menu.Item color="blue" active={this.state.activeTab == 'entretiens'} onClick={()=>this.handleTabClick('entretiens')}>
                        ENTRETIENS
                        <Label size="big" color={this.getColorIfAny(entretiensGreen,'green')}>{entretiensGreen}</Label>
                        <Label size="big" color={this.getColorIfAny(entretiensOrange,'orange')}>{entretiensOrange}</Label>
                        <Label size="big" color={this.getColorIfAny(entretiensRed,'red')}>{entretiensRed}</Label>
                    </Menu.Item>
                    <Menu.Item color="blue" active={this.state.activeTab == 'parc'} onClick={()=>this.handleTabClick('parc')}>
                        PARC
                        <Label size="big" color={this.getColorIfAny(parcGreen,'green')}>{parcGreen}</Label>
                        <Label size="big" color={this.getColorIfAny(parcOrange,'orange')}>{parcOrange}</Label>
                        <Label size="big" color={this.getColorIfAny(parcRed,'red')}>{parcRed}</Label>
                    </Menu.Item>
                    <Menu.Item color="blue" active={this.state.activeTab == 'documents'} onClick={()=>this.handleTabClick('documents')}>
                        DOCUMENTS
                        <Label size="big" color={this.getColorIfAny(documentsGreen,'green')}>{documentsGreen}</Label>
                        <Label size="big" color={this.getColorIfAny(documentsRed,'red')}>{documentsRed}</Label>
                    </Menu.Item>
                    <Menu.Item color="blue" active={this.state.activeTab == 'repartition'} onClick={()=>this.handleTabClick('repartition')}>
                        REPARTITION
                    </Menu.Item>
                </Menu>
                {this.getActiveTab()}
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