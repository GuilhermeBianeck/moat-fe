import React from 'react';

import URLConsts from '../constants/URLConsts';

import './css/AdminOptionsPage.css';

class AdminOptionsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        ipBanList: "192.168.1.2\n193.3.4.5",
        removeNickname: ""
    };

    render () {
        return (
            <div className="AdminOptionsPage">
                <h2>Admin Options</h2>

                <p className="RoundBorder">
                    <button onClick={() => {this.handleRemoveAllScores();}}
                        >Remove All Scores</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text" onChange={
                        (event) => {
                            this.setState({removeNickname: event.target.value});
                        }}></input>

                    <button onClick={
                        () => 
                            {this.handleRemoveScoresWithNickname(this.state.removeNickname);}}
                        >Remove Scores With Nickname</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text"></input>
                    <button onClick={() => {this.handleBanIpAddress();}}
                        >Ban IP Address</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text"></input>
                    <button onClick={() => {this.handleUnBanIpAddress();}}
                        >Unban IP Address</button>
                </p>                

                <p className="AdminRow RoundBorder">
                    <h3>
                        LIST OF IP BANS
                    </h3>

                    <textarea readOnly={true} value={this.state.ipBanList}></textarea>
                </p>
            </div>
        );
    }

    handleRemoveAllScores = () => {
        console.log("NOT CURRENTLY IMPLEMENTED!");
    }

    handleBanIpAddress = () => {
        console.log("NOT CURRENTLY IMPLEMENTED!");
    }

    handleUnBanIpAddress = () => {
        console.log("NOT CURRENTLY IMPLEMENTED!");
    }

    handleRemoveScoresWithNickname = async (nickname) => {
        console.log("Handling removing scores with nickname.");

        const adminUsername = this.props.adminUsername;
        const adminPassword = this.props.adminPassword;

        const authString = "Basic " + btoa(adminUsername + ":" + adminPassword);

        const nicknameDTO = {
            nickname: nickname
        };

        const url = URLConsts.RPC_BASE_URL + "/admin/remove-scores-with-nickname/";

        const fetchParams = {
            method: 'POST',
            body: JSON.stringify(nicknameDTO),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authString
            }
        };

        let result = await fetch(url, fetchParams)
            .then(async (response) => {
                console.log("Successfully performed Fetch.");

                if (response.ok) {
                    return true;
                } else {
                    return false;
                }
            })
            .catch((error) => {
                console.log("ERROR performing fetch: " + error);

                return false;
            })
        
        console.log("Remove Nickname result: " + result);
    }
}

export default AdminOptionsPage;