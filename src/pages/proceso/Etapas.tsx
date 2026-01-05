import React, { useEffect } from "react";
import Card from "../../components/ui/card/Card";
import { CardBody } from "../../components/ui/card/CardBody";
import {
  XMarkIcon,
  PaperAirplaneIcon,
  FolderIcon,
  FolderOpenIcon,
  PlusCircleIcon,
  NewspaperIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline";
import { CalendarDateRangeIcon } from "@heroicons/react/20/solid";
import { Accordion, AccordionItem } from "../../components/ui/accordion/Accordion";
import LoaderLex from "../loaders/Loader";
import { Modal } from "../../components/modal/Modal";
import { ModalHeader, ModalBody } from "../../components/modal/ModalParts";
import { useModal } from "../../context/ModalContext";
import clsx from "clsx";
import { useAlert } from "../../hooks/useAlert";
import HistoricoSubetapa from "../../components/ui/Historico/HistoricoSubetapa";
import HistoricoPdf from "../../components/ui/Historico/HistoricoPdf";
import { apiFetch } from "../../services/api";

/* =======================
   Types
======================= */
interface ProcesoProps {
  idProceso: string;
}

type SubetapaPayload = {
  idRelacion: number;
  nombreSub: string;
  idRegistroAlterna: number | null;
};

export interface Subetapa {
  subetapa: string;
  ordinal_subetapa: number;
  fecha_marcada: string | null;
  observacion: string | null;
  usuario: string | null;
  fecha_modificacion: string | null;
  pdf: boolean;
  id_relacion_sub: number;
}

export interface EtapaDetalle {
  ordinal_etapa: number;
  subetapas: Subetapa[];
}

export interface EtapasData {
  success: boolean;
  data: {
    datos_subetapas: Record<string, EtapaDetalle>;
  };
}

export interface EtapasAlternas {
  success: boolean;
  data: {
    datos_alternas: Record<
      string,
      {
        id_etapa: number;
        ordinal_etapa: number;
        subetapas: {
          id_tipo_subetapa: number;
          id_relacion_sub: number;
          nombre: string;
          ordinal: number;
        }[];
      }
    >;
  };
}

export interface EtapasAlternasData {
  success: boolean;
  data: {
    [idEtapa: string]: {
      nombre_etapa: string;
      alternas: {
        [nombreAlterna: string]: {
          id_registro: number;
          subetapas: {
            id_relacion_sub: number;
            nombre: string;
            fecha_act: string;
            observacion: string;
            tiene_documento: boolean;
          }[];
        };
      };
    };
  };
}

interface ApiResponse {
  success: boolean;
}

/* =======================
   Component
======================= */
const Etapas: React.FC<ProcesoProps> = ({ idProceso }) => {
  const [info, setInfo] = React.useState<EtapasData | null>(null);
  const [infoAlterna, setInfoAlterna] = React.useState<EtapasAlternas | null>(null);
  const [infoDataAlterna, setInfoDataAlterna] = React.useState<EtapasAlternasData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorC, setError] = React.useState<string | null>(null);

  const [nombreSubetapa, setNombreSubetapa] = React.useState<string | null>(null);
  const [idRelacionSub, setIdRelacionSub] = React.useState<number | null>(null);
  const [fecha, setFecha] = React.useState("");
  const [observacion, setObservacion] = React.useState("");

  const [idAlterna, setIdAlterna] = React.useState<number | null>(null);
  const [idRegistroAlterna, setIdRegistroAlterna] = React.useState<number | null>(null);
  const [nombreAlterna, setNombreAlterna] = React.useState("");
  const [descripcion, setDescripcion] = React.useState("");

  const [usuario, setUsuario] = React.useState("");
  const { success, error } = useAlert();
  const { openModal, closeModal } = useModal();

  useEffect(() => {
    const storedUsuario = localStorage.getItem("usuario");
    if (storedUsuario) setUsuario(storedUsuario);
  }, []);

  /* =======================
     Fetch Data
  ======================= */
  useEffect(() => {
    if (!idProceso) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [sub, alt, altData] = await Promise.all([
          apiFetch<EtapasData>("/subetapas", {
            method: "POST",
            auth: true,
            body: JSON.stringify({ idProceso }),
          }),
          apiFetch<EtapasAlternas>("/subetapasAlternas", {
            method: "POST",
            auth: true,
          }),
          apiFetch<EtapasAlternasData>("/dataSubAlterna", {
            method: "POST",
            auth: true,
            body: JSON.stringify({ idProceso }),
          }),
        ]);

        setInfo(sub);
        setInfoAlterna(alt);
        setInfoDataAlterna(altData);
      } catch {
        setError("No se pudo cargar la información.");
        console.error(errorC);
        
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [idProceso]);

  /* =======================
     Actions
  ======================= */
  const actualizarSubetapaAction = async () => {
    try {
      setLoading(true);

      const res = await apiFetch<ApiResponse>("/updateSubetapa", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          idProceso,
          idRelacionSub,
          fecha,
          observacion,
          usuario,
        }),
      });

      res.success
        ? success("Subetapa actualizada correctamente")
        : error("No se pudo actualizar");
    } catch {
      error("Error actualizando subetapa");
    } finally {
      setLoading(false);
    }
  };

  const crearMedidaAlterna = async () => {
    try {
      setLoading(true);

      const res = await apiFetch<ApiResponse>("/createRegistroAlterna", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          idProceso,
          idAlterna,
          descripcion,
          usuario,
        }),
      });

      res.success
        ? success("Medida alterna creada")
        : error("No se pudo crear");
    } catch {
      error("Error creando medida alterna");
    } finally {
      setLoading(false);
    }
  };

  const actualizarSubetapaAlternaAction = async () => {
    if (!idRegistroAlterna) return;

    try {
      setLoading(true);

      const res = await apiFetch<ApiResponse>("/updateSubetapaAlterna", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          idProceso,
          idRelacionSub,
          fecha,
          observacion,
          usuario,
          idRegistroAlterna,
        }),
      });

      res.success
        ? success("Subetapa alterna actualizada")
        : error("No se pudo actualizar");
    } catch {
      error("Error actualizando subetapa alterna");
    } finally {
      setLoading(false);
    }
  };

  /* =======================
     Derived Data
  ======================= */
  const etapas = info?.data?.datos_subetapas
    ? Object.entries(info.data.datos_subetapas)
    : [];

  const etapasAlternas = infoAlterna?.data?.datos_alternas
    ? Object.entries(infoAlterna.data.datos_alternas)
    : [];

  const editarSubetapa = (payload: SubetapaPayload) => {

    setNombreSubetapa(payload.nombreSub);
    setIdRelacionSub(payload.idRelacion);
    setIdRegistroAlterna(Number(payload.idRegistroAlterna) || null);
    console.log("SET ID REGISTRO => ", payload.idRegistroAlterna);
    openModal('editarSubetapa');
  };

  const editarSubetapaAlterna = (idAlt: number, nombreAlt: string) => {
    setDescripcion('');
    setIdAlterna(idAlt);
    setNombreAlterna(nombreAlt);
    openModal('nuevaAlterna');
  };

  if (loading) return <LoaderLex />;
  return (
    <>
      <Card className="h-full flex flex-col">
        <div className="flex items-center justify-center gap-3 p-4 border-b border-gray-300">
          <div className="bg-green-100 p-3 rounded-lg">
            <NewspaperIcon className="h-6 w-6 text-green-700" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-green-700">
              Información procesal
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Etapas y subetapas del proceso
            </p>
          </div>
        </div>
        <CardBody className="flex-1 overflow-y-auto min-h-0">
          <Accordion
            id="Subetapas"
            tag="section"
            activeItemId="item1"
            shadow="lg"
            color="info"
          >
            {etapas.map(([nombreEtapa, infoEtapa], idx) => (
              <AccordionItem
                key={idx}
                id={`etapa-${idx}`}
                title={nombreEtapa}
                headerTag="h6"
                center={true}
                activeItem
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {infoEtapa.subetapas.map((sub, i) => (
                    <div
                      key={i}
                      onClick={() =>
                        editarSubetapa({
                          idRelacion: sub.id_relacion_sub,
                          nombreSub: sub.subetapa,
                          idRegistroAlterna: null,
                        })
                      }
                      className="
                          rounded-lg border border-slate-200 bg-white
                          shadow-sm hover:shadow-md transition-shadow
                          cursor-pointer
                        "
                    >
                      {/* HEADER */}
                      <div
                        className={clsx(
                          "text-center py-1.5 rounded-t-lg text-[10px] font-medium tracking-wide",
                          sub.fecha_marcada ? "bg-[#1f3b58] text-white" : "bg-slate-300 text-slate-700"
                        )}
                      >
                        {sub.subetapa}
                      </div>

                      {/* BODY */}
                      <div className="flex flex-col gap-1.5 p-2.5">

                        {/* FECHA */}
                        <p className="text-center text-[9px] font-semibold text-slate-800 italic">
                          {sub.fecha_marcada
                            ? new Date(sub.fecha_marcada).toLocaleDateString()
                            : "—"}
                        </p>

                        {/* OBSERVACIÓN */}
                        <p className="text-[10px] text-slate-700 leading-snug text-center">
                          {sub.observacion ?? "Sin gestión"}
                        </p>

                        {/* FOOTER */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                          {sub.usuario && (
                            <p className="text-[8px] text-slate-500 italic">
                              <span className="font-medium">Registrado por:</span>{" "}
                              {sub.usuario}
                            </p>
                          )}

                          {sub.pdf && (
                            <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-md">
                              PDF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="flex gap-3 items-center justify-center  my-2 px-2 py-2 rounded-lg shadow-lg bg-white">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Squares2X2Icon className="h-4 w-4 text-orange-700" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-orange-700">
                  Etapas Alternas
                </h3>
              </div>
            </div>
          </div>
          <Accordion
            id="etapasAlternas"
            tag="section"
            activeItemId="item1"
            shadow="lg"
            color="info"
          >
            {etapasAlternas.map(([nombreEtapa, infoEtapa], idx) => {
              const sub = infoEtapa.subetapas[idx];

              const headers = infoEtapa.subetapas.map(s => s.id_relacion_sub);
              const nombreEtapaAlterna = nombreEtapa.split(" ")[1];

              return (
                <AccordionItem
                  key={idx}
                  id={`etapa-${idx}`}
                  title={nombreEtapa}
                  center
                  activeItem
                >
                  <div className="overflow-x-auto max-w-full">

                    <table className="w-auto border-collapse text-[10px]">

                      {/* HEADER */}
                      <thead className="sticky top-0 bg-sky-50 z-10">
                        <tr>
                          <th className="
                  border-b border-slate-200
                  px-2 py-1.5
                  text-slate-700 font-semibold
                  min-w-[120px]
                  bg-sky-100 text-center
                ">
                            #
                          </th>

                          {infoEtapa.subetapas.map((sub, i) => (
                            <th
                              key={i}
                              className="
                      border-b border-slate-200
                      px-2 py-1.5
                      text-slate-700 font-semibold
                      whitespace-nowrap
                      bg-sky-100 text-center
                      min-w-[120px]
                    "
                            >
                              {sub.nombre}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      {/* BODY */}
                      <tbody>
                        {infoDataAlterna &&
                          Object.entries(infoDataAlterna.data).map(
                            ([idEtapa, etapaAlterna], rowIdx) => {
                              if (Number(idEtapa) !== infoEtapa.id_etapa) return null;

                              return Object.entries(etapaAlterna.alternas).map(
                                ([nombreAlterna, alterna], i) => (
                                  <tr
                                    key={`${rowIdx}-${i}`}
                                    className="hover:bg-sky-50 transition-colors"
                                  >
                                    <td className="
                            sticky left-0
                            border-b border-slate-100
                            px-2 py-1.5
                            font-medium text-slate-700
                            bg-slate-50
                            text-[10px]
                          ">
                                      {nombreAlterna}
                                    </td>

                                    {headers.map((colId, colIdx) => {
                                      const found = alterna.subetapas.find(
                                        (s) => s.id_relacion_sub === colId
                                      );

                                      const relacion = infoEtapa.subetapas[colIdx]?.id_relacion_sub;
                                      const nombreSubAlt = infoEtapa.subetapas[colIdx]?.nombre;

                                      return (
                                        <td
                                          key={colIdx}
                                          className="
                                  border-b border-slate-100
                                  px-2 py-1.5
                                  text-center align-top
                                  cursor-pointer
                                "
                                          onClick={() =>
                                            editarSubetapa({
                                              idRelacion: relacion,
                                              nombreSub: nombreSubAlt,
                                              idRegistroAlterna: Number(alterna.id_registro),
                                            })
                                          }
                                        >
                                          {found ? (
                                            <div className="flex flex-col gap-0.5">
                                              <span className="text-[8.5px] text-slate-500">
                                                {new Date(found.fecha_act).toLocaleDateString()}
                                              </span>

                                              <span className="text-[8.5px] text-slate-500 italic leading-snug">
                                                {found.observacion}
                                              </span>

                                              {found.tiene_documento && (
                                                <span className="
                                        inline-block
                                        text-[8px]
                                        bg-red-500 text-white
                                        px-1.5 py-0.5
                                        rounded
                                      ">
                                                  PDF
                                                </span>
                                              )}
                                            </div>
                                          ) : (
                                            <span className="text-slate-300 text-[10px]">—</span>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                )
                              );
                            }
                          )}
                      </tbody>
                    </table>

                    {/* ACTION */}
                    <button
                      className="
              sticky left-2
              mt-2
              inline-flex items-center gap-1
              px-2 py-1
              rounded-lg
              bg-sky-400
              text-white
              text-[10px]
              shadow-sm
              hover:bg-sky-300
              hover:shadow
              active:bg-sky-500
              transition-all
            "
                      onClick={() =>
                        editarSubetapaAlterna(sub.id_tipo_subetapa, nombreEtapaAlterna)
                      }
                    >
                      <PlusCircleIcon className="h-3.5 w-3.5" />
                      Añadir {nombreEtapaAlterna}
                    </button>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>


        </CardBody>
      </Card >
      <Modal id="editarSubetapa" size="xl" position="top">
        <ModalHeader>
          <div className="flex items-center justify-between px-6 py-4 bg-emerald-50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <CalendarDateRangeIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-emerald-800">
                  {nombreSubetapa}
                </h2>
                <p className="text-xs text-slate-500">
                  Edición de subetapa
                </p>
              </div>
            </div>

            <button
              onClick={() => closeModal("editarSubetapa")}
              className="cursor-pointer rounded-md p-1 text-slate-700 hover:text-slate-400 transition"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="mx-auto w-full max-w-2xl px-6 py-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Fecha
              </label>
              <input
                type="date"
                className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
                onChange={(e) => setFecha(e.target.value)}
                value={fecha}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Observación
              </label>
              <textarea
                rows={5}
                placeholder="Ingrese una observación detallada..."
                className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                onChange={(e) => setObservacion(e.target.value)}
                value={observacion}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2 justify-end">
                <button className="flex items-center gap-2 cursor-pointer rounded-lg bg-sky-200 px-5 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 transition"
                  onClick={() => openModal('editarPdf')}
                >
                  Documentos
                  <FolderIcon className="h-4 w-4" />
                </button>
                <button
                  className="flex items-center gap-2 cursor-pointer rounded-lg bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  onClick={() => {
                    if (idAlterna === null) {
                      actualizarSubetapaAction();
                    } else {
                      actualizarSubetapaAlternaAction();
                    }
                  }}

                >
                  Actualizar
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <HistoricoSubetapa idProceso={idProceso} idRelacionSub={String(idRelacionSub)} />
        </ModalBody>
      </Modal>
      <Modal id="editarPdf" size="xl" position="top">
        <ModalHeader>
          <div className="flex items-center justify-between px-6 py-4 bg-emerald-50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <FolderOpenIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-emerald-800">
                  Cargar PDF {nombreSubetapa}
                </h2>
                <p className="text-xs text-slate-500">
                  Listado de archivos cargados
                </p>
              </div>
            </div>
            <button
              onClick={() => closeModal("editarPdf")}
              className="cursor-pointer rounded-md p-1 text-slate-700 hover:text-slate-400 transition"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody>
          <HistoricoPdf idProceso={idProceso} idRelacionSub={String(idRelacionSub)} />
        </ModalBody>
      </Modal>
      <Modal id="nuevaAlterna" size="xl" position="top">
        <ModalHeader>
          <div className="flex items-center justify-between px-6 py-4 bg-emerald-50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                <PlusCircleIcon className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-emerald-800">
                  Alterna {nombreAlterna}
                </h2>
                <p className="text-xs text-slate-500">
                  Insertar nuevo registro
                </p>
              </div>
            </div>

            <button
              onClick={() => closeModal("nuevaAlterna")}
              className="cursor-pointer rounded-md p-1 text-slate-700 hover:text-slate-400 transition"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="mx-auto w-full max-w-2xl px-6 py-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Nombre
              </label>
              <input
                type="text"
                className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
                onChange={(e) => setDescripcion(e.target.value)}
                value={descripcion}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2 justify-end">
                <button
                  className="flex items-center gap-2 cursor-pointer rounded-lg bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  onClick={() => crearMedidaAlterna()}
                >
                  Agregar
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Etapas;