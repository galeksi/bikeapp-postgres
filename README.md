# SolitaDev BIKEAPP POSTGRES 2023

Application for public bikes in Helsinki

## Description:

Web-application with Node.js Express Backend, React.js frontend and PostgreSQL database on Fly.io
The application icludes:

- Public bike stations and trips in the Helsinki metropolitan area
- Station list view (home): List of Stations, map, stations search, links to sigle station view
- Station detail view: Location on map, further details and statistics
- Bike trips view: List of public bike trips, departure station, return station and date filter, trips are limited to 500 most recent entries
- User can register, login and see own profile
- User profile view: Logged in user can change password, see and add own trips
- Admin can login and see extended profile view
- Admin profile view: Admin can see all users, disable, delete or make them admin; stations can be serached and capacity updated; csv files for stations and trips can be uploaded
- CRUD Endpoints for stations, trips and users; not all endpoints are yet available in frontend
- User sessions expire after 120min; sessions are additionaly managed serverside and saved to database; sessions are not deleted from DB, they expire or set 'logged out'

## Prerequisites:

Application is written with Node version v18.10.0. Same or later version recommended.
Application is a monorepo sepperated in folders /server and /client.

Variables in root/.env file:

- DATABASE_URL
- TEST_DATABASE_URL
- TOKENSECRET
  Variable in root/client/.env file:
- REACT_APP_MAPS_API_KEY

## Configurations:

Public production version: https://bikeapp-postgres.fly.dev/

To run locally:

- git clone
- npm update in root folder AND /client folder to install all dependencies (alternatively yarn upgarde)
- add and configure both .env files locally (root and /client)

Scripts in root folder:
npm start - Production mode, runs with static build
npm run dev - Development mode with nodemon reloading, starts only backend server, database is production database
npm run build:ui - creats React production build to client/build
npm run deploy - deploys app to fly.io
npm run deploy:full - crates production build and deploys to fly.io
npm run migration:down - last database migration rollback
npm run lint - runs eslint on all included files
npm run test - runs all jest tests (unit and integration), database ist test database -> add suffixes to run specific tests!
Script in /client folder:
npm start - needed if backend is running in development mode, proxy to backend

## Tests:

Backend unittests and integration tests:

-> run tests with 'npm run test' in root folder

- unit tests in: /server/tests/unit.test.js
- integration tests in: /server/tests/integration.test.js

There are test csv files in the /csv folder.
For integration tests the test database droppes all tables, runs migrations and seeds data from seeds.js before all tests are run.

E2E tests:

Frontend uses cypress for E2E tests. To use cypress the frontend and backend have to both run separately. Tests are in cypress/e2e/bikeapp.cy.js.

-> Run tests with command 'npm run cypress:open'

IMPORTANT: Running Linux on Windows Subsystem (WSL2) might need some further setup to open cypress. More info here: https://nickymeuleman.netlify.app/blog/gui-on-wsl2-cypress

## Technology choices:

- sequelize: to query postgres database
- pg: for postgres database
- umzug: for database migrations
- bcrypt: authentification
- jsonwebtoken: authorisation
- jest: for unit tests
- supertest: for integration tests
- express-async-errors: to catch express async endpint errors automatically
- nodemon: Reserts dev server after changes automatically
- body-parser: Parses json request bodys
- cors: To enable cross-origin sharing with frontend and backend in sepparate repos
- dotenv: Access .env variables
- express: Backend server
- fast-csv: For parsing uploaded csv datasets
- axios: query API endpints
- http-proxy-middleware: to proxy backend in dev mode without ssl
- jwt-decode: check token expiration
- papaparse: parse csv files before sending file to dataupload endpoint
- lodash: Nice toolset for arrays and collections
- multer: To upload csv file locally
- moment: To validate dates
- React: Obvious choice with Node Backend
- Cypress: For E2E Testing
- Google maps api: To show stations and details on map
- Several packages for filtering and viewing: react-datepicker, react-paginate, react-select,is-valid-coordinates

## ToDo

- Integration tests in frontend could be added
- context or redux could be used for state management in frontend
- frontend styling and UI could be enhanced
