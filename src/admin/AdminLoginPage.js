import React from 'react';

import URLConsts from '../constants/URLConsts';

import './css/AdminPageLogin.css';

class AdminLoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        adminUsername: "",
        adminPassword: ""
    };

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
        this.setState({adminUsername: adminUsername});
    }

    setAdminPassword = (adminPassword) => {
        this.setState({adminPassword: adminPassword});
    }

    // NOTE: We don't actually need the json object to login.  Can remove that.
    handleLogin = async () => {
        console.log("Handling Admin Login...");

        const adminLoginDTO = {
            adminUsername: this.state.adminUsername,
            adminPassword: this.state.adminPassword
        };

        console.log(adminLoginDTO);

        let authString = 'Basic ' + btoa(this.state.adminUsername + ":" + this.state.adminPassword);

        const fetchParams = {
            method: 'POST',
            body: JSON.stringify(adminLoginDTO),
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

    /*
    testMethod1 = async () => {
        let username = "matt";
        let password = "password";

        const adminLoginDTO = {
            adminUsername: username,
            adminPassword: password
        };

        let authString = 'Basic ' + btoa(username + ":" + password);

        const fetchParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authString
            }
        }

        console.log("Performing TEST fetch...");

        const url = "http://localhost:3002/admin/test2/";

        let reponse = await fetch(url, fetchParams).then(
            async (response) => {
                console.log("TEST FETCH PERFORMED SUCCESSFULLY!");

                let responseText = await response.text();
                console.log(responseText);
            }
        )
        .catch((error) => {console.log("ERROR PERFORMING FETCH: " + error)});
    }
    */
}

export default AdminLoginPage;