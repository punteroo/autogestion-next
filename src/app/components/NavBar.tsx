"use client";

import { useContext, useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  Modal,
  ModalBody,
  ModalContent,
  NavbarBrand,
} from "@nextui-org/react";
import { UserIcon } from "./Icons/UserIcon";
import { BookIcon } from "./Icons/BookIcon";
import { useSession } from "next-auth/react";
import { ClientSection } from "autogestion-frvm/client";
import Link from "next/link";
import { DashboardContext } from "../context/DashboardContext";
import axios from "axios";
import NavBarLogOut from "./NavBarLogOut";
import { AcademicIcon } from "./Icons/AcademicIcon";
import { DocumentCheckIcon } from "./Icons/DocumentCheckIcon";
import { motion } from "framer-motion";
import { NexusLogo } from "./Icons/NexusLogo";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user!;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { sections, setSections } = useContext(DashboardContext);

  useEffect(() => {
    async function fetchSections() {
      console.log(
        `${NavBar.name}::Refetching sections... (debug: ${sections.length}L)`
      );

      try {
        const { data } = await axios<ClientSection[]>({
          method: "GET",
          url: "/api/autogestion/sections",
        });

        // Set the new sections.
        setSections(data);
      } catch (e) {
        console.error(e);
      }
    }

    if (sections?.length < 1 || typeof sections === "undefined")
      fetchSections();
  }, [sections, setSections]);

  const menuItems: Array<{
    section?: ClientSection["nombreSeccion"];
    name?: string;
    shortName?: string;
    icon: any;
    href: string;
    color?: string;
    metadata?: ClientSection;
  }> = [
    {
      name: "Mi Cuenta",
      shortName: "Cuenta",
      icon: <UserIcon />,
      href: "/profile",
    },
    {
      name: "Mi Estado Académico",
      shortName: "Estado Académico",
      section: "estadoAcademico",
      icon: <BookIcon />,
      href: "/courses",
    },
    {
      name: "Mis Materias",
      shortName: "Materias",
      section: "materiasCursando",
      icon: <BookIcon />,
      href: "/courses/current",
    },
    /* {
      name: "Horarios Cursado",
      section: "horarioCursado",
      icon: <CalendarIcon />,
      href: "/schedule",
    }, */
    {
      name: "Mis Exámenes",
      shortName: "Exámenes",
      section: "examenes",
      icon: <AcademicIcon />,
      href: "/exams",
    },
    {
      name: "Inscripción a Exámenes",
      shortName: "Inscripción Finales",
      section: "inscripcionExamen",
      icon: <AcademicIcon />,
      href: "/exams/inscription",
    },
    {
      name: "Encuestas Docentes",
      shortName: "Encuestas",
      section: "encuestas",
      icon: <DocumentCheckIcon />,
      href: "/surveys",
    },
  ];

  // Filter non-implemented sections out.
  const filteredSections = [...menuItems.filter((item) => !item?.section)];
  for (const section of sections) {
    // Find the menu item that matches the section.
    const menuItem = menuItems.find(
      (item) => item?.section === section.nombreSeccion
    );

    // If the menu item exists, add it to the filtered sections.
    if (menuItem) {
      if (!menuItem?.name) menuItem["name"] = section.descripcion;
      menuItem["metadata"] = section;

      filteredSections.push(menuItem);
    }
  }

  // Obtain the current pathname.
  const pathName = usePathname();

  return (
    <>
      <Navbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand className="flex gap-4">
            <NexusLogo />
            <p className="font-bold text-inherit">NEXUS</p>
          </NavbarBrand>
        </NavbarContent>

        <motion.div
          key={filteredSections.length}
          initial={{
            opacity: 0,
            y: -5,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        >
          <NavbarContent
            className="hidden sm:flex gap-4 w-full"
            justify="center"
          >
            {filteredSections.map((item, index) => (
              <NavbarMenuItem
                className="text-center w-full"
                key={`${item.name}-${index}`}
              >
                {
                  // If the section is not enabled, disable the item. Allow items that do not have an assigned section however, these are custom.
                  !item.metadata?.habilitada && item?.section?.length ? (
                    <span className="text-sm font-semibold text-foreground-400 cursor-not-allowed">
                      {item?.shortName ?? item.name}
                    </span>
                  ) : (
                    <Link href={item.href} passHref>
                      <span
                        className={`text-sm font-semibold ${
                          pathName === item.href
                            ? "text-blue-600"
                            : "text-foreground"
                        }`}
                      >
                        {item?.shortName ?? item.name}
                      </span>
                    </Link>
                  )
                }
              </NavbarMenuItem>
            ))}
          </NavbarContent>
        </motion.div>
        <NavbarContent justify="end">
          <NavbarItem>
            <NavBarLogOut />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <h2 className="text-center font-bold text-foreground">
              ¿Cómo estás {user?.firstName ?? "alumno"}?
            </h2>
          </NavbarMenuItem>
          {filteredSections.map((item, index) => (
            <NavbarMenuItem
              className="text-center w-full"
              key={`${item.name}-${index}`}
            >
              {
                // If the section is not enabled, disable the button. Allow items that do not have an assigned section however, these are custom.
                !item.metadata?.habilitada && item?.section?.length ? (
                  <Button
                    className="w-full"
                    color="default"
                    isDisabled={true}
                    startContent={item.icon}
                  >
                    {item.name}
                  </Button>
                ) : (
                  <Link href={item.href} passHref>
                    <Button
                      className="w-full"
                      color={(item?.color as any) ?? "default"}
                      startContent={item.icon}
                    >
                      {item.name}
                    </Button>
                  </Link>
                )
              }
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </>
  );
}
