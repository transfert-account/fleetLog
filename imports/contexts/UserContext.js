import React, { Component } from 'react'
import gql from 'graphql-tag';
import { graphql, withApollo, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { Session } from 'meteor/session';
import { toast } from 'react-toastify';

export const UserContext = React.createContext();

class Provider extends Component {

    state = {
        societes:[],
        societesQuery : gql`
            query societes{
                societes{
                    _id
                    trikey
                    name
                }
            }
        `,
        userQuery : gql`
            query user{
                user{
                    _id
                    email
                    firstname
                    lastname
                    isAdmin
                    isOwner
                    visibility
                    societe{
                        _id
                        name
                        trikey
                    }
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
        `,
        societeFilter:"noidthisisgroupvisibility"
    }

    getSocieteName = _id => {
        let s = this.state.societes.filter(x=>x._id == _id)[0]
        if(s!=null){
            return s.name;
        }else{
            if(_id == "noidthisisgroupvisibility"){
                return "Groupe"
            }
            return "[error]";
        }
        
    }

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

    componentDidMount = () => {
        this.forceReloadUser();
        this.loadSocietes();
    }

    reloadUser = () => {
        this.props.client.query({
            query:this.state.userQuery,
            fetchPolicy:'network-only'
        }).then(({data})=>{
            if(data.user._id != this.state.user._id){
                this.setState({
                    user:data.user,
                    users:data.users
                })
            }
        })
    }

    forceReloadUser = () => {
        this.props.client.query({
            query:this.state.userQuery,
            fetchPolicy:'network-only'
        }).then(({data})=>{
            this.setState({
                user:data.user,
                users:data.users
            })
        })
    }

    loadSocietes = () => {
        this.props.client.query({
            query:this.state.societesQuery,
            fetchPolicy:'network-only'
        }).then(({data})=>{
            this.setState({
                societes:data.societes
            })
        })
    }

    setSocieteFilter = _id => {
        this.setState({
            societeFilter : _id
        })
    }
    
    componentDidUpdate = () => {
        this.reloadUser()
    }

    render(){
        return (
            <UserContext.Provider value={{
                user: (this.state.user == null ? {_id:null} : this.state.user),
                users : this.props.users,
                client : this.props.client,
                societes:this.props.societes,
                getSocieteName:this.getSocieteName,
                reloadUser:this.reloadUser,
                forceReloadUser:this.forceReloadUser,
                setSocieteFilter:this.setSocieteFilter,
                loadSocietes:this.loadSocietes,
                societeFilter:this.state.societeFilter,
                toast:this.toast
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export default withApollo(withRouter(Provider))