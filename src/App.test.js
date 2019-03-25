import React from 'react';
import ReactDOM from 'react-dom';
import App, {parseExpression} from './App';
import {expect} from 'chai'

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('parseExpression', () => {
  it('renders variable if it only have this', () => {
    expect(parseExpression("A")).to.equal("A")
  })
  it('renders symbol before variable if negation of variable', () => {
    expect(parseExpression('~A')).to.equal('~A')
  })
  it('renders symbol before variables if simple expression', () => {
    expect(parseExpression('AvB')).to.equal('vAB')
    expect(parseExpression('AvB^C')).to.equal('^vABC')
  })
  it('renders negation symbol before variable', () => {
    expect(parseExpression('Av~B',[],[])).to.equal('vA~B')
    expect(parseExpression('Av~B^C',[],[])).to.equal('^vA~BC')
  })
  it('renders symbols in order of precedent(parenthesis)', () => {
    expect(parseExpression('(A)')).to.equal('A')
    expect(parseExpression('(AvB)')).to.equal('vAB')
  })
  it('renders symbols in order of precedent(parenthesis)', () => {
    // (A v B) ^ C => ^vABC
    expect(parseExpression('(AvB)^C')).to.equal('^vABC')
    expect(parseExpression('(AvB)^~C',[],[])).to.equal('^vAB~C')
  })
  it('renders symbols in order of precedent(parenthesis)', () => {
    // C ^ (A v B) => ^CvAB
    expect(parseExpression('C^(AvB)',[],[])).to.deep.equal('^CvAB')
  })
})
