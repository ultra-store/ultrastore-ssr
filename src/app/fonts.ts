import localFont from "next/font/local";

export const formular = localFont({
  src: [
    {
      path: "../../public/fonts/Formular/Formular-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Formular/Formular-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "../../public/fonts/Formular/Formular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Formular/Formular-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/Formular/Formular-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/Formular/Formular-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../../public/fonts/Formular/Formular-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Formular/Formular-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../../public/fonts/Formular/Formular-Black.woff2",
      weight: "900",
      style: "normal",
    },
    {
      path: "../../public/fonts/Formular/Formular-BlackItalic.woff2",
      weight: "900",
      style: "italic",
    },
  ],
  variable: "--font-formular",
  display: "swap",
});

