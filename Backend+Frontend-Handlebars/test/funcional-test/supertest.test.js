import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:9090");

describe("Testing Ecommerce App", () => {
  describe("Testing Products Api", () => {
    let uid;
    it("Crear prducto: El API POST /api/products debe crear un producto correctamente", async () => {
      //Given
      const product = {
        title: "Testing product",
        description: "Product to test",
        code: "Test1",
        price: 10,
        stock: 4,
        category: "Testing",
      };

      //Then
      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(product);

      uid = _body.response._id;
      //Assert
      expect(_body.response._id).to.be.ok;
      expect(statusCode).is.eqls(200);
    });

    it("Crear prducto sin un dato requerido: El API POST /api/products no debe crear un producto y debe retornar status code HTTP 400", async () => {
      //Given
      const product = {
        //           title: "Testing product",
        description: "Product to test",
        code: "Test1",
        price: 10,
        stock: 4,
        category: "Testing",
      };

      //Then
      const { statusCode, ok, _body } = await requester
        .post("/api/products")
        .send(product);

      //Assert
      expect(statusCode).is.eqls(400);
      expect(ok).is.eql(false);
    });

    after(async function () {
      const result = await requester.delete(`/api/products/${uid}`);
    });
  });

  describe("Testing login y session con Cookies", () => {
    before(function () {
      this.cookie;
      this.id;
      this.mockUser = {
        first_name: "Usuario de prueba",
        last_name: "Apellido de prueba",
        email: "correodeprueba@gmail.com",
        age: 26,
        password: "123qwe",
      };
    });

    //Test 01
    it("Test registo de usuario: Debe registrar correctamente un usuario", async function () {
      //Then
      const { statusCode, _body } = await requester
        .post("/api/users/register")
        .send(this.mockUser);

      this.id = _body.user._id;
      //Assert
      expect(statusCode).is.eql(201);
    });

    //Test 02
    it("Test Login de usuario: El usuario creado debe loggearse correctamente", async function () {
      // Given
      const mockLogin = {
        email: this.mockUser.email,
        password: this.mockUser.password,
      };

      // Then
      const { statusCode, headers } = await requester
        .post("/api/users/login")
        .send(mockLogin);

      const cookieResult = headers["set-cookie"][0];

      //Assert
      expect(statusCode).is.eql(200);

      const cookieData = cookieResult.split("=");
      this.cookie = {
        name: cookieData[0],
        value: cookieData[1],
      };

      expect(this.cookie.name).to.be.eql("jwtCookieToken");
      expect(this.cookie.value).to.be.ok;
    });

    //Test 03
    it("Test Ruta protegida: Debe enviar la cookie que contiene el usuario y desestructurarla correctamente.", async function () {
      //Then
      const { forbidden, statusCode } = await requester
        .get("/products/chat")
        .set("Cookie", [`${this.cookie.name}=${this.cookie.value}`]);

      //Assert
      expect(statusCode).is.eql(200);

      expect(forbidden).is.eql(false);
    });

    after(async function () {
      const result = await requester.delete(`/api/users/delete/${this.id}`);
    });
  });
});
