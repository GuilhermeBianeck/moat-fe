import React from "react";
import Loading from "./Loading.js";
import "./css/LeaderBoard.css";
import "./css/PopUpContainer.css";

/**
 * A class representing the LeaderBoard popup overlay.
 */
class LeaderBoard extends React.Component {
  constructor(props) {
    console.log("Constructing LeaderBoard.");

    super(props);
  }

  render() {
    let i = 0;

    let content;
    if (this.props.leaderBoardLoading) {
      content = <Loading />;
    } else {
      if (this.props.leaderBoard.length) {
        content = this.props.leaderBoard.map((entry) => (
          <div key={i++} className="LeaderBoardEntry">
            <span className="LeaderBoardName">{entry.nickname}</span>
            <span className="LeaderBoardScore">{entry.score}</span>
          </div>
        ));
      } else {
        content = <p className="LeaderBoardEmptyMsg">Leaderboard is empty</p>;
      }
    }

    return (
      <div
        className="PopUpContainer"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          this.props.showLeaderBoard(false);
        }}
      >
        <div className="LeaderBoard PopUp-Screen RoundBorder">
          <h2>Leaderboard</h2>
          {content}
        </div>
      </div>
    );
  }
}

export default LeaderBoard;
