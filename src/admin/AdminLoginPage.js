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

    handleLogin = async (adminUsername, adminPassword) => {
        console.log("Handling Admin Login...");

        const adminLoginDTO = {
            adminUsername: adminUsername,
            adminPassword: adminPassword
        };

        const fetchParams = {
            method: 'POST',
            body: JSON.stringify(adminLoginDTO),
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const url = URLConsts.RPC_BASE_URL + "/admin/check-login/";

        console.log("Connecting to : " + url);

        let response = await fetch(url, fetchParams)
                .then(async (response) => {
                    console.log("Connecting to RPC server...");

                    let text = await response.text();

                    return text;
                })
                .catch((error) => {console.log("ERROR: unable to perform fetch.");});

        console.log(response);
    }
}

export default AdminLoginPage;