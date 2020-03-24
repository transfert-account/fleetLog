
import React, { Component, Fragment } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class EnergyPicker extends Component {

    state = {
        value:"",
        energiesRaw:[],
        energiesQuery : gql`
            query energies{
                energies{
                    _id
                    name
                }
            }
        `,
    }

    loadEnergies = () => {
        this.props.client.query({
            query:this.state.energiesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                energiesRaw:data.energies
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadEnergies();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadEnergies();
        }
    }

    render() {
        return (
            <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder="Choisir un type d'énergie" search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.energiesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(EnergyPicker);