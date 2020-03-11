import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Header, Dimmer, Loader } from 'semantic-ui-react';
import DashboardUnit from '../molecules/DashboardUnit';
import { gql } from 'apollo-server-express';

class Dashboard extends Component {

    state={
        dataLoaded:false,
        societeLoaded:false,
        societeFull:{},
        dashboardsRaw:[],
        societeQuery : gql`
            query societe{
                societe{
                    _id
                    trikey
                    name
                }
            }
        `,
        dashboardsQuery : gql`
            query dashboards{
                dashboards{
                    societe{
                        _id
                        name
                        trikey
                    }
                    vehicles
                    vehiclesLate
                    vehiclesVeryLate
                    locations
                    locationsLate
                    locationsVeryLate
                    controlsOk
                    controlsUrgent
                    controlsLate
                    licences
                    licencesEndSoon
                    licencesOver
                    entretiensNotReady
                    entretiensReadyAffected
                    entretiensReadyUnaffected
                    commandesToDo
                    commandesDone
                    commandesReceived
                    avgKm
                    nbOwned
                    nbCRB
                    nbCRC
                    licenceAffected
                    licenceFree
                }
            }
        `,
        dashboard : () => {
            let dashboard = this.state.dashboardsRaw.filter(d=>d.societe._id == this.props.societeFilter)[0]
            return (
                <DashboardUnit dashboard={dashboard}/>
            )
        }
    }

    loadDashboards = () => {
        this.props.client.query({
            query:this.state.dashboardsQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                dashboardsRaw:data.dashboards,
                dataLoaded:true
            })
        })
    }

    loadSociete = () => {
        if(this.props.societeFilter == "noidthisisgroupvisibility"){
            this.setState({
                societeFull:{_id:"noidthisisgroupvisibility",trikey:"GRP",name:"Groupe"},
                societeLoaded:true
            })
        }else{
            this.props.client.query({
                query:this.state.societeQuery,
                fetchPolicy:"network-only"
            }).then(({data})=>{
                this.setState({
                    societeFull:data.societe,
                    societeLoaded:true
                })
            })
        }
    }

    componentDidMount = () => {
        this.loadSociete()
        this.loadDashboards()
    }

    render() {
        if(this.state.dataLoaded && this.state.societeLoaded){
            return (
                <div style={{display:"grid",gridTemplateColumns:"1fr 6fr 1fr",gridTemplateRows:"auto auto 1fr",gridGap:"16px"}}>
                    <Header style={{placeSelf:"center",gridColumnEnd:"span 3"}} as="h1">Tableau de bord : {this.state.dashboardsRaw.filter(d=>d.societe._id == this.props.societeFilter)[0].societe.name}</Header>
                    {this.state.dashboard()}
                </div>
            )
        }else{
            return (
                <Dimmer inverted active>
                    <Loader size='massive'>Chargement du tableaud de bord ...</Loader>
                </Dimmer>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Dashboard);