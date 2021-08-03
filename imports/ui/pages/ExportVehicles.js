import React, { Component, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { Button, Icon, Header, Message, Table, Modal, Form, Input, Dropdown, Segment } from 'semantic-ui-react';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import ExportMenu from '../molecules/ExportMenu';
import CustomFilterSegment from '../molecules/CustomFilterSegment';
import BigIconButton from '../elements/BigIconButton';

import CustomFilter from '../atoms/CustomFilter';

import { saveAs } from 'file-saver';

import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import moment from "moment";

export class ExportVehicles extends Component {

    state = {
        step:"filters",
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
        exportTemplatesRaw:[],
        openLoadExportTemplate:false,
        openSaveExportTemplate:false,
        newTemplateName:"",
        //===VEHICLES FILTERS===
        archiveFilter:false,
        reportLateFilter:"all",
        docsFilter:"all",
        financeFilter:"all",
        sharedFilter:false,
        filters:[
            {
                infos:"financeFilterInfosV",
                filter:"financeFilter"
            },{
                infos:"sharedFilterInfosV",
                filter:"sharedFilter"
            },{
                infos:"reportLateFilterInfosV",
                filter:"reportLateFilter"
            },{
                infos:"docsFilterInfosV",
                filter:"docsFilter"
            },{
                infos:"archiveFilterInfosV",
                filter:"archiveFilter"
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
                    color:"",
                    click:()=>{this.setFinanceFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'financemissing',
                    initial: false,
                    text: 'Infos de financement manquantes',
                    value: "missing",
                    color:"red",
                    click:()=>{this.setFinanceFilter("missing")},
                    label: { color: 'red', empty: true, circular: true },
                },
                {
                    key: 'financecomplete',
                    initial: false,
                    text: 'Infos de financement complètes',
                    value: "complete",
                    color:"blue",
                    click:()=>{this.setFinanceFilter("complete")},
                    label: { color: 'blue', empty: true, circular: true },
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
                    color:"",
                    click:()=>{this.setSharedFilter(false)},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'sharedtrue',
                    initial: false,
                    text: 'Véhicules en prêt',
                    value: true,
                    color:"teal",
                    click:()=>{this.setSharedFilter(true)},
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
                    color:"",
                    click:()=>{this.setReportLateFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'report2w',
                    initial: false,
                    text: 'Relevé > 9 jours',
                    value: "2w",
                    color:"orange",
                    click:()=>{this.setReportLateFilter("2w")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'report4w',
                    initial: false,
                    text: 'Relevé > 14 jours',
                    value: "4w",
                    color:"red",
                    click:()=>{this.setReportLateFilter("4w")},
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
        archiveFilterInfosV:{
            icon:"archive",            
            options:[
                {
                    key: 'archivefalse',
                    initial: true,
                    text: 'Véhicules actuels',
                    value: false,
                    color:"green",
                    click:()=>{this.switchArchiveFilter(false)},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'archivetrue',
                    initial: false,
                    text: 'Véhicules archivés',
                    value: true,
                    color:"orange",
                    click:()=>{this.switchArchiveFilter(true)},
                    label: { color: 'orange', empty: true, circular: true },
                }
            ]
        },
        selectedColumns:[],
        availableColumns:[
            {key:"soc",active:false,colOrder:-1,label:"Propriétaire",access:(v)=>v.societe.name},
            {key:"ope",active:false,colOrder:-1,label:"Opérationnel à",access:(v)=>{
                if(v.shared){
                    return(v.sharedTo.name)
                }else{
                    return(v.societe.name)
                }
            }},
            {key:"sel",active:false,colOrder:-1,label:"En vente",access:(v)=>{
                if(v.sold){
                    return "VENDU"
                }else{
                    if(v.selling){
                        return "OUI"
                    }else{
                        return "NON"
                    }
                }
            }},
            {key:"brk",active:false,colOrder:-1,label:"En réparation",access:(v)=>(v.broken?"OUI":"NON")},
            {key:"reg",active:false,colOrder:-1,label:"Immatriculation",access:(v)=>v.registration},
            {key:"rgd",active:false,colOrder:-1,label:"Date Immatriculation",access:(v)=>v.firstRegistrationDate},
            {key:"kms",active:false,colOrder:-1,label:"Kilometrage",access:(v)=>v.km},
            {key:"kmu",active:false,colOrder:-1,label:"Dernier relevé",access:(v)=>v.lastKmUpdate},
            {key:"brd",active:false,colOrder:-1,label:"Marque",access:(v)=>v.brand.name},
            {key:"mod",active:false,colOrder:-1,label:"Modèle",access:(v)=>v.model.name},
            {key:"vol",active:false,colOrder:-1,label:"Volume (m²)",access:(v)=>v.volume.meterCube},
            {key:"pld",active:false,colOrder:-1,label:"Charge utile (t.)",access:(v)=>v.payload},
            {key:"nrg",active:false,colOrder:-1,label:"Energie",access:(v)=>v.energy.name},
            {key:"own",active:false,colOrder:-1,label:"Propriété",access:(v)=>v.property},
            {key:"pmf",active:false,colOrder:-1,label:"Format de payement",access:(v)=>v.payementFormat},
            {key:"pmt",active:false,colOrder:-1,label:"Durée de financement (en mois)",access:(v)=>v.payementTime.months},
            {key:"pmd",active:false,colOrder:-1,label:"Début de payement",access:(v)=>v.payementBeginDate},
            {key:"pme",active:false,colOrder:-1,label:"Fin de payement",access:(v)=>v.payementEndDate},
            {key:"cos",active:false,colOrder:-1,label:"Coût",access:(v)=>v.purchasePrice},
            {key:"pmm",active:false,colOrder:-1,label:"Paiement mensuel",access:(v)=>v.monthlyPayement},
            {key:"arc",active:false,colOrder:-1,label:"Archivé",access:(v)=>v.archived}
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
    exportVehicles = () => {
        let exp = [];
        this.state.vehiclesFiltered.map(v=>{
            let aVehicle = {};
            this.state.selectedColumns.sort((a,b)=>a.colOrder-b.colOrder).map(c=>{
                aVehicle[c.label] = c.access(v);
            })
            exp.push(aVehicle)
        });
        var ws = XLSX.utils.json_to_sheet(exp);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "véhicules "+(new Date().getDate()) +"_"+ (new Date().getMonth() + 1).toString().padStart(2,'0') +"_"+ new Date().getFullYear());
        let wopts = { bookType:'xlsx',bookSST:false,type:'array'};
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "export_"+this.state.vehiclesRaw.length+"v_"+new Date().getDate().toString().padStart(2,'0')+"_"+new Date().getMonth().toString().padStart(2,'0')+"_"+new Date().getFullYear().toString().padStart(4,'0')+".xlsx");
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
    handleDragEnd = result => {
        const { destination, source, draggableId} = result;
        let cols = Array.from(this.state.availableColumns)
        let moving = cols.filter(c=>c.key == draggableId)[0]
        let scols = []
        if(
            !destination ||
            destination.droppableId == source.droppableId && destination.index == source.index ||
            destination.droppableId == source.droppableId && moving.active == false
        ){return}
        if(destination.droppableId != source.droppableId){
            if(moving.active){
                moving.active = false;
                moving.colOrder = - 1;
                cols.filter(c=>c.active).sort((a,b)=>a-b).forEach((c,i)=>{c.colOrder = i})
            }else{
                moving.active = true;
                moving.colOrder = cols.filter(c=>c.active).length - 1;
            }
        }
        if(moving.active && destination.index != source.index){
            scols = Array.from(this.state.selectedColumns)
            if(destination.droppableId == source.droppableId){
                scols.splice(source.index,1)
            }
            scols.splice(destination.index,0,moving)
            scols = scols.map((c,i)=>Object.assign(c,{colOrder:i}))
        }else{
            scols = cols.filter(c=>c.active)
        }
        this.setState({availableColumns:cols,selectedColumns:scols})
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
    //===VEHICLES FILTERS===
    switchArchiveFilter = value => {
        this.setState({
            archiveFilter:value
        })
        this.loadVehicles();
    }
    setFinanceFilter = value => {
        this.setState({
            financeFilter:value
        })
        this.loadVehicles();
    }
    setReportLateFilter = value => {
        this.setState({
            reportLateFilter:value
        })
        this.loadVehicles();
    }
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
        this.loadVehicles();
    }
    setSharedFilter = value => {
        this.setState({
            sharedFilter:value
        })
        this.loadVehicles();
    }
    resetAll = () => {
        let filterNewValues = {};
        this.state.filters.forEach(f=>{
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
                v.archived == this.state.archiveFilter
            );
            if(this.state.sharedFilter){
                vehiclesFiltered = vehiclesFiltered.filter(v => v.shared);
            }
            vehiclesFiltered = vehiclesFiltered.filter(v =>{
                if(this.state.financeFilter != "all"){
                    if(this.state.financeFilter == "missing"){
                        return !v.financialInfosComplete
                    }
                    if(this.state.financeFilter == "complete"){
                        return v.financialInfosComplete
                    }
                }else{
                    return true;
                }
            });
            vehiclesFiltered = vehiclesFiltered.filter(v =>{
                if(this.state.docsFilter == "all"){return true}else{
                    if(v.cg._id == "" || v.cv._id == ""){
                        return true
                    }else{
                        return false
                    }
                }}
            )
            vehiclesFiltered = vehiclesFiltered.filter(v =>{
                if(this.state.reportLateFilter == "all"){
                    return true
                }else{
                    let days = parseInt(moment().diff(moment(v.lastKmUpdate, "DD/MM/YYYY"),'days'));
                    if(this.state.reportLateFilter == "2w"){
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
    loadExportTemplates = () => {
        this.props.client.query({
            query:this.state.exportTemplatesQuery,
            variables:{
                type:"vehicle"
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                exportTemplatesRaw:data.exportTemplates
            })
        })
    }
    saveExportTemplate = () => {
        let columns = this.state.selectedColumns.sort((a,b)=> a.colOrder - b.colOrder).map(c=>{return({colOrder:c.colOrder,key:c.key})});
        this.props.client.mutate({
            mutation:this.state.addExportTemplateQuery,
            variables:{
                name:this.state.newTemplateName,
                columns:JSON.stringify(columns),
                type:"vehicle",
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
        this.setState({openLoadExportTemplate:false,availableColumns:availableColumns,selectedColumns:availableColumns.filter(c=>c.active)})
    }
    
    /*CONTENT GETTERS*/
    getAvailableTable = () => {
        return (
            <div style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                <Header as="h2" textAlign="center">Colonnes disponibles</Header>
                <Droppable droppableId="availableList">
                    {(provided)=>(
                        <div
                            style={{placeSelf:"stretch",overflowY:"scroll",paddingRight:"16px"}}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.state.availableColumns.filter(x=>!x.active).map((c,i)=>{
                                return(
                                    <Draggable key={c.key} draggableId={c.key} index={i}>
                                        {(provided)=>(
                                            <div
                                                style={{justifySelf:"stretch"}}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >
                                                <Segment style={{marginBottom:"12px"}}>
                                                    <p>{c.label}</p>
                                                </Segment>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        )
    }
    getSelectedTable = () => {
        return (
            <div style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                <Header as="h2" textAlign="center">Colonnes selectionnées</Header>
                <Droppable droppableId="selectedList">
                    {(provided)=>(
                        <div
                            style={{placeSelf:"stretch",overflowY:"scroll",paddingRight:"16px"}}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {this.state.selectedColumns.sort((a,b)=> a.colOrder - b.colOrder).map((c,i)=>{
                                return(
                                    <Draggable key={c.key} draggableId={c.key} index={i}>
                                        {(provided)=>(
                                            <div
                                                style={{justifySelf:"stretch"}}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                ref={provided.innerRef}
                                            >
                                                <Segment.Group style={{marginBottom:"12px",display:"grid",gridTemplateColumns:"40px 1fr"}} horizontal>
                                                    <Segment color="grey"><p>{c.colOrder}</p></Segment>
                                                    <Segment color="green"><p>{c.label}</p></Segment>
                                                </Segment.Group>
                                            </div>
                                        )}
                                    </Draggable>
                                )
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
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
                        <p style={{fontSize:"1.4rem"}}>Les véhicules exportés dans le fichier Excel répondront à ces critères :</p>
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
                            <Icon name='truck'/>
                            <Message.Content>
                                <Message.Header>{this.state.vehiclesFiltered.length} véhicules chargés et filtrés</Message.Header>
                                sur un total de {this.state.vehiclesRaw.length} véhicules
                            </Message.Content>
                        </Message>
                        <Button icon icon="angle double right" labelPosition="right" size="big" style={{justifySelf:"center",gridColumnStart:"2"}} disabled={this.state.vehiclesFiltered.length == 0} onClick={()=>this.setStep("columns")} content="Structure du fichier"/>
                    </div>
                </div>
            )
        }
        if(this.state.step == "columns"){
            return(
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gridTemplateRows:"minmax(0,1fr) auto",gridGap:"24px",placeSelf:"stretch",gridColumnEnd:"span 3"}}>
                    <DragDropContext onDragEnd={this.handleDragEnd}>
                        {this.getAvailableTable()}
                        <Icon name="arrows alternate horizontal" size="huge" disabled style={{marginTop:"64px"}}/>
                        {this.getSelectedTable()}
                    </DragDropContext>
                    <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"grid",gridTemplateColumns:"auto 1fr auto",gridGap:"16px"}}>
                        <Button icon="angle double left" labelPosition="left" size="big" style={{justifySelf:"center",gridColumnStart:"1"}} disabled={this.state.vehiclesFiltered.length == 0} onClick={()=>this.setStep("filters")} content="Retour aux filtres"/>
                        <Message icon style={{gridColumnStart:"2",margin:"0"}}>
                            <Icon name='truck'/>
                            <Message.Content>
                                <Message.Header>{this.state.vehiclesFiltered.length} véhicules chargés et filtrés</Message.Header>
                                sur un total de {this.state.vehiclesRaw.length} véhicules
                            </Message.Content>
                        </Message>
                        <Button labelPosition="right" icon icon="file excel outline" disabled={this.state.availableColumns.filter(c=>c.active).length == 0} color="blue" size="big" style={{justifySelf:"center",gridColumnStart:"3"}} onClick={this.exportVehicles} content={"Exporter " + this.state.vehiclesFiltered.length + " vehicules"}/>
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
        this.loadVehicles();
        this.loadExportTemplates();
    }
    componentDidUpdate = () => {
        if(this.state.currentSocieteFilter != this.props.societeFilter){
            this.loadVehicles();
        }
    }
    render() {
        return (
            <Fragment>
                <div style={{display:"grid",gridTemplateRows:'auto minmax(0,1fr)',gridTemplateColumns:"auto 1fr auto",gridGap:"32px",height:"100%"}}>
                    <ExportMenu active="vehicles"/>
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

export default wrappedInUserContext = withUserContext(withRouter(ExportVehicles));
