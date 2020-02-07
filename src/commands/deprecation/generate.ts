import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

export default class Generate extends Command {

    public static flags = {
        outputdir: flags.string({ default: './' }),
        filename: flags.string({ default: 'command-gold-file.json' })
    };

    public async run() {
        const numberOfSpaceChar: number = 4;
        const { flags } = this.parse(Generate);
        const commands = this.config.commands;
        const resultCommands = _.sortBy(commands, 'id').map(command => {
            return {
                command: command.id,
                flags: Object.entries(command.flags).map(flagName => flagName[0])
            };
        });
        const filePath = path.join(flags.outputdir, flags.filename);
        fs.writeFile(filePath, JSON.stringify(resultCommands, null, numberOfSpaceChar),
            err => {
            if (err) throw err;
            console.log('File has been saved.');
        });
    }

}
