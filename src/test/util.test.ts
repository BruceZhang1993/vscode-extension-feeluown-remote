import * as assert from 'assert';
import * as util from '../util';

suite("Util Tests", function () {
    // Test formatSeconds
    test("Test formatSeconds", function() {
        assert.equal('00:00', util.formatSeconds(0));
        assert.equal('00:26', util.formatSeconds(26));
        assert.equal('01:01:21', util.formatSeconds(3681));
    });
});
