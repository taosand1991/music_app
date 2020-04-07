import React, {Component} from 'react';

class Logout extends Component {
    render() {
        const clear = localStorage.removeItem('token');
        window.location = '/login';
        return (
            <div>
                {clear}
            </div>
        );
    }
}

export default Logout;
