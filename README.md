# Recipes API

To run this project locally use mkcert to create a self-signed cert and key called `recipes-api.arbee.me.crt` and `recipes-api.arbee.me.crt`. Then do npm install. Then create a .env file with your configuration. Then run `docker compose up`.

By default this will run the previously built app. To watch for changes open a bash terminal and use `npm run watch`.

To run migrations open a bash terminal in the web container and run `npm run migrate`.

## Deployment

Pushing to master will trigger a deployment via GitHub actions to Fly.io

You will then need to SSH into a Fly machine using `fly ssh console` and run `npm run migrate` if there are migrations to run. You may need to send a request to the API to wake the Fly machines up first.

## Commands

There are a handful of CLI commands used for administering the application. The CLI can be run using `docker-compose exec web node dist/cli.js`.

Available commands

- `create-user {email} {password}`

## TODO

Run tests in GitHub actions pipeline
