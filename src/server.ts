import app from './app';
import db from './database';

const server = app.listen(3000);

process.on('SIGTERM', () => {
    console.debug('SIGTERM signal received: closing HTTP server')
    db?.destroy()
    server.close(() => {
      console.debug('HTTP server closed')
    })
})