import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import logo from './bg-index.jpg';
import Calculate from './calculateLogic';
import Divider from '@material-ui/core/Divider';
import './App.css';

class Graph {
  constructor(){
      this.AdjList = new Map(); 
      this.LetterList = new Map();
      this.rootNode = '';
  }

  setRootNode(v){
    this.rootNode = v;
  }

  getRootNode(){
    return this.rootNode
  }

  addVertex(v){ 
      this.AdjList.set(v, []); 
      this.LetterList.set(v, []);
  }

  addEdge(v, w){ 
      this.AdjList.get(v).push(w);
  }

  addLetter(v, letter){
    this.LetterList.get(v).push(letter)
  }

  getAdjacents(v){
    return this.AdjList.get(v)
  }

  letterinList(v,letter){
    return this.LetterList.get(v).includes(letter)
  }
}

export function parseExpression(exp){
  let result = ''
  for (let i = 0; i < exp.length; i++){
    if (exp[i] === '('){
      let newExp = exp.slice(i+1, exp.length)
      let parenthesisExp = parseExpression(newExp)
      i += parenthesisExp.length + 1
      result = result.concat(parenthesisExp)
    }
    else {
      if (exp[i] === ')'){
        return result
      }
      if (['➡','^','V'].includes(exp[i]))
        result = exp[i].concat(result)
      else{
        result = result.concat(exp[i])
      }
    }
  }
  return result
}

class App extends Component {
  constructor(){
    super()
    this.state ={
      logic: "",
      result: "",
      quantity: 1,
      varValues: {
        A: false,
        B: false,
        C: false,
        D: false,
        E: false,
        F: false,
        G: false,
        H: false,
        I: false,
        J: false
      },
      variables: [],
    }
  }

  handleChange = event => {
    this.setState({
      logic: event.target.value,
      result: ""
    });
  };

  changeQuantity = event => {
    this.setState({
      quantity: event.target.value
    })
  }

  changeVariable = name => event => {
    let valuesCopy = Object.assign({}, this.state.varValues)
    valuesCopy[name] = event.target.value
    this.setState({varValues: valuesCopy})
  }

  getResult = () => {
    let logic = this.state.logic.replace(/ /g,'').toUpperCase()
    let quantity = 0
    let result = []
    let variables = []

    logic = parseExpression(logic)

    for (let i = 0; i < logic.length; i++){
      if (!['V','^','➡','~','<','>','[',']'].includes(logic[i]) && !variables.includes(logic[i])){
        variables.push(logic[i])
        quantity++;
      }
      result.push(logic[i])
    }

    var graph = new Graph(4); 
    var vertices = [ 's1', 's2', 's3', 's4']; 
      
    // adding vertices 
    for (var i = 0; i < vertices.length; i++) { 
        graph.addVertex(vertices[i]); 
    }

    graph.setRootNode('s1')
      
    // adding edges 
    graph.addEdge('s1', 's2'); 
    graph.addEdge('s1', 's3'); 
    graph.addEdge('s2', 's4');
    graph.addLetter('s1', 'A'); 
    graph.addLetter('s2', 'B'); 
    graph.addLetter('s3', 'A');
    graph.addLetter('s3', 'B');
    graph.addLetter('s4', 'A');

    this.setState({
      quantity,
      result: Calculate(result, graph),
      variables
    });
  }

  render() {
    return (
      <div className="App" style={{backgroundColor: '#efeeee'}}>
        <div className="crop">
          <img src={logo} alt="logProg"/>
        </div>
        <Divider variant="middle" />
        <h2>Trabalho de Lógica em Programação</h2>
        <Paper elevation={2} style={{paddingTop: 20, paddingBottom: 20}}>
          <div style={{display: 'inline-grid'}}>
            <TextField
              id="logic"
              label="Lógica"
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
              style={{marginRight: 50}}
            />
            <Button variant="contained" color="default" style={{marginTop: 25}} onClick={this.getResult}>
              Enviar
            </Button>
            <TextField
              error
              disabled
              id="result"
              label="Resultado"
              value={this.state.result}
              margin="normal"
              variant="outlined"
            />
          </div>
        </Paper>
      </div>
    );
  }
}

export default App;
