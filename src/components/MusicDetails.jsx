import React, {Component, Fragment} from 'react';
import axios from 'axios';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import '../App.css';


class MusicDetails extends Component {
   constructor(props) {
       super(props);
       this.state = {
           music: [],
           tracks: [],
           track_name: '',
           songs: '',
           loading: false,
           errors: {},
           inputString: '',

       };
   }

    async componentDidMount() {
        const {match} = this.props;
        const apiEndpoint = `http://127.0.0.1:8000/api/album/${match.params.id}`;
        const token = localStorage.getItem('token');
        const apiCall = await axios.get(apiEndpoint, {
            headers:{'Authorization' : `JWT ${token}` }
        });
        const {data:music} = await apiCall;
        this.setState({music,
        tracks:music.tracks
        });


    }
handleSong =(e)=>{
        this.setState({track_name:e.target.value});

};
    handleDelete =async(id)=>{
        const {match} = this.props;
        const token = localStorage.getItem('token');
        this.setState({loading:true});
        await axios.delete(`http://127.0.0.1:8000/api/album/${match.params.id}`,{
            headers:{'Authorization': `JWT ${token}`}
        });
        setTimeout(() => {
            this.setState({loading:false});
            this.props.history.push('/music')
        }, 2000)

    };

    handleDeleteSong =async (id) =>{
       const token = localStorage.getItem('token');
       this.setState({loading:true});
       // const track_list = tracks.filter(track => track.id !== id);
       //  this.setState({tracks:track_list});
       const apiEndPoint = `http://127.0.0.1:8000/api/music/${id.id}`;
        await axios.delete(apiEndPoint, {
            headers:{'Authorization': `JWT ${token}`}
        });
        setTimeout(() => {
            this.setState({loading:false})
        }, 2000);

        this.componentDidMount()


    };

    handleReset =()=>{
        let randomString = Math.random().toString(36);
        this.setState({inputString:randomString})
    }

    addButton =()=>{
        const {tracks} = this.state;
        if(tracks.length > 0){
            return <button  data-toggle='modal' data-target='#exampleModalScrollable' className='btn btn-primary floating'>
                <span className='fas fa-plus'/>
                &nbsp; Add Songs</button>

        }else{
            return ''
        }
    };
    handleTrack =(e)=>{
        this.setState({songs:e.target.files[0]})
    };
    handleAddSong =async(e)=>{
       e.preventDefault();
       const {match} = this.props;
        const form_data = new FormData()
        form_data.append('track_name', this.state.track_name);
        form_data.append('songs', this.state.songs, this.state.songs.name);
        form_data.append('album', match.params.id);
        form_data.append('user', this.state.music.user);
       $('#exampleModalScrollable').submit(function () {
           $(this).modal('hide')
       });
       this.setState({songs:undefined, track_name:'', loading:true});


       try{
           const token = localStorage.getItem('token');
           const apiEndPoint = 'http://127.0.0.1:8000/api/music/';
           const apiCall =await axios.post(apiEndPoint, form_data , {
               headers:{'Authorization':`JWT ${token}`,
                'Content-Type': `multipart/form-data; boundary${form_data._boundary}`
               }
           });
            await apiCall;
           const apiEndpoint = `http://127.0.0.1:8000/api/album/${match.params.id}`;
           const call = await axios.get(apiEndpoint, {
            headers:{'Authorization' : `JWT ${token}` }
        });
           const {data:music} = await call;
           setTimeout(() =>{
              this.setState({music,
           tracks:music.tracks,
                  loading:false});
               const errors = {...this.state.errors};
           errors['track_name'] = 'The song has been added';
           this.setState({errors})
           },2000);



       }catch (e) {
           const errors = {};
           if(e.response.data.songs) {
               errors['songs'] = e.response.data.songs;
               this.setState({errors, loading:false, songs:null, track_name:''})
           }


       }

    };



    trackList = ()=>{
        const {tracks} = this.state;
        const {user} = this.props;
        if(tracks.length > 0){
            return tracks.map((track, index) => {
                            return <div key={index}><ul className='list-group mt-2' >
                                <li className='list-group-item'><span>{index + 1}.</span>&nbsp;{track.track_name}
                                <audio className='float-right' src={track.songs} controls/>
                                    {user.user_id === track.user ? <button onClick={() => this.handleDeleteSong(track)} className='btn btn-danger float-right mr-2 myBut '>Delete</button>: ''}
                                </li>
                            </ul>
                            </div>
                        })

        }else{
            return <Fragment>
            <div>
                <h5>You have no songs in this album</h5>
                <button  type='button' data-toggle='modal' data-target='#exampleModalScrollable' className='btn btn-primary floating'>

                <span className='fas fa-plus'/>
                &nbsp; Add Songs</button>
            </div>
            </Fragment>
        }
};

    handleSort = () =>{
        const tracks = [...this.state.tracks];
        tracks.sort((a, b) => {
           return a.track_name < b.track_name ? -1: 1
        });
        this.setState({tracks})
    };


    render() {
        const {music, errors, loading, track_name} = this.state;
        const {user} = this.props;
       if(!user){
           return <div>
               <h5>Loading</h5>
           </div>
       }
        return (
            <Fragment>
                {loading && <div id='loader'/>}
                <div className="modal fade" id="exampleModalScrollable" tabIndex="-1" role="dialog"
                    aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-scrollable" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalScrollableTitle">Add Songs</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form className='form-group' onSubmit={this.handleAddSong}>
                            <input type="text"
                                   placeholder='Track Name...'
                                   value={track_name}
                                   required
                                   onChange={this.handleSong}
                                   className='form-control'
                            />
                            <hr/>
                            <label htmlFor="track">Upload Your Song</label>
                            <input type="file"
                            id='track'
                            className='form-control-file'
                            onChange={this.handleTrack}
                            key={this.state.inputString || undefined}
                             required
                            />
                            <button type="submit"  className="btn btn-primary mt-2">Add</button>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
                <div className="row mt-4 ml-1 ml-xl-4 mr-xl-4 h-50 sec-1">
                    <div className="col-8 col-md-4 card card-body">
                        <img className='divide' src={music.image_url} alt=""/>
                        <h1 className='mt-5 card-text text-center badge badge-danger'>{music.album}</h1>
                        {this.props.user.email === music.user ? <button onClick={() => this.handleDelete(music)} className='btn btn-primary'>Delete Album</button>: ''}
                    </div>
                    <div className="col-10 mt-3 col-md-6 card card-body ml-xl-4">
                        <h4 className='text-center card-header mb-3'>{music.artiste}</h4>
                        <h4 className='card-text line'>List Of Album Songs <button onClick={this.handleSort} className='btn btn-primary floating-2 mb-2'>Sort Alphabetical</button></h4>
                        {/*{tracks.map((track, index) => {*/}
                        {/*    return <ul className='list-group mt-2' key={index}>*/}
                        {/*        <li className='list-group-item'><span>{index + 1}.</span>&nbsp;{track}</li>*/}
                        {/*    </ul>*/}
                        {/*})}*/}
                        {errors.track_name && <div className='alert alert-success alert-dismissible fade show'>{errors.track_name}
                        <button type='button' className='close' data-dismiss='alert' aria-label='close'>
                    <span aria-hidden='true'>&times;</span>
                    </button>
                    </div> }
                    {errors.songs && <div className='alert alert-danger alert dis'>{errors.songs}</div>}
                        {this.trackList()}
                        {this.addButton()}
                    </div>
                </div>
                <br/>
            </Fragment>
        );
    }
}

export default MusicDetails;
