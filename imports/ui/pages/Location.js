import React, { Component, Fragment } from 'react'
import { Loader, Label, Button, Icon, Message, Modal, Input, Form, Table, Divider, Header, TextArea } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import ModalDatePicker from '../atoms/ModalDatePicker';
import { UserContext } from '../../contexts/UserContext';
import SocietePicker from '../atoms/SocietePicker';
import VolumePicker from '../atoms/VolumePicker';
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
        newSociete:"",
        newRegistration:"",
        newFirstRegistrationDate:"",
        newBrand:"",
        newModel:"",
        newVolume:"",
        newPayload:"",
        newColor:"",
        newInsurancePaid:"",
        newStartDate:"",
        newEndDate:"",
        newJustification:"",
        newPrice:"",
        loading:true,
        editing:false,
        openDatePicker:false,
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
                    registration
                    firstRegistrationDate
                    km
                    kms{
                        _id
                        reportDate
                        kmValue
                    }
                    lastKmUpdate
                    brand
                    model
                    volume{
                        _id
                        meterCube
                    }
                    payload
                    color
                    cg
                    insurancePaid
                    cv
                    startDate
                    endDate
                    price
                    rentalContract
                    reason
                    reparation
                }
            }
        `,
        updateLocKmQuery : gql`
            mutation updateLocKm($_id:String!,$date:String!,$kmValue:Int!){
                updateLocKm(_id:$_id,date:$date,kmValue:$kmValue)
            }
        `,
        deleteLocKmQuery : gql`
            mutation deleteLocKm($_id:String!,$location:String!){
                deleteLocKm(_id:$_id,location:$location)
            }
        `,
        editLocationQuery : gql`
            mutation editLocation($_id:String!,$societe:String!,$registration:String!,$firstRegistrationDate:String!,$brand:String!,$model:String!,$volume:String!,$payload:Float!,$color:String!,$insurancePaid:Float!,$startDate:String!,$endDate:String!,$price:Float!,$reason:String!){
                editLocation(_id:$_id,societe:$societe,registration:$registration,firstRegistrationDate:$firstRegistrationDate,brand:$brand,model:$model,volume:$volume,payload:$payload,color:$color,insurancePaid:$insurancePaid,startDate:$startDate,endDate:$endDate,price:$price,reason:$reason)
            }
        `,
        deleteLocationQuery : gql`
            mutation deleteLocation($_id:String!){
                deleteLocation(_id:$_id)
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

    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

    handleChangeVolume = (e, { value }) => this.setState({ newVolume:value })

    deleteLocation = () => {
        this.closeDelete();
        this.props.client.mutate({
            mutation:this.state.deleteLocationQuery,
            variables:{
                _id:this.state._id,
            }
        }).then(({data})=>{
            this.props.history.push("/parc/locations")
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
            this.closeUpdateLocKm();
            this.loadLocation();
        })
    }

    saveEdit = () => {
        this.props.client.mutate({
            mutation:this.state.editLocationQuery,
            variables:{
                _id:this.state._id,
                societe:this.state.newSociete,
                registration:this.state.newRegistration,
                firstRegistrationDate:this.state.newFirstRegistrationDate,
                km:parseFloat(this.state.newKm),
                lastKmUpdate:this.state.newLastKmUpdate,
                brand:this.state.newBrand,
                model:this.state.newModel,
                volume:this.state.newVolume,
                payload:parseFloat(this.state.newPayload),
                color:this.state.newColor,
                insurancePaid:parseFloat(this.state.newInsurancePaid),
                price:parseFloat(this.state.newPrice),
                startDate:this.state.newStartDate,
                endDate:this.state.newEndDate,
                reason:this.state.newJustification
            }
        }).then(({data})=>{
            this.closeEditInfos();
            this.loadLocation();
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

    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false})
    }
    
    downloadDoc = doc => {
        
    }
    uploadDoc = doc => {
        
    }

    editInfos = () => {
        this.setState({
            editing:true
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
            this.loadLocation();
        })
    }

    closeEditInfos = () => {
        this.setState({
            editing:false
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
                newBrand:data.location.brand,
                newModel:data.location.model,
                newVolume:data.location.volume._id,
                newPayload:data.location.payload,
                newColor:data.location.color,
                newInsurancePaid:data.location.insurancePaid,
                newStartDate:data.location.startDate,
                newEndDate:data.location.endDate,
                newJustification:data.location.reason,
                newPrice:data.location.price,
                loading:false
            })
        })
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

    getInfoPanel = () => {
        if(this.state.editing){
            return (
                <Form className="formBoard" style={{placeSelf:"start auto",display:"grid",gridTemplateRows:"auto",gridTemplateColumns:"1fr 1fr",gridRowStart:"3",gridColumnStart:"1",gridRowEnd:"span 2",gridGap:"6px 24px"}}>
                    <Form.Field>
                        <label>Societé</label>
                        <SocietePicker defaultValue={this.state.location.societe._id} groupAppears={true} onChange={this.handleChangeSociete}/>
                    </Form.Field>
                    <Form.Field>
                        <label>Immatriculation</label>
                        <Input defaultValue={this.state.location.registration} onChange={this.handleChange} name="newRegistration"/>
                    </Form.Field>
                    <Form.Field>
                        <label>1ère immatriculation</label>
                        <Input value={this.state.newFirstRegistrationDate} onFocus={()=>{this.showDatePicker("newFirstRegistrationDate")}} name="newFirstRegistrationDate"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Marque</label>
                        <Input defaultValue={this.state.location.brand} onChange={this.handleChange} name="newBrand"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Modèle</label>
                        <Input defaultValue={this.state.location.model} onChange={this.handleChange} name="newModel"/>
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
                        <Input defaultValue={this.state.location.color} onChange={this.handleChange} name="newColor"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Date de retrait</label>
                        <Input value={this.state.newStartDate} onFocus={()=>{this.showDatePicker("newStartDate")}} name="newStartDate"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Echéance de la location</label>
                        <Input value={this.state.newEndDate} onChange={this.handleChange} onFocus={()=>{this.showDatePicker("newEndDate")}}  name="newEndDate"/>
                    </Form.Field>
                    <Form.Field style={{placeSelf:"stretch",gridRowEnd:"span 4"}}>
                        <label>Justification de la location</label>
                        <TextArea defaultValue={this.state.newJustification} style={{height:"100%"}} onChange={this.handleChange} name="newJustification"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Prix facturé</label>
                        <Input defaultValue={this.state.location.price} onChange={this.handleChange} name="newPrice"/>
                    </Form.Field>
                    <Form.Field>
                        <label>Assurance</label>
                        <Input defaultValue={this.state.location.insurancePaid} onChange={this.handleChange} name="newInsurancePaid"/>
                    </Form.Field>
                    <Button style={{placeSelf:"center stretch"}} color="red" icon labelPosition='right' onClick={this.closeEditInfos}>Annuler<Icon name='cancel'/></Button>
                    <Button style={{placeSelf:"center stretch"}} color="green" icon labelPosition='right' onClick={this.saveEdit}>Sauvegarder<Icon name='check'/></Button>
                </Form>
            )
        }else{
            return (
                <div className="formBoard" style={{display:"grid",gridTemplateColumns:"auto 1fr",gridRowStart:"3",gridColumnStart:"1",gridGap:"6px 24px"}}>
                    <Divider style={{gridColumnEnd:"span 2",height:"23px"}} horizontal>
                        <Header as='h4'>
                            <Icon name='clipboard' />
                            Location
                        </Header>
                    </Divider>
                    <div className="labelBoard">Début de la location :</div><div className="valueBoard">{this.getStartDateLabel()}</div>
                    <div className="labelBoard">Fin de la location :</div><div className="valueBoard">{this.getEndDateLabel()}</div>
                    <Divider style={{gridColumnEnd:"span 2",height:"23px"}} horizontal>
                        <Header as='h4'>
                            <Icon name='wrench' />
                            Technique
                        </Header>
                    </Divider>
                    <div className="labelBoard">Societé :</div><div className="valueBoard">{this.state.location.societe.name}</div>
                    <div className="labelBoard">Immatriculation :</div><div className="valueBoard">{this.state.location.registration}</div>
                    <div className="labelBoard">Date de première immatriculation :</div><div className="valueBoard">{this.state.location.firstRegistrationDate}</div>
                    <div className="labelBoard">Marque :</div><div className="valueBoard">{this.state.location.brand}</div>
                    <div className="labelBoard">Modèle :</div><div className="valueBoard">{this.state.location.model}</div>
                    <div className="labelBoard">Volume :</div><div className="valueBoard">{this.state.location.volume.meterCube+" m²"}</div>
                    <div className="labelBoard">Charge utile :</div><div className="valueBoard">{this.state.location.payload+" t."}</div>
                    <div className="labelBoard">Couleur :</div><div className="valueBoard">{this.state.location.color}</div>
                    <Divider style={{gridColumnEnd:"span 2",height:"23px"}} horizontal>
                        <Header as='h4'>
                            <Icon name='euro' />
                            Finances
                        </Header>
                    </Divider>
                    <div className="labelBoard">Montant de l'assurance :</div><div className="valueBoard">{this.state.location.insurancePaid} €</div>
                    <div className="labelBoard">Coût de la location :</div><div className="valueBoard">{this.state.location.price} €</div>
                    <div className="labelBoard">Montant des réparations :</div><div className="valueBoard">{this.state.location.reparation} €</div>
                </div>
            )
        }
    }

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
                    <div style={{display:"grid",gridGap:"24px",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"auto auto 1fr"}}>
                        <Message size='big' style={{margin:"0",gridRowStart:"1",gridColumnStart:"1"}} icon='truck' header={this.state.location.registration} content={this.state.location.brand + " - " + this.state.location.model} />
                        <div>
                            <p style={{margin:"0",fontWeight:"bold",fontSize:"2.4em"}}>
                                {this.state.location.km.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} km
                            </p>
                            <p style={{margin:"0",fontWeight:"bold",fontSize:"1.1em"}}>
                                (relevé {moment(this.state.location.lastKmUpdate, "DD/MM/YYYY").fromNow()})
                            </p>
                        </div>
                        {this.getInfoPanel()}
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridRowStart:"1",gridColumnStart:"2",gridGap:"16px"}}>
                            <Button color="green" style={{placeSelf:"stretch"}} onClick={this.showUpdateLocKm} icon labelPosition='right'>MaJ kilométrage<Icon name='dashboard'/></Button>
                            <Button color="purple" style={{placeSelf:"stretch"}} onClick={this.showDocs} icon labelPosition='right'>Gérer les documents<Icon name='folder'/></Button>
                            <Button color="blue" style={{placeSelf:"stretch"}} onClick={this.editInfos} icon labelPosition='right'>Editer la location<Icon name='edit'/></Button>
                            <Button color="red" style={{placeSelf:"stretch"}} onClick={this.showDelete} icon labelPosition='right'>Supprimer la location<Icon name='trash'/></Button>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 4fr",gridRowStart:"2",gridRowEnd:"span 2",gridColumnStart:"2",gridGap:"16px"}}>
                            <Table style={{placeSelf:"start"}} basic="very">
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
                                <Bar ref={(reference) => this.chartRef = reference } data={this.getChartData()} style={{display:"block"}} options={{maintainAspectRatio:false,responsive:true}}/>
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
                    <Modal closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs au location immatriculé : {this.state.location.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridTemplateRows:"1fr auto 1fr",gridGap:"0 24px"}}>
                                <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 1</p>
                                <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>Document 2</p>
                                <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                    <p className="gridLabel">Nom du fichier :</p>
                                    <p className="gridValue">Doc Name XYZ</p>
                                    <p className="gridLabel">Taille du fichier:</p>
                                    <p className="gridValue">1234 kB</p>
                                    <p className="gridLabel">Enregistré le :</p>
                                    <p className="gridValue">01/02/2019</p>
                                </Message>
                                <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr"}} color="grey">
                                    <p className="gridLabel">Nom du fichier :</p>
                                    <p className="gridValue">Doc Name XYZ</p>
                                    <p className="gridLabel">Taille du fichier:</p>
                                    <p className="gridValue">1234 kB</p>
                                    <p className="gridLabel">Enregistré le :</p>
                                    <p className="gridValue">01/02/2019</p>
                                </Message>
                                <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                                <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                                <Button color="blue" onClick={this.closeDocs}>Importer</Button>
                                <Button color="black" onClick={this.closeDocs}>Telecharger</Button>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDocs}>Fermer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                        <Modal.Header>
                            Supprimer la location vehicule : {this.state.location.registration} ?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDelete}>Annuler</Button>
                            <Button color="red" onClick={this.deleteLocation}>Supprimer</Button>
                        </Modal.Actions>
                    </Modal>
                    <Modal size='tiny' closeOnDimmerClick={false} open={this.state.openDeleteLocKm} onClose={this.closeDeleteLocKm} closeIcon>
                        <Modal.Header>
                            Supprimer le relevé kilométrique du vehicule : {this.state.location.registration} datant du {/*this.state.location.kms.filter(x=>x._id == this.state.selectedKm)[0].reportDate*/}?
                        </Modal.Header>
                        <Modal.Actions>
                            <Button color="grey" onClick={this.closeDeleteLocKm}>Annuler</Button>
                            <Button color="red" onClick={this.deleteLocKm}>Supprimer</Button>
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
