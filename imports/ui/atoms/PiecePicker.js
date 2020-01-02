
import React, { Component, Fragment } from 'react'
import { Dropdown, Input, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import { gql } from 'apollo-server-express'

class PiecePicker extends Component {

    state = {
        pieceFilter:"",
        piecesRaw:[],
        piecesQuery : gql`
            query allPieces{
                allPieces{
                    _id
                    name
                    type
                }
            }
        `
    }
    
    loadPieces = () => {
        this.props.client.query({
            query:this.state.piecesQuery,
            fetchPolicy:"network-only"
        }).then(({data})=>{
            this.setState({
                piecesRaw:data.allPieces
            })
        })
      }
    
    componentDidMount = () => {
        this.loadPieces();
    }

    setPiece = piece => {
        this.props.onChange(piece);
    }

    getPieceIcon = () => {
        if(this.props.type == "pie"){
            return "cogs"
        }
        if(this.props.type == "pne"){
            return "cog"
        }
        if(this.props.type == "age"){
            return "tint"
        }
        if(this.props.type == "out"){
            return "wrench"
        }
        return "cancel";
    }

    getContentColor = type => {
        if(type=="pie"){
            return "teal"
        }
        if(type=="pne"){
            return "blue"
        }
        if(type=="age"){
            return "violet"
        }
        if(type=="out"){
            return "purple"
        }
    }
    
    onSearch = (e,{value}) => {
        this.setState({
            pieceFilter:value
        })
    }

    getPickerContent = () => {        
        let displayed = Array.from(this.state.piecesRaw.filter(p=>p.type == this.props.type));
        if(this.state.pieceFilter.length>1){
            displayed = displayed.filter(p =>
                p.name.toLowerCase().includes(this.state.pieceFilter.toLowerCase())
            );
            if(displayed.length == 0){
                return(
                    <Dropdown.Item text={"Aucun résultat"}/>
                )
            }
        }
        return (
            <Fragment>
                {displayed.map(p=>{
                    return (
                        <Dropdown.Item key={"piecedd"+p._id} onClick={()=>{this.setPiece(p)}} label={{ color: this.getContentColor(p.type), empty: true, circular: true }} text={p.name}/>
                    )
                })}
            </Fragment>
        )
    }

    render() {
        return (
            <Dropdown basic style={{marginLeft:"8px"}} defaultValue={this.props.defaultValue} text={this.props.name} icon={this.getPieceIcon()} floating labeled button className='icon'>
                <Dropdown.Menu>
                    <Input onClick={e => e.stopPropagation()} onChange={this.onSearch} icon='search' iconPosition='left' className='search' />
                    <Dropdown.Divider />
                    {this.getPickerContent()}
                </Dropdown.Menu>
            </Dropdown>
        )
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(PiecePicker);