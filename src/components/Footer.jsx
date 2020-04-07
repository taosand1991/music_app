import React, {Component, Fragment} from 'react';
import {Link} from "react-router-dom";

class Footer extends Component {
    render() {
        return (
            <Fragment>
                <footer className='footer text-center'>
                <div className='text-white'>
                   Designed by Legacy Graphics
                </div>
                    <ul className='text-white'>
                       <Link className='myplave' to="#">Contact us</Link>
                       <Link className='myplave' to="#">About Legacy</Link>
                       <Link className='myplave' to="#">Vision</Link>
                    </ul>
                </footer>
            </Fragment>
        );
    }
}

export default Footer;
