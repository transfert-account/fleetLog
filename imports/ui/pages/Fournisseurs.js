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
            f.name.toLowerCase().includes(this.state.fournisseurFilter.toLowerCase()) ||
            f.mail.toLowerCase().includes(this.state.fournisseurFilter.toLowerCase()) ||
            f.address.toLowerCase().includes(this.state.fournisseurFilter.toLowerCase())
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
          addFournisseur(name:$name){
                status
                message
            }
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

  handleFilter = e =>{
    this.setState({
        fournisseurFilter:e.target.value
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
        data.addFournisseur.map(qrm=>{
            if(qrm.status){
                this.props.toast({message:qrm.message,type:"success"});
                this.loadFournisseurs();
            }else{
                this.props.toast({message:qrm.message,type:"error"});
            }
        })
    })
  }

  componentDidMount = () => {
    this.loadFournisseurs();
  }

  render() {
    return (
        <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"32px",gridTemplateRows:"auto 1fr",gridTemplateColumns:"auto 1fr auto"}}>
            <Input style={{justifySelf:"stretch",gridColumnEnd:"span 2"}} name="storeFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher un nom, une adresse ou un mail' />
            <Button color="blue" style={{justifySelf:"stretch"}} onClick={this.showAddFournisseur} icon labelPosition='right'>Ajouter un fournisseur<Icon name='plus'/></Button>
            <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"block",overflowY:"auto",justifySelf:"stretch"}}>
                <Table style={{marginBottom:"0"}} celled selectable color="blue" compact>
                    <Table.Header>
                        <Table.Row textAlign='center'>
                            <Table.HeaderCell>Nom</Table.HeaderCell>
                            <Table.HeaderCell>Téléphone</Table.HeaderCell>
                            <Table.HeaderCell>Mail</Table.HeaderCell>
                            <Table.HeaderCell>Adresse</Table.HeaderCell>
                            <Table.HeaderCell>Actions</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {this.state.fournisseurs()}
                    </Table.Body>
                </Table>
            </div>
            <Modal size="tiny" closeOnDimmerClick={false} open={this.state.openAddFournisseur} onClose={this.closeAddFournisseur} closeIcon>
                <Modal.Header>
                    Création du fournisseur
                </Modal.Header>
                <Modal.Content style={{textAlign:"center"}}>
                    <Form style={{display:"grid",gridTemplateRows:"1fr 1fr",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                        <Form.Field><Input value={this.state.newName} onChange={this.handleChange} placeholder="Nom du fournisseur" name="newName"/></Form.Field>
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