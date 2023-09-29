"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { StudentCourse } from "autogestion-frvm/courses";

export default function CurrentCourseGrades({
  name,
  grades,
}: {
  name: string;
  grades: StudentCourse["notas"];
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{name}</ModalHeader>
              <ModalBody>
                <Table
                  hideHeader
                  bottomContent={
                    <Card>
                      <CardHeader>
                        <h4 className="text-md font-semibold mx-auto">Resumen</h4>
                      </CardHeader>
                      <Divider />
                      <CardBody>
                        <div className="flex justify-center gap-4 w-full">
                          <div className="w-full text-center">
                            <h4 className="text-md font-semibold">Promedio</h4>
                            <p className="text-sm font-light text-foreground-500">
                              {(
                                grades!.reduce((acc, grade) => {
                                  return acc + +grade.notaNumero;
                                }, 0) / grades!.length
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  }
                  aria-label="Notas"
                >
                  <TableHeader>
                    <TableColumn>Nro.</TableColumn>
                    <TableColumn>Nota</TableColumn>
                    <TableColumn>Estado</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {grades!.map((grade, i) => {
                      return (
                        <TableRow key={i}>
                          <TableCell className="font-bold text-foreground">
                            Parcial #{i + 1}
                          </TableCell>
                          <TableCell>
                            {grade.notaNumero} ({grade.notaLetra.toUpperCase()})
                          </TableCell>
                          <TableCell>
                            <Chip
                              size="sm"
                              className={`text-xs px-1.5 ${
                                grade.estado === "APROBADO"
                                  ? "bg-green-200 text-green-600"
                                  : "bg-red-200 text-red-600"
                              }`}
                            >
                              {grade.estado}
                            </Chip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Link onClick={onOpen}>
        Ver
      </Link>
    </>
  );
}
