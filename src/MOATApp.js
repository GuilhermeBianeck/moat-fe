import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Header.js";
import Body from "./Body.js";
import Footer from "./Footer.js";
import LeaderBoard from "./LeaderBoard.js";
import About from "./About.js";
import Options from "./Options.js";
import Stats from "./Stats.js";
import WelcomeScreen from "./WelcomeScreen.js";
import AdminPage from "./admin/AdminPage.js";

import Cookies from "./cookies/Cookies.js";
import GameStats from "./sg_objects/GameStats.js";
import TotalStats from "./stats/TotalStats.js";

import Difficulty from "./constants/Difficulty.js";
import URLConsts from "./constants/URLConsts.js";

import Validator from "./validators/Validator.js";
import DeviceDetector from "./device_detection/DeviceDetector.js";

import "./css/MOATApp.css";
import ErrorPage from "./ErrorPage.js";

/**
 * The main application class.
 */
class MOATApp extends React.Component {
  #RPC_LB_PATH = "/get-leaderboard/";
  #RPC_SEND_SCORE_PATH = "/send-score/";

  #cookies = new Cookies();

  state = {
    leaderBoardVisible: false,
    aboutPageVisible: false,
    optionsPageVisible: false,
    statsPageVisible: false,

    nickname: "",
    difficulty: Difficulty.DEFAULT_DIFFICULTY,

    playSounds: true,
    playMusic: false,

    lastGameStats: null, // The last game's GameStats class object.
    totalGameStats: new TotalStats(), // The TotalStats class object.

    leaderBoard: [],
    leaderBoardLoading: false,
  };

