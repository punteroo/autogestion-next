"use client";

import {
  Button,
  Card,
  CardBody,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { AvailableExam, ExamTurnTime } from "autogestion-frvm/types";

type EnrolledExamEntryProps = {
  exam: AvailableExam;
  voidEnrollment: (exam: AvailableExam) => Promise<void>;
};

export default function EnrolledExamEntry({
  exam,
  voidEnrollment,
}: EnrolledExamEntryProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function mapTurnToVisual(turnName: ExamTurnTime): string {
    switch (turnName) {
      case "NOCHE":
        return "Turno Nocturno";
      case "MANANA":
        return "Turno Matutino";
      case "TARDE":
        return "Turno Vespertino";
      default:
        return "Turno Desconocido";
    }
  }

  return (
    <>
      <Card>
        <CardBody className="grid grid-cols-2 gap-3 justify-items-center text-center">
          <div className="flex flex-col my-auto">
            <p className="text-md font-bold">
              {exam.nombreMateria} ({exam.plan})
            </p>
          </div>
          <div className="flex flex-col my-auto">
            <p className="text-small text-default-500">
              Práctico: {exam?.horarioPractico ?? "N/A"}
            </p>
            <p className="text-small text-default-500">
              Teórico: {exam?.horarioTeorico ?? "N/A"}
            </p>
            <Popover placement="right-end">
              <PopoverTrigger>
                <p className="text-small text-default-500">
                  <span className="text-primary-200">CS</span>: {exam.checksum}
                </p>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-xs text-default-500 text-center">
                  Tu checksum de inscripción. Número generado para garantizar tu
                  inscripción a exámen final.
                </p>
              </PopoverContent>
            </Popover>
          </div>
          <div className="w-full col-span-2">
            <p className="text-small text-default-500">{exam.inscripto}</p>
          </div>
          <Divider className="col-span-2" />
          <div className="flex flex-col justify-self-center col-span-2 my-auto w-full">
            <Button
              className="my-auto w-full"
              color="danger"
              onClick={() => {
                onOpen();
              }}
            >
              Anular
            </Button>
          </div>
        </CardBody>
      </Card>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={"top"}
        backdrop={"blur"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Anular inscripción a{" "}
                <span className="font-bold">{exam.nombreMateria}</span>
              </ModalHeader>
              <ModalBody>
                <p>
                  Estás por anular tu inscripción a exámen final de la materia.
                </p>
                <p>
                  Recuerda que siempre puedes volver a inscribirte dentro del
                  rango de días de inscripción a exámen final.
                </p>
                <p>¿Estás seguro que deseas anular tu inscripción?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onClick={onClose}>
                  No quiero anular
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    onClose();
                    voidEnrollment(exam);
                  }}
                >
                  Sí, anula mi inscripción
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
