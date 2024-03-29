/*
import React, { Component, Fragment } from 'react'
import { Loader, Label, Button, Icon, Message, Modal, Input, Form, Menu, Table, List, TextArea, Segment } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';

import BigIconButton from '../elements/BigIconButton';
import { UserContext } from '../../contexts/UserContext';
import RegistrationInput from '../atoms/RegistrationInput';
import ColorPicker from '../atoms/ColorPicker';
import ModelPicker from '../atoms/ModelPicker';
import BrandPicker from '../atoms/BrandPicker';
import FournisseurPicker from '../atoms/FournisseurPicker';
import SocietePicker from '../atoms/SocietePicker';
import VolumePicker from '../atoms/VolumePicker';
import EnergyPicker from '../atoms/EnergyPicker';
import FileManagementPanel from '../atoms/FileManagementPanel';
import ModalDatePicker from '../atoms/ModalDatePicker';

import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

class Location extends Component {
    
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    state={
        activePanel:"ident",
        newCg:null,
        newCv:null,
        newContrat:null,
        newRestitution:null,
        newSociete:"",
        newFournisseur:"",
        newRegistration:"",
        newFirstRegistrationDate:"",
        newBrand:"",
        newModel:"",
        newVolume:0,
        newPayload:0,
        newColor:"",
        newVolume:"",
        newPayload:"",
        newInsurancePaid:"",
        newStartDate:"",
        newEndDate:"",
        newJustification:"",
        newReparation:0,
        newPrice:"",
        newArchiveJustification:"",
        loading:true,
        editingIdent:false,
        editingFinances:false,
        openDatePicker:false,
        openEndOfLocation:false,
        openCancelEndOfLocation:false,
        openArchive:false,
        openUnArchive:false,
        openDelete:false,
        selectedKm:null,
        openDeleteLocKm:false,
        openDocs:false,
        openUpdateLocKm:false,
        datePickerTarget:"",
        newDateReport:new Date().getDate().toString().padStart(2, '0')+"/"+parseInt(new Date().getMonth()+1).toString().padStart(2, '0')+"/"+new Date().getFullYear().toString().padStart(4, '0'),
        _id:this.props.match.params._id,
        newKm:"",
        locationQuery : gql`
            query location($_id:String!){
                location(_id:$_id){
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    fournisseur{
                        _id
                        name
                        phone
                        mail
                        address
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
                    energy{
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
                    startDate
                    endDate
                    price
                    rentalContract
                    reason
                    reparation
                    archived
                    archiveJustification
                    archiveDate
                    returned
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
                    contrat{
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
                    restitution
                    {
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
                    accidents{
                        _id
                        occurenceDate
                        description
                        constatSent
                        archived
                        status
                    }
                }
            }
        `,
        updateLocKmQuery : gql`
            mutation updateLocKm($_id:String!,$date:String!,$kmValue:Int!){
                updateLocKm(_id:$_id,date:$date,kmValue:$kmValue){
                    status
                    message
                }
            }
        `,
        deleteLocKmQuery : gql`
            mutation deleteLocKm($_id:String!,$location:String!){
                deleteLocKm(_id:$_id,location:$location){
                    status
                    message
                }
            }
        `,
        editLocationIdentQuery : gql`
            mutation editLocationIdent($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$brand:String!,$model:String!,$energy:String!,$volume:String!,$payload:Float!,$color:String!){
                editLocationIdent(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,brand:$brand,model:$model,energy:$energy,volume:$volume,payload:$payload,color:$color){
                    status
                    message
                }
            }
        `,
        editLocationFinancesQuery : gql`
            mutation editLocationFinances($_id:String!,$fournisseur:String!,$insurancePaid:Float!,$price:Float!,$startDate:String!,$endDate:String!,$reason:String!){
                editLocationFinances(_id:$_id,fournisseur:$fournisseur,insurancePaid:$insurancePaid,price:$price,startDate:$startDate,endDate:$endDate,reason:$reason){
                    status
                    message
                }
            }
        `,
        deleteLocationQuery : gql`
            mutation deleteLocation($_id:String!){
                deleteLocation(_id:$_id){
                    status
                    message
                }
            }
        `,
        archiveLocationQuery : gql`
            mutation archiveLocation($_id:String!,$archiveJustification:String!){
                archiveLocation(_id:$_id,archiveJustification:$archiveJustification){
                    status
                    message
                }
            }
        `,
        unArchiveLocationQuery : gql`
            mutation unArchiveLocation($_id:String!){
                unArchiveLocation(_id:$_id){
                    status
                    message
                }
            }
        `,
        endOfLocationQuery : gql`
            mutation endOfLocation($_id:String!,$reparation:Float!,$archive:Boolean!){
                endOfLocation(_id:$_id,reparation:$reparation,archive:$archive){
                    status
                    message
                }
            }
        `,
        cancelEndOfLocationQuery : gql`
            mutation cancelEndOfLocation($_id:String!){
                cancelEndOfLocation(_id:$_id){
                    status
                    message
                }
            }
        `,
        uploadLocationDocumentQuery : gql`
            mutation uploadLocationDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadLocationDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
        kmsReport : () => {
            if(this.state.location.kms.length==0){
                return(
                    <Table.Row key={"none"}>
                        <Table.Cell colSpan='3' textAlign="center">
                            Aucun relevé.
                        </Table.Cell>
                    </Table.Row>
                )
            }
            return this.state.location.kms.map((k,i) =>(
                <Table.Row key={k.reportDate+"-"+k.kmValue}>
                    <Table.Cell>{k.reportDate}</Table.Cell>
                    <Table.Cell>{k.kmValue}</Table.Cell>
                    <Table.Cell>
                        {this.state.location.kms.length - 1 == i && this.state.location.kms.length != 1 ? 
                                <Button circular style={{color:"#e74c3c"}} inverted icon icon='cancel' onClick={()=>{this.showDeleteLocKm(k._id)}}/>
                            :
                                ""
                        }
                    </Table.Cell>
                </Table.Row>
            ))
        }
    }

    /*SHOW AND HIDE MODALS*//*
    closeEditIdent = () => {
        this.setState({
            editingIdent:false
        })
    }
    closeEditFinances = () => {
        this.setState({
            editingFinances:false
        })
    }
    editIdent = () => {
        this.setState({
            editingIdent:true,
            editingFinances:false,
            activePanel:"ident"
        })
    }
    editFinances = () => {
        this.setState({
            editingFinances:true,
            editIdent:false,
            activePanel:"finances"
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
    showArchive = () => {
        this.setState({
            openArchive:true
        })
    }
    closeArchive = () => {
        this.setState({
            openArchive:false
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
    showDeleteLocKm = selectedKm => {
        this.setState({
            openDeleteLocKm:true,
            selectedKm:selectedKm
        })
    }
    closeDeleteLocKm = () => {
        this.setState({
            openDeleteLocKm:false,
            selectedKm:null
        })
    }
    showUpdateLocKm = () => {
        this.setState({
            openUpdateLocKm:true
        })
    }
    closeUpdateLocKm = () => {
        this.setState({
            openUpdateLocKm:false
        })
    }
    showCancelEndOfLocation = () => {
        this.setState({
            openCancelEndOfLocation:true
        })
    }
    closeCancelEndOfLocation = () => {
        this.setState({
            openCancelEndOfLocation:false
        })
    }
    showEndOfLocation = () => {
        this.setState({
            openEndOfLocation:true
        })
    }
    closeEndOfLocation = () => {
        this.setState({
            openEndOfLocation:false
        })
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false,newCg:null,newCv:null,newContrat:null,newRestitution:null})
    }
    /*CHANGE HANDLERS*//*
    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    handleChangeFournisseur = (e, { value }) => this.setState({ newFournisseur:value })
    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })
    handleChangeBrand = (e, { value }) => this.setState({ newBrand:value })
    handleChangeModel = (e, { value }) => this.setState({ newModel:value })
    handleChangeEnergy = (e, { value }) => this.setState({ newEnergy:value })
    handleChangeColor = (e, { value }) => this.setState({ newColor:value })
    handleRegistrationChange = value => {
        this.setState({
            newRegistration : value
        })
    }
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

    /*DB READ AND WRITE*//*
    deleteLocation = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteLocationQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteLocation.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/locations")
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    updateLocKm = () => {
        this.props.client.mutate({
            mutation:this.state.updateLocKmQuery,
            variables:{
                _id:this.state._id,
                date:this.state.newDateReport,
                kmValue:parseInt(this.state.newKm)
            }
        }).then(({data})=>{
            data.updateLocKm.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeUpdateLocKm();
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    saveEditIdent = () => {
        this.props.client.mutate({
            mutation:this.state.editLocationIdentQuery,
            variables:{
                _id:this.state._id,
                societe:this.state.newSociete,
                registration:this.state.newRegistration,
                firstRegistrationDate:this.state.newFirstRegistrationDate,
                brand:this.state.newBrand,
                model:this.state.newModel,
                energy:this.state.newEnergy,
                volume:this.state.newVolume,
                payload:parseFloat(this.state.newPayload),
                color:this.state.newColor
            }
        }).then(({data})=>{
            data.editLocationIdent.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditIdent();
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    saveEditFinances = () => {
        this.props.client.mutate({
            mutation:this.state.editLocationFinancesQuery,
            variables:{
                _id:this.state._id,
                fournisseur:this.state.newFournisseur,
                insurancePaid:parseFloat(this.state.newInsurancePaid),
                price:parseFloat(this.state.newPrice),
                startDate:this.state.newStartDate,
                endDate:this.state.newEndDate,
                reason:this.state.newJustification
            }
        }).then(({data})=>{
            data.editLocationFinances.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditFinances();
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    archiveLocation = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveLocationQuery,
            variables:{
                _id:this.state._id,
                archiveJustification:this.state.newArchiveJustification
            }
        }).then(({data})=>{
            data.archiveLocation.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/locations")
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unArchiveLocation = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unArchiveLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unArchiveLocation.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/locations")
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    endLocation = archive => {
        this.props.client.mutate({
            mutation:this.state.endOfLocationQuery,
            variables:{
                _id:this.state._id,
                reparation:parseFloat(this.state.newReparation),
                archive:archive
            }
        }).then(({data})=>{
            data.endOfLocation.map(qrm=>{
                if(qrm.status){
                    this.closeEndOfLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    cancelEndLocation = () => {
        this.props.client.mutate({
            mutation:this.state.cancelEndOfLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.cancelEndOfLocation.map(qrm=>{
                if(qrm.status){
                    this.closeCancelEndOfLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocCg = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newCg,
                type:"cg",
                size:this.state.newCg.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocCv = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newCv,
                type:"cv",
                size:this.state.newCv.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocContrat = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newContrat,
                type:"contrat",
                size:this.state.newContrat.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocRestitution = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newRestitution,
                type:"restitution",
                size:this.state.newRestitution.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteLocKm = () => {
        this.closeDeleteLocKm()
        this.props.client.mutate({
            mutation:this.state.deleteLocKmQuery,
            variables:{
                _id:this.state.selectedKm,
                location:this.state._id
            }
        }).then(({data})=>{
            data.deleteLocKm.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditInfos();
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    loadLocation = () => {
        this.props.client.query({
            query:this.state.locationQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:this.props.match.params._id
            }
        }).then(({data})=>{
            this.setState({
                location:data.location,
                newSociete:data.location.societe._id,
                newRegistration:data.location.registration,
                newFirstRegistrationDate:data.location.firstRegistrationDate,
                newBrand:data.location.brand._id,
                newModel:data.location.model._id,
                newVolume:data.location.volume._id,
                newPayload:data.location.payload,
                newColor:data.location.color._id,
                newInsurancePaid:data.location.insurancePaid,
                newStartDate:data.location.startDate,
                newEndDate:data.location.endDate,
                newJustification:data.location.reason,
                newPrice:data.location.price,
                loading:false
            })
        })
    }

    /*CONTENT GETTERS*//*
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
        let kms = Array.from(this.state.location.kms)
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
                                localDaysRepartition[m+"/"+y] = {month:m +"/"+ y,days:parseInt(currDate.format("D"))};
                            }else{
                                localDaysRepartition[m+"/"+y] = {month:m +"/"+ y,days:localDaysRepartition[m+"/"+y].days + parseInt(currDate.format("D"))};    
                            }
                            daysToAffect = daysToAffect - parseInt(currDate.format("D"));
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
    getStartDateLabel = () => {
        let days= parseInt(moment().diff(moment(this.state.location.startDate,"DD/MM/YYYY"),'days', true))
        if(days < 7){
            return <Label color="orange"> {moment(this.state.location.startDate, "DD/MM/YYYY").fromNow()}, le {this.state.location.startDate}</Label>
        }
        return <Label color="green"> {moment(this.state.location.startDate, "DD/MM/YYYY").fromNow()}, le {this.state.location.startDate}</Label>
    }
    getEndDateLabel = () => {
        let daysLeft = parseInt(moment().diff(moment(this.state.location.endDate,"DD/MM/YYYY"),'days', true))
        if(daysLeft >= 7){
            return <Label color="red"> {moment(this.state.location.endDate, "DD/MM/YYYY").fromNow()}, le {this.state.location.endDate}</Label>
        }
        if(daysLeft >= 7){
            return <Label color="orange"> {moment(this.state.location.endDate, "DD/MM/YYYY").fromNow()}, le {this.state.location.endDate}</Label>
        }
        return <Label color="green"> {moment(this.state.location.endDate, "DD/MM/YYYY").fromNow()}, le {this.state.location.endDate}</Label>
    }
    getActivePanel = () => {
        if(this.state.activePanel == "ident"){
            return this.getIdentPanel()
        }
        if(this.state.activePanel == "finances"){
            return this.getFinancesPanel()
        }
        if(this.state.activePanel == "accidents"){
            return this.getAccidentsPanel()
        }
    }
    getIdentPanel = () => {
        if(this.state.editingIdent){
            return (
                <Segment attached='bottom' style={{padding:"24px"}}>
                    <Form style={{display:"grid",gridTemplateRows:"auto auto auto auto 1fr auto",height:"100%"}} className="formBoard editing">
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Societé</label>
                            <SocietePicker restrictToVisibility defaultValue={this.state.location.societe._id} groupAppears={false} onChange={this.handleChangeSociete}/>
                        </Form.Field>
                        <RegistrationInput onChange={this.handleRegistrationChange} defaultValue={this.state.location.registration} name="newRegistration"/>
                        <Form.Field>
                            <label>1ère immatriculation</label>
                            <Input value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} name="newFirstRegistrationDate"/>
                        </Form.Field>
                        <Form.Field>
                            <label>Marque</label>
                            <BrandPicker defaultValue={this.state.location.brand._id} onChange={this.handleChangeBrand}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Modèle</label>
                            <ModelPicker defaultValue={this.state.location.model._id} onChange={this.handleChangeModel}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Energie</label>
                            <EnergyPicker defaultValue={this.state.location.energy._id} onChange={this.handleChangeEnergy}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Volume</label>
                            <VolumePicker defaultValue={this.state.location.volume._id} onChange={this.handleChangeVolume} name="newVolume"/>
                        </Form.Field>
                        <Form.Field>
                            <label>Charge utile</label>
                            <Input defaultValue={this.state.location.payload} onChange={this.handleChange} name="newPayload"/>
                        </Form.Field>
                        <Form.Field>
                            <label>Couleur</label>
                            <ColorPicker defaultValue={this.state.location.color._id} onChange={this.handleChangeColor}/>
                        </Form.Field>
                        <Button style={{placeSelf:"center stretch"}} color="red" icon labelPosition='right' onClick={this.closeEditIdent}>Annuler<Icon name='cancel'/></Button>
                        <Button style={{placeSelf:"center stretch"}} color="green" icon labelPosition='right' onClick={this.saveEditIdent}>Sauvegarder<Icon name='check'/></Button>
                    </Form>
                </Segment>
            )
        }else{
            return (
                <Segment attached='bottom' style={{padding:"24px"}}>
                    <div className="formBoard displaying">
                        <div className="labelBoard">Societé :</div><div className="valueBoard">{this.state.location.societe.name}</div>
                        <div className="labelBoard">Immatriculation :</div><div className="valueBoard">{this.state.location.registration}</div>
                        <div className="labelBoard">1ère immatriculation :</div><div className="valueBoard">{this.state.location.firstRegistrationDate}</div>
                        <div className="labelBoard">Marque :</div><div className="valueBoard">{this.state.location.brand.name}</div>
                        <div className="labelBoard">Modèle :</div><div className="valueBoard">{this.state.location.model.name}</div>
                        <div className="labelBoard">Energie :</div><div className="valueBoard">{this.state.location.energy.name}</div>
                        <div className="labelBoard">Volume :</div><div className="valueBoard">{this.state.location.volume.meterCube+" m²"}</div>
                        <div className="labelBoard">Charge utile :</div><div className="valueBoard">{this.state.location.payload+" t."}</div>
                        <div className="labelBoard">Couleur :</div><div className="valueBoard">{this.state.location.color.name}</div>
                    </div>
                </Segment>
            )
        }
    }
    getFinancesPanel = () => {
        if(this.state.editingFinances){
            return (
                <Segment attached='bottom'>
                    <Form className="formBoard editing">
                        <Form.Field>
                            <label>Fournisseur</label>
                            <FournisseurPicker defaultValue={this.state.location.fournisseur._id} onChange={this.handleChangeFournisseur}/>
                        </Form.Field>
                        <Form.Field>
                            <label>Date de retrait</label>
                            <Input value={this.state.newStartDate} onFocus={()=>{this.showDatePicker("newStartDate")}} name="newStartDate"/>
                        </Form.Field>
                        <Form.Field>
                            <label>Echéance de la location</label>
                            <Input value={this.state.newEndDate} onChange={this.handleChange} onFocus={()=>{this.showDatePicker("newEndDate")}}  name="newEndDate"/>
                        </Form.Field>
                        <Form.Field style={{placeSelf:"stretch",gridRowEnd:"span 3"}}>
                            <label>Justification de la location</label>
                            <TextArea rows={10} defaultValue={this.state.newJustification} onChange={this.handleChange} name="newJustification"/>
                        </Form.Field>
                        <Form.Field>
                            <label>Prix facturé</label>
                            <Input defaultValue={this.state.location.price} onChange={this.handleChange} name="newPrice"/>
                        </Form.Field>
                        <Form.Field>
                            <label>Assurance</label>
                            <Input defaultValue={this.state.location.insurancePaid} onChange={this.handleChange} name="newInsurancePaid"/>
                        </Form.Field>
                        <Button style={{placeSelf:"center stretch"}} color="red" icon labelPosition='right' onClick={this.closeEditFinances}>Annuler<Icon name='cancel'/></Button>
                        <Button style={{placeSelf:"center stretch"}} color="green" icon labelPosition='right' onClick={this.saveEditFinances}>Sauvegarder<Icon name='check'/></Button>
                    </Form>
                </Segment>
            )
        }else{
            return (
                <Segment attached='bottom'>
                    <div className="formBoard displaying">
                        <div className="labelBoard">Fournisseur :</div><div className="valueBoard">{this.state.location.fournisseur.name}</div>
                        <div className="labelBoard">Début de la location :</div><div className="valueBoard">{this.getStartDateLabel()}</div>
                        <div className="labelBoard">Fin de la location :</div><div className="valueBoard">{this.getEndDateLabel()}</div>
                        <div className="labelBoard">Montant de l'assurance :</div><div className="valueBoard">{this.state.location.insurancePaid} €</div>
                        <div className="labelBoard">Coût de la location :</div><div className="valueBoard">{this.state.location.price} €</div>
                        <div className="labelBoard">Montant des réparations :</div><div className="valueBoard">{this.state.location.reparation} €</div>
                    </div>
                </Segment>
            )
        }
    }
    getAccidentsPanel = () => {
        return(
            <Segment attached='bottom' style={{padding:"24px",justifySelf:"stretch",overflowY:"scroll"}}>
                {this.getAccidentsTable()}
            </Segment>
        )
    }
    getAccidentsTable = () => {
        if(this.state.location.accidents.length == 0){
            return(
                <div style={{display:"block",placeSelf:"stretch"}}>
                    <List divided relaxed>
                        <List.Item>
                            <List.Content>
                                <List.Header>C'est vide !</List.Header>
                                Il n'y a aucun accident lié au véhicule de location
                            </List.Content>
                        </List.Item>
                    </List>
                </div>
            )
        }else{
            return(
                <div style={{display:"block",placeSelf:"stretch"}}>
                    <List divided relaxed>
                        {this.state.location.accidents.map(a=>{
                            return (
                                <List.Item key={a._id}>
                                    <List.Content floated='right'>
                                        <Button color="blue" inverted icon icon='right arrow' onClick={()=>{this.props.history.push("/accident/"+a._id);}}/>
                                    </List.Content>
                                    <List.Content>
                                        <List.Header>{a.occurenceDate}</List.Header>
                                    </List.Content>
                                </List.Item>
                            )
                        })}
                    </List>
                </div>
            )
        }
    }
    getArchivePanel = () => {
        if(this.state.location.archived){
            return (
                <Message color="orange" style={{margin:"0",gridColumnEnd:"span 2"}} icon='archive' header={"Archivé depuis le : " + this.state.location.archiveDate} content={"Justificaion : " + this.state.location.archiveJustification} />
            )
        }
    }
    getDeleteOptions = () => {
        if(this.props.user.isOwner){
            if(this.state.location.archived){
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showUnArchive} icon='share square' tooltip="Désarchiver la location"/>
                        <BigIconButton color="red" onClick={this.showDelete} icon='trash' tooltip="Supprimer la location"/>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showArchive} icon='archive' tooltip="Archiver la location"/>
                        <BigIconButton color="red" onClick={this.showDelete} icon='trash' tooltip="Supprimer la location"/>
                    </Fragment>
                )
            }
        }else{
            if(this.state.location.archived){
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showUnArchive} icon='share square' tooltip="Désarchiver la location"/>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showArchive} icon='archive' tooltip="Archiver la location"/>
                    </Fragment>
                )
            }
        }
    }
    getLocationOptions = () => {
        if(this.state.location.returned){
            return (
                <BigIconButton color="black" icon='sign-in' onClick={this.showCancelEndOfLocation} tooltip="Annuler le retour"/>
            )
        }else{
            return (
                <BigIconButton color="black" icon='sign-out' onClick={this.showEndOfLocation} tooltip="Retour de la location"/>
            )
        }
        
    }

    /*COMPONENTS LIFECYCLE*//*
    componentDidMount = () => {
        this.loadLocation();
    }

    render() {
        if(this.state.loading){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loading)}>Chargement de la location</Loader>
                </div>
            )
        }else{
            return (
                <Fragment>
                    <div style={{display:"grid",gridGap:"24px",gridTemplateRows:"auto auto minmax(0,1fr)",gridTemplateColumns:"2fr 3fr",height:"100%"}}>
                        <div style={{display:"grid",gridColumnEnd:"span 2",gridGap:"32px",gridTemplateColumns:"auto 1fr auto"}}>
                            <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/parc/locations");}} tooltip="Retour au tableau des locations"/>
                            <Message style={{margin:"0",gridRowStart:"1",gridColumnStart:"2"}} icon='truck' header={this.state.location.registration} content={this.state.location.brand.name + " - " + this.state.location.model.name} />
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                                <BigIconButton color="green" icon='dashboard' onClick={this.showUpdateLocKm} tooltip="MaJ kilométrage"/>
                                <BigIconButton color="blue" icon='edit' onClick={this.editIdent} tooltip="Édition : Identification"/>
                                <BigIconButton color="blue" icon='edit' onClick={this.editFinances} tooltip="Édition : Location" spacedFromNext/>
                                {this.getLocationOptions()}
                                <BigIconButton color="purple" icon='folder' onClick={this.showDocs} tooltip="Gérer les documents" spacedFromPrevious/>
                                {this.getDeleteOptions()}
                            </div>
                        </div>
                        <div style={{display:"flex",gridColumnEnd:"span 2"}}>
                            {this.getArchivePanel()}
                        </div>
                        <div style={{display:"grid",gridTemplateRows:"auto auto 1fr",placeSelf:"stretch"}}>
                            <Segment textAlign="center">
                                <p style={{margin:"0",fontWeight:"bold",fontSize:"2.4em"}}>
                                    {this.state.location.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km
                                </p>
                                <p style={{margin:"0",fontWeight:"bold",fontSize:"1.1em"}}>
                                    (relevé {moment(this.state.location.lastKmUpdate, "DD/MM/YYYY").fromNow()})
                                </p>
                            </Segment>
                            <Menu attached='top' pointing>
                                <Menu.Item color="blue" icon='wrench' name='Identification' active={this.state.activePanel == 'ident'} onClick={()=>{this.setState({activePanel:"ident"})}} />
                                <Menu.Item color="green" icon='phone' name='Location' active={this.state.activePanel == 'finances'} onClick={()=>{this.setState({activePanel:"finances"})}} />
                                <Menu.Item color="orange" icon='fire' name='Accidents' active={this.state.activePanel == 'accidents'} onClick={()=>{this.setState({activePanel:"accidents"})}} />
                            </Menu>
                            {this.getActivePanel()}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"256px 1fr",gridTemplateRows:"auto 640px 1fr",gridColumnStart:"2",gridGap:"8px"}}>
                            <Table style={{placeSelf:"start",gridRowEnd:"span 2"}} basic="very">
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
                            <div style={{placeSelf:"stretch"}}>
                                <Bar ref={(reference) => this.chartRef = reference } data={this.getChartData()} height={400} style={{display:"block"}} options={{maintainAspectRatio:false,responsive:true}}/>
                            </div>
                        </div>
                    </div>
                    <Modal size='small' closeOnDimmerClick={false} open={this.state.openUpdateLocKm} onClose={this.closeUpdateLocKm} closeIcon>
                        <Modal.Header>
                            Mettre à jour le kilométrage du location immatriculé : {this.state.location.registration}
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
                            <Button color="black" onClick={this.closeUpdateLocKm}>Annuler</Button>
                            <Button color="blue" onClick={this.updateLocKm}>Mettre à jour</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='large' closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs au vehicule de location immatriculé : {this.state.location.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"24px"}}>
                                <FileManagementPanel importLocked={this.state.newCg == null} handleInputFile={this.handleInputFile} fileTarget="newCg" uploadDoc={this.uploadDocCg} downloadDoc={this.downloadDocCg} fileInfos={this.state.location.cg} title="Carte grise" type="cg"/>
                                <FileManagementPanel importLocked={this.state.newCv == null} handleInputFile={this.handleInputFile} fileTarget="newCv" uploadDoc={this.uploadDocCv} downloadDoc={this.downloadDocCv} fileInfos={this.state.location.cv} title="Carte verte" type="cv"/>
                                <FileManagementPanel importLocked={this.state.newContrat == null} handleInputFile={this.handleInputFile} fileTarget="newContrat" uploadDoc={this.uploadDocContrat} downloadDoc={this.downloadDocContrat} fileInfos={this.state.location.contrat} title="Contrat de location" type="contrat"/>
                                <FileManagementPanel importLocked={this.state.newRestitution == null} handleInputFile={this.handleInputFile} fileTarget="newRestitution" uploadDoc={this.uploadDocRestitution} downloadDoc={this.downloadDocRestitution} fileInfos={this.state.location.restitution} title="Justificatif de restitution" type="restitution"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDocs}>Fermer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer la location : {this.state.location.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteLocation}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDeleteLocKm} onClose={this.closeDeleteLocKm} closeIcon>
                        <Modal.Header>
                            Supprimer le relevé kilométrique de la location : {this.state.location.registration} datant du {/*this.state.location.kms.filter(x=>x._id == this.state.selectedKm)[0].reportDate*//*}?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDeleteLocKm}>Annuler</Button>
                            <Button color="red" onClick={this.deleteLocKm}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                        <Modal.Header>
                            Archiver la location : {this.state.location.registration} ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Justification</label>
                                    <TextArea rows={5} onChange={this.handleChange} name="newArchiveJustification"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeArchive}>Annuler</Button>
                            <Button color="orange" onClick={this.archiveLocation}>Archiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openEndOfLocation} onClose={this.closeEndOfLocation} closeIcon>
                        <Modal.Header>
                            Cloture de la location : {this.state.location.registration}
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Montant des réparations à la réstitution</label>
                                    <Input onChange={this.handleChange} name="newReparation"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeEndOfLocation}>Annuler</Button>
                            <Button color="black" onClick={()=>{this.endLocation(false)}}>Clore sans archiver</Button>
                            <Button color="orange" onClick={()=>{this.endLocation(true)}}>Clore et archiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openCancelEndOfLocation} onClose={this.closeCancelEndOfLocation} closeIcon>
                        <Modal.Header>
                            Annuler le retourn de la location : {this.state.location.registration}
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeCancelEndOfLocation}>Annuler</Button>
                            <Button color="black" onClick={this.cancelEndLocation}>Annuler le retour</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openUnArchive} onClose={this.closeUnArchive} closeIcon>
                        <Modal.Header>
                            Désarchiver la location : {this.state.location.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeUnArchive}>Annuler</Button>
                            <Button color="green" onClick={this.unArchiveLocation}>Désarchiver</Button>
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

export default wrappedInUserContext = withRouter(withUserContext(Location));

*/

































