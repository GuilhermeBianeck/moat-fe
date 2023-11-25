import React from 'react';

import URLConsts from '../constants/URLConsts';

import './css/AdminPageLogin.css';

class AdminLoginPage extends React.Component {
    constructor(props) {
        console.log("Constructing AdminLoginpage.");
        super(props);
    }

    render() {
        return(
            <div className="AdminLoginPage">
                <p>
                    <label>Username:</label>
                    <input type="text" onChange={(event) => {
                                this.setAdminUsername(event.target.value);
                            }}>
                    </input>
                </p>
                <p>
                    <label>Password:</label>
                    <input type="password" onChange={(event) => {
                                this.setAdminPassword(event.target.value);
                            }}></input>
                </p>
                <p>
                    <button onClick={() => {this.handleLogin();}}>Login</button>
                </p>
            </div>
        );
    }

    setAdminUsername = (adminUsername) => {
        this.props.setAdminUsername(adminUsername);
    }

    setAdminPassword = (adminPassword) => {
        this.props.setAdminPassword(adminPassword);
    }

    // NOTE: We don't actually need the json object to login.  Can remove that.
    handleLogin = async () => {
        console.log("Handling Admin Login...");

        let authString = 'Basic ' 
            + btoa(this.props.adminUsername + ":" + this.props.adminPassword);

        const fetchParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authString
            }
        };

        const url = URLConsts.RPC_BASE_URL + "/admin/check-login/";

        console.log("Connecting to : " + url);

        let loggedIn = await fetch(url, fetchParams)
                .then(async (response) => {
                    console.log("Check Login Fetch successfully completed.");

                    let logged;

                    if (response.ok) {
                        console.log("User is logged in.");

                        logged = true;
                    } else {
                        console.log("User is not logged in.");

                        logged = false;
                    }

                    return logged;
                })
                .catch((error) => {console.log("ERROR: unable to perform fetch:" + error);});

        if (loggedIn === true) {
            this.props.setIsLoggedIn(true);
        }
    }
}

export default AdminLoginPage;