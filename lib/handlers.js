const packageService = require('./packageService')

exports.getAll = async (req, res) =>  res.json(await packageService.getAll())
exports.get = async (req, res) => res.json(await packageService.get(req.params.name))

