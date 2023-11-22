import React from 'react';
import "./css/Footer.css";

class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="Footer">
                <p>Copyright &copy; 2023 Matt Dixon</p>
            </div>
        );
    }
}

export default Footer;