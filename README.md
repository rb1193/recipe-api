# Recipes API

To run this project locally use mkcert to create a self-signed cert and key called `recipes-api.arbee.me.crt` and `recipes-api.arbee.me.crt`. Then do npm install. Then create a .env file with your configuration. Then run `docker-compose up`.

To watch for changes use `npm run watch`.

To run migrations open a bash terminal in the web container and run `npm run migrate`.

To create the recipes search index run `docker-compose exec web npx ts-node src/cli.ts create-recipes-index`

## Deployment

To deploy, push the master branch. This will trigger a docker container build. You should also push a tagged version of the build.

To create and push a tagged build:

`docker build --tag rbrown1193/recipe-rest-api_web:{tag} -f ./Dockerfile.prod . && docker push rbrown1193/recipe-rest-api_web:{tag}`

SSH into the server and run the following commands:

- `cd ~/recipes`
- `docker pull rbrown1193/recipe-rest-api_web:latest`
- `docker-compose up -d`
- `docker-compose exec web npm run migrate (if necessary)`

## Commands

There are a handful of CLI commands used for administering the application. The CLI can be run using `docker-compose exec web npx ts-node src/cli.ts`.

Available commands

- `create-user {email} {password}`
- `index-recipes`

## TODOS

- Automate deployment process
- Add servings data to recipes
