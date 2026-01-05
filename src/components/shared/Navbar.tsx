import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
} from "@headlessui/react";

import {
    Bars3Icon,
    XMarkIcon,
    UserCircleIcon,
    ChevronDownIcon,
} from "@heroicons/react/24/outline";

import LogoLex from "../../assets/img/logos/logo_lex.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";


const navigation = [
    { name: "Procesos", path: "/procesos" },
    { name: "Nuevo Proceso", path: "/nuevoProceso" },
    { name: "Bases Procesales", path: "/basesProcesales" },
];

const NavBar: React.FC = () => {
    const [usuario, setUsuario] = useState<string>("");
    const { logout } = useAuth();

    useEffect(() => {
        const storedUsuario = localStorage.getItem("usuario");
        if (storedUsuario) {
            setUsuario(storedUsuario);
        }
    }, []);
    return (
        <Disclosure as="nav" className="bg-white shadow-lg rounded-b-lg">
            {({ open }) => (
                <>
                    {/* Desktop */}
                    <div className="mx-auto px-4">
                        <div className="grid h-16 grid-cols-3 items-center">
                            {/* Left - Logo */}
                            <div className="flex items-center gap-2">
                                <img
                                    src={LogoLex}
                                    alt="Logo"
                                    className="h-14 w-auto"
                                />
                                <span className="text-xl text-gray-800 italic font-semibold">
                                    Lex & Safety
                                </span>
                            </div>

                            {/* Center - Navigation */}
                            <div className="hidden md:flex items-center justify-center gap-10">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="relative text-sm font-medium text-gray-600 transition hover:text-blue-600"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Right - User */}
                            <div className="hidden md:flex items-center justify-end gap-3">
                                <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-3 py-1 text-[9px] font-medium text-sky-700 border border-sky-200">
                                    <span>{usuario}</span>
                                </div>

                                <Menu as="div" className="relative">
                                    <MenuButton className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 transition">
                                        <UserCircleIcon className="h-7 w-7 text-gray-700" />
                                        <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                                    </MenuButton>

                                    <MenuItems className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 z-10">
                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    onClick={logout}
                                                    className={`w-full px-4 py-2 text-left text-sm text-red-600 ${active
                                                        ? "bg-gray-100"
                                                        : ""
                                                        }`}
                                                >
                                                    Cerrar sesión
                                                </button>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>

                            {/* Mobile button */}
                            <div className="md:hidden flex justify-end">
                                <DisclosureButton className="rounded-md p-2 hover:bg-gray-200">
                                    {open ? (
                                        <XMarkIcon className="h-6 w-6" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6" />
                                    )}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Panel */}
                    <DisclosurePanel className="md:hidden bg-white border-t">
                        <div className="px-4 py-3 space-y-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className="block rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    {item.name}
                                </Link>
                            ))}

                            <hr />

                            <button
                                onClick={logout}
                                className="w-full text-left rounded-md px-3 py-2 text-red-600 hover:bg-gray-100"
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
};

export default NavBar;
