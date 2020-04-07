import React, {Component, Fragment} from 'react';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: [],
            email: '',
            image_url: '',
            location: '',
            old_password: '',
            new_password: '',
            new_password2: '',
            errors:{},
            success:{},
            loading:false

        }
    }

    async componentDidUpdate(prevProps) {
        if(this.props.user !== undefined && this.props.user !== prevProps.user) {
            const token = localStorage.getItem('token');
            const apiEndPoint = `http://127.0.0.1:8000/api/user/${this.props.user.user_id}`;
            const apiCall = await axios.get(apiEndPoint, {
                headers: {'Authorization': `JWT ${token}`}
            });
            const {data: profile} = await apiCall;
            this.setState({
                profile,
                email: profile.email,
                location: profile.location,
                image_url: profile.image_url,
            });
        }
    };

    handleChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };

    handleImage = (e) => {
        this.setState({image_url: e.target.files[0]})
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        $('#exampleModalCenter').submit(function () {
            $(this).modal('hide')
        });
        const {location, email, image_url} = this.state;
        let form_data = new FormData();
        form_data.append('email', email);
        form_data.append('location', location);
        form_data.append('image_url', image_url, image_url.name);
        const token = localStorage.getItem('token');
        try {
            const apiEndPoint = `http://127.0.0.1:8000/api/user/${this.props.user.user_id}/`;
            await axios.patch(apiEndPoint, form_data, {
                headers: {
                    'Authorization': `JWT ${token}`,
                    'Content-Type': `multipart/form-data; boundary${form_data._boundary}`
                }
            });
            window.location = '/edit'
        } catch (e) {

        }
    };
    handleReset = () =>{
        this.setState({old_password:'', new_password:'', new_password2:''})
    }

    handlePassword = async(e)=>{
        e.preventDefault();
        const token = localStorage.getItem('token');
        const {old_password, new_password, new_password2 } = this.state;
        const obj = {
           old_password,
           new_password,
           new_password2
        };
        $('#staticBackdrop').submit(function () {
            $(this).modal('hide')
        });
        this.handleReset();
        try {
            this.setState({loading:true});
            const apiEndpoint = `http://127.0.0.1:8000/api/user/${this.props.user.user_id}/change-password/`;
            await axios.post(apiEndpoint, obj, {
                headers: {'Authorization': `JWT ${token}`}
            });
            const success = {};
            success['message'] = 'Password has been Changed';
            setTimeout(() => {
                this.setState({loading:false, success});
                window.location = '/edit'
            }, 2000);

        }catch (e) {
            if(e.response.data) {
                const errors = {};
                errors['old_password'] = e.response.data['old_password'];
                errors['new_password'] = e.response.data['new_password'];
                this.setState({errors, loading:false})
            }
        }

    };

    render() {
        const {profile, location, email, old_password, new_password, new_password2,
            loading, errors, success} = this.state;
        const {user} = this.props;
        if(!user){
            return <div>
                <h5>loading</h5>
            </div>
        }
        return (
            <Fragment>
                {loading && <div id='#loader'/>}
                <div className='row container mt-4'>
                    <div className='col-12 col-md-6 offset-md-3 card card-body'>
                        <img className='card-img-top' src={profile.image_url} alt="No profile"/>
                        {success.message && <div className='alert alert-success alert-dismissible fade show'>{success.message}
                        <button type='button' className='close' data-dismiss='alert' aria-label='close'>
                    <span aria-hidden='true'>&times;</span>
                    </button>
                    </div> }
                         {errors.old_password && <div style={{color:'red'}}>{errors.old_password}</div>}
                        <table className='table'>
                            <thead>
                            <tr>
                                <th scope='col'>Email</th>
                                <th scope='col'>Location</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{profile.email}</td>
                                <td>{profile.location}</td>
                                <td>
                                    <button type='button' data-toggle='modal' data-target='#exampleModalCenter'
                                            className='btn btn-primary'>Edit Profile
                                    </button>
                                </td>
                                <td colSpan='3'>
                                    <button type='button' data-toggle='modal' data-target='#staticBackdrop' className='btn btn-orange'>Change Password</button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="modal fade" id="staticBackdrop" data-backdrop="static" tabIndex="-1" role="dialog"
                         aria-labelledby="staticBackdropLabel" aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Change Password</h5>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form onSubmit={this.handlePassword} className='form-group'>
                                        <input type="password"
                                        placeholder='Old Password...'
                                        className='form-control mb-2'
                                        onChange={this.handleChange}
                                        name='old_password'
                                        value={old_password}
                                        />
                                        <input type="password"
                                        placeholder='New Password...'
                                        className='form-control mb-2'
                                        onChange={this.handleChange}
                                        name='new_password'
                                        value={new_password}
                                        />
                                        {errors.new_password && <div style={{color:'red'}}>{errors.new_password}</div>}
                                        <input type="password"
                                        placeholder='Confirm Password...'
                                        className='form-control'
                                        onChange={this.handleChange}
                                        name='new_password2'
                                        value={new_password2}
                                        />
                                        <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                    </button>
                                    <button type="submit" className="btn btn-primary">Update Changes</button>
                                </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog"
                     aria-labelledby="exampleModalCenterTitle"
                     aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalCenterTitle">Edit Profile</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={this.handleSubmit} className='form-group'>
                                    <input type="text"
                                           placeholder='Email...'
                                           className='form-control'
                                           onChange={this.handleChange}
                                           name='email'
                                           value={email}
                                    />
                                    <input type="text"
                                           placeholder='Location'
                                           className='form-control mt-2'
                                           onChange={this.handleChange}
                                           name='location'
                                           value={location}
                                    />
                                    <input type='file'
                                           className='form-control-file mt-3 mb-2'
                                           onChange={this.handleImage}
                                    />
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close
                                        </button>
                                        <button type="submit" className="btn btn-primary">Save changes</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Profile;
