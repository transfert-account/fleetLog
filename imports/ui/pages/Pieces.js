import React, { Component, Fragment } from 'react';
import { Modal, Menu, Button, Form, Table, Icon } from 'semantic-ui-react';

import EntretienMenu from '../molecules/EntretienMenu';
import PieceRow from '../molecules/PieceRow'

import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';

export class Pieces extends Component {

    state = {
        activeType:"pie",
        newPieceName:"",
        newPieceBrand:"",
        newPieceReference:"",
        newPiecePrixHT:"",
        openAddPiece:false,
        types:[
            {name:'Pièces',add:'une pièce',key:"pie",icon:"cogs"},
            {name:'Pneumatiques',add:'un pneumatique',key:"pne",icon:"cog"},
            {name:'Agents',add:'un agent',key:"age",icon:"tint"},
            {name:'Outils',add:'une outil',key:"out",icon:"wrench"}
        ],
        addPieceQuery : gql`
            mutation addPiece($name:String!,$brand:String!,$reference:String!,$prixHT:Float!,$type:String!){
                addPiece(name:$name,brand:$brand,reference:$reference,prixHT:$prixHT,type:$type){
                    status
                    message
                }
            }
        `,
        piecesQuery : gql`
            query piecesAll{
                piecesAll{
                    _id
                    name
                    brand
                    reference
                    prixHT
                    type
                }
            }
        `,
        piecesRaw:[],
        pieces : () => {
            let displayed = Array.from(this.state.piecesRaw);
            displayed = displayed.filter(p =>
                p.type == this.state.activeType
            );
            return displayed.map(p =>(
                <PieceRow loadAllPieces={this.loadAllPieces} key={p._id} piece={p}/>
            ))
        }
    }

    /*SHOW AND HIDE MODALS*/
    showAddPiece = () => {
        this.setState({
            openAddPiece:true
        })
    }
    closeAddPiece = () => {
        this.setState({
            openAddPiece:false
        })
    }
    /*CHANGE HANDLERS*/
    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    addPiece = () => {
        this.props.client.mutate({
            mutation:this.state.addPieceQuery,
            variables:{
                name:this.state.newPieceName,
                brand:this.state.newPieceBrand,
                reference:this.state.newPieceReference,
                prixHT:parseFloat(this.state.newPiecePrixHT),
                type:this.state.activeType
            }
        }).then(({data})=>{
            data.addPiece.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.loadAllPieces();
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
        this.closeAddPiece();
    }
    loadAllPieces = () => {
        this.props.client.query({
            query:this.state.piecesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                piecesRaw:data.piecesAll
            })
        })
    }
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/
    componentDidMount = () => {
        this.loadAllPieces();
    }

    render() {
        return (
            <Fragment>
                <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px 32px",gridTemplateRows:"auto auto auto 1fr",gridTemplateColumns:"auto 1fr"}}>
                    <EntretienMenu active="pieces" style={{gridColumnEnd:"span 2",placeSelf:"start"}}/>
                    <Menu size='big' pointing vertical style={{gridColumnStart:"1",placeSelf:"start",margin:"0"}}>
                        {this.state.types.map(t=>{
                            return <Menu.Item key={t.key} color="blue" name={t.name} active={this.state.activeType == t.key} onClick={()=>{this.setState({activeType:t.key})}} icon={t.icon}/>
                        })}
                    </Menu>
                    <Button size='big' style={{gridColumnStart:"1"}} icon labelPosition="right" onClick={this.showAddPiece}>Créer {this.state.types.filter(t=>t.key == this.state.activeType)[0].add}<Icon name='plus'/></Button>
                    <div style={{gridRowStart:"2",gridColumnStart:"2",gridRowEnd:"span 3",paddingRight:"32px",overflowY:"scroll"}}>
                        <Table compact celled striped color="blue" style={{margin:"0"}}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell textAlign="center">Nom</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Marque</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Référence</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Prix unitaire H.T.</Table.HeaderCell>
                                    <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.pieces()}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddPiece} onClose={this.closeAddPiece} closeIcon>
                    <Modal.Header>
                        Créer {this.state.types.filter(t=>t.key == this.state.activeType)[0].add}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Nom</label>
                                <input onChange={this.handleChange} name="newPieceName"/>
                            </Form.Field>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Marque</label>
                                <input onChange={this.handleChange} name="newPieceBrand"/>
                            </Form.Field>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Référence</label>
                                <input onChange={this.handleChange} name="newPieceReference"/>
                            </Form.Field>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Prix H.T.</label>
                                <input onChange={this.handleChange} name="newPiecePrixHT"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddPiece}>Annuler</Button>
                        <Button color="green" onClick={this.addPiece}>Créer</Button>
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

export default wrappedInUserContext = withUserContext(withRouter(Pieces));
