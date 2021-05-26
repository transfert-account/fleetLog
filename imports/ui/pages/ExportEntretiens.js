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

export class ExportEntretiens extends Component {

    state = {
        step:"filters",
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
                        shared
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
        exportTemplatesRaw:[],
        openLoadExportTemplate:false,
        openSaveExportTemplate:false,
        newTemplateName:"",

        //===ENTRETIENS FILTERS===
        archiveFilterE:false,
        docsFilterE:"all",
        orderStatusFilterE:"all",
        fromControlFilterE:"all",
        filtersE:[
            {
                infos:"ordersFilterInfosE",
                filter:"orderStatusFilterE"
            },{
                infos:"fromControlFilterInfosE",
                filter:"fromControlFilterE"
            },{
                infos:"docsFilterInfosE",
                filter:"docsFilterE"
            },{
                infos:"archiveFilterInfosE",
                filter:"archiveFilterE"
            }
        ],
        ordersFilterInfosE:{
            icon:"shipping fast",            
            options:[
                {
                    key: 'orderall',
                    initial: true,
                    text: 'Tous les entretiens',
                    value: "all",
                    color:"",
                    click:()=>{this.setOrderStatusFilterE("all")},
                    label: { color: '', empty: true, circular: true },
                },
                {
                    key: 'orderready',
                    initial: false,
                    text: 'Entretiens prêts',
                    value: "ready",
                    color:"green",
                    click:()=>{this.setOrderStatusFilterE("ready")},
                    label: { color: 'green', empty: true, circular: true }
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
                    color:"",
                    click:()=>{this.setDocsFilterE("all")},
                    label: { color: '', empty: true, circular: true },
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
                    color:"",
                    click:()=>{this.setFromControlFilterE("all")},
                    label: { color: '', empty: true, circular: true },
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
        availableColumns:[
            {key:"soc",active:false,colOrder:-1,label:"Propriétaire",access:(e)=>e.societe.name},
            {key:"ope",active:false,colOrder:-1,label:"Opérationnel à",access:(e)=>{
                if(e.vehicle.shared){
                    return(e.vehicle.sharedTo.name)
                }else{
                    return(e.vehicle.societe.name)
                }
            }},
            {key:"reg",active:false,colOrder:-1,label:"Immatriculation",access:(e)=>e.vehicle.registration},
            {key:"brd",active:false,colOrder:-1,label:"Marque du véhicule",access:(e)=>e.vehicle.brand.name},
            {key:"mod",active:false,colOrder:-1,label:"Modèle du véhicule",access:(e)=>e.vehicle.model.name},
            {key:"kms",active:false,colOrder:-1,label:"Kilométrage",access:(e)=>e.vehicle.km},
            {key:"typ",active:false,colOrder:-1,label:"Type",access:(e)=>(e.fromControl ? "PRÉVENTIF" : "CURATIF")},
            {key:"ctr",active:false,colOrder:-1,label:"Nom du contrôle",access:(e)=>(e.fromControl ? e.control.equipementDescription.name : "-")},
            {key:"ttl",active:false,colOrder:-1,label:"Titre",access:(e)=>e.title},
            {key:"arc",active:false,colOrder:-1,label:"Archivé",access:(e)=>e.archived}
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
            this.state.availableColumns.filter(c=>c.active).sort((a,b)=>a.colOrder-b.colOrder).map(c=>{
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
        let columns = this.state.availableColumns.filter(x=>x.active).sort((a,b)=> a.colOrder - b.colOrder).map(c=>{return({colOrder:c.colOrder,key:c.key})});
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
                    <CustomFilterSegment resetAll={this.resetAllE} style={{placeSelf:"stretch",gridRowStart:"1"}}>
                        {this.state.filtersE.map(f=>{
                            return(
                                <CustomFilter key={f.infos} infos={this.state[f.infos]} active={this.state[f.filter]}/>
                            )
                        })}
                    </CustomFilterSegment>
                    <div>
                        <p style={{fontSize:"1.4rem"}}>Les entretiens exportés dans le fichier Excel répondront à ces critères :</p>
                        {this.state.filtersE.map(f=>{
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
                    {this.getAvailableTable()}
                    <Icon name="arrows alternate horizontal" size="huge" disabled style={{marginTop:"64px"}}/>
                    {this.getSelectedTable()}
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
