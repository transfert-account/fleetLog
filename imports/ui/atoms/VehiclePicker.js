import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class VehiclePicker extends Component {

    state = {
        vehiclesRaw:[],
        locationsRaw:[],
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
                    volume{
                        _id
                        meterCube
                    }
                    payload
                    color
                }
            }
        `,
        locationsQuery : gql`
            query locations{
                locations{
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
                    volume{
                        _id
                        meterCube
                    }
                    payload
                    color
                }
            }
        `,
        getVehiclesAndLocations : () => {
            if(this.props.hideLocations){
                return this.state.vehiclesRaw.map(v=>{return ({...v,type:"vehicle"})});    
            }
            return this.state.vehiclesRaw.map(v=>{return ({...v,type:"vehicle"})}).concat(this.state.locationsRaw.map(l=>{return ({...l,type:"rental"})}));
        }
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

    loadLocations = () => {
        this.props.client.query({
            query:this.state.locationsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                locationsRaw:data.locations
            })
        })
    }
    
    componentDidMount = () => {
        this.loadVehicles();
        this.loadLocations();
    }

    setVehicle = (e, { value }) => {
        this.props.onChange(value);
    }

    render() {
        return (
            <Dropdown search selection style={{marginLeft:"8px"}} defaultValue={this.props.defaultValue} options={this.state.getVehiclesAndLocations().map(v=>{return{key:v._id,text:v.registration,value:v._id}})} placeholder=' [VEHICULE] ' onChange={this.setVehicle} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(VehiclePicker);