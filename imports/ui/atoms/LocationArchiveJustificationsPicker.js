
import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class LocationArchiveJustificationPicker extends Component {

    state = {
        value:"",
        locationArchiveJustificationsRaw:[],
        locationArchiveJustificationsQuery : gql`
            query locationArchiveJustifications{
                locationArchiveJustifications{
                    _id
                    justification
                }
            }
        `,
    }

    loadLocationArchiveJustifications = () => {
        this.props.client.query({
            query:this.state.locationArchiveJustificationsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                locationArchiveJustificationsRaw:data.locationArchiveJustifications
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadLocationArchiveJustifications();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadLocationArchiveJustifications();
        }
    }

    render() {
        return (
            <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir une justification' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.locationArchiveJustificationsRaw.map(x=>{return{key:x._id,text:x.justification,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(LocationArchiveJustificationPicker);