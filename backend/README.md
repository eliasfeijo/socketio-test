# Backend socketio-test

## Dependencies

- node.js fermium
- yarn
- PostgreSQL

*PS: It has only been tested with the OS Ubuntu 20.04*

## Development

1. Open a terminal and `cd` into the project's directory
2. Run `yarn` to install the dependencies
3. Run `npx sequelize-cli db:create && npx sequelize-cli db:migrate`
4. Run `yarn dev` to start the development server, it will start in `http://localhost:3000/` by default
5. If you want to reset the database, run `npx sequelize-cli db:drop && npx sequelize-cli db:create && npx sequelize-cli db:migrate`
