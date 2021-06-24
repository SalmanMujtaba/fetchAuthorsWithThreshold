import logo from './logo.svg';
import './App.scss';
import React from 'react';
import DataList from './components/Datalist';
const axios = require('axios');

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.getNames = this.getNames.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      value: "",
      allValues: []
    }

  }

  async getNames(threshold = 10) {
    const firstCall = await axios.get("https://jsonmock.hackerrank.com/api/article_users?page=1");
    const { data } = firstCall;
    let calls = [];
    let responsesOfAPICalls = [];
    let arrayOfUserNames = data["data"] || [];
    arrayOfUserNames = this.filterNames(this.filterTHreshold(arrayOfUserNames, threshold));
    responsesOfAPICalls.push(...arrayOfUserNames);
    if( data && arrayOfUserNames ) {
      if( data.total_pages && data.total_pages > 1 ) {
        for(let index = 2; index<=data.total_pages; index++) {
          calls.push(axios.get(`https://jsonmock.hackerrank.com/api/article_users?page=${index}`));
        }
      }
    }
    if(calls && calls.length) {
      const allData = await Promise.all([...calls]);
      if(allData) {
        for(let res of allData) {
          responsesOfAPICalls = responsesOfAPICalls.concat(this.filterNames(this.filterTHreshold(res.data.data, threshold)));
        }
      }
    }
    this.setState({
      allValues: responsesOfAPICalls
    });

  }

  filterTHreshold(arrayname, threshold) {
    return arrayname.filter(user => user.submission_count > threshold);
  }

  filterNames(arrayName) {
    return arrayName.map(user => user.username);
  }

  handleSubmit(event) {
    this.getNames(+this.state.value);
    event.preventDefault();
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  render() {
    return (
      <main>
        <div class="element element-3">
          <div>
            <form onSubmit={this.handleSubmit}>
              <label>
                Enter The Threshold: 
                <input type="number" value={this.state.value} onChange={this.handleChange} />
              </label>
              <button class="margin-left-15">Submit</button>
            </form>
          <DataList data={this.state.allValues}></DataList>
          </div>
        </div>
      </main>
    );
  }
}

