import Link from 'next/link'

class Footer extends React.Component {
    render() {
        return (
            <div className="page-footer">
                <p>Created by Thomas in 2018</p>
                <p> | </p>
                <Link href="/about">
                    <a>About</a>
                </Link>
            </div>
        );
    }
}

export default Footer;