const { get, getAll } = require('./readPackages')

exports.getAll = async (req, res) =>  res.json(await getAll())
exports.get = async (req, res) => res.json(await get(req.params.name))

