import React from 'react';

import URLConsts from '../constants/URLConsts';

import './css/AdminPageLogin.css';

/**
 * A class representing the Administrator Login Page.
 */ 
class AdminLoginPage extends React.Component {
    constructor(props) {
        console.log("Constructing AdminLoginpage.");
        super(props);
    }

    state = {
        loginErrorMsg: "Error logging in!",
        showLoginErrorMsg: false,
        
        loginButtonEnabled: true
    }

    render() {
        let loginError;
        if (this.state.showLoginErrorMsg) {
            loginError = 
                <p className="AdminLoginError">
                    <span>{this.state.loginErrorMsg}</span>
                </p>
        } else {
            loginError = "";
        }

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
                    <button className="LoginButton" onClick={() => {this.handleLogin();}} 
                        disabled={!this.state.loginButtonEnabled}>Login</button>
                </p>
                {loginError}
            </div>
        );
    }

    setAdminUsername = (adminUsername) => {
        this.props.setAdminUsername(adminUsername);
    }

    setAdminPassword = (adminPassword) => {
        this.props.setAdminPassword(adminPassword);
    }

    disableLoginButton = () => {
        this.setState({loginButtonEnabled: false});
    }

    enableLoginButton = () => {
        this.setState({loginButtonEnabled: true});
    }

    /**
     * Async function to contact the MOAT server and validate the Administrator's credentials.
     * If the credentials are valid, then the User will be directed to the Administrator Options
     * Page.
     */ 
    handleLogin = async () => {
        console.log("Handling Admin Login...");

        this.disableLoginButton();

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
                .catch((error) => {
                    console.log("ERROR: unable to perform fetch:" + error);

                    return false;
                });

        if (loggedIn === true) {
            this.setState({showLoginErrorMsg: false});
            this.props.setIsLoggedIn(true);
        } else {
            this.setState({showLoginErrorMsg: true});
        }

        this.enableLoginButton();
    }
}

export default AdminLoginPage;