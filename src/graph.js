export default class Graph {
    constructor(){
        this.AdjList = new Map();
        this.EdgeLabel = new Map();
        this.SymbolList = new Map();
        this.rootNode = '';
    }
  
    setRootNode(v){
      this.rootNode = v;
    }
  
    getRootNode(){
      return this.rootNode
    }

    clearGraph(){
      this.AdjList.clear()
      this.EdgeLabel.clear()
      this.SymbolList.clear()
    }

    addSymbol(symbol, agent, v){
      let symbolAgent
      switch(agent){
        case 0:
            symbolAgent = symbol.concat('X')
            break
        case 1:
          symbolAgent = symbol.concat('Y')
          break
        case 2:
          symbolAgent = symbol.concat('Z')
          break
        default:
          symbolAgent = symbol
      }
      if (this.SymbolList.get(symbolAgent) === undefined){
        this.SymbolList.set(symbolAgent, [])
      }
      this.SymbolList.get(symbolAgent).push(v)
    }

    addVertex(v){
      this.AdjList.set(v, []);
      for (let i = 0; i < v.length; i++)
        this.addSymbol(v[i], i, v)
    }
  
    addEdge(v, w, agent){
      this.AdjList.get(v).push(w);
      this.AdjList.get(w).push(v);
      this.addAgent(v,w,agent)
    }
  
    addAgent(v,w,agent){
      let edge = v.concat(w)
      this.EdgeLabel.set(edge,agent)
    }

    getAgent(v,w,letter){
      let edge = v.concat(w)
      let edge2 = w.concat(v)
      if ((this.EdgeLabel.get(edge) !== letter) && (this.EdgeLabel.get(edge2) !== letter)){
        return false
      }
      return true
    }

    getStates(){
      return this.AdjList
    }

    removeStateFromSymbol(state){
      let keys = this.SymbolList.keys();
      let counter = 0
      while (counter < this.SymbolList.size){
        let values = this.SymbolList.get(keys.next().value)
        if (values.includes(state)){
          let index = values.indexOf(state)
          values.splice(index, 1)
        }
        counter++
      }
    }

    removeStateFromEdge(state){
      let adj = this.AdjList.get(state)
      for (let i = 0; i < adj.length; i++){
        this.EdgeLabel.delete(state.concat(adj[i]))
        this.EdgeLabel.delete(adj[i].concat(state))
      }
      let keys = this.AdjList.keys();
      let counter = 0
      while (counter < this.AdjList.size){
        let values = this.AdjList.get(keys.next().value)
        if (values.includes(state)){
          let index = values.indexOf(state)
          values.splice(index, 1)
        }
        counter++
      }
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
  
    symbolInState(v,symbolAgent){
      return this.SymbolList.get(symbolAgent).includes(v)
    }

    getSymbolStates(symbolAgent){
      return this.SymbolList.get(symbolAgent)
    }

    removeStates(states){
      let quantity = states.length
      let adj = {}
      for (let i = 0; i < quantity; i++){
        adj[states[i]] = this.AdjList.get(states[i])
      }
      for (let i = 0; i < quantity; i++){
        let state = states.shift()
        this.removeStateFromEdge(state)
        this.AdjList.delete(state)
        this.removeStateFromSymbol(state)
      }
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