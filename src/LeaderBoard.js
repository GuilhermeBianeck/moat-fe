import React from 'react';
import './css/LeaderBoard.css';
import './css/PopUpContainer.css';

class LeaderBoard extends React.Component {
    constructor(props) {
        console.log("Constructing LeaderBoard.");
        super(props);
    }

    render() {
        let i = 0;

        return (
            <div className="PopUpContainer"
                onClick={(evt) => {
                    if (evt.target != evt.currentTarget)
                        return;

                    this.props.showLeaderBoard(false);
                }}>
                <div className="LeaderBoard PopUp-Screen RoundBorder" >
                    <h1>Leaderboard</h1>
                    {this.props.leaderBoard.length ? 
                            null
                        :
                            <p className="LeaderBoardEmptyMsg">
                                Leaderboard is empty
                            </p>
                    }

                    {this.props.leaderBoard.map(entry => (
                        <div key={i++} className="LeaderBoardEntry">
                            <span className="LeaderBoardName">
                                {entry.nickname}
                            </span>
                            <span className="LeaderBoardScore">
                                {entry.score}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default LeaderBoard;