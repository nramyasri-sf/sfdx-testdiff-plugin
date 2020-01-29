import {Command} from '@oclif/command';
// import ux from 'cli-ux';
import * as fs from 'fs-extra';
import * as _ from 'lodash';
// const fse = require('fs-extra');

export default class Commands extends Command {
   public static description = 'list all the commands';
   public static goldFilePath = '/Users/rnimmagadda/Desktop/myWork/sfdx-testdiff-plugin/output.json';

  public async run() {
    let commands =  this.config.commands;
    commands = _.sortBy(commands, 'id').map(command => {
        return {
            command: command.id,
            flags: Object.entries(command.flags).map((flagName, flag) => ({name: flagName}))
        };
    });
    await fs.writeJson(Commands.goldFilePath, commands);
  }
}
