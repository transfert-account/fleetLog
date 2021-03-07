
import React, { Component} from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class AccTrackStatePicker extends Component {

    state = {
        value:"",
        accTrackStatesRaw:[],
        accTrackStatesQuery : gql`
            query accTrackStates{
                accTrackStates{
                    _id
                    name
                }
            }
        `,
    }

    loadAccTrackStates = () => {
        this.props.client.query({
            query:this.state.accTrackStatesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                accTrackStatesRaw:data.accTrackStates
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadAccTrackStates();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadAccTrackStates();
        }
    }

    render() {
        return (
            <Dropdown 
                error={this.props.error}
                disabled={this.props.disabled}
                size={(this.props.size != null ? this.props.size : "")}
                style={this.props.style}
                placeholder='Choisir un état de chaussée'
                search
                selection
                onChange={(this.props.returnRaw ? (e, { value }) => this.props.onChange(value) : this.props.onChange)}
                defaultValue={this.props.defaultValue}
                options={this.state.accTrackStatesRaw.map(x=>{return{key:(this.props.returnRaw ? x.name : x._id),text:x.name,value:(this.props.returnRaw ? x.name : x._id)}})}
            />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(AccTrackStatePicker);