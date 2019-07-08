import { changeGraph } from './changeGraph'

//Operadoes usados na operacao
// ^ -> e
// V -> ou
// ➡ -> implica
// ~ -> not
// Ka -> para todo vizinho que tem o agente 'a' (na aresta de ligação)
// Ba -> algum vizinho que tem o agente 'a' (na aresta de ligação)
// [] -> anúncio público
// const OPS = ['^', 'V', '~', '➡', '[','K','B']
const OPS = ['^', 'V', '!', '➡', 'K','B','[']

//Define se um valor e ou nao um operador
const IsOperator = (symbol) => {
    return OPS.includes(symbol)
}

//Recebe a expressao como uma pilha com os operadores e valores. Ex. exp = ["➡","~","A","B"] => ~A➡B(Notacao normal) = ➡~AB(Notacao polonesa)
const Calculate = (expressionStack, graph) => {
    let item = expressionStack.shift()
    let resultVar1
    let resultVar2
    if (!IsOperator(item)){
        const rootNode = graph.getRootNode()
        let agent = expressionStack.shift()
        let symbolAgent = item.concat(agent)
        return graph.symbolInState(rootNode, symbolAgent)
    }
    else{
        switch(item){
            case "[":
                let publicAnnouncement = []
                let quantity = expressionStack.length
                for (let i = 0; i < quantity; i++){
                    let letter = expressionStack.shift()
                    if (letter === "]"){
                        break;
                    }
                    publicAnnouncement.push(letter)
                }
                let states = changeGraph(graph, publicAnnouncement)
                if (states.length !== 0){
                    let allStates = graph.getStates()
                    let keys = allStates.keys()
                    let difference = []
                    for (let j = 0; j < allStates.size; j++){
                        let value = keys.next().value
                        if (states.indexOf(value) === -1){
                            difference.push(value)
                        }
                    }
                    if (difference.includes(graph.getRootNode())){
                        alert("ISSO NÃO É VERDADE");
                    }
                    else{
                        graph.removeStates(difference)
                    }
                }
                if (expressionStack.length === 0){
                    return new Error("Não tem o que validar")
                }
                return Calculate(expressionStack, graph)
            case "K":
                let expression1 = []
                for (let j = 0; j < expressionStack.length; j++){
                    expression1.push(expressionStack[j])
                }
                const rootNode1 = graph.getRootNode()
                let symbol1 = expression1.shift()
                const adjacents1 = graph.getAdjacents(rootNode1,symbol1)
                expressionStack.shift()
                if (adjacents1.length === 0){
                    return Calculate(expressionStack, graph)
                }
                for (let i = 0; i < adjacents1.length; i++){
                    if (!Calculate(expressionStack, graph)){
                        return false
                    }
                    expressionStack = expression1
                    graph.setRootNode(adjacents1[i])
                    if (!Calculate(expressionStack, graph)){
                        graph.setRootNode(rootNode1)
                        return false
                    }
                    if (i !== adjacents1.length)
                        expressionStack = expression1
                }
                graph.setRootNode(rootNode1)
                return true
            case "B":
                let expression2 = []
                for (let j = 0; j < expressionStack.length; j++){
                    expression2.push(expressionStack[j])
                }
                const rootNode2 = graph.getRootNode()
                let symbol2 = expression2.shift()
                const adjacents2 = graph.getAdjacents(rootNode2,symbol2)
                expressionStack.shift()
                if (adjacents2.length === 0){
                    return Calculate(expressionStack, graph)
                }
                for (let i = 0; i < adjacents2.length; i++){
                    if (Calculate(expressionStack, graph)){
                        return true
                    }
                    expressionStack = expression2
                    graph.setRootNode(adjacents2[i])
                    if (Calculate(expressionStack, graph)){
                        graph.setRootNode(rootNode2)
                        return true
                    }
                    if (i !== adjacents2.length)
                        expressionStack = expression2
                }
                graph.setRootNode(rootNode2)
                return false
            case "^":
                resultVar1 = Calculate(expressionStack, graph)
                resultVar2 = Calculate(expressionStack, graph)
                return resultVar1 && resultVar2
            case "V":
                resultVar1 = Calculate(expressionStack, graph) 
                resultVar2 = Calculate(expressionStack, graph)
                return resultVar1 || resultVar2
            case "!":
                return !Calculate(expressionStack, graph)
            case "➡":
                resultVar1 = !Calculate(expressionStack, graph)
                resultVar2 = Calculate(expressionStack, graph)
                return resultVar1 || resultVar2
            default:
        }
    }
}

export default Calculate;