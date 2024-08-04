const cors = require('cors');

const corsOptions ={ 
    origin: 'http://localhost:3000',
    Credentials: true
}
module.exports = cors(corsOptions)