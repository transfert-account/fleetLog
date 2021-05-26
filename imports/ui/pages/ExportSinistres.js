import React, { Component, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Button, Icon, Header, Message, Table, Modal, Form, Input, Dropdown } from 'semantic-ui-react';

import ExportMenu from '../molecules/ExportMenu';
import CustomFilterSegment from '../molecules/CustomFilterSegment';
import BigIconButton from '../elements/BigIconButton';

import CustomFilter from '../atoms/CustomFilter';

import { saveAs } from 'file-saver';

import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

export class ExportSinistres extends Component {

    state = {
        step:"filters",
        accidentsQuery : gql`
            query accidents{
                accidents{
                    _id
                    occurenceDate
                    driver
                    description
                    dateExpert
                    dateTravaux
                    constatSent
                    rapportExp{
                        _id
                    }
                    constat{
                        _id
                    }
                    facture{
                        _id
                    }
                    questionary{
                        _id
                    }
                    archived
                    responsabilite
                    reglementAssureur
                    chargeSinistre
                    montantInterne
                    status
                    vehicle{
                        _id
                        societe{
                            _id
                            trikey
                            name
                        }
                        registration
                        brand{
                            _id
                            name
                        }
                        model{
                            _id
                            name
                        }
                        shared
                        sharedTo{
                            _id
                            name
                        }
                    }
                }
            }
        `,
        accidentsRaw:[],
        accidentsFiltered:[],
        exportTemplatesRaw:[],
        openLoadExportTemplate:false,
        openSaveExportTemplate:false,
        newTemplateName:"",
        //===ACCIDENTS FILTERS===
        constatFilter:"all",
        statusFilter:"all",
        responsabiliteFilter:"all",
        archiveFilter:false,
        docsFilter:"all",
        filters:[
            {
                infos:"constatInfos",
                filter:"constatFilter"
            },{
                infos:"statusInfos",
                filter:"statusFilter"
            },{
                infos:"responsabiliteInfos",
                filter:"responsabiliteFilter"
            },{
                infos:"docsFilterInfos",
                filter:"docsFilter"
            },{
                infos:"archiveFilterInfos",
                filter:"archiveFilter"
            }
        ],
        constatInfos:{
            icon:"send",            
            options:[
                {
                    key: 'constatall',
                    initial: true,
                    text: 'Tous les accidents',
                    value: "all",
                    color:"",
                    click:()=>{this.switchConstatFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'constatfalse',
                    initial: false,
                    text: 'Constat non envoyé',
                    value: "no",
                    color:"red",
                    click:()=>{this.switchConstatFilter("no")},
                    label: { color: 'red', empty: true, circular: true },
                },
                {
                    key: 'constatinternal',
                    initial: false,
                    text: "Non déclaré à l'assureur",
                    value: "internal",
                    color:"blue",
                    click:()=>{this.switchConstatFilter("internal")},
                    label: { color: 'blue', empty: true, circular: true },
                },
                {
                    key: 'constattrue',
                    initial: false,
                    text: 'Constat envoyé',
                    value: "yes",
                    color:"green",
                    click:()=>{this.switchConstatFilter("yes")},
                    label: { color: 'green', empty: true, circular: true },
                }
            ]
        },
        statusInfos:{
            icon:"unlock",            
            options:[
                {
                    key: 'statusall',
                    initial: true,
                    text: 'Tous les accidents',
                    value: "all",
                    color:"",
                    click:()=>{this.switchStatusFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'statusfalse',
                    initial: false,
                    text: 'Accidents ouverts',
                    value: false,
                    color:"green",
                    click:()=>{this.switchStatusFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'statustrue',
                    initial: false,
                    text: 'Accidents clos',
                    value: true,
                    color:"blue",
                    click:()=>{this.switchStatusFilter(true)},
                    label: { color: 'blue', empty: true, circular: true },
                }
            ]
        },
        responsabiliteInfos:{
            icon:"law",            
            options:[
                {
                    key: 'responsabiliteall',
                    initial: true,
                    text: 'Accidents actuels',
                    value: "all",
                    color:"",
                    click:()=>{this.switchResponsabiliteFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'responsabilite0',
                    initial: false,
                    text: 'Reponsable à 0%',
                    value: 0,
                    color:"green",
                    click:()=>{this.switchResponsabiliteFilter(0)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'responsabilite50',
                    initial: false,
                    text: 'Responsable à 50%',
                    value: 50,
                    color:"yellow",
                    click:()=>{this.switchResponsabiliteFilter(50)},
                    label: { color: 'yellow', empty: true, circular: true },
                },
                {
                    key: 'responsabilitetrue',
                    initial: false,
                    text: 'Responsable à 100%',
                    value: 100,
                    color:"orange",
                    click:()=>{this.switchResponsabiliteFilter(100)},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'responsabilitetbd',
                    initial: false,
                    text: 'Responsabilité à définir',
                    value: -1,
                    color:"blue",
                    click:()=>{this.switchResponsabiliteFilter(-1)},
                    label: { color: 'blue', empty: true, circular: true },
                }
            ]
        },
        docsFilterInfos:{
            icon:"folder open outline",            
            options:[
                {
                    key: 'docsall',
                    initial: true,
                    text: 'Tous les accidents',
                    value: "all",
                    color:"",
                    click:()=>{this.setDocsFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'docsmissing',
                    initial: false,
                    text: 'Documents manquants',
                    value: "missingDocs",
                    color:"red",
                    click:()=>{this.setDocsFilter("missingDocs")},
                    label: { color: 'red', empty: true, circular: true }
                }
            ]
        },
        archiveFilterInfos:{
            icon:"archive",            
            options:[
                {
                    key: 'archivefalse',
                    initial: true,
                    text: 'Accidents actuels',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    initial: false,
                    text: 'Accidents archivés',
                    value: true,
                    color:"orange",
                    click:()=>{this.switchArchiveFilter(true)},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        availableColumns:[
            {key:"soc",active:false,colOrder:-1,label:"Propriétaire",access:(a)=>a.vehicle.societe.name},
            {key:"ope",active:false,colOrder:-1,label:"Opérationnel à",access:(a)=>{
                if(a.vehicle.shared){
                    return(a.vehicle.sharedTo.name)
                }else{
                    return(a.vehicle.societe.name)
                }
            }},
            {key:"reg",active:false,colOrder:-1,label:"Immatriculation",access:(a)=>a.vehicle.registration},
            {key:"ocd",active:false,colOrder:-1,label:"Date",access:(a)=>a.occurenceDate},
            {key:"drv",active:false,colOrder:-1,label:"Conducteur",access:(a)=>a.driver},
            {key:"brd",active:false,colOrder:-1,label:"Marque du véhicule",access:(a)=>a.vehicle.brand.name},
            {key:"mod",active:false,colOrder:-1,label:"Modèle du véhicule",access:(a)=>a.vehicle.model.name},
            {key:"cst",active:false,colOrder:-1,label:"Envoi du constat",access:(a)=>{
                if(a.status == "yes"){
                    return "Envoyé"
                }else{
                    if(a.status == "internal"){
                        return "Non déclaré"
                    }else{
                        return "Non"
                    }
                }
            }},
            {key:"rsp",active:false,colOrder:-1,label:"Responsabilite",access:(a)=>a.responsabilite + "%"},
            {key:"ras",active:false,colOrder:-1,label:"Reglement assureur",access:(a)=>a.reglementAssureur + " €"},
            {key:"crg",active:false,colOrder:-1,label:"Charge sinistre",access:(a)=>a.chargeSinistre + " €"},
            {key:"int",active:false,colOrder:-1,label:"Montant interne",access:(a)=>a.montantInterne + " €"},
            {key:"stt",active:false,colOrder:-1,label:"Status",access:(a)=>{
                if(a.status){
                    return "Ouvert"
                }else{
                    return "Clos"
                }
            }},
            {key:"exp",active:false,colOrder:-1,label:"Passage de l'expert",access:(a)=>a.dateExpert},
            {key:"tvx",active:false,colOrder:-1,label:"Date des travaux",access:(a)=>a.dateTravaux},
            {key:"arc",active:false,colOrder:-1,label:"Archivé",access:(a)=>a.archived},
        ],
        addExportTemplateQuery : gql`
            mutation addExportTemplate($name:String!,$type:String!,$scope:String!,$columns:String!){
                addExportTemplate(name:$name,type:$type,scope:$scope,columns:$columns){
                    status
                    message
                }
            }
        `,
        exportTemplatesQuery: gql`
            query exportTemplates($type:String!){
                exportTemplates(type:$type){
                    _id
                    name
                    columns{
                        colOrder
                        key
                    }
                    scope
                }
            }
        `,
        templateIsSelected: false,
        selectedTemplate: {}
    }

    exportAccidents = () => {
        let exp = [];
        this.state.accidentsFiltered.map(v=>{
            let aAccident = {};
            this.state.availableColumns.filter(c=>c.active).sort((a,b)=>a.colOrder-b.colOrder).map(c=>{
                aAccident[c.label] = c.access(v);
            })
            exp.push(aAccident)
        });
        var ws = XLSX.utils.json_to_sheet(exp);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "accidents "+(new Date().getDate()) +"_"+ (new Date().getMonth() + 1).toString().padStart(2,'0') +"_"+ new Date().getFullYear());
        let wopts = { bookType:'xlsx',bookSST:false,type:'array'};
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "export_"+this.state.accidentsRaw.length+"v_"+new Date().getDate().toString().padStart(2,'0')+"_"+new Date().getMonth().toString().padStart(2,'0')+"_"+new Date().getFullYear().toString().padStart(4,'0')+".xlsx");
    }
    
    /*SHOW AND HIDE MODALS*/
    showLoadExportTemplate = () => {
        this.setState({openLoadExportTemplate:true});
    }
    closeLoadExportTemplate = () => {
        this.setState({openLoadExportTemplate:false});
    }
    showSaveExportTemplate = () => {
        this.setState({openSaveExportTemplate:true});
    }
    closeSaveExportTemplate = () => {
        this.setState({openSaveExportTemplate:false});
    }
    /*FILTERS HANDLERS*/
    /*CHANGE HANDLERS*/
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    onTemplateSelected = (e, { value }) => {
        let selectedTemplate = this.state.exportTemplatesRaw.filter(et=>et._id == value)[0];
        selectedTemplate.columns = selectedTemplate.columns.map(et=>{return({key:et.key,colOrder:et.colOrder,label:this.state.availableColumns.filter(c=>c.key == et.key)[0].label})})
        this.setState({
            templateIsSelected:true,
            selectedTemplate:selectedTemplate
        })
    }
    setStep = step => {
        this.setState({step:step})
    }
    selectColumn = key => {
        let cols = this.state.availableColumns
        cols.filter(c=>c.key == key)[0].active = true;
        cols.filter(c=>c.key == key)[0].colOrder = cols.filter(c=>c.active).length - 1;
        this.setState({availableColumns:cols})
    }
    unselectColumn = key => {
        let cols = this.state.availableColumns
        cols.filter(c=>c.key == key)[0].active = false;
        cols.filter(c=>c.key == key)[0].colOrder = - 1;
        cols.filter(c=>c.active).sort((a,b)=>a-b).forEach((c,i)=>{c.colOrder = i})
        this.setState({availableColumns:cols})
    }
    columnUp = key => {
        let cols = this.state.availableColumns
        let newI = cols.filter(c=>c.key == key)[0].colOrder - 1;
        cols.filter(c=>c.colOrder == newI)[0].colOrder = cols.filter(c=>c.key == key)[0].colOrder
        cols.filter(c=>c.key == key)[0].colOrder = newI
        this.setState({availableColumns:cols})
    }
    columnDown = key => {
        let cols = this.state.availableColumns
        let newI = cols.filter(c=>c.key == key)[0].colOrder + 1;
        cols.filter(c=>c.colOrder == newI)[0].colOrder = cols.filter(c=>c.key == key)[0].colOrder
        cols.filter(c=>c.key == key)[0].colOrder = newI
        this.setState({availableColumns:cols})
    }
    //===ACCIDENTS FILTERS===
    switchConstatFilter = value => {
        this.setState({
            constatFilter:value
        })
        this.loadAccidents();
    }
    switchStatusFilter = value => {
        this.setState({
            statusFilter:value
        });
        this.loadAccidents();
    }
    switchResponsabiliteFilter = value => {
        this.setState({
            responsabiliteFilter:value
        });
        this.loadAccidents();
    }
    switchArchiveFilter = value => {
        this.setState({
            archiveFilter:value
        })
        this.loadAccidents();
    }
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
        this.loadAccidents();
    }
    resetAll = () => {
        let filterNewValues = {};
        this.state.filters.forEach(f=>{
            filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
        })
        this.setState(filterNewValues);
        this.loadAccidents();
    }

    /*DB READ AND WRITE*/
    loadAccidents = () => {
        this.props.client.query({
            query:this.state.accidentsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let accidents = data.accidents;
            if(!this.props.user.isAdmin || this.props.user.visibility != "noidthisisgroupvisibility" || this.props.societeFilter != "noidthisisgroupvisibility"){
                accidents = accidents.filter(a =>{
                    return (a.vehicle.societe._id == this.props.societeFilter || a.vehicle.sharedTo._id == this.props.societeFilter)
                });
            }
            this.setState({
                accidentsRaw:accidents,
                currentSocieteFilter:this.props.societeFilter
            })
            this.applyAccidentsFilter();
        })
    }
    applyAccidentsFilter = () => {
        let accidentsFiltered = JSON.parse(JSON.stringify(this.state.accidentsRaw));
        if(accidentsFiltered.length != 0){
            if(this.state.constatFilter != "all"){
                accidentsFiltered = accidentsFiltered.filter(a =>{return a.constatSent == this.state.constatFilter})  
            }
            if(this.state.statusFilter != "all"){
                accidentsFiltered = accidentsFiltered.filter(a =>{return a.status == this.state.statusFilter})  
            }
            if(this.state.responsabiliteFilter != "all"){
                accidentsFiltered = accidentsFiltered.filter(a =>{return a.responsabilite == this.state.responsabiliteFilter})
            }
            if(this.state.archiveFilter != false){
                accidentsFiltered = accidentsFiltered.filter(a =>{return a.archived == this.state.archiveFilter})
            }
            if(this.state.docsFilter != "all"){
                accidentsFiltered = accidentsFiltered.filter(a =>{
                    return (a.rapportExp._id == "" || a.constat._id == "" || a.facture._id == "" || a.questionary._id == "")
                })  
            }
            accidentsFiltered.sort((a, b) => a.vehicle.registration.localeCompare(b.vehicle.registration))
        }
        this.setState({
            accidentsFiltered:accidentsFiltered
        })
    }
    loadExportTemplates = () => {
        this.props.client.query({
            query:this.state.exportTemplatesQuery,
            variables:{
                type:"accident"
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                exportTemplatesRaw:data.exportTemplates
            })
        })
    }
    saveExportTemplate = () => {
        let columns = this.state.availableColumns.filter(x=>x.active).sort((a,b)=> a.colOrder - b.colOrder).map(c=>{return({colOrder:c.colOrder,key:c.key})});
        this.props.client.mutate({
            mutation:this.state.addExportTemplateQuery,
            variables:{
                name:this.state.newTemplateName,
                columns:JSON.stringify(columns),
                type:"accident",
                scope:"individual"
            }
        }).then(({data})=>{
            data.addExportTemplate.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({openSaveExportTemplate:false})
                    this.loadExportTemplates();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    loadExportTemplate = () => {
        let availableColumns = this.state.availableColumns;
        availableColumns.forEach(ac=>{
            ac.active = false;
            ac.colOrder = -1;
        })
        this.state.selectedTemplate.columns.forEach(sc=>{
            availableColumns.filter(ac=>ac.key == sc.key)[0].active = true
            availableColumns.filter(ac=>ac.key == sc.key)[0].colOrder = sc.colOrder
        })
        this.setState({openLoadExportTemplate:false,availableColumns:availableColumns})
    }
    
    /*CONTENT GETTERS*/
    getAvailableTable = () => {
        return (
            <div style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                <Header as="h2" textAlign="center">Colonnes disponibles</Header>
                <div style={{placeSelf:"stretch",overflowY:"scroll"}}>
                    <Table striped celled color="red" compact="very">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign="center">Colonne</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.availableColumns.filter(x=>!x.active).map(c=>{
                                return(
                                    <Table.Row>
                                        <Table.Cell>{c.label}</Table.Cell>
                                        <Table.Cell collapsing textAlign="center">
                                            <Button color="green" size="small" icon="plus" onClick={()=>this.selectColumn(c.key)}/>
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
    getSelectedTable = () => {
        return (
            <div style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                <Header as="h2" textAlign="center">Colonnes selectionnées</Header>
                <div style={{placeSelf:"stretch",overflowY:"scroll"}}>
                    <Table striped celled color="green" compact="very">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign="center">Ordre</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Colonne</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.availableColumns.filter(x=>x.active).sort((a,b)=> a.colOrder - b.colOrder).map((c,i)=>{
                                return(
                                    <Table.Row>
                                        <Table.Cell textAlign="center">#{c.colOrder+1}</Table.Cell>
                                        <Table.Cell>{c.label}</Table.Cell>
                                        <Table.Cell collapsing textAlign="center">
                                            <Button color="blue" size="small" icon="arrow up" onClick={()=>this.columnUp(c.key)} disabled={i == 0}/>
                                            <Button color="blue" size="small" icon="arrow down" onClick={()=>this.columnDown(c.key)} disabled={i == this.state.availableColumns.filter(x=>x.active).length-1}/>
                                            <Button color="red" size="small" icon="cancel" style={{marginLeft:"12px"}} onClick={()=>this.unselectColumn(c.key)}/>
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
    getSegmentBody = () => {
        if(this.state.step == "filters"){
            return(
                <div style={{display:"grid",gridTemplateRows:"auto 1fr auto",gridGap:"24px",placeSelf:"stretch",gridColumnEnd:"span 3"}}>
                    <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"1"}}>
                        {this.state.filters.map(f=>{
                            return(
                                <CustomFilter key={f.infos} infos={this.state[f.infos]} active={this.state[f.filter]}/>
                            )
                        })}
                    </CustomFilterSegment>
                    <div>
                        <p style={{fontSize:"1.4rem"}}>Les accidents exportés dans le fichier Excel répondront à ces critères :</p>
                        {this.state.filters.map(f=>{
                            return(
                                <Message
                                    key={this.state[f["infos"]].icon+"key"}
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
                                <Message.Header>{this.state.accidentsFiltered.length} accidents chargés et filtrés</Message.Header>
                                sur un total de {this.state.accidentsRaw.length} accidents
                            </Message.Content>
                        </Message>
                        <Button icon icon="angle double right" labelPosition="right" size="big" style={{justifySelf:"center",gridColumnStart:"2"}} disabled={this.state.accidentsFiltered.length == 0} onClick={()=>this.setStep("columns")} content="Structure du fichier"/>
                    </div>
                </div>
            )
        }
        if(this.state.step == "columns"){
            return(
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gridTemplateRows:"minmax(0,1fr) auto",gridGap:"24px",placeSelf:"stretch",gridColumnEnd:"span 3"}}>
                    {this.getAvailableTable()}
                    <Icon name="arrows alternate horizontal" size="huge" disabled style={{marginTop:"64px"}}/>
                    {this.getSelectedTable()}
                    <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"grid",gridTemplateColumns:"auto 1fr auto",gridGap:"16px"}}>
                        <Button icon="angle double left" labelPosition="left" size="big" style={{justifySelf:"center",gridColumnStart:"1"}} disabled={this.state.accidentsFiltered.length == 0} onClick={()=>this.setStep("filters")} content="Retour aux filtres"/>
                        <Message icon style={{margin:"0"}}>
                            <Icon name='wrench'/>
                            <Message.Content>
                                <Message.Header>{this.state.accidentsFiltered.length} accidents chargés et filtrés</Message.Header>
                                sur un total de {this.state.accidentsRaw.length} accidents
                            </Message.Content>
                        </Message>
                        <Button labelPosition="right" icon icon="file excel outline" disabled={this.state.availableColumns.filter(c=>c.active).length == 0} color="blue" size="big" style={{justifySelf:"center",gridColumnStart:"3"}} onClick={this.exportAccidents} content={"Exporter " + this.state.accidentsFiltered.length + " accidents"}/>
                    </div>
                </div>
            )
        }
    }
    getBigButtons = () => {
        if(this.state.step == "columns"){
            return (
                <Fragment>
                    <BigIconButton color="blue" icon="download" onClick={this.showLoadExportTemplate} tooltip={"Charger"}/>
                    <BigIconButton color="blue" icon="save outline" onClick={this.showSaveExportTemplate} disabled={this.state.availableColumns.filter(c=>c.active).length == 0} tooltip={"Sauvegarder"}/>
                </Fragment>
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadAccidents();
        this.loadExportTemplates();
    }
    componentDidUpdate = () => {
        if(this.state.currentSocieteFilter != this.props.societeFilter){
            this.loadAccidents();
        }
    }
    render() {
        return (
            <Fragment>
                <div style={{display:"grid",gridTemplateRows:'auto minmax(0,1fr)',gridTemplateColumns:"auto 1fr auto",gridGap:"32px",height:"100%"}}>
                    <ExportMenu active="sinistres"/>
                    <div style={{display:"flex",justifyContent:"flex-end",gridColumnStart:"3"}}>
                        {this.getBigButtons()}
                    </div>
                    {this.getSegmentBody()}
                </div>
                <Modal size='small' closeOnDimmerClick={false} open={this.state.openLoadExportTemplate} onClose={this.closeLoadExportTemplate} closeIcon>
                    <Modal.Header>
                        Charger les colonnes d'un template ?
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Dropdown placeholder="Choisir un template d'export" selection onChange={this.onTemplateSelected} options={this.state.exportTemplatesRaw.map(t=>{return{key:t._id,text:t.name,value:t._id}})} />
                        {(this.state.templateIsSelected ? 
                            <Fragment>
                                <Table striped compact="very" celled>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell textAlign="center" colSpan="2">
                                                {this.state.selectedTemplate.name}
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.state.selectedTemplate.columns.map(c=>{
                                            return(
                                                <Table.Row>
                                                    <Table.Cell>{"#" + parseInt(c.colOrder + 1)}</Table.Cell>
                                                    <Table.Cell>{c.label}</Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </Table.Body>
                                </Table>
                            </Fragment>
                        :
                            ""
                        )}
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeLoadExportTemplate}>Annuler</Button>
                        <Button color="blue" onClick={this.loadExportTemplate}>Charger</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size='small' closeOnDimmerClick={false} open={this.state.openSaveExportTemplate} onClose={this.closeSaveExportTemplate} closeIcon>
                    <Modal.Header>
                        Sauvegarder ces colonnes dans un template ?
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form>
                            <Form.Field>
                                <label>Nom du template</label>
                                <Input placeholder='Nom du template' onChange={this.handleChange} name="newTemplateName"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeSaveExportTemplate}>Annuler</Button>
                        <Button color="blue" disabled={this.state.newTemplateName.length == 0} onClick={this.saveExportTemplate}>Sauvegarder</Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(ExportSinistres));
