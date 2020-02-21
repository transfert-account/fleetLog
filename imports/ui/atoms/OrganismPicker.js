
import React, { Component, Fragment } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class OrganismPicker extends Component {

    state = {
        value:"",
        organismsRaw:[],
        organismsQuery : gql`
            query organisms{
                organisms{
                    _id
                    name
                }
            }
        `,
    }

    loadOrganisms = () => {
        this.props.client.query({
            query:this.state.organismsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                organismsRaw:data.organisms
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadOrganisms();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadOrganisms();
        }
    }

    render() {
        return (
            <Dropdown size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir un organisme' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.organismsRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(OrganismPicker);