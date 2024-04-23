export default class CustomUser {
    constructor(user) {
      this.name = `${user.first_name} ${user.last_name}`;
      this.email = user.email;
      this.role = user.role;
      this.last_connection = this.lastConnectionDate(user.last_connection);
      this.id = user._id
    }

    lastConnectionDate(connection){
      const last_connection = new Date(connection);
      return last_connection.toLocaleString()
    }
}
  