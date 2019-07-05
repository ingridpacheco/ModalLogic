import React, { Component } from 'react';
import logo from './bg-index.jpg';
import grafo from './graph.png';
import Calculate from './calculateLogic';
import { 
  Divider,
  FormControl,
  Button,
  TextField,
  Paper,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox
} from '@material-ui/core';
import './App.css';

class Graph {
  constructor(){
      this.AdjList = new Map();
      this.EdgeLabel = new Map();
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

  addEdge(v, w, agent){ 
    this.AdjList.get(v).push(w);
    this.addAgent(v,w,agent)
  }

  addAgent(v,w,agent){
    let edge = v.concat(w)
    this.EdgeLabel.set(edge,agent)
  }

  addLetter(v, letter){
    this.LetterList.get(v).push(letter)
  }

  removeLetter(v, letter){
    let index = this.LetterList.get(v).indexOf(letter)
    this.LetterList.get(v).splice(index,1)
  }

  getAgent(v,w,letter){
    let edge = v.concat(w)
    if (this.EdgeLabel.get(edge) !== letter){
      return false
    }
    return true
  }

  getAdjacents(v, letter){
    let adj = this.AdjList.get(v)
    let correctAdj = []
    for (let i = 0; i < adj.length; i++){
      if (this.getAgent(v,adj[i],letter))
        correctAdj.push(adj[i])
    }
    return correctAdj
  }

  letterinList(v,letter){
    return this.LetterList.get(v).includes(letter)
  }

  printGraph(){ 
      var get_keys = this.AdjList.keys(); 
    
      for (var i of get_keys)  
      { 
          var get_values = this.AdjList.get(i);
          var get_letters = this.LetterList.get(i);
          var conc = "";
          var letters = "";
    
          for (var j of get_values)
            conc += j + " ";
            
          for (var k of get_letters)
            letters += k + " ";
    
          console.log(i + " -> " + conc + " -> " + letters); 
      } 
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
      variables: [],
      rootNode: 's1',
      vertices: ['s1','s2','s3','s4','s5'],
      graph: new Graph()
    }
  }

  componentDidMount(){
    let {graph} = this.state
    graph.addVertex('s1')
    graph.addVertex('s2')
    graph.addVertex('s3')
    graph.addVertex('s4')
    graph.addVertex('s5')
    graph.addEdge('s1', 's2','X'); 
    graph.addEdge('s1', 's3','Z'); 
    graph.addEdge('s2', 's4','Y');
    graph.addEdge('s3', 's5','Z');
    graph.addEdge('s4', 's5','X');
    graph.setRootNode('s1')
    this.setState({graph})
  }

  handleChange = event => {
    this.setState({
      logic: event.target.value,
      result: ""
    });
  };

  getResult = () => {
    let logic = this.state.logic.replace(/ /g,'').toUpperCase()
    let {graph} = this.state
    let result = []
    let variables = []

    logic = parseExpression(logic)

    for (let i = 0; i < logic.length; i++){
      if (!['V','^','➡','~','<','>','[',']','X','Y','Z','K','B'].includes(logic[i]) && !variables.includes(logic[i])){
        variables.push(logic[i])
      }
      result.push(logic[i])
    }

    this.setState({
      result: Calculate(result, graph),
      variables
    });
  }

  changeRootNode = event => {
    let rootNode = event.target.value
    let {graph} = this.state
    graph.setRootNode(rootNode)
    this.setState({
      rootNode,
      graph
    })
  }

  changeLetters = (letter, vertice) => event => {
    let {graph} = this.state
    !graph.letterinList(vertice, letter) ? graph.addLetter(vertice, letter) :
      graph.removeLetter(vertice, letter)
    this.setState({
      graph
    })
  }

  render() {
    let {vertices, variables, graph} = this.state
    return (
      <div className="App" style={{backgroundColor: '#efeeee'}}>
        <div className="crop">
          <img src={logo} alt="logProg"/>
        </div>
        <Divider variant="middle" />
        <h2>Trabalho de Lógica em Programação</h2>
        <Paper elevation={2} style={{paddingTop: 20, paddingBottom: 20}}>
          <div style={{display: 'inline-grid'}}>
          <FormLabel component="legend" style={{textAlign: 'left', fontSize: 14, paddingLeft: 15}}>Grafo</FormLabel>
          <img src={grafo} alt="grafo" style={{width: 380}}/>
          <FormLabel component="legend" style={{textAlign: 'left', fontSize: 14, paddingLeft: 15}}>Agentes</FormLabel>
          <p style={{textAlign: "left", fontWeight: "bold"}}>{'X, Y e Z'}</p>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{textAlign: 'left', fontSize: 14, paddingLeft: 15}}>Nó Raiz</FormLabel>
                <RadioGroup
                  aria-label="rootNode"
                  name="rootNode"
                  style={{paddingLeft: 20}}
                  value={this.state.rootNode}
                  onChange={this.changeRootNode}
                  row
                >
                  {vertices.map(item => (
                    <FormControlLabel
                      key={item}
                      value={item}
                      control={<Radio color="primary"/>}
                      label={item}
                      labelPlacement="end"
                    />
                  ))}
                </RadioGroup>
              </FormControl>
              {variables.map(item => (
                <Paper key={item} elevation={2} style={{paddingTop: 20, paddingBottom: 20}}>
                  <FormLabel component="legend" style={{textAlign: 'left', fontSize: 14, paddingLeft: 15}}>Vértices que tem {item}:</FormLabel>
                  <FormGroup row style={{paddingLeft: 15}}>
                    {vertices.map(vertice => (
                      <FormControlLabel
                        key={vertice}
                        control={
                          <Checkbox
                            checked={graph.letterinList(vertice, item)}
                            onChange={this.changeLetters(item, vertice)}
                            value={vertice}
                          />
                        }
                        label={vertice}
                      />
                    ))}
                  </FormGroup>
                </Paper>
            ))}
            <p style={{textAlign: "left", fontWeight: "bold"}}>{'Não utilize as letras x, y, z, k e b na lógica como símbolos proposicionais'}</p>
            <TextField
              id="logic"
              label="Lógica"
              onChange={this.handleChange}
              margin="normal"
              variant="outlined"
              style={{marginRight: 50, marginLeft: 10}}
            />
            {/* <p>{`Use v para 'ou',
            ^ para 'e',
            ➡ para 'implica',
            ~ para 'negação',`}</p>
            <p>{`[]a para 'para todo vizinho que contém o agente 'a' na aresta de ligação' e
            <>a para 'existe um vizinho entre os que contém o agente 'a' na aresta de ligação'`}</p> */}
            <Button variant="contained" color="default" style={{marginTop: 25, maxWidth: 380}} onClick={this.getResult}>
              VERIFICAR RESULTADO
            </Button>
            <TextField
              error
              disabled
              id="result"
              label="Resultado"
              style={{width: 320, marginLeft: 10}}
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
