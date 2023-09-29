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

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user!;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const { sections, setSections } = useContext(DashboardContext);

  // Disallow non-mobile devices.
  const size = useWindowSize();
  useEffect(() => setIsMobile(size.width! < 640), [size]);

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
    icon: any;
    href: string;
    color?: string;
    metadata?: ClientSection;
  }> = [
    {
      name: "Mi Cuenta",
      icon: <UserIcon />,
      href: "/profile",
    },
    {
      name: "Mi Estado Académico",
      section: "estadoAcademico",
      icon: <BookIcon />,
      href: "/courses",
    },
    {
      name: "Mis Materias",
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
      section: "examenes",
      icon: <AcademicIcon />,
      href: "/exams",
    },
    {
      name: "Inscripción a Exámenes",
      section: "inscripcionExamen",
      icon: <AcademicIcon />,
      href: "/exams/inscription",
    },
    {
      name: "Encuestas Docentes",
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

  return (
    <>
      {isMobile ? null : (
        <Modal
          isOpen={true}
          isDismissable={false}
          hideCloseButton
          isKeyboardDismissDisabled
          size="full"
        >
          <ModalContent className="h-full">
            <ModalBody className="text-center my-auto">
              <div className="flex flex-col my-auto gap-12">
                <h1 className="text-3xl font-bold">
                  Dispositivo No Compatible
                </h1>
                <p>
                  Esta aplicación no es compatible con dispositivos de
                  escritorio.
                </p>
                <p>
                  Por favor, ingrese a la aplicación desde un dispositivo móvil.
                </p>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      <Navbar onMenuOpenChange={setIsMenuOpen} shouldHideOnScroll>
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
        </NavbarContent>

        <NavbarContent justify="end">
          <NavbarItem>
            <NavBarLogOut />
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          <NavbarMenuItem>
            <h2 className="text-center font-bold text-foreground">
              ¿Cómo estás {user?.firstName ?? 'alumno'}?
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
