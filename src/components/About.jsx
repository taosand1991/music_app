import React from 'react';
import {Link} from "react-router-dom";

function About(props) {
    return (
        <div className='text-center mt-2 text-orange'>
        <p>This is an app for playing songs online, you can add your own songs for
        other people to listen to it.</p><br/>
        <p>The reason why i made this app is to fall in love with our old songs and artiste,
        and I have done my own part by adding some old songs.</p><br/>
        <p>You can create an album with the artiste name and give it any name you like...bingo
        You can add your old and new songs.</p><br/>
        <p>If you are an artiste, the time is right for you to create your own album with your songs.</p><br/>
            <hr/>
            <p>You are therefore required to <Link to={'/login'}>Login</Link> or <Link to='/register'>Register</Link>&nbsp;
                 to be able to play, create and download the songs.
            </p>
        </div>
    );
}

export default About;
