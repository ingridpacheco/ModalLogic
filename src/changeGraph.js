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

//Retorna os estados resultantes do anúncio
export const changeGraph = (graph, publicAnnouncement) => {
    let item = publicAnnouncement.shift()
    let states1 = [] 
    let states2 = []
    if (!IsOperator(item)){
        let agent = publicAnnouncement.shift()
        let symbolAgent = item.concat(agent)
        return graph.getSymbolStates(symbolAgent)
    }
    switch(item){
        case '!':
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
                return difference
            }
            break
        case 'V':
            let finalStatesAnd = []
            states1 = changeGraph(graph, publicAnnouncement)
            states2 = changeGraph(graph, publicAnnouncement)
            for (let i = 0; i < states1.length; i++){
                if (!states2.includes(states1[i]))
                    finalStatesAnd.push(states1[i])
            }
            finalStatesAnd = finalStatesAnd.concat(states2)
            return finalStatesAnd

        case '^':
            let finalStatesOr = []
            states1 = changeGraph(graph, publicAnnouncement)
            states2 = changeGraph(graph, publicAnnouncement)
            for (let i = 0; i < states1.length; i++){
                if (states2.includes(states1[i]))
                    finalStatesOr.push(states1[i])
            }
            for (let l = 0; l < states2.length; l++){
                if (states1.includes(states2[l]) && !finalStatesOr.includes(states2[l]))
                    finalStatesOr.push(states2[l])
            }
            return finalStatesOr

        case '➡':
            let finalStatesImp = []
            publicAnnouncement = ['!'].concat(publicAnnouncement)
            states1 = changeGraph(graph, publicAnnouncement)
            states2 = changeGraph(graph, publicAnnouncement)
            for (let i = 0; i < states1.length; i++){
                if (!states2.includes(states1[i]))
                    finalStatesImp.push(states1[i])
            }
            finalStatesImp = finalStatesImp.concat(states2)
            return finalStatesImp
        case 'K':
            let expression1 = []
            let finalStatesK = []
            for (let j = 0; j < publicAnnouncement.length; j++){
                expression1.push(publicAnnouncement[j])
            }
            const rootNode1 = graph.getRootNode()
            let symbol1 = expression1.shift()
            states1 = changeGraph(graph, expression1)
            const adjacents1 = graph.getAdjacents(rootNode1,symbol1)
            publicAnnouncement.shift()
            if (adjacents1.length === 0){
                if (states1.includes(rootNode1)){
                    return [rootNode1]
                }
                return []
            }
            if (!(states1.includes(rootNode1))){
                return []
            }
            finalStatesK.push(rootNode1)
            for (let i = 0; i < adjacents1.length; i++){
                if (!(states1.includes(adjacents1[i]))){
                    return []
                }
                finalStatesK.push(adjacents1[i])
            }
            return finalStatesK
        case 'B':
            let expression2 = []
            let finalStatesB = []
            for (let j = 0; j < publicAnnouncement.length; j++){
                expression2.push(publicAnnouncement[j])
            }
            const rootNode2 = graph.getRootNode()
            let symbol2 = expression2.shift()
            states1 = changeGraph(graph, expression2)
            const adjacents2 = graph.getAdjacents(rootNode2,symbol2)
            publicAnnouncement.shift()
            if (adjacents2.length === 0){
                return []
            }
            if (states1.includes(rootNode2)){
                finalStatesB.push(rootNode2)
            }
            for (let i = 0; i < adjacents2.length; i++){
                if (states1.includes(adjacents2[i])){
                    finalStatesB.push(adjacents2[i])
                }
            }
            return finalStatesB
        default:
            return graph
    }

    return graph
}