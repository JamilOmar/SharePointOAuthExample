
export class Helpers {

    public static normalizePort(val: any) {
        const port = parseInt(val, 10);
        if (isNaN(port)) {
            return val;
        }

        if (port >= 0) {
            return port;
        }
        return false;
    }

    public static onError(port) {
        return function(error: any) {
            if (error.syscall !== 'listen') {
                throw error;
            }

            const bind = typeof port === 'string'
                ? 'Pipe ' + port
                : 'Port ' + port;

            // handle specific listen errors with friendly messages
            switch (error.code) {
                case 'EACCES':
                    console.error(bind + ' requires elevated privileges');
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    console.error(bind + ' is already in use');
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        };
    }

    public static onListening(address) {
        return function() {
            const addr = address;
            const bind = typeof addr === 'string'
                ? 'pipe ' + addr
                : 'port ' + addr.port;
            console.log('Listening on ' + bind);
        };

    }

}
