const express = require('express')
const router = express.Router()

require('./userRoutes')(router)

router.get('/', (req, res) => {
    res.status(200).send("API is working")
})

module.exports = router
