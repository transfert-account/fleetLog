import React, { Component, Fragment } from 'react';
import { Modal, Menu, Button, Icon, Message } from 'semantic-ui-react';
import { saveAs } from 'file-saver';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

export class ExportXL extends Component {

    state = {
        archiveFilter:false,
        reportLateFilter:"all",
        docsFilter:"all",
        sharedFilter:false,
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
                    property
                    purchasePrice
                    monthlyPayement
                    payementFormat
                    archived
                    shared
                    sharedTo{
                        _id
                        name
                    }
                }
            }
        `,
        vehiclesRaw:[]
    }

    //ARCHIVE FILTER
    getArchiveFilterColor = (color,active) => {
        if(this.state.archiveFilter == active){
            return color;
        }
    }

    switchArchiveFilter = () => {
        this.setState({
            archiveFilter:!this.state.archiveFilter
        })
        this.loadVehicles();
    }

    //REPORT LATE FILTER
    getKmFilterColor = (color,filter) => {
        if(this.state.reportLateFilter == filter){
            return color
        }
    }

    setReportLateFilter = value => {
        this.setState({
            reportLateFilter:value
        })
    }

    //MISSING DOCS FILTER
    getDocsFilterColor = (color,filter) => {
        if(this.state.docsFilter == filter){
            return color
        }
    }

    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }

    //SHARED FILTER
    getSharedFilterColor = (color,active) => {
        if(this.state.sharedFilter == active){
            return color
        }
    }

    setSharedFilter = value => {
        this.setState({
            sharedFilter:value
        })
    }

    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
        });
    }

    getMenu = () => {
        if(this.props.user.isOwner){
        return (
            <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
                <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
                <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
                <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
                <Menu.Item color="blue" name='exports' active onClick={()=>{this.props.history.push("/administration/exports")}}><Icon name='file excel outline'/>Exports</Menu.Item>
            </Menu>
        )
        }else{
        return (
            <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
                <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
                <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
                <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
                <Menu.Item color="blue" name='exports' active onClick={()=>{this.props.history.push("/administration/exports")}}><Icon name='file excel outline'/>Exports</Menu.Item>
            </Menu>
        )
        }
    }

    loadVehicles = () => {
        this.props.client.query({
            query:this.state.vehiclesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                vehiclesRaw:data.vehicles
            })
        })
    }

    componentDidMount = () => {
        this.loadVehicles();
    }

    export = () => {
        let exp = [];
        this.state.vehiclesRaw.map(v=>{
            exp.push({
                "Societé":v.societe.name,
                "Immatriculation":v.registration,
                "Date Immatriculation":v.firstRegistrationDate,
                "Kilometrage":v.km,
                "Dernier relevé":v.lastKmUpdate,
                "Marque":v.brand.name,
                "Modèle":v.model.name,
                "Volume (m²)":v.volume.meterCube,
                "Charge utile (t.)":v.payload,
                "Energie":v.energy.name,
                "Propriété":v.property,
                "Paiement mensuel":v.monthlyPayement,
                "Coût":v.purchasePrice,
                "Date de début de payement":v.payementBeginDate,
                "Format de payement":v.payementFormat,
                "Archivé":v.archived
            })
        });
        var ws = XLSX.utils.json_to_sheet(exp);
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "export "+(this.state.month+1).toString().padStart(2,'0')+' '+this.state.year);
        let wopts = { bookType:'xlsx',bookSST:false,type:'array'};
        let wbout = XLSX.write(wb,wopts);
        saveAs(new Blob([wbout],{type:"application/octet-stream"}), "export_"+this.state.vehiclesRaw.length+"v_"+new Date().getDate().toString().padStart(2,'0')+"_"+new Date().getMonth().toString().padStart(2,'0')+"_"+new Date().getFullYear().toString().padStart(4,'0')+".xlsx");
    }

    render() {
        return (
            <Fragment>
                <div style={{display:"grid",gridTemplateRows:'auto auto 1fr auto'}}>
                    <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                        {this.getMenu()}
                    </div>
                    {/*<div style={{placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto auto auto auto",gridGap:"16px"}}>
                        <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                            <Icon name='archive'/>
                            <Button.Group style={{placeSelf:"center"}}>
                                <Button color={this.getArchiveFilterColor("green",false)} onClick={this.switchArchiveFilter}>Actuels</Button>
                                <Button color={this.getArchiveFilterColor("orange",true)} onClick={this.switchArchiveFilter}>Archives</Button>
                            </Button.Group>
                        </Message>
                        <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                            <Icon name='handshake'/>
                            <Button.Group style={{placeSelf:"center"}}>
                                <Button color={this.getSharedFilterColor("green",false)} onClick={()=>{this.setSharedFilter(false)}}>Tous</Button>
                                <Button color={this.getSharedFilterColor("teal",true)} onClick={()=>{this.setSharedFilter(true)}}>En prêt</Button>
                            </Button.Group>
                        </Message>
                        <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                            <Icon name='dashboard'/>
                            <Button.Group style={{placeSelf:"center"}}>
                                <Button color={this.getKmFilterColor("green","all")} onClick={()=>{this.setReportLateFilter("all")}}>Tous</Button>
                                <Button color={this.getKmFilterColor("orange","2w")} onClick={()=>{this.setReportLateFilter("2w")}}>Relevé > 2 sem.</Button>
                                <Button color={this.getKmFilterColor("red","4w")} onClick={()=>{this.setReportLateFilter("4w")}}>Relevé > 4 sem.</Button>
                            </Button.Group>
                        </Message>
                        <Message color="grey" icon style={{margin:"0",placeSelf:"stretch",display:"grid",gridTemplateColumns:"auto 1fr"}}>
                            <Icon name='folder'/>
                            <Button.Group style={{placeSelf:"center"}}>
                                <Button color={this.getDocsFilterColor("green","all")} onClick={()=>{this.setDocsFilter("all")}}>Tous</Button>
                                <Button color={this.getDocsFilterColor("red","missingDocs")} onClick={()=>{this.setDocsFilter("missingDocs")}}>Documents manquants</Button>
                            </Button.Group>
                        </Message>
                    </div>*/}
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridGap:"12px 16px"}}>
                        <Button onClick={this.export}>Exporter les données de tous les vehicules ({this.state.vehiclesRaw.length})</Button>
                    </div>
                </div>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(ExportXL));
