
import { Command, flags } from '@oclif/command';
import * as fs from 'fs';
import * as _ from 'lodash';

export default class Test extends Command {

    public static flags = {
        goldfile: flags.string({ default: './command-gold-file.json' })
    };

    public async compareDiff(initialCommands, updatedCommands) {
        let result;
        let diffCommands = [];
        initialCommands.forEach(intialCommand => {
            updatedCommands.forEach(updatedcommand => {
                if (intialCommand.command === updatedcommand.command) {
                    result = this.diffCommandFlags(intialCommand.flags, updatedcommand.flags, intialCommand.command);
                    if (result === false) {
                        diffCommands.push(intialCommand.command);
                    }
                }
            });
        });

        /** Check if existant commands have been deleted */
        if (Object.keys(updatedCommands).length < Object.keys(initialCommands).length) {
            console.error(`These commands have been deleted, please check again   :  ${this.diffCommands(initialCommands, updatedCommands)}`);
            process.exit(1);
        }

        if (diffCommands.length > 0) {
            console.error(`There have been changes in the flags of the following commands  :  ${diffCommands}. Please check again.`);
            process.exit(1);
        }

        if (Object.keys(initialCommands).length === Object.keys(updatedCommands).length) {
            if (_.isEqual(initialCommands, updatedCommands) && diffCommands.length === 0) {
                console.log('No changes have been detected, the updated command list is good to commit ..');
                // console.log(updatedCommands);
            }
        }
    }

    /** Returns true if there is no difference in the current and updated flags */
    public diffCommandFlags(oldFlags, newflags, initialCommand) {
        let result = false;
        if (newflags.length > oldFlags.length) {
            const difference = newflags.filter(flag => !oldFlags.includes(flag));
            console.log(`New flags  :  ${difference} have been for the command : ${initialCommand}`);
            result = true;
        }
        if (_.isEqual(oldFlags, newflags)) {
            result = true;
        }
        return result;
    }

    /** Returns the differencw between initial command list and the updated list */
    public diffCommands(initialCommands, updatedCommands) {
        return initialCommands.filter(i => !updatedCommands.some(u => u.command === i.command));
    }

    public async run() {
        const { flags } = this.parse(Test);
        const oldCommandFlags = JSON.parse(fs.readFileSync(flags.goldfile).toString('utf8'));
        const newCommandFlags = this.config.commands;
        const resultnewCommandFlags = _.sortBy(newCommandFlags, 'id').map(command => {
            return {
                command: command.id,
                flags: Object.entries(command.flags).map(flagName => flagName[0])
            };
        });
        const updatedCommands = await this.compareDiff(oldCommandFlags, resultnewCommandFlags);
        return updatedCommands;
    }
}
