export default class UsersDto {
  constructor(user, amount) {
    this.name = `${user.first_name} ${user.last_name}`;
    this.email = user.email;
    this.age = user.age;
    this.amount = amount;
    this.role = user.role;
    this.cart = user.cart;
    this.id = user._id;
    this.documents = user.documents
  }
}
