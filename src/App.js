import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import logo from './bg-index.jpg';
import Calculate from './calculateLogic';
import Divider from '@material-ui/core/Divider';
import './App.css';

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
      if (['>','^','V'].includes(exp[i]))
        result = exp[i].concat(result)
      else
        result = result.concat(exp[i])
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
      variables: ['A','B','C','D','E','F','G','H','I','J']
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
    const {varValues} = this.state
    let logic = this.state.logic.replace(/ /g,'').toUpperCase()
    let quantity = 0
    let result = []
    let variables = []

    logic = parseExpression(logic)

    for (let i = 0; i < logic.length; i++){
      if (!['V','^','>','~'].includes(logic[i]) && !variables.includes(logic[i])){
        variables.push(logic[i])
        quantity++;
      }
      result.push(logic[i])
    }
    console.log(result)

    this.setState({
      quantity,
      result: Calculate(result, varValues),
    });
  }

  render() {
    let variables = this.state.variables.slice(0,this.state.quantity)
    return (
      <div className="App" style={{backgroundColor: '#efeeee'}}>
        <div className="crop">
          <img src={logo} alt="logProg"/>
        </div>
        <Divider variant="middle" />
        <h2>Trabalho de Lógica em Programação</h2>
        <Paper elevation={2} style={{paddingTop: 20, paddingBottom: 20}}>
          <div style={{display: 'inline-grid'}}>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Valor das Variáveis</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                {variables.map(item => (
                  <FormControl required variant="outlined" style={{width: 100}} key={item}>
                    <InputLabel
                      ref={ref => {
                        this.InputLabelRef = ref;
                      }}
                      htmlFor="outlined-age-simple"
                      style={{bottom: 50, top: 'auto'}}
                    >
                      Valor de {item}
                    </InputLabel>
                    <Select
                      value={this.state.varValues[item]}
                      onChange={this.changeVariable(item)}
                      input={
                        <OutlinedInput
                          labelWidth={0}
                          name="age"
                          id="outlined-age-simple"
                        />
                      }
                    >
                      <MenuItem value={true}>True</MenuItem>
                      <MenuItem value={false}>False</MenuItem>
                    </Select>
                  </FormControl>
                ))}
              </ExpansionPanelDetails>
            </ExpansionPanel>
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
