import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  toCamelCase,
  toPascalCase,
  toKebabCase,
  toSnakeCase,
  toScreamingSnakeCase,
  toTitleCase,
  toSentenceCase,
  toAllCases,
} from '../src/string/format.ts';

describe('Format', () => {
  it('toCamelCase', () => {
    assert.equal(toCamelCase('hello-world'), 'helloWorld');
    assert.equal(toCamelCase('hello_world'), 'helloWorld');
    assert.equal(toCamelCase('hello world'), 'helloWorld');
    assert.equal(toCamelCase('HelloWorld'), 'helloWorld');
    assert.equal(toCamelCase(''), '');
  });

  it('toPascalCase', () => {
    assert.equal(toPascalCase('hello-world'), 'HelloWorld');
    assert.equal(toPascalCase('hello world'), 'HelloWorld');
    assert.equal(toPascalCase(''), '');
  });

  it('toKebabCase', () => {
    assert.equal(toKebabCase('helloWorld'), 'hello-world');
    assert.equal(toKebabCase('HelloWorld'), 'hello-world');
    assert.equal(toKebabCase('hello_world'), 'hello-world');
    assert.equal(toKebabCase(''), '');
  });

  it('toSnakeCase', () => {
    assert.equal(toSnakeCase('helloWorld'), 'hello_world');
    assert.equal(toSnakeCase('HelloWorld'), 'hello_world');
    assert.equal(toSnakeCase('hello-world'), 'hello_world');
    assert.equal(toSnakeCase(''), '');
  });

  it('toScreamingSnakeCase', () => {
    assert.equal(toScreamingSnakeCase('helloWorld'), 'HELLO_WORLD');
    assert.equal(toScreamingSnakeCase('hello world'), 'HELLO_WORLD');
  });

  it('toTitleCase', () => {
    assert.equal(toTitleCase('hello world'), 'Hello World');
    assert.equal(toTitleCase('hello-world'), 'Hello World');
  });

  it('toSentenceCase', () => {
    assert.equal(toSentenceCase('hello world'), 'hello world');
    assert.equal(toSentenceCase('HelloWorld'), 'hello world');
  });

  it('toAllCases', () => {
    const r = toAllCases('hello world');
    assert.equal(r.camel, 'helloWorld');
    assert.equal(r.pascal, 'HelloWorld');
    assert.equal(r.kebab, 'hello-world');
    assert.equal(r.snake, 'hello_world');
    assert.equal(r.screaming, 'HELLO_WORLD');
    assert.equal(r.title, 'Hello World');
    assert.equal(r.sentence, 'hello world');
  });

  it('连续分隔符合并', () => {
    assert.equal(toCamelCase('hello--world'), 'helloWorld');
    assert.equal(toKebabCase('hello   world'), 'hello-world');
  });
});