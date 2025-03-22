import {
  addToast,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import axios from "axios";
import React, { useState } from "react";

export default function Authenticate() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled={false}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();

          const name = e.target["name"].value;
          const rollNumber = e.target["roll-number"].value;

          axios
            .post("http://localhost:3000/auth/login", {
              name,
              rollNo: rollNumber,
            })
            .then(() => {
              addToast({
                title: "Registered successful",
                color: "success",
              });
            })
            .catch(() => {
              addToast({
                title: "Something went wrong",
                description: "Please try again later",
                color: "danger",
              });
            });
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Login</ModalHeader>
          <ModalBody>
            <Input name="name" label="Name:" type="text" required />
            <Input
              name="roll-number"
              label="Roll Number"
              type="number"
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
