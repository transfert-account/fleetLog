
import React, { Component, Fragment } from 'react'
import { Dropdown, Input, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { DuoIcon } from '../elements/DuoIcon';
import { gql } from 'apollo-server-express';

class NavbarSocietePicker extends Component {

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

    handleSocieteFilterChange = value => {
        this.props.close();
        this.props.setSocieteFilter(value);
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
        return (
            <div className={"navbar-societe-picker-container"+(this.props.opened?"":" hide")}>
                <div className="navbar-societe-picker">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a href="#" className="nav-link" onClick={this.props.close} style={{textDecoration: 'none'}}>
                                <DuoIcon name="double-chevron-left" color="red"/>
                                <span className="link-text">ANNULER</span>
                            </a>
                        </li>
                        {this.state.societesRaw.map(s=>{
                            console.log(s.name)
                            return(
                                <li className="nav-item" name={s.name} key={s.name}>
                                    <a href="#" className="nav-link" key={s.name} onClick={()=>{this.handleSocieteFilterChange(s._id)}} style={{textDecoration: 'none'}}>
                                        <DuoIcon name="chevron-right" color="gold"/>
                                        <span className="link-text">{s.name.toUpperCase()}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(NavbarSocietePicker);