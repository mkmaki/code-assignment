var fs = require("fs")
var softwarePackages = fs.readFileSync("./status.real").toString('utf-8')

var list = []
let allowedFields = ['Package', 'Depends', 'Description']

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


