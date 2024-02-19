"use client";

import { Student } from "@/lib/models/student.model";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { parseStudentRole } from "../../Profile/ProfileCard";
import { HamburgerIcon } from "../../Icons/HamburgerIcon";
import { SpeechBubbleIcon } from "../../Icons/SpeechBubbleIcon";
import { ClipboardIcon } from "../../Icons/ClipboardIcon";
import { DeniedIcon } from "../../Icons/DeniedIcon";
import { FlagIcon } from "../../Icons/FlagIcon";

type UserCardProps = {
  user: Partial<Student>;
};

export function UserCard({ user }: UserCardProps) {
  return (
    <>
      <div className="flex justify-between items-center border-foreground-200 border-1 rounded-xl px-4 py-2">
        <User
          name={`${user.lastName}, ${user.name}`.toUpperCase()}
          description={parseStudentRole(user?.role ?? null)}
          avatarProps={{
            src: user?.profilePicture ?? "/avatar.jpg",
          }}
        />
        <div>
          <Dropdown backdrop="blur">
            <DropdownTrigger>
              <Button variant="ghost">
                <HamburgerIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              variant="flat"
              aria-label="Acciones de Usuario"
              disabledKeys={["chat", "files", "block", "report"]}
            >
              <DropdownSection title="Acciones" showDivider>
                <DropdownItem
                  key="chat"
                  description={`Conversa con ${user.name}`}
                  startContent={<SpeechBubbleIcon />}
                >
                  Iniciar Chat
                </DropdownItem>
                <DropdownItem
                  key="files"
                  description={`Índice de archivos públicos de ${user.name}`}
                  startContent={<ClipboardIcon />}
                >
                  Aportes Públicos
                </DropdownItem>
              </DropdownSection>
              <DropdownSection title="Zona Peligrosa">
                <DropdownItem
                  key="block"
                  startContent={<DeniedIcon />}
                  color="danger"
                  className="text-danger"
                >
                  Bloquear a {user.name}
                </DropdownItem>
                <DropdownItem
                  key="report"
                  startContent={<FlagIcon />}
                  color="danger"
                  className="text-danger"
                >
                  Reportar a {user.name}
                </DropdownItem>
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
