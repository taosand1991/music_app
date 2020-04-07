import React, {Component, Fragment} from 'react';
import joi from 'joi-browser';
import axios from 'axios';
import '../App.css';
import {Redirect} from 'react-router-dom'

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            account: {email: '', password: ''},
            errors: {},
            loading:false
        }
    }
    schema = {
        email: joi.string().email().required().label('Email'),
        password: joi.string().required().label('Password')
    };
    handleReset = () =>{
        this.setState({account:{}})
    }

    validateProperty =({name, value})=>{
        const obj = {[name]: value};
        const schema = {[name]: this.schema[name]};
        const {error} = joi.validate(obj, schema);
        return error ? error.details[0].message : null
    };


    handleChange =({target: input})=> {
        const errors = {...this.state.errors} || null;
        const errorMessage = this.validateProperty(input);
        if(errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const account = this.state.account;
        account[input.name] = input.value;
        this.setState({account, errors});

    };
    handleSubmit =async (e)=>{
        const {account:{email, password}} = this.state;
        e.preventDefault();
        const object = {
            email,
            password
        };
        this.setState({loading:true});
        try {
            const apiEndpoint = 'http://127.0.0.1:8000/auth/login/';
            const apiCall = await axios.post(apiEndpoint, object);
            const {data:response} = await apiCall;
            console.log(response)
            localStorage.setItem('token', response.token);
            setTimeout(() =>  {
                this.setState({loading:false});
                window.location = '/music'
            });
            this.handleReset()

        }catch (e) {
            const errors = {};
            errors['login'] = e.response.data.non_field_errors[0];
            this.setState({errors,
            loading:false
            })
        }
    };


    render() {
        const {email, password, errors,  loading} = this.state;
       if(localStorage.getItem('token')) return <Redirect to='/music'/>;
        return (
            <Fragment>

            <div className='row container mt-5 ml-2'>
                <div className='col-12 col-md-6 offset-md-3 card card-body'>
                    <h2 className='text-center'>Log in to your Account</h2>
                    {errors.login && <div className='alert alert-danger text-center'>{errors.login}</div>}
                    <form onSubmit={this.handleSubmit} className='form-group '>
                        <input className='form-control mb-2'
                               name='email'
                               onChange={this.handleChange}
                               type="text"
                               placeholder='Email Address'
                               value={email} required
                        />
                        {errors.email && <div className='alert alert-danger'>{errors.email}</div>}
                        <input className='form-control mb-2'
                               name='password'
                               onChange={this.handleChange}
                               type="password"
                               placeholder='Password'
                               value={password} required/>
                               {errors.password && <div className='alert alert-danger'>{errors.password}</div>}
                        <button disabled={errors.password || errors.email || loading  ? 'disabled' : ''} className='btn btn-success btn-block mt-2'>
                            {loading && <div className="spinner-border text-danger" style={{size:'6px'}} role="status"/>}
                            &nbsp; Login</button>
                    </form>
                </div>
            </div>
            </Fragment>
        );
    }
}

export default Login;
