const fs = require("fs")
const softwarePackages = fs.readFileSync('/var/lib/dpkg/status').toString('utf-8') // add error handling

const list = []
const allowedFields = ['Package', 'Depends', 'Description']

softwarePackages.split("\n\n").forEach(package => {
    ob = {}
    package.replace(/\n\s/g, ' ').split('\n').forEach(a => {
        let [key, value] = a.split(': ')
        if(key === 'Depends') {
            value = value.replace(/ \((.*?)\)/g, '').split(/[|,\s]+/)
        }
        if(allowedFields.indexOf(key) >= 0)
            ob[key] = value
    })

    if(!isEmpty(ob))
        list.push(ob)
})

list.sort((a, b) => (a['Package'] > b['Package']) ? 1 : -1)

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}
module.exports = list


