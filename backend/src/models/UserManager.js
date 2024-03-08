const AbstractManager = require("./AbstractManager");

class UserManager extends AbstractManager {
  constructor() {
    // Call the constructor of the parent class (AbstractManager)
    // and pass the table name "item" as configuration
    super({ table: "user" });
  }

  // The C of CRUD - Create operation

  async create(user) {
    // Execute the SQL INSERT query to add a new item to the "item" table
    const [result] = await this.database.query(
      `insert into ${this.table} (username,  email, password, is_admin) values (?, ?, ?, ?)`,
      [user.username, user.email, user.hashedPassword, user.is_admin]
    );

    // Return the ID of the newly inserted item
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id) {
    // Execute the SQL SELECT query to retrieve a specific item by its ID
    const [rows] = await this.database.query(
      `select * from ${this.table} where id = ?`,
      [id]
    );

    // Return the first row of the result, which represents the item
    return rows[0];
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await this.database.query(`select * from ${this.table}`);

    // Return the array of items
    return rows;
  }

  async readUserByEmail(email) {
    const [rows] = await this.database.query(
      `select * from ${this.table} where email = ?`,
      [email]
    );
    return rows;
  }

  async verifyToken(userId) {
    const [rows] = await this.database.query(
      `SELECT *
             FROM user
             WHERE id = ?`,
      [userId]
    );
    return rows;
  }

  async update(user) {
    const [result] = await this.database.query(
      `UPDATE 
      ${this.table} SET username = ?, firstname = ?, lastname = ?
      WHERE user.id = ?`,
      [user.username, user.firstname, user.lastname, user.id]
    );

    return result;
  }
}

module.exports = UserManager;
