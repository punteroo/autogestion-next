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
} from "@nextui-org/react";
import { UserIcon } from "./Icons/UserIcon";
import { BookIcon } from "./Icons/BookIcon";
import { useSession } from "next-auth/react";
import { UserSession } from "../api/auth/[...nextauth]/route";
import { ClientSection } from "autogestion-frvm/client";
import Link from "next/link";
import { DashboardContext } from "../context/DashboardContext";
import axios from "axios";
import NavBarLogOut from "./NavBarLogOut";
import { CalendarIcon } from "./Icons/CalendarIcon";
import { AcademicIcon } from "./Icons/AcademicIcon";
import { DocumentCheckIcon } from "./Icons/DocumentCheckIcon";

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user as UserSession;

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
  });

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
            ¿Cómo estás {user.firstName}?
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
                <Link href={item.href}>
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
  );
}
