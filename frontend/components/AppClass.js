import React from 'react'

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
const x =2
const y=2
const initialx = 2
const initialy=2

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
  x: initialx,
  y: initialy
}

export default class AppClass extends React.Component {
  constructor(){
    super()
    this.state= {
      message: initialMessage,
      x: 2,
      y: 2,
      steps: initialSteps,
      index: initialIndex,
      formValues: ''
    }
  }

  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  getXY = () => {
    return(`(${this.state.x},${this.state.y})`);

    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  }

  getXYMessage = () => {
    return(`Coordinates ${getXY()}`);
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  }

  reset = () => {
    this.setState({
      x: 2,
      y: 2,
      steps: initialSteps,
      message: initialMessage,
      index: initialIndex,
      formValues: ''
    })    
    // Use this helper to reset all states to their initial values.
  }

  getNextIndex = (direction) => {

    if(direction === 'up'){
      if(this.state.y === 1){
        return this.setState({message: `You can't go up`})
      }
      return (this.setState({...this.state,
        message: initialMessage,
        x: this.state.x,
        y: this.state.y-1,
        steps: this.state.steps+1,
        index: this.state.index-3}))
    }
    if(direction === 'right'){
      if(this.state.x === 3){
        return this.setState({message: `You can't go right`})
      }
      return (this.setState({...this.state,
        message: initialMessage,
        x: this.state.x+1,
        y: this.state.y,
        steps: this.state.steps+1,
        index: this.state.index+1}))
    }  
    if(direction === 'down'){
      if(this.state.y === 3){
        return this.setState({message: `You can't go down`})
      }
      return (this.setState({...this.state,
        message: initialMessage,
        x: this.state.x,
        y: this.state.y+1,
        steps: this.state.steps+1,
        index: this.state.index+3}))    
    }
    if(direction === 'left'){
      if(this.state.x === 1){
        return this.setState({message: `You can't go left`})
      }
      else return (this.setState({...this.state,
        message: initialMessage,
        x: this.state.x-1,
        y: this.state.y,
        steps: this.state.steps+1,
        index: this.state.index-1}))
    }  
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
  }

  move = (evt) => {
    let currentMove = this.getNextIndex(evt.target.id)
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
  }

  onChange = (evt) => {
    this.setState({formValues: evt.target.value})
    // You will need this to update the value of the input.
  }

  validate = (name,value) => {
    yup.reach(formSchema, name)
      .validate(value)
      .then(() => this.post())
      .catch(err => this.setState({message:err.errors[0]}))
  }

  post = () => {
    const toSend = {
      "x": this.state.x,
      "y": this.state.y,
      "steps": this.state.steps,
      "email": this.state.formValues
    }
    axios.post('http://localhost:9000/api/result', toSend)
      .then(({data}) => {this.setState({message: data.message})})
      .finally(this.setState({formValues: ''}))
  }

  onSubmit = (evt) => {
    evt.preventDefault()
    this.validate('formValue', this.state.formValues)
    
    // Use a POST request to send a payload to the server.
  }

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">/{`Coordinates (${this.state.x},${this.state.y})`}</h3>
          <h3 id="steps">{`You moved ${this.state.steps} ${this.state.steps === 1 ? 'time' : 'times'}`}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
        <button id="left" onClick={(e) => this.getNextIndex('left')}>LEFT</button>
          <button id="up" onClick={(e) => this.getNextIndex(e.target.id)}>UP</button>
          <button id="right" onClick={(e) => this.getNextIndex(e.target.id)}>RIGHT</button>
          <button id="down" onClick={(e) => this.getNextIndex(e.target.id)}>DOWN</button>
          <button id="reset" onClick={(e) => this.reset()}>reset</button>
        </div>
        <form onSubmit={(e) => this.onSubmit(e)}>
          <input id="email" type="email" placeholder="type email" value={this.state.formValues} onChange={(e) => this.onChange(e)}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
