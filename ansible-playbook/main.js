const core = require('@actions/core')
const exec = require('@actions/exec')
const fs = require('fs')
const os = require('os')

async function main() {
    try {
        const playbook = core.getInput("playbook", { required: true })
        const directory = core.getInput("directory")
        const key = core.getInput("key")
        const inventory = core.getInput("inventory")
        const inventoryFile = core.getInput("inventory_file")
        const vaultPassword = core.getInput("vault_password")
        const options = core.getInput("options")

        let cmd = ["ansible-playbook", playbook]

        if (options) {
            cmd.push(options.replace(/\n/g, " "))
        }

        if (directory) {
            process.chdir(directory)
            core.saveState("directory", directory)
        }

        if (key) {
            const keyFile = ".ansible_key"
            fs.writeFileSync(keyFile, key + os.EOL, { mode: 0600 })
            core.saveState("keyFile", keyFile)
            cmd.push("--key-file")
            cmd.push(keyFile)
        }

        if (inventory) {
            const generatedInventoryFile = ".ansible_inventory"
            fs.writeFileSync(generatedInventoryFile, inventory, { mode: 0600 })
            core.saveState("generatedInventoryFile", generatedInventoryFile)
            cmd.push("--inventory-file")
            cmd.push(generatedInventoryFile)
        }

        if (inventoryFile) {
            cmd.push("--inventory-file")
            cmd.push(inventoryFile)
        }

        if (vaultPassword) {
            const vaultPasswordFile = ".ansible_vault_password"
            fs.writeFileSync(vaultPasswordFile, vaultPassword, { mode: 0600 })
            core.saveState("vaultPasswordFile", vaultPasswordFile)
            cmd.push("--vault-password-file")
            cmd.push(vaultPasswordFile)
        }

        process.env.ANSIBLE_HOST_KEY_CHECKING = "False"
        process.env.ANSIBLE_FORCE_COLOR = "True"

        await exec.exec(cmd.join(" "))
    } catch (error) {
        core.setFailed(error.message)
    }
}

main()
