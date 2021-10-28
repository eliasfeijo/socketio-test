module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'socketio_test',
  logging: false,
  define: {
    timestamps: true,
    underscored: true,
  }
};