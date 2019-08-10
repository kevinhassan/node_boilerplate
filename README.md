# Node-Boilerplate

Complete tested NodeJS boilerplate with multiple environments.

## Technologies used

- NodeJS
- MongoDB 

#### Security
- JWT 

#### Test 
- Mocha 
- Chai
- Supertest (test HTTP call on API)
- nyc (test coverage CLI)

#### Logger 
- Wintson 

#### ODM 
- Mongoose

#### Environment 
- Docker 
- Docker-Compose

#### Documentation (interactive)
- Swagger IO (available at /api-docs)


## Instructions

1. Copy & paste `.env.example`
2. Rename it to `.env` 
3. Complete attributes (default environment is `development`)
4. To launch :  
    - Docker : Launch `docker-compose up`  
    - Manually : 
        1. Launch MongoDB
        2. Set `DB_URL` in `.env` 
        3. Launch API with  
            - `npm install` to install dependancies
            - `npm start` or  `npm watch` (for hot reload)

## Explanations 

Multiple environments : 
- Development (selected by default)
- Production 
- Test 

All environment use different database and behaviour. 
Indeed, production environment disable Wintson logger for security concerns and hide verbosity on request done on the API. 

## License

MIT
