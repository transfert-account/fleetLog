
import React, { Component, Fragment } from 'react'
import { Dropdown, Input, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class VolumePicker extends Component {

    state = {
        value:"",
        volumesRaw:[],
        volumesQuery : gql`
            query volumes{
                volumes{
                    _id
                    meterCube
                }
            }
        `,
    }


    
    loadVolumes = () => {
        this.props.client.query({
            query:this.state.volumesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                volumesRaw:data.volumes
            })
            this.props.didRefresh()
        })
    }
    
    componentDidMount = () => {
        this.loadVolumes();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadVolumes();
        }
    }

    render() {
        return (
            <Dropdown size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir un volume' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.volumesRaw.map(x=>{return{key:x._id,text:x.meterCube+" m³",value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(VolumePicker);