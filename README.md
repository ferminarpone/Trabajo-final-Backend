## APLICACIÓN E-COMMERCE TRABAJO FINAL CODERHOUSE
---

### INTRODUCCIÓN 
---
Gracias a esta aplicación podrás navegar, visualizar y comprar todos los productos disponibles.


### INSTALACIÓN 
---
1. Clonar el proyecto.
1. Ve a la carpeta del proyecto.
1. Instala las dependencias `npn install`
1. Corre el ambiente local `npm run dev`


### DEPLOY DEL SITIO
---
https://trabajo-final-backend-production.up.railway.app/


### NAVEGABILIDAD
---
* En la página principal encontrarás el login de la página. Distintas alternativas:
    * Realizar el login si ya estás registrado.
    * Restablecer la contraseña.
    * Realizar un registro si aún no estás registrado.
    * Realizar el login mediante cuenta de GitHub.

**Login:** Ingresar email y contraseña para ingresar.

**Restablecer contraseña:** 
* Deberás ingresar tu correo electrónico.
* Luego te llegará un email con un link donde podrás restablecer la contraseña. El mismo expirará luego de una hora. 
* El link abrirá una nueva página donde deberás ingresar tu correo, contraseña y volver a verificar la contraseña.

**Registro:** Deberás ingresar los datos solicitados para crear una nueva cuenta. En todos los casos se creará con el rol de User.

* Una vez ingresadas tus credenciales, podrás visualizar todos los productos disponibles con sus detalles y tendrás la posibilidad de agregarlos al carrito de compras.
* Además, en la parte superior, tendrás la posibilidad de navegar por el **Perfil** de usuario, **Carrito de compras** y acceder al **Chat online**.

**Perfil:** Aquí podrás administrar tus datos personales, modificar tu foto de perfil y cambiar el rol a usuario **Premium**.
* **Usuario Premium:** 
     * Si cambias tu rol a Premium, además de comprar podrás vender tus productos. 
     * Para modificar el rol será necesario completar la documentación necesaria. Podrás hacerlo desde tu perfil.
     * Podrás visualizar el cambio de rol en tu siguiente inicio de sesión.
     * Si eres usuario **Premium**, tu página principal no será **HOME**, sino la de **Manager de productos**.

**Manager de productos:** 
Si eres usuario **Premium** o **Administrador (adminCoder@coder.com)** podrás agregar productos para vender a la DDBB de la aplicación ingresando los datos requeridos.

Además, podrás eliminar tus productos si lo deseas. Solo el **Administrador** podrá eliminar cualquiera de los productos de la DDBB.

**Gestionar usuarios:** Solo si eres **Administrador** podrás ingresar a gestionar usuarios donde podrás:
* **Eliminar usuarios expirados:** Podrás eliminar todos los usuarios inactivos (no utilizados en las últimas 48 hs.).
* **Eliminar un usuario**
* **Modificar el rol de un usuario** 

**FLUJO DE COMPRA**
* Solo los usuarios con rol **USER** o **PREMIUM** podrán agregar productos al carrito y realizar una compra.
* Desde la página **HOME** podrás agregar el producto que deseas haciendo clic en el botón **Agregar a carrito**.
* Al agregar un producto la aplicación te direccionará automáticamente al carrito de compras.
* Si deseas agregar otro producto o sumar mayor cantidad del mismo producto, deberás volver a la página de **HOME**.

**Carrito:** 
* Aquí podrás visualizar todos los productos que has previamente seleccionado.
* Podrás remover los productos que desees, haciendo clic sobre el botón **Remover del carrito**.
* Podrás visualizar el monto total de los productos seleccionados.
* Una vez que estés seguro de todos los productos que deseas comprar deberás seleccionar el botón **Finalizar compra**.
    * Este botón te redireccionará a una nueva página, la cual contendrá el detalle de los productos seleccionados.
    * Solo encontrarás los productos para los cuales haya el stock necesario para la cantidad requerida. (Esto podrás chequearlo previamente en el detalle de tu carrito).

**Detalles de compra:** Aquí podrás chequear todos los productos que comprarás, previo a realizar el pago. Para ello deberás acceder al pago haciendo clic sobre **Ir a pagar**. Contarás con 10 minutos para realizar tu pago. En caso contrario, los productos volverán a su stock.

**Ir a pagar:** Aquí podrás ingresar los datos de tu tarjeta de crédito/débito para realizar finalmente el pago.
* Por último, te llegará un correo electrónico, donde podrás visualizar el detalle de la compra que has realizado.



### DEPENDENCIAS UTILIZADAS
---
* **@faker-js/faker**: Generación de mocking. **- Versión: "^8.4.1"**
* **@handlebars/allow-prototype-access"**: Generación de motor de plantillas(Frontend). **- Versión: "^1.0.5"**
* **"bcrypt"**: Encriptación de passwords. **- Versión: "^5.1.1"**
* **"cloudinary"**: Cargar archivos en la nube. **- Versión: "^2.1.0"**
* **"commander"**: Obtener argumentos de la linea de comandos. **- Versión: "^12.0.0"**
* **"connect-mongo"**: Conexión a Base de Datos MongoDB. **- Versión: "^5.1.0"**
* **"cookie-parser"**: Para analizar y manejar cookies. **- Versión: "^1.4.6"**
* **"cors"**: Admitir servidores de terceros. **- Versión: "^2.8.5"**
* **"datauri"**: Compilar un búfer de archivos. **- Versión: "^4.1.0"**
* **"dotenv"**: Carga de variables de entorno desde un archivo .env **- Versión: "^16.4.1"**
* **"express"**: Framework Backend. **- Versión: "^4.18.2"**
* **"express-session"**: Manejo de sesiones. **- Versión: "^1.17.3"**
* **"jsonwebtoken"**: Manejo de autenticación con JSON web Token. **- Versión: "^9.0.2"**
* **"mongoose"**: Modelación de datos y representación en MongoDB. **- Versión: "^8.0.3"**
* **"mongoose-paginate-v2"**: Paginación. **- Versión: "^1.7.4"**
* **"multer"**: Carga de archivos. **- Versión: "^1.4.5-lts.1"**
* **"nodemailer"**: Enviós de correos electrónicos. **- Versión: "^6.9.10"**
* **"nodemon"**: Monitorear cambiós automáticamente. **- Versión: "^3.0.1"**
* **"passport"**: Estrategias de autenticación. **- Versión: "^0.7.0"**
* **"socket.io"**: Intercambio bidireccional de datos entre procesos no relacionados. **- Versión: "^4.7.2"**
* **"stripe"**: Realización de pagos. **- Versión: "^15.3.0"**
* **"swagger-jsdoc"**: Documentación de servicios web RESTful. **- Versión: "^6.2.8"**
* **"uuid"**: Generacion de codigos únicos. **- Versión: "^9.0.1"**
* **"winston"**: Implementación de loggers. **- Versión: "^3.12.0"**



### CONTACTO
---
**GitHub** [Repositorio Fermín Arpone](https://github.com/ferminarpone)

**Linkedin** [Perfil de Fermín Arpone](https://www.linkedin.com/in/fermin-arpone-4365a3207/)