import React, { Component, Fragment } from 'react'
import { Loader, Menu, Button, Icon, Message, Modal, Progress, Input, Form, Table, Label, Segment, Header, TextArea } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';

import BigIconButton from '../elements/BigIconButton';
import FAFree from '../elements/FAFree';

import ModalDatePicker from '../atoms/ModalDatePicker';
import ColorPicker from '../atoms/ColorPicker';
import ModelPicker from '../atoms/ModelPicker';
import BrandPicker from '../atoms/BrandPicker';
import SocietePicker from '../atoms/SocietePicker';
import VolumePicker from '../atoms/VolumePicker';
import EnergyPicker from '../atoms/EnergyPicker';
import RegistrationInput from '../atoms/RegistrationInput';
import LocationArchiveJustificationsPicker from '../atoms/LocationArchiveJustificationsPicker'
import FileManagementPanel from '../atoms/FileManagementPanel';

import { withRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

import moment from 'moment';
import { gql } from 'apollo-server-express';
import _ from 'lodash';

class Location extends Component {
    
    constructor(props) {
        super(props);
        this.chartRef = React.createRef();
    }

    state={
        activePanel:"ident",
        newCg:null,
        newCv:null,
        newContrat:null,
        newRestitution:null,
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
        openDatePicker:false,
        openEndOfLocation:false,
        openCancelEndOfLocation:false,
        openArchive:false,
        openUnArchive:false,
        openDelete:false,
        selectedKm:null,
        openDeleteLocKm:false,
        openDocs:false,
        openUpdateLocKm:false,
        datePickerTarget:"",
        entretiensStatus:[{status:0,label:"En attente",color:"blue"},{status:1,label:"Affecté",color:"blue"},{status:2,label:"Réalisé",color:"green"},{status:3,label:"Clos",color:"grey"}],
        formats:[{triKey:"CPT",label:"Comptant"},{triKey:"CRC",label:"Crédit Classique"},{triKey:"CRB",label:"Crédit Bail"}],
        newDateReport:new Date().getDate().toString().padStart(2, '0')+"/"+parseInt(new Date().getMonth()+1).toString().padStart(2, '0')+"/"+new Date().getFullYear().toString().padStart(4, '0'),
        _id:this.props.match.params._id,
        newKm:"",
        locationQuery : gql`
            query location($_id:String!){
                location(_id:$_id){
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    fournisseur{
                        _id
                        name
                        phone
                        mail
                        address
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
                    energy{
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
                    startDate
                    endDate
                    price
                    rentalContract
                    reason
                    reparation
                    archived
                    archiveJustification{
                        _id
                        justification
                    }
                    archiveDate
                    returned
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
                    contrat{
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
                    restitution
                    {
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
                    accidents{
                        _id
                        occurenceDate
                        description
                        constatSent
                        archived
                        status
                    }
                }
            }
        `,
        updateLocKmQuery : gql`
            mutation updateLocKm($_id:String!,$date:String!,$kmValue:Int!){
                updateLocKm(_id:$_id,date:$date,kmValue:$kmValue){
                    status
                    message
                }
            }
        `,
        deleteLocKmQuery : gql`
            mutation deleteLocKm($_id:String!,$location:String!){
                deleteLocKm(_id:$_id,location:$location){
                    status
                    message
                }
            }
        `,
        editLocationIdentQuery : gql`
            mutation editLocationIdent($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$brand:String!,$model:String!,$energy:String!,$volume:String!,$payload:Float!,$color:String!){
                editLocationIdent(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,brand:$brand,model:$model,energy:$energy,volume:$volume,payload:$payload,color:$color){
                    status
                    message
                }
            }
        `,
        editLocationFinancesQuery : gql`
            mutation editLocationFinances($_id:String!,$fournisseur:String!,$insurancePaid:Float!,$price:Float!,$startDate:String!,$endDate:String!,$reason:String!){
                editLocationFinances(_id:$_id,fournisseur:$fournisseur,insurancePaid:$insurancePaid,price:$price,startDate:$startDate,endDate:$endDate,reason:$reason){
                    status
                    message
                }
            }
        `,
        deleteLocationQuery : gql`
            mutation deleteLocation($_id:String!){
                deleteLocation(_id:$_id){
                    status
                    message
                }
            }
        `,
        archiveLocationQuery : gql`
            mutation archiveLocation($_id:String!,$archiveJustification:String!){
                archiveLocation(_id:$_id,archiveJustification:$archiveJustification){
                    status
                    message
                }
            }
        `,
        unArchiveLocationQuery : gql`
            mutation unArchiveLocation($_id:String!){
                unArchiveLocation(_id:$_id){
                    status
                    message
                }
            }
        `,
        endOfLocationQuery : gql`
            mutation endOfLocation($_id:String!,$reparation:Float!,$archive:Boolean!){
                endOfLocation(_id:$_id,reparation:$reparation,archive:$archive){
                    status
                    message
                }
            }
        `,
        cancelEndOfLocationQuery : gql`
            mutation cancelEndOfLocation($_id:String!){
                cancelEndOfLocation(_id:$_id){
                    status
                    message
                }
            }
        `,
        uploadLocationDocumentQuery : gql`
            mutation uploadLocationDocument($_id: String!,$file: Upload!,$type: String!,$size: Int!) {
                uploadLocationDocument(_id:$_id,file:$file,type:$type,size:$size) {
                    status
                    message
                }
            }
        `,
        kmsReport : () => {
            if(this.state.location.kms.length==0){
                return(
                    <Table.Row key={"none"}>
                        <Table.Cell colSpan='3' textAlign="center">
                            Aucun relevé.
                        </Table.Cell>
                    </Table.Row>
                )
            }
            return this.state.location.kms.map((k,i) =>(
                <Table.Row key={k.reportDate+"-"+k.kmValue}>
                    <Table.Cell>{k.reportDate}</Table.Cell>
                    <Table.Cell>{k.kmValue}</Table.Cell>
                    <Table.Cell>
                        {this.state.location.kms.length - 1 == i && this.state.location.kms.length != 1 ? 
                                <Button circular style={{color:"#e74c3c"}} inverted icon icon='cancel' onClick={()=>{this.showDeleteKm(k._id)}}/>
                            :
                                ""
                        }
                    </Table.Cell>
                </Table.Row>
            ))
        }
    }

    /*SHOW AND HIDE MODALS*/
    
    editIdent = () => {
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
    showDeleteLocKm = selectedKm => {
        this.setState({
            openDeleteLocKm:true,
            selectedKm:selectedKm
        })
    }
    closeDeleteLocKm = () => {
        this.setState({
            openDeleteLocKm:false,
            selectedKm:null
        })
    }
    showUpdateLocKm = () => {
        this.setState({
            openUpdateLocKm:true
        })
    }
    closeUpdateLocKm = () => {
        this.setState({
            openUpdateLocKm:false
        })
    }
    showCancelEndOfLocation = () => {
        this.setState({
            openCancelEndOfLocation:true
        })
    }
    closeCancelEndOfLocation = () => {
        this.setState({
            openCancelEndOfLocation:false
        })
    }
    showEndOfLocation = () => {
        this.setState({
            openEndOfLocation:true
        })
    }
    closeEndOfLocation = () => {
        this.setState({
            openEndOfLocation:false
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
    showArchive = () => {
        this.setState({
            openArchive:true
        })
    }
    closeArchive = () => {
        this.setState({
            openArchive:false,
            newLocationArchiveJustification:""
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
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false,newCg:null,newCv:null})
    }
    /*CHANGE HANDLERS*/
    handleChange = e =>{this.setState({[e.target.name]:e.target.value});}
    handleRegistrationChange = value => {this.setState({newRegistration : value})}
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })
    handleChangeBrand = (e, { value }) => this.setState({ newBrand:value })
    handleChangeModel = (e, { value }) => this.setState({ newModel:value })
    handleChangeLocationArchiveJustification = (e, { value }) => this.setState({ newLocationArchiveJustification:value })
    handleChangeEnergy = (e, { value }) => this.setState({ newEnergy:value })
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
    archiveLocation = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveLocationQuery,
            variables:{
                _id:this.state._id,
                archiveJustification:this.state.newArchiveJustification
            }
        }).then(({data})=>{
            data.archiveLocation.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/locations")
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unArchiveLocation = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unArchiveLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unArchiveLocation.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/locations")
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    endLocation = archive => {
        this.props.client.mutate({
            mutation:this.state.endOfLocationQuery,
            variables:{
                _id:this.state._id,
                reparation:parseFloat(this.state.newReparation),
                archive:archive
            }
        }).then(({data})=>{
            data.endOfLocation.map(qrm=>{
                if(qrm.status){
                    this.closeEndOfLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    cancelEndLocation = () => {
        this.props.client.mutate({
            mutation:this.state.cancelEndOfLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.cancelEndOfLocation.map(qrm=>{
                if(qrm.status){
                    this.closeCancelEndOfLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocCg = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newCg,
                type:"cg",
                size:this.state.newCg.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocCv = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newCv,
                type:"cv",
                size:this.state.newCv.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocContrat = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newContrat,
                type:"contrat",
                size:this.state.newContrat.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    uploadDocRestitution = () => {
        this.props.client.mutate({
            mutation:this.state.uploadLocationDocumentQuery,
            variables:{
                _id:this.state.location._id,
                file:this.state.newRestitution,
                type:"restitution",
                size:this.state.newRestitution.size
            }
        }).then(({data})=>{
            data.uploadLocationDocument.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadLocation();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    loadLocation = () => {
        this.props.client.query({
            query:this.state.locationQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:this.props.match.params._id
            }
        }).then(({data})=>{
            this.setState({
                location:data.location,
                newSociete:data.location.societe._id,
                newRegistration:data.location.registration,
                newFirstRegistrationDate:data.location.firstRegistrationDate,
                newBrand:data.location.brand._id,
                newModel:data.location.model._id,
                newVolume:data.location.volume._id,
                newPayload:data.location.payload,
                newColor:data.location.color._id,
                newInsurancePaid:data.location.insurancePaid,
                newStartDate:data.location.startDate,
                newEndDate:data.location.endDate,
                newJustification:data.location.reason,
                newPrice:data.location.price,
                loading:false
            })
        })
    }
    deleteLocation = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteLocationQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            data.deleteLocation.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/locations")
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    archiveLocation = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.archiveLocationQuery,
            variables:{
                _id:this.state._id,
                archiveJustification:this.state.newLocationArchiveJustification
            }
        }).then(({data})=>{
            data.archiveLocation.map(qrm=>{
                if(qrm.status){
                    this.closeArchive();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unArchiveLocation = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unArchiveLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unArchiveLocation.map(qrm=>{
                if(qrm.status){
                    this.closeUnArchive();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    shareLocation = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.shareLocationQuery,
            variables:{
                _id:this.state._id,
                sharingReason:this.state.newSharingReason,
                target:this.state.newTargetSociete
            }
        }).then(({data})=>{
            data.shareLocation.map(qrm=>{
                if(qrm.status){
                    this.closeShare();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unshareLocation = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unshareLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unshareLocation.map(qrm=>{
                if(qrm.status){
                    this.closeUnshare();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    sellLocation = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.sellLocationQuery,
            variables:{
                _id:this.state._id,
                sellingReason:this.state.newSellingReason
            }
        }).then(({data})=>{
            data.sellLocation.map(qrm=>{
                if(qrm.status){
                    this.closeSell();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unsellLocation = () => {
        this.props.client.mutate({
            mutation:this.state.unsellLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unsellLocation.map(qrm=>{
                if(qrm.status){
                    this.closeUnsell();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    cancelSellLocation = () => {
        this.props.client.mutate({
            mutation:this.state.cancelSellLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.cancelSellLocation.map(qrm=>{
                if(qrm.status){
                    this.closeCancelSell();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    finishSellLocation = () => {
        this.props.client.mutate({
            mutation:this.state.finishSellLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.finishSellLocation.map(qrm=>{
                if(qrm.status){
                    this.closeUnsell();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    breakLocation = () => {
        this.closeArchive();
        this.props.client.mutate({
            mutation:this.state.breakLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.breakLocation.map(qrm=>{
                if(qrm.status){
                    this.closeBreak();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    unbreakLocation = () => {
        this.closeUnArchive();
        this.props.client.mutate({
            mutation:this.state.unbreakLocationQuery,
            variables:{
                _id:this.state._id
            }
        }).then(({data})=>{
            data.unbreakLocation.map(qrm=>{
                if(qrm.status){
                    this.closeUnbreak();
                    this.loadLocation();
                    this.props.toast({message:qrm.message,type:"success"});
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    updateLocKm = () => {
        this.props.client.mutate({
            mutation:this.state.updateLocKmQuery,
            variables:{
                _id:this.state._id,
                date:this.state.newDateReport,
                kmValue:parseInt(this.state.newKm)
            }
        }).then(({data})=>{
            data.updateLocKm.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeUpdateLocKm();
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteLocKm = () => {
        this.closeDeleteLocKm()
        this.props.client.mutate({
            mutation:this.state.deleteLocKmQuery,
            variables:{
                _id:this.state.selectedKm,
                location:this.state._id
            }
        }).then(({data})=>{
            data.deleteLocKm.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditInfos();
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    saveEditIdent = () => {
        this.props.client.mutate({
            mutation:this.state.editLocationIdentQuery,
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
            data.editLocationIdent.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditIdent();
                    this.loadLocation();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    /*CONTENT GETTERS*/
    getPayementProgress = () => {
        let totalMonths = parseInt(moment(this.state.location.payementEndDate,"DD/MM/YYYY").diff(moment(this.state.location.payementBeginDate,"DD/MM/YYYY"),'months', true));
        let monthsDone = parseInt(moment().diff(moment(this.state.location.payementBeginDate,"DD/MM/YYYY"),'months', true));
        if(monthsDone>totalMonths){monthsDone=totalMonths}
        let monthsLeft = totalMonths - monthsDone;
        let value = parseInt(this.state.location.monthlyPayement * monthsDone)
        
        if(this.state.location.payementFormat == "CRB"){
            if(parseInt(monthsLeft) == 0){
                return <Progress style={{margin:"64px"}} size="large" active color="green" value={value} total={this.state.location.purchasePrice} label="Propriété, payement terminé"/>    
            }
            return <Progress style={{margin:"64px"}} size="large" active color="orange" value={value} total={this.state.location.purchasePrice} label={value + " / " + this.state.location.purchasePrice + " : " + monthsLeft + " mois restant avant propriété"} />
        }else{
            if(parseInt(monthsLeft) == 0){
                return <Progress style={{margin:"64px"}} size="large" active color="green" value={value} total={this.state.location.purchasePrice} label="Propriété, payement terminé"/>    
            }
            return <Progress style={{margin:"64px"}} size="large" active color="green" value={value} total={this.state.location.purchasePrice} label={value + " / " + this.state.location.purchasePrice + " : propriété, fin de payement prévue dans "+parseInt(monthsLeft)+" mois."} />
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
        let kms = Array.from(this.state.location.kms)
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
            if(this.state.location.archived){
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showUnArchive} icon='share square' tooltip="Désarchiver la location"/>
                        <BigIconButton color="red" onClick={this.showDelete} icon='trash' tooltip="Supprimer la location"/>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showArchive} icon='archive' tooltip="Archiver la location"/>
                        <BigIconButton color="red" onClick={this.showDelete} icon='trash' tooltip="Supprimer la location"/>
                    </Fragment>
                )
            }
        }else{
            if(this.state.location.archived){
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showUnArchive} icon='share square' tooltip="Désarchiver la location"/>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <BigIconButton color="orange" onClick={this.showArchive} icon='archive' tooltip="Archiver la location"/>
                    </Fragment>
                )
            }
        }
    }
    getLocationOptions = () => {
        if(this.state.location.returned){
            return (
                <BigIconButton color="black" icon='sign-in' onClick={this.showCancelEndOfLocation} tooltip="Annuler le retour"/>
            )
        }else{
            return (
                <BigIconButton color="black" icon='sign-out' onClick={this.showEndOfLocation} tooltip="Retour de la location"/>
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
                            <SocietePicker restrictToVisibility defaultValue={this.state.location.societe._id} groupAppears={false} onChange={this.handleChangeSociete}/>
                        </Form.Field>
                        <RegistrationInput onChange={this.handleRegistrationChange} defaultValue={this.state.location.registration} name="newRegistration"/>
                        <Form.Field><label>1ère immatriculation</label>
                            <Input defaultValue={this.state.location.firstRegistrationDate} onChange={this.handleChange} name="newFirstRegistrationDate"/>
                        </Form.Field>
                        <Form.Field><label>Énergie</label>
                            <EnergyPicker defaultValue={this.state.location.energy._id} onChange={this.handleChangeEnergy}/>
                        </Form.Field>
                        <Form.Field><label>Marque</label>
                            <BrandPicker defaultValue={this.state.location.brand._id} onChange={this.handleChangeBrand}/>
                        </Form.Field>
                        <Form.Field><label>Modèle</label>
                            <ModelPicker defaultValue={this.state.location.model._id} onChange={this.handleChangeModel}/>
                        </Form.Field>
                        <Form.Field><label>Volume</label>
                            <VolumePicker defaultValue={this.state.location.volume._id} onChange={this.handleChangeVolume}/>
                        </Form.Field>
                        <Form.Field><label>Charge utile</label>
                            <Input defaultValue={this.state.location.payload} onChange={this.handleChange} name="newPayload"/>
                        </Form.Field>
                        <Form.Field><label>Couleur</label>
                            <ColorPicker defaultValue={this.state.location.color._id} onChange={this.handleChangeColor}/>
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
                        <div className="labelBoard">Propriétaire :</div><div className="valueBoard">{this.state.location.societe.name}</div>
                        <div className="labelBoard">Immatriculation :</div><div className="valueBoard">{this.state.location.registration}</div>
                        <div className="labelBoard">1ère immatriculation :</div><div className="valueBoard">{this.state.location.firstRegistrationDate}</div>
                        <div className="labelBoard">Énergie :</div><div className="valueBoard">{this.state.location.energy.name}</div>
                        <div className="labelBoard">Marque :</div><div className="valueBoard">{this.state.location.brand.name}</div>
                        <div className="labelBoard">Modèle :</div><div className="valueBoard">{this.state.location.model.name}</div>
                        <div className="labelBoard">Volume :</div><div className="valueBoard">{this.state.location.volume.meterCube+" m²"}</div>
                        <div className="labelBoard">Charge utile :</div><div className="valueBoard">{this.state.location.payload+" kg"}</div>
                        <div className="labelBoard">Couleur :</div><div className="valueBoard">{this.state.location.color.name}</div>
                    </div>
                </Segment>
            )
        }
    }
    getAccidentsPanel = () => {
        if(this.state.location.accidents.length == 0){
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    <Segment style={{display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr"}}>
                        <Header style={{margin:"48px",placeSelf:"center"}} as='h2'>Il n'y aucun accident pour ce véhicule de location</Header>
                    </Segment>
                </div>
            )
        }else{
            return(
                <div style={{display:"flex",flexDirection:"column",placeSelf:"stretch"}}>
                    {this.state.location.accidents.map(a=>{
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
            <div attached="right" style={{padding:"auto",justifySelf:"stretch",display:"grid",gridTemplateColumns:"1fr 1fr",gridTemplateRows:"auto auto 1fr",gridGap:"24px"}}>
                <FileManagementPanel importLocked={this.state.newCg == null} handleInputFile={this.handleInputFile} fileTarget="newCg" uploadDoc={this.uploadDocCg} downloadDoc={this.downloadDocCg} fileInfos={this.state.location.cg} title="Carte grise" type="cg"/>
                <FileManagementPanel importLocked={this.state.newCv == null} handleInputFile={this.handleInputFile} fileTarget="newCv" uploadDoc={this.uploadDocCv} downloadDoc={this.downloadDocCv} fileInfos={this.state.location.cv} title="Carte verte" type="cv"/>
                <FileManagementPanel importLocked={this.state.newContrat == null} handleInputFile={this.handleInputFile} fileTarget="newContrat" uploadDoc={this.uploadDocContrat} downloadDoc={this.downloadDocContrat} fileInfos={this.state.location.contrat} title="Contrat de location" type="contrat"/>
                <FileManagementPanel importLocked={this.state.newRestitution == null} handleInputFile={this.handleInputFile} fileTarget="newRestitution" uploadDoc={this.uploadDocRestitution} downloadDoc={this.downloadDocRestitution} fileInfos={this.state.location.restitution} title="Justificatif de restitution" type="restitution"/>
            </div>
        )
    }

    //MESSAGE
    getArchiveMessage = () => {
        if(this.state.location.archived){
            let justification = this.state.location.archiveJustification.justification
            if(justification == null){
                justification = "Aucune justification"
            }
            return (
                <Message color="orange" style={{margin:"0"}} icon='archive' header={"Archivé depuis le : " + this.state.location.archiveDate} content={"Justificaion : " + justification} />
            )
        }
    }
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadLocation();
    }

    render() {
        if(this.state.loading){
            return (
                <div>
                    <Loader size='massive' active={(this.state.loading)}>Chargement du véhicule de location</Loader>
                </div>
            )
        }else{
            return (
                <Fragment>
                    <div style={{display:"grid",gridGap:"24px",gridTemplateRows:"auto auto minmax(0,1fr)",gridTemplateColumns:"2fr 2fr",height:"100%"}}>
                        <div style={{display:"grid",gridColumnEnd:"span 2",gridGap:"32px",gridTemplateColumns:"auto 1fr auto auto"}}>
                            <BigIconButton icon="angle double left" color="black" onClick={()=>{this.props.history.push("/parc/locations");}} tooltip="Retour au tableau des véhicules"/>
                            <Message style={{margin:"0"}} icon='truck' header={this.state.location.registration} content={this.state.location.brand.name + " - " + this.state.location.model.name} />
                            <Message style={{margin:"0"}} header={this.state.location.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + "km"} content={"relevé " + moment(this.state.location.lastKmUpdate, "DD/MM/YYYY").fromNow()} />
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                                <BigIconButton color="green" icon='dashboard' onClick={this.showUpdateLocKm} tooltip="MaJ kilométrage"/>
                                <BigIconButton color="blue" icon='edit' onClick={this.editIdent} tooltip="Édition : Identification" spacedFromNext/>
                                {this.getLocationOptions()}
                                <BigIconButton color="purple" icon='folder' onClick={()=>{this.setState({activePanel:"docs"})}} tooltip="Gérer les documents" spacedFromPrevious/>
                                {this.getDeleteOptions()}
                            </div>
                        </div>
                        <div style={{display:"grid",gridGap:"16px",gridAutoFlow:"column",gridColumnEnd:"span 2",gridTemplateRows:"auto"}}>
                            {this.getArchiveMessage()}
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"auto 1fr",placeSelf:"stretch",gridColumnEnd:"span 2",gridGap:"64px"}}>
                            <div style={{display:"flex",flexDirection:"column",justifyContent:"start",placeSelf:"stretch"}}>
                                <Menu size='big' pointing vertical style={{gridColumnStart:"1"}}>
                                    <Menu.Item color="blue" name='Identification' active={this.state.activePanel == 'ident'} onClick={()=>{this.setState({activePanel:"ident"})}} />
                                </Menu>
                                <Menu size='big' pointing vertical style={{gridColumnStart:"1"}}>
                                    <Menu.Item color="orange" active={this.state.activePanel == 'accidents'} onClick={()=>{this.setState({activePanel:"accidents"})}}><Label color='grey'>{this.state.location.accidents.length}</Label>Accidents</Menu.Item>
                                    <Menu.Item color="purple" name='Documents' active={this.state.activePanel == 'docs'} onClick={()=>{this.setState({activePanel:"docs"})}} />
                                    <Menu.Item color="blue" active={this.state.activePanel == 'kms'} onClick={()=>{this.setState({activePanel:"kms"})}}><Label color='grey'>{this.state.location.kms.length}</Label>Relevés kilométrique</Menu.Item>
                                </Menu>
                            </div>
                            <div style={{placeSelf:"stretch",display:"grid",placeSelf:"stretch",gridRowStart:"1",gridColumnStart:"2"}}>
                                {this.getActivePanel()}
                            </div>
                        </div>
                    </div>
                    <Modal size='small' closeOnDimmerClick={false} open={this.state.openUpdateLocKm} onClose={this.closeUpdateLocKm} closeIcon>
                        <Modal.Header>
                            Mettre à jour le kilométrage du location immatriculé : {this.state.location.registration}
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
                            <Button color="black" onClick={this.closeUpdateLocKm}>Annuler</Button>
                            <Button color="blue" onClick={this.updateLocKm}>Mettre à jour</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='large' closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs au vehicule de location immatriculé : {this.state.location.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"24px"}}>
                                <FileManagementPanel importLocked={this.state.newCg == null} handleInputFile={this.handleInputFile} fileTarget="newCg" uploadDoc={this.uploadDocCg} downloadDoc={this.downloadDocCg} fileInfos={this.state.location.cg} title="Carte grise" type="cg"/>
                                <FileManagementPanel importLocked={this.state.newCv == null} handleInputFile={this.handleInputFile} fileTarget="newCv" uploadDoc={this.uploadDocCv} downloadDoc={this.downloadDocCv} fileInfos={this.state.location.cv} title="Carte verte" type="cv"/>
                                <FileManagementPanel importLocked={this.state.newContrat == null} handleInputFile={this.handleInputFile} fileTarget="newContrat" uploadDoc={this.uploadDocContrat} downloadDoc={this.downloadDocContrat} fileInfos={this.state.location.contrat} title="Contrat de location" type="contrat"/>
                                <FileManagementPanel importLocked={this.state.newRestitution == null} handleInputFile={this.handleInputFile} fileTarget="newRestitution" uploadDoc={this.uploadDocRestitution} downloadDoc={this.downloadDocRestitution} fileInfos={this.state.location.restitution} title="Justificatif de restitution" type="restitution"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDocs}>Fermer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer la location : {this.state.location.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteLocation}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDeleteLocKm} onClose={this.closeDeleteLocKm} closeIcon>
                        <Modal.Header>
                            Supprimer le relevé kilométrique de la location : {this.state.location.registration} datant du {/*this.state.location.kms.filter(x=>x._id == this.state.selectedKm)[0].reportDate*/}?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDeleteLocKm}>Annuler</Button>
                            <Button color="red" onClick={this.deleteLocKm}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                        <Modal.Header>
                            Archiver la location : {this.state.location.registration} ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Justification</label>
                                    <LocationArchiveJustificationsPicker onChange={this.handleChangeLocationArchiveJustification}/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeArchive}>Annuler</Button>
                            <Button color="orange" onClick={this.archiveLocation}>Archiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openEndOfLocation} onClose={this.closeEndOfLocation} closeIcon>
                        <Modal.Header>
                            Cloture de la location : {this.state.location.registration}
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Montant des réparations à la réstitution</label>
                                    <Input onChange={this.handleChange} name="newReparation"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeEndOfLocation}>Annuler</Button>
                            <Button color="black" onClick={()=>{this.endLocation(false)}}>Clore sans archiver</Button>
                            <Button color="orange" onClick={()=>{this.endLocation(true)}}>Clore et archiver</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openCancelEndOfLocation} onClose={this.closeCancelEndOfLocation} closeIcon>
                        <Modal.Header>
                            Annuler le retourn de la location : {this.state.location.registration}
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeCancelEndOfLocation}>Annuler</Button>
                            <Button color="black" onClick={this.cancelEndLocation}>Annuler le retour</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openUnArchive} onClose={this.closeUnArchive} closeIcon>
                        <Modal.Header>
                            Désarchiver la location : {this.state.location.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeUnArchive}>Annuler</Button>
                            <Button color="green" onClick={this.unArchiveLocation}>Désarchiver</Button>
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

export default wrappedInUserContext = withRouter(withUserContext(Location));