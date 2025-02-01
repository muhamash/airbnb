import type { Metadata } from "next";
import React from 'react';

export const metadata: Metadata = {
  title: "Airbnb || Authentication system!!",
  description: "Generated by github.com/muhamash ; Instructed by LWS(learn with sumit)",
};

interface LayoutProps {
    children: React.ReactNode;
    modal?: React.ReactNode;
}


export default async function Layout ( { children, modal }: LayoutProps) {
  return (
    <>
      {modal}
      {children}
    </>
  );
}
