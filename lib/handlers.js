const packageList = require('./readPackages')

exports.getPackage = async (req, res) => {
    const name = req.params.name
    let package = Object.assign({}, packageList.find(a => a['Package'] === name))
    if(!package.hasOwnProperty('Depends')) package['Depends'] = []

    // Is the package clickable?
    package['Depends'] = package['Depends'].reduce((list, entry) => {
        let isClickable = packageList.find(a => a['Package'] === entry) !== undefined
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    // Create reverse dependency list
    package['ReverseDependencies'] = packageList
        .filter(a => a.hasOwnProperty('Depends') && a['Depends'].indexOf(package['Package']) >= 0)
        .map(a => a['Package'])
    
    // Is the package clickable?
    package['ReverseDependencies'] = package['ReverseDependencies'].reduce((list, entry) => {
        let isClickable = packageList.find(a => a['Package'] === entry) !== undefined
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    res.json(package)
}

exports.getAllPackages = async (req, res) => res.json(packageList)
