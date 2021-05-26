import React, { Component } from 'react';
import { Table, Header } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express';
import moment from 'moment';

export class IllustratedRow extends Component {

    state={}
    
    /*SHOW AND HIDE MODALS*/
    /*CHANGE HANDLERS*/
    /*FILTERS HANDLERS*/
    /*DB READ AND WRITE*/
    /*CONTENT GETTERS*/
    /*COMPONENTS LIFECYCLE*/

    componentDidMount = () => {
    }

    render() {return (
        <Table.Row>
            <Table.Cell style={{padding:"0"}} colSpan={this.props.colSpan}>
                <div style={{width:"100%",height:"100%",padding:"3% 15%",display:"grid",gridTemplateRows:"320px 1fr",gridTemplateColumns:"1fr",backgroundColor:this.props.back}}>
                    <img style={{placeSelf:"stretch start"}} src={this.props.src}/>
                    <Header style={{placeSelf:"stretch end"}} as="h1">{this.props.text}</Header>
                </div>
            </Table.Cell>
        </Table.Row>
    )}
}
const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)
export default wrappedInUserContext = withUserContext(IllustratedRow);