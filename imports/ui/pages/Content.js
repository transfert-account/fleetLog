import React, { Component, Fragment } from 'react';
import { Modal, Menu, Button, Header, Icon, Form, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import HexColorCodeInput from '../atoms/HexColorCodeInput';
import SocietePicker from '../atoms/SocietePicker';
import VolumePicker from '../atoms/VolumePicker';
import BrandPicker from '../atoms/BrandPicker';
import ModelPicker from '../atoms/ModelPicker';
import EnergyPicker from '../atoms/EnergyPicker';
import OrganismPicker from '../atoms/OrganismPicker';
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
        openHexColorPicker:false,
        needToRefreshSocietes:false,
        needToRefreshVolumes:false,
        needToRefreshBrands:false,
        needToRefreshModels:false,
        needToRefreshOrganisms:false,
        needToRefreshColors:false,
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
        societesQuery : gql`
            query societes{
                societes{
                    _id
                    trikey
                    name
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
        volumesQuery : gql`
            query volumes{
                volumes{
                    _id
                    meterCube
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
        brandsQuery : gql`
            query brands{
                brands{
                    _id
                    name
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
        modelQuery : gql`
            query model{
                model{
                    _id
                    name
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
        energiesQuery : gql`
            query energies{
                energies{
                    _id
                    name
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
        organismsQuery : gql`
            query organisms{
                organisms{
                    _id
                    name
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
        colorsQuery : gql`
            query colors{
                colors{
                    _id
                    name
                    hex
                }
            }
        `
    }

    handleChange = e =>{
        this.setState({
        [e.target.name]:e.target.value
        });
    }

    //Societes
    handleChangeSociete = (e, { value }) => this.setState({ selectedSociete:value })
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

    //Common
    getMenu = () => {
        if(this.props.user.isOwner){
        return (
            <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
                <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
                <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
                <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
            </Menu>
        )
        }else{
        return (
            <Menu style={{cursor:"pointer",marginBottom:"auto"}} icon='labeled'>
                <Menu.Item color="blue" name='comptes' onClick={()=>{this.props.history.push("/administration/accounts")}}><Icon name='users'/>Comptes</Menu.Item>
                <Menu.Item color="blue" name='controls' active onClick={()=>{this.props.history.push("/administration/content")}}><Icon name='copy outline'/>Contenu</Menu.Item>
                <Menu.Item color="blue" name='equipement' onClick={()=>{this.props.history.push("/administration/equipements")}}><Icon name='wrench'/>Contrôles</Menu.Item>
                <Menu.Item color="blue" name='pieces' onClick={()=>{this.props.history.push("/administration/pieces")}}><Icon name='cogs'/>Pièces</Menu.Item>
            </Menu>
        )
        }
    }

    render() {
        return (
            <Fragment>
                <div>
                    <div style={{display:"flex",marginBottom:"32px",justifyContent:"space-between"}}>
                        {this.getMenu()}
                    </div>
                    <Table basic="very" celled>
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
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
                                        <Icon name='sitemap' />
                                        <Header.Content>Sociétés du groupe</Header.Content>
                                    </Header>
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <SocietePicker didRefresh={this.didRefreshSocietes} needToRefresh={this.state.needToRefreshSocietes} groupAppears={false} onChange={this.handleChangeSociete} value={this.state.selectedSociete} />
                                </Table.Cell>
                                <Table.Cell textAlign="center">
                                    <Button style={{margin:"4px 16px"}} color="blue" onClick={this.showAddSociete} icon labelPosition='right'>Ajouter<Icon name='plus'/></Button>
                                    <Button style={{margin:"4px 16px"}} color="red" onClick={this.showDelSociete} icon labelPosition='right'>Supprimer<Icon name='trash'/></Button>
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
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
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
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
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
                                        <Icon name='barcode' />
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
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
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
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
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
                                    <Header style={{gridColumnStart:"2",placeSelf:"center"}} as='h2'>
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
                        </Table.Body>
                    </Table>
                </div>

                {/* SOCIETE */}
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
