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

export default function Authenticate({ currentUser, setCurrentUser }) {
  const [isOpen, setIsOpen] = useState(currentUser.rollNo === 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target["name"].value;
    const rollNumber = e.target["roll-number"].value;

    try {
      await axios.post("http://localhost:3000/auth/login", {
        name,
        rollNo: rollNumber,
      });

      addToast({
        title: "Registration successful",
        color: "success",
      });

      setCurrentUser({ name, rollNumber: parseInt(rollNumber) });
      setIsOpen(false);
    } catch (error) {
      console.log(error);
      addToast({
        title: "Something went wrong",
        description: "Please try again later",
        color: "danger",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      isDismissable={false}
      isKeyboardDismissDisabled={false}
      classNames={{
        base: "bg-white rounded-lg shadow-lg w-full max-w-md mx-auto",
        backdrop: "bg-gradient-to-b from-blue-50 to-blue-100 backdrop-blur-sm",
      }}
    >
      <form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader className="border-b p-4 text-center">
            <h2 className="text-xl font-bold text-blue-700">
              Enter your details
            </h2>
          </ModalHeader>

          <ModalBody className="p-6 bg-gradient-to-b from-white to-blue-50">
            <div className="space-y-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-gray-700 font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="roll-number"
                  className="text-gray-700 font-medium"
                >
                  Roll Number
                </label>
                <input
                  id="roll-number"
                  name="roll-number"
                  type="number"
                  required
                  className="border-2 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md p-2"
                />
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="border-t p-4 bg-blue-50 flex justify-center">
            <Button
              type="submit"
              color="primary"
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
}
