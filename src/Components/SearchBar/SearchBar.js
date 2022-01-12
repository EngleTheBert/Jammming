import React from "react";
import "./SearchBar.css";
class Searchbar extends React.Component {
    constructor(props){
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }
    search(){
        this.props.onSearch(this.state.term)
    }
    handleTermChange(event) {
        this.props.onSearch(event.target.value)
    }
    render() {
        return (<div class="SearchBar">
  <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
  <button class="SearchButton">SEARCH</button>
</div>)
    }
}
export default Searchbar