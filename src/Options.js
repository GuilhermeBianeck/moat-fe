import React from 'react';
import './css/Options.css';
import './css/PopUpContainer.css';

import Difficulty from './constants/Difficulty.js';

class Options extends React.Component {
    #USERNAME_ERROR_MESSAGE = "Minimum 5 characters."

    constructor(props) {
        super(props);
    }

    state = {
        tempNickname: this.props.nickname,
        nicknameError: ""
    };

    #setTempNickname = (nickname) => {
        nickname = nickname.toUpperCase();

        // Prevent user typing in any symbols.
        let pattern = /^[A-Z0-9]{0,10}$/;
        let result = pattern.test(nickname);

        if (result) {
            this.setState({tempNickname: nickname});
        } else {
            console.log("Invalid nickname!");
        }
    }

    #drawDifficulties = () => {
        let difficulties = Difficulty.getDifficulties();

        let diffArray = [];

        difficulties.forEach((value, key) => {
            diffArray.push(<option key={key} value={key}>{value.name}</option>);
        });

        return (
            <>
                {diffArray}
            </>
        );
    }

    render() {
        return (
            <div className="PopUpContainer"
                onClick={(evt) => {
                    if (evt.target != evt.currentTarget)
                        return;

                    // Validate nickname before we close.
                    if (this.props.setNickname(this.state.tempNickname)) {
                        this.props.showOptionsPage(false);
                    } else {
                        this.setState({ nicknameError: this.#USERNAME_ERROR_MESSAGE });
                    }
                }}
            >
                <div className="Options PopUp-Screen RoundBorder">
                    <h1>Options</h1>
                    <div className="Option">
                        <label>Play Sounds</label>
                        <input type="checkbox"
                            checked={this.props.playSounds ? true : false}
                            onChange={(evt) => {
                                this.props.setPlaySounds(evt.target.checked);
                            }}/>
                    </div>
                    <div className="Option">
                        <label>Play Music</label>
                        <input type="checkbox"
                            checked={this.props.playMusic ? true : false}
                            onChange={(evt) => {
                                this.props.setPlayMusic(evt.target.checked);
                            }}
                        />
                    </div>
                    <div className="Option">
                        <label>Nickname</label>
                        <input type="text" value={this.state.tempNickname} maxLength="10"
                            onChange={(evt) => {
                                this.#setTempNickname(evt.target.value);
                            }}
                        />
                    </div>
                    <div className="NicknameErrorMsg">
                        <p>{this.state.nicknameError}</p>
                    </div>
                    <div className="Option">
                        <label>Difficulty</label>
                        <select name="difficulty" defaultValue={this.props.difficulty}
                            onChange={(evt) => this.props.setDifficulty(evt.target.value)}>
                            {this.#drawDifficulties()}
                        </select>
                    </div>
                </div>
            </div>
        );
    }
}

export default Options;

// pattern="[A-Za-z0-9]{5,10}"