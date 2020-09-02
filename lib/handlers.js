const packageList = require('./readPackages')

exports.getPackage = async (req, res) => {
    const name = req.params.name
    let package = Object.assign({}, packageList.find(a => a['Package'] === name))
    if(!package.hasOwnProperty('Dependencies')) package['Dependencies'] = []

    // Is the package clickable?
    package['Dependencies'] = package['Dependencies'].reduce((list, entry) => {
        let isClickable = packageList.find(a => a['Package'] === entry) !== undefined
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    // Create reverse dependency list
    package['Reverse Dependencies'] = packageList
        .filter(a => a.hasOwnProperty('Dependencies') && a['Dependencies'].indexOf(package['Package']) >= 0)
        .map(a => a['Package'])
    
    // Is the package clickable? fix DRY
    package['Reverse Dependencies'] = package['Reverse Dependencies'].reduce((list, entry) => {
        let isClickable = packageList.find(a => a['Package'] === entry) !== undefined
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    res.json(package)
}

exports.getAllPackages = async (req, res) => res.json(packageList)
