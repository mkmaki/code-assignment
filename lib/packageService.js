const fs = require("fs")
let file = '/var/lib/dpkg/status'

async function readPackageData() {
    const list = []
    const allowedFields = ['Package', 'Dependencies', 'Description']
    
    if (!fs.existsSync(file)) {
        file = './status.real'
        if(!fs.existsSync(file)){
            console.log('File not found')
            process.exit()
        }
    }
    const softwarePackages = fs.readFileSync(file).toString('utf-8') // add error handling

    softwarePackages.split("\n\n").forEach(package => {
        ob = {}
        package.replace(/\n\s/g, ' ').split('\n').forEach(a => {
            let [key, value] = a.split(': ')
            if(key === 'Depends') {
                key = 'Dependencies' // rename 
                value = value.replace(/ \((.*?)\)/g, '').split(/[|,\s]+/)
            }
            if(allowedFields.indexOf(key) >= 0)
                ob[key] = value
        })

        if(!isEmpty(ob))
            list.push(ob)
    })
  list.sort((a, b) => (a['Package'] > b['Package']) ? 1 : -1)
  
  return list
}

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

getAll = async () => {
    return readPackageData()
}

get = async (name) => {
    const data = await readPackageData()   
    const package = data.find(a => a['Package'] === name)
    if(!package.hasOwnProperty('Dependencies')) package['Dependencies'] = []

    // Is the package clickable?
    package['Dependencies'] = package['Dependencies'].reduce((list, entry) => {
        let isClickable = data.find(a => a['Package'] === entry) !== undefined
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    // Create reverse dependency list
    package['Reverse Dependencies'] = data
        .filter(a => a.hasOwnProperty('Dependencies') && a['Dependencies'].indexOf(package['Package']) >= 0)
        .map(a => a['Package'])

    // Is the package clickable? fix DRY
    package['Reverse Dependencies'] = package['Reverse Dependencies'].reduce((list, entry) => {
        let isClickable = data.find(a => a['Package'] === entry) !== undefined
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    return package
}
module.exports = {
    getAll, get
}