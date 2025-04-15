"use client";
import dynamic from "next/dynamic";

/**
 * This component is used to render a component that should not be rendered on the server.
 */
const NoSSR = dynamic(() => import("./NoSSRComp"), { ssr: false });
export default NoSSR;
