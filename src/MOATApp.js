import React from 'react';
import Header from './Header.js';
import Body from './Body.js';
import Footer from './Footer.js';
import LeaderBoard from "./LeaderBoard.js";
import About from './About.js';
import Options from './Options.js';
import Stats from './Stats.js';
import WelcomeScreen from './WelcomeScreen.js';
import AdminPage from './admin/AdminPage.js';

import Cookies from './cookies/Cookies.js';
import GameStats from './sg_objects/GameStats.js';
import TotalStats from './stats/TotalStats.js';

//import Constants from './constants/Constants.js';
import Difficulty from './constants/Difficulty.js'
import URLConsts from './constants/URLConsts.js';

import Validator from './validators/Validator.js';
import DeviceDetector from './device_detection/DeviceDetector.js';

import './css/MOATApp.css';
                                                                    
class MOATApp extends React.Component {
    #RPC_LB_PATH = "/get-leaderboard/";
    #RPC_SEND_SCORE_PATH = "/send-score/";

    #cookies;    // Cookies class object.

    state = {
        leaderBoardVisible: false,
        aboutPageVisible: false,
        optionsPageVisible: false,
        statsPageVisible: false,

        adminPageVisible: false,

        nickname: "",
        difficulty: Difficulty.DEFAULT_DIFFICULTY,

        playSounds: true,
        playMusic: true,

        lastGameStats: null,    // The last game's GameStats class object.
        totalGameStats: new TotalStats(),   // The TotalStats class object.

        leaderBoard: [],

        setLastGameStats: (gameStatsObj) => {
            console.log("Setting last game stats.");

            if (!gameStatsObj === typeof(GameStats)) {
                console.log("Error: Not GameStats object.");
                
                return;
            } else {
                this.setState({ lastGameStats: gameStatsObj });

                // Update total game stats.
                if (this.state.totalGameStats !== null) {
                    this.state.totalGameStats.incTotalHits(gameStatsObj.getHits());
                    this.state.totalGameStats.incTotalMisses(gameStatsObj.getMisses());
                    this.state.totalGameStats.incTotalDisappeared(
                            gameStatsObj.getTargetsDisappeared());
                    this.state.totalGameStats.incTotalGamesPlayed(1);

                    this.saveStatsToCookie();
                }
            }
        },

        setTotalGameStats: (totalStatsObj) => {
            console.log("Setting total game stats.");

            if (!totalStatsObj === typeof(TotalStats)) {
                console.log("Error: Not TotalStats object.");

                return;
            } else {
                this.setState({ totalGameStats: totalStatsObj });
            }
        },

        showLeaderBoard: (value) => {
            if (value === true) {
                this.populateLeaderBoard();
                this.setState({ leaderBoardVisible: true });
            } else {
                this.setState({ leaderBoardVisible: false });
            }
        },

        showStatsPage: (value) => {
            if (value === true) {
                this.setState({ statsPageVisible: true });
            } else {
                this.setState({ statsPageVisible: false });
            }
        },

        showAboutPage: (value) => {
            if (value === true) {
                this.setState({ aboutPageVisible: true });
            } else {
                this.setState({ aboutPageVisible: false });
            }
        },

        showOptionsPage: (value) => {
            if (value === true) {
                this.setState({ optionsPageVisible: true });
            } else {
                this.setState({ optionsPageVisible: false });
            }
        },

        showWelcomeScreen: (value) => {
            if (value === true) {
                this.setState({ welcomeScreenVisible: true });
            } else {
                this.setState({ welcomeScreenVisible: false });
            }
        },

        setPlaySounds: (value) => {
            if (DeviceDetector.isMobileDevice()) {
                this.setState({playSounds: false});

                return;
            }

            if (value === true || value === "true") {
                this.setState({playSounds: true});
            } else {
                this.setState({playSounds: false});
            }
        },

        setPlayMusic: (value) => {
            if (DeviceDetector.isMobileDevice()) {
                this.setState({playMusic: false});

                return;
            }

            if (value === true || value === "true") {
                this.setState({ playMusic: true });
            } else {
                this.setState({ playMusic: false });
            }
        },

        setDifficulty: (value) => {
            if (Validator.validateDifficulty(value))
                this.setState({ difficulty: value });
            else
                this.setState({ difficulty: Difficulty.DEFAULT_DIFFICULTY });
        },

        // Returns true is change was successful.
        setNickname: (name) => {
            console.log("Setting nickname.");
            if (Validator.validateNickname(name)) {
                this.setState({ nickname: name });

                return true;
            }
            else {
                return false;
            }
        },

        sendScoreToServer: (score) => {
            console.log("Sending score to server.");

            let url = `${URLConsts.RPC_BASE_URL}${this.#RPC_SEND_SCORE_PATH}`;

            let scoreObj = {
                score: score,
                nickname: this.state.nickname
            }

            const fetchOptions = {
                method: "POST",
                body: JSON.stringify(scoreObj),
                headers: {
                    "Content-Type": "application/json"
                }
            }

            fetch(url, fetchOptions).then((response) => {
                response.json().then((wasHighScore) => {
                    // If was a high score then do something here.
                    // TODO: Celebration animation?
                    if (wasHighScore) {
                        console.log("High score registered!");
                    }
                })
                .catch(() => {
                    console.log("ERROR: Cannot parse response from server.");
                });
            })
            .catch(() => {console.log("ERROR: Cannot connect to server.")});

            //TODO: return false or true if new high score.
        }
    }

