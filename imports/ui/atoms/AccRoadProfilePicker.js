
import React, { Component} from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class AccRoadProfilePicker extends Component {

    state = {
        value:"",
        accRoadProfilesRaw:[],
        accRoadProfilesQuery : gql`
            query accRoadProfiles{
                accRoadProfiles{
                    _id
                    name
                }
            }
        `,
    }

    loadAccRoadProfiles = () => {
        this.props.client.query({
            query:this.state.accRoadProfilesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                accRoadProfilesRaw:data.accRoadProfiles
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadAccRoadProfiles();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadAccRoadProfiles();
        }
    }

    render() {
        return (
            <Dropdown 
                error={this.props.error}
                disabled={this.props.disabled}
                size={(this.props.size != null ? this.props.size : "")}
                style={this.props.style}
                placeholder='Choisir un profil de route'
                search
                selection
                onChange={(this.props.returnRaw ? (e, { value }) => this.props.onChange(value) : this.props.onChange)}
                defaultValue={this.props.defaultValue}
                options={this.state.accRoadProfilesRaw.map(x=>{return{key:(this.props.returnRaw ? x.name : x._id),text:x.name,value:(this.props.returnRaw ? x.name : x._id)}})}
            />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(AccRoadProfilePicker);