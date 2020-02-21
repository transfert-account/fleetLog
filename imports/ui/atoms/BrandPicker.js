
import React, { Component, Fragment } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class BrandPicker extends Component {

    state = {
        value:"",
        brandsRaw:[],
        brandsQuery : gql`
            query brands{
                brands{
                    _id
                    name
                }
            }
        `,
    }

    loadBrands = () => {
        this.props.client.query({
            query:this.state.brandsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                brandsRaw:data.brands
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadBrands();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadBrands();
        }
    }

    render() {
        return (
            <Dropdown size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir une marque' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.brandsRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(BrandPicker);