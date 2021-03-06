import Link from 'next/link'

import "../style.css";

class AboutPage extends React.Component {
    render() {
        return (
            <div className="page-appearance" id="night-gradient">
                <h1>About all of this</h1>
                <div className="descriptive-paragraph">
                    <p>This app was created by Thomas Draxler as a way to practice 
                    using React, Node, Express, and other frameworks and libraries. Additionally, I used the OpenWeatherMap API
                    to get current conditions for many places all over the world.</p>
                    <p style={{display: 'inline'}}>For more info, please visit <a href="https://github.com/RoboCaesar" target="_blank">my Github page</a>.</p>
                    <p>~</p>
                    <Link href="/">
                        <a>Back</a>
                    </Link>
                </div>
            </div>
        );
    }
}

export default AboutPage;