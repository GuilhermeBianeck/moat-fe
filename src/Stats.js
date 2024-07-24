import React from "react";
import "./css/Stats.css";
import "./css/PopUpContainer.css";

/**
 * A class representing the Stats popup overlay.
 */
class Stats extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // Boolean specifying if we have stats from the previous game.
    let havePrvGameStats = false;

    let hits;
    let misses;
    let disappeared;
    let accuracy;

    if (this.props.lastGameStats !== null) {
      hits = this.props.lastGameStats.getHits();
      misses = this.props.lastGameStats.getMisses();
      disappeared = this.props.lastGameStats.getTargetsDisappeared();

      // Calculate accuracy.
      if (hits === 0 && misses === 0)
        // Prevent NaN.
        accuracy = 0;
      else accuracy = ((hits / (hits + misses)) * 100).toFixed();

      havePrvGameStats = true;
    }

    // Boolean specifiying if we have stats from all previous games.
    let haveTotalGameStats = false;

    let totalHits;
    let totalMisses;
    let totalDisappeared;
    let totalAccuracy;
    let totalGamesPlayed;

    if (this.props.totalGameStats !== null) {
      if (this.props.totalGameStats.getTotalGamesPlayed() > 0) {
        totalHits = this.props.totalGameStats.getTotalHits();
        totalMisses = this.props.totalGameStats.getTotalMisses();
        totalDisappeared = this.props.totalGameStats.getTotalDisappeared();
        totalAccuracy = this.props.totalGameStats.getTotalAccuracy();
        totalGamesPlayed = this.props.totalGameStats.getTotalGamesPlayed();

        haveTotalGameStats = true;
      }
    }

    return (
      <div
        className="PopUpContainer"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) return;

          this.props.showStatsPage(false);
        }}
      >
        <div className="Stats PopUp-Screen RoundBorder">
          <h2>Stats</h2>
          {havePrvGameStats ? (
            <>
              <h3>Last Game</h3>
              <div className="StatRow">
                <span className="StatName">Total Hits</span>
                <span className="StatValue">{hits}</span>
              </div>
              <div className="StatRow">
                <span className="StatName">Total Misses</span>
                <span className="StatValue">{misses}</span>
              </div>
              <div className="StatRow">
                <span className="StatName">Targets Not Hit</span>
                <span className="StatValue">{disappeared}</span>
              </div>
              <div className="StatRow">
                <span className="StatName">Accuracy</span>
                <span className="StatValue">{accuracy}%</span>
              </div>
            </>
          ) : null}

          {haveTotalGameStats ? (
            <>
              <h3>All Time</h3>
              <div className="StatRow">
                <span className="StatName">Total Hits</span>
                <span className="StatValue">{totalHits}</span>
              </div>
              <div className="StatRow">
                <span className="StatName">Total Misses</span>
                <span className="StatValue">{totalMisses}</span>
              </div>
              <div className="StatRow">
                <span className="StatName">Targets Not Hit</span>
                <span className="StatValue">{totalDisappeared}</span>
              </div>
              <div className="StatRow">
                <span className="StatName">Accuracy</span>
                <span className="StatValue">{totalAccuracy}%</span>
              </div>
              <div className="StatRow">
                <span className="StatName">Games Played</span>
                <span className="StatValue">{totalGamesPlayed}</span>
              </div>
            </>
          ) : (
            <div className="StatRow NoStats">
              <p>No previous games played</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Stats;
