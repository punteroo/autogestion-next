"use client";

import { useEffect, useState } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarBrand,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { ClientSection } from "autogestion-frvm/client";
import { useDashboard } from "../context/DashboardContext";
import axios from "axios";
import NavBarLogOut from "./NavBarLogOut";
import { motion } from "framer-motion";
import { NexusLogo } from "./Icons/NexusLogo";
import { usePathname } from "next/navigation";
import { NavBarSections } from "./NavBarSections";

type NavBarCategory = {
  name: string;
  items: Array<NavBarSection> | NavBarSection;
};

type NavBarSection = {
  name: string;
  shortName?: string;
  section?: ClientSection["nombreSeccion"];
  icon: any;
  href: string;
  color?: string;
  metadata?: ClientSection;
};

export default function NavBar() {
  const { data: session } = useSession();
  const user = session?.user!;

  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { sections, setSections } = useDashboard();

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

    fetchSections();
  }, []);

  // Obtain the current pathname.
  const pathName = usePathname();

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        shouldHideOnScroll
        maxWidth="xl"
        height="5.5rem"
      >
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
            className="hidden sm:flex gap-4 lg:gap-12 w-full"
            justify="center"
          >
            <NavBarSections pathName={pathName} sections={sections} />
          </NavbarContent>
        </motion.div>
        <NavbarContent justify="end">
          <NavbarItem className="flex flex-col gap-1 items-center">
            <NavBarLogOut />
            <p className="text-center text-sm font-bold text-foreground-400">
              {user?.firstName} {user?.lastName}
            </p>
          </NavbarItem>
        </NavbarContent>
        <NavbarMenu>
          <NavBarSections pathName={pathName} sections={sections} />
        </NavbarMenu>
      </Navbar>
    </>
  );
}
