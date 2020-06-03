const core = require('@actions/core');
const glob = require('@actions/glob');

const envsub = require('envsub');

async function run() {
    try { 
        const directory = core.getInput('directory');

        const globber = await glob.create(`${directory}/**/*`);
        for await (const file of globber.globGenerator()) {
            await processFile(file);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

async function processFile(file) {
    let options = {
        all: false,
        diff: false,
        protect: true, 
        syntax: 'dollar-both',
        system: true
    };

    const result = await envsub({
        templateFile: file, 
        outputFile: file,
        options: options
    });

    core.info(`Templated '${result.templateFile}' -> '${result.outputFile}'.`);
}

run()
