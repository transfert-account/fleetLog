
import React, { Component, Fragment } from 'react';
import { Modal, Input, Button, Form, Table, Header, Icon } from 'semantic-ui-react';

import VehiclePicker from '../atoms/VehiclePicker';
import InterventionNaturePicker from '../atoms/InterventionNaturePicker';

import M_EntretienMenu from '../molecules/M_EntretienMenu';
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

export class Curatif extends Component {

    state={
      filterAddPiece:"",
      newVehicle:"",
      newNature:"",
      piecesRaw:[],
      loadedPieces:[],
      createEntretienQuery: gql`
        mutation createEntretien($vehicle:String!,$nature:String!,$pieces:String!){
          createEntretien(vehicle:$vehicle,nature:$nature,pieces:$pieces){
            status
            message
            obj
          }
        }
      `,
      piecesAllQuery: gql`
        query piecesAll{
          piecesAll{
            _id
            type
            brand
            reference
            prixHT
            name
          }
        }
      `,
      types:[
        {name:'Pièces',add:'une pièce',key:"pie"},
        {name:'Pneumatiques',add:'un pneumatique',key:"pne"},
        {name:'Agents',add:'un agent',key:"age"},
        {name:'Outils',add:'une outil',key:"out"}
      ],
      getLoadedPieces:()=>{
        let stuffedLoadedPieces = this.state.loadedPieces;
        stuffedLoadedPieces = stuffedLoadedPieces.map(p=>{return Object.assign(this.state.piecesRaw.filter(r=> r._id == p._id)[0],{qty:p.qty})})        
        if(stuffedLoadedPieces.length == 0){
          return(
            <Table.Body>
              <Table.Row>
                <Table.Cell colSpan="5">
                  Aucune pièce à commander
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          )
        }else{
          let totalHT = 0;
          return(
            <Table.Body>
              {stuffedLoadedPieces.map(p=>{
                totalHT += parseFloat(p.prixHT*p.qty)
                return(
                  <Table.Row>
                    <Table.Cell><b>{p.name}</b><br/>{p.brand + " " + p.reference}</Table.Cell>
                    <Table.Cell textAlign="center">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(p.prixHT))}</Table.Cell>
                    <Table.Cell textAlign="center">{p.qty}</Table.Cell>
                    <Table.Cell textAlign="center">{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(p.prixHT*p.qty))}</Table.Cell>
                    <Table.Cell collapsing>
                      <Button icon onClick={()=>{this.changeQty(p._id,p.qty-1)}}><Icon name="minus"/></Button>
                      <Button icon onClick={()=>{this.changeQty(p._id,p.qty+1)}}><Icon name="plus"/></Button>
                      <Button icon color="red" onClick={()=>this.changeQty(p._id,0)}><Icon name="trash"/></Button>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
              <Table.Row>
                <Table.Cell colSpan="3" textAlign="right"><b>Total :</b></Table.Cell>
                <Table.Cell textAlign="center"><b>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parseFloat(totalHT))}</b></Table.Cell>
                <Table.Cell></Table.Cell>
              </Table.Row>
            </Table.Body>
          )
        }
      }
    }
    
    /*SHOW AND HIDE MODALS*/
    showAddPiece = () => {
      this.loadAllPieces();
      this.setState({
        openAddPiece: true
      })
    }
    closeAddPiece = () => {
      this.setState({
        openAddPiece: false
      })
    }
    /*CHANGE HANDLERS*/
    handleChangeVehicle = v => {
      this.setState({
        newVehicle:v
      })
    }
    handleChangeInterventionNature = (e,{value}) => {
      this.setState({
        newNature:value
      })
    }
    handleChange = e =>{
      this.setState({
        [e.target.name]:e.target.value
      });
    }
    addPiece = id => {
      let loadedPieces = this.state.loadedPieces
      loadedPieces.push({_id:id,qty:1})
      this.setState({
        loadedPieces:loadedPieces,
        openAddPiece:false
      })
    }
    changeQty = (id,qty) => {
      let pieces = this.state.loadedPieces;
      pieces.filter(p=>p._id == id)[0].qty = qty
      this.setState({
        loadedPieces:pieces.filter(p=>p.qty != 0)
      })
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    loadAllPieces = () => {
      this.props.client.query({
          query:this.state.piecesAllQuery,
          fetchPolicy:"network-only"
      }).then(({data})=>{
          this.setState({
              piecesRaw:data.piecesAll
          })
      })
    }
    createEntretien = () => {
      this.props.client.mutate({
        mutation:this.state.createEntretienQuery,
        variables:{
          vehicle:this.state.newVehicle,
          nature:this.state.newNature,
          pieces:JSON.stringify(this.state.loadedPieces.map(p=>{return({piece:p._id,qty:p.qty})}))
        }
      }).then(({data})=>{
        data.createEntretien.map(qrm=>{
          if(qrm.status){
            this.props.toast({message:qrm.message,type:"success"});
            this.props.history.push("/entretien/"+qrm.obj)
          }else{
            this.props.toast({message:qrm.message,type:"error"});
          }
        })
      })
    }
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
      this.loadAllPieces()
    }

    render() {return (
      <Fragment>
        <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px",gridTemplateRows:"auto 1fr auto",gridTemplateColumns:"auto 1fr auto"}}>
          <M_EntretienMenu active="curatif"/>
          <div style={{gridRowStart:"2",gridColumnEnd:"span 3",display:"grid",gridTemplateColumns:"minmax(320px,auto) 1fr",gridTemplateRows:"auto 1fr auto",overflowY:"auto",justifySelf:"stretch",gridGap:"64px",paddingTop:"16px"}}>
            <Form size="big" style={{display:"grid",gridTemplateRows:"auto auto auto auto 1fr",gridGap:"16px",placeSelf:"stretch",gridRowEnd:"span 3"}}>
              <Form.Field>
                <label>Véhicule</label>
                <VehiclePicker onChange={this.handleChangeVehicle} hideLocations/>
              </Form.Field>
              <Form.Field>
                <label>Nature de l'intervention</label>
                <InterventionNaturePicker onChange={this.handleChangeInterventionNature}/>
              </Form.Field>
              <Button size="big" onClick={this.showAddPiece} icon labelPosition="right">Ajouter une pièce à commander<Icon name="plus"/></Button>
              <Button size="big" disabled={this.state.newVehicle.length == 0 || this.state.newNature.length == 0} onClick={this.createEntretien} style={{marginTop:"16px"}} icon labelPosition="right">Créer l'entretien<Icon name="angle double right"/></Button>
            </Form>
            <div style={{gridColumnStart:"2"}}>
              <Header>Pièces</Header>
              <Table compact celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell textAlign="center">Pièces</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">Prix H.T.</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">Quantité</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">Total H.T.</Table.HeaderCell>
                    <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {this.state.getLoadedPieces()}
              </Table>
            </div>
          </div>
        </div>
        <Modal closeOnDimmerClick={false} open={this.state.openAddPiece} onClose={this.closeAddPiece} closeIcon>
          <Modal.Header>
              <Input size='big' placeholder="Filtrer les pièces à commander ..." fluid icon="search" iconPosition="left" name="filterAddPiece" onChange={this.handleChange}/>
          </Modal.Header>
          <Modal.Content style={{textAlign:"center"}}>
            <Modal.Description>
              <Table striped celled compact="very">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Type</Table.HeaderCell>
                    <Table.HeaderCell>Nom</Table.HeaderCell>
                    <Table.HeaderCell>Actions</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {this.state.piecesRaw.filter(p=>{
                    if(this.state.filterAddPiece.length > 0){
                      return (p.name.toLowerCase().includes(this.state.filterAddPiece.toLowerCase()))
                    }else{
                      return true
                    }
                  }).map(p=>{
                    return(
                      <Table.Row key={p._id}>
                        <Table.Cell collapsing>{this.state.types.filter(t=>t.key == p.type)[0].name}</Table.Cell>
                        <Table.Cell>{p.name}</Table.Cell>
                        <Table.Cell collapsing>
                          <Button disabled={this.state.loadedPieces.filter(l=>l.id == p._id).length > 0} onClick={()=>{this.addPiece(p._id)}} icon>
                            <Icon name="shopping cart"/>
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <Button color="blue" onClick={this.closeAddPiece}>Créer</Button>
          </Modal.Actions>
        </Modal>
      </Fragment>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withRouter(withUserContext(Curatif));