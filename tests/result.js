var Results = require('./Result.js');
//
let locale = require('./result.locale.json')
const util = require('util')

var assert = require('assert');
var should = require('chai').should()
const { AssertionError } = require('assert');
const $results = new Results(locale, uncaughHandler)

function log(obj) {
    console.log(util.inspect(obj, false, null, true))
}
function log(cmd, res) {
    console.log(cmd + ' : ' + res)
}

describe('Result', function () {
    describe('#.err with empty constructor', function () {
        it('should return true', function () {
            const r = new Result()
            assert.equal(r.e, true, r.e);
        });
    });





});
// index.js
'use strict';




function log(obj) {
    console.log(util.inspect(obj, false, null, true))
}

function simSync(payload) {
    const mail = payload.email.substring(0, 1) + "-changed"
    return {
        modifiedEmail: mail,
        clients: [1, 2, 3]
    }
}

function uncaughHandler(e) {
    console.log('uncaught Error,')

}

function errorFunctionSim() {
    const foo = {}
    return foo.bar
}

const tst = [1, 2]
const expected = { type: 'Array', len: 2 }
//console.log(Object.keys(expected).length)
$results.at('index').with({ pay: 'load' })
try {
    const response = errorFunctionSim()
    $results.got(response)
} catch (err) {
    $results.but(err);
}



log($results.why())

