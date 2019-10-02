import React, { Component } from 'react'
import gql from 'graphql-tag';
import { graphql, withApollo, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Session } from 'meteor/session';
import { toast } from 'react-toastify';

export const UserContext = React.createContext();

    const userQuery = gql`
        query User{
            user{
                _id
                email
                firstname
                lastname
                isAdmin
                isOwner
                activated
                avatar
            }
            users{
                _id
                email
                isAdmin
                isOwner
                verified
                firstname
                lastname
                createdAt
                lastLogin
                activated
            }
        }
    `;

class Provider extends Component {

    toast = ({message,type}) => {
        if(type == 'error'){
            toast.error(message);
        }
        if(type == 'success'){
            toast.success(message);
        }
        if(type == 'info'){
            toast.info(message);
        }
        if(type == 'warning'){
            toast.warn(message);
        }
    }

    componentWillMount = () => {
        
    }

    render(){
        return (
            <UserContext.Provider value={{
                user: (this.props.user == null ? {_id:null} : this.props.user),
                users : this.props.users,
                client : this.props.client,
                toast:this.toast
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export const UserProvider =
    graphql(userQuery,{
        props:({data}) =>({...data})
    })
(withApollo(withRouter(Provider)))