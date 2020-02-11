import React, { Component, Fragment } from 'react';
import { Segment, Modal, Menu, Button, Header, Icon, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import SocietePicker from '../atoms/SocietePicker';
import VolumePicker from '../atoms/VolumePicker';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

export class Content extends Component {

  state = {
    selected:false,
    newVolume:0.0,
    needToRefreshSocietes:false,
    needToRefreshVolumes:false,
    addSocieteQuery : gql`
        mutation addSociete($trikey:String!,$name:String!){
            addSociete(trikey:$trikey,name:$name){
                status
                message
            }
        }
    `,
    deleteSocieteQuery : gql`
        mutation deleteSociete($_id:String!){
            deleteSociete(_id:$_id){
                status
                message
            }
        }
    `,
    societesQuery : gql`
        query societes{
            societes{
                _id
                trikey
                name
            }
        }
    `,
    addVolumeQuery : gql`
        mutation addVolume($meterCube:Float!){
            addVolume(meterCube:$meterCube)
        }
    `,
    deleteVolumeQuery : gql`
        mutation deleteVolume($_id:String!){
            deleteVolume(_id:$_id)
        }
    `,
    volumesQuery : gql`
        query volumes{
            volumes{
                _id
                meterCube
            }
        }
    `
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  handleVolumeChange = e =>{
    this.setState({
      newVolume : parseFloat(e.target.value)
    });
  }

  //Societes
  handleChangeSociete = (e, { value }) => this.setState({ selectedSociete:value })
  showAddSociete = () => {
    this.setState({
        openAddSociete:true
    })
  }
  showDelSociete = () => {
    this.setState({
        openDelSociete:true
    })
  }
  closeAddSociete = () => {
    this.setState({
        openAddSociete:false
    })
  }
  closeDelSociete = () => {
    this.setState({
        openDelSociete:false
    })
  }
  addSociete = () => {
    this.closeAddSociete()
    this.props.client.mutate({
        mutation:this.state.addSocieteQuery,
        variables:{
            trikey:this.state.trikeySociete,
            name:this.state.nameSociete
        }
    }).then(({data})=>{
        data.addSociete.map(qrm=>{
            if(qrm.status){
                this.props.toast({message:qrm.message,type:"success"});
                this.setState({
                    needToRefreshSocietes:true
                })
            }else{
                this.props.toast({message:qrm.message,type:"error"});
            }
        })
    })
  }
  deleteSociete = () => {
      this.closeDelSociete()
      this.props.client.mutate({
        mutation:this.state.deleteSocieteQuery,
        variables:{
            _id:this.state.selectedSociete
        }
    }).then(({data})=>{
        data.deleteSociete.map(qrm=>{
            if(qrm.status){
                this.props.toast({message:qrm.message,type:"success"});
                this.setState({
                    needToRefreshSocietes:true
                })
            }else{
                this.props.toast({message:qrm.message,type:"error"});
            }
        })
    })
  }
  didRefreshSocietes = () => {
    this.setState({
        needToRefreshSocietes:false
    })
  }

  //Volume
  handleChangeVolume = (e, { value }) => this.setState({ selectedVolume:value })
  showAddVolume = () => {
    this.setState({
        openAddVolume:true
    })
  }
  showDelVolume = () => {
    this.setState({
        openDelVolume:true
    })
  }
  closeAddVolume = () => {
    this.setState({
        openAddVolume:false
    })
  }
  closeDelVolume = () => {
    this.setState({
        openDelVolume:false
    })
  }
  addVolume = () => {
    this.closeAddVolume()
    this.props.client.mutate({
        mutation:this.state.addVolumeQuery,
        variables:{
            meterCube:this.state.newVolume
        }
    }).then(({data})=>{
        this.setState({
            needToRefreshVolumes:true
        })
    })
  }
  deleteVolume = () => {
      this.closeDelVolume()
      this.props.client.mutate({
        mutation:this.state.deleteVolumeQuery,
        variables:{
            _id:this.state.selectedVolume
        }
    }).then(({data})=>{
        this.setState({
            needToRefreshVolumes:true
        })
    })
  }
  didRefreshVolumes = () => {
    this.setState({
        needToRefreshVolumes:false
    })
  }

  getMenu = () => {
    if(this.props.user.isOwner){
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
        </Menu>
      )
    }else{
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
        </Menu>
      )
    }
  }

  render() {
    return (
        <Fragment>
            <div>
                <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                    {this.getMenu()}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"32px"}}>
                    <Segment raised style={{placeSelf:"stretch",display:"grid",gridGap:"16px",placeSelf:"stretch",margin:"0",padding:"24px 0",gridTemplateColumns:"auto 1fr auto",gridTemplateRows:"auto 1fr"}}>
                        <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
                            <Icon name='sitemap' />
                            <Header.Content>Sociétés du groupe</Header.Content>
                        </Header>
                        <Form style={{gridRowStart:"2",gridColumnEnd:"span 3",placeSelf:"center",display:"grid",gridTemplateColumns:"4fr 1fr 1fr",gridTemplateRows:"1fr 1fr",gridGap:"8px",gridColumnGap:"32px",margin:"16px 48px 0 48px"}}>
                            <SocietePicker didRefresh={this.didRefreshSocietes} needToRefresh={this.state.needToRefreshSocietes} groupAppears={false} onChange={this.handleChangeSociete} value={this.state.selectedSociete} />
                            <Button color="red" onClick={this.showDelSociete} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                            <Button color="blue" onClick={this.showAddSociete} icon labelPosition='right'>Créer<Icon name='plus'/></Button>
                        </Form>
                    </Segment>
                    <Segment raised style={{placeSelf:"stretch",display:"grid",gridGap:"16px",placeSelf:"stretch",margin:"0",padding:"24px 0",gridTemplateColumns:"auto 1fr auto",gridTemplateRows:"auto 1fr"}}>
                        <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
                            <Icon name='expand arrows alternate' />
                            <Header.Content>Volumes des véhicules</Header.Content>
                        </Header>
                        <Form style={{gridRowStart:"2",gridColumnEnd:"span 3",placeSelf:"center",display:"grid",gridTemplateColumns:"4fr 1fr 1fr",gridTemplateRows:"1fr 1fr",gridGap:"8px",gridColumnGap:"32px",margin:"16px 48px 0 48px"}}>
                            <VolumePicker didRefresh={this.didRefreshVolumes} needToRefresh={this.state.needToRefreshVolumes} onChange={this.handleChangeVolume} value={this.state.selectedVolume} />
                            <Button color="red" onClick={this.showDelVolume} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                            <Button color="blue" onClick={this.showAddVolume} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                        </Form>
                    </Segment>
                </div>
            </div>
            <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddSociete} onClose={this.closeAddSociete} closeIcon>
                <Modal.Header>
                    Création de la société
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                        <Form.Field style={{placeSelf:"stretch"}}><label>Nom de la société</label><input onChange={this.handleChange} name="nameSociete"/></Form.Field>
                        <Form.Field style={{placeSelf:"stretch"}}><label>Trigramme</label><input onChange={this.handleChange} name="trikeySociete"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.addSociete}>Créer</Button>
                </Modal.Actions>
            </Modal>
            <Modal closeOnDimmerClick={false} open={this.state.openDelSociete} onClose={this.closeDelSociete} closeIcon>
                <Modal.Header>
                    Suppression de la société : êtes vous sûr ?
                </Modal.Header>
                <Modal.Actions>
                    <Button color="red" onClick={this.deleteSociete}>Supprimer</Button>
                </Modal.Actions>
            </Modal>
            <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddVolume} onClose={this.closeAddVolume} closeIcon>
                <Modal.Header>
                    Ajout du volume
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                        <Form.Field style={{placeSelf:"stretch"}}><label>Volume</label><input onChange={this.handleVolumeChange} name="newVolume"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.addVolume}>Créer</Button>
                </Modal.Actions>
            </Modal>
            <Modal closeOnDimmerClick={false} open={this.state.openDelVolume} onClose={this.closeDelVolume} closeIcon>
                <Modal.Header>
                    Suppression du volume
                </Modal.Header>
                <Modal.Actions>
                    <Button color="red" onClick={this.deleteVolume}>Supprimer</Button>
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

export default wrappedInUserContext = withUserContext(withRouter(Content));
