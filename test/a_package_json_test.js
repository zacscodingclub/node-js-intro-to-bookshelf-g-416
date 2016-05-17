const expect = require('unexpected');
const packageJson = require('../package.json');

describe('package.json', () => {
  it('has the correct dependencies', () => {
    expect(packageJson.dependencies, 'to have keys',
      'express',
      'body-parser',
      'knex',
      'bookshelf',
      'pg'
    );
  });

  it('has the correct devDependencies', () => {
   expect(packageJson.devDependencies, 'to have keys',
     'chai',
     'mocha',
     'mocha-multi',
     'supertest',
     'unexpected'
   );
  });
});
