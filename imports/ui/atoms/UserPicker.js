
import React, { Component } from 'react'
import { Dropdown, } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class UserPicker extends Component {

    state = {
        value:"",
        usersRaw:[],
        usersQuery : gql`
            query users{
                users{
                    _id
                    firstname
                    lastname
                }
            }
        `,
    }

    loadUsers = () => {
        this.props.client.query({
            query:this.state.usersQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                usersRaw:data.users
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadUsers();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadUsers();
        }
    }

    render() {
        return (
            <Dropdown clearable error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir un utilisateur' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.usersRaw.map(u=>{return{key:u._id,text:u.lastname + " " + u.firstname,value:u._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(UserPicker);