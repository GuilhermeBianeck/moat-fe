import React from 'react';
import './css/PopUpContainer.css';
import './css/WelcomeScreen.css';

/**
 * A class representing the Welcome Screen popup overlay.
 */
class WelcomeScreen extends React.Component {
    #DEFAULT_NICK_ERROR_MSG = "Minimum 5 characters.";

    constructor(props) {
        super(props);
    }

    state = {
        tempNickname: "",
        nicknameErrorMsg: ""
    }

    /**
     * A function that takes a String input and saves it as the Temporary Nickname.
     * This function is used to set the Temporary Nickname before validation can occur.
     * @param input A String representing the request Nickname.
     */
    #handleNicknameInput = (input) => {
        input = input.toUpperCase();

        // Prevent user typing in any symbols.
        let pattern = /^[A-Z0-9]{0,10}$/;
        let result = pattern.test(input);

        if (result) {
            this.setState({ tempNickname: input });
        }
    }

    /**
     * A function that validates the supplied Nickname.  If the Nickname is valid, then the User
     * will be allowed to enter the rest of the site.
     * @param nickname A String representing the requested Nickname.
     */
    #progress = (nickname) => {
        // Check nickname is OK before progressing.
        if (this.props.setNickname(nickname)) {
        } else {
            // Show error message.
            this.setState({ nicknameErrorMsg: this.#DEFAULT_NICK_ERROR_MSG });
        }
    }

    render() {
        return (
            <div className="PopUpContainer">
                <div className="WelcomeScreen PopUp-Screen RoundBorder">
                    <h1>Welcome</h1>
                    <div>
                        <p>Please enter a nickname</p>
                        <input className="WSNicknameInput" type="text"
                            maxLength="10"
                            value={this.state.tempNickname}
                            onChange={(evt) => {
                                console.log("Nickname input changed!");
                                this.#handleNicknameInput(evt.target.value);
                            }} />
                        <p className="NicknameError">{this.state.nicknameErrorMsg}</p>
                    </div>
                    <div>
                        <input className="WSOKButton" type="button" value="ENTER!"
                            onClick={(evt) => {
                                this.#progress(this.state.tempNickname);
                            }} />
                    </div>
                </div>
            </div>
        );
    }
}

export default WelcomeScreen;