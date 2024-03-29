import React, { Component } from 'react';
import { Input, Button, Modal, Form, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import BigIconButton from '../elements/BigIconButton';

import CustomFilterSegment from '../molecules/CustomFilterSegment';
import BatimentControlRow from '../molecules/BatimentControlRow';

import CustomFilter from '../atoms/CustomFilter';
import ModalDatePicker from '../atoms/ModalDatePicker'
import SocietePicker from '../atoms/SocietePicker'

import { gql } from 'apollo-server-express';
import moment from 'moment';

class Batiments extends Component {

    state={
        newName:"",
        newDelai:"",
        newLastExecution:"",
        openDatePicker:false,
        timeLeftFilter:"all",
        batimentFilter:"",
        docsFilter:"all",
        filters:[
            {
                infos:"timeLeftFilterInfos",
                filter:"timeLeftFilter"
            },{
                infos:"docsFilterInfos",
                filter:"docsFilter"
            }
        ],
        timeLeftFilterInfos:{
            icon:"calendar",            
            options:[
                {
                    key: 'timeleftall',
                    initial: true,
                    text: 'Tous les contrôles',
                    value: "all",
                    color:"green",
                    click:()=>{this.setTimeLeftFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
                },
                {
                    key: 'timeleftsoon',
                    initial: false,
                    text: 'Moins de 8 semaines',
                    value: "soon",
                    color:"yellow",
                    click:()=>{this.setTimeLeftFilter("soon")},
                    label: { color: 'yellow', empty: true, circular: true },
                },
                {
                    key: 'timeleftvery',
                    initial: false,
                    text: 'Moins de 4 semaines',
                    value: "very",
                    color:"orange",
                    click:()=>{this.setTimeLeftFilter("very")},
                    label: { color: 'orange', empty: true, circular: true },
                },
                {
                    key: 'timeleftover',
                    initial: false,
                    text: 'Délai dépassé',
                    value: "over",
                    color:"red",
                    click:()=>{this.setTimeLeftFilter("over")},
                    label: { color: 'red', empty: true, circular: true },
                }
            ]
        },
        docsFilterInfos:{
            icon:"folder open outline",            
            options:[
                {
                    key: 'docsall',
                    initial: true,
                    text: 'Tous les contrôles',
                    value: "all",
                    color:"green",
                    click:()=>{this.setDocsFilter("all")},
                    label: { color: 'green', empty: true, circular: true },
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
        openAddBatimentControl:false,
        batimentControlsRaw:[],
        batimentControls : () => {
            let displayed = Array.from(this.state.batimentControlsRaw);
            if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
                displayed = displayed.filter(bc =>
                    bc.societe._id == this.props.societeFilter
                );
            }
            if(displayed.length == 0){
                return(
                    <Table.Row key={"none"}>
                        <Table.Cell colSpan='7' textAlign="center">
                        <p>Aucun contrôle</p>
                        </Table.Cell>
                    </Table.Row>
                )
            }
            return displayed.sort((a,b)=>{
                return parseInt(moment(a.lastExecution,"DD/MM/YYYY").add(a.delay, 'days').diff(moment(),'day', true)) -
                parseInt(moment(b.lastExecution,"DD/MM/YYYY").add(a.delay, 'days').diff(moment(),'day', true))
            }).map(bc =>(
                <BatimentControlRow batimentFilter={this.state.batimentFilter} docsFilter={this.state.docsFilter} timeLeftFilter={this.state.timeLeftFilter} loadBatiments={this.loadBatiments} key={bc._id} control={bc}/>
            ))
        },
        addBatimentControlQuery : gql`
            mutation addBatimentControl($name:String!,$delay:Int!,$lastExecution:String!,$societe:String!){
                addBatimentControl(name:$name,delay:$delay,lastExecution:$lastExecution,societe:$societe){
                    status
                    message
                }
            }
        `,
        addBatimentControlGlobalQuery : gql`
            mutation addBatimentControlGlobal($name:String!,$delay:Int!,$lastExecution:String!){
                addBatimentControlGlobal(name:$name,delay:$delay,lastExecution:$lastExecution){
                    status
                    message
                }
            }
        `,
        batimentControlsQuery : gql`
            query batimentControls{
                batimentControls{
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    name
                    delay
                    lastExecution
                    delay
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
                }
            }
        `,
    }
    /*SHOW AND HIDE MODALS*/
    showAddBatimentControl = () => {
        this.setState({
            openAddBatimentControl:true
        })
    }
    closeAddBatimentControl = () => {
        this.setState({
            openAddBatimentControl:false
        })
    }
    showDatePicker = target => {
        this.setState({openDatePicker:true,datePickerTarget:target})
    }
    closeDatePicker = () => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }
    /*CHANGE HANDLERS*/
    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }
    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
        });
    }
    /*FILTERS HANDLERS*/
    setTimeLeftFilter = value => {
        this.setState({
            timeLeftFilter:value
        })
    }
    setDocsFilter = value => {
        this.setState({
            docsFilter:value
        })
    }
    handleFilter = e =>{
        this.setState({
            batimentFilter:e.target.value
        });
    }
    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })
    resetAll = () => {
        let filterNewValues = {};
        this.state.filters.forEach(f=>{
            filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
        })
        this.setState(filterNewValues);
    }
    /*DB READ AND WRITE*/
    loadBatiments = () => {
        this.props.client.query({
            query:this.state.batimentControlsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                batimentControlsRaw:data.batimentControls
            })
        })
    }
    addBatimentControl = () => {
        this.closeAddBatimentControl()
        this.props.client.mutate({
            mutation:this.state.addBatimentControlQuery,
            variables:{
                societe:this.state.newSociete,
                name:this.state.newName,
                delay:parseInt(this.state.newDelai),
                lastExecution:this.state.newLastExecution
            }
        }).then(({data})=>{
            data.addBatimentControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    addBatimentControlGlobal = () => {
        this.closeAddBatimentControl()
        this.props.client.mutate({
            mutation:this.state.addBatimentControlGlobalQuery,
            variables:{
                name:this.state.newName,
                delay:parseInt(this.state.newDelai),
                lastExecution:this.state.newLastExecution
            }
        }).then(({data})=>{
            data.addBatimentControlGlobal.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatiments();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadBatiments();
    }
    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
                <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="storeFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher un nom de contrôle' />
                <BigIconButton icon="plus" color="blue" onClick={this.showAddBatimentControl} tooltip="Ajouter un contrôle au batiment"/>
                <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}}>
                    <CustomFilter infos={this.state.timeLeftFilterInfos} active={this.state.timeLeftFilter} />
                    <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
                </CustomFilterSegment>
                <div style={{gridRowStart:"3",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"16px"}} celled selectable color="blue" compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Societe</Table.HeaderCell>
                                <Table.HeaderCell>Contrôle</Table.HeaderCell>
                                <Table.HeaderCell>Délai</Table.HeaderCell>
                                <Table.HeaderCell>Dernière exécution</Table.HeaderCell>
                                <Table.HeaderCell>Avant prochaine exécution</Table.HeaderCell>
                                <Table.HeaderCell>Documents</Table.HeaderCell>
                                <Table.HeaderCell>Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.batimentControls()}
                        </Table.Body>
                    </Table>
                </div>
                <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddBatimentControl} onClose={this.closeAddBatimentControl} closeIcon>
                    <Modal.Header>
                        Création du contrôle
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field ><label>Societe</label>
                                <SocietePicker restrictToVisibility groupAppears={false} onChange={this.handleChangeSociete}/>
                            </Form.Field>
                            <Form.Field><label>Nom du contrôle</label><input value={this.state.newName} onChange={this.handleChange} placeholder="Nom du contrôle" name="newName"/></Form.Field>
                            <Form.Field><label>Délai entre deux exécutions (en jours)</label><input value={this.state.newDelai} onChange={this.handleChange} placeholder="Délai entre deux exécutions" name="newDelai"/></Form.Field>
                            <Form.Field><label>Dernière exécution (date)</label><input onChange={this.handleChange} value={this.state.newLastExecution} onFocus={()=>{this.showDatePicker("newLastExecution")}} placeholder="Date du dernier contrôle"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddBatimentControl}>Annuler</Button>
                        <Button color="blue" onClick={this.addBatimentControl}>Créer</Button>
                        <Button color="teal" onClick={this.addBatimentControlGlobal}>Créer pour toutes les sociétés</Button>
                    </Modal.Actions>
                </Modal>
                <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Batiments);