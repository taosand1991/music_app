import React, {Component} from 'react';
import './App.css';
import Music from "./components/Music";
import NavBar from "./components/NavBar";
import { Route, Switch, Redirect } from 'react-router-dom'
import MusicDetails from "./components/MusicDetails";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from './components/Logout'
import jwtDecode from 'jwt-decode';
import Album from "./components/Album";
import Profile from "./components/Profile";
import getUser from "./services/AuthService";
import About from "./components/About";

class App extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }

     componentDidMount() {
        try {
            const jwt = localStorage.getItem('token');
            const user = jwtDecode(jwt);
            this.setState({user});
        }catch (e) {
            
        }
    }

    render(){
        const {user} = this.state;
        return (
    <div className="App">
        <NavBar
        user={user}
        />
        <Switch>
      <Route path='/music/:id' render={props => <MusicDetails {...props} user={user}/>}/>
      <Route path='/music' render={props => {
          if (!getUser()) return <Redirect to='/login'/>;
          return <Music/>
      }}/>
      <Route path='/register' component={Register}/>
      <Route path='/login' component={Login}/>
      <Route path='/logout' component={Logout}/>
      <Route path='/create' component={Album}/>
      <Route path='/edit' render={props => <Profile {...props} user={user}/>}/>
      <Route path='/about' component={About}/>
      <Redirect to={'/about'}/>
        </Switch>
        <Footer/>
    </div>
  );
    }

}

export default App;
