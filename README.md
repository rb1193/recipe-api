# Recipes API

To run this project locally use mkcert to create a self-signed cert and key called `recipes-api.arbee.me.crt` and `recipes-api.arbee.me.crt`. Then do npm install. Then create a .env file with your configuration. Then run `docker-compose up`.

To watch for changes use `npm run-script watch`.

To run migrations open a bash terminal in the web container and run `npm run-script migrate`.

To create the recipes search index run `docker-compose exec web npx ts-node src/cli.ts create-recipes-index`

## Deployment

To deploy, create a new build of the docker image using the Dockerfile.prod file using the command `docker build -t rbrown1193/recipe-rest-api_web:{version} -f ./Dockerfile.prod .`. Run the same command again with the `latest` tag. Push both these tags to the docker repo.

SSH into the server and execute the script at ~/recipes-api/deploy
