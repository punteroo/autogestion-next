import MainDashboard from "./components/Dashboard/MainDashboard";

export default async function Home() {
  return (
    <MainDashboard>
      <div className="flex flex-col items-center justify-center mx-8 text-center">
        <h1 className="my-4 text-xl font-bold">Bienvenido a tu Autogestión</h1>
        <h2 className="my-4 text-sm md:hidden font-light text-foreground-300">
          Comienza seleccionando una sección desde la barra en la izquierda.
        </h2>
        <h2 className="my-4 text-sm hidden md:block font-light text-foreground-300">
          Comienza seleccionando una sección arriba.
        </h2>
      </div>
    </MainDashboard>
  );
}
