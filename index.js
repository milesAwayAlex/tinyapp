import morgan from 'morgan';
import app from './expressServer.js';

const port = 8080;

app.use(morgan('dev'));

app.listen(port);
