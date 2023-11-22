import React from 'react';
import './css/About.css';
import './css/PopUpContainer.css';

class About extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="PopUpContainer"
                onClick={(evt) => {
                    if (evt.target != evt.currentTarget)
                        return;

                    this.props.showAboutPage(false);
                }}
            >
                <div className="About PopUp-Screen RoundBorder">
                    <h1>About</h1>
                    <p><span className="AboutAppTitle">MATT'S ONLINE AIM TRAINER v0.1</span></p>
                    <p><span className="AboutCopyright">Copyright &copy; 2023 Matt Dixon</span></p>
                </div>
            </div>
        )
    }
}

export default About;