"use client";

import { WebViewerInstance, WebViewerOptions } from "@pdftron/webviewer";
import { useEffect, useRef } from "react";

const PDFViewer: React.FC = () => {
  const viewer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadWebViewer = async () => {
      const WebViewer = (await import("@pdftron/webviewer")).default;
      if (typeof window === "undefined" || !viewer.current) return;

      try {
        const config: WebViewerOptions = {
          path: "/webviewer",
          initialDoc: "/pdf.pdf",
          licenseKey: process.env.NEXT_PUBLIC_APRYSE_KEY,
        };

        const instance: WebViewerInstance = await WebViewer(
          config,
          viewer.current
        );

        instance.Core.documentViewer.addEventListener("documentLoaded", () => {
          instance.UI.setLanguage(instance.UI.Languages.FR);

          const circleAnnot = new instance.Core.Annotations.EllipseAnnotation({
            PageNumber: 1,
            // values are in page coordinates with (0, 0) in the top left
            X: 150,
            Y: 150,
            Width: 300,
            Height: 300,
            Author: instance.Core.annotationManager.getCurrentUser(),
          });

          instance.Core.annotationManager.addAnnotation(circleAnnot);
          instance.Core.annotationManager.redrawAnnotation(circleAnnot);
        });
      } catch (error) {
        console.error("Failed to load WebViewer:", error);
        alert("Failed to load PDF viewer. Please try again later.");
      }
    };

    loadWebViewer();
  }, []);

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50">
      <div
        ref={viewer}
        className="relative h-full w-full overflow-hidden rounded-lg shadow-lg"
      />
    </div>
  );
};

export default PDFViewer;
