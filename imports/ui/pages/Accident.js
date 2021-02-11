import React, { Component, Fragment } from 'react';
import { Message, Modal, Button, Loader, Icon, Menu } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';

import ModalDatePicker from '../atoms/ModalDatePicker';
import FileManagementPanel from '../atoms/FileManagementPanel';

import AccidentTabularDeclaration from '../molecules/AccidentTabularDeclaration';
import AccidentTabularCirconstances from '../molecules/AccidentTabularCirconstances';
import AccidentTabularPriseencharge from '../molecules/AccidentTabularPriseencharge';

import BigButtonIcon from '../elements/BigIconButton';

import moment from 'moment';

export class Accident extends Component {

    state={
        _id:this.props.match.params._id,
        activeItem:"declaration",
        accident:null,
        loading:true,
        details:false,
        editing:false,
        openDocs:false,
        openArchive:false,
        openUnArchive:false,
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
                    description
                    dateExpert
                    dateTravaux
                    constatSent
                    cost
                    archived
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
    closeEdit = () => {
        this.setState({editing:false})
    }
    showEdit = () => {
        this.setState({editing:true})
    }
    showDocs = () => {
        this.setState({openDocs:true})
    }
    closeDocs = () => {
        this.setState({openDocs:false,newConstat:null,newRapportExp:null})
    }
    /*CHANGE HANDLERS*/
    handleItemClick = (item) => this.setState({ activeItem: item })
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
                accident:data.accident
            })
        })
    }
    /*CONTENT GETTERS*/
    getArchiveButton = () => {
        if(this.state.accident.archived){
            return <BigButtonIcon icon="check" color="green" onClick={this.showUnArchive} tooltip="Désarchiver"/>
        }else{
            return <BigButtonIcon icon="archive" color="orange" onClick={this.showArchive} tooltip="Archiver"/>
        }
    }
    
    getActiveTab = () => {
        if(this.state.activeItem == "declaration"){
            return(
                <AccidentTabularDeclaration loadAccident={this.loadAccident} closeEdit={this.closeEdit} showEdit={this.showEdit} editing={this.state.editing} accident={this.state.accident}/>
            )
        }
        if(this.state.activeItem == "questions"){
            return(
                <AccidentTabularCirconstances/>
            )
        }
        if(this.state.activeItem == "priseencharge"){
            return(
                <AccidentTabularPriseencharge/>
            )
        }
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
                    <div style={{display:"grid",gridTemplateRows:"auto auto minmax(0,1fr)",gridTemplateColumns:"2fr 3fr",height:"100%"}}>
                        <div style={{display:"grid",gridColumnEnd:"span 2",gridGap:"32px",gridTemplateColumns:"auto 1fr 1fr auto",marginBottom:"24px"}}>
                            <BigButtonIcon icon="angle double left" color="black" onClick={()=>{this.props.history.push("/parc/vehicles");}} tooltip="Retour au tableau des véhicules"/>
                            <Message style={{margin:"0"}} icon='truck' header={this.state.accident.vehicle.registration} content={this.state.accident.vehicle.brand.name + " - " + this.state.accident.vehicle.model.name} />
                            <Message style={{margin:"0"}} icon='fire' header={this.state.accident.occurenceDate} />
                            <div style={{display:"flex",justifyContent:"flex-end"}}>
                                <BigButtonIcon icon="edit" color="blue" onClick={this.showEdit} tooltip="Éditer l'accident"/>
                                {this.getArchiveButton()}
                                <BigButtonIcon icon="folder open" color="purple" onClick={this.showDocs} tooltip="Gérer les documents"/>
                            </div>
                        </div>
                        <Menu size='massive' tabular attached="top" widths={3} style={{gridColumnEnd:"span 2"}}>
                            <Menu.Item name="Déclaration" active={this.state.activeItem === 'declaration'} onClick={()=>{this.handleItemClick("declaration")}}/>
                            <Menu.Item name="Circonstances" active={this.state.activeItem === 'questions'} onClick={()=>{this.handleItemClick("questions")}}/>
                            <Menu.Item name="Prise en charge" active={this.state.activeItem === 'priseencharge'} onClick={()=>{this.handleItemClick("priseencharge")}}/>
                        </Menu>
                        {this.getActiveTab()}
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
                    <Modal size='large' closeOnDimmerClick={false} open={this.state.openDocs} onClose={this.closeDocs} closeIcon>
                        <Modal.Header>
                            Documents relatifs à l'accident du véhicule : {this.state.accident.vehicle.registration}
                        </Modal.Header>
                        <Modal.Content style={{textAlign:"center"}}>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"24px"}}>
                                <FileManagementPanel importLocked={this.state.newConstat == null} handleInputFile={this.handleInputFile} fileTarget="newConstat" uploadDoc={this.uploadDocConstat} downloadDoc={this.downloadDocConstat} fileInfos={this.state.accident.constat} title="Constat" type="constat"/>
                                <FileManagementPanel importLocked={this.state.newRapportExp == null} handleInputFile={this.handleInputFile} fileTarget="newRapportExp" uploadDoc={this.uploadDocRapportExp} downloadDoc={this.downloadDocRapportExp} fileInfos={this.state.accident.rapportExp} title="Rapport de l'expert" type="rapportExp"/>
                                <FileManagementPanel importLocked={this.state.newFacture == null} handleInputFile={this.handleInputFile} fileTarget="newFacture" uploadDoc={this.uploadDocFacture} downloadDoc={this.downloadDocFacture} fileInfos={this.state.accident.facture} title="Rapport de l'expert" type="facture"/>
                            </div>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button color="black" onClick={this.closeDocs}>Fermer</Button>
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