import React, { Component, Fragment } from 'react';
import { Modal, Menu, Button, Icon, Form, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import PieceRow from '../molecules/PieceRow'
import gql from 'graphql-tag';

export class Pieces extends Component {

    state = {
        selected:false,
        currentTypePiece:"",
        piecesFilter:"",
        newName:"",
        openAddPiece:false,
        addPieceQuery : gql`
            mutation addPiece($name:String!,$type:String!){
                addPiece(name:$name,type:$type)
            }
        `,
        piecesQuery : gql`
            query allPieces{
                allPieces{
                    _id
                    type
                    name
                }
            }
        `,
        piecesRaw:[],
        pieces : type => {
            let displayed = Array.from(this.state.piecesRaw);
            if(this.state.piecesFilter.length>1){
                displayed = displayed.filter(p =>
                    p.name.toLowerCase().includes(this.state.piecesFilter.toLowerCase())
                );
                if(displayed.length == 0){
                    return(
                    <Table.Row key={"none"}>
                        <Table.Cell width={16} colSpan='2' textAlign="center">
                        <p>Aucune ligne ne correspond</p>
                        </Table.Cell>
                    </Table.Row>
                    )
                }
            }
            displayed = displayed.filter(p =>
                p.type == type
            );
            return displayed.map(p =>(
                <PieceRow loadAllPieces={this.loadAllPieces} key={p._id} piece={p}/>
            ))
        }
    }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  openAddPiece = (type) => {
    this.setState({
        currentTypePiece:type,
        openAddPiece:true
    })
  }

  closeAddPiece = () => {
    this.setState({
        currentTypePiece:"",
        openAddPiece:false
    })
  }

  loadAllPieces = () => {
    this.props.client.query({
        query:this.state.piecesQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
          piecesRaw:data.allPieces
        })
    })
  }

  getMenu = () => {
    if(this.props.user.isOwner){
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Equipements</Menu.Item>
            <Menu.Item color="blue" name='pieces' active onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
        </Menu>
      )
    }else{
      return (
        <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
            <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
            <Menu.Item color="blue" name='controls' onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
            <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Equipements</Menu.Item>
            <Menu.Item color="blue" name='pieces' active onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
        </Menu>
      )
    }
  }

  componentDidMount = () => {
      this.loadAllPieces();
  }

  addPiece = () => {
    this.props.client.mutate({
        mutation:this.state.addPieceQuery,
        variables:{
            name:this.state.newName,
            type:this.state.currentTypePiece
        }
    }).then(({data})=>{
        this.loadAllPieces()
    })
    this.closeAddPiece();
  }

  getAddPieceModal = () => {
      if(this.state.openAddPiece){
        if(this.state.currentTypePiece == "pie"){
            return (
                <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddPiece} onClose={this.closeAddPiece} closeIcon>
                    <Modal.Header>
                        Ajout de la piece au répértoire
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form>
                            <Form.Field><label>Designation de la piece</label><input onChange={this.handleChange} name="newName"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="teal" onClick={this.addPiece}>Ajouter</Button>
                    </Modal.Actions>
                </Modal>
            )
        }
        if(this.state.currentTypePiece == "pne"){
        return (
            <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddPiece} onClose={this.closeAddPiece} closeIcon>
                <Modal.Header>
                    Ajout du pneumatique au répértoire
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form>
                        <Form.Field><label>Designation du pneumatique</label><input onChange={this.handleChange} name="newName"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.addPiece}>Ajouter</Button>
                </Modal.Actions>
            </Modal>
        )
        }
        if(this.state.currentTypePiece == "age"){
        return (
            <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddPiece} onClose={this.closeAddPiece} closeIcon>
                <Modal.Header>
                    Ajout de l'agent au répértoire
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form>
                        <Form.Field><label>Designation de l'agent</label><input onChange={this.handleChange} name="newName"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="violet" onClick={this.addPiece}>Ajouter</Button>
                </Modal.Actions>
            </Modal>
        )
        }
        if(this.state.currentTypePiece == "out"){
        return (
            <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddPiece} onClose={this.closeAddPiece} closeIcon>
                <Modal.Header>
                    Ajout de l'outil au répértoire
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form>
                        <Form.Field><label>Designation de l'outil</label><input onChange={this.handleChange} name="newName"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="purple" onClick={this.addPiece}>Ajouter</Button>
                </Modal.Actions>
            </Modal>
        )
        }
      }
  }

  render() {
    return (
        <Fragment>
            <div style={{display:"grid",gridTemplateRows:'auto auto'}}>
                <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                    {this.getMenu()}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gridGap:"12px 16px"}}>
                    <Button color="teal" onClick={()=>{this.openAddPiece("pie")}}>+</Button>
                    <Button color="blue" onClick={()=>{this.openAddPiece("pne")}}>+</Button>
                    <Button color="violet" onClick={()=>{this.openAddPiece("age")}}>+</Button>
                    <Button color="purple" onClick={()=>{this.openAddPiece("out")}}>+</Button>
                    <Table compact='very' celled striped color="teal" style={{margin:"0 auto auto auto"}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={12}>Pieces</Table.HeaderCell>
                                <Table.HeaderCell width={4}></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.pieces("pie")}
                        </Table.Body>
                    </Table>
                    <Table compact='very' celled striped color="blue" style={{margin:"0 auto auto auto"}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={12}>Pneumatiques</Table.HeaderCell>
                                <Table.HeaderCell width={4}></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.pieces("pne")}
                        </Table.Body>
                    </Table>
                    <Table compact='very' celled striped color="violet" style={{margin:"0 auto auto auto"}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={12}>Agents</Table.HeaderCell>
                                <Table.HeaderCell width={4}></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.pieces("age")}
                        </Table.Body>
                    </Table>
                    <Table compact='very' celled striped color="purple" style={{margin:"0 auto auto auto"}}>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell width={12}>Outils</Table.HeaderCell>
                                <Table.HeaderCell width={4}></Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {this.state.pieces("out")}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            {this.getAddPieceModal()}
        </Fragment>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Pieces));
