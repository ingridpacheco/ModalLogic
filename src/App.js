import React, { Component } from 'react';
import logo from './pictures/bg-index.jpg';
import grafo from './pictures/graph.png';
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
} from '@material-ui/core';
import Graph from './graph'
import './App.css';

let Logicresult = ''
export function parseExpression(exp){
  let item = exp.shift()
  if (item !== undefined){
    if (item === '('){
      let oldResult = Logicresult
      Logicresult = ''
      parseExpression(exp)
      let newOrder = Logicresult
      Logicresult = oldResult
      Logicresult = Logicresult.concat(newOrder)
      parseExpression(exp)
    }
    if (item === '['){
      Logicresult = Logicresult.concat(item)
      let oldResult = Logicresult
      Logicresult = ''
      parseExpression(exp)
      let newOrder = Logicresult
      Logicresult = oldResult
      Logicresult = Logicresult.concat(newOrder)
      parseExpression(exp)
    }
    else {
      if (item === ']'){
        Logicresult = Logicresult.concat(item)
      }
      else{
        if (item !== ')' && item !== '('){
          if (['➡','^','V'].includes(item)){
            Logicresult = item.concat(Logicresult)
            parseExpression(exp)
          }
          else{
            Logicresult = Logicresult.concat(item)
            parseExpression(exp)
          }
        }
      }
    }
  }
  else{
    return Logicresult
  }
}

function createGraph(graph, vertices, rootNode){
  for (let i = 0; i < vertices.length; i++){
    graph.addVertex(vertices[i])
  }

  graph.addEdge('012', '021','X'); 
  graph.addEdge('012', '102','Z'); 
  graph.addEdge('012', '210','Y');
  graph.addEdge('021', '201','Z');
  graph.addEdge('021', '120','Y');
  graph.addEdge('102', '120','X');
  graph.addEdge('102', '201','Y');
  graph.addEdge('120', '210','Z');
  graph.addEdge('201', '210','X');
  graph.setRootNode(rootNode)
  return graph
}

class App extends Component {
  constructor(){
    super()
    this.state ={
      logic: "",
      result: "",
      variables: [],
      rootNode: '012',
      vertices: ['012','021','102','120','201','210'],
      graph: new Graph()
    }
  }

  componentDidMount(){
    let {graph, vertices, rootNode} = this.state
    this.setState(createGraph(graph, vertices, rootNode))
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
    let operations = ['V','^','➡','!','<','>','[',']','K','B']
    let agents = ['X','Y','Z']
    let result = []
    let variables = []

    let arrayLogic = []
    for (let i = 0; i < logic.length; i++)
      arrayLogic.push(logic[i])

    parseExpression(arrayLogic)
    logic = Logicresult
    Logicresult = ''

    for (let i = 0; i < logic.length; i++){
      if (!operations.includes(logic[i]) && !agents.includes(logic[i]) && !variables.includes(logic[i])){
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

  clearGraph = (graph) => {
    graph.clearGraph()
  }

  clear = () => {
    let { graph } = this.state 
    let vertices = ['012','021','102','120','201','210']
    let rootNode = '012'
    this.clearGraph(graph)
    this.setState({logic: "", result:""})
    this.setState(createGraph(graph, vertices, rootNode))
  }

  render() {
    let {vertices} = this.state
    return (
      <div className="App" style={{backgroundColor: '#efeeee'}}>
        <div className="crop">
          <img src={logo} alt="logProg"/>
        </div>
        <Divider variant="middle" />
        <h2>Trabalho de Lógica em Programação</h2>
        <Paper elevation={2} style={{paddingTop: 20, paddingBottom: 20}}>
          <div style={{display: 'inline-grid'}}>
          <FormLabel component="legend" style={{textAlign: 'left', fontSize: 14, paddingLeft: 15}}>Grafo Inicial</FormLabel>
          <img src={grafo} alt="grafo" style={{width: 200}}/>
          <FormLabel component="legend" style={{textAlign: 'left', fontSize: 14, paddingLeft: 15}}>Agentes</FormLabel>
          <p style={{textAlign: "left", fontWeight: "bold"}}>{'X, Y e Z'}</p>
              <FormControl component="fieldset">
                <FormLabel component="legend" style={{textAlign: 'left', fontSize: 14, paddingLeft: 15}}>Estado Correto</FormLabel>
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
            <p style={{textAlign: "left", fontWeight: "bold"}}>{'0, 1, e 2 são os símbolos proposicionais'}</p>
            <p style={{textAlign: "left", fontWeight: "bold"}}>{'v, ^, ➡, !, K, B e [] são as operações possíveis'}</p>
            <TextField
              id="logic"
              label="Anúncio"
              onChange={this.handleChange}
              value={this.state.logic}
              margin="normal"
              variant="outlined"
              style={{marginRight: 50, marginLeft: 10}}
            />
            <div>
              <Button variant="contained" color="default" style={{marginTop: 25, maxWidth: 380}} onClick={this.getResult}>
                VERIFICAR RESULTADO
              </Button>
              <Button variant="contained" color="default" style={{marginTop: 25, maxWidth: 380}} onClick={this.clear}>
                RECOMEÇAR
              </Button>
            </div>
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
