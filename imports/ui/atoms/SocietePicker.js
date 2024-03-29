
import React, { Component, Fragment } from 'react'
import { Dropdown, Input, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class SocietePicker extends Component {

    state = {
        value:"",
        societesRaw:[],
        excluded:this.props.excludeThis || [],
        societesQuery : gql`
            query societes{
                societes{
                    _id
                    trikey
                    name
                }
            }
        `,
    }

    loadSocietes = () => {
        this.props.client.query({
            query:this.state.societesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            let societes = [];
            if(this.props.groupAppears){
                societes = [{_id:"noidthisisgroupvisibility",name:"Groupe",trikey:"GRP"}];
            }
            data.societes.map(s=>{
              societes.push(s)
            });
            societes = societes.filter((societe, index, self) =>
                index === self.findIndex((s) => (
                    s._id === societe._id
                ))
            )
            if(this.state.excluded.length > 0){
                societes = societes.filter(s=>!this.state.excluded.includes(s._id))
            }
            if(!this.props.groupAppears){
                societes = societes.filter(s=>s._id != "noidthisisgroupvisibility")
            }
            if(this.props.restrictToVisibility == true && this.props.user.visibility != "noidthisisgroupvisibility"){
                societes = societes.filter(s=>s._id == this.props.user.visibility)
            }
            this.setState({
                societesRaw:Array.from(societes)
            })
            if(this.props.didRefresh != undefined){
                this.props.didRefresh()
            }
        })
    }
    
    componentDidMount = () => {
        this.loadSocietes();
    }

    componentDidUpdate = () => {
        if(this.props.needToRefresh){
            this.loadSocietes();
        }
    }

    render() {
        if(this.props.value != "" && this.props.value != undefined){
            return (
                <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir une société' search selection onChange={this.props.onChange} value={this.props.value} options={this.state.societesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
            )
        }else{
            return (
                <Dropdown error={this.props.error} size={(this.props.size != null ? this.props.size : "")} style={this.props.style} placeholder='Choisir une société' search selection onChange={this.props.onChange} defaultValue={this.props.defaultValue} options={this.state.societesRaw.map(x=>{return{key:x._id,text:x.name,value:x._id}})} />
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(SocietePicker);