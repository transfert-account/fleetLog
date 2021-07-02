import React, { Component, Fragment } from 'react';
import { Input, Button, Table, Modal, Form, Segment, Popup, Menu, Label } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

import CustomFilterSegment from '../molecules/CustomFilterSegment';
import VehicleAgglomeratedAccidentsRow from '../molecules/VehicleAgglomeratedAccidentsRow';

import BigIconButton from '../elements/BigIconButton';

import VehiclePicker from '../atoms/VehiclePicker';
import ModalDatePicker from '../atoms/ModalDatePicker';
import CustomFilter from '../atoms/CustomFilter';

import { gql } from 'apollo-server-express';
import moment from 'moment';

class Accidents extends Component {

  state={
    loading:true,
    selectedMonth:parseInt(moment().format("MM")),
    selectedYear:parseInt(moment().format("YYYY")),
    activePanel:"byMonth",
    accidentFilter:"",
    newVehicle:"",
    openDatePicker:false,
    datePickerTarget:"",
    newOccurenceDate:"",
    archiveFilter:false,
    missingInfosFilter:"all",
    answersFilter:"all",
    constatSentFilter: "all",
    responsabiliteFilter:"all",
    statusFilter:"all",
    docsFilter: "all",
    filters:[
      {
        infos:"archiveFilterInfos",
        filter:"archiveFilter"
      },{
        infos:"missingInfosFilterInfos",
        filter:"missingInfosFilter"
      },{
        infos:"answersFilterInfos",
        filter:"answersFilter"
      },{
        infos:"constatSentFilterInfos",
        filter:"constatSentFilter"
      },{
        infos:"responsabiliteFilterInfos",
        filter:"responsabiliteFilter"
      },{
        infos:"statusFilterInfos",
        filter:"statusFilter"
      },{
        infos:"docsFilterInfos",
        filter:"docsFilter"
      }
    ],
    archiveFilterInfos:{
      icon:"archive",            
      options:[
          {
              key: 'archivefalse',
              initial: true,
              text: 'Accidents actuels',
              value: false,
              color:"green",
              click:()=>{this.switchArchiveFilter(false)},
              label: { color: 'green', empty: true, circular: true },
          },
          {
              key: 'archivetrue',
              initial: false,
              text: 'Accidents archivés',
              value: true,
              color:"orange",
              click:()=>{this.switchArchiveFilter(true)},
              label: { color: 'orange', empty: true, circular: true },
          }
      ]
    },
    missingInfosFilterInfos:{
      icon:"info",            
      options:[
          {
              key: 'missinginfosall',
              initial: true,
              text: 'Touts les véhicules',
              value: "all",
              color:"green",
              click:()=>{this.switchMissingInfosFilter("all")},
              label: { color: 'green', empty: true, circular: true },
          },
          {
              key: 'missinginfosfull',
              initial: true,
              text: 'Toutes informations renseignées',
              value: "full",
              color:"blue",
              click:()=>{this.switchMissingInfosFilter("full")},
              label: { color: 'blue', empty: true, circular: true },
          },
          {
              key: 'missinginfossome',
              initial: false,
              text: 'Informations manquantes',
              value: "some",
              color:"red",
              click:()=>{this.switchMissingInfosFilter("some")},
              label: { color: 'red', empty: true, circular: true },
          }
      ]
    },
    answersFilterInfos:{
      icon:"tasks",
      options:[
        {
          key: 'answersall',
          initial: true,
          text: 'Touts les véhicules',
          value: "all",
          color:"green",
          click:()=>{this.switchAnswersFilter("all")},
          label: { color: 'green', empty: true, circular: true },
        },
        {
          key: 'answersfull',
          initial: true,
          text: 'Questionnaire de circonstances renseigné',
          value: "full",
          color:"blue",
          click:()=>{this.switchAnswersFilter("full")},
          label: { color: 'blue', empty: true, circular: true },
        },
        {
          key: 'answerssome',
          initial: false,
          text: 'Questionnaire de circonstances à faire',
          value: "some",
          color:"red",
          click:()=>{this.switchAnswersFilter("some")},
          label: { color: 'red', empty: true, circular: true },
        }
      ]
    },
    constatSentFilterInfos:{
        icon:"mail",            
        options:[
            {
                key: 'constatAll',
                initial: true,
                text: 'Tous les accidents',
                value: "all",
                color:"green",
                click:()=>{this.setConstatSentFilter("all")},
                label: { color: 'green', empty: true, circular: true },
            },
            {
                key: 'constatNotSent',
                initial: false,
                text: 'Constat à envoyer',
                value: "notSent",
                color:"orange",
                click:()=>{this.setConstatSentFilter("notSent")},
                label: { color: 'orange', empty: true, circular: true },
            }
        ]
    },
    responsabiliteFilterInfos:{
      icon:"percent",
      options:[
        {
          key: 'responsabiliteall',
          initial: true,
          text: 'Touts les véhicules',
          value: "all",
          color:"green",
          click:()=>{this.switchResponsabiliteInfosFilter("all")},
          label: { color: 'green', empty: true, circular: true },
        },
        {
          key: 'responsabilitefull',
          initial: true,
          text: '100 %',
          value: "full",
          color:"orange",
          click:()=>{this.switchResponsabiliteInfosFilter("full")},
          label: { color: 'orange', empty: true, circular: true },
        },
        {
          key: 'responsabilitehalf',
          initial: true,
          text: '50 %',
          value: "half",
          color:"yellow",
          click:()=>{this.switchResponsabiliteInfosFilter("half")},
          label: { color: 'yellow', empty: true, circular: true },
        },
        {
          key: 'responsabilitezero',
          initial: true,
          text: '0 %',
          value: "zero",
          color:"green",
          click:()=>{this.switchResponsabiliteInfosFilter("zero")},
          label: { color: 'green', empty: true, circular: true },
        },
        {
          key: 'responsabilitetodo',
          initial: true,
          text: 'A définir',
          value: "todo",
          color:"grey",
          click:()=>{this.switchResponsabiliteInfosFilter("todo")},
          label: { color: 'grey', empty: true, circular: true },
        }
      ]
    },
    statusFilterInfos:{
      icon:"toggle off",
      options:[
        {
          key: 'statusall',
          initial: true,
          text: 'Touts les véhicules',
          value: "all",
          color:"green",
          click:()=>{this.switchStatusInfosFilter("all")},
          label: { color: 'green', empty: true, circular: true },
        },
        {
          key: 'statustrue',
          initial: true,
          text: 'Ouvert',
          value: "true",
          color:"green",
          click:()=>{this.switchStatusInfosFilter("true")},
          label: { color: 'green', empty: true, circular: true },
        },
        {
          key: 'statusfalse',
          initial: true,
          text: 'Clos',
          value: "false",
          color:"grey",
          click:()=>{this.switchStatusInfosFilter("false")},
          label: { color: 'grey', empty: true, circular: true },
        }
      ]
    },
    docsFilterInfos:{
        icon:"folder open outline",            
        options:[
            {
                key: 'docsall',
                initial: true,
                text: 'Tous les accidents',
                value: "all",
                color:"green",
                click:()=>{this.setDocsFilter("all")},
                label: { color: 'green', empty: true, circular: true },
            },
            {
                key: 'docsmissing',
                initial: false,
                text: 'Documents manquants',
                value: "missingDocs",
                color:"red",
                click:()=>{this.setDocsFilter("missingDocs")},
                label: { color: 'red', empty: true, circular: true }
            }
        ]
    },
    openAddAccident:false,
    accidentsRaw:[],
    accidentsAgglomeratedRaw:[],
    accidents : () => {
      let displayed = Array.from(JSON.parse(JSON.stringify(this.state.accidentsRaw)));
      if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
        displayed = displayed.filter(a =>
            a.societe._id == this.props.societeFilter
        );
      }
      //ARCHIVE FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        accs = accs.filter(a=>a.archived == this.state.archiveFilter)
        vehicle.accidents = accs;
      });
      //DOCS FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.docsFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(a.rapportExp._id == "" || a.constat._id == "" || a.facture._id == ""){
              return true
            }else{
              return false
            }
          })
        }
        vehicle.accidents = accs;
      });
      //MISSING INFOS FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.missingInfosFilter == "all"){return true}else{
          accs = accs.filter(a=>{
            let totUndef = 0;
            if(a.reglementAssureur == "" || a.reglementAssureur == -1){totUndef++}
            if(a.chargeSinistre == "" || a.chargeSinistre == -1){totUndef++}
            if(a.montantInterne == "" || a.montantInterne == -1){totUndef++}
            if(a.dateExpert == ""){totUndef++}
            if(a.dateTravaux == ""){totUndef++}
            if(this.state.missingInfosFilter == "full"){
              return totUndef == 0;
            }
            if(this.state.missingInfosFilter == "some"){
              return totUndef != 0
            }
          })
        }
        vehicle.accidents = accs;
      });
      //ANSWERS FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.answersFilter == "all"){return true}else{
          accs = accs.filter(a=>{
            if(this.state.answersFilter == "full"){
              return a.answers.filter(a=>a.status == "validated").length == 8;
            }
            if(this.state.answersFilter == "some"){
              return a.answers.filter(a=>a.status == "validated").length != 8;
            }
          })
        }
        vehicle.accidents = accs;
      });
      //CONSTAT SENT
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.constatSentFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(a.constatSent){
              return false
            }else{
              return true
            }
          });
        }
        vehicle.accidents = accs;
      });
      //RESPONSABILITE SENT
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.responsabiliteFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(this.state.responsabiliteFilter == "full"){
              return a.responsabilite == 100;
            }
            if(this.state.responsabiliteFilter == "half"){
              return a.responsabilite == 50;
            }
            if(this.state.responsabiliteFilter == "zero"){
              return a.responsabilite == 0;
            }
            if(this.state.responsabiliteFilter == "todo"){
              return a.responsabilite == -1;
            }
            return true;
          });
        }
        vehicle.accidents = accs;
      });
      //STATUS SENT
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.statusFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(this.state.statusFilter == "true"){
              return a.status == true;
            }
            if(this.state.statusFilter == "false"){
              return a.status == false;
            }
          });
        }
        vehicle.accidents = accs;
      });
      if(this.state.accidentFilter.length>0){
        displayed = displayed.filter(v =>
          v.registration.toLowerCase().includes(this.state.accidentFilter.toLowerCase())
        );
      }
      displayed = displayed.filter(v => v.accidents.length > 0);
      if(displayed.length == 0){
        return(
          <Table>
            <Table.Body>
              <Table.Row key={"none"}>
                <Table.Cell colSpan='10' textAlign="center">
                  <p>Aucun accident ne correspond à ce filtre</p>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )
      }
      return (
        displayed.map(v =>{
          return(
            <VehicleAgglomeratedAccidentsRow archiveFilter={this.state.archiveFilter} docsFilter={this.state.docsFilter} constatSentFilter={this.state.constatSentFilter} archiveFilter={this.state.archiveFilter} loadAccidents={this.loadAccidents} key={v._id} vehicle={v}/>
          )
        })
      )
    },
    byMonthAccidents : () => {
      let displayed = Array.from(JSON.parse(JSON.stringify(this.state.accidentsAgglomeratedRaw)));
      if(this.props.user.isAdmin && this.props.user.visibility == "noidthisisgroupvisibility" && this.props.societeFilter != "noidthisisgroupvisibility"){
        displayed = displayed.filter(a =>
            a.societe._id == this.props.societeFilter
        );
      }
      //ARCHIVE FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        accs = accs.filter(a=>{return a.archived == this.state.archiveFilter})
        vehicle.accidents = accs;
      });
      //DOCS FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.docsFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(a.rapportExp._id == "" || a.constat._id == "" || a.facture._id == ""){
              return true
            }else{
              return false
            }
          })
        }
        vehicle.accidents = accs;
      });
      //MISSING INFOS FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.missingInfosFilter == "all"){return true}else{
          accs = accs.filter(a=>{
            let totUndef = 0;
            if(a.reglementAssureur == "" || a.reglementAssureur == -1){totUndef++}
            if(a.chargeSinistre == "" || a.chargeSinistre == -1){totUndef++}
            if(a.montantInterne == "" || a.montantInterne == -1){totUndef++}
            if(a.dateExpert == ""){totUndef++}
            if(a.dateTravaux == ""){totUndef++}
            if(this.state.missingInfosFilter == "full"){
              return totUndef == 0;
            }
            if(this.state.missingInfosFilter == "some"){
              return totUndef != 0
            }
          })
        }
        vehicle.accidents = accs;
      });
      //ANSWERS FILTER
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.answersFilter == "all"){return true}else{
          accs = accs.filter(a=>{
            if(this.state.answersFilter == "full"){
              return a.answers.filter(a=>a.status == "validated").length == 8;
            }
            if(this.state.answersFilter == "some"){
              return a.answers.filter(a=>a.status == "validated").length != 8;
            }
          })
        }
        vehicle.accidents = accs;
      });
      //CONSTAT SENT
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.constatSentFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(a.constatSent){
              return false
            }else{
              return true
            }
          });
        }
        vehicle.accidents = accs;
      });
      //RESPONSABILITE SENT
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.responsabiliteFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(this.state.responsabiliteFilter == "full"){
              return a.responsabilite == 100;
            }
            if(this.state.responsabiliteFilter == "half"){
              return a.responsabilite == 50;
            }
            if(this.state.responsabiliteFilter == "zero"){
              return a.responsabilite == 0;
            }
            if(this.state.responsabiliteFilter == "todo"){
              return a.responsabilite == -1;
            }
            return true;
          });
        }
        vehicle.accidents = accs;
      });
      //STATUS SENT
      displayed.forEach(vehicle => {
        let accs = vehicle.accidents;
        if(this.state.statusFilter == "all"){return true}else{
          accs = accs.filter(a =>{
            if(this.state.statusFilter == "true"){
              return a.status == true;
            }
            if(this.state.statusFilter == "false"){
              return a.status == false;
            }
          });
        }
        vehicle.accidents = accs;
      });
      if(this.state.accidentFilter.length>0){
        displayed = displayed.filter(v =>
          v.registration.toLowerCase().includes(this.state.accidentFilter.toLowerCase())
        );
      }
      displayed = displayed.filter(v => v.accidents.length > 0);
      if(displayed.length == 0){
        return(
          <Table>
            <Table.Body>
              <Table.Row key={"none"}>
                <Table.Cell colSpan='10' textAlign="center">
                  <p>Aucun accident ne correspond à ce filtre</p>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )
      }
      return displayed.map(v =>{
        return(
          <VehicleAgglomeratedAccidentsRow archiveFilter={this.state.archiveFilter} docsFilter={this.state.docsFilter} constatSentFilter={this.state.constatSentFilter} archiveFilter={this.state.archiveFilter} loadAccidents={this.loadAccidents} key={v._id} vehicle={v}/>
        )
      })
    },
    addAccidentQuery : gql`
        mutation addAccident($vehicle:String!,$occurenceDate:String!){
          addAccident(vehicle:$vehicle,occurenceDate:$occurenceDate){
            status
            message
          }
        }
    `,
    vehiclesByAccidentsQuery: gql`
      query vehiclesByAccidents{
        vehiclesByAccidents{
          _id
          societe{
            _id
            trikey
            name
          }
          km
          lastKmUpdate
          registration
          archived
          brand{
            _id
            name
          }
          model{
            _id
            name
          }
          energy{
            _id
            name
          }
          accidents{
            _id
            societe{
              _id
              trikey
              name
            }
            occurenceDate
            description
            dateExpert
            dateTravaux
            constatSent
            archived
            answers{
              page
              fields{
                index
                status
                answer
              }
            }
            constat{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            rapportExp{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            facture{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            questionary{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            responsabilite
            reglementAssureur
            chargeSinistre
            montantInterne
            status
          }
        }
      }
    `,
    accidentsByMonthByVehicleQuery: gql`
      query accidentsByMonthByVehicle($year:Int!,$month:Int!){
        accidentsByMonthByVehicle(year:$year,month:$month){
          _id
          societe{
            _id
            trikey
            name
          }
          km
          lastKmUpdate
          registration
          archived
          brand{
            _id
            name
          }
          model{
            _id
            name
          }
          energy{
            _id
            name
          }
          accidents{
            _id
            societe{
              _id
              trikey
              name
            }
            vehicle{
              _id
              registration
              model{
                _id
                name
              }
              brand{
                _id
                name
              }
            }
            occurenceDate
            description
            dateExpert
            dateTravaux
            constatSent
            archived
              answers{
                page
                fields{
                  index
                  status
                  answer
                }
              }
            constat{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            rapportExp{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            facture{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            questionary{
              _id
              name
              size
              path
              originalFilename
              ext
              type
              mimetype
              storageDate
            }
            responsabilite
            reglementAssureur
            chargeSinistre
            montantInterne
            status
          }
        }
      }
    `,
    accidentsReduceOfYearQuery: gql`
      query accidentsReduceOfYear($year:Int!){
        accidentsReduceOfYear(year:$year){
          monthIndex
          nAccident
        }
      }
    `,
    monthRaw:[
      {name:"Janvier",nAccident:0},
      {name:"Février",nAccident:0},
      {name:"Mars",nAccident:0},
      {name:"Avril",nAccident:0},
      {name:"Mai",nAccident:0},
      {name:"Juin",nAccident:0},
      {name:"Juillet",nAccident:0},
      {name:"Août",nAccident:0},
      {name:"Septembre",nAccident:0},
      {name:"Octobre",nAccident:0},
      {name:"Novembre",nAccident:0},
      {name:"Decembre",nAccident:0}
    ],
    months : () => this.state.monthRaw.map((m,i)=>{return {month:{name:m.name,nAccident:m.nAccident,label:parseInt(i+1).toString().padStart(2,"0")+"/"+this.state.selectedYear,month:i+1,year:this.state.selectedYear}}})
  }
  /*SHOW AND HIDE MODALS*/
  showAddAccident = () => {
    this.setState({
      openAddAccident:true
    })
  }
  closeAddAccident = () => {
    this.setState({
      openAddAccident:false
    })
  }
  showDatePicker = target => {
    this.setState({openDatePicker:true,datePickerTarget:target})
  }
  closeDatePicker = () => {
    this.setState({openDatePicker:false,datePickerTarget:""})
  }
  /*CHANGE HANDLERS*/
  handleChange = e =>{
    this.setState({
      [e.target.name]:e.target.value
    });
  }
  handleChangeVehicle = _id => {
    this.setState({ newVehicle:_id })
  }
  onSelectDatePicker = date => {
    this.setState({
      [this.state.datePickerTarget]:date.getDate().toString().padStart(2, '0')+"/"+parseInt(date.getMonth()+1).toString().padStart(2, '0')+"/"+date.getFullYear().toString().padStart(4, '0')
    })
  }
  goToYear = (m,y) => {
    this.setState({selectedMonth:m,selectedYear:y,loadAccidentsReduceOfYear:true,loadingMonth:true});
    this.loadAgglomeratedAccidents(m,y);
    this.loadAccidentsReduceOfYear(y);
  }
  goToMonth = m => {
    this.setState({selectedMonth:m,loadingMonth:true});
    this.loadAgglomeratedAccidents(m,this.state.selectedYear);
  }
  /*FILTERS HANDLERS*/
  handleFilter = e =>{
    this.setState({
        accidentFilter:e.target.value
    });
  }
  setDocsFilter = value => {
    this.setState({
      docsFilter:value
    })
  }
  switchArchiveFilter = v => {
      this.setState({
          archiveFilter:v
      })
      this.loadAccidents();
  }
  switchMissingInfosFilter = v => {
    this.setState({
        missingInfosFilter:v
    })
    this.loadAccidents();
  }
  switchResponsabiliteInfosFilter = v => {
    this.setState({
        responsabiliteFilter:v
    })
    this.loadAccidents();
  }
  switchStatusInfosFilter = v => {
    this.setState({
        statusFilter:v
    })
    this.loadAccidents();
  }
  switchAnswersFilter = v => {
    this.setState({
        answersFilter:v
    })
    this.loadAccidents();
  }
  setConstatSentFilter = value => {
    this.setState({
      constatSentFilter:value
    })
  }
  resetAll = () => {
    let filterNewValues = {};
    this.state.filters.forEach(f=>{
        filterNewValues[f.filter] = this.state[f.infos].options.filter(o=>o.initial)[0].value
    })
    this.setState(filterNewValues);
  }
  /*DB READ AND WRITE*/
  loadAccidents = () => {
    this.props.client.query({
        query:this.state.vehiclesByAccidentsQuery,
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
          accidentsRaw:data.vehiclesByAccidents
        })
    })
  }
  loadAgglomeratedAccidents = (m,y) => {
    this.props.client.query({
        query:this.state.accidentsByMonthByVehicleQuery,
        variables:{
          year:y,
          month:m
        },
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
          loadingMonth:false,
          accidentsAgglomeratedRaw:data.accidentsByMonthByVehicle
        })
    })
  }
  loadAccidentsReduceOfYear = y => {
    this.props.client.query({
        query:this.state.accidentsReduceOfYearQuery,
        variables:{
          year:y,
        },
        fetchPolicy:"network-only"
    }).then(({data})=>{
        this.setState({
          loadingAccidentsReduce:false,
          monthRaw:this.state.monthRaw.map((m,i)=>({name:m.name,nAccident:data.accidentsReduceOfYear.filter(n=>n.monthIndex == parseInt(i+1))[0].nAccident}))
        })
    })
  }
  addAccident = () => {
    this.closeAddAccident()
    this.props.client.mutate({
      mutation:this.state.addAccidentQuery,
      variables:{
        vehicle:this.state.newVehicle,
        occurenceDate:this.state.newOccurenceDate
      }
    }).then(({data})=>{
      data.addAccident.map(qrm=>{
        if(qrm.status){
          this.props.toast({message:qrm.message,type:"success"});
          this.loadAccidents();
          this.loadAgglomeratedAccidents(this.state.selectedMonth,this.state.selectedYear);
          this.loadAccidentsReduceOfYear(this.state.selectedYear);
        }else{
          this.props.toast({message:qrm.message,type:"error"});
        }
      })
    })
  }
  /*CONTENT GETTERS*/
  getActivePanel = () => {
    if(this.state.activePanel == "all"){
      return this.getAccidentsListPanel()
    }
    if(this.state.activePanel == "byMonth"){
      return this.getByMonthPanel()
    }
  }
  getTimeNavigationMenu = () => {
    return (
      <div style={{gridColumnStart:"1",gridColumnEnd:"span 2",placeSelf:"stretch",display:"grid"}}>
        <Button style={{placeSelf:"stretch"}} content={"Année " + parseInt(this.state.selectedYear - 1).toString()} onClick={()=>this.goToYear(12,this.state.selectedYear-1)}/>
        <Menu size='big' pointing vertical style={{placeSelf:"stretch"}}>
          {this.state.months().map(m=>{
            return(
              parseInt(moment().format("MM")) >= m.month.month && parseInt(moment().format("YYYY")) == m.month.year || parseInt(moment().format("YYYY")) >  m.month.year ?
                <Menu.Item 
                  key={m.month.month+m.month.year} 
                  color="blue"
                  active={this.state.selectedMonth == m.month.month}
                  onClick={()=>{this.goToMonth(m.month.month)}}
                >
                  {m.month.name + " " + m.month.year}
                  <Label color={m.month.nAccident == 0 ? "grey" : "orange"}>{m.month.nAccident}</Label>
                </Menu.Item>
              :
                ""
            )}
          )}
        </Menu>
        {(this.state.selectedYear < parseInt(moment().format("YYYY")) ?
            <Button style={{placeSelf:"stretch"}} content={"Année " + parseInt(this.state.selectedYear + 1).toString()} onClick={()=>this.goToYear(1,this.state.selectedYear+1)}/>
            :
            ""
        )}
      </div>
    )
  }
  getByMonthPanel = () => {
    return (
      <Fragment>
        {this.getTimeNavigationMenu()}
        <div style={{gridColumnStart:"3",gridRowEnd:"span 2",gridColumnEnd:"span 2",placeSelf:"stretch",overflowY:"auto",paddingRight:"32px"}}>
          {(this.state.loadingMonth ? "Chargement" : this.state.byMonthAccidents())}
        </div>
      </Fragment>
    )
  }
  getAccidentsListPanel = () => {
    return(
      <div style={{gridColumnEnd:"span 4",gridRowEnd:"span 2",placeSelf:"stretch",overflowY:"auto",paddingRight:"32px"}}>
        {this.state.accidents()}
      </div>
    )
  }
  /*COMPONENTS LIFECYCLE*/
  componentDidMount = () => {
    this.loadAccidents();
    this.loadAgglomeratedAccidents(this.state.selectedMonth,this.state.selectedYear);
    this.loadAccidentsReduceOfYear(this.state.selectedYear);
  }
  render() {
    return (
      <div style={{height:"100%",padding:"8px",display:"grid",gridGap:"16px 32px",gridTemplateRows:"auto auto auto 1fr",gridTemplateColumns:"auto auto 1fr auto"}}>
        <Input style={{justifySelf:"stretch",gridColumnEnd:"span 3"}} name="accidentFilter" onChange={this.handleFilter} icon='search' placeholder='Rechercher une immatriculation' />
        <div style={{display:"flex",justifyContent:"flex-end"}}>
            <BigIconButton icon="plus" color="blue" onClick={this.showAddAccident} tooltip="Nouvel accident"/>
        </div>
        <Segment style={{placeSelf:"stretch",gridRowStart:"2",margin:"0"}}>
          <Popup position="bottom center" trigger={
              <Button size="big" onClick={()=>{
                this.setState({activePanel:"byMonth"});
                this.loadAgglomeratedAccidents(this.state.selectedMonth,this.state.selectedYear);
                this.loadAccidentsReduceOfYear(this.state.selectedYear);
              }} icon="calendar alternate outline"/>
          }>Accidents par véhicules agglomérés par mois</Popup>
          <Popup position="bottom center" trigger={
              <Button size="big" onClick={()=>this.setState({activePanel:"all"})} icon="list"/>
          }>Accidents par véhicules</Popup>
        </Segment>
        <CustomFilterSegment resetAll={this.resetAll} style={{placeSelf:"stretch",gridRowStart:"2",gridColumnEnd:"span 3"}}>
          <CustomFilter infos={this.state.archiveFilterInfos} active={this.state.archiveFilter} />
          <CustomFilter infos={this.state.missingInfosFilterInfos} active={this.state.missingInfosFilter} />
          <CustomFilter infos={this.state.answersFilterInfos} active={this.state.answersFilter} />
          <CustomFilter infos={this.state.constatSentFilterInfos} active={this.state.constatSentFilter} />
          <CustomFilter infos={this.state.responsabiliteFilterInfos} active={this.state.responsabiliteFilter} />
          <CustomFilter infos={this.state.statusFilterInfos} active={this.state.statusFilter} />
          <CustomFilter infos={this.state.docsFilterInfos} active={this.state.docsFilter} />
        </CustomFilterSegment>
        {this.getActivePanel()}
        <Modal closeOnDimmerClick={false} open={this.state.openAddAccident} onClose={this.closeAddAccident} closeIcon>
            <Modal.Header>
              Création du rapport d'accident
            </Modal.Header>
            <Modal.Content style={{textAlign:"center"}}>
                <Form style={{display:"grid",gridTemplateRows:"1fr",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                  <Form.Field>
                    <label>Véhicule concerné</label>
                    <VehiclePicker defaultValue={this.state.newVehicle} onChange={this.handleChangeVehicle}/>
                  </Form.Field>
                  <Form.Field>
                    <label>Date de l'accident</label>
                    <Input value={this.state.newOccurenceDate} onFocus={()=>{this.showDatePicker("newOccurenceDate")}} placeholder="Date de l'accident"/>
                  </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color="black" onClick={this.closeAddAccident}>Annuler</Button>
              <Button color="blue" onClick={this.addAccident}>Créer</Button>
            </Modal.Actions>
        </Modal>
        <ModalDatePicker onSelectDatePicker={this.onSelectDatePicker} closeDatePicker={this.closeDatePicker} open={this.state.openDatePicker}/>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Accidents);