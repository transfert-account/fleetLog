import React, { Component, Fragment } from 'react'
import { Table, Icon, Button, Modal, Header, Label, Message } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class StoredObjectRow extends Component {

    state={
        openDelete:false,
        debug:JSON.parse(this.props.so.debug)[0],
        openDetails:false,
        openDelete:false,
        signedDownloadLink:"",
        linkGenerated:false,
        linkGenerating:false,
        displayDownloadLink:false,
        getSignedStoredObjectDownloadLinkQuery : gql`
            query getSignedStoredObjectDownloadLink($name: String!) {
                getSignedStoredObjectDownloadLink(name:$name)
            }
        `,
        deleteObjectQuery : gql`
            query deleteObject($name: String!) {
                deleteObject(name:$name){
                    status
                    message
                }
            }
        `,
        deleteObjectAndDocQuery : gql`
            query deleteObjectAndDoc($name: String!,$docId: String!) {
                deleteObjectAndDoc(name:$name,docId:$docId){
                    status
                    message
                }
            }
        `
    }

    showDetails = () => {
        this.setState({
            openDetails:true
        });
    }
    closeDetails = () => {
        this.setState({
            openDetails:false
        });
    }
    showDelete = () => {
        this.setState({
            openDelete:true
        });
    }
    closeDelete = () => {
        this.setState({
            openDelete:false
        });
    }

    deleteObject = () => {
        this.props.client.query({
            query:this.state.deleteObjectQuery,
            variables:{
                name:this.props.so.name
            }
        }).then((data)=>{
            data.data.deleteObject.map(qrm=>{
                this.closeDelete()
                this.closeDetails()
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadStoredObjects()
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    deleteObjectAndDoc = () => {
        this.props.client.query({
            query:this.state.deleteObjectAndDocQuery,
            variables:{
                name:this.props.so.name,
                docId:this.props.so.doc._id
            }
        }).then((data)=>{
            data.data.deleteObjectAndDoc.map(qrm=>{
                this.closeDelete()
                this.closeDetails()
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadStoredObjects()
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }

    getSignedDocumentDownloadLink = () => {
        this.setState({
            linkGenerating:true
        })
        this.props.client.query({
            query:this.state.getSignedStoredObjectDownloadLinkQuery,
            variables:{
                name:this.props.so.name
            }
        }).then((data)=>{
            this.setState({
                linkGenerated:true,
                linkGenerating:false,
                signedDownloadLink:data.data.getSignedStoredObjectDownloadLink
            })
        })
    }

    closeDelete = () => {
        this.setState({openDelete:false})
    }

    showDelete = () => {
        this.setState({openDelete:true})
    }

    reloadDocuments = () => {
        this.props.reloadDocuments()
    }

    getDownloadLink = () => {
        if(this.state.linkGenerated){
            return <a href={this.state.signedDownloadLink} target="blank" download>{this.state.signedDownloadLink}</a>
        }else{
            return <p>Cliquez sur "Générer" pour faire apparaître le lien de téléchargement (durée de validité du lien : 120 secondes)</p>
        }
    }

    getDownloadButton = () => {
        if(this.state.linkGenerating){
            return (
                <Button color="black" loading></Button>
            )
        }else{
            return (
                <Button color="black" onClick={this.getSignedDocumentDownloadLink}>Générer un lien de téléchargement</Button>
            )
        }
    }

    getShowDeleteButton = () => {
        if(this.props.user.isOwner){
            return <Button color='red' onClick={this.showDelete}><Icon name='trash'/> Supprimer</Button>
        }else{
            return <Button disabled color='red'><Icon name='trash'/> Supprimer</Button>
        }
    }

    componentDidMount = () => {
    }

    render() {
        if(this.props.so.doc._id == ""){
            return (
                <Fragment>
                    <Table.Row negative>
                        <Table.Cell>{this.props.so.name}</Table.Cell>
                        <Table.Cell textAlign="center">{parseFloat(this.props.so.size/1048576).toFixed(2)} Mo</Table.Cell>
                        <Table.Cell></Table.Cell>
                        <Table.Cell colSpan="2" textAlign="center">
                            <Label color="red">
                                Document non référencé sur la plateforme
                            </Label>
                        </Table.Cell>
                        <Table.Cell textAlign="center">
                            <Button size='mini' style={{color:"#00a8ff"}} icon icon='search' onClick={()=>{this.setState({openDetails:true})}}/>
                        </Table.Cell>
                    </Table.Row>
                    <Modal open={this.state.openDetails} onClose={this.closeDetails}>
                        <Header icon='file' content={"Document non référencé : " + this.props.so.name}/>
                        <Modal.Content>
                            <Message color="red">
                                Ce document apparaît ici car il est stocké sur le bucket Amazon S3 de la plateforme, toutefois il n'est référencé nul part et la plateforme ignore sont existence.
                            </Message>
                            {this.getDownloadLink()}
                        </Modal.Content>
                        <Modal.Actions>
                            {this.getDownloadButton()}
                            <Button color='black' onClick={this.closeDetails}><Icon name='cancel'/> Fermer</Button>
                            {this.getShowDeleteButton()}
                        </Modal.Actions>
                        <Modal onClose={this.closeDelete} open={this.state.openDelete}>
                            <Header icon='trash' content={"Êtes vous certain de vouloir supprimer cet objet du bucket Amazon ?"}/>
                            <Modal.Content>
                                <Message color="red">
                                    <p>La suppression de l'objet : {this.props.so.name} sera irreversible !</p>
                                </Message>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color="black" icon='cancel' content='Annuler' onClick={this.closeDelete}/>
                                <Button color="red" icon='trash' content='Supprimer' onClick={this.deleteObject}/>
                            </Modal.Actions>
                        </Modal>
                    </Modal>
                </Fragment>
            )
        }else{
            if(this.state.debug.obj == "unlinked"){
                return (
                    <Fragment>
                        <Table.Row warning>
                            <Table.Cell>{this.props.so.name}</Table.Cell>
                            <Table.Cell textAlign="center">{parseFloat(this.props.so.size/1048576).toFixed(2)} Mo</Table.Cell>
                            <Table.Cell>{this.props.so.doc.originalFilename}</Table.Cell>
                            <Table.Cell textAlign="center" colSpan="2">
                                <Label color="orange">
                                    Document référencé mais orphelin
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <Button size='mini' style={{color:"#00a8ff"}} icon icon='search' onClick={()=>{this.setState({openDetails:true})}}/>
                            </Table.Cell>
                        </Table.Row>
                        <Modal open={this.state.openDetails} onClose={this.closeDetails}>
                            <Header icon='file' content={"Document non référencé : " + this.props.so.name}/>
                            <Modal.Content>
                                <Message color="orange">
                                    Ce document apparaît ici car il est stocké sur le bucket Amazon S3 de la plateforme, si il référencé par la plateforme, il n'est plus lié à aucun objet dessus.
                                </Message>
                                <p>Stocké : <Label style={{marginRight:"16px"}}> {moment(this.props.so.doc.storageDate.split(" ")[0],"DD/MM/YYYY").fromNow()}</Label> le {this.props.so.doc.storageDate.split(" ").join(" à ")}</p>
                                <p>{"Chemin : " + this.props.so.doc.path}</p>
                                {this.getDownloadLink()}
                            </Modal.Content>
                            <Modal.Actions>
                                {this.getDownloadButton()}
                                <Button color='black' onClick={this.closeDetails}><Icon name='cancel'/> Fermer</Button>
                                {this.getShowDeleteButton()}
                            </Modal.Actions>
                            <Modal onClose={this.closeDelete} open={this.state.openDelete}>
                                <Header icon='trash' content={"Êtes vous certain de vouloir supprimer ce document ?"}/>
                                <Message color="red">
                                    <p>La suppression du document : {this.props.so.name} sera irreversible !</p>
                                </Message>
                                <Modal.Actions>
                                    <Button color="black" icon='cancel' content='Annuler' onClick={this.closeDelete}/>
                                    <Button color="red" icon='trash' content='Supprimer' onClick={this.deleteObjectAndDoc}/>
                                </Modal.Actions>
                            </Modal>
                        </Modal>
                    </Fragment>
                )
            }else{
                return (
                    <Fragment>
                        <Table.Row>
                            <Table.Cell>{this.props.so.name}</Table.Cell>
                            <Table.Cell textAlign="center">{parseFloat(this.props.so.size/1048576).toFixed(2)} Mo</Table.Cell>
                            <Table.Cell>{this.props.so.doc.originalFilename}</Table.Cell>
                            <Table.Cell textAlign="center">
                                <Label color='grey' image>
                                    {this.state.debug.obj}
                                    <Label.Detail>{this.state.debug.type}</Label.Detail>
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <Label color={(this.props.so.linkedObjInfos == "Not supported yet" ? "black" : "blue")}>
                                    {this.props.so.linkedObjInfos}
                                </Label>
                            </Table.Cell>
                            <Table.Cell textAlign="center">
                                <Button size='mini' style={{color:"#00a8ff"}} icon icon='search' onClick={()=>{this.setState({openDetails:true})}}/>
                            </Table.Cell>
                        </Table.Row>
                        <Modal open={this.state.openDetails} onClose={this.closeDetails}>
                            <Header icon='file' content={this.props.so.doc.name} />
                            <Modal.Content>
                                Stocké : <Label style={{marginRight:"16px"}}> {moment(this.props.so.doc.storageDate.split(" ")[0],"DD/MM/YYYY").fromNow()}</Label>
                                le {this.props.so.doc.storageDate.split(" ").join(" à ")}
                                <br/>
                                <p>{"Chemin : " + this.props.so.doc.path}</p>
                                <br/>
                                {this.getDownloadLink()}
                            </Modal.Content>
                            <Modal.Actions>
                                {this.getDownloadButton()}
                                <Button color='red' onClick={this.closeDetails}>
                                    <Icon name='cancel'/> Fermer
                                </Button>
                            </Modal.Actions>
                        </Modal>
                    </Fragment>
                )
            }
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(StoredObjectRow);