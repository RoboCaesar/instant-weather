// import Link from 'next/link';
// import PropTypes from 'prop-types';
const axios = require('axios');


// function resultsItems(props) {
//     return props.map((entry) =>
//         <div className="search-result" key={entry.id}>
//             <p>{entry.name}, {entry.country}</p>
//             <p className="location-info">{entry.coord.lat}°, {entry.coord.lon}°</p>
//         </div>
//     );
// }

//https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

class SearchBox extends React.Component {
    constructor(props) {
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleEntry = this.handleEntry.bind(this);
        this.handleLeave = this.handleLeave.bind(this);
        this.loadResults = this.loadResults.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            resultsVisible: false,
            query: '',
            loading: false,
            searchResults: []
        }
    }

    loadResults(searchQuery) {
        axios.get('/search/' + searchQuery)
        .then((response) => {
          console.log(response.data);
          this.setState(() => {
            return {
                searchResults: response.data,
                loading: false
            }
          });
        })
        .catch((error) => {
          console.log(error)
        })
        .then(() => {
        });
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.searchSubmit(this.state.query);
        console.log('Search submitted with query: ' + this.state.query);
        this.setState({
            resultsVisible: false,
            query: '',
            loading: false,
            searchResults: []
        });
    }

    handleClick(searchID) {
        this.props.searchSubmit(searchID, true); //'true' meaning that we're searching with a numerical id
        this.setState({
            resultsVisible: false,
            query: '',
            loading: false,
            searchResults: []
        });       
    }

    handleEntry(e) {
        if (e.target.value.length > 2) {
            this.setState({
                resultsVisible: true, //if there's no text, don't show the results window.
                query: e.target.value,
                loading: true
            }, () => {
                this.loadResults(this.state.query);
            });
        } else if (e.target.value.length === 0) {
            this.setState({
                resultsVisible: false,
                query: e.target.value,
                searchResults: [],
                loading: false
            });               
        } else {
            this.setState({
                query: e.target.value
            });             
        }
        e.preventDefault();
    }

    handleLeave(e) {
        if (this.wrapperRef && !this.wrapperRef.contains(e.target)) {
            this.setState((prevState) => {
                return {resultsVisible: false}
            });
        }
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleLeave);
    }
    
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleLeave);
    }

    render() {

        let results;

        if (this.state.loading === false) {
            if (this.state.searchResults && this.state.searchResults.length > 0) {
                results = this.state.searchResults.map((entry) =>
                    <div className="search-result" key={entry.id} onClick={() => this.handleClick(entry.id)}>
                        <p>{entry.name}, {entry.country}</p>
                        <p className="location-info">{entry.coord.lat}°, {entry.coord.lon}°</p>
                    </div>
                );
                //resultsItems(this.state.searchResults);
                console.log(results);
                ;
            } else {
                results = <p>No results found!</p>
            }

        } else {
            results = <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
        }

        return (
            <div style={{margin: '0 auto'}}>
                <form onSubmit={this.handleSubmit} >
                    <input onInput={this.handleEntry} type="text" value={this.state.query}/>
                    <div ref={this.setWrapperRef} className="results-box" style={{display: this.state.resultsVisible ? 'block' : 'none'}}>
                        {results}
                    </div>
                </form>
            </div>
        );
    }
}

// SearchBox.propTypes = {
//     children: PropTypes.element.isRequired,
// };

export default SearchBox;