import React, { Component, Fragment } from 'react';
import { Message, Modal, Button, Loader, TextArea, Segment, Icon, Menu, Header, Form, Checkbox, Input, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

import MultiDropdown from '../atoms/MultiDropdown';
import ModalDatePicker from '../atoms/ModalDatePicker';
import FileManagementPanel from '../atoms/FileManagementPanel';

import AccidentTabularCirconstances from '../molecules/AccidentTabularCirconstances';

import BigIconButton from '../elements/BigIconButton';

export class Accident extends Component {

    state={
        _id:this.props.match.params._id,
        activePanel:"declaration",
        accident:null,
        loading:true,
        details:false,
        openDocs:false,
        openArchive:false,
        openUnArchive:false,
        newDesc:"",
        //PARTIE PRISE EN CHARGE
        newResponsabilite:"",
        newReglementAssureur:"",
        newChargeSinistre:"",
        newMontantInterne:"",
        newStatus:"",
        //PARTIE DECLARATION
        datePickerTarget:"",
        newVehicle:""._id,
        newOccurenceDate:"",
        newDriver:"",
        newConstatSent:"",
        newDateExpert:"",
        newDateTravaux:"",
        newConstat:null,
        newRapportExp:null,
        newFacture:null,
        openDatePicker:false,
        //QUERIES
        editAccidentQuery : gql`
            mutation editAccident($_id:String!,$occurenceDate:String!,$driver:String!,$dateExpert:String!,$dateTravaux:String!,$constatSent:String!){
                editAccident(_id:$_id,occurenceDate:$occurenceDate,driver:$driver,dateExpert:$dateExpert,dateTravaux:$dateTravaux,constatSent:$constatSent){
                    status
                    message
                }
            }
        `,
        editDescAccidentQuery : gql`
            mutation editDescAccident($_id:String!,$description:String!){
                editDescAccident(_id:$_id,description:$description){
                    status
                    message
                }
            }
        `,
        deleteAccidentQuery : gql`
            mutation deleteAccident($_id:String!){
                deleteAccident(_id:$_id){
                    status
                    message
                }
            }
        `,
        uploadAccidentDocumentQuery : gql`
            mutation uploadAccidentDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadAccidentDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
        archiveAccidentQuery : gql`
            mutation archiveAccident($_id: String!) {
                archiveAccident(_id:$_id) {
                    status
                    message
                }
            }
        `,
        unArchiveAccidentQuery : gql`
            mutation unArchiveAccident($_id: String!) {
                unArchiveAccident(_id:$_id) {
                    status
                    message
                }
            }
        `,
        accidentQuery : gql`
            query accident($_id: String!){
                accident(_id:$_id){
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    vehicle{
                        _id
                        registration
                        model{
                            _id
                            name
                        }
                        brand{
                            _id
                            name
                        }
                        energy{
                            _id
                            name
                        }
                    }
                    occurenceDate
                    driver
                    description
                    dateExpert
                    dateTravaux
                    constatSent
                    archived
                    answers{
                        page
                        fields{
                            index
                            status
                            answer
                        }
                    }
                    constat{
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
                    rapportExp{
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
                    facture{
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
                    questionary{
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
                    responsabilite
                    reglementAssureur
                    chargeSinistre
                    montantInterne
                    status
                }
            }
        `,
        editPECAccidentQuery : gql`
            mutation editPECAccident($_id:String!,$responsabilite:Int!,$reglementAssureur:Float!,$chargeSinistre:Float!,$montantInterne:Float!,$status:Boolean!){
                editPECAccident(_id:$_id,responsabilite:$responsabilite,reglementAssureur:$reglementAssureur,chargeSinistre:$chargeSinistre,montantInterne:$montantInterne,status:$status){
                    status
                    message
                }
            }
        `
    }
    
    /*SHOW AND HIDE MODALS*/
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
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
    showUnArchive = () => {
        this.setState({openUnArchive:true})
    }
    closeUnArchive = () => {
        this.setState({openUnArchive:false})
    }
    closeDetails = () => {
        this.setState({details:false})
    }
    showDetails = () => {
        this.setState({details:true})
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false,newConstat:null,newRapportExp:null})
    }
    /*CHANGE HANDLERS*/
    handleItemClick = (item) =>{
        this.loadAccident();
        this.setState({ activePanel: item })
    }
    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
            })
        }
    }
    handleEditDesc = (e,{value}) => {
        this.setState({
            newDesc:value
        });
        this.editDesc();
    }
    handleChange = e =>{
        this.setState({
          [e.target.name]:e.target.value
        });
    }
    handleConstatSentChange = value => {
        this.setState({
            newConstatSent:value
        });
    }
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleStatusChange = checked => {
        this.setState({
            newStatus:checked
        });
    }
    setResponsabilite = v => {
      this.setState({newResponsabilite:v})
    }

    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    loadAccident = () => {
        this.props.client.query({
            query:this.state.accidentQuery,
            variables:{
                _id:this.props.match.params._id
            },
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                loading:false,
                accident:data.accident,
                newDesc:data.accident.description,
                newResponsabilite:data.accident.responsabilite,
                newReglementAssureur:data.accident.reglementAssureur,
                newChargeSinistre:data.accident.chargeSinistre,
                newMontantInterne:data.accident.montantInterne,
                newStatus:data.accident.status,
                //PARTIE DECLARATION
                datePickerTarget:"",
                newVehicle:data.accident.vehicle._id,
                newOccurenceDate:data.accident.occurenceDate,
                newDriver:data.accident.driver,
                newConstatSent:data.accident.constatSent,
                newDateExpert:data.accident.dateExpert,
                newDateTravaux:data.accident.dateTravaux,
            })
        })
    }
    editDesc = _.debounce(()=>{
        this.props.client.mutate({
            mutation:this.state.editDescAccidentQuery,
            variables:{
                _id:this.state.accident._id,
                description:this.state.newDesc
            }
        }).then(({data})=>{
            data.editDescAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccident();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    },1000);
    editAccident = () => {
        this.props.client.mutate({
            mutation:this.state.editAccidentQuery,
            variables:{
                _id:this.state.accident._id,
                occurenceDate:this.state.newOccurenceDate,
                driver:this.state.newDriver,
                dateExpert:this.state.newDateExpert,
                dateTravaux:this.state.newDateTravaux,
                constatSent:this.state.newConstatSent
            }
        }).then(({data})=>{
            data.editAccident.map(qrm=>{
                if(qrm.status){
                    this.setState({
                        editDeclaration:false,
                        editPEC:false
                    })
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccident();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    editPECAccident = () => {
        this.props.client.mutate({
            mutation:this.state.editPECAccidentQuery,
            variables:{
              _id:this.state.accident._id,
              responsabilite:parseInt(this.state.newResponsabilite),
              reglementAssureur:parseFloat(this.state.newReglementAssureur),
              chargeSinistre:parseFloat(this.state.newChargeSinistre),
              montantInterne:parseFloat(this.state.newMontantInterne),
              status:this.state.newStatus
            }
        }).then(({data})=>{
            data.editPECAccident.map(qrm=>{
                if(qrm.status){
                    this.setState({editPEC:false})
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccident();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    archiveAccident = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveAccidentQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.archiveAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/accidentologie");
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocConstat = () => {
        this.props.client.mutate({
            mutation:this.state.uploadAccidentDocumentQuery,
            variables:{
                _id:this.state.accident._id,
                file:this.state.newConstat,
                type:"constat",
                size:this.state.newConstat.size
            }
        }).then(({data})=>{
            data.uploadAccidentDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccident();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocRapportExp = () => {
        this.props.client.mutate({
            mutation:this.state.uploadAccidentDocumentQuery,
            variables:{
                _id:this.state.accident._id,
                file:this.state.newRapportExp,
                type:"rapportExp",
                size:this.state.newRapportExp.size
            }
        }).then(({data})=>{
            data.uploadAccidentDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccident();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocFacture = () => {
        this.props.client.mutate({
            mutation:this.state.uploadAccidentDocumentQuery,
            variables:{
                _id:this.state.accident._id,
                file:this.state.newFacture,
                type:"facture",
                size:this.state.newFacture.size
            }
        }).then(({data})=>{
            data.uploadAccidentDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccident();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocQuestionary = () => {
        this.props.client.mutate({
            mutation:this.state.uploadAccidentDocumentQuery,
            variables:{
                _id:this.state.accident._id,
                file:this.state.newQuestionary,
                type:"questionary",
                size:this.state.newQuestionary.size
            }
        }).then(({data})=>{
            data.uploadAccidentDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAccident();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteAccident = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteAccidentQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/accidentologie");
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unArchiveAccident = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unArchiveAccidentQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.unArchiveAccident.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/accidentologie");
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    /*CONTENT GETTERS*/
    getActivePanel = () => {
        if(this.state.activePanel == "declaration"){
            return this.getDeclarationPanel();
        }
        if(this.state.activePanel == "priseencharge"){
            return this.getPECPanel();
        }
        if(this.state.activePanel == "questions"){
            return(
                <AccidentTabularCirconstances loading={this.state.loading} accident={this.state.accident} answers={this.state.accident.answers}/>
            )
        }
        if(this.state.activePanel == "notes"){
            return this.getNotesPanel();
        }
        if(this.state.activePanel == "documents"){
            return this.getDocumentsPanel();
        }
    }
    //PANELS
    getPECPanel = () => {
        if(this.state.editPEC){
            return (
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment>
                        <Header as="h3">Prise en charge</Header>
                    </Segment>
                    <Segment style={{placeSelf:"stretch",margin:"0"}}>
                        <Form className="formBoard editing" style={{gridTemplateRows:"auto auto auto 1fr auto",height:"100%"}}>
                            <Form.Field>
                                <label>Responsabilité</label>
                                <Button.Group>
                                <Button color="orange" basic={this.state.newResponsabilite != 100} onClick={()=>{this.setResponsabilite(100)}}>100%</Button>
                                <Button.Or/>
                                <Button color="yellow" basic={this.state.newResponsabilite != 50} onClick={()=>{this.setResponsabilite(50)}}>50%</Button>
                                <Button.Or/>
                                <Button color="green" basic={this.state.newResponsabilite != 0} onClick={()=>{this.setResponsabilite(0)}}>0%</Button>
                                <Button.Or/>
                                <Button color="grey" basic={this.state.newResponsabilite != -1} onClick={()=>{this.setResponsabilite(-1)}}>n/a</Button>
                                </Button.Group>
                            </Form.Field>
                            <Form.Field>
                                <label>Charge sinistre</label>
                                <Input defaultValue={this.state.newChargeSinistre} onChange={this.handleChange} name="newChargeSinistre"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Montant du réglement assureur</label>
                                <Input disabled={this.state.accident.constatSent == "internal"} defaultValue={this.state.newReglementAssureur} onChange={this.handleChange} name="newReglementAssureur"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Montant interne</label>
                                <Input disabled={this.state.accident.constatSent == "yes" || this.state.accident.constatSent == "no"} defaultValue={this.state.newMontantInterne} onChange={this.handleChange} name="newMontantInterne"/>
                            </Form.Field>
                            <Form.Field style={{gridColumnEnd:"span 2",placeSelf:"center"}}>
                                <label>Statut</label>
                                <Checkbox defaultChecked={this.state.newStatus} onChange={(e,{checked})=>{this.handleStatusChange(checked)}} toggle />
                            </Form.Field>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={()=>this.setState({editPEC:false})}>Annuler<Icon name='cancel'/></Button>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.editPECAccident}>Sauvegarder<Icon name='check'/></Button>
                        </Form>
                    </Segment>
                </Segment.Group>
            )
        }else{
            return(
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment>
                        <Header as="h3">Prise en charge</Header>
                    </Segment>
                    <Segment style={{placeSelf:"stretch",margin:"0"}}>
                        <div className="formBoard displaying" style={{gridTemplateRows:"auto auto auto auto auto auto auto 1fr",height:"100%"}}>
                            <div className="labelBoard">Responsabilité :</div><div className="valueBoard">{this.getPECLabel()}</div>
                            <div className="labelBoard">Charge Sinistre :</div><div className="valueBoard">{this.getNullableLabel(this.state.accident.chargeSinistre)}</div>
                            <div className="labelBoard">Reglement Assureur :</div><div className="valueBoard">{this.getReglementAssureur()}</div>
                            <div className="labelBoard">Montant Interne :</div><div className="valueBoard">{this.getMontantInterne()}</div>
                            <div className="labelBoard">Status :</div><div className="valueBoard">{this.getStatusLabel()}</div>
                        </div>
                    </Segment>
                </Segment.Group>  
            )
        }
    }
    getDeclarationPanel = () => {
        if(this.state.editDeclaration){
            return (
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment>
                        <Header as="h3">Déclaration</Header>
                    </Segment>
                    <Segment style={{placeSelf:"stretch"}}>
                        <Form className="formBoard editing" style={{gridTemplateRows:"auto auto 1fr auto",height:"100%"}}>
                            <Form.Field>
                                <label>Date de l'accident</label>
                                <Input value={this.state.newOccurenceDate} onFocus={()=>{this.showDatePicker("newOccurenceDate")}} name="newOccurenceDate"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Conducteur du véhicule</label>
                                <Input value={this.state.newDriver} onChange={this.handleChange} name="newDriver"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Date du passage de l'expert</label>
                                <Input value={this.state.newDateExpert} onFocus={()=>{this.showDatePicker("newDateExpert")}} name="newDateExpert"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Date des travaux</label>
                                <Input value={this.state.newDateTravaux} onFocus={()=>{this.showDatePicker("newDateTravaux")}} name="newDateTravaux"/>
                            </Form.Field>
                            <Form.Field>
                                <label>Constat envoyé à l'assurance</label>
                                <MultiDropdown defaultValue={this.state.newConstatSent} onChange={this.handleConstatSentChange}
                                    options={[
                                        { key: 'Oui', text: 'Oui', value: "yes", label: { color: 'green', empty: true, circular: true }},
                                        { key: "Non déclaré à l'assureur", text: "Non déclaré à l'assureur", value: "internal", label: { color: 'black', empty: true, circular: true }},
                                        { key: 'Non', text: 'Non', value: "no", label: { color: 'red', empty: true, circular: true }}
                                    ]}
                                />
                            </Form.Field>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={()=>this.setState({editDeclaration:false})}>Annuler<Icon name='cancel'/></Button>
                            <Button style={{placeSelf:"center stretch",gridRowStart:"5",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.editAccident}>Sauvegarder<Icon name='check'/></Button>
                        </Form>
                    </Segment>
                </Segment.Group>
            )
        }else{
            return(
                <Segment.Group style={{margin:"0",display:"grid",gridTemplateRows:"auto 1fr"}}>
                    <Segment>
                        <Header as="h3">Déclaration</Header>
                    </Segment>
                    <Segment style={{placeSelf:"stretch",margin:"0"}}>
                        <div className="formBoard displaying" style={{gridTemplateRows:"auto auto auto auto auto auto auto 1fr",height:"100%"}}>
                            <div className="labelBoard">Propriétaire du véhicule :</div><div className="valueBoard">{this.state.accident.societe.name}</div>
                            <div className="labelBoard">Date de l'accident :</div><div className="valueBoard">{this.state.accident.occurenceDate}</div>
                            <div className="labelBoard">Conducteur :</div><div className="valueBoard">{this.state.accident.driver}</div>
                            <div className="labelBoard">Date de passage de l'expert :</div><div className="valueBoard">{this.state.accident.dateExpert}</div>
                            <div className="labelBoard">Date des travaux :</div><div className="valueBoard">{this.state.accident.dateTravaux}</div>
                            <div className="labelBoard">Constat envoyé à l'assurance :</div><div className="valueBoard">{this.getConstatSentLabel()}</div>
                            <div className="labelBoard">Coût total de l'accident :</div><div className="valueBoard">{this.getTotalCost()}</div>
                        </div>
                    </Segment>
                </Segment.Group>
            )
        }
    }
    getDocumentsPanel = () => {
        return (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"24px"}}>
                <FileManagementPanel importLocked={this.state.newConstat == null} handleInputFile={this.handleInputFile} fileTarget="newConstat" uploadDoc={this.uploadDocConstat} downloadDoc={this.downloadDocConstat} fileInfos={this.state.accident.constat} title="Constat" type="constat"/>
                <FileManagementPanel importLocked={this.state.newRapportExp == null} handleInputFile={this.handleInputFile} fileTarget="newRapportExp" uploadDoc={this.uploadDocRapportExp} downloadDoc={this.downloadDocRapportExp} fileInfos={this.state.accident.rapportExp} title="Rapport de l'expert" type="rapportExp"/>
                <FileManagementPanel importLocked={this.state.newFacture == null} handleInputFile={this.handleInputFile} fileTarget="newFacture" uploadDoc={this.uploadDocFacture} downloadDoc={this.downloadDocFacture} fileInfos={this.state.accident.facture} title="Facture" type="facture"/>
                <FileManagementPanel importLocked={this.state.newQuestionary == null} handleInputFile={this.handleInputFile} fileTarget="newQuestionary" uploadDoc={this.uploadDocQuestionary} downloadDoc={this.downloadDocQuestionary} fileInfos={this.state.accident.questionary} title="Questionnaire" type="questionary"/>
            </div>
        )
    }
    getNotesPanel = () => {
        return(
            <Segment.Group>
                <Segment>
                    <Header as="h3">Note concernant l'accident</Header>
                </Segment>
                <Segment style={{display:"grid",gridTemplateRows:"1fr"}}>
                    <TextArea rows="5" className="textarea" name="newDesc" style={{border:"2px solid #d9d9d9",margin:"8px",placeSelf:"stretch"}} defaultValue={this.state.newDesc} onChange={this.handleEditDesc}/>
                </Segment>
            </Segment.Group>
        )
    }
    //OTHERS
    getArchiveButton = () => {
        if(this.state.accident.archived){
            return <BigIconButton icon="check" color="green" onClick={this.showUnArchive} tooltip="Désarchiver"/>
        }else{
            return <BigIconButton icon="archive" color="orange" onClick={this.showArchive} tooltip="Archiver"/>
        }
    }
    getDeleteButton = () => {
        if(this.props.user.isOwner){
            return <BigIconButton icon="trash" color="red" onClick={this.showDelete} tooltip="Supprimer l'accident"/>
        }
    }
    getTotalCost = () => {
        if(this.state.accident.constatSent == "internal"){
            return this.getNullableLabel(this.getNullableValue(this.state.accident.chargeSinistre) + this.getNullableValue(this.state.accident.montantInterne))
        }else{
            return this.getNullableLabel(this.getNullableValue(this.state.accident.chargeSinistre) + this.getNullableValue(this.state.accident.reglementAssureur))
        }
    }
    getReglementAssureur = () => {
        if(this.state.accident.constatSent == "internal"){
            return this.getNullableLabel(-1)
        }else{
            return this.getNullableLabel(this.state.accident.reglementAssureur)
        }
    }
    getMontantInterne = () => {
        if(this.state.accident.constatSent != "internal"){
            return this.getNullableLabel(-1)
        }else{
            return this.getNullableLabel(this.state.accident.montantInterne)
        }
    }    
    
    getConstatSentLabel = () => {
        if(this.state.accident.constatSent == "yes"){
            return <Label color="green">Oui</Label>
        }else{
            if(this.state.accident.constatSent == "internal"){
                return <Label color="grey">Non déclaré</Label>
            }else{
                return <Label color="red">Non</Label>
            }
        }
    }
    getNullableValue = v => {
        if(v < 0){
            return 0
        }else{
            return v
        }
    }
    getNullableLabel = v => {
        if(v < 0){
            return "n/a"
        }else{
            return v + " €"
        }
    }
    
    getStatusLabel = () => {
        if(this.state.accident.status){
            return <Label color="orange">Ouvert</Label>
        }else{
            return <Label color="green">Clos</Label>
        }
    }
    getPECLabel = () => {
        if(this.state.accident.responsabilite == 100){
            return <Label color="orange">100 %</Label>
        }
        if(this.state.accident.responsabilite == 50){
            return <Label color="yellow">50 %</Label>
        }
        if(this.state.accident.responsabilite == 0){
            return <Label color="green">0 %</Label>
        }
        if(this.state.accident.responsabilite == -1){
            return <Label color="grey">A définir</Label>
        }
        return <Label color="red">err</Label>
    }

    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadAccident();
    }

    render() {
        if(this.state.loading){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loading)}>Chargement de l'accident</Loader>
                </div>
            )
        }else{
            return (
                <Fragment>
                    <div style={{display:"grid",gridTemplateRows:"auto auto 1fr",gridTemplateColumns:"auto 1fr",gridGap:"24px 32px",height:"100%"}}>
                        <div style={{display:"grid",gridColumnEnd:"span 2",gridGap:"32px",gridTemplateColumns:"auto auto 1fr auto"}}>
                            <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/accidentologie");}} tooltip="Retour au tableau des accidents"/>
                            <Message style={{margin:"0",cursor:"pointer"}} onClick={()=>{this.props.history.push("/parc/vehicle/"+this.state.accident.vehicle._id)}} icon>
                                <Icon name="truck"/>
                                <Message.Content>
                                    <Message.Header style={{color:"#2185d0"}}>{this.state.accident.vehicle.registration}</Message.Header>
                                    {this.state.accident.vehicle.brand.name + " - " + this.state.accident.vehicle.model.name}
                                </Message.Content>
                            </Message>
                            <Message style={{margin:"0"}} icon='calendar' header={this.state.accident.occurenceDate} />
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                                <BigIconButton icon="edit" color="blue" onClick={()=>this.setState({editPEC:false,editDeclaration:true,activePanel:"declaration"})} tooltip="Éditer la déclaration de l'accident"/>
                                <BigIconButton icon="edit" color="blue" onClick={()=>this.setState({editPEC:true,editDeclaration:false,activePanel:"priseencharge"})} spacedFromNext tooltip="Éditer la prise en charge de l'accident"/>
                                {this.getArchiveButton()}
                                <BigIconButton icon="folder open" color="purple" onClick={this.showDocs} tooltip="Gérer les documents"/>
                                {this.getDeleteButton()}
                            </div>
                        </div>
                        <Menu size='big' pointing vertical style={{margin:"0"}}>
                            <Menu.Item color="blue" name="Déclaration" active={this.state.activePanel === 'declaration'} onClick={()=>this.setState({activePanel:"declaration"})}/>
                            <Menu.Item color="blue" name="Prise en charge" active={this.state.activePanel === 'priseencharge'} onClick={()=>this.setState({activePanel:"priseencharge"})}/>
                            <Menu.Item color="blue" name="Circonstances" active={this.state.activePanel === 'questions'} onClick={()=>this.setState({activePanel:"questions"})}/>
                            <Menu.Item color="blue" name="Notes" active={this.state.activePanel === 'notes'} onClick={()=>this.setState({activePanel:"notes"})}/>
                            <Menu.Item color="purple" name="Documents" active={this.state.activePanel === 'documents'} onClick={()=>this.setState({activePanel:"documents"})}/>
                        </Menu>
                        <div style={{gridColumnStart:"2",gridRowEnd:"span 2"}}>
                            {this.getActivePanel()}
                        </div>
                    </div>
                    <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Confirmation de suppression 
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Message color='red' icon>
                                <Icon name='warning sign'/>
                                <Message.Content style={{display:"grid"}}>
                                    Veuillez confirmer vouloir supprimer l'accident du véhicule : {this.state.accident.vehicle.registration} ?
                                </Message.Content>
                            </Message>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="red" onClick={this.deleteAccident}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='large' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                        <Modal.Header>
                            Archiver l'accident du véhicule : {this.state.accident.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="orange" onClick={this.archiveAccident}>Archiver</Button>
                            <Button color="black" onClick={this.closeArchive}>Fermer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='large' closeOnDimmerClick={false} open={this.state.openUnArchive} onClose={this.closeUnArchive} closeIcon>
                        <Modal.Header>
                            Désrchiver l'accident du véhicule : {this.state.accident.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="green" onClick={this.unArchiveAccident}>Désarchiver</Button>
                            <Button color="black" onClick={this.closeUnArchive}>Fermer</Button>
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
export default wrappedInUserContext = withUserContext(Accident);