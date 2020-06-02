const core = require('@actions/core')
const fs = require('fs')

function rm(file) {
    core.info(`==> Deleting "${file}" file`)
    fs.unlinkSync(file)
}

async function main() {
    try {
        const directory = core.getState("directory")
        const keyFile = core.getState("keyFile")
        const generatedInventoryFile = core.getState("generatedInventoryFile")
        const vaultPasswordFile = core.getState("vaultPasswordFile")

        if (directory)
            process.chdir(directory)

        if (keyFile)
            rm(keyFile)

        if (generatedInventoryFile)
            rm(generatedInventoryFile)

        if (vaultPasswordFile)
            rm(vaultPasswordFile)
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
