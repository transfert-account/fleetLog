import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { withRouter } from 'react-router-dom';
import { Modal, Menu, Button, Icon, Form, Table } from 'semantic-ui-react';

class PieceRow extends Component {

    state = {
        type:this.props.piece.type,
        name:this.props.piece.name,
        openEdit:false,
        openDelete:false
    }

    showEdit = () => {
        
    }

    showDelete = () => {
        
    }

    closeEdit = () => {
        
    }

    closeDelete = () => {
        
    }

    render() {
        return (
            <Table.Row>
                <Table.Cell>{this.props.piece.name}</Table.Cell>
                <Table.Cell>
                    <div style={{display:"flex"}}>
                        <Button circular style={{color:"#2980b9"}} inverted icon icon='edit' onClick={this.showEdit}/>    
                        <Button circular style={{color:"#e74c3c"}} inverted icon icon='trash' onClick={this.showDelete}/>
                    </div>
                </Table.Cell>
            </Table.Row>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(PieceRow));
