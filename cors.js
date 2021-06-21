const originsWhiteList = [
    'http://localhost:4200',
    'http://127.0.0.1:4200',
]

const corsOptions = {
    origin: function(origin, callback) {
        const isWhiteList = originsWhiteList.indexOf(origin) !== -1;
        callback(null, isWhiteList);
    },
    credentails: true,
};

module.exports = corsOptions;