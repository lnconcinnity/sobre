"use client";

import IndexHero from "./components/IndexHero";
import IndexProcedures from "./components/IndexProcedures";
import IndexTestimonies from "./components/IndexTestimonies";
import IndexWhy from "./components/IndexWhy";

export default function IndexPage() {
    return (
        <>
        { /* Hero */}
        <IndexHero />
        { /* Our procedures */ }
        <IndexProcedures />
        { /* Why us */}
        <IndexWhy />
        { /* Testimonies */ }
        <IndexTestimonies />
        </>
    );
}