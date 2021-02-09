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
        entretiensQuery : gql`
            query entretiens{
                entretiens{
                    _id
                    description
                    archived
                    title
                    fromControl
                    control{
                        _id
                        equipementDescription{
                            _id
                            name
                        }
                    }
                    societe{
                        _id
                        trikey
                        name
                    }
                    commandes{
                        _id
                        piece{
                            _id
                            name
                            type
                        }
                        entretien
                        status
                        price
                    }
                    ficheInter{
                        _id
                    }
                    vehicle{
                        _id
                        societe{
                            _id
                            trikey
                            name
                        }
                        registration
                        firstRegistrationDate
                        km
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
                        color{
                            _id
                            name
                            hex
                        }
                        insurancePaid
                        property
                        sharedTo{
                            _id
                            name
                        }
                    }
                }
            }
        `,
        entretiensRaw:[],
        entretiensFiltered:[],

        //===ENTRETIENS FILTERS===
        archiveFilterE:false,
        docsFilterE:"all",
        orderStatusFilterE:"all",
        fromControlFilterE:"all",
        filtersE:[
            {
                infos:"archiveFilterInfosE",
                filter:"archiveFilterE"
            },{
                infos:"ordersFilterInfosE",
                filter:"orderStatusFilterE"
            },{
                infos:"docsFilterInfosE",
                filter:"docsFilterE"
            },{
                infos:"fromControlFilterInfosE",
                filter:"fromControlFilterE"
            }
        ],
        archiveFilterInfosE:{
            icon:"archive",            
            options:[
                {
                    key: 'archivefalse',
                    initial: true,
                    text: 'Entretiens actuels',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilterE(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    initial: false,
                    text: 'Entretiens archivés',
                    value: true,
                    color:"orange",
                    click:()=>{this.switchArchiveFilterE(true)},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        ordersFilterInfosE:{
            icon:"shipping fast",            
            options:[
                {
                    key: 'orderall',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"green",
                    click:()=>{this.setOrderStatusFilterE("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'orderready',
                    initial: false,
                    text: 'Entretiens prêts',
                    value: "ready",
                    color:"blue",
                    click:()=>{this.setOrderStatusFilterE("ready")},
                    label: { color: 'blue', empty: true, circular: true }
                },
                {
                    key: 'orderwaiting',
                    initial: false,
                    text: 'Commandes en livraison',
                    value: "waiting",
                    color:"orange",
                    click:()=>{this.setOrderStatusFilterE("waiting")},
                    label: { color: 'orange', empty: true, circular: true }
                },
                {
                    key: 'ordertodo',
                    initial: false,
                    text: 'Commandes à passer',
                    value: "toDo",
                    color:"red",
                    click:()=>{this.setOrderStatusFilterE("toDo")},
                    label: { color: 'red', empty: true, circular: true }
                }
            ]
        },
        docsFilterInfosE:{
            icon:"folder open outline",            
            options:[
                {
                    key: 'docsall',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"green",
                    click:()=>{this.setDocsFilterE("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'docsmissing',
                    initial: false,
                    text: 'Documents manquants',
                    value: "missingDocs",
                    color:"red",
                    click:()=>{this.setDocsFilterE("missingDocs")},
                    label: { color: 'red', empty: true, circular: true }
                }
            ]
        },
        fromControlFilterInfosE:{
            icon:"clipboard check",            
            options:[
                {
                    key: 'all',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"green",
                    click:()=>{this.setFromControlFilterE("all")},
                    label: { color: 'green', empty: true, circular: true },
                },{
                    key: 'preventive',
                    initial: false,
                    text: 'Entretiens préventifs',
                    value: "preventive",
                    color:"blue",
                    click:()=>{this.setFromControlFilterE("preventive")},
                    label: { color: 'blue', empty: true, circular: true }
                },{
                    key: 'curative',
                    initial: false,
                    text: 'Entretiens curatifs',
                    value: "curative",
                    color:"orange",
                    click:()=>{this.setFromControlFilterE("curative")},
                    label: { color: 'orange', empty: true, circular: true }
                }
            ]
        },
    }

    exportEntretiens = () => {
        let exp = [];
        this.state.entretiensFiltered.map(e=>{
            exp.push({
                "Societé":e.societe.name,
                "Immatriculation":e.vehicle.registration,
                "Marque":e.vehicle.brand.name,
                "Modèle":e.vehicle.model.name,
                "Kilométrage":e.vehicle.km,
                "Type":(e.fromControl ? "PRÉVENTIF" : "CURATIF"),
                "Nom du contrôle":(e.fromControl ? e.control.equipementDescription.name : "-"),
                "Titre":e.title,
                "Archivé":e.archived
            })
        });
        var ws = XLSX.utils.json_to_sheet(exp);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "entretiens "+(new Date().getDate()) +"_"+ (new Date().getMonth() + 1).toString().padStart(2,'0') +"_"+ new Date().getFullYear());
        let wopts = { bookType:'xlsx',bookSST:false,type:'array'};
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "export_"+this.state.entretiensRaw.length+"e_"+new Date().getDate().toString().padStart(2,'0')+"_"+new Date().getMonth().toString().padStart(2,'0')+"_"+new Date().getFullYear().toString().padStart(4,'0')+".xlsx");
    }
    /*FILTERS HANDLERS*/
    //===ENTRETIENS FILTERS===
    switchArchiveFilterE = value => {
        this.setState({
            archiveFilterE:value
        })
        this.loadEntretiens();
    }
    setOrderStatusFilterE = value => {
        this.setState({
            orderStatusFilterE:value
        })
        this.loadEntretiens();
    }
    setDocsFilterE = value => {
        this.setState({
            docsFilterE:value
        })
        this.loadEntretiens();
    }
    setFromControlFilterE = value => {
        this.setState({
            fromControlFilterE:value
        })
        this.loadEntretiens();
    }
    resetAllE = () => {
        let filterNewValues = {};
        this.state.filtersE.forEach(f=>{
            filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
        })
        this.setState(filterNewValues);
        this.loadEntretiens();
    }
    /*DB READ AND WRITE*/
    loadEntretiens = () => {
        this.props.client.query({
            query:this.state.entretiensQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let entretiens = data.entretiens;
            if(!this.props.user.isAdmin || this.props.user.visibility != "noidthisisgroupvisibility" || this.props.societeFilter != "noidthisisgroupvisibility"){
                entretiens = entretiens.filter(e =>{
                    return (e.vehicle.societe._id == this.props.societeFilter || e.vehicle.sharedTo._id == this.props.societeFilter)
                });
            }
            this.setState({
                entretiensRaw:entretiens,
                currentSocieteFilter:this.props.societeFilter
            })
            this.applyEntretiensFilter();
        })
    }
    applyEntretiensFilter = () => {
        let entretiensFiltered = JSON.parse(JSON.stringify(this.state.entretiensRaw));
        if(entretiensFiltered.length != 0){
            entretiensFiltered = entretiensFiltered.filter(e =>
                e.archived == this.state.archiveFilterE
            );
            if(this.state.orderStatusFilterE != "all"){
                if(this.state.orderStatusFilterE == "ready"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{
                        if(e.commandes.filter(c=>c.status != 3).length == 0){
                            return true;
                        }else{
                            return false;
                        }
                    })  
                }
                if(this.state.orderStatusFilterE == "waiting"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{
                        if(e.commandes.filter(c=>c.status == 2).length > 0){
                            return true;
                        }else{
                            return false;
                        }
                    })
                }
                if(this.state.orderStatusFilterE == "toDo"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{
                        if(e.commandes.filter(c=>c.status == 1).length > 0){
                            return true;
                        }else{
                            return false;
                        }
                    })
                }
            }
            entretiensFiltered = entretiensFiltered.filter(e =>{
                if(this.state.docsFilterE == "all"){
                    return true
                }else{
                    if(e.ficheInter._id == ""){
                        return true
                    }else{
                        return false
                    }
                }}
            )
            entretiensFiltered = entretiensFiltered.filter(e =>{
                if(this.state.fromControlFilterE == "all"){
                    return true
                }else{
                    if(this.state.fromControlFilterE == "preventive"){
                        if(e.fromControl){
                            return true
                        }else{
                            return false
                        }
                    }
                    if(this.state.fromControlFilterE == "curative"){
                        if(e.fromControl){
                            return false
                        }else{
                            return true
                        }
                    }
                }}
            )
            entretiensFiltered.sort((a, b) => a.vehicle.registration.localeCompare(b.vehicle.registration))
        }
        this.setState({
            entretiensFiltered:entretiensFiltered
        })
    }
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadEntretiens();
    }
    componentDidUpdate = () => {
        if(this.state.currentSocieteFilter != this.props.societeFilter){
            this.loadEntretiens();
        }
    }
    render() {
        return (
            <Fragment>
                <div style={{display:"grid",gridTemplateRows:'auto 1fr',gridTemplateColumns:"1fr",gridGap:"32px 64px",height:"100%"}}>
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <ExportMenu active="entretiens"/>
                    </div>
                    {/*===ENTRETIENS FILTERS===*/}
                    <Segment.Group key={"expE"+this.props.societeFilter} raised style={{placeSelf:"strech",margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                        <Segment textAlign="center">
                            <Header as="h1" style={{margin:"16px"}}>
                                <Icon size="massive" name="wrench"/>
                                Export des entretiens du parc
                            </Header>
                        </Segment>
                        <Segment style={{display:"grid",gridTemplateRows:"auto 1fr auto",gridGap:"24px",padding:"48px"}}>
                            <CustomFilterSegment resetAll={this.resetAllE} style={{placeSelf:"stretch",gridRowStart:"1"}}>
                                {this.state.filtersE.map(f=>{
                                    return(
                                        <CustomFilter infos={this.state[f.infos]} active={this.state[f.filter]}/>
                                    )
                                })}
                            </CustomFilterSegment>
                            <div>
                                <p style={{fontSize:"1.4rem"}}>Les entretiens exportés dans le fichier Excel répondront à ces critères :</p>
                                {this.state.filtersE.map(f=>{
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
                                    <Icon name='wrench'/>
                                    <Message.Content>
                                        <Message.Header>{this.state.entretiensFiltered.length} entretiens chargés et filtrés</Message.Header>
                                        sur un total de {this.state.entretiensRaw.length} entretiens
                                    </Message.Content>
                                </Message>
                                <Button color="blue" size="big" style={{justifySelf:"center",gridColumnStart:"2"}} disabled={this.state.entretiensFiltered.length == 0} onClick={this.exportEntretiens}>Exporter {this.state.entretiensFiltered.length} entretiens</Button>
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
