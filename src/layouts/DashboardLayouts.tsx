import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Proceso from "../pages/proceso/Proceso";
import Etapas from "../pages/proceso/Etapas";
import HistoricoGestion from "../pages/proceso/HistoricoGestion";
import { useEffect, useState } from "react";

const DashboardLayout = () => {

  const [idProceso, setIdProceso] = useState<string>('');

  useEffect(() => {
    const storedProceso = localStorage.getItem('idProceso');
    if (storedProceso) setIdProceso(storedProceso);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-hidden p-3">
        <div className="h-full grid grid-cols-12 gap-3">
          <section className="col-span-2 h-full ">
            <div className="h-full overflow-y-auto rounded-lg bg-white shadow">
              <Proceso idProceso={idProceso} />
            </div>
          </section>
          <section className="col-span-7 h-full overflow-hidden">
            <div className="h-full rounded-lg bg-white shadow">
              <Etapas idProceso={idProceso} />
            </div>
          </section>
          <section className="col-span-3 h-full overflow-hidden">
            <div className="h-full overflow-y-auto rounded-lg bg-white shadow">
              <HistoricoGestion idProceso={Number(idProceso)} />
            </div>
          </section>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
