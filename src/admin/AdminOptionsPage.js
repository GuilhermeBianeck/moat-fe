import React from 'react';

import './css/AdminOptionsPage.css';

class AdminOptionsPage extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        ipBanList: "192.168.1.2\n193.3.4.5"
    };

    render () {
        return (
            <div className="AdminOptionsPage">
                <h2>Admin Options</h2>

                <p className="RoundBorder">
                    <button>Remove All Scores</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text"></input>
                    <button>Remove Scores With Nickname</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text"></input>
                    <button>Ban IP Address</button>
                </p>

                <p className="AdminRow RoundBorder">
                    <input type="text"></input>
                    <button>Unban IP Address</button>
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
}

export default AdminOptionsPage;