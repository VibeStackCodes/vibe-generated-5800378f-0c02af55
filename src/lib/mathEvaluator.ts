export type EvalMode = 'standard' | 'scientific';

export type EvalResult = { result: number | null; error?: string };

function isNumberToken(t: string): boolean {
  if (!t) return false;
  return !Number.isNaN(Number(t));
}

export function evaluateTokens(tokens: string[], xValue: number = 0, mode: EvalMode = 'standard'): EvalResult {
  const functionsAllowed = mode === 'scientific';

  // Handle unary minus by inserting 0 when needed
  const tokensWithUnary: string[] = [];
  let prev: string | null = null;
  for (const t of tokens) {
    if (t === '') continue;
    if (t === '-' && (prev == null || ['+', '-', '*', '/', '^', '('].includes(prev))) {
      tokensWithUnary.push('0');
    }
    tokensWithUnary.push(t);
    prev = t;
  }

  const isNumber = (tok: string) => isNumberToken(tok);
  const isFunc = (tok: string) => ['sin','cos','tan','log','sqrt'].includes(tok);
  const isOp = (tok: string) => ['+','-','*','/','^'].includes(tok);
  const isParenL = (tok: string) => tok === '(';
  const isParenR = (tok: string) => tok === ')';
  const isVarX = (tok: string) => tok === 'x';

  const precedence: Record<string, number> = { '+':1, '-':1, '*':2, '/':2, '^':3 };

  const output: string[] = [];
  const opStack: string[] = [];

  for (let i = 0; i < tokensWithUnary.length; i++) {
    const tok = tokensWithUnary[i];
    if (isNumber(tok) || tok === 'pi' || tok === 'e' || isVarX(tok)) {
      output.push(tok);
      continue;
    }
    if (isParenL(tok)) {
      opStack.push(tok);
      continue;
    }
    if (isParenR(tok)) {
      while (opStack.length && opStack[opStack.length - 1] !== '(') output.push(opStack.pop()!);
      if (opStack.length && opStack[opStack.length - 1] === '(') opStack.pop();
      if (opStack.length && isFunc(opStack[opStack.length - 1])) output.push(opStack.pop()!);
      continue;
    }
    if (isFunc(tok)) {
      if (!functionsAllowed) return { result: null, error: 'Functions are not allowed in Standard mode' };
      opStack.push(tok);
      continue;
    }
    if (isOp(tok)) {
      while (opStack.length) {
        const top = opStack[opStack.length - 1];
        if (top === '(') break;
        if (isFunc(top)) {
          output.push(opStack.pop()!);
          continue;
        }
        const pTop = precedence[top];
        const pTok = precedence[tok];
        if (pTop !== undefined && ((pTok < pTop) || (pTok === pTop && tok !== '^'))) {
          output.push(opStack.pop()!);
        } else {
          break;
        }
      }
      opStack.push(tok);
      continue;
    }
    // constants/variables like pi, e, x
    if (tok === 'pi' || tok === 'e') {
      output.push(tok);
      continue;
    }
    if (tok === 'x') {
      output.push(tok);
      continue;
    }
    return { result: null, error: `Unknown token '${tok}'` };
  }

  while (opStack.length) {
    const t = opStack.pop()!;
    if (t === '(' || t === ')') continue;
    output.push(t);
  }

  // Evaluate RPN
  const stack: number[] = [];
  for (let i = 0; i < output.length; i++) {
    const t = output[i];
    const isNum = isNumber(t);
    if (isNum) {
      stack.push(parseFloat(t));
      continue;
    }
    if (t === 'pi') {
      stack.push(Math.PI);
      continue;
    }
    if (t === 'e') {
      stack.push(Math.E);
      continue;
    }
    if (t === 'x') {
      stack.push(xValue);
      continue;
    }
    if (isFunc(t)) {
      if (stack.length < 1) return { result: null, error: 'Insufficient operands for function' };
      const a = stack.pop()!;
      let res = 0;
      switch (t) {
        case 'sin': res = Math.sin(a); break;
        case 'cos': res = Math.cos(a); break;
        case 'tan': res = Math.tan(a); break;
        case 'log': res = Math.log(a); break;
        case 'sqrt': res = Math.sqrt(a); break;
        default: return { result: null, error: 'Unknown function' };
      }
      stack.push(res);
      continue;
    }
    if (isOp(t)) {
      if (stack.length < 2) return { result: null, error: 'Insufficient operands for operator' };
      const b = stack.pop()!;
      const a = stack.pop()!;
      let r = 0;
      switch (t) {
        case '+': r = a + b; break;
        case '-': r = a - b; break;
        case '*': r = a * b; break;
        case '/': r = a / b; break;
        case '^': r = Math.pow(a, b); break;
        default: return { result: null, error: 'Unknown operator' };
      }
      stack.push(r);
      continue;
    }
    return { result: null, error: `Invalid token '${t}'` };
  }

  if (stack.length !== 1) return { result: null, error: 'Invalid expression' };
  return { result: stack[0] };
}
