import React, {Component, Fragment} from 'react';
import axios from 'axios';
import '../App.css'
import 'bootstrap/dist/css/bootstrap.css';
import { Link} from "react-router-dom";
import Pagination from 'react-js-pagination';


class Music extends Component {
    state ={
        musics:[],
        album: '',
        activePage: 1,
        PostPerPage:3

    };

    handlePageChange =(pageNumber)=>{
        this.setState({activePage:pageNumber});
    };

    async componentDidMount() {
        try {
            const apiEndpoint = 'http://127.0.0.1:8000/api/album/';
            const token = localStorage.getItem('token');
            const apiCall = await axios.get(apiEndpoint, {
                headers: {'Authorization': `JWT ${token}`}
            });
            const {data: musics} = await apiCall;
            this.setState({musics});

        }catch (e) {

        }
    }

handleChange =(e)=>{
        let filteredList = this.state.musics.filter(music => {
            return music.album.toLowerCase().indexOf(this.state.album.toLowerCase()) !== -1
        });


        this.setState({album:e.target.value});
        console.log(this.state.album);
        this.setState({musics:filteredList, activePage:1})

};
    goBack = ()=>{
        return window.location = '/music'
    };
musicList =()=>{
    const {musics, activePage, PostPerPage} = this.state;
    const indexOfLastPage = activePage * PostPerPage;
    const  indexOfFirstPage = indexOfLastPage - PostPerPage;
    const currentMusic = musics.slice(indexOfFirstPage, indexOfLastPage);
    if(musics.length > 0){
        return <div className="row container shift">
                    {currentMusic.map(music => {
                      return  <div key={music.id} className='col-12 ml-md-2 col-md-3 card card-body mt-4 mb-2 ml-md-2 ml-1 ' style={{width:'18rem'}}>
                          <Link to={{pathname: `/music/${music.id}`}}><img className='card-img-top' src={music.image_url} alt=""/></Link>
                            <p className='text-center'><span className='badge badge-primary '>{music.album}</span></p>
                        </div>
                    })}
                </div>
    }else {
        return <div className='bottom'>
            <h1 className='text-white text-center'>there are no album in the search</h1>
            <button onClick={this.goBack} className='btn btn-danger mr-auto home'>Back Home</button>
        </div>
    }
};

handleSort =()=>{
        const musics = [...this.state.musics];
        musics.sort((a,b) => {
            return a.album < b.album ? -1 : 1
        });
        this.setState({musics})
}

handleTracks =()=>{
        const musics = [...this.state.musics];
        musics.sort((a, b) => {
            return a.tracks < b.tracks ? 1 : -1
        });
    this.setState({musics})
}


    render() {
        const {musics, album} = this.state;
        return (
            <Fragment>
                <div className=' mt-3'>
                <h5 className=' mt-3 padding '>Showing {musics.length} Album &nbsp;
                    <Link to='/create'><button className='btn btn-orange'>Create an album</button></Link>
                    <button onClick={this.handleSort} className='btn btn-primary ml-xl-2 ml-1'>Sort Alphabetical</button>
                    <button onClick={this.handleTracks} className='btn btn-success ml-xl-2 mb-2'>Sort by Tracks</button>
                    <span className='form-over'>
                        <input onChange={this.handleChange} className='form' type="text" placeholder='Search Album' value={album}/>
                        <button className='form-button'>Search</button>
                    </span>
                </h5>

                    </div>
                <div>
                </div>
                {/*<div className="row container shift">*/}
                {/*    {musics.map(music => {*/}
                {/*      return  <div key={music.id} className='col-md-3 card card-body mt-4 mb-2 ml-2 ' style={{width:'18rem'}}>*/}
                {/*          <Link to={{pathname: `/music/${music.id}`}}><img className='card-img-top' src={music.image_url} alt=""/></Link>*/}
                {/*            <h6 className='card-text text-center'><span className='text-nowrap'>{music.songs}</span></h6>*/}
                {/*            <p className='text-center'><span className='badge badge-primary '>{music.album}</span></p>*/}
                {/*        </div>*/}
                {/*    })}*/}
                {/*</div>*/}
                {this.musicList()}
                <div className='shifter'>
                <Pagination
                    hideDisabled
                    itemClass='page-item'
                    linkClass='page-link'
                    activePage={this.state.activePage}
                    itemsCountPerPage={3}
                    totalItemsCount={musics.length}
                    pageRangeDisplayed={4}
                    onChange={this.handlePageChange}
                    />
                    </div>
            </Fragment>
        );
    }
}

export default Music;
