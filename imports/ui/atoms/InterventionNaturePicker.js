
import React, { Component, Fragment } from 'react'
import { Dropdown, Input, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class InterventionNaturePicker extends Component {

    state = {
        value:"",
        interventionNaturesRaw:[],
        interventionNaturesQuery : gql`
            query interventionNatures{
                interventionNatures{
                    _id
                    name
                }
            }
        `,
    }

    loadinterventionNatures = () => {
        this.props.client.query({
            query:this.state.interventionNaturesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                interventionNaturesRaw:data.interventionNatures
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    setInterventionNature = (e, { value }) => {
        this.props.onChange(value);
    }

    componentDidMount = () => {
        this.loadinterventionNatures();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadinterventionNatures();
        }
    }

    render() {
        return (
            <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder="Choisir une nature d'intervention" search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.interventionNaturesRaw.map(n=>{return{key:n._id,text:n.name,value:n._id}})} onChange={this.setInterventionNature}/>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(InterventionNaturePicker);