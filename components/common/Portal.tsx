"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({children}:Readonly<{
  children: React.ReactNode;
}>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return mounted
    ? createPortal(children, document.getElementById("modal-root"))
    : null;
}