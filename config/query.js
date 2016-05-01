var mysql = require('mysql');

module.exports = function (mysqlconfig) {
    var connectionPool = mysql.createPool({
        connectionLimit: mysqlconfig.connectionLimit,
        host: mysqlconfig.host,
        user: mysqlconfig.username,
        database: mysqlconfig.database,
        password: mysqlconfig.password
    });

    var query = function (qry, qrydone) {
        var result = {
            err: false,
            rows: undefined,
            fields: undefined
        };
        connectionPool.query(qry, function (err, rows, fields) {
            // TODO: query escape
            console.log('[query.js] Querying: ' + qry);
            if (err) {
                console.log('[query.js] Error querying! Query: ' + qry);
                result.err = err;
                console.log(err);
                qrydone(err, false);
            } else {
                console.log('[query.js] Query completed: ' + qry);
                result.rows = rows;
                result.fields = fields;
                qrydone(null, result);
            }
        });
    };

    query.escape = mysql.escape;
    
    connectionPool.on('connection', function (connection) {
        console.log('[query.js] Connection made to MySQL database');
    });
    return query;
};