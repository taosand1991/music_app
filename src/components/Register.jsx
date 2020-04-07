import React, {Component, Fragment} from 'react';
import joi from 'joi-browser';
import axios from 'axios';

class Register extends Component {
    constructor(props){
        super(props);
        this.state = {
            account:{email:'', password:'', password2:'', location:'', image_url:null, },
            loading:false,
            errors:{},
        }
    };
    schema = {
        email: joi.string().email().required().label('Email'),
        password: joi.string().required().min(6).label('Password'),
        password2: joi.string().required().min(6).label('Confirm Password'),
        location: joi.string().required().label('Location')
    };

    validationProperty =({name, value})=>{
        const obj = {[name]: value};
        const schema = {[name]:this.schema[name]};
        const {error} = joi.validate(obj, schema);
        return error ? error.details[0].message:null

    };

    handleChange =({target:input})=>{
        const errors = {...this.state.errors};
        const errorMessage = this.validationProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];

        const account = {...this.state.account};
        account[input.name] = input.value;
        this.setState({account, errors});
    };

    handleImage =(e)=>{
        const account = {...this.state.account};
        account['image_url'] = e.target.files[0];
        this.setState({account})

    };

     handleReset = () =>{
        this.setState({account:{email:'', password:'', password2:'', location:'', image_url:''}})
    }

    handleSubmit = async(e) =>{
        e.preventDefault();
        const {account:{email, password, password2, location, image_url}} = this.state;
        console.log(email, password2, password, location, image_url);
        this.handleReset();
        this.setState({loading:true});
        let form_data = new FormData();
        form_data.append('email', email);
        form_data.append('password', password);
        form_data.append('password2', password2);
        form_data.append('location', location);
        form_data.append('image_url', image_url, image_url.name);
       try{
            const apiEndPoint = 'http://127.0.0.1:8000/api/user/';
           const apiCall = await axios.post(apiEndPoint, form_data, {
               headers:{
                'Content-Type': `multipart/form-data; boundary:${form_data._boundary}`
               }
           });
          const response = await apiCall ;
           console.log(response);
           localStorage.setItem('token', response.data.token);
           setTimeout(() => {
               this.setState({loading:false});
               window.location = '/music'
           }, 3000)

       }catch (e) {
           console.log(e.response.data);
           const errors = {...this.state.errors};
           errors['email'] = e.response.data.email;
           errors['password'] = e.response.data.password;
           this.setState({errors, loading:false})


       }


    };

    render() {
        const {account:{email, password, password2, location}, errors, loading} = this.state;
        return (
            <Fragment>
                <div className="row mt-5">
                    <div className="col-12 col-md-6 offset-md-3 card card-body red">
                        <div>{loading &&
                                    <Fragment>
                                <div id='loading'/>
                                </Fragment>
                                }</div>
                        <h5 className="text-center">Register Your Account</h5>
                        <form onSubmit={this.handleSubmit} className='form-group'>
                            <label className='form-check-label' htmlFor="email">Email</label>
                            <input type="text"
                                   className='form-control'
                                   onChange={this.handleChange}
                                   name="email"
                                   id="email"
                                   value={email}
                            />
                            {errors.email && <div className='alert alert-danger'>{errors.email}</div>}
                            <label className='form-check-label' htmlFor="password">Password</label>
                            <input type="password"
                                   className='form-control'
                                   onChange={this.handleChange}
                                   name="password"
                                   id="password"
                                   value={password}
                            />
                            {errors.password && <div className='alert alert-danger'>{errors.password}</div>}
                            <label className='form-check-label' htmlFor="password2">Confirm Password</label>
                            <input type="password"
                                   className='form-control'
                                   onChange={this.handleChange}
                                   name="password2"
                                   id="password2"
                                   value={password2}
                            />
                            {errors.password2 && <div className='alert alert-danger'>{errors.password2}</div>}
                            <label className='form-check-label' htmlFor="location">Location</label>
                            <input type="text"
                                   className='form-control'
                                   onChange={this.handleChange}
                                   name="location"
                                   id="location"
                                   value={location}
                            />
                            {errors.location && <div className='alert alert-danger'>{errors.location}</div>}
                             <label className='form-check-label mt-2' htmlFor="file">Profile pics</label>
                            <input type="file" id='file'
                            className='form-control-file'
                            onChange={this.handleImage}
                            />
                            <button className='btn btn-outline-warning btn-block mt-2'>
                                Create Account</button>
                        </form>
                    </div>
                </div>

            </Fragment>
        );
    }
}

export default Register;
