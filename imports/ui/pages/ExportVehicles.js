import React, { Component, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Button, Icon, Segment, Header, Message } from 'semantic-ui-react';

import ExportMenu from '../molecules/ExportMenu';
import CustomFilterSegment from '../molecules/CustomFilterSegment';

import CustomFilter from '../atoms/CustomFilter';

import { saveAs } from 'file-saver';

import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import moment from "moment";

export class ExportVehicles extends Component {

    state = {
        vehiclesQuery : gql`
            query vehicles{
                vehicles{
                    _id
                    societe{
                        _id
                        name
                    }
                    registration
                    firstRegistrationDate
                    km
                    lastKmUpdate
                    brand{
                        _id
                        name
                    }
                    model{
                        _id
                        name
                    }
                    volume{
                        _id
                        meterCube
                    }
                    payload
                    energy{
                        _id
                        name
                    }
                    cg{
                        _id
                    }
                    cv{
                        _id
                    }
                    payementBeginDate
                    payementEndDate
                    property
                    financialInfosComplete
                    purchasePrice
                    monthlyPayement
                    payementFormat
                    payementTime{
                        _id
                        months
                    }
                    archived
                    shared
                    sharedTo{
                        _id
                        name
                    }
                }
            }
        `,
        vehiclesRaw:[],
        vehiclesFiltered:[],
        //===VEHICLES FILTERS===
        archiveFilterV:false,
        reportLateFilterV:"all",
        docsFilterV:"all",
        financeFilterV:"all",
        sharedFilterV:false,
        filtersV:[
            {
                infos:"financeFilterInfosV",
                filter:"financeFilterV"
            },{
                infos:"archiveFilterInfosV",
                filter:"archiveFilterV"
            },{
                infos:"sharedFilterInfosV",
                filter:"sharedFilterV"
            },{
                infos:"reportLateFilterInfosV",
                filter:"reportLateFilterV"
            },{
                infos:"docsFilterInfosV",
                filter:"docsFilterV"
            }
        ],
        financeFilterInfosV:{
            icon:"euro",            
            options:[
                {
                    key: 'financeall',
                    initial: true,
                    text: 'Tous les véhicules',
                    value: "all",
                    color:"green",
                    click:()=>{this.setFinanceFilterV("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'financemissing',
                    initial: false,
                    text: 'Infos de financement manquantes',
                    value: "missing",
                    color:"red",
                    click:()=>{this.setFinanceFilterV("missing")},
                    label: { color: 'red', empty: true, circular: true },
                },
                {
                    key: 'financecomplete',
                    initial: false,
                    text: 'Infos de financement complètes',
                    value: "complete",
                    color:"blue",
                    click:()=>{this.setFinanceFilterV("complete")},
                    label: { color: 'blue', empty: true, circular: true },
                }
            ]
        },
        archiveFilterInfosV:{
            icon:"archive",            
            options:[
                {
                    key: 'archivefalse',
                    initial: true,
                    text: 'Véhicules actuels',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilterV(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    initial: false,
                    text: 'Véhicules archivés',
                    value: true,
                    color:"orange",
                    click:()=>{this.switchArchiveFilterV(true)},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        sharedFilterInfosV:{
            icon:"handshake",            
            options:[
                {
                    key: 'sharedfalse',
                    initial: true,
                    text: 'Tous les véhicules',
                    value: false,
                    color:"green",
                    click:()=>{this.setSharedFilterV(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'sharedtrue',
                    initial: false,
                    text: 'Véhicules en prêt',
                    value: true,
                    color:"teal",
                    click:()=>{this.setSharedFilterV(true)},
                    label: { color: 'teal', empty: true, circular: true }
                }
            ]
        },
        reportLateFilterInfosV:{
            icon:"dashboard",            
            options:[
                {
                    key: 'reportall',
                    initial: true,
                    text: 'Tous les véhicules',
                    value: "all",
                    color:"green",
                    click:()=>{this.setReportLateFilterV("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'report2w',
                    initial: false,
                    text: 'Relevé > 2 sem.',
                    value: "2w",
                    color:"orange",
                    click:()=>{this.setReportLateFilterV("2w")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'report4w',
                    initial: false,
                    text: 'Relevé > 4 sem.',
                    value: "4w",
                    color:"red",
                    click:()=>{this.setReportLateFilterV("4w")},
                    label: { color: 'red', empty: true, circular: true }
                }
            ]
        },
        docsFilterInfosV:{
            icon:"folder open outline",            
            options:[
                {
                    key: 'docsall',
                    initial: true,
                    text: 'Tous les véhicules',
                    value: "all",
                    color:"green",
                    click:()=>{this.setDocsFilterV("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'docsmissing',
                    initial: false,
                    text: 'Documents manquants',
                    value: "missingDocs",
                    color:"red",
                    click:()=>{this.setDocsFilterV("missingDocs")},
                    label: { color: 'red', empty: true, circular: true }
                }
            ]
        }
    }
    exportVehicles = () => {
        let exp = [];
        this.state.vehiclesFiltered.map(v=>{
            exp.push({
                "Societé":v.societe.name,
                "Immatriculation":v.registration,
                "Date Immatriculation":v.firstRegistrationDate,
                "Kilometrage":v.km,
                "Dernier relevé":v.lastKmUpdate,
                "Marque":v.brand.name,
                "Modèle":v.model.name,
                "Volume (m²)":v.volume.meterCube,
                "Charge utile (t.)":v.payload,
                "Energie":v.energy.name,
                "Propriété":v.property,
                "Format de payement":v.payementFormat,
                "Durée de financement (en mois)":v.payementTime.months,
                "Début de payement":v.payementBeginDate,
                "Fin de payement":v.payementEndDate,
                "Coût":v.purchasePrice,
                "Paiement mensuel":v.monthlyPayement,
                "Archivé":v.archived
            })
        });
        var ws = XLSX.utils.json_to_sheet(exp);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "véhicules "+(new Date().getDate()) +"_"+ (new Date().getMonth() + 1).toString().padStart(2,'0') +"_"+ new Date().getFullYear());
        let wopts = { bookType:'xlsx',bookSST:false,type:'array'};
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "export_"+this.state.vehiclesRaw.length+"v_"+new Date().getDate().toString().padStart(2,'0')+"_"+new Date().getMonth().toString().padStart(2,'0')+"_"+new Date().getFullYear().toString().padStart(4,'0')+".xlsx");
    }
    
    /*FILTERS HANDLERS*/
    //===VEHICLES FILTERS===
    switchArchiveFilterV = value => {
        this.setState({
            archiveFilterV:value
        })
        this.loadVehicles();
    }
    setFinanceFilterV = value => {
        this.setState({
            financeFilterV:value
        })
        this.loadVehicles();
    }
    setReportLateFilterV = value => {
        this.setState({
            reportLateFilterV:value
        })
        this.loadVehicles();
    }
    setDocsFilterV = value => {
        this.setState({
            docsFilterV:value
        })
        this.loadVehicles();
    }
    setSharedFilterV = value => {
        this.setState({
            sharedFilterV:value
        })
        this.loadVehicles();
    }
    resetAllV = () => {
        let filterNewValues = {};
        this.state.filtersV.forEach(f=>{
            filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
        })
        this.setState(filterNewValues);
        this.loadVehicles();
    }

    /*DB READ AND WRITE*/
    loadVehicles = () => {
        this.props.client.query({
            query:this.state.vehiclesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let vehicles = data.vehicles;
            if(!this.props.user.isAdmin || this.props.user.visibility != "noidthisisgroupvisibility" || this.props.societeFilter != "noidthisisgroupvisibility"){
                vehicles = vehicles.filter(v =>{
                    return (v.societe._id == this.props.societeFilter || v.sharedTo._id == this.props.societeFilter)
                });
            }
            this.setState({
                vehiclesRaw:vehicles,
                currentSocieteFilter:this.props.societeFilter
            })
            this.applyVehiclesFilter();
        })
    }
    applyVehiclesFilter = () => {
        let vehiclesFiltered = JSON.parse(JSON.stringify(this.state.vehiclesRaw));
        if(vehiclesFiltered.length != 0){
            vehiclesFiltered = vehiclesFiltered.filter(v =>
                v.archived == this.state.archiveFilterV
            );
            if(this.state.sharedFilterV){
                vehiclesFiltered = vehiclesFiltered.filter(v => v.shared);
            }
            vehiclesFiltered = vehiclesFiltered.filter(v =>{
                if(this.state.financeFilterV != "all"){
                    if(this.state.financeFilterV == "missing"){
                        return !v.financialInfosComplete
                    }
                    if(this.state.financeFilterV == "complete"){
                        return v.financialInfosComplete
                    }
                }else{
                    return true;
                }
            });
            vehiclesFiltered = vehiclesFiltered.filter(v =>{
                if(this.state.docsFilterV == "all"){return true}else{
                    if(v.cg._id == "" || v.cv._id == ""){
                        return true
                    }else{
                        return false
                    }
                }}
            )
            vehiclesFiltered = vehiclesFiltered.filter(v =>{
                if(this.state.reportLateFilterV == "all"){
                    return true
                }else{
                    let days = parseInt(moment().diff(moment(v.lastKmUpdate, "DD/MM/YYYY"),'days'));
                    if(this.state.reportLateFilterV == "2w"){
                        if(days >= 9){
                            return true
                        }else{
                            return false
                        }
                    }else{
                        if(days >= 14){
                            return true
                        }else{
                            return false
                        }
                    }
                }
            });
            vehiclesFiltered.sort((a, b) => a.registration.localeCompare(b.registration))
        }
        this.setState({
            vehiclesFiltered:vehiclesFiltered
        })
    }
    
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadVehicles();
    }
    componentDidUpdate = () => {
        if(this.state.currentSocieteFilter != this.props.societeFilter){
            this.loadVehicles();
        }
    }
    render() {
        return (
            <Fragment>
                <div style={{display:"grid",gridTemplateRows:'auto 1fr',gridTemplateColumns:"1fr",gridGap:"32px 64px",height:"100%"}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <ExportMenu active="vehicles"/>
                    </div>
                    {/*===VEHICLES FILTERS===*/}
                    <Segment.Group key={"expV"+this.props.societeFilter} raised style={{placeSelf:"strech",margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                        <Segment textAlign="center">
                            <Header as="h1" style={{margin:"16px"}}>
                                <Icon size="massive" name="truck"/>
                                Export des véhicules du parc
                            </Header>
                        </Segment>
                        <Segment style={{display:"grid",gridTemplateRows:"auto 1fr auto",gridGap:"24px",padding:"48px"}}>
                            <CustomFilterSegment resetAll={this.resetAllV} style={{placeSelf:"stretch",gridRowStart:"1"}}>
                                {this.state.filtersV.map(f=>{
                                    return(
                                        <CustomFilter key={f.infos} infos={this.state[f.infos]} active={this.state[f.filter]}/>
                                    )
                                })}
                            </CustomFilterSegment>
                            <div>
                                <p style={{fontSize:"1.4rem"}}>Les véhicules exportés dans le fichier Excel répondront à ces critères :</p>
                                {this.state.filtersV.map(f=>{
                                    return(
                                        <Message
                                            key={this.state[f["infos"]].key}
                                            color={this.state[f["infos"]].options.filter(o=>o.value == this.state[f["filter"]])[0].color}>
                                                <Icon size="big" name={this.state[f["infos"]].icon}/>
                                                <strong>{this.state[f["infos"]].options.filter(o=>o.value == this.state[f["filter"]])[0].text}</strong>
                                        </Message>
                                    )
                                })}
                            </div>
                            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gridGap:"16px"}}>
                                <Message icon style={{gridColumnStart:"1",margin:"0"}}>
                                    <Icon name='truck'/>
                                    <Message.Content>
                                        <Message.Header>{this.state.vehiclesFiltered.length} véhicules chargés et filtrés</Message.Header>
                                        sur un total de {this.state.vehiclesRaw.length} véhicules
                                    </Message.Content>
                                </Message>
                                <Button color="blue" size="big" style={{justifySelf:"center",gridColumnStart:"2"}} disabled={this.state.vehiclesFiltered.length == 0} onClick={this.exportVehicles}>Exporter {this.state.vehiclesFiltered.length} vehicules</Button>
                            </div>
                        </Segment>
                    </Segment.Group>
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

export default wrappedInUserContext = withUserContext(withRouter(ExportVehicles));
