import {useState, useEffect } from 'react';
import Card from './Card';
import axios from 'axios';

const API_URL = 'https://deckofcardsapi.com/api/deck';

function Deck() {
  const [deck, setDeck] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);

  const [isShuffled, setIsShuffled] = useState(false);


  
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

  useEffect(function shuffleDeck() {
    async function shuffle(deck) {
      changeShuffleState()
      ////update deck state in request to the api with setter.
      await axios.get(`${API_URL}/${deck.deck_id}/shuffle`)
      //return to initial states(setDrawn and setShuffled) after shuffling.
      setIsShuffled(false);
      //Set to an empty array for display purposes.
      setDrawnCards([])
    }
    if (isShuffled && deck) shuffle(deck);
  }, [isShuffled, deck]);

  
  function changeShuffleState() {
    setIsShuffled(true);
  }  
  
  function renderButton() {
    if (!deck) return null;
    return(
      <button onClick={draw}>
        Draw A Card
      </button>
    );
  }

  function shuffleButton() {
    if (!deck) return null;
    return(
      <button onClick={changeShuffleState}>
        Shuffle the Deck.
      </button>
    );
  }

  return (
  <div className="board"> 
      { renderButton() }
      { shuffleButton() }
    <div className="cards">
      {drawnCards.map(card => (
        <Card key={card.id} image={card.image} name={card.name}/>
        ))}
    </div>
  </div>
  );
}

export default Deck;