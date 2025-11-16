"use client";

import { useState } from "react";
import HamburgerButton from "./navbar/HamburgerButton";

export default function NavigationBar() {
    const [toggled, setToggled] = useState(false);
    return (
        <div className="z-10 fixed inset-0 size-full grid items-end justify-center p-8 pointer-events-none">
            <HamburgerButton
                toggled={toggled}
                onClick={() => setToggled(prev => !prev)}
                className="bg-white size-14 border border-neutral-200 hover:border-neutral-500 shadow-md rounded-full p-2.5"
            />
        </div>
    )
}