import { expect, test } from '@Salesforce/command/lib/test';
import * as fs from 'fs';
import * as sinon from 'sinon';

const sandbox = sinon.createSandbox();

describe('deprecation:generate', () => {
    test.command(['deprecation:generate'])
        .it('should create a gold file', ctx => {
            const writeFileStub = sandbox.stub(fs, 'writeFile');
           // tslint:disable-next-line:no-unused-expression
            expect(writeFileStub.calledOnce).to.be.true;
            // tslint:disable-next-line:no-unused-expression
            expect(writeFileStub.calledWith('command-gold-file.json')).to.be.true;
        });
    sandbox.restore();
});