    constructor(props) {
        super(props);

        this.#cookies = new Cookies();
    }

    componentDidMount = () => {
        console.log("Loading cookies.");

        this.loadStatsFromCookie();

        this.loadNicknameFromCookie();
        this.loadOptionsFromCookie();

        // If mobile device, then disable sounds.
        if(DeviceDetector.isMobileDevice()) {
            this.setState({playSounds: false});
            this.setState({playMusic: false});
        }

        console.log("Cookies: " + document.cookie);
    }

    componentDidUpdate(prevProps, prevState) {
        // If nickname changed, then update the cookie.
        if (prevState.nickname !== this.state.nickname) {
            this.saveNicknameToCookie();
        }

        let optionsHaveChanged = false;

        if (prevState.playSounds !== this.state.playSounds) {
            optionsHaveChanged = true;
        }

        if (prevState.playMusic !== this.state.playMusic) {
            optionsHaveChanged = true;
        }

        if (prevState.difficulty !== this.state.difficulty) {
            optionsHaveChanged = true;
        }

        if (optionsHaveChanged)
            this.saveOptionsToCookie();
    }

    saveNicknameToCookie = () => {
        this.#cookies.setCookie("nickname", this.state.nickname);
    }

    loadNicknameFromCookie = () => {
        console.log("Loading nickname from cookie.");

        let nickname = this.#cookies.getCookie("nickname");

        if (!this.state.setNickname(nickname))
            console.log("Failed loading nickname from cookie!");
    }

    saveOptionsToCookie = () => {
        console.log("Saving options cookies.");

        this.#cookies.setCookie("difficulty", this.state.difficulty);
        this.#cookies.setCookie("playSounds", this.state.playSounds);
        this.#cookies.setCookie("playMusic", this.state.playMusic);
    }

    // Save the total stats to the cookie.
    saveStatsToCookie = () => {
        console.log("Saving total stats cookies.");

        this.#cookies.setCookie("totalHits", this.state.totalGameStats.getTotalHits());
        this.#cookies.setCookie("totalMisses", this.state.totalGameStats.getTotalMisses());
        this.#cookies.setCookie("totalDisappeared", this.state.totalGameStats.getTotalDisappeared());
        this.#cookies.setCookie("totalGamesPlayed", this.state.totalGameStats.getTotalGamesPlayed());
    }