  render() {
    return (
      <BrowserRouter>
        <div className="MOATApp">
          <Header
            showLeaderBoard={this.showLeaderBoard}
            showAboutPage={this.showAboutPage}
            showOptionsPage={this.showOptionsPage}
            showStatsPage={this.showStatsPage}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Body
                  difficulty={this.state.difficulty}
                  playMusic={this.state.playMusic}
                  playSounds={this.state.playSounds}
                  setLastGameStats={this.setLastGameStats}
                  sendScoreToServer={this.sendScoreToServer}
                />
              }
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>

          <Footer showAdminPage={this.showAdminPage} />

          {this.state.leaderBoardVisible ? (
            <LeaderBoard
              showLeaderBoard={this.showLeaderBoard}
              leaderBoardLoading={this.state.leaderBoardLoading}
              leaderBoard={this.state.leaderBoard}
            />
          ) : null}

          {this.state.aboutPageVisible ? (
            <About showAboutPage={this.showAboutPage} />
          ) : null}

          {this.state.statsPageVisible ? (
            <Stats
              showStatsPage={this.showStatsPage}
              lastGameStats={this.state.lastGameStats}
              totalGameStats={this.state.totalGameStats}
            />
          ) : null}

          {this.state.optionsPageVisible ? (
            <Options
              showOptionsPage={this.showOptionsPage}
              setPlaySounds={this.setPlaySounds}
              setPlayMusic={this.setPlayMusic}
              playSounds={this.state.playSounds}
              playMusic={this.state.playMusic}
              nickname={this.state.nickname}
              setNickname={this.setNickname}
              difficulty={this.state.difficulty}
              setDifficulty={this.setDifficulty}
            />
          ) : null}

          {!Validator.validateNickname(this.state.nickname) ? (
            <WelcomeScreen
              setNickname={this.setNickname}
              showWelcomeScreen={this.showWelcomeScreen}
            />
          ) : null}
        </div>
      </BrowserRouter>
    );
  }

  componentDidMount = () => {
    console.log("Loading cookies.");

    this.loadStatsFromCookie();

    this.loadNicknameFromCookie();
    this.loadOptionsFromCookie();

    // If mobile device, then disable sounds.
    if (DeviceDetector.isMobileDevice()) {
      this.setState({ playSounds: false });
      this.setState({ playMusic: false });
    }

    console.log("Cookies: " + document.cookie);
  };

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

    if (optionsHaveChanged) this.saveOptionsToCookie();
  }

  saveNicknameToCookie = () => {
    this.#cookies.setCookie("nickname", this.state.nickname);
  };

  loadNicknameFromCookie = () => {
    console.log("Loading nickname from cookie.");

    let nickname = this.#cookies.getCookie("nickname");

    if (!this.setNickname(nickname))
      console.log("Failed loading nickname from cookie!");
  };

  /**
   * Saves the User's game Options into the cookie.
   */
  saveOptionsToCookie = () => {
    console.log("Saving options cookies.");

    this.#cookies.setCookie("difficulty", this.state.difficulty);
    this.#cookies.setCookie("playSounds", this.state.playSounds);
    this.#cookies.setCookie("playMusic", this.state.playMusic);
  };

  /**
   * Saves the User's game Stats into the cookie.
   */
  saveStatsToCookie = () => {
    console.log("Saving total stats cookies.");

    this.#cookies.setCookie(
      "totalHits",
      this.state.totalGameStats.getTotalHits()
    );
    this.#cookies.setCookie(
      "totalMisses",
      this.state.totalGameStats.getTotalMisses()
    );
    this.#cookies.setCookie(
      "totalDisappeared",
      this.state.totalGameStats.getTotalDisappeared()
    );
    this.#cookies.setCookie(
      "totalGamesPlayed",
      this.state.totalGameStats.getTotalGamesPlayed()
    );
  };

  /**
   * Loads the user's total Stats from the cookie.
   */
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
  };

  /**
   * Loads the User's Options from the cookie.
   */
  loadOptionsFromCookie = () => {
    console.log("Loading options cookies.");

    let difficulty = this.#cookies.getCookie("difficulty");
    let playSounds = this.#cookies.getCookie("playSounds");
    let playMusic = this.#cookies.getCookie("playMusic");

    if (difficulty !== null) this.setDifficulty(difficulty);

    if (playMusic !== null) this.setPlayMusic(playMusic);

    if (playSounds !== null) this.setPlaySounds(playSounds);
  };

  /**
   * Connects to the MOAT Server and fetches the Leaderboard data and populates it.
   */
  populateLeaderBoard = () => {
    console.log("Populating leaderboard data.");

    this.setState({ leaderBoardLoading: true });

    let url = `${URLConsts.RPC_BASE_URL}${this.#RPC_LB_PATH}`;
    const options = {
      method: "GET",
    };

    fetch(url, options)
      .then((response) => {
        response
          .json()
          .then((data) => {
            if (data !== null) {
              this.setState({ leaderBoard: data });
            }
          })
          .catch(() => {
            console.log("Leaderboard JSON data is empty.");
            this.setState({ leaderBoard: [] });
          });
      })
      .catch(() => {
        console.log("ERROR: Cannot connect to server!");
      })
      .finally(() => {
        this.setState({ leaderBoardLoading: false });
      });
  };

  showAdminPage = () => {
    console.log("Trying to load Admin Page...");

    this.setState({ adminPageVisible: true });
  };

  hideAdminPage = () => {
    console.log("Hiding Admin Page...");

    this.setState({ adminPageVisible: false });
  };

  /**
   * Saves the Stats from the last game in the cookie file and updates the current Stats in the
   * state.
   * @param gameStatsObj A GameStats object that contains the Stats from the last game.
   */
  setLastGameStats = (gameStatsObj) => {
    console.log("Setting last game stats.");

    if (!gameStatsObj === typeof GameStats) {
      console.log("Error: Not GameStats object.");

      return;
    } else {
      this.setState({ lastGameStats: gameStatsObj });

      // Update total game stats.
      if (this.state.totalGameStats !== null) {
        this.state.totalGameStats.incTotalHits(gameStatsObj.getHits());
        this.state.totalGameStats.incTotalMisses(gameStatsObj.getMisses());
        this.state.totalGameStats.incTotalDisappeared(
          gameStatsObj.getTargetsDisappeared()
        );
        this.state.totalGameStats.incTotalGamesPlayed(1);

        this.saveStatsToCookie();
      }
    }
  };

  /**
   * Sets the TotalStats object in state representing the User's total Stats.
   * @param totalStatsObj A TotalStats object to save into state.
   */
  setTotalGameStats = (totalStatsObj) => {
    console.log("Setting total game stats.");

    if (!totalStatsObj === typeof TotalStats) {
      console.log("Error: Not TotalStats object.");

      return;
    } else {
      this.setState({ totalGameStats: totalStatsObj });
    }
  };

  /**
   * Shows the LeaderBoard overlay.
   */
  showLeaderBoard = (value) => {
    if (value === true) {
      this.populateLeaderBoard();
      this.setState({ leaderBoardVisible: true });
    } else {
      this.setState({ leaderBoardVisible: false });
    }
  };

  /**
   * Shows the Stats overlay.
   */
  showStatsPage = (value) => {
    if (value === true) {
      this.setState({ statsPageVisible: true });
    } else {
      this.setState({ statsPageVisible: false });
    }
  };

  /**
   * Shows the About overlay.
   */
  showAboutPage = (value) => {
    if (value === true) {
      this.setState({ aboutPageVisible: true });
    } else {
      this.setState({ aboutPageVisible: false });
    }
  };

  /**
   * Shows the Options overlay.
   */
  showOptionsPage = (value) => {
    if (value === true) {
      this.setState({ optionsPageVisible: true });
    } else {
      this.setState({ optionsPageVisible: false });
    }
  };

  /**
   * Shows the screen
   */
  showWelcomeScreen = (value) => {
    if (value === true) {
      this.setState({ welcomeScreenVisible: true });
    } else {
      this.setState({ welcomeScreenVisible: false });
    }
  };

  /**
   * Sets whether the game should play sounds or not.
   * @param value A Boolean value indicating true or false.
   */
  setPlaySounds = (value) => {
    if (DeviceDetector.isMobileDevice()) {
      this.setState({ playSounds: false });

      return;
    }

    if (value === true || value === "true") {
      this.setState({ playSounds: true });
    } else {
      this.setState({ playSounds: false });
    }
  };

  /**
   * Sets whether the game should play music or not.
   * @param value A Boolean value indicating true or false.
   */
  setPlayMusic = (value) => {
    if (DeviceDetector.isMobileDevice()) {
      this.setState({ playMusic: false });

      return;
    }

    if (value === true || value === "true") {
      this.setState({ playMusic: true });
    } else {
      this.setState({ playMusic: false });
    }
  };

  /**
   * Sets the game Difficulty.
   * @example setDifficulty(Difficulty.MAX_DIFFICULTY);
   * @param A Difficulty object representing the difficulty.
   */
  setDifficulty = (value) => {
    if (Validator.validateDifficulty(value))
      this.setState({ difficulty: value });
    else this.setState({ difficulty: Difficulty.DEFAULT_DIFFICULTY });
  };

  /**
   * Validates and sets the User's Nickname.  If validation fails, then the Nickname will not
   * be changed.
   * @param name A String representing the User's Nickname.
   * @returns A Boolean object indicating whether the request was successful or not.
   */
  setNickname = (name) => {
    console.log("Setting nickname.");

    if (Validator.validateNickname(name)) {
      this.setState({ nickname: name });

      return true;
    } else {
      return false;
    }
  };

  /**
   * Sends the specified Score to the MOAT Server to register it.
   * @param score A int value representing the Score.
   */
  sendScoreToServer = (score) => {
    console.log("Sending score to server.");

    let url = `${URLConsts.RPC_BASE_URL}${this.#RPC_SEND_SCORE_PATH}`;

    let scoreObj = {
      score: score,
      nickname: this.state.nickname,
    };

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(scoreObj),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, fetchOptions)
      .then((response) => {
        response
          .json()
          .then((wasHighScore) => {
            // TODO: If was a high score then do something here.  Celebration animation?
            if (wasHighScore) {
              console.log("High score registered!");
            }
          })
          .catch(() => {
            console.log("ERROR: Cannot parse response from server.");
          });
      })
      .catch(() => {
        console.log("ERROR: Cannot connect to server.");
      });
  };
}

export default MOATApp;
