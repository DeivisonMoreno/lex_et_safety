import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems
} from "@headlessui/react";

import {
    Bars3Icon,
    XMarkIcon,
    BellIcon,
    UserCircleIcon,
    ChevronDownIcon
} from "@heroicons/react/24/outline";
import LogoLex from '../../assets/img/logos/logo_lex.png'
import { Link } from "react-router-dom";

const navigation = [
    { name: "Dashboard", path: "/app" },
    { name: "Reportes", path: "/app/reports" },
    { name: "Inventario", path: "/app/inventory" },
    { name: "Clientes", path: "/app/clients" },
    { name: "Configuración", path: "/app/settings" },
];

const NavBar = () => {
    return (
        <Disclosure as="nav" className="bg-white shadow-md">
            {({ open }) => (
                <>
                    {/* Desktop */}
                    <div className="mx-auto max-w-7xl px-4">
                        <div className="flex h-16 justify-between items-center">

                            {/* Logo */}
                            <div className="flex items-center gap-2">
                                <img
                                    src={LogoLex}
                                    alt="Logo"
                                    className="h-10 w-auto"
                                />
                                <span className="font-semibold text-xl text-gray-800">
                                    Lex Et Safety
                                </span>
                            </div>

                            {/* Desktop Menu */}
                            <div className="hidden md:flex md:items-center md:space-x-8">

                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Notifications */}
                                <button className="relative rounded-full p-2 hover:bg-gray-100 transition">
                                    <BellIcon className="h-6 w-6 text-gray-600" />
                                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                                </button>

                                {/* User Menu */}
                                <Menu as="div" className="relative">
                                    <MenuButton className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 transition">
                                        <UserCircleIcon className="h-7 w-7 text-gray-700" />
                                        <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none"
                                    >
                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    className={`${active ? "bg-gray-100" : ""} w-full px-4 py-2 text-sm text-gray-700 text-left`}
                                                >
                                                    Perfil
                                                </button>
                                            )}
                                        </MenuItem>

                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    className={`${active ? "bg-gray-100" : ""} w-full px-4 py-2 text-sm text-gray-700 text-left`}
                                                >
                                                    Configuración
                                                </button>
                                            )}
                                        </MenuItem>

                                        <hr className="my-1" />

                                        <MenuItem>
                                            {({ active }) => (
                                                <button
                                                    className={`${active ? "bg-gray-100" : ""} w-full px-4 py-2 text-sm text-red-600 text-left`}
                                                >
                                                    Cerrar sesión
                                                </button>
                                            )}
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </div>

                            {/* Mobile button */}
                            <div className="md:hidden flex items-center">
                                <DisclosureButton className="rounded-md p-2 hover:bg-gray-200">
                                    {open ? (
                                        <XMarkIcon className="h-6 w-6 text-gray-800" />
                                    ) : (
                                        <Bars3Icon className="h-6 w-6 text-gray-800" />
                                    )}
                                </DisclosureButton>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Panel */}
                    <DisclosurePanel className="md:hidden bg-white border-t border-gray-200">
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

                            <div className="space-y-1">
                                <button className="w-full text-left rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
                                    Perfil
                                </button>

                                <button className="w-full text-left rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100">
                                    Configuración
                                </button>

                                <button className="w-full text-left rounded-md px-3 py-2 text-red-600 hover:bg-gray-100">
                                    Cerrar sesión
                                </button>
                            </div>
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    );
};

export default NavBar;
