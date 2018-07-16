import React, { Component } from 'react';
import './App.css';
var bodyParser = require("body-parser");

class App extends Component {
  state = {cards: []}

  componentDidMount() {
    fetch('/api/cards')
      .then(res => res.json())
      .then(data => data.data)
      .then(cards => this.setState({ cards }));
  }

  render() {
    console.log(this.state.cards)
    return (
      <div className="App">
        <h1>Users</h1>
          {this.state.cards.map(card =>
            <div>
            <div key={card.card_id}>{card.card_name}</div>
            <LogThis card={card} />
            </div>
          )}
      </div>
    );
  }
}

function LogThis(dis){
  console.log(dis)
  return ('');
}
export default App;
