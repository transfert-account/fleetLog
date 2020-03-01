import React, { Component } from 'react'
import { Button, Icon, Message, Input } from 'semantic-ui-react';

class FileManagementPanel extends Component {

    render() {
        if(this.props.fileInfos._id != "" && this.props.fileInfos._id != undefined){
            return (
                <div style={{display:"grid",gridTemplateRows:"auto 1fr auto auto",gridTemplateColumns:"1fr 1fr",gridGap:"6px"}}>
                    <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>{this.props.title}</p>
                    <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr 2fr",gridTemplateRows:"1fr 1fr 1fr 1fr"}} color="grey">
                        <p className="gridLabel">Nom du fichier :</p>
                        <p className="gridValue">{this.props.fileInfos.originalFilename}</p>
                        <p className="gridLabel">Réference dépot :</p>
                        <p className="gridValue">{this.props.fileInfos.name}</p>
                        <p className="gridLabel">Taille du fichier:</p>
                        <p className="gridValue">{parseFloat(this.props.fileInfos.size/1048576).toFixed(2)} Mo</p>
                        <p className="gridLabel">Enregistré le :</p>
                        <p className="gridValue">{this.props.fileInfos.storageDate}</p>
                    </Message>
                    <Input onChange={e=>{this.props.handleInputFile(this.props.fileTarget,e)}} style={{gridColumnEnd:"span 2"}} type='file' />
                    <Button color="blue" disabled={this.props.importLocked} onClick={this.props.uploadDoc}>Importer</Button>
                    <Button color="black" onClick={this.props.downloadDoc}>Telecharger</Button>
                </div>
            )
        }else{
            return (
                <div style={{display:"grid",gridTemplateRows:"auto 1fr auto auto",gridTemplateColumns:"1fr 1fr",gridGap:"6px"}}>
                    <p style={{gridColumnEnd:"span 2"}}><Icon name='folder open'/>{this.props.title}</p>
                    <Message style={{gridColumnEnd:"span 2",display:"grid",gridTemplateColumns:"1fr",gridTemplateRows:"1fr"}} color="grey">
                        <p>Aucun fichier</p>
                    </Message>
                    <Input onChange={e=>{this.props.handleInputFile(this.props.fileTarget,e)}} style={{gridColumnEnd:"span 2"}} type='file' />
                    <Button color="blue" disabled={this.props.importLocked} onClick={this.props.uploadDoc}>Importer</Button>
                    <Button color="black" disabled onClick={this.props.downloadDoc}>Telecharger</Button>
                </div>
            )
        }
    }
}

export default FileManagementPanel
