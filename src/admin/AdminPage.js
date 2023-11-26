import React from 'react';

import './css/AdminPage.css';

import AdminLoginPage from './AdminLoginPage.js';
import AdminOptionsPage from './AdminOptionsPage.js';

class AdminPage extends React.Component {
    constructor(props) {
        super(props);
        console.log("Constructing AdminPage");
    }

    state = {
        isLoggedIn: false,
        adminUsername: "",
        adminPassword: ""
    };

    render () {
        let page;

        if (!this.state.isLoggedIn) {
            page = <AdminLoginPage setIsLoggedIn={this.setIsLoggedIn} 
                setAdminUsername={this.setAdminUsername} 
                setAdminPassword={this.setAdminPassword} 
                adminUsername={this.state.adminUsername} 
                adminPassword={this.state.adminPassword} />;
        } else {
            page = <AdminOptionsPage adminUsername={this.state.adminUsername}
                adminPassword={this.state.adminPassword} 
                handleAdminLogout={this.handleAdminLogout} />;
        }

        return (
            <div className="AdminPage RoundBorder">
                {page}
            </div>
        );
    }

    setAdminUsername = (adminUsername) => {
        console.log("Setting Admin Username");

        this.setState({adminUsername: adminUsername});
    }

    setAdminPassword = (adminPassword) => {
        console.log("Setting Admin Password");

        this.setState({adminPassword: adminPassword});
    }

    setIsLoggedIn = (loggedIn) => {
        console.log("Setting isLoggedIn status");

        this.setState({isLoggedIn: loggedIn});
    }

    handleAdminLogout = () => {
        console.log("Handling admin logout");

        this.setState({
            isLoggedIn: false,
            adminUsername: "",
            adminPassword: ""
        });
    }
}

export default AdminPage;