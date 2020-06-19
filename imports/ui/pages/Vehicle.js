import React, { Component, Fragment } from 'react'
import { Loader, Menu, Button, Icon, Message, Modal, Progress, Input, Form, Table, TextArea, Segment } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
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
import FileManagementPanel from '../atoms/FileManagementPanel';
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
        activePanel:"tech",
        newCg:null,
        newCv:null,
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
        newArchiveReason:"",
        newSharingReason:"",
        newProperty:null,
        loading:true,
        editingTech:false,
        editingFinances:false,
        openDatePicker:false,
        openUnArchive:false,
        openDelete:false,
        openShare:false,
        openUnshare:false,
        selectedKm:null,
        openDeleteKm:false,
        openDocs:false,
        openUpdateKm:false,
        openArchive:false,
        datePickerTarget:"",
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
                    archiveReason
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
                    shared
                    sharedTo{
                        _id
                        name
                    }
                    sharedSince
                    sharingReason
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
        editVehicleTechQuery : gql`
            mutation editVehicleTech($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$energy:String!){
                editVehicleTech(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,energy:$energy){
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
            mutation archiveVehicle($_id:String!,$archiveReason:String!){
                archiveVehicle(_id:$_id,archiveReason:$archiveReason){
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
        }
    }

    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    handleRegistrationChange = value => {
        this.setState({
            newRegistration : value
        })
    }

    handleChangePayementFormat = value => {
        this.setState({ newPayementFormat:value })
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

    handleChangeTargetSociete = (e, { value }) => {
        this.setState({ newTargetSociete:value })
    }

    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })

    handleChangeBrand = (e, { value }) => this.setState({ newBrand:value })

    handleChangeModel = (e, { value }) => this.setState({ newModel:value })
    
    handleChangeEnergy = (e, { value }) => this.setState({ newEnergy:value })
  
    handleChangeOrganism = (e, { value }) => this.setState({ newPayementOrg:value })
    
    handleChangePayementTime = (e, { value }) => {
        this.setState({
            newPayementTime:value
        })
    }

    handleChangeTotalPrice = (e, { value }) =>{
        this.setState({
            newPurchasePrice:parseFloat(value)
        })
    }

    handleChangeMonthlyPayement = (e, { value }) =>{
        this.setState({
            newMonthlyPayement:parseFloat(value)
        })
    }
  
    handleChangeColor = (e, { value }) => this.setState({ newColor:value })

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
                archiveReason:this.state.newArchiveReason
            }
        }).then(({data})=>{
            data.archiveVehicle.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/vehicles")
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
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.history.push("/parc/vehicles")
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
                    this.loadVehicule();
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
                    this.loadVehicule();
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
                    this.loadVehicule();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    saveEditTech = () => {
        this.props.client.mutate({
            mutation:this.state.editVehicleTechQuery,
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
            data.editVehicleTech.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.closeEditTech();
                    this.loadVehicule();
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
                    this.loadVehicule();
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
                    this.loadVehicule();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
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
    
    handleInputFile = (type,e) => {
        if(e.target.validity.valid ){
            this.setState({
                [type]:e.target.files[0]
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
                    this.loadVehicule();
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
                    this.loadVehicule();
                    this.closeDocs();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    showEditTech = () => {
        this.setState({
            editingTech:true,
            activePanel:"tech",
            editingFinances:false
        })
    }

    closeEditTech = () => {
        this.setState({
            editingTech:false
        })
    }

    showEditFinances = () => {
        this.setState({
            editingFinances:true,
            activePanel:"finances",
            editingTech:false
        })
    }

    closeEditFinances = () => {
        this.setState({
            editingFinances:false
        })
    }

    loadVehicule = () => {
        this.props.client.query({
            query:this.state.vehicleQuery,
            fetchPolicy:"network-only",
            variables:{
                _id:this.props.match.params._id
            }
        }).then(({data})=>{
            this.setState({
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

    getPayementProgress = () => {
        let totalMonths = parseInt(moment(this.state.vehicle.payementEndDate,"DD/MM/YYYY").diff(moment(this.state.vehicle.payementBeginDate,"DD/MM/YYYY"),'months', true));
        console.log(totalMonths)
        let monthsDone = parseInt(moment().diff(moment(this.state.vehicle.payementBeginDate,"DD/MM/YYYY"),'months', true));
        if(monthsDone>totalMonths){monthsDone=totalMonths}
        let monthsLeft = totalMonths - monthsDone;
        let value = parseInt(this.state.vehicle.monthlyPayement * monthsDone)
        
        if(this.state.vehicle.payementFormat == "CRB"){
            if(parseInt(monthsLeft) == 0){
                return <Progress active color="green" value={value} total={this.state.vehicle.purchasePrice} label="Propriété, payement terminé"/>    
            }
            return <Progress active color="orange" value={value} total={this.state.vehicle.purchasePrice} label={value + " / " + this.state.vehicle.purchasePrice + " : " + monthsLeft + " mois restant avant propriété"} />
        }else{
            if(parseInt(monthsLeft) == 0){
                return <Progress active color="green" value={value} total={this.state.vehicle.purchasePrice} label="Propriété, payement terminé"/>    
            }
            return <Progress active color="green" value={value} total={this.state.vehicle.purchasePrice} label={value + " / " + this.state.vehicle.purchasePrice + " : propriété, fin de payement prévue dans "+parseInt(monthsLeft)+" mois."} />
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
                        <Button color="orange" style={{placeSelf:"stretch"}} onClick={this.showUnArchive} icon labelPosition='right'>Désarchiver le vehicule<Icon name='share square'/></Button>
                        <Button color="red" style={{placeSelf:"stretch"}} onClick={this.showDelete} icon labelPosition='right'>Supprimer le vehicule<Icon name='trash'/></Button>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <Button color="orange" style={{placeSelf:"stretch"}} onClick={this.showArchive} icon labelPosition='right'>Archiver le vehicule<Icon name='archive'/></Button>
                        <Button color="red" style={{placeSelf:"stretch"}} onClick={this.showDelete} icon labelPosition='right'>Supprimer le vehicule<Icon name='trash'/></Button>
                    </Fragment>
                )
            }
        }else{
            if(this.state.vehicle.archived){
                return(
                    <Fragment>
                        <Button color="orange" style={{placeSelf:"stretch",gridColumnEnd:"span 2"}} onClick={this.showUnArchive} icon labelPosition='right'>Désarchiver le vehicule<Icon name='share square'/></Button>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <Button color="orange" style={{placeSelf:"stretch",gridColumnEnd:"span 2"}} onClick={this.showArchive} icon labelPosition='right'>Archiver le vehicule<Icon name='archive'/></Button>
                    </Fragment>
                )
            }
        }
    }

    getDocsAndShareOptions = () => {
        if(this.props.user.isOwner){
            if(this.state.vehicle.shared){
                return(
                    <Fragment>
                        <Button color="purple" style={{placeSelf:"stretch"}} onClick={this.showDocs} icon labelPosition='right'>Gérer les documents<Icon name='folder open'/></Button>
                        <Button color="teal" style={{placeSelf:"stretch"}} onClick={this.showUnshare} icon labelPosition='right'>Rappeler le vehicule<Icon name='handshake outline'/></Button>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <Button color="purple" style={{placeSelf:"stretch"}} onClick={this.showDocs} icon labelPosition='right'>Gérer les documents<Icon name='folder open'/></Button>
                        <Button color="teal" style={{placeSelf:"stretch"}} onClick={this.showShare} icon labelPosition='right'>Prêter le vehicule<Icon name='handshake outline'/></Button>
                    </Fragment>
                )
            }
        }else{
            if(this.state.vehicle.shared){
                return(
                    <Fragment>
                        <Button color="purple" style={{placeSelf:"stretch",gridColumnEnd:"span 2"}} onClick={this.showDocs} icon labelPosition='right'>Gérer les documents<Icon name='folder open'/></Button>
                    </Fragment>
                )
            }else{
                return(
                    <Fragment>
                        <Button color="purple" style={{placeSelf:"stretch",gridColumnEnd:"span 2"}} onClick={this.showDocs} icon labelPosition='right'>Gérer les documents<Icon name='folder open'/></Button>
                    </Fragment>
                )
            }
        }
    }

    getActivePanel = () => {
        if(this.state.activePanel == "tech"){
            return this.getTechPanel()
        }
        if(this.state.activePanel == "finances"){
            return this.getFinancesPanel()
        }        
    }

    getTechPanel = () => {
        if(this.state.editingTech){
            return (
                <Segment attached='bottom'>
                    <Form className="formBoard" style={{placeSelf:"start auto",display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"1fr 1fr",gridColumnStart:"1",gridRowEnd:"span 2",gridColumnEnd:"span 2",gridGap:"0 24px"}}>
                        <Form.Field style={{gridColumnEnd:"span 2"}}><label>Societé</label>
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
                        <Button style={{placeSelf:"center stretch",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={this.closeEditTech}>Annuler<Icon name='cancel'/></Button>
                        <Button style={{placeSelf:"center stretch",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.saveEditTech}>Sauvegarder<Icon name='check'/></Button>
                    </Form>
                </Segment>
            )
        }else{
            return (
                <Segment attached='bottom'>
                    <div className="formBoard" style={{display:"grid",gridTemplateColumns:"auto 1fr",gridColumnEnd:"span 2",gridColumnStart:"1",gridGap:"6px 24px"}}>
                        <div className="labelBoard">Societé :</div><div className="valueBoard">{this.state.vehicle.societe.name}</div>
                        <div className="labelBoard">Immatriculation :</div><div className="valueBoard">{this.state.vehicle.registration}</div>
                        <div className="labelBoard">Date de première immatriculation :</div><div className="valueBoard">{this.state.vehicle.firstRegistrationDate}</div>
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

    getFinancesPanel = () => {
        if(this.state.editingFinances){
            return (
                <Segment attached='bottom'>
                    <Form className="formBoard" style={{placeSelf:"start auto",display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"1fr 1fr",gridColumnStart:"1",gridRowEnd:"span 2",gridColumnEnd:"span 2",gridGap:"0 24px"}}>
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
                        <Button style={{placeSelf:"center stretch",gridColumnStart:"1"}} color="red" icon labelPosition='right' onClick={this.closeEditFinances}>Annuler<Icon name='cancel'/></Button>
                        <Button style={{placeSelf:"center stretch",gridColumnStart:"2"}} color="green" icon labelPosition='right' onClick={this.saveEditFinances}>Sauvegarder<Icon name='check'/></Button>
                    </Form>
                </Segment>
            )
        }else{
            if(this.state.vehicle.financialInfosComplete){
                return (
                    <Segment attached='bottom'>                            
                        <div className="formBoard" style={{display:"grid",gridTemplateColumns:"auto 1fr",gridColumnEnd:"span 2",gridColumnStart:"1",gridGap:"6px 24px"}}>
                            <div className="labelBoard">Montant de l'assurance :</div><div className="valueBoard">{parseFloat(this.state.vehicle.insurancePaid).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €</div>
                            <div className="labelBoard">Prix d'achat :</div><div className="valueBoard">{parseFloat(this.state.vehicle.purchasePrice).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €</div>
                            <div className="labelBoard">Date de début de payement :</div><div className="valueBoard">{this.state.vehicle.payementBeginDate}</div>
                            <div className="labelBoard">Date de fin de payement :</div><div className="valueBoard">{this.state.vehicle.payementEndDate}</div>
                            <div className="labelBoard">Durée de financement :</div><div className="valueBoard">{this.state.vehicle.payementTime.months + " mois"}</div>
                            <div className="labelBoard">Payement mensuel :</div><div className="valueBoard">{parseFloat(this.state.vehicle.monthlyPayement).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} €/mois</div>
                            <div className="labelBoard">Type de financement :</div><div className="valueBoard">{this.state.formats.filter(f=>f.triKey == this.state.vehicle.payementFormat)[0].label}</div>
                            <div className="labelBoard">Organisme de payement :</div><div className="valueBoard">{this.state.vehicle.payementOrg.name}</div>
                            <div style={{gridColumnEnd:"span 2"}}>{this.getPayementProgress()}</div>
                        </div>
                    </Segment>
                )
            }else{
                return (
                    <Segment attached='bottom'>                            
                        <div className="formBoard" style={{display:"grid",gridTemplateColumns:"1fr 4fr 1fr",gridTemplateRows:"2fr 1fr",gridColumnEnd:"span 2",gridColumnStart:"1"}}>
                            <Icon style={{gridColumnStart:"2",placeSelf:"center"}} name='warning sign' color="red" size='huge' />
                            <p style={{gridColumnStart:"2"}}>Les données de financement sont incomplètes, veuillez les compléter pour afficher cette section</p>
                            <Button basic color="blue" style={{gridColumnStart:"2",placeSelf:"stretch"}} onClick={this.showEditFinances} icon labelPosition='right'>Renseigner les informations manquantes<Icon name='edit'/></Button>
                        </div>
                    </Segment>
                )
            }
        }
    }

    getUncompleteFinancialPanel = () => {
        if(!this.state.vehicle.financialInfosComplete){
            return (
                <Message onClick={this.showEditFinances} color="red" style={{margin:"0 16px",cursor:"pointer"}} icon='euro' header={"Informations manquantes"} content={"Les informations relatives au financement de ce véhicule sont incomplètes !"} />
            )
        }
    }

    getArchivePanel = () => {
        if(this.state.vehicle.archived){
            return (
                <Message color="orange" style={{margin:"0 16px"}} icon='archive' header={"Archivé depuis le : " + this.state.vehicle.archiveDate} content={"Justificaion : " + this.state.vehicle.archiveReason} />
            )
        }
    }

    getSharedPanel = () => {
        if(this.state.vehicle.shared){
            return (
                <Message color="teal" style={{margin:"0 16px"}} icon='handshake outline' header={"En prêt chez : " + this.state.vehicle.sharedTo.name + ", depuis le : " + this.state.vehicle.sharedSince} content={"Justificaion : " + this.state.vehicle.sharingReason} />
            )
        }
    }

    componentDidMount = () => {
        this.loadVehicule();
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
                    <div style={{display:"grid",gridGap:"24px",gridTemplateRows:"auto auto 1fr"}}>
                        <div style={{display:"grid",gridGap:"16px",gridTemplateColumns:"auto 1fr auto"}}>
                            <Button animated='fade' inverted onClick={()=>{this.props.history.push("/parc/vehicles");}} style={{margin:"0",gridRowStart:"1",gridColumnStart:"1"}} color="grey" size="huge">
                                <Button.Content hidden>
                                    <Icon color="black" style={{margin:"0"}} name='list ul' />
                                </Button.Content>
                                <Button.Content visible>
                                    <Icon color="black" style={{margin:"0"}} name='angle double left' />
                                </Button.Content>
                            </Button>
                            <Message style={{margin:"0"}} icon='truck' header={this.state.vehicle.registration} content={this.state.vehicle.brand.name + " - " + this.state.vehicle.model.name} />
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                                <Button color="green" style={{placeSelf:"stretch",gridColumnEnd:"span 2"}} onClick={this.showUpdateKm} icon labelPosition='right'>MaJ kilométrage<Icon name='dashboard'/></Button>
                                {this.getDocsAndShareOptions()}
                                <Button color="blue" style={{placeSelf:"stretch"}} onClick={this.showEditTech} icon labelPosition='right'>Édition : Technique<Icon name='edit'/></Button>
                                <Button color="blue" style={{placeSelf:"stretch"}} onClick={this.showEditFinances} icon labelPosition='right'>Édition : Finances<Icon name='edit'/></Button>
                                {this.getDeleteOptions()}
                            </div>
                        </div>
                        <div style={{display:"flex"}}>
                            {this.getUncompleteFinancialPanel()}
                            {this.getArchivePanel()}
                            {this.getSharedPanel()}
                        </div>
                        <div style={{gridRowStart:"3",display:"grid",gridTemplateColumns:"2fr 3fr",gridGap:"24px"}}>
                            <div>
                                <Segment textAlign="center">
                                    <p style={{margin:"0",fontWeight:"bold",fontSize:"2.4em"}}>
                                        {this.state.vehicle.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km
                                    </p>
                                    <p style={{margin:"0",fontWeight:"bold",fontSize:"1.1em"}}>
                                        (relevé {moment(this.state.vehicle.lastKmUpdate, "DD/MM/YYYY").fromNow()})
                                    </p>
                                </Segment>
                                <Menu attached='top' pointing>
                                    <Menu.Item color="blue" icon='wrench' name='Technique' active={this.state.activePanel == 'tech'} onClick={()=>{this.setState({activePanel:"tech"})}} />
                                    <Menu.Item color={(this.state.vehicle.financialInfosComplete ? "green" : "red")} icon='euro' name='Finances' active={this.state.activePanel == 'finances'} onClick={()=>{this.setState({activePanel:"finances"})}} />
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
                    <Modal size='large' closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs au vehicule immatriculé : {this.state.vehicle.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"24px"}}>
                                <FileManagementPanel importLocked={this.state.newCg == null} handleInputFile={this.handleInputFile} fileTarget="newCg" uploadDoc={this.uploadDocCg} fileInfos={this.state.vehicle.cg} title="Carte grise" type="cg"/>
                                <FileManagementPanel importLocked={this.state.newCv == null} handleInputFile={this.handleInputFile} fileTarget="newCv" uploadDoc={this.uploadDocCv} fileInfos={this.state.vehicle.cv} title="Carte verte" type="cv"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDocs}>Fermer</Button>
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
                            A quelle societé prêter le vehicule {this.state.vehicle.registration} ?
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
                            <Button color="teal" onClick={this.shareVehicle}>Prêter</Button>
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
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openArchive} onClose={this.closeArchive} closeIcon>
                        <Modal.Header>
                            Archiver le vehicule : {this.state.vehicle.registration} ?
                        </Modal.Header>
                        <Modal.Content>
                            <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                                <Form.Field>
                                    <label>Justification</label>
                                    <TextArea rows={5} onChange={this.handleChange} name="newArchiveReason"/>
                                </Form.Field>
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeArchive}>Annuler</Button>
                            <Button color="orange" onClick={this.archiveVehicle}>Archiver</Button>
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