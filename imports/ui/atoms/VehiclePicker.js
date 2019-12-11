import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class VehiclePicker extends Component {

    state = {
        vehiclesRaw:[],
        vehiclesQuery : gql`
            query vehicles{
                vehicles{
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    registration
                    km
                    brand
                    model
                    volume
                    payload
                    color
                }
            }
        `
    }
    
    loadVehicles = () => {
        this.props.client.query({
            query:this.state.vehiclesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                vehiclesRaw:data.vehicles
            })
        })
      }
    
    componentDidMount = () => {
        this.loadVehicles();
    }

    setVehicle = (e, { value }) => {
        this.props.onChange(value);
    }

    render() {
        return (
            <Dropdown search selection style={{marginLeft:"8px"}} defaultValue={this.props.defaultValue} options={this.state.vehiclesRaw.map(v=>{return{key:v._id,text:v.registration,value:v._id}})} placeholder=' [VEHICULE] ' onChange={this.setVehicle} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(VehiclePicker);