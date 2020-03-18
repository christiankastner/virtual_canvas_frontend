import React from 'react';
import { connect } from 'react-redux'
import CanvasesIndex from "./CanvasesIndex"
import CanvasShow from './CanvasShow'
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'
import { API_ROOT, HEADERS } from './constants/index'
import LoginModal from './components/LoginModal'
import Landing from './Landing'
import About from "./About"
import UserShow from './UserShow'
import Navbar from './components/Navbar';

class App extends React.Component {

  state = {
    loggedin: !!localStorage["id"],
    modal: false,
    message: ""
  }

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    })
  }

  handleLogout = () => {
    this.setState({
      loggedin: false
    }, () => {
      localStorage.clear()
      this.props.dispatch({type: "LOGOUT"})
    })
  }

  // This takes in a string to specify whether the fetch is to find a user to login or create a user to sign up
  handleUserFetch = (fetch_route) => {
    return (user) => {
      this.fetchUser(`${API_ROOT}/${fetch_route}`, user)
    }
  }

  fetchUser = (path, user) => {
    return fetch(path, {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({user: user})
    })
        .then(resp => resp.json())
        .then(this.loginCallBack)
  }

  loginCallBack = (json) => {
    if (!json.error) {
        this.setState({
            loggedin: true,
            modal: false
        }, () => {
            localStorage.setItem('id', json.id) 
            this.props.dispatch({type: "LOGIN", user_id: json.id}) 
        })
    } else {
        this.setState({
          message: json.error
        })
    }
  }
  
  render() {
      return (
          <Router >
            <LoginModal 
              modal={this.state.modal} 
              handleOnLogin={this.handleUserFetch("users/login")} 
              handleOnSignup={this.handleUserFetch("users")} 
              toggleModal={this.toggleModal}
              message={this.state.message}
            />
            <Navbar loggedin={this.state.loggedin} 
              toggleModal={this.toggleModal} 
              handleLogout={this.handleLogout} 
            />
            <Route exact path="/" render={() => {
              return (<>
                <Landing />
                <About />
              </>)
            }}/>
            <Route path="/user" >
              {this.state.loggedin ? <UserShow /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/canvases" render={routerProps => <CanvasesIndex {...routerProps} />} />
            <Route exact path="/canvases/:id" render={routerProps => (
              <CanvasShow {...routerProps} />
            )} />
          </Router>
      );
    }
  }
const mapStateToProps = state => {
  return {
    user_id: state.user_id
  }
}

export default connect(mapStateToProps)(App);