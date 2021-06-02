import React, { Component, Fragment } from 'react'
import { Loader, Menu, Button, Icon, Message, Modal, Progress, Input, Form, Table, TextArea, Label, Popup, Segment, Header } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';

import BigIconButton from '../elements/BigIconButton';
import FAFree from '../elements/FAFree';

import ModalDatePicker from '../atoms/ModalDatePicker';
import ColorPicker from '../atoms/ColorPicker';
import ModelPicker from '../atoms/ModelPicker';
import BrandPicker from '../atoms/BrandPicker';
import OrganismPicker from '../atoms/OrganismPicker';
import SocietePicker from '../atoms/SocietePicker';
import VolumePicker from '../atoms/VolumePicker';
import EnergyPicker from '../atoms/EnergyPicker';
import RegistrationInput from '../atoms/RegistrationInput';
import PayementFormatPicker from '../atoms/PayementFormatPicker';
import PayementTimePicker from '../atoms/PayementTimePicker';
import VehicleArchiveJustificationsPicker from '../atoms/VehicleArchiveJustificationsPicker'
import FileManagementPanel from '../atoms/FileManagementPanel';

import ControlOccurrenceRow from '../molecules/ControlOccurrenceRow';

import { withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

import moment from 'moment';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

class Vehicle extends Component {
    
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    state={
        activePanel:"ident",
        newCg:null,
        newCv:null,
        newCrf:null,
        newIdA:null,
        newSCg:null,
        newSociete:"",
        newTargetSociete:"",
        newRegistration:"",
        newFirstRegistrationDate:"",
        newVolume:0,
        newPayload:0,
        newColor:"",
        newBrand:"",
        newModel:"",
        newEnergy:"",
        newPurchasePrice:0,
        newMonthlyPayement:0,
        newPayementOrg:"",
        newInsurancePaid:0,
        newPayementBeginDate:"",
        newPayementEndDate:"",
        newPayementTime:"",
        newPayementFormat:"",
        newSharingReason:"",
        newHistoryEntryContent:"",
        newSellingReason:"",
        newProperty:null,
        loading:true,
        editingIdent:false,
        editingFinances:false,
        editingBrokenHistory:false,
        openDatePicker:false,
        openUnArchive:false,
        openDelete:false,
        openShare:false,
        openUnshare:false,
        openSell:false,
        openUnsell:false,
        openCancelSell:false,
        openAddHistoryEntry:false,
        openDeleteHistoryEntry:false,
        openBreak:false,
        openUnbreak:false,
        selectedKm:null,
        openDeleteKm:false,
        openDocs:false,
        openDocsSold:false,
        openUpdateKm:false,
        openArchive:false,
        openDisableControl:false,
        controlToDisable:"",
        datePickerTarget:"",
        entretiensStatus:[{status:0,label:"En attente",color:"blue"},{status:1,label:"Affecté",color:"blue"},{status:2,label:"Réalisé",color:"green"},{status:3,label:"Clos",color:"grey"}],
        formats:[{triKey:"CPT",label:"Comptant"},{triKey:"CRC",label:"Crédit Classique"},{triKey:"CRB",label:"Crédit Bail"}],
        newDateReport:new Date().getDate().toString().padStart(2, '0')+"/"+parseInt(new Date().getMonth()+1).toString().padStart(2, '0')+"/"+new Date().getFullYear().toString().padStart(4, '0'),
        _id:this.props.match.params._id,
        newKm:"",
        vehicleQuery : gql`
            query vehicle($_id:String!){
                vehicle(_id:$_id){
                    _id
                    societe{
                        _id
                        name
                    }
                    registration
                    firstRegistrationDate
                    km
                    kms{
                        _id
                        reportDate
                        kmValue
                    }
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
                    color{
                        _id
                        name
                        hex
                    }
                    energy{
                        _id
                        name
                    }
                    financialInfosComplete
                    insurancePaid
                    payementBeginDate
                    payementEndDate
                    payementTime{
                        _id
                        months
                    }
                    property
                    purchasePrice
                    monthlyPayement
                    payementOrg{
                        _id
                        name
                    }
                    payementFormat
                    archived
                    archiveJustification{
                        _id
                        justification
                    }
                    archiveDate
                    cg{
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
                    cv{
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
                    crf{
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
                    ida{
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
                    scg{
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
                    shared
                    sharedTo{
                        _id
                        name
                    }
                    sharedSince
                    sharingReason
                    selling
                    sellingReason
                    sellingSince
                    sold
                    soldOnDate
                    broken
                    brokenSince
                    brokenHistory{
                        _id
                        date
                        content
                        statut
                    }
                    accidents{
                        _id
                        occurenceDate
                        description
                        constatSent
                        archived
                        status
                    }
                    entretiens{
                        _id
                        type
                        originControl{
                            key
                            name
                        }
                        originNature{
                            _id
                            name
                        }
                        status
                        archived
                        time
                        occurenceDate
                        kmAtFinish
                        user{
                            _id
                            firstname
                            lastname
                        }
                    }
                    obli{
                        control{
                            key
                            name
                            unit
                            frequency
                            alert
                            alertUnit
                        }
                        selected
                        entretien
                        lastOccurrence
                    }
                    prev{
                        control{
                            key
                            name
                            unit
                            frequency
                            alert
                            alertUnit
                        }
                        selected
                        entretien
                        lastOccurrence
                    }
                }
            }
        `,
        updateKmQuery : gql`
            mutation updateKm($_id:String!,$date:String!,$kmValue:Int!){
                updateKm(_id:$_id,date:$date,kmValue:$kmValue){
                    status
                    message
                }
            }
        `,
        deleteKmQuery : gql`
            mutation deleteKm($_id:String!,$vehicle:String!){
                deleteKm(_id:$_id,vehicle:$vehicle){
                    status
                    message
                }
            }
        `,
        editVehicleIdentQuery : gql`
            mutation editVehicleIdent($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$energy:String!){
                editVehicleIdent(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,energy:$energy){
                    status
                    message
                }
            }
        `,
        editVehicleFinancesQuery : gql`
            mutation editVehicleFinances($_id:String!,$insurancePaid:Float!,$payementBeginDate:String!,$payementEndDate:String!,$purchasePrice:Float!,$payementOrg:String!,$payementFormat:String!,$payementTime:String!,$monthlyPayement:Float!){
                editVehicleFinances(_id:$_id,insurancePaid:$insurancePaid,purchasePrice:$purchasePrice,payementBeginDate:$payementBeginDate,payementEndDate:$payementEndDate,payementOrg:$payementOrg,payementFormat:$payementFormat,payementTime:$payementTime,monthlyPayement:$monthlyPayement){
                    status
                    message
                }
            }
        `,
        deleteVehicleQuery : gql`
            mutation deleteVehicle($_id:String!){
                deleteVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        archiveVehicleQuery : gql`
            mutation archiveVehicle($_id:String!,$archiveJustification:String!){
                archiveVehicle(_id:$_id,archiveJustification:$archiveJustification){
                    status
                    message
                }
            }
        `,
        unArchiveVehicleQuery : gql`
            mutation unArchiveVehicle($_id:String!){
                unArchiveVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        shareVehicleQuery : gql`
            mutation shareVehicle($_id:String!,$sharingReason:String!,$target:String!){
                shareVehicle(_id:$_id,sharingReason:$sharingReason,target:$target){
                    status
                    message
                }
            }
        `,
        unshareVehicleQuery : gql`
            mutation unshareVehicle($_id:String!){
                unshareVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        sellVehicleQuery : gql`
            mutation sellVehicle($_id:String!,$sellingReason:String!){
                sellVehicle(_id:$_id,sellingReason:$sellingReason){
                    status
                    message
                }
            }
        `,
        unsellVehicleQuery : gql`
            mutation unsellVehicle($_id:String!){
                unsellVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        cancelSellVehicleQuery : gql`
            mutation cancelSellVehicle($_id:String!){
                cancelSellVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        finishSellVehicleQuery : gql`
            mutation finishSellVehicle($_id:String!){
                finishSellVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        addHistoryEntryQuery : gql`
            mutation addHistoryEntry($_id:String!,$content:String!){
                addHistoryEntry(_id:$_id,content:$content){
                    status
                    message
                }
            }
        `,
        deleteHistoryEntryQuery : gql`
            mutation deleteHistoryEntry($vehicle:String!,$_id:String!){
                deleteHistoryEntry(vehicle:$vehicle,_id:$_id){
                    status
                    message
                }
            }
        `,
        breakVehicleQuery : gql`
            mutation breakVehicle($_id:String!){
                breakVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        unbreakVehicleQuery : gql`
            mutation unbreakVehicle($_id:String!){
                unbreakVehicle(_id:$_id){
                    status
                    message
                }
            }
        `,
        uploadVehicleDocumentQuery : gql`
            mutation uploadVehicleDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadVehicleDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
        kmsReport : () => {
            if(this.state.vehicle.kms.length==0){
                return(
                    <Table.Row key={"none"}>
                        <Table.Cell colSpan='3' textAlign="center">
                            Aucun relevé.
                        </Table.Cell>
                    </Table.Row>
                )
            }
            return this.state.vehicle.kms.map((k,i) =>(
                <Table.Row key={k.reportDate+"-"+k.kmValue}>
                    <Table.Cell>{k.reportDate}</Table.Cell>
                    <Table.Cell>{k.kmValue}</Table.Cell>
                    <Table.Cell>
                        {this.state.vehicle.kms.length - 1 == i && this.state.vehicle.kms.length != 1 ? 
                                <Button circular style={{color:"#e74c3c"}} inverted icon icon='cancel' onClick={()=>{this.showDeleteKm(k._id)}}/>
                            :
                                ""
                        }
                    </Table.Cell>
                </Table.Row>
            ))
        },
        updateControlQuery : gql`
            mutation updateControl($_id:String!,$key:String!,$value:Boolean!){
                updateControl(_id:$_id,key:$key,value:$value){
                    status
                    message
                }
            }
        `
    }

    /*SHOW AND HIDE MODALS*/
    showDisableControl = (c) => {
        this.setState({
            openDisableControl:true,
            controlToDisable:c
        })
    }
    closeDisableControl = (c) => {
        this.setState({
            openDisableControl:false,
            controlToDisable:""
        })
    }
    showEditIdent = () => {
        this.setState({
            editingIdent:true,
            activePanel:"ident",
            editingFinances:false,
            editingBrokenHistory:false
        })
    }
    closeEditIdent = () => {
        this.setState({
            editingIdent:false
        })
    }
    showEditFinances = () => {
        this.setState({
            editingFinances:true,
            activePanel:"finances",
            editingIdent:false,
            editingBrokenHistory:false
        })
    }
    closeEditFinances = () => {
        this.setState({
            editingFinances:false
        })
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    showDelete = () => {
        this.setState({
            openDelete:true
        })
    }
    closeDelete = () => {
        this.setState({
            openDelete:false
        })
    }
    showShare = () => {
        this.setState({
            openShare:true
        })
    }
    closeShare = () => {
        this.setState({
            newTargetSociete:"",
            openShare:false
        })
    }
    showUnshare = () => {
        this.setState({
            openUnshare:true
        })
    }
    closeUnshare = () => {
        this.setState({
            openUnshare:false
        })
    }
    showUnsell = () => {
        this.setState({
            openUnsell:true
        })
    }
    closeUnsell = () => {
        this.setState({
            openUnsell:false
        })
    }
    showCancelSell = () => {
        this.setState({
            openCancelSell:true
        })
    }
    closeCancelSell = () => {
        this.setState({
            openCancelSell:false
        })
    }
    showSell = () => {
        this.setState({
            openSell:true
        })
    }
    closeSell = () => {
        this.setState({
            openSell:false
        })
    }
    showAddHistoryEntry = () => {
        this.setState({
            openAddHistoryEntry:true
        })
    }
    closeAddHistoryEntry = () => {
        this.setState({
            openAddHistoryEntry:false
        })
    }
    showDeleteHistoryEntry = selectedEntry => {
        this.setState({
            openDeleteHistoryEntry:true,
            selectedEntry:selectedEntry
        })
    }
    closeDeleteHistoryEntry = () => {
        this.setState({
            openDeleteHistoryEntry:false
        })
    }
    showBreak = () => {
        this.setState({
            openBreak:true
        })
    }
    closeBreak = () => {
        this.setState({
            openBreak:false
        })
    }
    showUnbreak = () => {
        this.setState({
            openUnbreak:true
        })
    }
    closeUnbreak = () => {
        this.setState({
            openUnbreak:false
        })
    }
    showArchive = () => {
        this.setState({
            openArchive:true
        })
    }
    closeArchive = () => {
        this.setState({
            openArchive:false,
            newVehicleArchiveJustification:""
        })
    }
    showUnArchive = () => {
        this.setState({
            openUnArchive:true
        })
    }
    closeUnArchive = () => {
        this.setState({
            openUnArchive:false
        })
    }
    showDeleteKm = selectedKm => {
        this.setState({
            openDeleteKm:true,
            selectedKm:selectedKm
        })
    }
    closeDeleteKm = () => {
        this.setState({
            openDeleteKm:false,
            selectedKm:null
        })
    }
    showUpdateKm = () => {
        this.setState({
            openUpdateKm:true
        })
    }
    closeUpdateKm = () => {
        this.setState({
            openUpdateKm:false
        })
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false,newCg:null,newCv:null})
    }
    showDocsSold = () => {
        this.setState({openDocsSold:true})
    }
    closeDocsSold = () => {
        this.setState({openDocsSold:false,newCrf:null,newIdA:null,newSCg:null})
    }
    /*CHANGE HANDLERS*/
    handleChange = e =>{this.setState({[e.target.name]:e.target.value});}
    handleRegistrationChange = value => {this.setState({newRegistration : value})}
    handleChangePayementFormat = value => {this.setState({ newPayementFormat:value })}
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    handleChangeTargetSociete = (e, { value }) => {this.setState({ newTargetSociete:value })}
    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })
    handleChangeBrand = (e, { value }) => this.setState({ newBrand:value })
    handleChangeModel = (e, { value }) => this.setState({ newModel:value })
    handleChangeVehicleArchiveJustification = (e, { value }) => this.setState({ newVehicleArchiveJustification:value })
    handleChangeEnergy = (e, { value }) => this.setState({ newEnergy:value })
    handleChangeOrganism = (e, { value }) => this.setState({ newPayementOrg:value })
    handleChangePayementTime = (e, { value }) => {this.setState({newPayementTime:value})}
    handleChangeTotalPrice = (e, { value }) =>{this.setState({newPurchasePrice:parseFloat(value)})}
    handleChangeMonthlyPayement = (e, { value }) =>{this.setState({newMonthlyPayement:parseFloat(value)})}
    handleChangeColor = (e, { value }) => this.setState({ newColor:value })
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
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
    switchControl = (v,c,confirm) => {
        if(this.state.obli.concat(this.state.prev).filter(x=>x.control.key == c)[0].selected != v){
            if(this.state.obli.concat(this.state.prev).filter(x=>x.control.key == c)[0].lastOccurrence != "none" && !confirm && !v){
                this.showDisableControl(c)
            }
            this.props.client.mutate({
                mutation:this.state.updateControlQuery,
                variables:{
                    _id:this.state.vehicle._id,
                    key:c,
                    value:v
                }
            }).then(({data})=>{
                data.updateControl.map(qrm=>{
                    if(qrm.status){
                        this.props.toast({message:qrm.message,type:"success"});
                        this.loadVehicle();
                    }else{
                        this.props.toast({message:qrm.message,type:"error"});
                    }
                })
            })
        }
    }
    uploadDocCg = () => {
        this.props.client.mutate({
            mutation:this.state.uploadVehicleDocumentQuery,
            variables:{
                _id:this.state.vehicle._id,
                file:this.state.newCg,
                type:"cg",
                size:this.state.newCg.size
            }
        }).then(({data})=>{
            data.uploadVehicleDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicle();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocCv = () => {
        this.props.client.mutate({
            mutation:this.state.uploadVehicleDocumentQuery,
            variables:{
                _id:this.state.vehicle._id,
                file:this.state.newCv,
                type:"cv",
                size:this.state.newCv.size
            }
        }).then(({data})=>{
            data.uploadVehicleDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicle();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocCrf = () => {
        this.props.client.mutate({
            mutation:this.state.uploadVehicleDocumentQuery,
            variables:{
                _id:this.state.vehicle._id,
                file:this.state.newCrf,
                type:"crf",
                size:this.state.newCrf.size
            }
        }).then(({data})=>{
            data.uploadVehicleDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicle();
                    this.closeDocsSold();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocIdA = () => {
        this.props.client.mutate({
            mutation:this.state.uploadVehicleDocumentQuery,
            variables:{
                _id:this.state.vehicle._id,
                file:this.state.newIdA,
                type:"ida",
                size:this.state.newIdA.size
            }
        }).then(({data})=>{
            data.uploadVehicleDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicle();
                    this.closeDocsSold();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocSCg = () => {
        this.props.client.mutate({
            mutation:this.state.uploadVehicleDocumentQuery,
            variables:{
                _id:this.state.vehicle._id,
                file:this.state.newSCg,
                type:"scg",
                size:this.state.newCv.size
            }
        }).then(({data})=>{
            data.uploadVehicleDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicle();
                    this.closeDocsSold();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    loadVehicle = () => {
        this.props.client.query({
            query:this.state.vehicleQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:this.props.match.params._id
            }
        }).then(({data})=>{
            data.vehicle.brokenHistory.reverse();
            this.setState({
                obli:data.vehicle.obli,
                prev:data.vehicle.prev,
                vehicle:data.vehicle,
                newSociete:data.vehicle.societe._id,
                newRegistration:data.vehicle.registration,
                newFirstRegistrationDate:data.vehicle.firstRegistrationDate,
                newVolume:data.vehicle.volume._id,
                newPayload:data.vehicle.payload,
                newEnergy:data.vehicle.energy._id,
                newColor:data.vehicle.color._id,
                newBrand:data.vehicle.brand._id,
                newModel:data.vehicle.model._id,
                newInsurancePaid:data.vehicle.insurancePaid,
                monthsPayementTime:data.vehicle.payementTime.months,
                newPayementTime:data.vehicle.payementTime._id,
                newPayementBeginDate:data.vehicle.payementBeginDate,
                newPayementEndDate:data.vehicle.payementEndDate,
                newProperty:data.vehicle.property,
                newPurchasePrice:data.vehicle.purchasePrice,
                newMonthlyPayement:data.vehicle.monthlyPayement,
                newPayementOrg:data.vehicle.payementOrg._id,
                newPayementFormat:data.vehicle.payementFormat,
                loading:false
            })
        })
    }
    deleteVehicle = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteVehicleQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteVehicle.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/vehicles")
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    archiveVehicle = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveVehicleQuery,
            variables:{
                _id:this.state._id,
                archiveJustification:this.state.newVehicleArchiveJustification
            }
        }).then(({data})=>{
            data.archiveVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeArchive();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unArchiveVehicle = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unArchiveVehicleQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unArchiveVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeUnArchive();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    shareVehicle = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.shareVehicleQuery,
            variables:{
                _id:this.state._id,
                sharingReason:this.state.newSharingReason,
                target:this.state.newTargetSociete
            }
        }).then(({data})=>{
            data.shareVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeShare();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unshareVehicle = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unshareVehicleQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unshareVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeUnshare();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    sellVehicle = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.sellVehicleQuery,
            variables:{
                _id:this.state._id,
                sellingReason:this.state.newSellingReason
            }
        }).then(({data})=>{
            data.sellVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeSell();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unsellVehicle = () => {
        this.props.client.mutate({
            mutation:this.state.unsellVehicleQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unsellVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeUnsell();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    cancelSellVehicle = () => {
        this.props.client.mutate({
            mutation:this.state.cancelSellVehicleQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.cancelSellVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeCancelSell();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    finishSellVehicle = () => {
        this.props.client.mutate({
            mutation:this.state.finishSellVehicleQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.finishSellVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeUnsell();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    addHistoryEntry = () => {
        this.closeAddHistoryEntry();
        this.props.client.mutate({
            mutation:this.state.addHistoryEntryQuery,
            variables:{
                _id:this.state._id,
                content:this.state.newHistoryEntryContent
            }
        }).then(({data})=>{
            data.addHistoryEntry.map(qrm=>{
                if(qrm.status){
                    this.closeAddHistoryEntry();
                    this.loadVehicle();
                    this.setState({activePanel:"pannes"})
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteHistoryEntry = () => {
        this.props.client.mutate({
            mutation:this.state.deleteHistoryEntryQuery,
            variables:{
                _id:this.state.selectedEntry,
                vehicle:this.state.vehicle._id
            }
        }).then(({data})=>{
            data.deleteHistoryEntry.map(qrm=>{
                if(qrm.status){
                    this.setState({selectedEntry:""})
                    this.closeDeleteHistoryEntry();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    breakVehicle = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.breakVehicleQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.breakVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeBreak();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unbreakVehicle = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unbreakVehicleQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unbreakVehicle.map(qrm=>{
                if(qrm.status){
                    this.closeUnbreak();
                    this.loadVehicle();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    updateKm = () => {
        this.props.client.mutate({
            mutation:this.state.updateKmQuery,
            variables:{
                _id:this.state._id,
                date:this.state.newDateReport,
                kmValue:parseInt(this.state.newKm)
            }
        }).then(({data})=>{
            data.updateKm.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeUpdateKm();
                    this.loadVehicle();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    saveEditIdent = () => {
        this.props.client.mutate({
            mutation:this.state.editVehicleIdentQuery,
            variables:{
                _id:this.state._id,
                societe:this.state.newSociete,
                registration:this.state.newRegistration,
                firstRegistrationDate:this.state.newFirstRegistrationDate,
                brand:this.state.newBrand,
                model:this.state.newModel,
                volume:this.state.newVolume,
                payload:this.state.newPayload,
                color:this.state.newColor,
                energy:this.state.newEnergy
            }
        }).then(({data})=>{
            data.editVehicleIdent.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditIdent();
                    this.loadVehicle();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    saveEditFinances = () => {
        this.props.client.mutate({
            mutation:this.state.editVehicleFinancesQuery,
            variables:{
                _id:this.state._id,
                property:this.state.newProperty,
                purchasePrice:parseFloat(this.state.newPurchasePrice),
                insurancePaid:parseFloat(this.state.newInsurancePaid),
                payementBeginDate:this.state.newPayementBeginDate,
                payementEndDate:this.state.newPayementEndDate,
                payementOrg:this.state.newPayementOrg,
                payementTime:this.state.newPayementTime,
                payementFormat:this.state.newPayementFormat,
                monthlyPayement:parseFloat(this.state.newMonthlyPayement)
            }
        }).then(({data})=>{
            data.editVehicleFinances.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditFinances();
                    this.loadVehicle();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteKm = () => {
        this.closeDeleteKm()
        this.props.client.mutate({
            mutation:this.state.deleteKmQuery,
            variables:{
                _id:this.state.selectedKm,
                vehicle:this.state._id
            }
        }).then(({data})=>{
            data.deleteKm.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadVehicle();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    /*CONTENT GETTERS*/
    getPayementProgress = () => {
        let totalMonths = parseInt(moment(this.state.vehicle.payementEndDate,"DD/MM/YYYY").diff(moment(this.state.vehicle.payementBeginDate,"DD/MM/YYYY"),'months', true));
        let monthsDone = parseInt(moment().diff(moment(this.state.vehicle.payementBeginDate,"DD/MM/YYYY"),'months', true));
        if(monthsDone>totalMonths){monthsDone=totalMonths}
        let monthsLeft = totalMonths - monthsDone;
        let value = parseInt(this.state.vehicle.monthlyPayement * monthsDone)
        
        if(this.state.vehicle.payementFormat == "CRB"){
            if(parseInt(monthsLeft) == 0){
                return <Progress style={{margin:"64px"}} size="large" active color="green" value={value} total={this.state.vehicle.purchasePrice} label="Propriété, payement terminé"/>    
            }
            return <Progress style={{margin:"64px"}} size="large" active color="orange" value={value} total={this.state.vehicle.purchasePrice} label={value + " / " + this.state.vehicle.purchasePrice + " : " + monthsLeft + " mois restant avant propriété"} />
        }else{
            if(parseInt(monthsLeft) == 0){
                return <Progress style={{margin:"64px"}} size="large" active color="green" value={value} total={this.state.vehicle.purchasePrice} label="Propriété, payement terminé"/>    
            }
            return <Progress style={{margin:"64px"}} size="large" active color="green" value={value} total={this.state.vehicle.purchasePrice} label={value + " / " + this.state.vehicle.purchasePrice + " : propriété, fin de payement prévue dans "+parseInt(monthsLeft)+" mois."} />
        }
    }
    getChartMonths = () => {
        let monthsLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jui', 'Jui','Aoû','Sep','Oct','Nov','Déc'];
        let thisYear = parseInt(moment().format('YY'))
        let start = parseInt(moment().format('M'))-1;
        return monthsLabels.slice(start+1).map(x=> x=x+" "+(thisYear-1)).concat(monthsLabels.slice(0,start+1).map(x=> x=x+" "+thisYear))
    }
    getInChartMonthIndex = date => {
        if(moment(date).format("Y") == moment().format('Y')){
            return 12+parseInt(moment(date).format("M"))-1
        }
        if(moment(date).format("Y") == moment().format('Y')-1){
            return parseInt(moment(date).format("M"))-1
        }
        return "error"
    }
    getChartSharedValues = () => {
        if(this.state.loading){return []}
        let kms = Array.from(this.state.vehicle.kms)
        let sharedKms = []
        for(let y = parseInt(moment().format('YYYY'))-1; y <= parseInt(moment().format('YYYY'));y++){
            for(let m = 1; m <= 12;m++){
                sharedKms.push({month:m+"/"+y,km:0})
            }
        }
        for(let y = parseInt(moment().format('YYYY'))-1; y <= parseInt(moment().format('YYYY'));y++){
            for(let m = 1; m <= 12;m++){
                kms.map((k,i) =>{
                    if(i>0){
                        let prevDate = moment(kms[i-1].reportDate,"DD/MM/YYYY");
                        let currDate = moment(k.reportDate,"DD/MM/YYYY")
                        let daysBetweenPrevAndCurr = parseInt(currDate.diff(prevDate, 'days'))
                        let daysToAffect = daysBetweenPrevAndCurr;
                        let localDaysRepartition = [];
                        if(parseInt(currDate.format('M')) == m && parseInt(currDate.format('YYYY')) == y){
                            if(localDaysRepartition[m+"/"+y] == undefined){
                                if(daysBetweenPrevAndCurr < parseInt(currDate.format("D"))){
                                    localDaysRepartition[m+"/"+y] = {month:m +"/"+ y,days:daysBetweenPrevAndCurr};
                                }else{
                                    localDaysRepartition[m+"/"+y] = {month:m +"/"+ y,days:parseInt(currDate.format("D"))};
                                }
                            }else{
                                if(daysBetweenPrevAndCurr < parseInt(currDate.format("D"))){
                                    localDaysRepartition[m+"/"+y] = {month:m +"/"+ y,days:localDaysRepartition[m+"/"+y].days + daysBetweenPrevAndCurr};
                                }else{
                                    localDaysRepartition[m+"/"+y] = {month:m +"/"+ y,days:localDaysRepartition[m+"/"+y].days + parseInt(currDate.format("D"))};
                                }
                            }
                            if(daysBetweenPrevAndCurr < parseInt(currDate.format("D"))){
                                daysToAffect = daysToAffect - daysBetweenPrevAndCurr;
                            }else{
                                daysToAffect = daysToAffect - parseInt(currDate.format("D"));
                            }
                            let mo = m - 1;
                            let ye = y;
                            while(daysToAffect > 0){
                                if (mo == 0){
                                    mo = 12
                                    ye = ye - 1
                                }
                                let willAffect = daysToAffect;
                                if(daysToAffect > parseInt(moment(mo+"/"+ye, "MM/YYYY").daysInMonth())){
                                    willAffect = parseInt(moment(mo+"/"+ye, "MM/YYYY").daysInMonth());
                                }
                                if(localDaysRepartition[mo+"/"+ye] == undefined){
                                    localDaysRepartition[mo+"/"+ye] = {month:mo +"/"+ ye,days:willAffect};
                                }else{
                                    localDaysRepartition[mo+"/"+ye] = {month:mo +"/"+ ye,days:localDaysRepartition[mo+"/"+ye].days + willAffect};
                                }
                                mo = mo - 1
                                daysToAffect = daysToAffect - willAffect;
                            }
                            sharedKms.map(sk=>{
                                if(Object.values(localDaysRepartition).filter(x=>x.month==sk.month).length > 0){
                                    sk.km = sk.km + parseInt((Object.values(localDaysRepartition).filter(x=>x.month==sk.month)[0].days/daysBetweenPrevAndCurr) * (k.kmValue - kms[i-1].kmValue))
                                }
                            })
                        }
                    }
                })
            }
        }
        return sharedKms.filter(x =>(parseInt(moment(x.month,"MM/YYYY").format("M")) > parseInt(moment().format("M")) && parseInt(moment(x.month,"MM/YYYY").format("YYYY")) != parseInt(moment().format("YYYY"))) || (parseInt(moment(x.month,"MM/YYYY").format("M")) <= parseInt(moment().format("M")) && parseInt(moment(x.month,"MM/YYYY").format("YYYY")) == parseInt(moment().format("YYYY")))).map(x=>x.km);
    }
    getChartData = () => {
        return {
            labels: this.getChartMonths(),
            datasets: [
                {
                    label: 'Kilométrage mensuel',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(116, 185, 255,0.4)',
                    borderColor: 'rgba(116, 185, 255,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(116, 185, 255,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(116, 185, 255,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: this.getChartSharedValues()
                }
            ]
        }
    }
    getDeleteOptions = () => {
        if(this.props.user.isOwner){
            if(this.state.vehicle.archived){
                return(
                    <Fragment>
                        <BigIconButton icon="archive" color="orange" onClick={this.showUnArchive} tooltip="Désarchiver le vehicule"/>
                        <BigIconButton icon="trash" color="red" onClick={this.showDelete} tooltip="Supprimer le vehicule"/>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <BigIconButton icon="archive" color="orange" onClick={this.showArchive} tooltip="Archiver le vehicule"/>
                        <BigIconButton icon="trash" color="red" onClick={this.showDelete} tooltip="Supprimer le vehicule"/>
                    </Fragment>
                )
            }
        }else{
            if(this.state.vehicle.archived){
                return(
                    <Fragment>
                        <BigIconButton icon="archive" color="orange" onClick={this.showUnArchive} tooltip="Désarchiver le vehicule"/>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <BigIconButton icon="archive" color="orange" onClick={this.showArchive} tooltip="Archiver le vehicule"/>
                    </Fragment>
                )
            }
        }
    }
    getShareOptions = () => {
        if(this.state.vehicle.shared){
            return(
                <Fragment>
                    <BigIconButton icon="handshake" color="teal" onClick={this.showUnshare} tooltip="Rappeler le vehicule"/>
                </Fragment>
            )
        }else{
            return(
                <Fragment>
                    <BigIconButton icon="handshake" color="teal" onClick={this.showShare} tooltip="Prêter le vehicule"/>
                </Fragment>
            )
        }
    }
    getSellOptions = () => {
        if(this.state.vehicle.selling){//CONCLUSION OU RETRAIT
            return(
                <Fragment>
                    <BigIconButton icon="cart" color="teal" onClick={this.showUnsell} tooltip="Fin la vente"/>
                </Fragment>
            )
        }else{
            if(!this.state.vehicle.sold){//MISE EN VENTE
                return(
                    <Fragment>
                        <BigIconButton icon="cart" color="teal" onClick={this.showSell} tooltip="Mettre en vente"/>
                    </Fragment>
                )
            }else{//ANNULATION
                return(
                    <Fragment>
                        <BigIconButton icon="cart" color="orange" onClick={this.showCancelSell} tooltip="Annuler la vente"/>
                    </Fragment>
                )
            }
        }
    }
    getBrokenOptions = () => {
        if(this.state.vehicle.broken){
            return(
                <BigIconButton icon="wrench" color="teal" onClick={this.showUnbreak} tooltip="Résoudre la panne"/>
            )
        }else{
            return(
                <BigIconButton icon="wrench" color="teal" onClick={this.showBreak} tooltip="Déclarer une panne"/>
            )
        }
    }
    getSoldDocsOptions = () => {
        if(this.state.vehicle.sold){
            return(
                <BigIconButton icon="folder" color="violet" onClick={this.showDocsSold} tooltip="Gérer les documents du véhicule vendu" spacedFromNext/>
            )
        }
    }

    //PANELS
    getActivePanel = () => {
        if(this.state.activePanel == "ident"){
            return this.getIdentPanel()
        }
        if(this.state.activePanel == "finances"){
            return this.getFinancesPanel()
        }
        if(this.state.activePanel == "pannes"){
            return this.getHistoriquePanel()
        }
        if(this.state.activePanel == "accidents"){
            return this.getAccidentsPanel()
        }
        if(this.state.activePanel == "kms"){
            return this.getKmReportPanel()
        }
        if(this.state.activePanel == "docs"){
            return this.getDocsPanel()
        }
        if(this.state.activePanel == "obli"){
            return this.getObliPanel()
        }
        if(this.state.activePanel == "prev"){
            return this.getPrevPanel()
        }
        if(this.state.activePanel == "entretiens"){
            return this.getEntretiensPanel()
        }
    }
    getIdentPanel = () => {
        if(this.state.editingIdent){
            return (
                <Segment style={{padding:"auto",placeSelf:"stretch"}}>
                    <Form style={{display:"grid",gridTemplateRows:"auto auto auto auto auto 1fr auto",height:"100%"}} className="formBoard editing">
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Propriétaire</label>
                            <SocietePicker restrictToVisibility defaultValue={this.state.vehicle.societe._id} groupAppears={false} onChange={this.handleChangeSociete}/>
                        </Form.Field>
                        <RegistrationInput onChange={this.handleRegistrationChange} defaultValue={this.state.vehicle.registration} name="newRegistration"/>
                        <Form.Field><label>1ère immatriculation</label>
                            <Input defaultValue={this.state.vehicle.firstRegistrationDate} onChange={this.handleChange} name="newFirstRegistrationDate"/>
                        </Form.Field>
                        <Form.Field><label>Énergie</label>
                            <EnergyPicker defaultValue={this.state.vehicle.energy._id} onChange={this.handleChangeEnergy}/>
                        </Form.Field>
                        <Form.Field><label>Marque</label>
                            <BrandPicker defaultValue={this.state.vehicle.brand._id} onChange={this.handleChangeBrand}/>
                        </Form.Field>
                        <Form.Field><label>Modèle</label>
                            <ModelPicker defaultValue={this.state.vehicle.model._id} onChange={this.handleChangeModel}/>
                        </Form.Field>
                        <Form.Field><label>Volume</label>
                            <VolumePicker defaultValue={this.state.vehicle.volume._id} onChange={this.handleChangeVolume}/>
                        </Form.Field>
                        <Form.Field><label>Charge utile</label>
                            <Input defaultValue={this.state.vehicle.payload} onChange={this.handleChange} name="newPayload"/>
                        </Form.Field>
                        <Form.Field><label>Couleur</label>
                            <ColorPicker defaultValue={this.state.vehicle.color._id} onChange={this.handleChangeColor}/>
                        </Form.Field>
                        <div style={{display:"flex",justifyContent:"center",placeSelf:"stretch",gridRowStart:"7",gridColumnEnd:"span 2"}}>
                            <Button size="huge" color="red" icon labelPosition="left" onClick={this.closeEditIdent}>Annuler<Icon name='cancel' /></Button>
                            <Button size="huge" color="green" icon labelPosition="left" onClick={this.saveEditIdent}>Valider<Icon name='check' /></Button>
                        </div>
                    </Form>
                </Segment>
            )
        }else{
            return (
                <Segment style={{padding:"auto",placeSelf:"stretch"}}>
                    <div className="formBoard displaying">
                        <div className="labelBoard">Propriétaire :</div><div className="valueBoard">{this.state.vehicle.societe.name}</div>
                        <div className="labelBoard">Immatriculation :</div><div className="valueBoard">{this.state.vehicle.registration}</div>
                        <div className="labelBoard">1ère immatriculation :</div><div className="valueBoard">{this.state.vehicle.firstRegistrationDate}</div>
                        <div className="labelBoard">Énergie :</div><div className="valueBoard">{this.state.vehicle.energy.name}</div>
                        <div className="labelBoard">Marque :</div><div className="valueBoard">{this.state.vehicle.brand.name}</div>
                        <div className="labelBoard">Modèle :</div><div className="valueBoard">{this.state.vehicle.model.name}</div>
                        <div className="labelBoard">Volume :</div><div className="valueBoard">{this.state.vehicle.volume.meterCube+" m²"}</div>
                        <div className="labelBoard">Charge utile :</div><div className="valueBoard">{this.state.vehicle.payload+" t."}</div>
                        <div className="labelBoard">Couleur :</div><div className="valueBoard">{this.state.vehicle.color.name}</div>
                    </div>
                </Segment>
            )
        }
    }
    getObliPanel = () => {
        return (
            <div attached="right" style={{padding:"auto",justifySelf:"stretch"}}>
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">Nom du contrôle</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Éligibilité</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Fréquence</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Seuil d'alerte</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Dernier contrôle</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Échéance</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.obli.map(o=>
                            <ControlOccurrenceRow
                                key={o.control.key}
                                vehicle={{
                                    _id:this.state.vehicle._id,
                                    km:this.state.vehicle.km,
                                    registration:this.state.vehicle.registration
                                }}
                                loadVehicle={this.loadVehicle}
                                switchControl={this.switchControl}
                                c={o}
                            />
                        )}
                    </Table.Body>
                </Table>
            </div>
        )
    }
    getPrevPanel = () => {
        return (
            <div attached="right" style={{padding:"auto",justifySelf:"stretch"}}>
                <Table compact celled>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell textAlign="center">Nom du contrôle</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Éligibilité</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Fréquence</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Dernier contrôle</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Échéance</Table.HeaderCell>
                            <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.prev.map(p=>
                            <ControlOccurrenceRow
                                key={p.control.key}
                                vehicle={{
                                    _id:this.state.vehicle._id,
                                    km:this.state.vehicle.km,
                                    registration:this.state.vehicle.registration
                                }}
                                loadVehicle={this.loadVehicle}
                                switchControl={this.switchControl}
                                c={p}
                            />
                        )}
                    </Table.Body>
                </Table>
            </div>
        )
    }
    getFinancesPanel = () => {
        if(this.state.editingFinances || !this.state.vehicle.financialInfosComplete){
            return (
                <Segment style={{padding:"auto",placeSelf:"stretch"}}>
                    <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto auto auto auto 1fr auto",height:"100%"}} className="formBoard editing">
                        <Form.Field><label>Montant de l'assurance</label>
                            <Input defaultValue={this.state.vehicle.insurancePaid} onChange={this.handleChange} name="newInsurancePaid"/>
                        </Form.Field>
                        <Form.Field><label>Prix à l'achat</label>
                            <Input defaultValue={this.state.vehicle.purchasePrice} onChange={this.handleChangeTotalPrice} name="newPurchasePrice"/>
                        </Form.Field>
                        <Form.Field><label>Date de début du payement</label>
                            <Input onChange={this.handleChange} value={this.state.newPayementBeginDate} onFocus={()=>{this.showDatePicker("newPayementBeginDate")}} name="newPayementBeginDate"/>
                        </Form.Field>
                        <Form.Field><label>Date de fin du payement</label>
                            <Input onChange={this.handleChange} value={this.state.newPayementEndDate} onFocus={()=>{this.showDatePicker("newPayementEndDate")}} name="newPayementEndDate"/>
                        </Form.Field>
                        <Form.Field><label>Payement mensuel</label>
                            <Input defaultValue={this.state.vehicle.monthlyPayement} onChange={this.handleChangeMonthlyPayement} name="newMonthlyPayement"/>
                        </Form.Field>
                        <Form.Field><label>Durée de financement</label>
                            <PayementTimePicker defaultValue={this.state.vehicle.payementTime._id} onChange={this.handleChangePayementTime}/>
                        </Form.Field>
                        <Form.Field><label>Organisme de financement</label>
                            <OrganismPicker defaultValue={this.state.vehicle.payementOrg._id} onChange={this.handleChangeOrganism}/>
                        </Form.Field>
                        <Form.Field><label>Type de financement</label>
                            <PayementFormatPicker defaultValue={this.state.vehicle.payementFormat} change={this.handleChangePayementFormat}/>
                        </Form.Field>
                        <div style={{display:"flex",justifyContent:"center",placeSelf:"stretch",gridRowStart:"6",gridColumnEnd:"span 2"}}>
                            <Button size="huge" color="red" icon labelPosition="left" onClick={this.closeEditFinances}>Annuler<Icon name='cancel' /></Button>
                            <Button size="huge" color="green" icon labelPosition="left" onClick={this.saveEditFinances}>Valider<Icon name='check' /></Button>
                        </div>
                    </Form>
                </Segment>
            )
        }else{
            if(this.state.vehicle.financialInfosComplete){
                return (
                    <Segment style={{padding:"auto",display:"grid",gridTemplateRows:"1fr",placeSelf:"stretch"}}>
                        <div className="formBoard displaying" style={{gridTemplateRows:"auto auto auto auto auto auto auto auto 1fr"}}>
                            <div className="labelBoard">Montant de l'assurance :</div>
                            <div className="valueBoard">{parseFloat(this.state.vehicle.insurancePaid).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €</div>
                            <div className="labelBoard">Prix d'achat :</div>
                            <div className="valueBoard">{parseFloat(this.state.vehicle.purchasePrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €</div>
                            <div className="labelBoard">Date de début de payement :</div>
                            <div className="valueBoard">{this.state.vehicle.payementBeginDate}</div>
                            <div className="labelBoard">Date de fin de payement :</div>
                            <div className="valueBoard">{this.state.vehicle.payementEndDate}</div>
                            <div className="labelBoard">Durée de financement :</div>
                            <div className="valueBoard">{this.state.vehicle.payementTime.months + " mois"}</div>
                            <div className="labelBoard">Payement mensuel :</div>
                            <div className="valueBoard">{parseFloat(this.state.vehicle.monthlyPayement).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €/mois</div>
                            <div className="labelBoard">Type de financement :</div>
                            <div className="valueBoard">{this.state.formats.filter(f=>f.triKey == this.state.vehicle.payementFormat)[0].label}</div>
                            <div className="labelBoard">Organisme de payement :</div>
                            <div className="valueBoard">{this.state.vehicle.payementOrg.name}</div>
                        </div>
                        <div>{this.getPayementProgress()}</div>
                    </Segment>
                )
            }
        }
    }
    getHistoriquePanel = () => {
        if(this.state.vehicle.brokenHistory.length == 0){
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    <Segment style={{display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr",cursor:"pointer"}}>
                        <Header style={{margin:"48px",placeSelf:"center"}} as='h2'>Il n'y a aucune données dans l'historique</Header>
                    </Segment>
                </div>
            )
        }else{
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    {this.state.vehicle.brokenHistory.map(b=>{
                        return (
                            <Segment
                                key={b._id}
                                onClick={()=>{this.props.history.push("/accident/"+b._id)}}
                                style={{display:"grid",gridTemplateColumns:"auto 1fr auto",marginBottom:"12px",marginTop:"0",padding:"8px 16px",gridTemplateRows:"auto auto",cursor:"pointer"}}
                            >
                                <FAFree code="far fa-comment" style={{gridRowEnd:"span 2",gridColumnStart:"1",placeSelf:"center",marginRight:"16px",fontSize:"2em"}}/>
                                <Header style={{margin:"0",placeSelf:"center start"}} as='a'>{b.content}</Header>
                                <div style={{gridRowStart:"2",gridColumnStart:"2"}}>
                                    <p>{b.date}</p>
                                </div>
                                {((this.props.user.isOwner ? <Popup trigger={<Button style={{gridRowEnd:"span 2",placeSelf:"center"}} color="red" icon onClick={()=>this.showDeleteHistoryEntry(b._id)} icon="trash" />}>Supprimer</Popup> : ""))}
                            </Segment>
                        )
                    })}
                </div>
            )
        }
    }
    getAccidentsPanel = () => {
        if(this.state.vehicle.accidents.length == 0){
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    <Segment style={{display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr"}}>
                        <Header style={{margin:"48px",placeSelf:"center"}} as='h2'>Il n'y aucun accident pour ce véhicule</Header>
                    </Segment>
                </div>
            )
        }else{
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    {this.state.vehicle.accidents.map(a=>{
                        return (
                            <Segment
                                key={a._id}
                                onClick={()=>{this.props.history.push("/accident/"+a._id)}}
                                style={{display:"grid",gridTemplateColumns:"auto 1fr auto",marginBottom:"12px",marginTop:"0",padding:"8px 16px",gridTemplateRows:"auto auto",cursor:"pointer"}}
                            >
                                <FAFree code="fas fa-fire" style={{gridRowEnd:"span 2",gridColumnStart:"1",placeSelf:"center",marginRight:"16px",fontSize:"2em"}}/>
                                <Header color="blue" style={{margin:"0",placeSelf:"center start"}} as='a'>{a.occurenceDate}</Header>
                                <div style={{gridRowStart:"2",gridColumnStart:"2"}}>
                                    <p>Cliquez pour y accéder</p>
                                </div>
                            </Segment>
                        )
                    })}
                </div>
            )
        }
    }
    getKmReportPanel = () => {
        return (
            <div style={{padding:"auto",justifySelf:"stretch",display:"grid",gridTemplateColumns:"2fr 3fr",gridGap:"32px"}}>
                <Table compact style={{placeSelf:"start"}}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Date</Table.HeaderCell>
                            <Table.HeaderCell>Km</Table.HeaderCell>
                            <Table.HeaderCell>Suppr.</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.kmsReport()}
                    </Table.Body>
                </Table>
                <Segment style={{margin:"0",placeSelf:"stretch"}}>
                    <Bar ref={(reference) => this.chartRef = reference } data={this.getChartData()} height={400} style={{display:"block"}} options={{maintainAspectRatio:false,responsive:true}}/>
                </Segment>
            </div>
        )
    }
    getDocsPanel = () => {
        return (
            <div attached="right" style={{padding:"auto",justifySelf:"stretch",display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto 1fr",gridGap:"24px"}}>
                <FileManagementPanel importLocked={this.state.newCg == null} handleInputFile={this.handleInputFile} fileTarget="newCg" uploadDoc={this.uploadDocCg} fileInfos={this.state.vehicle.cg} title="Carte grise" type="cg"/>
                <FileManagementPanel importLocked={this.state.newCv == null} handleInputFile={this.handleInputFile} fileTarget="newCv" uploadDoc={this.uploadDocCv} fileInfos={this.state.vehicle.cv} title="Carte verte" type="cv"/>
            </div>
        )
    }
    getEntretiensPanel = () => {
        if(this.state.vehicle.entretiens.length == 0){
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    <Segment style={{display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr",cursor:"pointer"}}>
                        <Header style={{margin:"48px",placeSelf:"center"}} as='h2'>Il n'y aucun entretien pour ce véhicule</Header>
                    </Segment>
                </div>
            )
        }else{
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    {this.state.vehicle.entretiens.sort((a,b)=>{
                        if(a.status <= 2){
                            return a.status-b.status
                        }else{
                            return b.kmAtFinish - a.kmAtFinish
                        }
                    }).map(e=>{
                        return (
                            <Segment
                                key={e._id}
                                onClick={()=>{this.props.history.push("/entretien/"+e._id)}}
                                style={{display:"grid",gridTemplateColumns:"128px 128px 1fr auto",marginBottom:"12px",marginTop:"0",padding:"12px 24px",cursor:"pointer",gridGap:"32px"}}
                            >
                                <div style={{gridColumnStart:"1",display:"grid",gridTemplateRows:"auto 1fr",gridGap:"4px",placeSelf:"center stretch"}}>
                                    <Header color="blue" style={{margin:"0",placeSelf:"center"}} as='a'>{this.getEntretienOrigin(e)}</Header>
                                    {this.getEntretienType(e)}
                                </div>
                                {this.getEntretienStatus(e)}
                                {this.getEntretienInfos(e)}
                                <div style={{gridColumnStart:"4",placeSelf:"center"}}><p>Cliquez pour y accéder</p></div>
                            </Segment>
                        )
                    })}
                </div>
            )
        }
    }
    getEntretienOrigin = entretien => {
        if(entretien.originNature != null){
            return entretien.originNature.name
        }else{
            return entretien.originControl.name
        }
    }
    getEntretienType = entretien => {
        if(entretien.type == "obli"){
            return(
                <Label style={{placeSelf:"center"}} image>
                    <Icon style={{margin:"0"}} name='clipboard check'/>
                    <Label.Detail>OBLIGATOIRE</Label.Detail>
                </Label>
            )
        }else{
            if(entretien.type == "prev"){
                return(
                    <Label style={{placeSelf:"center"}} image>
                        <Icon style={{margin:"0"}} name='clipboard check'/>
                        <Label.Detail>PRÉVENTIF</Label.Detail>
                    </Label>
                )
            }else{
                if(entretien.type == "cura"){
                    return(
                        <Label color="grey" style={{placeSelf:"center"}} image>
                            <Icon style={{margin:"0"}} name='wrench'/>
                            <Label.Detail>CURATIF</Label.Detail>
                        </Label>
                    )
                }
            }
        }
    }
    getEntretienStatus = entretien => {
        let s = this.state.entretiensStatus.filter(s=>s.status == entretien.status)[0];
        return(
            <Label size="big" style={{margin:"0",placeSelf:"center"}} color={s.color}>
                {s.label}
            </Label>
        )
    }
    getEntretienInfos = entretien => {
        if(entretien.status == 0){
            return (
                <div style={{gridColumnStart:"3",display:"grid",gridTemplateColumns:"auto 1fr",gridGap:"0 8px",placeSelf:"center start"}}>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"1"}}>En attente de pris en charge</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"1"}}>Date de réalisation à détérminer</p>
                </div>
            )
        }
        if(entretien.status == 1){
            return (
                <div style={{gridColumnStart:"3",display:"grid",gridTemplateColumns:"auto 1fr",gridGap:"0 8px",placeSelf:"center start"}}>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Pris en charge par :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.user.firstname + " " + entretien.user.lastname}</p>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Réalisation prévu le :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.occurenceDate}</p>
                </div>
            )
        }
        if(entretien.status == 2){
            return (
                <div style={{gridColumnStart:"3",display:"grid",gridTemplateColumns:"auto 1fr",gridGap:"0 8px",placeSelf:"center start"}}>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Réalisé le :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.occurenceDate}</p>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Réalisé par :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.user.firstname + " " + entretien.user.lastname}</p>
                </div>
            )
        }
        if(entretien.status == 3){
            return (
                <div style={{gridColumnStart:"3",display:"grid",gridTemplateColumns:"auto 1fr",gridGap:"0 8px",placeSelf:"center start"}}>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Réalisé le :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.occurenceDate}</p>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Réalisé par :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.user.firstname + " " + entretien.user.lastname}</p>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Temps passé :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.time} heures</p>
                    <p style={{margin:"0",placeSelf:"center end",gridColumnStart:"1"}}>Kilométrage :</p>
                    <p style={{margin:"0",placeSelf:"center start",gridColumnStart:"2"}}>{entretien.kmAtFinish}</p>
                </div>
            )
        }
    }

    //MESSAGE
    getUncompleteFinancialMessage = () => {
        if(!this.state.vehicle.financialInfosComplete){
            return (
                <Message onClick={this.showEditFinances} color="red" style={{margin:"0",cursor:"pointer"}} icon='euro' header={"Informations manquantes"} content={"Les informations relatives au financement de ce véhicule sont incomplètes, cliquez pour les modifier."} />
            )
        }
    }
    getArchiveMessage = () => {
        if(this.state.vehicle.archived){
            let justification = this.state.vehicle.archiveJustification.justification
            if(justification == null){
                justification = "Aucune justification"
            }
            return (
                <Message color="orange" style={{margin:"0"}} icon='archive' header={"Archivé depuis le : " + this.state.vehicle.archiveDate} content={"Justificaion : " + justification} />
            )
        }
    }
    getSharedMessage = () => {
        if(this.state.vehicle.shared){
            return (
                <Message color="teal" style={{margin:"0"}} icon='handshake outline' header={"Véhicule opéré par : " + this.state.vehicle.sharedTo.name + ", depuis le : " + this.state.vehicle.sharedSince} content={"Justificaion : " + this.state.vehicle.sharingReason} />
            )
        }
    }
    getSellingMessage = () => {
        if(this.state.vehicle.sold){
            return (
                <Message color="orange" style={{margin:"0"}} icon='cart' header={"Véhicule vendu le : " + this.state.vehicle.soldOnDate} content={"Justificaion : " + this.state.vehicle.sellingReason} />
            )
        }
        if(this.state.vehicle.selling){
            return (
                <Message color="teal" style={{margin:"0"}} icon='cart' header={"En vente depuis le : " + this.state.vehicle.sellingSince} content={"Justificaion : " + this.state.vehicle.sellingReason} />
            )
        }
    }
    getBrokenMessage = () => {
        if(this.state.vehicle.broken){
            return (
                <Message color="teal" style={{margin:"0"}} icon='wrench' header={"En panne depuis le : " + this.state.vehicle.brokenSince} content={"Dernier commentaire : " + this.state.vehicle.brokenHistory[this.state.vehicle.brokenHistory.length-1].content} />
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadVehicle();
    }

    render() {
        if(this.state.loading){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loading)}>Chargement du véhicule</Loader>
                </div>
            )
        }else{
            return (
                <Fragment>
                    <div style={{display:"grid",gridGap:"24px",gridTemplateRows:"auto auto minmax(0,1fr)",gridTemplateColumns:"2fr 2fr",height:"100%"}}>
                        <div style={{display:"grid",gridColumnEnd:"span 2",gridGap:"32px",gridTemplateColumns:"auto 1fr auto auto"}}>
                            <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/parc/vehicles");}} tooltip="Retour au tableau des véhicules"/>
                            <Message style={{margin:"0"}} icon='truck' header={this.state.vehicle.registration} content={this.state.vehicle.brand.name + " - " + this.state.vehicle.model.name} />
                            <Message style={{margin:"0"}} header={this.state.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "km"} content={"relevé " + moment(this.state.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()} />
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                                <BigIconButton icon="dashboard" color="green" onClick={this.showUpdateKm} tooltip="Mise à jour du kilométrage"/>
                                <BigIconButton icon="edit" color="blue" onClick={this.showEditIdent} tooltip="Édition du paneau identification"/>
                                <BigIconButton icon="edit" color="blue" onClick={this.showEditFinances} tooltip="Édition de paneau finances" spacedFromNext/>
                                {this.getShareOptions()}
                                {this.getSellOptions()}
                                {this.getBrokenOptions()}
                                <BigIconButton icon="chat" color="blue" onClick={this.showAddHistoryEntry} tooltip="Ajouter une note à l'historique" spacedFromPrevious/>
                                <BigIconButton icon="folder" color="purple" onClick={()=>{this.setState({activePanel:"docs"})}} tooltip="Gérer les documents" spacedFromPrevious/>
                                {this.getSoldDocsOptions()}
                                {this.getDeleteOptions()}
                            </div>
                        </div>
                        <div style={{display:"grid",gridGap:"16px",gridAutoFlow:"column",gridColumnEnd:"span 2",gridTemplateRows:"auto"}}>
                            {this.getUncompleteFinancialMessage()}
                            {this.getArchiveMessage()}
                            {this.getSharedMessage()}
                            {this.getSellingMessage()}
                            {this.getBrokenMessage()}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",placeSelf:"stretch",gridColumnEnd:"span 2",gridGap:"64px"}}>
                            <div style={{display:"flex",flexDirection:"column",justifyContent:"start",placeSelf:"stretch"}}>
                                <Menu size='big' pointing vertical style={{gridColumnStart:"1"}}>
                                    <Menu.Item color="blue" name='Identification' active={this.state.activePanel == 'ident'} onClick={()=>{this.setState({activePanel:"ident"})}} />
                                    <Menu.Item color="blue" active={this.state.activePanel == 'finances'} onClick={()=>{this.setState({activePanel:"finances"})}}>
                                        {(this.state.vehicle.financialInfosComplete ?
                                            <Label color='green'><Icon style={{margin:0}} name="check"/></Label>
                                        :
                                            <Label color='red'><Icon style={{margin:0}} name="cancel"/></Label>
                                        )}
                                        Finances
                                    </Menu.Item>
                                    <Menu.Item color="blue" active={this.state.activePanel == 'obli'} onClick={()=>{this.setState({activePanel:"obli"})}}>
                                        <Label color={(this.state.obli.filter(o=>o.selected).length == 0 ? "grey" : "green")}>{this.state.obli.filter(o=>o.selected).length}</Label>
                                        Contrôles obligatoires
                                    </Menu.Item>
                                    <Menu.Item color="blue" active={this.state.activePanel == 'prev'} onClick={()=>{this.setState({activePanel:"prev"})}}>
                                        <Label color={(this.state.prev.filter(p=>p.selected).length == 0 ? "grey" : "green")}>{this.state.prev.filter(p=>p.selected).length}</Label>
                                        Contrôles préventifs
                                    </Menu.Item>
                                </Menu>
                                <Menu size='big' pointing vertical style={{gridColumnStart:"1"}}>
                                    <Menu.Item color="blue" active={this.state.activePanel == 'entretiens'} onClick={()=>{this.setState({activePanel:"entretiens"})}}><Label color='grey'>{this.state.vehicle.entretiens.length}</Label>Entretiens</Menu.Item>
                                    <Menu.Item color="orange" active={this.state.activePanel == 'accidents'} onClick={()=>{this.setState({activePanel:"accidents"})}}><Label color='grey'>{this.state.vehicle.accidents.length}</Label>Accidents</Menu.Item>
                                    <Menu.Item color="teal" active={this.state.activePanel == 'pannes'} onClick={()=>{this.setState({activePanel:"pannes"})}}><Label color='grey'>{this.state.vehicle.brokenHistory.length}</Label>Historique</Menu.Item>
                                    <Menu.Item color="purple" name='Documents' active={this.state.activePanel == 'docs'} onClick={()=>{this.setState({activePanel:"docs"})}} />
                                    <Menu.Item color="blue" active={this.state.activePanel == 'kms'} onClick={()=>{this.setState({activePanel:"kms"})}}><Label color='grey'>{this.state.vehicle.kms.length}</Label>Relevés kilométrique</Menu.Item>
                                </Menu>
                            </div>
                            <div style={{placeSelf:"stretch",display:"grid",placeSelf:"stretch",gridRowStart:"1",gridColumnStart:"2",paddingRight:"32px",overflowY:"scroll"}}>
                                {this.getActivePanel()}
                            </div>
                        </div>
                    </div>
                    <Modal size='small' closeOnDimmerClick={false} open={this.state.openUpdateKm} onClose={this.closeUpdateKm} closeIcon>
                        <Modal.Header>
                            Mettre à jour le kilométrage du vehicle immatriculé : {this.state.vehicle.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <Form>
                                <Form.Field>
                                    <label>Valeur relevée en Km</label>
                                    <Input icon='dashboard' iconPosition='left' placeholder='Kilométrage...' onChange={this.handleChange} name="newKm"/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Date du relevé</label>
                                    <Input icon='calendar' iconPosition='left' value={this.state.newDateReport} onFocus={()=>{this.showDatePicker("newDateReport")}} onChange={this.handleChange} name="newDateReport"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeUpdateKm}>Annuler</Button>
                            <Button color="blue" onClick={this.updateKm}>Mettre à jour</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='large' closeOnDimmerClick={false} open={this.state.openDocsSold} onClose={this.closeDocsSold} closeIcon>
                        <Modal.Header>
                            Documents relatifs au vehicule vendu immatriculé : {this.state.vehicle.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gridGap:"24px"}}>
                                <FileManagementPanel importLocked={this.state.newCrf == null} handleInputFile={this.handleInputFile} fileTarget="newCrf" uploadDoc={this.uploadDocCrf} fileInfos={this.state.vehicle.crf} title="Cerfa de vente" type="crf"/>
                                <FileManagementPanel importLocked={this.state.newIdA == null} handleInputFile={this.handleInputFile} fileTarget="newIdA" uploadDoc={this.uploadDocIdA} fileInfos={this.state.vehicle.ida} title="Piece d'identité de l'acheteur" type="ida"/>
                                <FileManagementPanel importLocked={this.state.newSCg == null} handleInputFile={this.handleInputFile} fileTarget="newSCg" uploadDoc={this.uploadDocSCg} fileInfos={this.state.vehicle.scg} title="Carte grise" type="scg"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDocsSold}>Fermer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer le vehicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteVehicle}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openShare} onClose={this.closeShare} closeIcon>
                        <Modal.Header>
                            Quelle societé doit opérer le vehicule {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Societé cible</label>
                                    <SocietePicker excludeThis={[this.state.vehicle.societe._id]} groupAppears={false} onChange={this.handleChangeTargetSociete}/>
                                </Form.Field>
                                <Form.Field>
                                    <label>Justification</label>
                                    <TextArea rows={5} onChange={this.handleChange} name="newSharingReason"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeShare}>Annuler</Button>
                            <Button color="teal" disabled={this.state.newTargetSociete.length < 1} onClick={this.shareVehicle}>Prêter</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openUnshare} onClose={this.closeUnshare} closeIcon>
                        <Modal.Header>
                            Rappeler le vehicule {this.state.vehicle.registration} prêté ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeUnshare}>Annuler</Button>
                            <Button color="teal" onClick={this.unshareVehicle}>Rappeler</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDisableControl} onClose={this.closeDisableControl} closeIcon>
                        <Modal.Header>
                            Êtes vous sûr ?
                        </Modal.Header>
                        <Modal.Content>
                            <Message color="red">
                                Attention ! Une occurence est déjà enregistré pour ce contrôle sur ce véhicule.
                                Confirmer provoquera la suppression des informations du dernier controle.
                            </Message>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDisableControl}>Annuler</Button>
                            <Button color="red" onClick={()=>{this.switchControl(false,this.state.controlToDisable,true);this.closeDisableControl();}}>Confirmer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openSell} onClose={this.closeSell} closeIcon>
                        <Modal.Header>
                            Mettre le vehicule {this.state.vehicle.registration} en vente ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Justification</label>
                                    <TextArea rows={5} onChange={this.handleChange} name="newSellingReason"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeSell}>Annuler</Button>
                            <Button color="teal" onClick={this.sellVehicle}>Mettre en vente</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openUnsell} onClose={this.closeUnsell} closeIcon>
                        <Modal.Header>
                            Annuler la vente du vehicule {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeUnsell}>Annuler</Button>
                            <Button color="teal" onClick={this.unsellVehicle}>Annuler la vente</Button>
                            <Button color="orange" onClick={this.finishSellVehicle}>Conclure la vente</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openCancelSell} onClose={this.closeCancelSell} closeIcon>
                        <Modal.Header>
                        Annuler la mise en vente du vehicule {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeCancelSell}>Annuler</Button>
                            <Button color="orange" onClick={this.cancelSellVehicle}>Annuler la vente</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openAddHistoryEntry} onClose={this.closeAddHistoryEntry} closeIcon>
                        <Modal.Header>
                            Ajouter un commentaire dans l'historique du véhicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Commentaire :</label>
                                    <TextArea rows={5} onChange={this.handleChange} name="newHistoryEntryContent"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeAddHistoryEntry}>Annuler</Button>
                            <Button color="blue" onClick={this.addHistoryEntry}>Ajouter le commentaire</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDeleteHistoryEntry} onClose={this.closeDeleteHistoryEntry} closeIcon>
                        <Modal.Header>
                            Supprimer le commentaire de l'historique du véhicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Content>
                            <p>Commentaire : {(this.state.selectedEntry ? this.state.vehicle.brokenHistory.filter(e=>e._id == this.state.selectedEntry)[0].content : "")}</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDeleteHistoryEntry}>Annuler</Button>
                            <Button color="red" onClick={this.deleteHistoryEntry}>Supprimer le commentaire</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openBreak} onClose={this.closeBreak} closeIcon>
                        <Modal.Header>
                            Déclarer le vehicule {this.state.vehicle.registration} en panne ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeBreak}>Annuler</Button>
                            <Button color="teal" onClick={this.breakVehicle}>Déclarer en panne</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openUnbreak} onClose={this.closeUnbreak} closeIcon>
                        <Modal.Header>
                            Résoudre la panne du vehicule {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeUnbreak}>Annuler</Button>
                            <Button color="teal" onClick={this.unbreakVehicle}>Résoudre la panne</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                        <Modal.Header>
                            Archiver le vehicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Justification</label>
                                    <VehicleArchiveJustificationsPicker onChange={this.handleChangeVehicleArchiveJustification}/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeArchive}>Annuler</Button>
                            <Button color="orange" disabled={this.state.newVehicleArchiveJustification == ""} onClick={this.archiveVehicle}>Archiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openUnArchive} onClose={this.closeUnArchive} closeIcon>
                        <Modal.Header>
                            Désarchiver le vehicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeUnArchive}>Annuler</Button>
                            <Button color="green" onClick={this.unArchiveVehicle}>Désarchiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDeleteKm} onClose={this.closeDeleteKm} closeIcon>
                        <Modal.Header>
                            Supprimer le relevé kilométrique du vehicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDeleteKm}>Annuler</Button>
                            <Button color="red" onClick={this.deleteKm}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <ModalDatePicker maxDate={new Date()} onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
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

export default wrappedInUserContext = withRouter(withUserContext(Vehicle));