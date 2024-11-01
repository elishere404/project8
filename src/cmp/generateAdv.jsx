import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dice from '../assets/icon-dice.svg';          
import pauseDesktop from '../assets/pattern-divider-desktop.svg'; 
import './adv.css';

const AdviceGenerator = () => {
  const [text, setText] = useState({ id: '', advice: 'Click the dice to get advice!' });
  const [loading, setLoading] = useState(false);
  const [errorCount, setErrorCount] = useState(0);  

  const censorInsult = (text) => {
    return text.replace(/(\b\w*fuck\w*\b|\b\w*shit\w*\b|\b\w*bitch\w*\b)/gi, '****');
  };

  const fetchInsult = async () => {
    try {
      const response = await axios.get('https://insult.mattbas.org/api/insult');
      const insult = censorInsult(response.data);
      setText({ id: '', advice: `${insult} for making that stupid error`});
    } catch (error) {
      setText({ id: '', advice: '...' });
    }
  };

  const handleFetchError = () => {
    const messages = [
      'Hwoops, something happened',
      'Oh for f*** sake man, when is the next error coming?',
      "Come ON, that's it, I won't be too nice the next time",
      "That's it, f*** off my site",
    ];

    if (errorCount < 4) {
      setText({ id: '', advice: messages[0] });
    } else if (errorCount === 4) {
      setText({ id: '', advice: messages[1] });
    } else if (errorCount === 5) {
      setText({ id: '', advice: messages[2] });
    } else if (errorCount === 6) {
      setText({ id: '', advice: messages[3] });
    } else {
      fetchInsult();
    }

    setErrorCount(errorCount + 1);  
  };

  const fetchAdvice = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.adviceslip.com/advice');
      const { id, advice } = response.data.slip;
      setText({ id, advice });
      setErrorCount(0);  
    } catch (error) {
      handleFetchError();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="container">
      <h1>Advice #{text.id}</h1>
      <p>{loading ? 'Loading...' : text.advice}</p>

      <img src={pauseDesktop} alt="Pause Icon" />

      <div>
        <button onClick={fetchAdvice} disabled={loading}>
          <img src={dice} alt="Get Advice Dice" className='diceImg'/>
        </button>
      </div>
    </div>
  );
};

export default AdviceGenerator;
