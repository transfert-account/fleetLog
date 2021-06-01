
import React, { Component, Fragment } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class VehicleArchiveJustificationPicker extends Component {

    state = {
        value:"",
        vehicleArchiveJustificationsRaw:[],
        vehicleArchiveJustificationsQuery : gql`
            query vehicleArchiveJustifications{
                vehicleArchiveJustifications{
                    _id
                    justification
                }
            }
        `,
    }

    loadVehicleArchiveJustifications = () => {
        this.props.client.query({
            query:this.state.vehicleArchiveJustificationsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                vehicleArchiveJustificationsRaw:data.vehicleArchiveJustifications
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadVehicleArchiveJustifications();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadVehicleArchiveJustifications();
        }
    }

    render() {
        return (
            <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir une justification' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.vehicleArchiveJustificationsRaw.map(x=>{return{key:x._id,text:x.justification,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(VehicleArchiveJustificationPicker);