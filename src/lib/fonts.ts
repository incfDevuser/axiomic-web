import { Geist_Mono, Inter, Instrument_Serif } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const fontVars = `${inter.variable} ${serif.variable} ${geistMono.variable}`;
