import React, { Component, Fragment } from 'react'
import { Loader, Table, Button, Icon, Segment, Form, Message, Modal, Input, Dropdown, Menu, Label, Header, TextArea, Popup } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import BigIconButton from '../elements/BigIconButton';
import FAFree from '../elements/FAFree';
import FileManagementPanel from '../atoms/FileManagementPanel';
import ModalDatePicker from '../atoms/ModalDatePicker'
import { withRouter } from 'react-router-dom';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

class Entretien extends Component {
    
    state={
        editing:false,
        activePanel:"infos",
        filterAddPiece:"",
        entretienRaw:null,
        newPiece:"",
        newDesc:"",
        newPrice:"",
        newTitle:"",
        newTime:0,
        newPieces:[],
        piecesRaw:[],
        newAffectDate:"",
        openDatePicker:false,
        newStatus:0,
        newNote:"",
        openAddNote:false,
        openAddPiece:false,
        openDeleteNote:false,
        openDelete:false,
        openAffectToMe:false,
        openRelease:false,
        openArchive:false,
        openDisArchive:false,
        newPieceType:"",
        newFicheInter:null,
        _id:this.props.match.params._id,
        loadingEntretien:true,
        status:[{status:0,label:"Ouvert"},{status:1,label:"En cours"},{status:2,label:"Réalisé"},{status:3,label:"Fermé"}],
        entretienQuery : gql`
            query entretien($_id:String!){
                entretien(_id:$_id){
                    _id
                    vehicle{
                        _id
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
                        key
                        name
                    }
                    notes{
                        _id
                        text
                        date
                    }
                    time
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
                    status
                    archived
                    user{
                        _id
                    }
                }
            }
        `,
        deleteEntretienQuery : gql`
            mutation deleteEntretien($_id:String!){
                deleteEntretien(_id:$_id){
                    status
                    message
                }
            }
        `,
        archiveEntretienQuery : gql`
            mutation archiveEntretien($_id:String!,$archived:Boolean!){
                archiveEntretien(_id:$_id,archived:$archived){
                    status
                    message
                }
            }
        `,
        disArchiveEntretienQuery : gql`
            mutation disArchiveEntretien($_id:String!,$archived:Boolean!){
                disArchiveEntretien(_id:$_id,archived:$archived){
                    status
                    message
                }
            }
        `,
        addNoteQuery : gql`
            mutation addNote($_id:String!,$note:String!){
                addNote(_id:$_id,note:$note){
                    status
                    message
                }
            }
        `,
        deleteNoteQuery : gql`
            mutation deleteNote($entretien:String!,$_id:String!){
                deleteNote(entretien:$entretien,_id:$_id){
                    status
                    message
                }
            }
        `,
        editInfosQuery : gql`
            mutation editInfos($_id:String!,$time:Float!,$status:Int!){
                editInfos(_id:$_id,time:$time,status:$status){
                    status
                    message
                }
            }
        `,
        editPiecesQuery : gql`
            mutation editPieces($_id:String!,$pieces:String!){
                editPieces(_id:$_id,pieces:$pieces){
                    status
                    message
                }
            }
        `,
        addPieceToEntretienQuery : gql`
            mutation addPieceToEntretien($_id:String!,$piece:String!){
                addPieceToEntretien(_id:$_id,piece:$piece){
                    status
                    message
                }
            }
        `,
        uploadEntretienDocumentQuery : gql`
            mutation uploadEntretienDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadEntretienDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
        piecesAllQuery: gql`
            query piecesAll{
                piecesAll{
                    _id
                    type
                    brand
                    reference
                    prixHT
                    name
                }
            }
        `,
        types: [
            {key:"obli",label:"obligatoire",labelCap:"Obligatoire"},
            {key:"prev",label:"préventif",labelCap:"Préventif"},
            {key:"cura",label:"curatif",labelCap:"Curatif"}
        ],
        piecesTypes:[
            {name:'Pièces',add:'une pièce',key:"pie"},
            {name:'Pneumatiques',add:'un pneumatique',key:"pne"},
            {name:'Agents',add:'un agent',key:"age"},
            {name:'Outils',add:'une outil',key:"out"}
        ],
    }

    /*SHOW AND HIDE MODALS*/
    showAddPiece = () => {
        this.setState({
            openAddPiece: true
        })
    }
    closeAddPiece = () => {
        this.setState({
            openAddPiece: false
        })
    }
    showAddNote = () => {
        this.setState({
            activePanel:"notes",
            openAddNote:true
        })
    }
    closeAddNote = () => {
        this.setState({
            openAddNote:false
        })
    }
    showDeleteNote = _id => {
        this.setState({
            openDeleteNote:true,
            targetNote:_id
        })
    }
    closeDeleteNote = () => {
        this.setState({
            openDeleteNote:false
        })
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    showDelete = () => {
        this.setState({openDelete:true})
    }
    closeDelete = () => {
        this.setState({openDelete:false})
    }
    showArchive = () => {
        this.setState({openArchive:true})
    }
    closeArchive = () => {
        this.setState({openArchive:false})
    }
    showDisArchive = () => {
        this.setState({openDisArchive:true})
    }
    closeDisArchive = () => {
        this.setState({openDisArchive:false})
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
    }

    /*CHANGE HANDLERS*/
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    handleChangeStatus = (e, { value }) => this.setState({ newStatus:value })
    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
            })
        }
    }    
    handleChangePiece = piece => {
        this.setState({
            newPiece:piece._id,
            newPieceType:piece.type,
            newPieceName:piece.name
        })
    }
    handleEditDesc = (e,{value}) => {
        this.setState({
            newDesc:value
        });
        this.editDesc();
    }
    handleEditTitle = (e,{value}) => {
        this.setState({
            newTitle:value
        });
        this.editTitle();
    }
    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
            })
        }
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    loadEntretien = () => {
        this.props.client.query({
            query:this.state.entretienQuery,
            variables:{
                _id:this.state._id
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                entretienRaw:data.entretien,
                newTime:data.entretien.time,
                newStatus:data.entretien.status,
                loadingEntretien:false
            })
        })
    }
    loadAllPieces = () => {
        this.props.client.query({
            query:this.state.piecesAllQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                piecesRaw:data.piecesAll
            })
        })
    }
    saveEdit = () => {
        this.setState({editing:false})
        this.props.client.mutate({
            mutation:this.state.editInfosQuery,
            variables:{
                _id:this.state.entretienRaw._id,
                time:parseFloat(this.state.newTime),
                status:parseInt(this.state.newStatus)
            }
        }).then(({data})=>{
            data.editInfos.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocFicheInter = () => {
        this.props.client.mutate({
            mutation:this.state.uploadEntretienDocumentQuery,
            variables:{
                _id:this.state.entretienRaw._id,
                file:this.state.newFicheInter,
                type:"ficheInter",
                size:this.state.newFicheInter.size
            }
        }).then(({data})=>{
            data.uploadEntretienDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    addPiece = id => {
        this.closeAddPiece();
        this.props.client.mutate({
            mutation:this.state.addPieceToEntretienQuery,
            variables:{
                _id:this.state.entretienRaw._id,
                piece:id
            }
        }).then(({data})=>{
            data.addPieceToEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    archiveEntretien = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveEntretienQuery,
            variables:{
                _id:this.state._id,
                archived:true
            }
        }).then(({data})=>{
            data.archiveEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    addNote = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.addNoteQuery,
            variables:{
                _id:this.state._id,
                note:this.state.newNote
            }
        }).then(({data})=>{
            data.addNote.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeAddNote();
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteNote = _id => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.deleteNoteQuery,
            variables:{
                entretien:this.state._id,
                _id:this.state.targetNote
            }
        }).then(({data})=>{
            data.deleteNote.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeDeleteNote();
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    disArchiveEntretien = () => {
        this.closeDisArchive();
        this.props.client.mutate({
            mutation:this.state.disArchiveEntretienQuery,
            variables:{
                _id:this.state._id,
                archived:false
            }
        }).then(({data})=>{
            data.disArchiveEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteEntretien = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteEntretienQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteEntretien.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/entretien/entretiens");
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    editPieces = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editPiecesQuery,
            variables:{
                _id:this.state._id,
                pieces:JSON.stringify(this.state.newPieces)
            }
        }).then(({data})=>{
            data.editPieces.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadEntretien();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    },1000);
    triggerEditPieces = (id,qty) => {
        let pieces = this.state.entretienRaw.piecesQty
        pieces.filter(p=>p.piece._id == id)[0].qty = qty
        this.setState({
          newPieces:pieces.filter(p=>p.qty != 0).map(p=>({piece:p.piece._id,qty:p.qty}))
        })
        this.editPieces();
    }

    /*CONTENT GETTERS*/
    getStatusLabel = () => {
        return this.state.status.filter(s=>s.status == this.state.entretienRaw.status)[0].label
    }
    getInfosPanel = () => {
        if(this.state.editing){
            return (
                <Segment style={{margin:"0",gridRowEnd:"span 2",padding:"auto",placeSelf:"stretch",display:"grid",gridTemplateRows:"auto auto 1fr auto"}}>
                    <Form>
                        <Form.Field><label>Temps passé (en heures)</label>
                            <Input defaultValue={this.state.entretienRaw.time} name="newTime" onChange={this.handleChange}/>
                        </Form.Field>
                        <Form.Field><label>Status de l'entretien</label>
                            <Dropdown defaultValue={this.state.entretienRaw.status} onChange={this.handleChangeStatus} fluid selection options={this.state.status.map(s=>{return{key:s.status,text:s.label,value:s.status}})}/>
                        </Form.Field>
                    </Form>
                    <div style={{display:"flex",justifyContent:"center",placeSelf:"center",gridRowStart:"4"}}>
                        <Button size="huge" color="red" icon labelPosition="left" onClick={()=>this.setState({editing:false})}>Annuler<Icon name='cancel' /></Button>
                        <Button size="huge" color="green" icon labelPosition="left" onClick={this.saveEdit}>Valider<Icon name='check' /></Button>
                    </div>
                </Segment>
            )
        }else{
            return (
                <Segment style={{margin:"0",gridRowEnd:"span 2",padding:"auto",placeSelf:"stretch"}}>
                    <div className="formBoard displaying">
                        <div className="labelBoard">Temps sur l'entretien :</div><div className="valueBoard">{this.state.entretienRaw.time + " heures"}</div>
                        <div className="labelBoard">Status de l'entretien :</div><div className="valueBoard">{this.getStatusLabel()}</div>
                    </div>
                </Segment>
            )
        }
    }
    getPieceIcon = () => {
        if(this.state.newPieceType=="pie"){
            return "cogs"
        }
        if(this.state.newPieceType=="pne"){
            return "cog"
        }
        if(this.state.newPieceType=="age"){
            return "tint"
        }
        if(this.state.newPieceType=="out"){
            return "wrench"
        }
        return "cancel";
    }
    getPieceTypeName = () => {
        if(this.state.newPieceType=="pie"){
            return "Piece"
        }
        if(this.state.newPieceType=="pne"){
            return "Pneumatique"
        }
        if(this.state.newPieceType=="age"){
            return "Agent"
        }
        if(this.state.newPieceType=="out"){
            return "Outils"
        }
        return "Aucune pièce séléctionnée";
    }
    getContentColor = () => {
        if(this.state.newPieceType=="pie"){
            return "teal"
        }
        if(this.state.newPieceType=="pne"){
            return "blue"
        }
        if(this.state.newPieceType=="age"){
            return "violet"
        }
        if(this.state.newPieceType=="out"){
            return "purple"
        }
    }
    getArchiveButton = () => {
        if(this.state.entretienRaw.archived){
            return (
                <BigIconButton icon="folder open outline" color="green" onClick={this.showDisArchive} tooltip="Ré-ouvrir l'entretien"/>
            )
        }else{
            return (
                <BigIconButton icon="archive" color="orange" onClick={this.showArchive} tooltip="Archiver l'entretien"/>
            )
        }
    }
    getOverviewMessage = () => {
        let header = "";
        let content = "";
        if(this.state.entretienRaw.originNature != null){
            header = this.state.entretienRaw.originNature.name
            content = "Entretien " + this.getTypeLabel()
        }else{
            header = this.state.entretienRaw.originControl.name
            content = "Contrôle " + this.getTypeLabel()
        }
        return (
            <Message style={{margin:"0",gridRowStart:"1",gridColumnStart:"3"}} icon='clipboard check' header={header} content={content}/>
        );
    }
    getTypeLabel = () => {
        return this.state.types.filter(x=>x.key == this.state.entretienRaw.type)[0].labelCap;
    }
    getDeleteButton = () => {
        if(this.props.user.isOwner){
            return (
                <BigIconButton icon="trash" color="red" onClick={this.showDelete} tooltip="Supprimer l'entretien"/>
            )
        }
    }
    getPieces = () => {
        if(this.state.entretienRaw.piecesQty.length == 0){
            return(
                <Table.Body>
                    <Table.Row>
                        <Table.Cell colSpan="5">
                           Aucune pièce à commander
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
              )
            }else{
                let totalHT = 0;
                return(
                    <Table.Body>
                        {this.state.entretienRaw.piecesQty.map(p=>{
                            totalHT += parseFloat(p.piece.prixHT*p.qty)
                            return(
                                <Table.Row key={p.piece._id}>
                                    <Table.Cell><b>{p.piece.name}</b><br/>{p.piece.brand + " " + p.piece.reference}</Table.Cell>
                                    <Table.Cell textAlign="center">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(p.piece.prixHT))}</Table.Cell>
                                    <Table.Cell textAlign="center">{p.qty}</Table.Cell>
                                    <Table.Cell textAlign="center">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(p.piece.prixHT*p.qty))}</Table.Cell>
                                    <Table.Cell collapsing>
                                        <Button icon onClick={()=>{this.triggerEditPieces(p.piece._id,p.qty-1)}}><Icon name="minus"/></Button>
                                        <Button icon onClick={()=>{this.triggerEditPieces(p.piece._id,p.qty+1)}}><Icon name="plus"/></Button>
                                        <Button icon color="red" onClick={()=>this.triggerEditPieces(p.piece._id,0)}><Icon name="trash"/></Button>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })}
                        <Table.Row>
                            <Table.Cell colSpan="3" textAlign="right"><b>Total :</b></Table.Cell>
                            <Table.Cell textAlign="center"><b>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(totalHT))}</b></Table.Cell>
                            <Table.Cell></Table.Cell>
                        </Table.Row>
                    </Table.Body>
                )
            }
    }
    getNotesPanel = () =>{
        if(this.state.entretienRaw.notes.length == 0){
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    <Segment style={{display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr auto",cursor:"pointer"}}>
                        <Header style={{margin:"48px",placeSelf:"center"}} as='h2'>Il n'y a aucune notes concernant cet entretien pour l'instant</Header>
                        <Button size="huge" onClick={this.showAddNote}>Ajouter la première note</Button>
                    </Segment>
                </div>
            )
        }else{
            return (
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    {this.state.entretienRaw.notes.map((n,i)=>{
                        return (
                            <Segment key={n._id} style={{display:"grid",gridTemplateColumns:"auto 1fr auto",marginBottom:"12px",marginTop:"0",padding:"8px 16px",gridTemplateRows:"auto auto",cursor:"pointer"}}>
                                <FAFree code="far fa-comment" style={{gridRowEnd:"span 2",gridColumnStart:"1",placeSelf:"center",marginRight:"16px",fontSize:"2em"}}/>
                                <Header style={{margin:"0",placeSelf:"center start"}} as='a'>{n.text}</Header>
                                <div style={{gridRowStart:"2",gridColumnStart:"2"}}>
                                    <p>{n.date}</p>
                                </div>
                                {((this.props.user.isOwner && i != 0 ? <Popup trigger={<Button style={{gridRowEnd:"span 2",placeSelf:"center"}} color="red" icon onClick={()=>this.showDeleteNote(n._id)} icon="trash" />}>Supprimer</Popup> : ""))}
                            </Segment>
                        )
                    })}
                </div>
            )
        }
    }
    getPiecesPanel = () => {
        return (
            <div style={{display:"grid",gridGap:"16px",gridTemplateColumns:"1fr"}}>
                <div>
                    <Table celled>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign="center">Pièces</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Prix H.T.</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Quantité</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Total H.T.</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        {this.getPieces()}
                    </Table>
                </div>
            </div>
        )
    }
    getDocsPanel = () => {
        return (
            <div attached="right" style={{padding:"auto",justifySelf:"stretch",display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto 1fr",gridGap:"24px"}}>
                <FileManagementPanel importLocked={this.state.newFicheInter == null} handleInputFile={this.handleInputFile} fileTarget="newFicheInter" uploadDoc={this.uploadDocFicheInter} fileInfos={this.state.entretienRaw.ficheInter} title="Fiche d'intervention" type="ficheInter"/>
            </div>
        )
    }
    getActivePanel = () => {
        if(this.state.activePanel == "infos"){
            return this.getInfosPanel()
        }
        if(this.state.activePanel == "notes"){
            return this.getNotesPanel()
        }
        if(this.state.activePanel == "pieces"){
            return this.getPiecesPanel()
        }
        if(this.state.activePanel == "docs"){
            return this.getDocsPanel()
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadAllPieces();
        this.loadEntretien();
    }

    render() {
        if(this.state.loadingEntretien){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loadingEntretien)} >Chargement de l'entretien</Loader>
                </div>
            )
        }else{
            return (
                <Fragment>
                    <div style={{display:"grid",height:"100%",gridGap:"32px",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"auto 1fr",gridTemplateRows:"auto 1fr"}}>
                        <div style={{display:"grid",gridGap:"32px",gridTemplateColumns:"auto auto 1fr auto",gridColumnEnd:"span 2"}}>
                            <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/entretien/entretiens");}} tooltip="Retour au tableau des entretiens"/>
                            <Message style={{margin:"0",gridRowStart:"1",gridColumnStart:"2",cursor:"pointer"}} onClick={()=>{this.props.history.push("/parc/vehicle/"+this.state.entretienRaw.vehicle._id)}} icon>
                                <Icon name="truck"/>
                                <Message.Content>
                                    <Message.Header style={{color:"#2185d0"}}>{this.state.entretienRaw.vehicle.registration}</Message.Header>
                                    {this.state.entretienRaw.vehicle.brand.name + " - " + this.state.entretienRaw.vehicle.model.name}
                                </Message.Content>
                            </Message>
                            {this.getOverviewMessage()}
                            <div style={{display:"flex"}}>
                                <BigIconButton icon="edit" color="blue" onClick={()=>{this.setState({editing:true,activePanel:"infos"})}} tooltip="Editer les infos de l'entretien"/>
                                <BigIconButton icon="cart" color="blue" onClick={this.showAddPiece} tooltip="Ajouter une piece"/>
                                <BigIconButton icon="chat" color="blue" onClick={this.showAddNote} tooltip="Ajouter une note" spacedFromNext/>
                                <BigIconButton icon="folder open" color="purple" onClick={()=>this.setState({activePanel:"docs"})} tooltip="Documents"/>
                                {this.getArchiveButton()}
                                {this.getDeleteButton()}
                            </div>
                        </div>
                        <div style={{placeSelf:"stretch",gridColumnEnd:"span 2",display:"grid",gridRowStart:"2",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto 1fr",gridGap:"64px"}}>
                            <div style={{display:"flex",flexDirection:"column",justifyContent:"start",placeSelf:"stretch"}}>
                                <Menu size='big' pointing vertical style={{gridColumnStart:"1"}}>
                                    <Menu.Item color="blue" name='Informations' active={this.state.activePanel == 'infos'} onClick={()=>{this.setState({activePanel:"infos"})}} />
                                    <Menu.Item color="blue" active={this.state.activePanel == 'pieces'} onClick={()=>{this.setState({activePanel:"pieces"})}}><Label color='grey'>{this.state.entretienRaw.piecesQty.length}</Label>Pièces</Menu.Item>
                                    <Menu.Item color="blue" active={this.state.activePanel == 'notes'} onClick={()=>{this.setState({activePanel:"notes"})}}><Label color='grey'>{this.state.entretienRaw.notes.length}</Label>Notes</Menu.Item>
                                    <Menu.Item color="purple" name='Documents' active={this.state.activePanel == 'docs'} onClick={()=>{this.setState({activePanel:"docs"})}} />
                                </Menu>
                            </div>
                            {this.getActivePanel()}
                        </div>
                    </div>
                    <Modal closeOnDimmerClick={false} open={this.state.openAddPiece} onClose={this.closeAddPiece} closeIcon>
                        <Modal.Header>
                            <Input size='big' placeholder="Filtrer les pièces à commander ..." fluid icon="search" iconPosition="left" name="filterAddPiece" onChange={this.handleChange}/>
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Modal.Description>
                                <Table striped celled compact="very">
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Type</Table.HeaderCell>
                                            <Table.HeaderCell>Nom</Table.HeaderCell>
                                            <Table.HeaderCell>Actions</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.state.piecesRaw.filter(p=>{
                                            if(this.state.entretienRaw.piecesQty.map(x=>(x.piece._id)).includes(p._id)){
                                                return false;
                                            }
                                            if(this.state.filterAddPiece.length > 0){
                                                return (p.name.toLowerCase().includes(this.state.filterAddPiece.toLowerCase()))
                                            }else{
                                                return true
                                            }
                                        }).map(p=>{
                                            return(
                                                <Table.Row key={p._id}>
                                                    <Table.Cell collapsing>{this.state.piecesTypes.filter(t=>t.key == p.type)[0].name}</Table.Cell>
                                                    <Table.Cell>{p.name}</Table.Cell>
                                                    <Table.Cell collapsing>
                                                    <Button onClick={()=>{this.addPiece(p._id)}} icon>
                                                        <Icon name="shopping cart"/>
                                                    </Button>
                                                    </Table.Cell>
                                                </Table.Row>
                                            )
                                        })}
                                    </Table.Body>
                                </Table>
                            </Modal.Description>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="blue" onClick={this.closeAddPiece}>Créer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openAddNote} onClose={this.closeAddNote} closeIcon>
                        <Modal.Header>
                            Ajouter une note à l'entretien ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Note :</label>
                                    <TextArea rows={5} onChange={this.handleChange} name="newNote"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeAddNote}>Annuler</Button>
                            <Button color="blue" onClick={this.addNote}>Ajouter la note</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDeleteNote} onClose={this.closeDeleteNote} closeIcon>
                        <Modal.Header>
                            Supprimer cette note ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDeleteNote}>Annuler</Button>
                            <Button color="red" onClick={this.deleteNote}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer l'entretien du vehicule : {this.state.entretienRaw.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteEntretien}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                        <Modal.Header>
                            Archiver l'entretien du vehicule : {this.state.entretienRaw.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeArchive}>Annuler</Button>
                            <Button color="orange" onClick={this.archiveEntretien}>Archiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDisArchive} onClose={this.closeDisArchive} closeIcon>
                        <Modal.Header>
                            Sortir l'entretien du vehicule : {this.state.entretienRaw.vehicle.registration} des archives ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDisArchive}>Annuler</Button>
                            <Button color="green" onClick={this.disArchiveEntretien}>Réactiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
                </Fragment>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withRouter(withUserContext(Entretien));