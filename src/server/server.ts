import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import config from './config';
import { Application, NextFunction, Request, Response } from 'express';
declare var global: any;



export default class Server {

    public static bootstrap(): Server {
        return new Server();
    }
    public app: Application;

    constructor() {
        this.app = express();

        this.config();
    }

    private config(): void {

        this.app.use(favicon(path.join(__dirname, '../../public', 'favicon.ico')));
        // view engine setup
        this.app.set('views', path.join(__dirname, '../../src', 'views'));
        this.app.set('view engine', 'hbs');

        this.app.use(session({
            secret: 'secret', // session secret
            resave: true,
            saveUninitialized: true
        }));
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../..', 'public')));
        this.routes();

        // catch 404 and forward to error handler
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            const err: any = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // error handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }

    private routes(): void {
        for (const routePath of config.globFiles(config.routes)) {
            const router = require(path.resolve(routePath)).default;
            this.app.use(router);
        }
    }

}
