<p align="center">
    <a href="https://autogestion.puntero.dev/" target="_blank">
        <img src="https://i.imgur.com/H8or4vA.png" width="126" style="margin: auto" />
    </a>
</p>
<h1 align="center">Nexus - Autogestión Reimagined</h1>

<a href="https://github.com/punteroo/autogestion-next/deployments" target="_blank">![GitHub deployments](https://img.shields.io/github/deployments/punteroo/autogestion-next/production?label=Vercel&labelColor=0070F3)</a>
<a href="https://autogestion.puntero.dev/" target="_blank">![Website](https://img.shields.io/website?url=https%3A%2F%2Fautogestion.puntero.dev&label=Visitar%20Nexus&labelColor=0070F3)</a>
<a href="https://github.com/punteroo/autogestion-next/commits/master/" target="_blank">![GitHub commit activity (branch)](https://img.shields.io/github/commit-activity/t/punteroo/autogestion-next)</a>

Este repositorio refleja la aplicación web de **Nexus**, el autogestión no oficial de la UTN FRVM.

Si encuentras mejoras, decides colaborar al proyecto o consideras un cambio necesario, te invito a [forkear el proyecto](https://github.com/punteroo/autogestion-next/fork) para crear tu propia PR o [crear un nuevo issue](https://github.com/punteroo/autogestion-next/issues/new/choose) donde pueda darle seguimiento al problema.

## Local Deployment
El proyecto asume el uso núcleo de [el wrapper de autogestión](https://github.com/punteroo/autogestion-frvm) (tampoco oficial) para su funcionamiento correcto.

Antes de comenzar, debes tener lo siguiente:
- Un servidor de MongoDB (local, virtualizado o hosteado)
- Cuenta en [**UploadThing**](https://uploadthing.com)

Para ejecutar el proyecto, necesitas **Node v20** y **yarn**. Sigue esta guía para instalarlos.

1. Clonar el proyecto localmente.
```bash
$ git clone https://github.com/punteroo/autogestion-next.git
$ cd autogestion-next
```

2. (Si no tienes Node) [Instalar `nvm` para administrar tus versiones de Node.](https://github.com/coreybutler/nvm-windows)
3. (Si ya tienes Node) Instalar **`yarn`** como package manager global.
```bash
$ npm i --global yarn
$ yarn --version
1.22.19
```

`En caso de que el comando yarn no funcione, utilizar npx yarn`

4. Instalar las dependencias del proyecto.
```bash
# Asegurarse de estar parado en el root del proyecto.
$ pwd
/home/puntero/autogestion-next
# Instalar dependencias.
$ yarn install
```

5. Modificar el archivo `.env` para rellenar tus credenciales privadas. El resto las puedes dejar como están.
```
# Connection string de tu MongoDB
MONGODB_URI="mongodb://user:password@host:port/dbName"
# API key de tu proyecto de UploadThing
UPLOADTHING_SECRET="sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

6. Ejecutar localmente con **`yarn dev`**

Opcionalmente, ajusta las otras **variables de entorno** para tus necesidades.

## Production Deployment
Puedes desplegar el proyecto en cualquier ambiente productivo virtualizado. Utiliza el `Dockerfile` provisto en el proyecto para crear tu propia imágen y ejecutar el contenedor en tu proveedor de preferencia (Cloud Run, Vercel, AWS EC2, etcétera).

### Habilitar [`standalone` Next Output](https://nextjs.org/docs/app/api-reference/next-config-js/output#automatically-copying-traced-files)
**Importante**: Editar `next.config.js` y establecer el `output` en `standalone`. Esto hace que el build de la app sea unitaria y no dependa del scripting de Next para correr el aplicativo completo. Más información en el link del header.
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
```

### Construcción de la Imágen

```bash
$ cd autogestion-next
$ docker build -t autogestion-next .
# Proceso de build de imágen
# ...
# Crear un contenedor nuevo
$ docker run --name autogestion -p 3000:3000 -e NODE_ENV=production -e MONGODB_URI="mongodb://user:password@host:port/dbName" -e UPLOADTHING_SECRET="sk_live_xxxx" autogestion-next
```

## Discreción Legal
Inicialmente iba a dejar la aplicación open-source, pero debido a unos claims me vi forzado a privatizarla. Actualmente puedes utilizarla, aunque **no tendré obligación de hacerme responsable por su mal utilización**.

**La aplicación no administra, gestiona, guarda ni utiliza los datos de sus usuarios bajo ninguna norma.** Todos los datos son utilizados por la institución oficial por medio de su web service **público**.

No soy responsable por ningún tipo de daño ocasionado a la institución ni a su Web Service utilizando esta aplicación. La aplicación no aparenta ser propia de la institución, ni tampoco lo es. Este es un proyecto "for fun" y no pasa de ello.

Si decides usarlo de forma malintencionada, **tú eres responsable de lo que haces**.
