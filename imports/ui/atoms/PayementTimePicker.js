
import React, { Component, Fragment } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class PayementTimePicker extends Component {

    state = {
        value:"",
        payementTimesRaw:[],
        payementTimesQuery : gql`
            query payementTimes{
                payementTimes{
                    _id
                    months
                }
            }
        `,
    }

    loadPayementTimes = () => {
        this.props.client.query({
            query:this.state.payementTimesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                payementTimesRaw:data.payementTimes
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadPayementTimes();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadPayementTimes();
        }
    }

    render() {
        return (
            <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir une durée de financement' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.payementTimesRaw.map(x=>{return{key:x._id,text:x.months+" mois",value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(PayementTimePicker);