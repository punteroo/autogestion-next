"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { ClientSection } from "autogestion-frvm/client";
import Link from "next/link";
import { AcademicIcon } from "./Icons/AcademicIcon";
import { BookIcon } from "./Icons/BookIcon";
import { CalendarIcon } from "./Icons/CalendarIcon";
import { ClipboardIcon } from "./Icons/ClipboardIcon";
import { PencilSquareIcon } from "./Icons/PencilSquareIcon";

type NavBarSections_WebProps = {
  pathName: string;
  sections: Array<ClientSection>;
};

export function NavBarSections({
  pathName,
  sections,
}: NavBarSections_WebProps) {
  function isSectionAvailable(section: string): boolean {
    return (
      sections?.find((s) => s?.nombreSeccion === section)?.habilitada ?? false
    );
  }

  return (
    <>
      <Link href="/profile" passHref>
        <div className="lg:w-max md:h-max">
          <span
            className={`text-4xl sm:text-sm font-semibold ${
              pathName === "/profile" ? "text-blue-600" : "text-foreground"
            }`}
          >
            Mi Cuenta
          </span>
        </div>
      </Link>
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <div className="lg:w-max md:h-max">
            <span
              className={`text-4xl sm:text-sm font-semibold ${
                ["/courses/current", "/courses", "/exams"].includes(pathName)
                  ? "text-blue-600"
                  : "text-foreground"
              } cursor-pointer`}
            >
              Académico
            </span>
          </div>
        </DropdownTrigger>
        <DropdownMenu variant="flat">
          <DropdownItem
            key="materiasCursando"
            description="Revisa el estado de tus materias en curso para tu año corriente."
            startContent={<BookIcon />}
            href="/courses/current"
            isDisabled={!isSectionAvailable("materiasCursando")}
          >
            Materias en Curso
          </DropdownItem>
          <DropdownItem
            key="estadoAcademico"
            description="Obtén un resumen de tu progreso académico."
            startContent={<AcademicIcon />}
            href="/courses"
            isDisabled={!isSectionAvailable("estadoAcademico")}
          >
            Estado Académico
          </DropdownItem>
          <DropdownItem
            key="horarioCursado"
            description="Consulta los horarios de tus materias actuales."
            startContent={<CalendarIcon />}
            href="#"
            isDisabled
          >
            Horarios de Cursado
          </DropdownItem>
          <DropdownItem
            key="examenes"
            description="Verifica tus notas de cada exámen final rendido."
            startContent={<ClipboardIcon />}
            href="/exams"
            isDisabled={!isSectionAvailable("examenes")}
          >
            Mis Exámenes Finales
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Dropdown backdrop="blur">
        <DropdownTrigger>
          <div className="lg:w-max md:h-max">
            <span
              className={`text-4xl sm:text-sm font-semibold ${
                ["/exams/inscription", "/courses/inscription"].includes(
                  pathName
                )
                  ? "text-blue-600"
                  : "text-foreground"
              } cursor-pointer`}
            >
              Inscripciones
            </span>
          </div>
        </DropdownTrigger>
        <DropdownMenu variant="flat">
          <DropdownItem
            key="inscripcionExamen"
            description="Realiza tu inscripción a exámen final, o simplemente ve y firma tu libreta."
            startContent={<PencilSquareIcon />}
            href="/exams/inscription"
            isDisabled={!isSectionAvailable("inscripcionExamen")}
          >
            Inscripción a Exámen Final
          </DropdownItem>
          <DropdownItem
            key="inscripcionCursado"
            description="Inscríbete a tus materias de preferencia."
            startContent={<PencilSquareIcon />}
            href="/courses/inscription"
            isDisabled={!isSectionAvailable("inscripcionCursado")}
          >
            Inscripción a Cursado
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {isSectionAvailable("encuestas") ? (
        <Link href="/surveys" passHref>
          <div className="lg:w-max md:h-max">
            <span
              className={`text-4xl sm:text-sm font-semibold ${
                pathName === "/surveys" ? "text-blue-600" : "text-foreground"
              }`}
            >
              Encuestas Docentes
            </span>
          </div>
        </Link>
      ) : (
        <div className="lg:w-max md:h-max select-none cursor-not-allowed">
          <span className="text-4xl sm:text-sm font-semibold text-foreground-200">
            Encuestas Docentes
          </span>
        </div>
      )}
    </>
  );
}
