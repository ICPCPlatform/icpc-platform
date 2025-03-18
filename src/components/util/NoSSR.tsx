"use client"
import dynamic from "next/dynamic";

const NoSSR = dynamic(() => import("./NoSSRComp"), { ssr: false });
export default NoSSR;
