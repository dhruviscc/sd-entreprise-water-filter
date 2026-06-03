"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface EnquiryContextProps {
  isOpen: boolean;
  interestName: string;
  interestType: "general" | "service" | "product";
  openEnquiry: (name: string, type: "general" | "service" | "product") => void;
  closeEnquiry: () => void;
}

const EnquiryContext = createContext<EnquiryContextProps | undefined>(undefined);

export const EnquiryProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [interestName, setInterestName] = useState("");
  const [interestType, setInterestType] = useState<"general" | "service" | "product">("general");

  const openEnquiry = (name: string, type: "general" | "service" | "product") => {
    setInterestName(name);
    setInterestType(type);
    setIsOpen(true);
  };

  const closeEnquiry = () => {
    setIsOpen(false);
    setInterestName("");
    setInterestType("general");
  };

  return (
    <EnquiryContext.Provider
      value={{ isOpen, interestName, interestType, openEnquiry, closeEnquiry }}
    >
      {children}
    </EnquiryContext.Provider>
  );
};

export const useEnquiry = () => {
  const context = useContext(EnquiryContext);
  if (!context) {
    throw new Error("useEnquiry must be used within an EnquiryProvider");
  }
  return context;
};
