
import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class FournisseurPicker extends Component {

    state = {
        value:"",
        fournisseursRaw:[],
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
        `,
    }

    loadFournisseurs = () => {
        this.props.client.query({
            query:this.state.fournisseursQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                fournisseursRaw:data.fournisseurs
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadFournisseurs();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadFournisseurs();
        }
    }

    render() {
        return (
            <Dropdown size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir un fournisseur' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.fournisseursRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(FournisseurPicker);