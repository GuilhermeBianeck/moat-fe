import React from 'react';

import URLConsts from '../constants/URLConsts';

import './css/AdminOptionsPage.css';

/**
 * A class representing the Administrator Options Page.
 */
class AdminOptionsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        ipBanList: "UNIMPLEMENTED FUNCTION",
        removeNickname: "",

        removeAllScoresBtnEnabled: true,
        removeScoresWNickBtnEnabled: true,
        banIpAddressBtnEnabled: true,
        unbanIpAddressBtnEnabled: true,
        logoutBtnEnabled: true
    };

    render () {
        return (
            <div className="AdminOptionsPage">
                <h2>Admin Options</h2>

                <p className="RoundBorder">
                    <button disabled={!this.state.removeAllScoresBtnEnabled} 
                        onClick={() => {this.handleRemoveAllScores();}}
                        >Remove All Scores</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text" onChange={
                        (event) => {
                            this.setState({removeNickname: event.target.value});
                        }}></input>

                    <button disabled={!this.state.removeScoresWNickBtnEnabled}
                        onClick={
                            () => 
                                {this.handleRemoveScoresWithNickname(this.state.removeNickname);}}
                        >Remove Scores With Nickname</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text"></input>
                    <button disabled={!this.state.banIpAddressBtnEnabled}
                        onClick={() => {this.handleBanIpAddress();}}
                        >Ban IP Address</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text"></input>
                    <button disabled={!this.state.unbanIpAddressBtnEnabled}
                        onClick={() => {this.handleUnBanIpAddress();}}
                        >Unban IP Address</button>
                </p>                

                <p className="AdminRow RoundBorder">
                    <h3>
                        LIST OF IP BANS
                    </h3>

                    <textarea readOnly={true} value={this.state.ipBanList}></textarea>
                </p>

                <p>
                    <button disabled={!this.state.logoutBtnEnabled}
                        onClick={() => {this.handleAdminLogout();}}>Logout</button>
                </p>
            </div>
        );
    }

    /**
     * Disables all buttons on the Administrator Options Page.
     */
    disableAllButtons = () => {
        console.log("Disabling all buttons.");

        this.setState({
            removeAllScoresBtnEnabled: false,
            removeScoresWNickBtnEnabled: false,
            banIpAddressBtnEnabled: false,
            unbanIpAddressBtnEnabled: false,
            logoutBtnEnabled: false
        });
    }

    /**
     * Enables all buttons on the Administrator Options page.
     */
    enableAllButtons = () => {
        console.log("Enabling all buttons.");

        this.setState({
            removeAllScoresBtnEnabled: true,
            removeScoresWNickBtnEnabled: true,
            banIpAddressBtnEnabled: true,
            unbanIpAddressBtnEnabled: true,
            logoutBtnEnabled: true   
        });
    }

    handleAdminLogout = () => {
        console.log("Trying to log out current admin...");

        this.props.handleAdminLogout();
    }

    /**
     * Contacts the MOAT Server and attempts to remove all Scores from the Leaderboard.
     */
    handleRemoveAllScores = async () => {
        console.log("Removing all scores.");

        this.disableAllButtons();

        const adminUsername = this.props.adminUsername;
        const adminPassword = this.props.adminPassword;

        const authString = "Basic " + btoa(adminUsername + ":" + adminPassword);

        const url = URLConsts.RPC_BASE_URL + "/admin/remove-all-scores/";

        const fetchParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authString
            }
        };

        let response = await fetch(url, fetchParams)
            .then((response) => {
                console.log("Fetch executed successfully.");

                if (response.ok) {
                    return true;
                } else {
                    throw "Fetch response not OK";
                }
            })
            .catch((error) => {
                console.log("ERROR performing fetch: " + error);

                return false;
            })
        
        console.log("Removing all scores successful: " + response);

        this.enableAllButtons();
    }

    handleBanIpAddress = () => {
        console.log("NOT CURRENTLY IMPLEMENTED!");
    }

    handleUnBanIpAddress = () => {
        console.log("NOT CURRENTLY IMPLEMENTED!");
    }

    /**
     * Contacts the MOAT Server and removes all the Scores from the Leaderboard with the specified
     * Nickname.
     * @param nickname A String representing the Nickname to remove from the Leaderboard.
     */
    handleRemoveScoresWithNickname = async (nickname) => {
        console.log("Handling removing scores with nickname.");

        if (nickname === null || nickname === "" || nickname === undefined) {
            console.log("Nickname cannot be null or empty.");

            return;
        }

        this.disableAllButtons();

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
                console.log("Successfully performed fetch.");

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

        this.enableAllButtons();
    }
}

export default AdminOptionsPage;