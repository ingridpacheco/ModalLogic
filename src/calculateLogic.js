//Operadoes usados na operacao
const OPS = ['^', 'V', '~', '>']

//Define se um valor e ou nao um operador
const IsOperator = (symbol) => {
    return OPS.includes(symbol)
}

//Recebe a expressao como uma pilha com os operadores e valores. Ex. exp = [">","~","A","B"] => ~A>B(Notacao normal) = >~AB(Notacao polonesa)
const Calculate = (expressionStack, variableValues) => {
    let item = expressionStack.shift()
    let resultVar1
    let resultVar2
    if (!IsOperator(item))
        return variableValues[item]
    else{
        switch(item){
            case "^":
                resultVar1 = Calculate(expressionStack, variableValues)
                resultVar2 = Calculate(expressionStack, variableValues)
                return resultVar1 && resultVar2
            case "V":
                resultVar1 = Calculate(expressionStack, variableValues) 
                resultVar2 = Calculate(expressionStack, variableValues)
                return resultVar1 || resultVar2
            case "~":
                return !Calculate(expressionStack, variableValues)
            case ">":
                resultVar1 = !Calculate(expressionStack, variableValues)
                resultVar2 = Calculate(expressionStack, variableValues)
                return resultVar1 || resultVar2
            default:
                console.log('Símbolo não reconhecido')
        }
    }
}

export default Calculate;