import React, { useState } from 'react'

import axios from 'axios'

import * as yup from 'yup'

const formSchema = yup.object().shape({
  formValue: yup
    .string()
    .email('Ouch: email must be a valid email')
    .required('Ouch: email is required')
    .notOneOf(['foo@bar.baz'],'foo@bar.baz failure #71')
})

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at




export default function AppFunctional(props) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [x, setX] = useState(2);
  const [y, setY] = useState(2);

  const [currentSteps, setCurrentSteps] = useState(initialSteps);

  const [currentMessage, setCurrentMessage] = useState(initialMessage)

  const [formValue, setFormValue] = useState('');
  
  
  function getXY() {
    return (`(${this.state.x},${this.state.y})`);    
  }

  function getXYMessage() {
    return (`Coordinates ${x},${y}`);
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  function reset() {
    setCurrentIndex(initialIndex);
    setX(2);
    setY(2);

    setCurrentMessage(initialMessage);
    setCurrentSteps(0);

    setFormValue('')
    // Use this helper to reset all states to their initial values.
  }

  function getNextIndex(direction) {
    if(direction === 'up'){
      if(y === 1){
        setCurrentMessage("You can't go up");
        return currentIndex;
      }
      setCurrentIndex(currentIndex-3);
      setY(y-1);
      setCurrentSteps(currentSteps+1);

      setCurrentMessage(initialMessage);
    }

    if(direction === 'right'){
      if(x === 3){
        setCurrentMessage("You can't go right");
        return currentIndex;
      }
      setCurrentIndex(currentIndex+1);
      setX(x+1);
      setCurrentSteps(currentSteps+1);

      setCurrentMessage(initialMessage);
    }

    if(direction === 'down'){
      if(y === 3){
        setCurrentMessage("You can't go down");
        return currentIndex;
      }
      setCurrentIndex(currentIndex+3);
      setY(y+1);
      setCurrentSteps(currentSteps+1);

      setCurrentMessage(initialMessage);
    }

    if(direction === 'left'){
      if(x === 1){
        setCurrentMessage("You can't go left");
        return(currentIndex);
      }
      setCurrentIndex(currentIndex-1);
      setX(x-1);
      setCurrentSteps(currentSteps+1);

      setCurrentMessage(initialMessage);
    }
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  function move(evt) {
    getNextIndex(evt);
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  function onChange(evt) {
    setFormValue(evt.target.value);

    // You will need this to update the value of the input.
  }

  const validate = (name,value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => post())
      .catch(err => setCurrentMessage(err.errors[0]))
  }

  function onSubmit(evt) {
    evt.preventDefault()
    validate('formValue', formValue);

    // Use a POST request to send a payload to the server.
  }

  function post(){
    const toSend = {
      "x": x,
      "y": y,
      "steps": currentSteps,
      "email": formValue
    }
    axios.post('http://localhost:9000/api/result', toSend)
      .then(({data}) => {setCurrentMessage(data.message)})
      .finally(setFormValue(''))
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{`Coordinates (${x},${y})`}</h3>
        <h3 id="steps">{`You moved ${currentSteps} ${currentSteps === 1 ? 'time' : 'times'}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === currentIndex ? ' active' : ''}`}>
              {idx === currentIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{currentMessage}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={(e) => move(e.target.id)}>LEFT</button>
        <button id="up" onClick={(e) => move(e.target.id)}>UP</button>
        <button id="right" onClick={(e) => move(e.target.id)}>RIGHT</button>
        <button id="down" onClick={(e) => move(e.target.id)}>DOWN</button>
        <button id="reset" onClick={(e) =>reset()}>reset</button>
      </div>
      <form onSubmit={(e) => onSubmit(e)}>
        <input id="email" type="text" placeholder="type email" value={formValue} onChange={(e) => onChange(e)}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
