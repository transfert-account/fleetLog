import React, { Component } from 'react';
import { Icon,Menu,Input,Button,Table,Modal,Form,Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import FournisseurRow from '../molecules/FournisseurRow';
import { gql } from 'apollo-server-express'

class Fournisseurs extends Component {

  state={
    fournisseurFilter:"",
    newName:"",
    openAddFournisseur:false,
    fournisseursRaw:[],
    fournisseurs : () => {
      let displayed = Array.from(this.state.fournisseursRaw);
      if(this.state.fournisseurFilter.length>1){
          displayed = displayed.filter(f =>
              f.name.toLowerCase().includes(this.state.fournisseurFilter.toLowerCase())
          );
          if(displayed.length == 0){
            return(
              <Table.Row key={"none"}>
                <Table.Cell width={16} colSpan='14' textAlign="center">
                  <p>Aucune fournisseur ne correspond à ce filtre</p>
                </Table.Cell>
              </Table.Row>
            )
          }
      }
      return displayed.map(f =>(
          <FournisseurRow loadFournisseurs={this.loadFournisseurs} key={f._id} fournisseur={f}/>
      ))
    },
    addFournisseurQuery : gql`
        mutation addFournisseur($name:String!){
          addFournisseur(name:$name)
        }
    `,
    fournisseursQuery : gql`
        query fournisseurs{
          fournisseurs{
            _id
            name
            phone
            mail
            address
          }
        }
    `
  }

  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }

  showAddFournisseur = () => {
    this.setState({
      openAddFournisseur:true
    })
  }

  closeAddFournisseur = () => {
    this.setState({
      openAddFournisseur:false
    })
  }

  loadFournisseurs = () => {
    this.props.client.query({
        query:this.state.fournisseursQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
          fournisseursRaw:data.fournisseurs
        })
    })
  }

  addFournisseur = () => {
    this.closeAddFournisseur()
    this.props.client.mutate({
        mutation:this.state.addFournisseurQuery,
        variables:{
            name:this.state.newName
        }
    }).then(({data})=>{
        this.loadFournisseurs();
    })
  }

  componentDidMount = () => {
    this.loadFournisseurs();
  }

  render() {
    return (
        <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
            <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="storeFilter" onChange={e=>{this.handleFilter(e.target.value)}} icon='search' placeholder='Rechercher un item ... (3 caractères minimum)' />
            <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddFournisseur} icon labelPosition='right'>Ajouter un fournisseur<Icon name='plus'/></Button>
            <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>Véhicule</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                    </Table.Body>
                </Table>
            </div>
            <Modal closeOnDimmerClick={false} open={this.state.openAddFournisseur} onClose={this.closeAddFournisseur} closeIcon>
                <Modal.Header>
                    Création du rapport d'accident
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                        <Form.Field><Input value={this.state.newName} onChange={this.handleChange} placeholder="" name="newName"/></Form.Field>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="blue" onClick={this.addFournisseur}>Créer</Button>
                </Modal.Actions>
            </Modal>
        </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Fournisseurs);