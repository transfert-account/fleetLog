import React, { Component, Fragment } from 'react'
import { Button, Icon, Message, Input, Modal, Header, Segment } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';

class FileManagementPanel extends Component {

    state = {
        signedDownloadLink:"",
        linkGenerated:false,
        linkGenerating:false,
        displayStoredFileName:false,
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

    render() {
        console.log(this.props)
        if(this.props.fileInfos._id != "" && this.props.fileInfos._id != undefined){
            return (
                <Fragment>
                    <Segment raised style={{margin:"4px"}}>
                        <div style={{display:"grid",gridTemplateRows:"auto 1fr auto auto",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridGap:"6px"}}>
                            <p style={{gridColumnEnd:"span 4"}}><Icon name='folder open'/>{this.props.title}</p>
                            <Message color="green" style={{gridColumnEnd:"span 4",display:"grid",gridTemplateColumns:"auto 1fr",gridTemplateRows:"auto auto auto 1fr"}}>
                                <p className="gridLabel">Nom du fichier :</p>
                                <p className="gridValue">{this.props.fileInfos.originalFilename}</p>
                                <p className="gridLabel">Taille du fichier:</p>
                                <p className="gridValue">{parseFloat(this.props.fileInfos.size/1048576).toFixed(2)} Mo</p>
                                <p className="gridLabel">Enregistré le :</p>
                                <p className="gridValue">{this.props.fileInfos.storageDate}</p>
                            </Message>
                            <Input onChange={e=>{this.props.handleInputFile(this.props.fileTarget,e)}} style={{gridColumnEnd:"span 4"}} type='file' />
                            <Button style={{gridColumnEnd:"span 2"}} color="blue" disabled={this.props.importLocked} onClick={this.props.uploadDoc}>Importer</Button>
                            {this.getDownloadButton()}
                            <Button onClick={()=>{this.setState({displayStoredFileName:true})}}>Nom S3</Button>
                        </div>
                    </Segment>
                    <Modal open={this.state.displayStoredFileName} onClose={()=>this.setState({displayStoredFileName:false})} basic size='small'>
                        <Header icon='file' content='Voici le nom complet du fichier dans le bucket Amazon S3' />
                        <Modal.Content>
                            <p>
                                {this.props.fileInfos.name}
                            </p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color='red' onClick={()=>this.setState({displayStoredFileName:false})} inverted>
                                <Icon name='cancel' /> Fermer
                            </Button>
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
        }else{
            return (
                <Segment raised style={{margin:"4px"}}>
                    <div style={{display:"grid",gridTemplateRows:"auto 1fr auto auto",gridTemplateColumns:"1fr 1fr",gridGap:"6px"}}>
                        <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>{this.props.title}</p>
                        <Message color="red" style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr"}}>
                            <p>Aucun fichier</p>
                        </Message>
                        <Input onChange={e=>{this.props.handleInputFile(this.props.fileTarget,e)}} style={{gridColumnEnd:"span 2"}} type='file' />
                        <Button color="blue" disabled={this.props.importLocked} onClick={this.props.uploadDoc}>Importer</Button>
                        <Button color="black" disabled onClick={this.props.downloadDoc}>Telecharger</Button>
                    </div>
                </Segment>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(FileManagementPanel);