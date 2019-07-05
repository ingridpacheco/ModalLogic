//Operadoes usados na operacao
// ^ -> e
// V -> ou
// ➡ -> implica
// ~ -> not
// []a -> para todo vizinho que tem o agente 'a' (na aresta de ligação)
// <>a -> algum vizinho que tem o agente 'a' (na aresta de ligação)
const OPS = ['^', 'V', '~', '➡', '[','<']

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
        return graph.letterinList(rootNode, item)
    }
    else{
        switch(item){
            case "[":
                expressionStack.shift()
                let expression1 = []
                for (let j = 0; j < expressionStack.length; j++){
                    expression1.push(expressionStack[j])
                }
                const rootNode1 = graph.getRootNode()
                const adjacents1 = graph.getAdjacents(rootNode1,expression1[0])
                expressionStack.shift()
                expression1.shift()
                if (adjacents1.length === 0){
                    Calculate(expressionStack, graph)
                    //sumidouro para todo é true
                    return false
                }
                for (let i = 0; i < adjacents1.length; i++){
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
            case "<":
                expressionStack.shift()
                let expression2 = []
                for (let j = 0; j < expressionStack.length; j++){
                    expression2.push(expressionStack[j])
                }
                const rootNode2 = graph.getRootNode()
                const adjacents2 = graph.getAdjacents(rootNode2,expression2[0])
                expressionStack.shift()
                expression2.shift()
                if (adjacents2.length === 0){
                    Calculate(expressionStack, graph)
                    return false
                }
                for (let i = 0; i < adjacents2.length; i++){
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
            case "~":
                return !Calculate(expressionStack, graph)
            case "➡":
                resultVar1 = !Calculate(expressionStack, graph)
                resultVar2 = Calculate(expressionStack, graph)
                return resultVar1 || resultVar2
            default:
                console.log('Símbolo não reconhecido')
        }
    }
}

export default Calculate;