//Operadoes usados na operacao
const OPS = ['^', 'v', '~', '>']

//Define se um valor e ou nao um operador
const IsOperator = (symbol) => {
    return OPS.includes(symbol)
}

//Recebe a expressao como uma pilha com os operadores e valores. Ex. exp = [">","~","A","B"] => ~A>B(Notacao normal) = >~AB(Notacao polonesa)
const Calculate = (expressionStack, variableValues, number) => {
    console.log(variableValues)
    let item = expressionStack.shift()
    let result
    if (!IsOperator(item))
        return variableValues[item]
    else{
        switch(item){
            case "^":
                return (Calculate(expressionStack, variableValues, 1) && Calculate(expressionStack, variableValues, 2))
            case "v":
                return (Calculate(expressionStack, variableValues, 1) || Calculate(expressionStack, variableValues, 2))
            case "~":
                return !Calculate(expressionStack, variableValues)
            case ">":
                return (!Calculate(expressionStack, variableValues) || Calculate(expressionStack, variableValues))
            default:
                console.log('Símbolo não reconhecido')
        }
    }
    return result
}

export default Calculate;