    // Load the total stats from the cookie.
    loadStatsFromCookie = () => {
        console.log("Loading total stats from cookies.");

        let totalHits = this.#cookies.getCookie("totalHits");
        if (totalHits !== null) {
            this.state.totalGameStats.setTotalHits(totalHits);
        }            

        let totalMisses = this.#cookies.getCookie("totalMisses");
        if (totalMisses !== null)
            this.state.totalGameStats.setTotalMisses(totalMisses);

        let totalDisappeared = this.#cookies.getCookie("totalDisappeared");
        if (totalDisappeared !== null)
            this.state.totalGameStats.setTotalDisappeared(totalDisappeared);

        let totalGamesPlayed = this.#cookies.getCookie("totalGamesPlayed");
        if (totalGamesPlayed !== null)
            this.state.totalGameStats.setTotalGamesPlayed(totalGamesPlayed);
    }

    loadOptionsFromCookie = () => {
        console.log("Loading options cookies.");

        let difficulty = this.#cookies.getCookie("difficulty");
        let playSounds = this.#cookies.getCookie("playSounds");
        let playMusic = this.#cookies.getCookie("playMusic");

        if (difficulty !== null)
            this.state.setDifficulty(difficulty);

        if (playMusic !== null)
            this.state.setPlayMusic(playMusic);

        if (playSounds !== null)
            this.state.setPlaySounds(playSounds);
    }

    populateLeaderBoard = () => {
        console.log("Populating leaderboard data.");

        let url = `${URLConsts.RPC_BASE_URL}${this.#RPC_LB_PATH}`;
        const options = {
            method: 'GET'
        };

        fetch(url, options).then((response) => {
            response.json().then((data) => {
                if (data !== null) {
                    this.setState({leaderBoard: data});
                }
            }).catch(() => {
                console.log("Leaderboard JSON data is empty.")
                this.setState({leaderBoard: []});
            });
        })
        .catch(() => {
            console.log("ERROR: Cannot connect to server!");
        });
    }

    showAdminPage = () => {
        console.log("Trying to load Admin Page...");

        this.setState({adminPageVisible: true});
    }

    hideAdminPage = () => {
        console.log("Hiding Admin Page...");

        this.setState({adminPageVisible: false});
    }

    render() {
        let mainBody;

        if (this.state.adminPageVisible) {
            mainBody = <AdminPage />
        } else {
            mainBody = <Body difficulty={this.state.difficulty}
                    playMusic={this.state.playMusic}
                    playSounds={this.state.playSounds} 
                    setLastGameStats={this.state.setLastGameStats} 
                    sendScoreToServer={this.state.sendScoreToServer} />
        }

        return (
            <div className="MOATApp">
                <Header showLeaderBoard={this.state.showLeaderBoard}
                        showAboutPage={this.state.showAboutPage}
                        showOptionsPage={this.state.showOptionsPage} 
                        showStatsPage={this.state.showStatsPage} 
                        hideAdminPage={this.hideAdminPage}
                    />

                {mainBody}

                <Footer showAdminPage={this.showAdminPage} />

                {this.state.leaderBoardVisible ?
                    <LeaderBoard showLeaderBoard={this.state.showLeaderBoard} 
                        leaderBoard={this.state.leaderBoard} /> : null}

                {this.state.aboutPageVisible ?
                    <About showAboutPage={this.state.showAboutPage} /> : null}

                {this.state.statsPageVisible ?
                    <Stats showStatsPage={this.state.showStatsPage} 
                            lastGameStats={this.state.lastGameStats} 
                            totalGameStats={this.state.totalGameStats} /> : null}

                {this.state.optionsPageVisible ?
                    <Options showOptionsPage={this.state.showOptionsPage}
                            setPlaySounds={this.state.setPlaySounds}
                            setPlayMusic={this.state.setPlayMusic}
                            playSounds={this.state.playSounds}
                            playMusic={this.state.playMusic}
                            nickname={this.state.nickname}
                            setNickname={this.state.setNickname}
                            difficulty={this.state.difficulty}
                            setDifficulty={this.state.setDifficulty} /> : null}

                {!Validator.validateNickname(this.state.nickname) ?
                    <WelcomeScreen setNickname={this.state.setNickname}
                            showWelcomeScreen={this.state.showWelcomeScreen} /> : null}
            </div>
        );
    }
}

export default MOATApp;