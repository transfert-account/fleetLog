import React, { Component, Fragment } from 'react';
import { Segment, Dropdown, Modal, Menu, Button, Header, Icon, Form } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

export class Content extends Component {

  state = {
    selected:false,
    societesRaw:[],
    addSocieteQuery : gql`
        mutation addSociete($trikey:String!,$name:String!){
            addSociete(trikey:$trikey,name:$name){
                _id
                trikey
                name
            }
        }
    `,
    deleteSocieteQuery : gql`
        mutation deleteSociete($_id:String!){
            deleteSociete(_id:$_id){
                _id
                trikey
                name
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
    `
  }

  loadSocietes = () => {
    this.props.client.query({
        query:this.state.societesQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
            societesRaw:data.societes
        })
    })
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

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
        this.loadSocietes();
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
        this.loadSocietes();
    })
  }

  getMenu = () => {
    if(this.props.user.isOwner){
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Equipements</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
        </Menu>
      )
    }else{
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Equipements</Menu.Item>
            <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
        </Menu>
      )
    }
  }

  componentDidMount = () => {
      this.loadSocietes()
  }

  render() {
    return (
        <Fragment>
            <div>
                <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                {this.getMenu()}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"32px"}}>
                    <Segment raised style={{display:"grid",gridGap:"16px",placeSelf:"stretch",marginTop:"16px",padding:"24px 0",gridTemplateColumns:"auto 1fr auto",gridTemplateRows:"auto 1fr"}}>
                        <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
                            <Icon name='sitemap' />
                            <Header.Content>Gérer les sociétés du groupe</Header.Content>
                        </Header>
                        <Form style={{gridRowStart:"2",gridColumnEnd:"span 3",placeSelf:"center",display:"grid",gridTemplateColumns:"4fr 1fr 1fr",gridTemplateRows:"1fr 1fr",gridGap:"8px",gridColumnGap:"32px",margin:"16px 48px 0 48px"}}>
                            <Dropdown placeholder='Choisir un société' search selection onChange={this.handleChangeSociete} value={this.state.selectedSociete} options={this.state.societesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
                            <Button color="red" onClick={this.showDelSociete} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                            <Button color="blue" onClick={this.showAddSociete} icon labelPosition='right'>Créer<Icon name='plus'/></Button>
                        </Form>
                    </Segment>
                </div>
            </div>
            <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddSociete} onClose={this.closeAddSociete} closeIcon>
                <Modal.Header>
                    Création de la société
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateRows:"1fr 1fr 1fr",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gridGap:"16px"}}>
                        <Form.Field><label>Nom de la société</label><input onChange={this.handleChange} name="nameSociete"/></Form.Field>
                        <Form.Field><label>Trigramme</label><input onChange={this.handleChange} name="trikeySociete"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.addSociete}>Créer</Button>
                </Modal.Actions>
            </Modal>
            <Modal closeOnDimmerClick={false} open={this.state.openDelSociete} onClose={this.closeDelSociete} closeIcon>
                <Modal.Header>
                    Suppression de la société
                </Modal.Header>
                <Modal.Actions>
                    <Button color="red" onClick={this.deleteSociete}>Supprimer</Button>
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
