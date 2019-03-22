import math

#Operadoes usados na operacao
OPS = {'^', '|', '~', '>'}

#Valores das variaveis usadas na linguagem
VALUE = {'A':True, 'B':False, 'C':False}


#TODO ------------------------- 
def ParseExpression(expressionString):
    expressionString = []
    return expressionStack



#Define se um valor e ou nao um operador
def IsOperator(simbol):
    return simbol in OPS

#Recebe a expressao como uma pilha com os operadores e valores. Ex. exp = [">","~","A","B"] => ~A>B(Notacao normal) = >~AB(Notacao polonesa)
def Calculate(expressionStack):

    item = expressionStack.pop(0)

    print item

    if not IsOperator(item):
        return VALUE[item]
    elif item == '^':
        return Calculate(expressionStack) and Calculate(expressionStack)
    elif item == '|':
        return Calculate(expressionStack) or Calculate(expressionStack)
    elif item == '~':
        return not Calculate(expressionStack)
    elif item == '>':
        return not Calculate(expressionStack) or Calculate(expressionStack)          



if __name__== "__main__":

    exp = [">","~","A","B"]
    print(str(exp))
    print(str(Calculate(exp)))

