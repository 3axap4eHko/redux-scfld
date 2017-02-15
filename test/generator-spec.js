import Del from 'del';
import { join } from 'path';
import { execSync } from 'child_process';
import runtime from 'module-runtime';

runtime('./package.json', `module.exports = {version: 'development'};`);

const babel = 'node_modules/babel-cli/bin/babel-node';

function run(command) {
  try {
    return execSync(`node ${babel} src/${command}`);
  } catch (e) {
    return e;
  }
}

describe('Generator test suite:', function() {
  this.timeout(10000);

  before(() =>  {
    Del.sync('test/app');
  });

  beforeEach(() => {
    try {
      delete require.cache[require.resolve('./app/types')];
      delete require.cache[require.resolve('./app/actions')];
      delete require.cache[require.resolve('./app/reducers')];
      delete require.cache[require.resolve('./app/states')];
    } catch (e) {
    }
  });

  it('Should generate base structure', () => {
    const result = run('redux gen');
    result.should.be.not.instanceOf(Error);

    const types = require('./app/types');
    types.should.have.ownProperty('STATUS_PROCESS');
    types.should.have.ownProperty('STATUS_SUCCESS');
    types.should.have.ownProperty('STATUS_FAILURE');
    types.should.have.ownProperty('NAMESPACES');
  });

  it('Should add multiple RSE', () => {
    const result = run('redux add unitTest:successCase unitTest:failureCase');
    result.should.be.not.instanceOf(Error);

    const actions = require('./app/actions');
    actions.should.have.ownProperty('unitTestFailureCase');
    actions.should.have.ownProperty('unitTestSuccessCase');

    const types = require('./app/types');
    types.should.have.ownProperty('NAMESPACE_UNITTEST');
    types.should.have.ownProperty('UNIT_TEST_FAILURE_CASE');
    types.should.have.ownProperty('UNIT_TEST_SUCCESS_CASE');
  });

  it('Should add single RSE', () => {
    const result = run('redux add another:testCase');
    result.should.be.not.instanceOf(Error);

    const actions = require('./app/actions');
    actions.should.have.ownProperty('anotherTestCase');

    const types = require('./app/types');
    types.should.have.ownProperty('NAMESPACE_ANOTHER');
    types.should.have.ownProperty('ANOTHER_TEST_CASE');
  });

  it('Should re-generate indexes if entity deleted', () => {
    const result = run('redux del another');
    result.should.be.not.instanceOf(Error);

    const actions = require('./app/actions');
    actions.should.not.have.ownProperty('anotherTestCase');

    const types = require('./app/types');
    types.should.not.have.ownProperty('NAMESPACE_ANOTHER');
    types.should.not.have.ownProperty('ANOTHER_TEST_CASE');
  });
});