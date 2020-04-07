import React, {Fragment, Component} from 'react';
import {  NavLink, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import axios from "axios";
import $  from 'jquery'

class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
           profile:[]
        }
    }

    handleClick =()=>{
        $('.nav-link').on('click', function () {
           $('.navbar-collapse').collapse('hide')
        });
    };


    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.user !== prevProps.user){
            const token = localStorage.getItem('token');
            const apiEndPoint = `http://127.0.0.1:8000/api/user/${this.props.user.user_id}`;
        const apiCall = await axios.get(apiEndPoint, {
            headers: {'Authorization': `JWT ${token}`}
        });
        const {data:profile} = await apiCall;
        this.setState({profile})
        }else{
            return <h5>good thing</h5>
        }

    }

    render() {

        const {user} = this.props;
        const{profile:{image_url}} = this.state;
        const profilePic = () =>{
            if(image_url !== null){
               return <img className=' rounded-circle' src={image_url} alt="" width='30px'/>
            }else{
                return <img className=' rounded-circle' src='../images/Generic-profile-image-002.png' alt="" />
            }
        }
        return (
            <Fragment>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <NavLink className="navbar-brand" to="#">LEGACY</NavLink>
                    <button className="navbar-toggler collapsed" type="button" data-toggle="collapse"
                            data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                        <div className='close-icon py-1'>X</div>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        {user && <ul className="navbar-nav mr-auto">
                            <li className="nav-item ">
                                <NavLink  className="nav-link" to="/music">Home</NavLink>
                            </li>
                            <li className="nav-item dropdown">
                                <Link className="nav-link dropdown-toggle" id="navbarDropdown" to="#" role="button"
                                      data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {profilePic()} {user.email}
                                </Link>
                                <div className='dropdown-menu' aria-labelledby={'navbarDropdown'}>
                                    <a className='dropdown-item' href='/edit'>Edit Profile</a>
                                    <div className='dropdown-divider'/>
                                    <Link className='dropdown-item' to='/logout'>Logout</Link>
                                </div>
                            </li>
                        </ul>}
                        {!user && <ul className='navbar-nav mr-auto'>
                            <li className="nav-item">
                                <NavLink onClick={this.handleClick} className="nav-link" to="/register">Register</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink onClick={this.handleClick} className="nav-link" to="/login">Login</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink onClick={this.handleClick} className="nav-link" to="/about">About/Usage</NavLink>
                            </li>
                        </ul>}
                    </div>
                </nav>
            </Fragment>
        );
    }
}

export default NavBar;
