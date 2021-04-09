import {useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';

const API_URL = 'https://deckofcardsapi.com/api/deck';

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  
  useEffect(function processGame() { 
    async function fetchDeck() {
      //request deck data from API
      const resp = await axios.get(`${API_URL}/new/shuffle`);
      //update state
      setDeck(resp.data);
    }
    if(!deck) fetchDeck();
  }, [ ]);

  // event handler 
  async function draw() {
    try {
      const cardResp = await axios.get(`${API_URL}/${deck.deck_id}/draw?count=1`);
      if(cardResp.data.remaining === 0) throw new Error('No cards remaining!');
      
      let card = cardResp.data.cards[0];
      
      setDrawnCards(drawnCards => [
        ...drawnCards, { 
          id: card.code,
          image: card.image,
          name: `${card.value} ${card.suit}`
        }
      ]);
    } 
    catch(err) {
      alert(err);
    }
  }
  
  function renderButton() {
    if (!deck) return null;
    return(
      <button onClick={draw}>
        Draw A Card
      </button>
    );
  }

  return (
  <div className="board"> 
      { renderButton() }
    <div className="cards">
      {drawnCards.map(card => (
        <Card key={card.id} image={card.image} name={card.name}/>
        ))}
    </div>
  </div>
  );
}

export default Deck;