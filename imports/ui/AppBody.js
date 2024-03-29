import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PageBody from './pages/PageBody';
import Home from './pages/Home';
import NeedActivation from './pages/NeedActivation';
import { withRouter } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class AppBody extends Component{

    state={
        menuCollapsed:false
    }

    componentDidMount = () => {
        toast.configure()
    }

    logout = () => {
        Meteor.logout();
        this.props.logoutPurge();
    }

    render(){
        if(this.props.user._id != null){
            if(this.props.user.activated){
                return(
                    <div style={{width:"100vw",minWidth:"780px",minHeight:"100vh"}}>
                        <ToastContainer position="bottom-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl pauseOnVisibilityChange draggable pauseOnHover/>
                        <PageBody collapsed={this.state.menuCollapsed} site={this.props.site}/>
                    </div>
                );
            }else{
                return(
                    <div style={{
                        width:"100vw",
                        height:"100vh",
                        margin:"0",
                        padding:"32px 128px 0 160px",
                        display:"flex",
                        backgroundRepeat:"no-repeat",
                        backgroundAttachment:"fixed"
                    }}>
                        <div style={{display:"grid",marginTop:"80px",gridTemplateColumns:"1fr 250px 480px 250px 1fr",gridTemplateRows:"400px 80px 80px",flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
                            <img style={{gridColumnStart:"2",gridColumnEnd:"span 3",placeSelf:"center"}} src={"/res/forbidden.png"} alt="titleLogo"/>
                            <NeedActivation/>
                            <Button basic style={{marginTop:"24px",width:"128px",gridColumnStart:"2",gridColumnEnd:"span 3",placeSelf:"center"}} onClick={this.logout} color="red">
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                );
            }
        }else{
            return(
                <div style={{
                    width:"100vw",
                    height:"100vh",
                    margin:"0",
                    padding:"32px 128px 0 160px",
                    display:"inline-block",
                    backgroundRepeat:"no-repeat",
                    backgroundAttachment:"fixed"
                  }}>
                    <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl pauseOnVisibilityChange draggable pauseOnHover/>
                    <Switch>
                        <Route path='/' component={Home}/>
                        <Redirect from='*' to={'/'}/>
                    </Switch>
                </div>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
  export default withUserContext(withRouter(AppBody));