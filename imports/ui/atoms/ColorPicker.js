
import React, { Component, Fragment } from 'react'
import { Dropdown } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class ColorPicker extends Component {

    state = {
        value:"",
        colorsRaw:[],
        colorsQuery : gql`
            query colors{
                colors{
                    _id
                    name
                    hex
                }
            }
        `,
    }

    loadColors = () => {
        this.props.client.query({
            query:this.state.colorsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                colorsRaw:data.colors
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadColors();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadColors();
        }
    }

    render() {
        return (
            <Dropdown size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir un couleur' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.colorsRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(ColorPicker);