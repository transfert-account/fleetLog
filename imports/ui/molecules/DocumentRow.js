import React, { Component, Fragment } from 'react'
import { Table, Icon, Message, Button, Modal, Header, Label } from 'semantic-ui-react';
import SocietePicker from '../atoms/SocietePicker';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';
import moment from 'moment';
import 'moment/locale/fr';

export class AccountRow extends Component {

    state={
        openDelete:false,
        displayStoredFileName:false,
        signedDownloadLink:"",
        linkGenerated:false,
        linkGenerating:false,
        displayDownloadLink:false,
        getSignedDocumentDownloadLinkQuery : gql`
            query getSignedDocumentDownloadLink($_id: String!) {
                getSignedDocumentDownloadLink(_id:$_id)
            }
        `
    }

    getSignedDocumentDownloadLink = () => {
        this.setState({
            linkGenerating:true
        })
        this.props.client.query({
            query:this.state.getSignedDocumentDownloadLinkQuery,
            variables:{
                _id:this.props.fileInfos._id
            }
        }).then((data)=>{
            this.setState({
                linkGenerated:true,
                linkGenerating:false,
                signedDownloadLink:data.data.getSignedDocumentDownloadLink
            })
        })
    }

    getDownloadButton = () => {
        if(this.state.linkGenerated){
            return (
                <Button color="black" onClick={()=>{this.setState({displayDownloadLink:true})}}>Afficher</Button>
            )
        }else{
            if(this.state.linkGenerating){
                return (
                    <Button color="black" loading></Button>
                )
            }else{
                return (
                    <Button color="black" onClick={this.getSignedDocumentDownloadLink}>Générer</Button>
                )
            }
        }
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

    render() {
        return (
            <Fragment>
                <Table.Row>
                    <Table.Cell>{this.props.document.originalFilename}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.document.type}</Table.Cell>
                    <Table.Cell textAlign="center">{this.props.document.ext}</Table.Cell>
                    <Table.Cell textAlign="center">{parseFloat(this.props.document.size/1048576).toFixed(2)} Mo</Table.Cell>
                    <Table.Cell textAlign="center">
                        {<Label style={{marginRight:"16px"}}> {moment(this.props.document.storageDate.split(" ")[0], "DD/MM/YYYY").fromNow()}</Label>}
                        le {this.props.document.storageDate.split(" ").join(" à ")}
                    </Table.Cell>
                    <Table.Cell textAlign="center">
                        <Button circular style={{color:"#00a8ff"}} inverted icon icon='search' onClick={()=>{this.setState({displayStoredFileName:true})}}/>
                        {/*<Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={()=>{console.log("delete : " + this.props.document.originalFilename)}}/>*/}
                    </Table.Cell>
                </Table.Row>
                {/*path + name*/}
                <Modal open={this.state.displayStoredFileName} onClose={()=>this.setState({displayStoredFileName:false})} basic size='small'>
                    <Header icon='file' content='Voici le nom complet du fichier et son chemin dans le bucket Amazon S3' />
                    <Modal.Content>
                        <p>
                            Nom : {this.props.document.name}
                        </p>
                        <p>
                            Chemin : {this.props.document.path}
                        </p>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' onClick={()=>this.setState({displayStoredFileName:false})} inverted>
                            <Icon name='cancel' /> Fermer
                        </Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} dimmer="inverted" size="small" open={this.state.openDelete} onClose={this.closeDelete} closeIcon>
                    <Modal.Header>
                        Confirmez la suppression du compte:
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Message color='red' icon>
                            <Icon name='warning sign'/>
                            <Message.Content style={{display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr"}}>
                                <p style={{margin:"8px 4px",placeSelf:"center end"}}>Nom du fichier :</p>
                                <p style={{margin:"8px 4px",fontWeight:"800",placeSelf:"center start"}}>
                                    {this.props.document.name}
                                </p>
                                <p style={{margin:"8px 4px",placeSelf:"center end"}}>Nom d'origine :</p>
                                <p style={{margin:"8px 4px",fontWeight:"800",placeSelf:"center start"}}>
                                    {this.props.document.originalFilename}
                                </p>
                            </Message.Content>
                        </Message>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelete}>Annuler</Button>
                        <Button color="red" onClick={()=>{this.props.deleteDocument(this.props.document._id)}}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal open={this.state.displayDownloadLink} onClose={()=>this.setState({displayDownloadLink:false,linkGenerated:false,signedDownloadLink:""})} basic size='small'>
                    <Header icon='file' content='Voici le lien de téléchargement, il est valide pendant 2 minutes à partir de sa génération' />
                    <Modal.Content>
                        <a href={this.state.signedDownloadLink} target="blank" download>{this.state.signedDownloadLink}</a>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button basic color='red' onClick={()=>this.setState({displayDownloadLink:false,linkGenerated:false,signedDownloadLink:""})} inverted>
                            <Icon name='cancel' /> Fermer
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(AccountRow);