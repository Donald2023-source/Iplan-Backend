const cors = require('cors');

const corsOptions ={ 
    origin: 'http://localhost:5173',
    Credentials: true
}
module.exports = cors(corsOptions)