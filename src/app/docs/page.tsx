"use client";
import dynamic from "next/dynamic";
// import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });
export default function DocsPage() {
    return (
        <main style={{ padding: 16, backgroundColor: 'white', height: '100vh' }}>
            <div style={{ border: "1px solid #e6e6e6", borderRadius: 8, overflow: "hidden" }}>
                <SwaggerUI url="/docs/base.json" />
            </div>
        </main>
    );
}
