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

export class ExportEntretiens extends Component {

    state = {
        step:"filters",
        entretiensFullQuery : gql`
            query entretiensFull{
                entretiensFull{
                    _id
                    societe{
                        _id
                        name
                    }
                    vehicle{
                        _id
                        societe{
                            _id
                            name
                        }
                        registration
                        km
                        brand{
                            _id
                            name
                        }
                        model{
                            _id
                            name
                        }
                        energy{
                            _id
                            name
                        }
                        shared
                        sharedTo{
                            _id
                            name
                        }
                    }
                    type
                    originNature{
                        _id
                        name
                    }
                    originControl{
                        _id
                        name
                    }
                    notes{
                        _id
                        text
                        date
                    }
                    time
                    kmAtFinish
                    piecesQty{
                        piece{
                            _id
                            type
                            brand
                            reference
                            prixHT
                            name
                        }
                        qty
                    }
                    ficheInter{
                        _id
                        name
                        size
                        path
                        originalFilename
                        ext
                        type
                        mimetype
                        storageDate
                    }
                    occurenceDate
                    status
                    user{
                        _id
                        firstname
                        lastname
                    }
                }
            }
        `,
        entretiensRaw:[],
        entretiensFiltered:[],
        exportTemplatesRaw:[],
        openLoadExportTemplate:false,
        openSaveExportTemplate:false,
        newTemplateName:"",

        //===ENTRETIENS FILTERS===
        docsFilter:"all",
        statusFilter:"all",
        originFilter:"all",
        filters:[
            {
                infos:"statusFilterInfos",
                filter:"statusFilter"
            },{
                infos:"originFilterInfos",
                filter:"originFilter"
            },{
                infos:"docsFilterInfos",
                filter:"docsFilter"
            }
        ],
        statusFilterInfos:{
            icon:"tasks",            
            options:[
                {
                    key: 'statusall',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"",
                    click:()=>{this.setStatusFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'statusopen',
                    initial: false,
                    text: 'Status : Ouvert (non clos)',
                    value: "open",
                    color:"blue",
                    click:()=>{this.setStatusFilter("open")},
                    label: { color: 'blue', empty: true, circular: true }
                },
                {
                    key: 'statuswaiting',
                    initial: false,
                    text: 'Status : En attente',
                    value: "waiting",
                    color:"blue",
                    click:()=>{this.setStatusFilter("waiting")},
                    label: { color: 'blue', empty: true, circular: true }
                },
                {
                    key: 'statusaffected',
                    initial: false,
                    text: 'Status : Affecté',
                    value: "affected",
                    color:"blue",
                    click:()=>{this.setStatusFilter("affected")},
                    label: { color: 'blue', empty: true, circular: true }
                },
                {
                    key: 'statusdone',
                    initial: false,
                    text: 'Status : Réalisé',
                    value: "done",
                    color:"green",
                    click:()=>{this.setStatusFilter("done")},
                    label: { color: 'green', empty: true, circular: true }
                },
                {
                    key: 'statusclosed',
                    initial: false,
                    text: 'Status : Clos',
                    value: "closed",
                    color:"grey",
                    click:()=>{this.setStatusFilter("closed")},
                    label: { color: 'grey', empty: true, circular: true }
                }
            ]
        },
        originFilterInfos:{
            icon:"clipboard check",            
            options:[
                {
                    key: 'all',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"",
                    click:()=>{this.setOriginFilter("all")},
                    label: { color: '', empty: true, circular: true },
                },{
                    key: 'mandatoryAndPreventive',
                    initial: false,
                    text: 'Entretiens provenant de contrôles',
                    value: "mandatoryAndPreventive",
                    color:"blue",
                    click:()=>{this.setOriginFilter("mandatoryAndPreventive")},
                    label: { color: 'blue', empty: true, circular: true }
                },{
                    key: 'mandatory',
                    initial: false,
                    text: 'Entretiens provenant de contrôles obligatoires',
                    value: "mandatory",
                    color:"blue",
                    click:()=>{this.setOriginFilter("mandatory")},
                    label: { color: 'blue', empty: true, circular: true }
                },{
                    key: 'preventive',
                    initial: false,
                    text: 'Entretiens provenant de contrôles préventifs',
                    value: "preventive",
                    color:"blue",
                    click:()=>{this.setOriginFilter("preventive")},
                    label: { color: 'blue', empty: true, circular: true }
                },{
                    key: 'curative',
                    initial: false,
                    text: 'Entretiens curatifs',
                    value: "curative",
                    color:"orange",
                    click:()=>{this.setOriginFilter("curative")},
                    label: { color: 'orange', empty: true, circular: true }
                }
            ]
        },
        docsFilterInfos:{
            icon:"folder open outline",            
            options:[
                {
                    key: 'docsall',
                    initial: true,
                    text: 'Tous les entretiens',
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
        selectedColumns:[],
        availableColumns:[
            {key:"soc",active:false,colOrder:-1,label:"Propriétaire",access:(e)=>e.societe.name},
            {key:"ope",active:false,colOrder:-1,label:"Opérationnel à",access:(e)=>(e.vehicle.shared ? e.vehicle.sharedTo.name : e.vehicle.societe.name)},
            {key:"reg",active:false,colOrder:-1,label:"Immatriculation",access:(e)=>e.vehicle.registration},
            {key:"brd",active:false,colOrder:-1,label:"Marque du véhicule",access:(e)=>e.vehicle.brand.name},
            {key:"mod",active:false,colOrder:-1,label:"Modèle du véhicule",access:(e)=>e.vehicle.model.name},
            {key:"erg",active:false,colOrder:-1,label:"Energie",access:(e)=>e.vehicle.energy.name},
            {key:"kms",active:false,colOrder:-1,label:"Kilométrage",access:(e)=>e.vehicle.km},
            {key:"typ",active:false,colOrder:-1,label:"Type",access:(e)=>e.type},
            {key:"sta",active:false,colOrder:-1,label:"Status",access:(e)=>e.status},
            {key:"org",active:false,colOrder:-1,label:"Origine",access:(e)=>(e.originNature ? e.originNature.name : e.originControl.name)},
            {key:"tim",active:false,colOrder:-1,label:"Temps passé",access:(e)=>e.time},
            {key:"kaf",active:false,colOrder:-1,label:"Kilométrage à la réalisation",access:(e)=>e.kmAtFinish},
            {key:"cst",active:false,colOrder:-1,label:"Coût des pièces",access:(e)=>e.piecesQty.reduce((a,b)=>a + (b.piece.prixHT*b.qty),0)},
            {key:"fin",active:false,colOrder:-1,label:"Fiche d'intervention",access:(e)=>(e.ficheInter._id ? "OUI":"NON")},
            {key:"dat",active:false,colOrder:-1,label:"Date de réalisation",access:(e)=>e.occurenceDate},
            {key:"usr",active:false,colOrder:-1,label:"Affecté à",access:(e)=>(e.user._id ? e.user.lastname + " " + e.user.firstname : "")}
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

    exportEntretiens = () => {
        let exp = [];
        this.state.entretiensFiltered.map(v=>{
            let aEntretien = {};
            this.state.selectedColumns.sort((a,b)=>a.colOrder-b.colOrder).map(c=>{
                aEntretien[c.label] = c.access(v);
            })
            exp.push(aEntretien)
        });
        var ws = XLSX.utils.json_to_sheet(exp);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "entretiens "+(new Date().getDate()) +"_"+ (new Date().getMonth() + 1).toString().padStart(2,'0') +"_"+ new Date().getFullYear());
        let wopts = { bookType:'xlsx',bookSST:false,type:'array'};
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "export_"+this.state.entretiensRaw.length+"v_"+new Date().getDate().toString().padStart(2,'0')+"_"+new Date().getMonth().toString().padStart(2,'0')+"_"+new Date().getFullYear().toString().padStart(4,'0')+".xlsx");
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
    //===ENTRETIENS FILTERS===
    setStatusFilter = value => {
        this.setState({
            statusFilter:value
        })
        this.loadEntretiens();
    }
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
        this.loadEntretiens();
    }
    setOriginFilter = value => {
        this.setState({
            originFilter:value
        })
        this.loadEntretiens();
    }
    resetAll = () => {
        let filterNewValues = {};
        this.state.filters.forEach(f=>{
            filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
        })
        this.setState(filterNewValues);
        this.loadEntretiens();
    }

    /*DB READ AND WRITE*/
    loadEntretiens = () => {
        this.props.client.query({
            query:this.state.entretiensFullQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let entretiens = data.entretiensFull;
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
            if(this.state.statusFilter != "all"){
                if(this.state.statusFilter == "waiting"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{return e.status == 0})  
                }
                if(this.state.statusFilter == "open"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{return e.status < 3})
                }
                if(this.state.statusFilter == "affected"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{return e.status == 1})
                }
                if(this.state.statusFilter == "done"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{return e.status == 2})
                }
                if(this.state.statusFilter == "closed"){
                    entretiensFiltered = entretiensFiltered.filter(e =>{return e.status == 3})
                }
            }
            entretiensFiltered = entretiensFiltered.filter(e =>{
                if(this.state.docsFilter == "all"){
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
                if(this.state.originFilter == "all"){
                    return true
                }else{
                    if(this.state.originFilter == "mandatory"){
                        return e.type == "obli"
                    }
                    if(this.state.originFilter == "mandatoryAndPreventive"){
                        return e.type == "obli" || e.type == "prev"
                    }
                    if(this.state.originFilter == "preventive"){
                        return e.type == "prev"
                    }
                    if(this.state.originFilter == "curative"){
                        return e.type == "cura"
                    }
                }}
            )
            entretiensFiltered.sort((a, b) => a.vehicle.registration.localeCompare(b.vehicle.registration))
        }
        this.setState({
            entretiensFiltered:entretiensFiltered
        })
    }
    loadExportTemplates = () => {
        this.props.client.query({
            query:this.state.exportTemplatesQuery,
            variables:{
                type:"entretien"
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
                type:"entretien",
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
                        <p style={{fontSize:"1.4rem"}}>Les entretiens exportés dans le fichier Excel répondront à ces critères :</p>
                        {this.state.filters.map(f=>{
                            return(
                                <Message
                                    key={this.state[f["infos"]].icon+"key"}
                                    color={this.state[f["infos"]].options.filter(o=>o.value == this.state[f["filter"]])[0].color}
                                >
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
                        <Button icon icon="angle double right" labelPosition="right" size="big" style={{justifySelf:"center",gridColumnStart:"2"}} disabled={this.state.entretiensFiltered.length == 0} onClick={()=>this.setStep("columns")} content="Structure du fichier"/>
                    </div>
                </div>
            )
        }
        if(this.state.step == "columns"){
            return(
                <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gridTemplateRows:"minmax(0,1fr) auto",gridGap:"24px",placeSelf:"stretch",gridColumnEnd:"span 3"}}>
                    <DragDropContext onDragEnd={this.handleDragEnd}>
                        {this.getAvailableTable()}
                        <Icon name="arrows alternate horizontal" size="huge" disabled style={{placeSelf:"center"}}/>
                        {this.getSelectedTable()}
                    </DragDropContext>
                    <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"grid",gridTemplateColumns:"auto 1fr auto",gridGap:"16px"}}>
                        <Button icon="angle double left" labelPosition="left" size="big" style={{justifySelf:"center",gridColumnStart:"1"}} disabled={this.state.entretiensFiltered.length == 0} onClick={()=>this.setStep("filters")} content="Retour aux filtres"/>
                        <Message icon style={{margin:"0"}}>
                            <Icon name='wrench'/>
                            <Message.Content>
                                <Message.Header>{this.state.entretiensFiltered.length} entretiens chargés et filtrés</Message.Header>
                                sur un total de {this.state.entretiensRaw.length} entretiens
                            </Message.Content>
                        </Message>
                        <Button labelPosition="right" icon icon="file excel outline" disabled={this.state.availableColumns.filter(c=>c.active).length == 0} color="blue" size="big" style={{justifySelf:"center",gridColumnStart:"3"}} onClick={this.exportEntretiens} content={"Exporter " + this.state.entretiensFiltered.length + " entretiens"}/>
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
        this.loadEntretiens();
        this.loadExportTemplates();
    }
    componentDidUpdate = () => {
        if(this.state.currentSocieteFilter != this.props.societeFilter){
            this.loadEntretiens();
        }
    }
    render() {
        return (
            <Fragment>
                <div style={{display:"grid",gridTemplateRows:'auto minmax(0,1fr)',gridTemplateColumns:"auto 1fr auto",gridGap:"32px",height:"100%"}}>
                    <ExportMenu active="entretiens"/>
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

export default wrappedInUserContext = withUserContext(withRouter(ExportEntretiens));
