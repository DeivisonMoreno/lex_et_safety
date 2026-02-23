import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar";
import Proceso from "../pages/proceso/Proceso";
import Etapas from "../pages/proceso/Etapas";
import HistoricoGestion from "../pages/proceso/HistoricoGestion";
import { useEffect, useState } from "react";

const DashboardLayout = () => {
  const [idProceso, setIdProceso] = useState<string>("");

  useEffect(() => {
    const storedProceso = localStorage.getItem("idProceso");
    if (storedProceso) setIdProceso(storedProceso);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1 min-h-0 overflow-hidden">
        <div className="h-full p-3">
          <div className="
            h-full min-h-0
            flex flex-col gap-3
            lg:grid lg:grid-cols-12
          ">
            {/* PROCESO */}
            <section className="
              w-full
              lg:col-span-2
              overflow-hidden
            ">
              <div className="
                rounded-lg bg-white shadow
                h-auto
                lg:h-full
              ">
                <Proceso idProceso={idProceso} />
              </div>
            </section>

            {/* ETAPAS */}
            <section className="
              w-full
              lg:col-span-7
              overflow-hidden
            ">
              <div className="
                rounded-lg bg-white shadow
                h-auto
                lg:h-full lg:overflow-y-auto
              ">
                <Etapas idProceso={idProceso} />
              </div>
            </section>

            {/* HISTÓRICO */}
            <section className="
              w-full
              lg:col-span-3
              overflow-hidden
            ">
              <div className="
                rounded-lg bg-white shadow
                h-auto
                lg:h-full lg:overflow-y-auto
              ">
                <HistoricoGestion idProceso={Number(idProceso)} />
              </div>
            </section>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
