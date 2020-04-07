import React, {Component, Fragment} from 'react';
import joi from 'joi-browser';
import axios from 'axios'

class Album extends Component {
    constructor(props){
        super(props);
        this.state = {
            albumList:{ album:'', artiste:'', image_url:null, },
            errors:{},
            loading:false,
            success:{}
        }
    }
    schema = {
        album:joi.string().min(3).max(100).required().label('Album'),
        artiste:joi.string().min(3).max(100).required().label('Artiste name')
    };

    validateProperty = ({name, value}) =>{
        const obj = {[name]: value};
        const schema = {[name]:this.schema[name]};
        const {error} = joi.validate(obj, schema);
        return error ? error.details[0].message : null
    };
 handleChange = ({target : input})=> {
        const errors = {...this.state.errors};
        const errorMessage = this.validateProperty(input);
        if (errorMessage) errors[input.name] = errorMessage;
        else delete errors[input.name];
        const albumList = {...this.state.albumList};
        albumList[input.name] = input.value;
        this.setState({albumList, errors});
    };

 handleImage =(e)=>{
     const albumList = {...this.state.albumList};
     albumList['image_url'] = e.target.files[0];
     this.setState({albumList})
 };

 handleReset =()=>{
     this.setState({albumList:{album:'', artiste:'', image_url:null}})
 };

 handlesSubmit =async(e) =>{
     e.preventDefault();
     this.setState({loading:true});
     const token = localStorage.getItem('token');
     const {albumList:{album, artiste, image_url}} = this.state;
     const form_data = new FormData()
     form_data.append('album', album);
     form_data.append('artiste', artiste)
     form_data.append('image_url', image_url, image_url.name);
     const apiEndpoint = `http://127.0.0.1:8000/api/album/`;
     try {
         await axios.post(apiEndpoint, form_data, {
             headers: {
                 'Content-Type': `multipart/form-data; boundary${form_data._boundary}`,
                 'Authorization': `JWT ${token}`
             }
         });
         setTimeout(() =>{
             const success = {};
         success['message'] = 'Your Album has been added';
             this.setState({loading:false, success});
             this.props.history.push('/music')
         }, 2000);
         // this.setState({loading:true});


     }catch (e) {
         console.log(e.response.data);
         const errors = {...this.state.errors};
         errors['message'] = e.response.data['message'];
         this.setState({loading:false, errors});
     }
 }

    render() {
        const {albumList:{album, artiste}, loading, errors, success} = this.state;
        return (
            <Fragment>
                {loading && <div id='loader'/>}
            <div className='row mt-5'>
              <div className="col-12 col-md-4 offset-md-3 card card-body">
                  {errors.message && <div className='alert alert-danger' >{errors.message}</div>}
                  {success.message && <div className='alert alert-danger' >{success.message}</div>}
                  <div className="card-header">
                      <h5>Create Album</h5>
                </div>
                  <form onSubmit={this.handlesSubmit}>
                      <input type="text"
                      placeholder='Album Title..'
                      className='form-control mt-3 mb-3'
                      onChange={this.handleChange}
                      name='album'
                      value={album}
                      />
                      {errors.album && <div className='alert alert-danger'>{errors.album}</div>}
                      <input type="text"
                      placeholder='Album Artiste Name..'
                      className='form-control'
                      onChange={this.handleChange}
                      name='artiste'
                      value={artiste}
                      />
                      {errors.artiste && <div style={{fontSize:'13px'}} className='alert alert-danger'>{errors.artiste}</div>}
                      <input type="file"
                      className='form-control-file mt-3'
                      onChange={this.handleImage}
                      />
                      <button className='btn btn-orange mt-3'>Create</button>
                  </form>
              </div>
            </div>
               </Fragment>
        );
    }
}

export default Album;
