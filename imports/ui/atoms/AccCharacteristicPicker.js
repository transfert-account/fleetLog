
import React, { Component} from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class AccCharacteristicPicker extends Component {

    state = {
        value:"",
        accCharacteristicsRaw:[],
        accCharacteristicsQuery : gql`
            query accCharacteristics{
                accCharacteristics{
                    _id
                    name
                }
            }
        `,
    }

    loadAccCharacteristics = () => {
        this.props.client.query({
            query:this.state.accCharacteristicsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                accCharacteristicsRaw:data.accCharacteristics
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadAccCharacteristics();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadAccCharacteristics();
        }
    }

    render() {
        return (
            <Dropdown 
                error={this.props.error}
                disabled={this.props.disabled}
                size={(this.props.size != null ? this.props.size : "")}
                style={this.props.style}
                placeholder='Choisir une caractéritique'
                search
                selection
                onChange={(this.props.returnRaw ? (e, { value }) => this.props.onChange(value) : this.props.onChange)}
                defaultValue={this.props.defaultValue}
                options={this.state.accCharacteristicsRaw.map(x=>{return{key:(this.props.returnRaw ? x.name : x._id),text:x.name,value:(this.props.returnRaw ? x.name : x._id)}})}
            />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(AccCharacteristicPicker);