import React, { Component } from 'react'
import { UserContext } from '../../contexts/UserContext';
import { Header, Dimmer, Loader } from 'semantic-ui-react';
import DashboardUnit from '../molecules/DashboardUnit';
import { gql } from 'apollo-server-express';

class Dashboards extends Component {

    state={
        dataLoaded:false,
        societeLoaded:false,
        societeFull:{},
        dashboardsRaw:[],
        societeQuery : gql`
            query societe($_id:String!){
                societe(_id:$_id){
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
                    controlsTotal
                    controlsOk
                    controlsUrgent
                    controlsLate
                    licences
                    licencesEndSoon
                    licencesOver
                    batiments
                    batimentsEndSoon
                    batimentsOver
                    entretiensNotReady
                    entretiensReadyAffected
                    entretiensReadyUnaffected
                    entretiensTotalNotArchived
                    accidentsThisYear
                    accidentsOpened
                    totalAccidentsCost
                    commandesToDo
                    commandesDone
                    commandesReceived
                    commandesTotalNotArchived
                    avgKm
                    nbOwned
                    nbCRB
                    nbCRC
                    licenceAffected
                    licenceFree
                    vehiclesVolumeRepartition{
                        key
                        label
                        value
                    }
                    vehiclesModelRepartition{
                        key
                        label
                        value
                    }
                    vehicleCV{
                        total
                        affected
                        missing
                    }
                    vehicleCG{
                        total
                        affected
                        missing
                    }
                    locationCV{
                        total
                        affected
                        missing
                    }
                    locationCG{
                        total
                        affected
                        missing
                    }
                    locationContrat{
                        total
                        affected
                        missing
                    }
                    locationRestitution{
                        total
                        affected
                        missing
                    }
                    entretiensFicheInter{
                        total
                        affected
                        missing
                    }
                    controlsFicheInter{
                        total
                        affected
                        missing
                    }
                    batimentsFicheInter{
                        total
                        affected
                        missing
                    }
                    licencesLicence{
                        total
                        affected
                        missing
                    }
                    accidentsConstat{
                        total
                        affected
                        missing
                    }
                    accidentsExpert{
                        total
                        affected
                        missing
                    }
                    accidentsFacture{
                        total
                        affected
                        missing
                    }
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
                fetchPolicy:"network-only",
                variables:{
                    _id:this.props.societeFilter
                }
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
                <div style={{height:"100%",display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px 80px",gridTemplateRows:"minmax(0, 1fr)",paddingRight:"16px"}}>
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

export default wrappedInUserContext = withUserContext(Dashboards);