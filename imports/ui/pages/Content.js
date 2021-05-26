import React, { Component, Fragment } from 'react';
import { Modal, Menu, Button, Header, Icon, Form, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import AdministrationMenu from '../molecules/AdministrationMenu';
import HexColorCodeInput from '../atoms/HexColorCodeInput';
import SocietePicker from '../atoms/SocietePicker';
import VolumePicker from '../atoms/VolumePicker';
import BrandPicker from '../atoms/BrandPicker';
import ModelPicker from '../atoms/ModelPicker';
import EnergyPicker from '../atoms/EnergyPicker';
import OrganismPicker from '../atoms/OrganismPicker';
import PayementTimePicker from '../atoms/PayementTimePicker';
import VehicleArchiveJustificationsPicker from '../atoms/VehicleArchiveJustificationsPicker';

import AccCharacteristicPicker from '../atoms/AccCharacteristicPicker';
import AccPlacePicker from '../atoms/AccPlacePicker';
import AccRoadProfilePicker from '../atoms/AccRoadProfilePicker';
import AccTrackStatePicker from '../atoms/AccTrackStatePicker';
import AccWeatherPicker from '../atoms/AccWeatherPicker';

import InterventionNaturePicker from '../atoms/InterventionNaturePicker';

import ColorPicker from '../atoms/ColorPicker';
import { withRouter } from 'react-router-dom';
import gql from 'graphql-tag';
import HexColorPicker from '../atoms/HexColorPicker';

class Content extends Component {

    state = {
        selected:false,
        newVolume:0.0,
        newBrand:"",
        newModel:"",
        newEnergy:"",
        newColorName:"",
        newColorHex:"000000",
        newOrganism:"",
        newPayementTime:"",
        newArchiveVehicleJustifications:"",
        selectedSocieteName:"",
        openHexColorPicker:false,
        needToRefreshSocietes:false,
        needToRefreshVolumes:false,
        needToRefreshBrands:false,
        needToRefreshModels:false,
        needToRefreshOrganisms:false,
        needToRefreshPayementTimes:false,
        needToRefreshColors:false,
        needToRefreshVehicleArchiveJustifications:false,
        needToRefreshAccCharacteristics:false,
        needToRefreshAccWeathers:false,
        needToRefreshAccTrackStates:false,
        needToRefreshAccRoadProfiles:false,
        needToRefreshAccPlaces:false,
        needToRefreshInterventionNatures:false,
        editSocieteQuery: gql`
            mutation editSociete($_id:String!,$name:String!){
                editSociete(_id:$_id,name:$name){
                    status
                    message
                }
            }
        `,
        addSocieteQuery : gql`
            mutation addSociete($trikey:String!,$name:String!){
                addSociete(trikey:$trikey,name:$name){
                    status
                    message
                }
            }
        `,
        deleteSocieteQuery : gql`
            mutation deleteSociete($_id:String!){
                deleteSociete(_id:$_id){
                    status
                    message
                }
            }
        `,
        addVolumeQuery : gql`
            mutation addVolume($meterCube:Float!){
                addVolume(meterCube:$meterCube){
                    status
                    message
                }
            }
        `,
        deleteVolumeQuery : gql`
            mutation deleteVolume($_id:String!){
                deleteVolume(_id:$_id){
                    status
                    message
                }
            }
        `,
        addBrandQuery : gql`
            mutation addBrand($name:String!){
                addBrand(name:$name){
                    status
                    message
                }
            }
        `,
        deleteBrandQuery : gql`
            mutation deleteBrand($_id:String!){
                deleteBrand(_id:$_id){
                    status
                    message
                }
            }
        `,
        addModelQuery : gql`
            mutation addModel($name:String!){
                addModel(name:$name){
                    status
                    message
                }
            }
        `,
        deleteModelQuery : gql`
            mutation deleteModel($_id:String!){
                deleteModel(_id:$_id){
                    status
                    message
                }
            }
        `,
        addEnergyQuery : gql`
            mutation addEnergy($name:String!){
                addEnergy(name:$name){
                    status
                    message
                }
            }
        `,
        deleteEnergyQuery : gql`
            mutation deleteEnergy($_id:String!){
                deleteEnergy(_id:$_id){
                    status
                    message
                }
            }
        `,
        addOrganismQuery : gql`
            mutation addOrganism($name:String!){
                addOrganism(name:$name){
                    status
                    message
                }
            }
        `,
        deleteOrganismQuery : gql`
            mutation deleteOrganism($_id:String!){
                deleteOrganism(_id:$_id){
                    status
                    message
                }
            }
        `,
        addPayementTimeQuery : gql`
            mutation addPayementTime($months:Int!){
                addPayementTime(months:$months){
                    status
                    message
                }
            }
        `,
        deletePayementTimeQuery : gql`
            mutation deletePayementTime($_id:String!){
                deletePayementTime(_id:$_id){
                    status
                    message
                }
            }
        `,
        addColorQuery : gql`
            mutation addColor($name:String!,$hex:String!){
                addColor(name:$name,hex:$hex){
                    status
                    message
                }
            }
        `,
        deleteColorQuery : gql`
            mutation deleteColor($_id:String!){
                deleteColor(_id:$_id){
                    status
                    message
                }
            }
        `,
        addVehicleArchiveJustificationQuery : gql`
            mutation addVehicleArchiveJustification($justification:String!){
                addVehicleArchiveJustification(justification:$justification){
                    status
                    message
                }
            }
        `,
        deleteVehicleArchiveJustificationQuery : gql`
            mutation deleteVehicleArchiveJustification($_id:String!){
                deleteVehicleArchiveJustification(_id:$_id){
                    status
                    message
                }
            }
        `,
        addAccCharacteristicQuery : gql`
            mutation addAccCharacteristic($name:String!){
                addAccCharacteristic(name:$name){
                    status
                    message
                }
            }
        `,
        deleteAccCharacteristicQuery : gql`
            mutation deleteAccCharacteristic($_id:String!){
                deleteAccCharacteristic(_id:$_id){
                    status
                    message
                }
            }
        `,
        addAccWeatherQuery : gql`
            mutation addAccWeather($name:String!){
                addAccWeather(name:$name){
                    status
                    message
                }
            }
        `,
        deleteAccWeatherQuery : gql`
            mutation deleteAccWeather($_id:String!){
                deleteAccWeather(_id:$_id){
                    status
                    message
                }
            }
        `,
        addAccTrackStateQuery : gql`
            mutation addAccTrackState($name:String!){
                addAccTrackState(name:$name){
                    status
                    message
                }
            }
        `,
        deleteAccTrackStateQuery : gql`
            mutation deleteAccTrackState($_id:String!){
                deleteAccTrackState(_id:$_id){
                    status
                    message
                }
            }
        `,
        addAccRoadProfileQuery : gql`
            mutation addAccRoadProfile($name:String!){
                addAccRoadProfile(name:$name){
                    status
                    message
                }
            }
        `,
        deleteAccRoadProfileQuery : gql`
            mutation deleteAccRoadProfile($_id:String!){
                deleteAccRoadProfile(_id:$_id){
                    status
                    message
                }
            }
        `,
        addAccPlaceQuery : gql`
        mutation addAccPlace($name:String!){
            addAccPlace(name:$name){
                status
                message
            }
        }
        `,
        deleteAccPlaceQuery : gql`
            mutation deleteAccPlace($_id:String!){
                deleteAccPlace(_id:$_id){
                    status
                    message
                }
            }
        `,
        addInterventionNatureQuery : gql`
            mutation addInterventionNature($name:String!){
                addInterventionNature(name:$name){
                    status
                    message
                }
            }
        `,
        deleteInterventionNatureQuery : gql`
            mutation deleteInterventionNature($_id:String!){
                deleteInterventionNature(_id:$_id){
                    status
                    message
                }
            }
        `,
    }

    handleChange = e =>{
        this.setState({
            [e.target.name]:e.target.value
        });
    }

    handleDigitOnlyChange = e =>{
        this.setState({
            [e.target.name]:e.target.value.replace(/\D/g,'')
        });
    }

    //Societes
    handleChangeSociete = (e, { value }) => this.setState({ selectedSociete:value,selectedSocieteName:this.props.getSocieteName(value)})
    showEditSociete = () => {
        this.setState({
            openEditSociete:true
        })
    }
    showAddSociete = () => {
        this.setState({
            openAddSociete:true
        })
    }
    showDelSociete = () => {
        this.setState({
            openDelSociete:true
        })
    }
    closeEditSociete = () => {
        this.setState({
            openEditSociete:false
        })
    }
    closeAddSociete = () => {
        this.setState({
            openAddSociete:false
        })
    }
    closeDelSociete = () => {
        this.setState({
            openDelSociete:false
        })
    }
    editSociete = () => {
        this.closeEditSociete()
        this.props.client.mutate({
            mutation:this.state.editSocieteQuery,
            variables:{
                name:this.state.nameSociete,
                _id:this.state.selectedSociete
            }
        }).then(({data})=>{
            data.editSociete.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.props.loadSocietes();
                    this.setState({
                        needToRefreshSocietes:true,
                        selectedSocieteName:this.props.getSocieteName(this.state.selectedSociete)
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    addSociete = () => {
        this.closeAddSociete()
        this.props.client.mutate({
            mutation:this.state.addSocieteQuery,
            variables:{
                trikey:this.state.trikeySociete,
                name:this.state.nameSociete
            }
        }).then(({data})=>{
            data.addSociete.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshSocietes:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteSociete = () => {
        this.closeDelSociete()
        this.props.client.mutate({
            mutation:this.state.deleteSocieteQuery,
            variables:{
                _id:this.state.selectedSociete
            }
        }).then(({data})=>{
            data.deleteSociete.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshSocietes:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshSocietes = () => {
        this.setState({
            needToRefreshSocietes:false
        })
    }

    //Volume
    handleChangeVolume = (e, { value }) => this.setState({ selectedVolume:value })
    showAddVolume = () => {
        this.setState({
            openAddVolume:true
        })
    }
    showDelVolume = () => {
        this.setState({
            openDelVolume:true
        })
    }
    closeAddVolume = () => {
        this.setState({
            openAddVolume:false
        })
    }
    closeDelVolume = () => {
        this.setState({
            openDelVolume:false
        })
    }
    addVolume = () => {
        this.closeAddVolume()
        this.props.client.mutate({
            mutation:this.state.addVolumeQuery,
            variables:{
                meterCube:parseFloat(this.state.newVolume)
            }
        }).then(({data})=>{
            data.addVolume.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshVolumes:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteVolume = () => {
        this.closeDelVolume()
        this.props.client.mutate({
            mutation:this.state.deleteVolumeQuery,
            variables:{
                _id:this.state.selectedVolume
            }
        }).then(({data})=>{
            data.deleteVolume.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshVolumes:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshVolumes = () => {
        this.setState({
            needToRefreshVolumes:false
        })
    }

    //Brand
    handleChangeBrand = (e, { value }) => this.setState({ selectedBrand:value })
    showAddBrand = () => {
        this.setState({
            openAddBrand:true
        })
    }
    showDelBrand = () => {
        this.setState({
            openDelBrand:true
        })
    }
    closeAddBrand = () => {
        this.setState({
            openAddBrand:false
        })
    }
    closeDelBrand = () => {
        this.setState({
            openDelBrand:false
        })
    }
    addBrand = () => {
        this.closeAddBrand()
        this.props.client.mutate({
            mutation:this.state.addBrandQuery,
            variables:{
                name:this.state.newBrand
            }
        }).then(({data})=>{
            data.addBrand.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshBrands:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteBrand = () => {
        this.closeDelBrand()
        this.props.client.mutate({
            mutation:this.state.deleteBrandQuery,
            variables:{
                _id:this.state.selectedBrand
            }
        }).then(({data})=>{
            data.deleteBrand.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshBrands:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshBrands = () => {
        this.setState({
            needToRefreshBrands:false
        })
    }

    //Model
    handleChangeModel = (e, { value }) => this.setState({ selectedModel:value })
    showAddModel = () => {
        this.setState({
            openAddModel:true
        })
    }
    showDelModel = () => {
        this.setState({
            openDelModel:true
        })
    }
    closeAddModel = () => {
        this.setState({
            openAddModel:false
        })
    }
    closeDelModel = () => {
        this.setState({
            openDelModel:false
        })
    }
    addModel = () => {
        this.closeAddModel()
        this.props.client.mutate({
            mutation:this.state.addModelQuery,
            variables:{
                name:this.state.newModel
            }
        }).then(({data})=>{
            data.addModel.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshModels:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteModel = () => {
        this.closeDelModel()
        this.props.client.mutate({
            mutation:this.state.deleteModelQuery,
            variables:{
                _id:this.state.selectedModel
            }
        }).then(({data})=>{
            data.deleteModel.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshModels:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshModels = () => {
        this.setState({
            needToRefreshModels:false
        })
    }

    //Energy
    handleChangeEnergy = (e, { value }) => this.setState({ selectedEnergy:value })
    showAddEnergy = () => {
      this.setState({
          openAddEnergy:true
      })
    }
    showDelEnergy = () => {
      this.setState({
          openDelEnergy:true
      })
    }
    closeAddEnergy = () => {
      this.setState({
          openAddEnergy:false
      })
    }
    closeDelEnergy = () => {
      this.setState({
          openDelEnergy:false
      })
    }
    addEnergy = () => {
      this.closeAddEnergy()
      this.props.client.mutate({
          mutation:this.state.addEnergyQuery,
          variables:{
              name:this.state.newEnergy
          }
      }).then(({data})=>{
          data.addEnergy.map(qrm=>{
              if(qrm.status){
                  this.props.toast({message:qrm.message,type:"success"});
                  this.setState({
                      needToRefreshEnergies:true
                  })
              }else{
                  this.props.toast({message:qrm.message,type:"error"});
              }
          })
      })
    }
    deleteEnergy = () => {
        this.closeDelEnergy()
        this.props.client.mutate({
          mutation:this.state.deleteEnergyQuery,
          variables:{
              _id:this.state.selectedEnergy
          }
      }).then(({data})=>{
          data.deleteEnergy.map(qrm=>{
              if(qrm.status){
                  this.props.toast({message:qrm.message,type:"success"});
                  this.setState({
                      needToRefreshEnergies:true
                  })
              }else{
                  this.props.toast({message:qrm.message,type:"error"});
              }
          })
      })
    }
    didRefreshEnergies = () => {
      this.setState({
          needToRefreshEnergies:false
      })
    }

    //Organism
    handleChangeOrganism = (e, { value }) => this.setState({ selectedOrganism:value })
    showAddOrganism = () => {
        this.setState({
            openAddOrganism:true
        })
    }
    showDelOrganism = () => {
        this.setState({
            openDelOrganism:true
        })
    }
    closeAddOrganism = () => {
        this.setState({
            openAddOrganism:false
        })
    }
    closeDelOrganism = () => {
        this.setState({
            openDelOrganism:false
        })
    }
    addOrganism = () => {
        this.closeAddOrganism()
        this.props.client.mutate({
            mutation:this.state.addOrganismQuery,
            variables:{
                name:this.state.newOrganism
            }
        }).then(({data})=>{
            data.addOrganism.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshOrganisms:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteOrganism = () => {
        this.closeDelOrganism()
        this.props.client.mutate({
            mutation:this.state.deleteOrganismQuery,
            variables:{
                _id:this.state.selectedOrganism
            }
        }).then(({data})=>{
            data.deleteOrganism.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshOrganisms:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshOrganisms = () => {
        this.setState({
            needToRefreshOrganisms:false
        })
    }

    //PayementTime
    handleChangePayementTime = (e, { value }) => this.setState({ selectedPayementTime:value })
    showAddPayementTime = () => {
        this.setState({
            openAddPayementTime:true
        })
    }
    showDelPayementTime = () => {
        this.setState({
            openDelPayementTime:true
        })
    }
    closeAddPayementTime = () => {
        this.setState({
            openAddPayementTime:false
        })
    }
    closeDelPayementTime = () => {
        this.setState({
            openDelPayementTime:false
        })
    }
    addPayementTime = () => {
        this.closeAddPayementTime()
        this.props.client.mutate({
            mutation:this.state.addPayementTimeQuery,
            variables:{
                months:parseInt(this.state.newPayementTime)
            }
        }).then(({data})=>{
            data.addPayementTime.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshPayementTimes:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deletePayementTime = () => {
        this.closeDelPayementTime()
        this.props.client.mutate({
            mutation:this.state.deletePayementTimeQuery,
            variables:{
                _id:this.state.selectedPayementTime
            }
        }).then(({data})=>{
            data.deletePayementTime.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshPayementTimes:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshPayementTimes = () => {
        this.setState({
            needToRefreshPayementTimes:false
        })
    }

    //Color
    handleChangeColor = (e, { value }) => this.setState({ selectedColor:value })
    showAddColor = () => {
        this.setState({
            openAddColor:true
        })
    }
    showDelColor = () => {
        this.setState({
            openDelColor:true
        })
    }
    closeAddColor = () => {
        this.setState({
            openAddColor:false
        })
    }
    closeDelColor = () => {
        this.setState({
            openDelColor:false
        })
    }
    addColor = () => {
        this.closeAddColor()
        this.props.client.mutate({
            mutation:this.state.addColorQuery,
            variables:{
                name:this.state.newColorName,
                hex:this.state.newColorHex
            }
        }).then(({data})=>{
            data.addColor.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshColors:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteColor = () => {
        this.closeDelColor()
        this.props.client.mutate({
            mutation:this.state.deleteColorQuery,
            variables:{
                _id:this.state.selectedColor
            }
        }).then(({data})=>{
            data.deleteColor.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshColors:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshColors = () => {
        this.setState({
            needToRefreshColors:false
        })
    }
    selectHexColor = hex => {
        this.closeHexColorPicker()
        this.setState({
            newColorHex:hex.replace("#","")
        })
    }
    closeHexColorPicker = () => {
        this.setState({
            openHexColorPicker:false
        })
    }
    showHexColorPicker = () => {
        this.setState({
            openHexColorPicker:true
        })
    }

    //Justification Archivage Vehicles
    handleChangeVehicleArchiveJustification = (e, { value }) => this.setState({ selectedVehicleArchiveJustification:value })
    showAddVehicleArchiveJustification = () => {
        this.setState({
            openAddVehicleArchiveJustification:true
        })
    }
    showDelVehicleArchiveJustification = () => {
        this.setState({
            openDelVehicleArchiveJustification:true
        })
    }
    closeAddVehicleArchiveJustification = () => {
        this.setState({
            openAddVehicleArchiveJustification:false
        })
    }
    closeDelVehicleArchiveJustification = () => {
        this.setState({
            openDelVehicleArchiveJustification:false
        })
    }
    addVehicleArchiveJustification = () => {
        this.closeAddVehicleArchiveJustification()
        this.props.client.mutate({
            mutation:this.state.addVehicleArchiveJustificationQuery,
            variables:{
                justification:this.state.newVehicleArchiveJustification
            }
        }).then(({data})=>{
            data.addVehicleArchiveJustification.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshVehicleArchiveJustifications:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteVehicleArchiveJustification = () => {
        this.closeDelVehicleArchiveJustification()
        this.props.client.mutate({
            mutation:this.state.deleteVehicleArchiveJustificationQuery,
            variables:{
                _id:this.state.selectedVehicleArchiveJustification
            }
        }).then(({data})=>{
            data.deleteVehicleArchiveJustification.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshVehicleArchiveJustifications:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshVehicleArchiveJustifications = () => {
        this.setState({
            needToRefreshVehicleArchiveJustifications:false
        })
    }

    //Characteristiques d'accident
    handleChangeAccCharacteristic = (e, { value }) => this.setState({ selectedAccCharacteristic:value })
    showAddAccCharacteristic = () => {
        this.setState({
            openAddAccCharacteristic:true
        })
    }
    showDelAccCharacteristic = () => {
        this.setState({
            openDelAccCharacteristic:true
        })
    }
    closeAddAccCharacteristic = () => {
        this.setState({
            openAddAccCharacteristic:false
        })
    }
    closeDelAccCharacteristic = () => {
        this.setState({
            openDelAccCharacteristic:false
        })
    }
    addAccCharacteristic = () => {
        this.closeAddAccCharacteristic()
        this.props.client.mutate({
            mutation:this.state.addAccCharacteristicQuery,
            variables:{
                name:this.state.newAccCharacteristic
            }
        }).then(({data})=>{
            data.addAccCharacteristic.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccCharacteristics:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteAccCharacteristic = () => {
        this.closeDelAccCharacteristic()
        this.props.client.mutate({
            mutation:this.state.deleteAccCharacteristicQuery,
            variables:{
                _id:this.state.selectedAccCharacteristic
            }
        }).then(({data})=>{
            data.deleteAccCharacteristic.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccCharacteristics:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshAccCharacteristics = () => {
        this.setState({
            needToRefreshAccCharacteristics:false
        })
    }

    //Conditions météo d'accident
    handleChangeAccWeather = (e, { value }) => this.setState({ selectedAccWeather:value })
    showAddAccWeather = () => {
        this.setState({
            openAddAccWeather:true
        })
    }
    showDelAccWeather = () => {
        this.setState({
            openDelAccWeather:true
        })
    }
    closeAddAccWeather = () => {
        this.setState({
            openAddAccWeather:false
        })
    }
    closeDelAccWeather = () => {
        this.setState({
            openDelAccWeather:false
        })
    }
    addAccWeather = () => {
        this.closeAddAccWeather()
        this.props.client.mutate({
            mutation:this.state.addAccWeatherQuery,
            variables:{
                name:this.state.newAccWeather
            }
        }).then(({data})=>{
            data.addAccWeather.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccWeathers:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteAccWeather = () => {
        this.closeDelAccWeather()
        this.props.client.mutate({
            mutation:this.state.deleteAccWeatherQuery,
            variables:{
                _id:this.state.selectedAccWeather
            }
        }).then(({data})=>{
            data.deleteAccWeather.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccWeathers:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshAccWeathers = () => {
        this.setState({
            needToRefreshAccWeathers:false
        })
    }

    //Etat de la chaussée lors d'accident
    handleChangeAccTrackState = (e, { value }) => this.setState({ selectedAccTrackState:value })
    showAddAccTrackState = () => {
        this.setState({
            openAddAccTrackState:true
        })
    }
    showDelAccTrackState = () => {
        this.setState({
            openDelAccTrackState:true
        })
    }
    closeAddAccTrackState = () => {
        this.setState({
            openAddAccTrackState:false
        })
    }
    closeDelAccTrackState = () => {
        this.setState({
            openDelAccTrackState:false
        })
    }
    addAccTrackState = () => {
        this.closeAddAccTrackState()
        this.props.client.mutate({
            mutation:this.state.addAccTrackStateQuery,
            variables:{
                name:this.state.newAccTrackState
            }
        }).then(({data})=>{
            data.addAccTrackState.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccTrackStates:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteAccTrackState = () => {
        this.closeDelAccTrackState()
        this.props.client.mutate({
            mutation:this.state.deleteAccTrackStateQuery,
            variables:{
                _id:this.state.selectedAccTrackState
            }
        }).then(({data})=>{
            data.deleteAccTrackState.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccTrackStates:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshAccTrackStates = () => {
        this.setState({
            needToRefreshAccTrackStates:false
        })
    }

    //Profil de la route lors accident
    handleChangeAccRoadProfile = (e, { value }) => this.setState({ selectedAccRoadProfile:value })
    showAddAccRoadProfile = () => {
        this.setState({
            openAddAccRoadProfile:true
        })
    }
    showDelAccRoadProfile = () => {
        this.setState({
            openDelAccRoadProfile:true
        })
    }
    closeAddAccRoadProfile = () => {
        this.setState({
            openAddAccRoadProfile:false
        })
    }
    closeDelAccRoadProfile = () => {
        this.setState({
            openDelAccRoadProfile:false
        })
    }
    addAccRoadProfile = () => {
        this.closeAddAccRoadProfile()
        this.props.client.mutate({
            mutation:this.state.addAccRoadProfileQuery,
            variables:{
                name:this.state.newAccRoadProfile
            }
        }).then(({data})=>{
            data.addAccRoadProfile.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccRoadProfiles:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteAccRoadProfile = () => {
        this.closeDelAccRoadProfile()
        this.props.client.mutate({
            mutation:this.state.deleteAccRoadProfileQuery,
            variables:{
                _id:this.state.selectedAccRoadProfile
            }
        }).then(({data})=>{
            data.deleteAccRoadProfile.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccRoadProfiles:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshAccRoadProfiles = () => {
        this.setState({
            needToRefreshAccRoadProfiles:false
        })
    }

    //Lieu d'accident
    handleChangeAccPlace = (e, { value }) => this.setState({ selectedAccPlace:value })
    showAddAccPlace = () => {
        this.setState({
            openAddAccPlace:true
        })
    }
    showDelAccPlace = () => {
        this.setState({
            openDelAccPlace:true
        })
    }
    closeAddAccPlace = () => {
        this.setState({
            openAddAccPlace:false
        })
    }
    closeDelAccPlace = () => {
        this.setState({
            openDelAccPlace:false
        })
    }
    addAccPlace = () => {
        this.closeAddAccPlace()
        this.props.client.mutate({
            mutation:this.state.addAccPlaceQuery,
            variables:{
                name:this.state.newAccPlace
            }
        }).then(({data})=>{
            data.addAccPlace.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccPlaces:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteAccPlace = () => {
        this.closeDelAccPlace()
        this.props.client.mutate({
            mutation:this.state.deleteAccPlaceQuery,
            variables:{
                _id:this.state.selectedAccPlace
            }
        }).then(({data})=>{
            data.deleteAccPlace.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshAccPlaces:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshAccPlaces = () => {
        this.setState({
            needToRefreshAccPlaces:false
        })
    }

    //Nature d'intervention
    handleChangeInterventionNature = (e, { value }) => this.setState({ selectedInterventionNature:value })
    showAddInterventionNature = () => {
        this.setState({
            openAddInterventionNature:true
        })
    }
    showDelInterventionNature = () => {
        this.setState({
            openDelInterventionNature:true
        })
    }
    closeAddInterventionNature = () => {
        this.setState({
            openAddInterventionNature:false
        })
    }
    closeDelInterventionNature = () => {
        this.setState({
            openDelInterventionNature:false
        })
    }
    addInterventionNature = () => {
        this.closeAddInterventionNature()
        this.props.client.mutate({
            mutation:this.state.addInterventionNatureQuery,
            variables:{
                name:this.state.newInterventionNature
            }
        }).then(({data})=>{
            data.addInterventionNature.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshInterventionNatures:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    deleteInterventionNature = () => {
        this.closeDelInterventionNature()
        this.props.client.mutate({
            mutation:this.state.deleteInterventionNatureQuery,
            variables:{
                _id:this.state.selectedInterventionNature
            }
        }).then(({data})=>{
            data.deleteInterventionNature.map(qrm=>{
                if(qrm.status){
                    this.props.toast({message:qrm.message,type:"success"});
                    this.setState({
                        needToRefreshInterventionNatures:true
                    })
                }else{
                    this.props.toast({message:qrm.message,type:"error"});
                }
            })
        })
    }
    didRefreshInterventionNatures = () => {
        this.setState({
            needToRefreshInterventionNatures:false
        })
    }

    render() {
        return (
            <Fragment>
                <div>
                    <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                        <AdministrationMenu active="contenu"/>
                    </div>
                    <Table celled compact="very">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell textAlign="center">Contenu</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Valeurs existantes</Table.HeaderCell>
                                <Table.HeaderCell textAlign="center">Actions</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='sitemap' />
                                        <Header.Content>Sociétés du groupe</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <SocietePicker didRefresh={this.didRefreshSocietes} needToRefresh={this.state.needToRefreshSocietes} groupAppears={false} onChange={this.handleChangeSociete} value={this.state.selectedSociete} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="green" onClick={this.showEditSociete} icon labelPosition='right'>Renommer<Icon name='edit'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddSociete} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelSociete} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='expand arrows alternate' />
                                        <Header.Content>Volumes des véhicules</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <VolumePicker didRefresh={this.didRefreshVolumes} needToRefresh={this.state.needToRefreshVolumes} onChange={this.handleChangeVolume} value={this.state.selectedVolume} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddVolume} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelVolume} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='tag' />
                                        <Header.Content>Marque des véhicules</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <BrandPicker didRefresh={this.didRefreshBrands} needToRefresh={this.state.needToRefreshBrands} onChange={this.handleChangeBrand} value={this.state.selectedBrand} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddBrand} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelBrand} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='truck' />
                                        <Header.Content>Modèle des véhicules</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <ModelPicker didRefresh={this.didRefreshModels} needToRefresh={this.state.needToRefreshModels} onChange={this.handleChangeModel} value={this.state.selectedModel} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddModel} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelModel} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='bolt' />
                                        <Header.Content>Type d'énergies des véhicules</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <EnergyPicker didRefresh={this.didRefreshEnergies} needToRefresh={this.state.needToRefreshEnergies} onChange={this.handleChangeEnergy} value={this.state.selectedEnergy} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddEnergy} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelEnergy} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='credit card' />
                                        <Header.Content>Organisme de financement</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <OrganismPicker didRefresh={this.didRefreshOrganisms} needToRefresh={this.state.needToRefreshOrganisms} onChange={this.handleChangeOrganism} value={this.state.selectedOrganism} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddOrganism} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelOrganism} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='calendar alternate outline'/>
                                        <Header.Content>Durée de financement</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <PayementTimePicker didRefresh={this.didRefreshPayementTimes} needToRefresh={this.state.needToRefreshPayementTimes} onChange={this.handleChangePayementTime} value={this.state.selectedPayementTime} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddPayementTime} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelPayementTime} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='paint brush' />
                                        <Header.Content>Couleurs des véhicules</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <ColorPicker didRefresh={this.didRefreshColors} needToRefresh={this.state.needToRefreshColors} onChange={this.handleChangeColor} value={this.state.selectedColor} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddColor} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelColor} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='archive'/>
                                        <Header.Content>Justifications d'archivage de véhicules</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <VehicleArchiveJustificationsPicker didRefresh={this.didRefreshVehicleArchiveJustifications} needToRefresh={this.state.needToRefreshVehicleArchiveJustifications} onChange={this.handleChangeVehicleArchiveJustification} value={this.state.selectedVehicleArchiveJustification} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddVehicleArchiveJustification} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelVehicleArchiveJustification} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='fire'/>
                                        <Header.Content>Characteristiques d'accident</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <AccCharacteristicPicker didRefresh={this.didRefreshAccCharacteristics} needToRefresh={this.state.needToRefreshAccCharacteristics} onChange={this.handleChangeAccCharacteristic} value={this.state.selectedAccCharacteristic} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddAccCharacteristic} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelAccCharacteristic} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='fire'/>
                                        <Header.Content>Conditions météorologique d'accident</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <AccWeatherPicker didRefresh={this.didRefreshAccWeathers} needToRefresh={this.state.needToRefreshAccWeathers} onChange={this.handleChangeAccWeather} value={this.state.selectedAccWeather} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddAccWeather} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelAccWeather} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='fire'/>
                                        <Header.Content>Lieu d'accident</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <AccPlacePicker didRefresh={this.didRefreshAccPlaces} needToRefresh={this.state.needToRefreshAccPlaces} onChange={this.handleChangeAccPlace} value={this.state.selectedAccPlace} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddAccPlace} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelAccPlace} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='fire'/>
                                        <Header.Content>État de la chaussée lors d'accident</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <AccTrackStatePicker didRefresh={this.didRefreshAccTrackStates} needToRefresh={this.state.needToRefreshAccTrackStates} onChange={this.handleChangeAccTrackState} value={this.state.selectedAccTrackState} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddAccTrackState} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelAccTrackState} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='fire'/>
                                        <Header.Content>Profil de la route lors d'accident</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <AccRoadProfilePicker didRefresh={this.didRefreshAccRoadProfiles} needToRefresh={this.state.needToRefreshAccRoadProfiles} onChange={this.handleChangeAccRoadProfile} value={this.state.selectedAccRoadProfile} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddAccRoadProfile} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelAccRoadProfile} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as="h4">
                                        <Icon name='clipboard check'/>
                                        <Header.Content>Nature d'intervention</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <InterventionNaturePicker didRefresh={this.didRefreshInterventionNature} needToRefresh={this.state.needToRefreshInterventionNatures} onChange={this.handleChangeInterventionNature} value={this.state.selectedInterventionNature} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddInterventionNature} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelInterventionNature} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>

                {/* SOCIETE */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openEditSociete} onClose={this.closeEditSociete} closeIcon>
                    <Modal.Header>
                        Edition du nom de la société {this.state.selectedSocieteName}
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}><label>Nouveau nom de la société</label><input defaultValue={this.state.selectedSocieteName} onChange={this.handleChange} name="nameSociete"/></Form.Field>                            
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeEditSociete}>Annuler</Button>
                        <Button color="green" onClick={this.editSociete}>Renommer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddSociete} onClose={this.closeAddSociete} closeIcon>
                    <Modal.Header>
                        Création de la société
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}><label>Nom de la société</label><input onChange={this.handleChange} name="nameSociete"/></Form.Field>
                            <Form.Field style={{placeSelf:"stretch"}}><label>Trigramme</label><input onChange={this.handleChange} name="trikeySociete"/></Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddSociete}>Annuler</Button>
                        <Button color="green" onClick={this.addSociete}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelSociete} onClose={this.closeDelSociete} closeIcon>
                    <Modal.Header>
                        Suppression de la société : êtes vous sûr ?
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelSociete}>Annuler</Button>
                        <Button color="red" onClick={this.deleteSociete}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
                
                {/* VOLUME */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddVolume} onClose={this.closeAddVolume} closeIcon>
                    <Modal.Header>
                        Ajout du volume
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Volume</label>
                                <input onChange={this.handleChange} name="newVolume"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddVolume}>Annuler</Button>
                        <Button color="green" onClick={this.addVolume}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelVolume} onClose={this.closeDelVolume} closeIcon>
                    <Modal.Header>
                        Suppression du volume
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelVolume}>Annuler</Button>
                        <Button color="red" onClick={this.deleteVolume}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* BRAND */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddBrand} onClose={this.closeAddBrand} closeIcon>
                    <Modal.Header>
                        Ajout de la marque
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Marque</label>
                                <input onChange={this.handleChange} name="newBrand"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddBrand}>Annuler</Button>
                        <Button color="green" onClick={this.addBrand}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelBrand} onClose={this.closeDelBrand} closeIcon>
                    <Modal.Header>
                        Suppression de la marque
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelBrand}>Annuler</Button>
                        <Button color="red" onClick={this.deleteBrand}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* MODEL */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddModel} onClose={this.closeAddModel} closeIcon>
                    <Modal.Header>
                        Ajout du modèle
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Modèle</label>
                                <input onChange={this.handleChange} name="newModel"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddModel}>Annuler</Button>
                        <Button color="green" onClick={this.addModel}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelModel} onClose={this.closeDelModel} closeIcon>
                    <Modal.Header>
                        Suppression du modèle
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelModel}>Annuler</Button>
                        <Button color="red" onClick={this.deleteModel}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* ENERGY */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddEnergy} onClose={this.closeAddEnergy} closeIcon>
                    <Modal.Header>
                        Ajout du type d'énergie
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Énergie</label>
                                <input onChange={this.handleChange} name="newEnergy"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddEnergy}>Annuler</Button>
                        <Button color="green" onClick={this.addEnergy}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelEnergy} onClose={this.closeDelEnergy} closeIcon>
                    <Modal.Header>
                        Suppression du type d'énergie
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelEnergy}>Annuler</Button>
                        <Button color="red" onClick={this.deleteEnergy}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* ORGANISM */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddOrganism} onClose={this.closeAddOrganism} closeIcon>
                    <Modal.Header>
                        Ajout de l'organisme
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Organisme</label>
                                <input onChange={this.handleChange} name="newOrganism"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddOrganism}>Annuler</Button>
                        <Button color="green" onClick={this.addOrganism}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelOrganism} onClose={this.closeDelOrganism} closeIcon>
                    <Modal.Header>
                        Suppression de l'organisme
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelOrganism}>Annuler</Button>
                        <Button color="red" onClick={this.deleteOrganism}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* PAYEMENT TIME */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddPayementTime} onClose={this.closeAddPayementTime} closeIcon>
                    <Modal.Header>
                        Ajout de la durée de financement
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Durée en mois</label>
                                <input onChange={this.handleDigitOnlyChange} value={this.state.newPayementTime} name="newPayementTime"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddPayementTime}>Annuler</Button>
                        <Button color="green" onClick={this.addPayementTime}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelPayementTime} onClose={this.closeDelPayementTime} closeIcon>
                    <Modal.Header>
                        Suppression de la durée de financement
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelPayementTime}>Annuler</Button>
                        <Button color="red" onClick={this.deletePayementTime}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* COLOR */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddColor} onClose={this.closeAddColor} closeIcon>
                    <Modal.Header>
                        Ajout de la couleur
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gridGap:"16px"}}>
                            <Form.Field style={{gridColumnEnd:"span 3",gridRowStart:"1",placeSelf:"stretch"}}>
                                <label>Nommez la couleur</label>
                                <input onChange={this.handleChange} name="newColorName"/>
                            </Form.Field>
                            <HexColorCodeInput style={{gridColumnEnd:"span 3",gridRowStart:"2",placeSelf:"stretch"}} color={this.state.newColorHex} onFocus={this.showHexColorPicker} name="newColorHex"/>
                            <div style={{placeSelf:"center",gridRowStart:"3",gridColumnStart:"2",width:"64px",height:"64px",backgroundColor:"#"+this.state.newColorHex,borderRadius:"6px",border:"2px solid black"}}></div>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddColor}>Annuler</Button>
                        <Button color="green" onClick={this.addColor}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelColor} onClose={this.closeDelColor} closeIcon>
                    <Modal.Header>
                        Suppression de la couleur
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeDelColor}>Annuler</Button>
                        <Button color="red" onClick={this.deleteColor}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
                <HexColorPicker hex={"#"+this.state.newColorHex} open={this.state.openHexColorPicker} close={this.closeHexColorPicker} onSelect={this.selectHexColor}/>

                {/* JUSTIFICATION ARCHIVAGE */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddVehicleArchiveJustification} onClose={this.closeAddVehicleArchiveJustification} closeIcon>
                    <Modal.Header>
                        Ajout de la justification
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Justification</label>
                                <input onChange={this.handleChange} name="newVehicleArchiveJustification"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddVehicleArchiveJustification}>Annuler</Button>
                        <Button color="green" onClick={this.addVehicleArchiveJustification}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelVehicleArchiveJustification} onClose={this.closeDelVehicleArchiveJustification} closeIcon>
                    <Modal.Header>
                        Suppression de la justification
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddVehicleArchiveJustification}>Annuler</Button>
                        <Button color="red" onClick={this.deleteVehicleArchiveJustification}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
            
                {/* ACCIDENT CHARACTERISTICS */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddAccCharacteristic} onClose={this.closeAddAccCharacteristic} closeIcon>
                    <Modal.Header>
                        Ajout de la caractéristique
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Dénomination</label>
                                <input onChange={this.handleChange} name="newAccCharacteristic"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccCharacteristic}>Annuler</Button>
                        <Button color="green" onClick={this.addAccCharacteristic}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelAccCharacteristic} onClose={this.closeDelAccCharacteristic} closeIcon>
                    <Modal.Header>
                        Suppression de la caractéristique
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccCharacteristic}>Annuler</Button>
                        <Button color="red" onClick={this.deleteAccCharacteristic}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
            
                {/* ACCIDENT PLACES */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddAccPlace} onClose={this.closeAddAccPlace} closeIcon>
                    <Modal.Header>
                        Ajout du lieu d'accident
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Lieu</label>
                                <input onChange={this.handleChange} name="newAccPlace"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccPlace}>Annuler</Button>
                        <Button color="green" onClick={this.addAccPlace}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelAccPlace} onClose={this.closeDelAccPlace} closeIcon>
                    <Modal.Header>
                        Suppression du lieu d'accident
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccPlace}>Annuler</Button>
                        <Button color="red" onClick={this.deleteAccPlace}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* ACCIDENT STATES OF TRACK */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddAccTrackState} onClose={this.closeAddAccTrackState} closeIcon>
                    <Modal.Header>
                        Ajout d'un état de la chaussé
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>État</label>
                                <input onChange={this.handleChange} name="newAccTrackState"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccTrackState}>Annuler</Button>
                        <Button color="green" onClick={this.addAccTrackState}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelAccTrackState} onClose={this.closeDelAccTrackState} closeIcon>
                    <Modal.Header>
                        Suppression d'un état de la chaussé
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccTrackState}>Annuler</Button>
                        <Button color="red" onClick={this.deleteAccTrackState}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* ACCIDENT WEATHERS */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddAccWeather} onClose={this.closeAddAccWeather} closeIcon>
                    <Modal.Header>
                        Ajout d'une condition météorologique
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Météo</label>
                                <input onChange={this.handleChange} name="newAccWeather"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccWeather}>Annuler</Button>
                        <Button color="green" onClick={this.addAccWeather}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelAccWeather} onClose={this.closeDelAccWeather} closeIcon>
                    <Modal.Header>
                        Suppression d'une condition météorologique
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccWeather}>Annuler</Button>
                        <Button color="red" onClick={this.deleteAccWeather}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* ACCIDENT ROAD PROFILES */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddAccRoadProfile} onClose={this.closeAddAccRoadProfile} closeIcon>
                    <Modal.Header>
                        Ajout d'un profil de route lors d'accident
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Dénomination</label>
                                <input onChange={this.handleChange} name="newAccRoadProfile"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccRoadProfile}>Annuler</Button>
                        <Button color="green" onClick={this.addAccRoadProfile}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelAccRoadProfile} onClose={this.closeDelAccRoadProfile} closeIcon>
                    <Modal.Header>
                        Suppression d'un profil de route lors d'accident
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddAccRoadProfile}>Annuler</Button>
                        <Button color="red" onClick={this.deleteAccRoadProfile}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>

                {/* INTERVENTION NATURE */}
                <Modal size="mini" closeOnDimmerClick={false} open={this.state.openAddInterventionNature} onClose={this.closeAddInterventionNature} closeIcon>
                    <Modal.Header>
                        Ajout d'un profil de route lors d'accident
                    </Modal.Header>
                    <Modal.Content style={{textAlign:"center"}}>
                        <Form style={{display:"grid",gridTemplateColumns:"1fr",gridGap:"16px"}}>
                            <Form.Field style={{placeSelf:"stretch"}}>
                                <label>Nom de l'intervention</label>
                                <input onChange={this.handleChange} name="newInterventionNature"/>
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddInterventionNature}>Annuler</Button>
                        <Button color="green" onClick={this.addInterventionNature}>Créer</Button>
                    </Modal.Actions>
                </Modal>
                <Modal closeOnDimmerClick={false} open={this.state.openDelInterventionNature} onClose={this.closeDelInterventionNature} closeIcon>
                    <Modal.Header>
                        Suppression d'une nature d'intervention
                    </Modal.Header>
                    <Modal.Actions>
                        <Button color="black" onClick={this.closeAddInterventionNature}>Annuler</Button>
                        <Button color="red" onClick={this.deleteInterventionNature}>Supprimer</Button>
                    </Modal.Actions>
                </Modal>
            </Fragment>
        )
    }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(withRouter(Content));
