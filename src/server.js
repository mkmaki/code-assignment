const fs = require("fs")
const packageList = require('./lib/readPackages')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())

app.use(express.static('public'))

app.get('/packages/:id', (request, response) => {
    const id = request.params.id
    let package = Object.assign({}, packageList.filter(a => a['Package'] === id)[0])
    if(!package.hasOwnProperty('Depends')) package['Depends'] = []

    // Is the package clicable?
    package['Depends'] = package['Depends'].reduce((list, entry) => {
        let isClickable = packageList.filter(a => a['Package'] === entry).length == true
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    // Create reverse dependency list
    package['ReverseDependencies'] = packageList
        .filter(a => a.hasOwnProperty('Depends') && a['Depends'].indexOf(package['Package']) >= 0)
        .map(a => a['Package'])
    
    // Is the package clicable?
    package['ReverseDependencies'] = package['ReverseDependencies'].reduce((list, entry) => {
        let isClickable = packageList.filter(a => a['Package'] === entry).length == true
        list.push({ name: entry, clickable: isClickable })
        return list 
    }, [])

    response.json(package)
})

app.get('/packages', (request, response) => {
    response.json(packageList)
})

app.listen(3001)




