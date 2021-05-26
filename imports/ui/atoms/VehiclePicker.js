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
                    brand{
                        _id
                        name
                    }
                    model{
                        _id
                        name
                    }
                    volume{
                        _id
                        meterCube
                    }
                }
            }
        `,
        buVehiclesQuery : gql`
            query buVehicles{
                buVehicles{
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    registration
                    km
                    brand{
                        _id
                        name
                    }
                    model{
                        _id
                        name
                    }
                    volume{
                        _id
                        meterCube
                    }
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
                    brand{
                        _id
                        name
                    }
                    model{
                        _id
                        name
                    }
                    volume{
                        _id
                        meterCube
                    }
                }
            }
        `,
        buLocationsQuery : gql`
            query buLocations{
                buLocations{
                    _id
                    societe{
                        _id
                        trikey
                        name
                    }
                    registration
                    km
                    brand{
                        _id
                        name
                    }
                    model{
                        _id
                        name
                    }
                    volume{
                        _id
                        meterCube
                    }
                }
            }
        `,
        getVehiclesAndLocations : () => {
            if(this.props.hideLocations){
                return this.state.vehiclesRaw.map(v=>{return ({...v,type:"vehicle"})});    
            }
            let options = this.state.vehiclesRaw.map(v=>{return ({...v,type:"vehicle"})}).concat(this.state.locationsRaw.map(l=>{return ({...l,type:"rental"})}));
            if(this.props.societeRestricted != null && this.props.societeRestricted != undefined){
                options = options.filter(v=>v.societe._id == this.props.societeRestricted)
            }
            return options;
        }
    }
    
    loadVehicles = () => {
        if(this.props.userRestricted){
            this.props.client.query({
                query:this.state.buVehiclesQuery,
                fetchPolicy:"network-only"
            }).then(({data})=>{
                this.setState({
                    vehiclesRaw:data.buVehicles
                })
            })
        }else{
            this.props.client.query({
                query:this.state.vehiclesQuery,
                fetchPolicy:"network-only"
            }).then(({data})=>{
                this.setState({
                    vehiclesRaw:data.vehicles
                })
            })
        }
    }

    loadLocations = () => {
        if(this.props.userRestricted){
            this.props.client.query({
                query:this.state.buLocationsQuery,
                fetchPolicy:"network-only"
            }).then(({data})=>{
                this.setState({
                    locationsRaw:data.buLocations
                })
            })
        }else{
            this.props.client.query({
                query:this.state.locationsQuery,
                fetchPolicy:"network-only"
            }).then(({data})=>{
                this.setState({
                    locationsRaw:data.locations
                })
            })
        }
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
            <Dropdown size={(this.props.size != null ? this.props.size : "")} search selection defaultValue={this.props.defaultValue} options={this.state.getVehiclesAndLocations().map(v=>{return{key:v._id,text:v.registration,value:v._id}})} placeholder='Choisissez un véhicule' onChange={this.setVehicle} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(VehiclePicker);