const { createPool } = require('mysql');

const databasePool = createPool({
  host: "sql12.freesqldatabase.com",
  user: "sql12646661",
  password: "Z1PbDrPEQ7",
  database: "sql12646661"
});

// Function to get a connection from the pool
const getConnection = () => {
  return new Promise((resolve, reject) => {
    databasePool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(connection);
    });
  });
};

module.exports = {
  databasePool,
  getConnection
};
