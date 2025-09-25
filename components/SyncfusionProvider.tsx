"use client";

import { ReactNode, useEffect } from "react";
import { registerLicense } from "@syncfusion/ej2-base";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
import "@syncfusion/ej2-react-buttons/styles/material.css";
import "@syncfusion/ej2-react-popups/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";

// This component will handle Syncfusion setup and render its children
const SyncfusionProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    // Register the license key on the client side
    registerLicense(process.env.NEXT_PUBLIC_SYNCFUSION_LICENSE_KEY!);
  }, []);

  return <>{children}</>;
};

export default SyncfusionProvider;
