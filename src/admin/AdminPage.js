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
            page = <AdminLoginPage />;
        } else {
            page = <AdminOptionsPage />;
        }

        return (
            <div className="AdminPage RoundBorder">
                {page}
            </div>
        );
    }

    setAdminUsername = (adminUsername) => {
        console.log("Setting Admin Username");

        // Validate length is not null or empty.
        if (adminUsername === null || adminUsername === undefined || adminUsername === "") {
            throw new Error("AdminUsername cannot be null or empty!");
        }   

        this.setState({adminUsername: adminUsername});
    }

    setAdminPassword = (adminPassword) => {
        console.log("Setting Admin Password");

        // Validate length is not null or empty.
        if (adminPassword === null || adminPassword === undefined || adminPassword === "") {
            throw new Error("AdminPassword cannot be null or empty!");
        }

        this.setState({adminPassword: adminPassword});
    }

    login = (username, password) => {
        console.log("Processing login...");
    }
}

export default AdminPage;