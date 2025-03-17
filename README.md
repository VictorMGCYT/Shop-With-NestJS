<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# TesloDB API

1. Clonar proyecto con ```git clone```

2. Instalar todas las dependencias
```
yarn install
```

3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```

4. Cambiar las variables de entorno de acuerdo a lo que se está ejecutando

5. Ejecutar el comando para levantar la base de datos
```
docker-compose -d
```

6. Ejecutar seed para llenar la base de datos
```
http:localhost:3000/api/seed
```

7. Levantar el modo de desarrollo
```
yarn start:dev
```
