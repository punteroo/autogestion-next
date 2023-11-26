"use client";

export default function About() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-full">
      <h1 className="text-3xl font-bold text-center text-slate-100">
        Acerca de <b>NEXUS</b>
      </h1>
      <div className="flex flex-col gap-2 text-sm text-center text-slate-100 w-[75%]">
        <p>
          Este proyecto es un hobby personal que comencé a desarrollar por ahí
          en Agosto de 2023. La finalidad de este proyecto era afianzarme mejor
          con mi entorno de Node tanto en diseño como en lógica (ya que mi
          fuerte es y siempre fue el arquitectónico en backend), además de poder
          ofrecer un autogestión más moderno a la solución actual (y utilizable
          en iOS).
        </p>
        <p>
          Consiste de un trabajo combinado entre ingeniería inversa del
          webservice de autogestión de la{" "}
          <a
            href="https://frvm.utn.edu.ar/"
            target="_blank"
            className="text-blue-400"
          >
            UTN FRVM
          </a>
          , con su contraparte en front end + backend. Actualmente este proyecto
          está en beta, por lo que muchas cosas pueden fallar.{" "}
          <span className="text-red-300">
            Debido a las restricciones impuestas por la universidad
          </span>
          , tengo prohibido divulgar el source code de esta plataforma y del
          wrapper. Si estabas interesado en conocer sobre el proyecto, lamento
          que no puedas indagar más que eso.
        </p>
        <p>
          Si es de tu interés, la plataforma está hecha en{" "}
          <a
            href="https://nextjs.org"
            target="_blank"
            className="text-blue-300 font-semibold"
          >
            Next 13
          </a>
          , y hace uso de{" "}
          <span className="underline underline-offset-3">
            un paquete custom privado de Node
          </span>{" "}
          que wrappea la API de Autogestión de la UTN FRVM para fácil acceso a
          sus funciones dentro del backend. Ambas partes son desarrolladas por
          mí, por lo que están privadas por la misma razón que mencioné arriba.
          Para el estilado y diseño principal, utilizo siempre{" "}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            className="text-blue-300 font-semibold"
          >
            TailwindCSS
          </a>{" "}
          sumado a{" "}
          <a
            href="https://nextui.org"
            target="_blank"
            className="text-blue-300 font-semibold"
          >
            NextUI
          </a>
          , una hermosa librería de componentes 100% compatible con Next 13.
        </p>
      </div>
    </div>
  );
}
