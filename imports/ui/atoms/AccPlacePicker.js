
import React, { Component} from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class AccPlacePicker extends Component {

    state = {
        value:"",
        accPlacesRaw:[],
        accPlacesQuery : gql`
            query accPlaces{
                accPlaces{
                    _id
                    name
                }
            }
        `,
    }

    loadAccPlaces = () => {
        this.props.client.query({
            query:this.state.accPlacesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                accPlacesRaw:data.accPlaces
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadAccPlaces();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadAccPlaces();
        }
    }

    render() {
        return (
            <Dropdown 
                error={this.props.error}
                disabled={this.props.disabled}
                size={(this.props.size != null ? this.props.size : "")}
                style={this.props.style}
                placeholder='Choisir un lieu'
                search
                selection
                onChange={(this.props.returnRaw ? (e, { value }) => this.props.onChange(value) : this.props.onChange)}
                defaultValue={this.props.defaultValue}
                options={this.state.accPlacesRaw.map(x=>{return{key:(this.props.returnRaw ? x.name : x._id),text:x.name,value:(this.props.returnRaw ? x.name : x._id)}})}
            />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(AccPlacePicker);