import MainDashboard from "./components/Dashboard/MainDashboard";

export default async function Home() {
  return (
    <MainDashboard>
      <div className="flex flex-col items-center justify-center mx-8 text-center">
        <h1 className="my-4 text-xl font-bold">Bienvenido a tu Autogestión</h1>
        <h2 className="my-4 text-sm font-light text-foreground-300">
          Comienza seleccionando una sección desde la barra en la izquierda.
        </h2>
      </div>
    </MainDashboard>
  );
}
