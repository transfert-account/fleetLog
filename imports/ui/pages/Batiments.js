import React, { Component } from 'react';
import { Icon,Input,Button,Table,Modal,Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import ModalDatePicker from '../atoms/ModalDatePicker'
import SocietePicker from '../atoms/SocietePicker'
import BatimentControlRow from '../molecules/BatimentControlRow';
import { gql } from 'apollo-server-express'

class Batiments extends Component {

    state={
        batimentControlFilter:"",
        newName:"",
        newDelai:"",
        newLastExecution:"",
        openAddBatimentControl:false,
        batimentControlsRaw:[],
        batimentControls : () => {
            let displayed = Array.from(this.state.batimentControlsRaw);
            if(this.state.batimentControlFilter.length>1){
                displayed = displayed.filter(f => true
                );
                if(displayed.length == 0){
                    return(
                    <Table.Row key={"none"}>
                        <Table.Cell width={16} colSpan='14' textAlign="center">
                            <p>Aucun contrôle ne correspond à ce filtre</p>
                        </Table.Cell>
                    </Table.Row>
                    )
                }
            }
            return displayed.map(b =>(
                <BatimentControlRow loadBatimentControls={this.loadBatiments} key={b.societe._id} batiment={b}/>
            ))
        },
        addBatimentControlQuery : gql`
            mutation addBatimentControl($name:String!,$delay:String!,$lastExecution:String!,$societe:String!){
            addBatimentControl(name:$name,delay:$delay,lastExecution:$lastExecution,societe:$societe){
                    status
                    message
                }
            }
        `,
        batimentsQuery : gql`
            query batiments{
                batiments{
                    societe{
                        _id
                        trikey
                        name
                    }
                    controls{
                        _id
                        name
                        delay
                        lastExecution
                        delay
                    }
                }
            }
        `
    }

    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
        });
    }

    handleFilter = e =>{
        this.setState({
            batimentFilter:e.target.value
        });
    }

    handleChangeSociete = (e, { value }) => this.setState({ newSociete:value })

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

    closeDatePicker = target => {
        this.setState({openDatePicker:false,datePickerTarget:""})
    }

    onSelectDatePicker = date => {
        this.setState({
            [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
        })
    }

    loadBatimentControls = () => {
        this.props.client.query({
            query:this.state.batimentsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                batimentControlsRaw:data.batiments
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
                delay:this.state.newDelai,
                lastExecution:this.state.newLastExecution
            }
        }).then(({data})=>{
            data.addBatimentControl.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadBatimentControls();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    componentDidMount = () => {
        this.loadBatimentControls();
    }

    render() {
        return (
            <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
                <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="storeFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher une société ou un nom' />
                <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddBatimentControl} icon labelPosition='right'>Ajouter un contrôle au batiment<Icon name='plus'/></Button>
                <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                    <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                        <Table.Header>
                            <Table.Row textAlign='center'>
                                <Table.HeaderCell>Societe</Table.HeaderCell>
                                <Table.HeaderCell>Contrôle</Table.HeaderCell>
                                <Table.HeaderCell>Délai</Table.HeaderCell>
                                <Table.HeaderCell>Dernière exécution</Table.HeaderCell>
                                <Table.HeaderCell>Avant prochaine exécution</Table.HeaderCell>
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
                        <Button color="blue" onClick={this.addBatimentControl}>Créer</Button>
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