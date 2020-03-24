
import React, { Component } from 'react'
import { Dropdown, } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class ModelPicker extends Component {

    state = {
        value:"",
        modelsRaw:[],
        modelsQuery : gql`
            query models{
                models{
                    _id
                    name
                }
            }
        `,
    }

    loadModels = () => {
        this.props.client.query({
            query:this.state.modelsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                modelsRaw:data.models
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadModels();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadModels();
        }
    }

    render() {
        return (
            <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir un modèle' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.modelsRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(ModelPicker);