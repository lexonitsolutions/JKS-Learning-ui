(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/common/jks-logo.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JksLogo",
    ()=>JksLogo
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
"use client";
;
;
;
const SIZE_MAP = {
    sm: {
        height: 28,
        width: 140,
        class: "h-7 w-auto"
    },
    md: {
        height: 36,
        width: 180,
        class: "h-9 w-auto"
    },
    lg: {
        height: 44,
        width: 220,
        class: "h-11 w-auto"
    },
    xl: {
        height: 56,
        width: 280,
        class: "h-14 w-auto"
    }
};
function JksLogo({ size = "md", href = "/", className = "", imgClassName = "", showSubtitle, priority = true, variant = "light" }) {
    const dim = SIZE_MAP[size] || SIZE_MAP.md;
    const logoSrc = variant === "dark" ? "/images/jks-logo-white.png" : "/images/jks-logo.png";
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `inline-flex items-center gap-2.5 select-none ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: logoSrc,
                alt: "JKS Learning",
                width: dim.width,
                height: dim.height,
                priority: priority,
                className: `object-contain transition-transform duration-200 hover:opacity-95 ${dim.class} ${imgClassName}`
            }, void 0, false, {
                fileName: "[project]/src/components/common/jks-logo.tsx",
                lineNumber: 38,
                columnNumber: 7
            }, this),
            showSubtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 border-l border-slate-200 hidden sm:inline-block",
                children: showSubtitle
            }, void 0, false, {
                fileName: "[project]/src/components/common/jks-logo.tsx",
                lineNumber: 47,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/jks-logo.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg",
            children: content
        }, void 0, false, {
            fileName: "[project]/src/components/common/jks-logo.tsx",
            lineNumber: 57,
            columnNumber: 7
        }, this);
    }
    return content;
}
_c = JksLogo;
var _c;
__turbopack_context__.k.register(_c, "JksLogo");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/marketing/site-header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SiteHeader",
    ()=>SiteHeader
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-client] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.mjs [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$66XwX3F0$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__x__as__useAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/react/dist/hooks-66XwX3F0.mjs [app-client] (ecmascript) <locals> <export x as useAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__g$3e$__$3c$export__g__as__useUser$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useUser as g> <export g as useUser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/use-mock-auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/motion/use-reduced-motion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$jks$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/jks-logo.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
;
;
const BASE_NAV_LINKS = [
    {
        href: "/courses",
        label: "Courses"
    },
    {
        href: "/ai-mock-interview",
        label: "AI Mock Interview"
    },
    {
        href: "/success-stories",
        label: "Success Stories"
    },
    {
        href: "/about",
        label: "About"
    }
];
function SiteHeader() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scrolled, setScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { isSignedIn, isLoaded: isAuthLoaded, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$66XwX3F0$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__x__as__useAuth$3e$__["useAuth"])();
    const { user: clerkUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__g$3e$__$3c$export__g__as__useUser$3e$__["useUser"])();
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockSession"])();
    const isUserAuthenticated = isAuthLoaded && !!isSignedIn || !!session;
    const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || session?.email || "";
    const userName = clerkUser?.fullName || [
        clerkUser?.firstName,
        clerkUser?.lastName
    ].filter(Boolean).join(" ") || session?.name || userEmail.split("@")[0] || "Student";
    const userRole = session?.role || "student";
    const userAvatar = clerkUser?.imageUrl;
    const userInitials = clerkUser?.firstName && clerkUser?.lastName ? `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`.toUpperCase() : userName.slice(0, 2).toUpperCase();
    const dashboardHref = userRole === "admin" ? "/admin" : userRole === "instructor" ? "/instructor" : "/dashboard";
    // Dynamic Navigation items
    const navLinks = [
        {
            href: "/courses",
            label: "Courses"
        },
        isUserAuthenticated ? {
            href: dashboardHref,
            label: "Dashboard",
            isDashboard: true
        } : {
            href: "/register-course",
            label: "Enroll Now",
            isEnroll: true
        },
        {
            href: "/ai-mock-interview",
            label: "AI Mock Interview"
        },
        {
            href: "/success-stories",
            label: "Success Stories"
        },
        {
            href: "/about",
            label: "About"
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SiteHeader.useEffect": ()=>{
            const onScroll = {
                "SiteHeader.useEffect.onScroll": ()=>setScrolled(window.scrollY > 8)
            }["SiteHeader.useEffect.onScroll"];
            onScroll();
            window.addEventListener("scroll", onScroll, {
                passive: true
            });
            return ({
                "SiteHeader.useEffect": ()=>window.removeEventListener("scroll", onScroll)
            })["SiteHeader.useEffect"];
        }
    }["SiteHeader.useEffect"], []);
    // Close the mobile menu on navigation
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SiteHeader.useEffect": ()=>{
            const timer = setTimeout({
                "SiteHeader.useEffect.timer": ()=>{
                    setMenuOpen(false);
                }
            }["SiteHeader.useEffect.timer"], 0);
            return ({
                "SiteHeader.useEffect": ()=>clearTimeout(timer)
            })["SiteHeader.useEffect"];
        }
    }["SiteHeader.useEffect"], [
        pathname
    ]);
    const handleLogout = async ()=>{
        try {
            if (signOut) {
                await signOut();
            }
        } catch  {}
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutMockSession"])();
        window.location.assign("/");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `sticky top-0 z-50 border-b bg-white/85 text-text-heading backdrop-blur-xl transition-shadow duration-300 ${scrolled ? "border-border shadow-[0_4px_20px_rgba(11,31,58,0.06)]" : "border-transparent"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-16",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$jks$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JksLogo"], {
                        size: "md",
                        className: "py-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/site-header.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "hidden items-center gap-7 md:flex",
                        children: navLinks.map((link)=>{
                            const active = pathname.startsWith(link.href) && link.href !== "/";
                            const isEnroll = link.isEnroll;
                            const isDashboard = link.isDashboard;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: link.href,
                                className: `group relative text-sm font-semibold transition-colors hover:text-text-heading flex items-center gap-1.5 ${active ? "text-primary-blue" : isEnroll ? "text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 hover:bg-blue-100" : isDashboard ? "text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 hover:bg-indigo-100" : "text-text-heading/70"}`,
                                children: [
                                    isEnroll && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 125,
                                        columnNumber: 30
                                    }, this),
                                    isDashboard && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 126,
                                        columnNumber: 33
                                    }, this),
                                    link.label,
                                    !isEnroll && !isDashboard && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: `absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary-blue transition-all duration-300 ease-out ${active ? "w-full" : "w-0 group-hover:w-full"}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 129,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, link.href, true, {
                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                lineNumber: 112,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/marketing/site-header.tsx",
                        lineNumber: 105,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            !isUserAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/login",
                                        className: "hidden text-sm font-semibold text-text-heading/80 transition-colors hover:text-text-heading sm:block px-3 py-1.5 rounded-lg hover:bg-slate-100",
                                        children: "Log in"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 143,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/register",
                                        className: "hidden text-sm font-semibold text-primary-blue bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors hover:bg-blue-100 sm:block",
                                        children: "Register"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 149,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/register-course",
                                        className: "group inline-flex items-center gap-2 rounded-xl bg-primary-blue px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-blue/25 transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary-blue/30",
                                        children: [
                                            "Enroll Now",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 155,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                lineNumber: 142,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: dashboardHref,
                                        className: "flex items-center rounded-full p-0.5 transition-transform hover:scale-105 shrink-0 focus:outline-none",
                                        "aria-label": "Open My Dashboard",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md ring-2 ring-blue-500/30 overflow-hidden",
                                            children: [
                                                userAvatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: userAvatar,
                                                    alt: userName,
                                                    className: "h-full w-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/marketing/site-header.tsx",
                                                    lineNumber: 173,
                                                    columnNumber: 21
                                                }, this) : userInitials,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/marketing/site-header.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/marketing/site-header.tsx",
                                            lineNumber: 171,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 166,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: dashboardHref,
                                        className: "group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 186,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Dashboard"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 187,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                className: "h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 188,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 182,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                lineNumber: 164,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                "aria-label": menuOpen ? "Close menu" : "Open menu",
                                "aria-expanded": menuOpen,
                                onClick: ()=>setMenuOpen((v)=>!v),
                                className: "flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-heading transition-colors hover:bg-bg-light md:hidden cursor-pointer",
                                children: menuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/marketing/site-header.tsx",
                                    lineNumber: 201,
                                    columnNumber: 25
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/marketing/site-header.tsx",
                                    lineNumber: 201,
                                    columnNumber: 53
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/marketing/site-header.tsx",
                        lineNumber: 140,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/marketing/site-header.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].nav, {
                    initial: reducedMotion ? {
                        opacity: 1
                    } : {
                        opacity: 0,
                        height: 0
                    },
                    animate: reducedMotion ? {
                        opacity: 1
                    } : {
                        opacity: 1,
                        height: "auto"
                    },
                    exit: reducedMotion ? {
                        opacity: 0
                    } : {
                        opacity: 0,
                        height: 0
                    },
                    transition: {
                        duration: 0.3,
                        ease: [
                            0.32,
                            0.72,
                            0,
                            1
                        ]
                    },
                    className: "overflow-hidden border-t border-border bg-white/95 backdrop-blur-xl md:hidden",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-1 px-6 py-4",
                        children: [
                            navLinks.map((link, i)=>{
                                const active = pathname.startsWith(link.href) && link.href !== "/";
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                    initial: reducedMotion ? undefined : {
                                        opacity: 0,
                                        x: -12
                                    },
                                    animate: reducedMotion ? undefined : {
                                        opacity: 1,
                                        x: 0
                                    },
                                    transition: {
                                        duration: 0.25,
                                        delay: 0.05 + i * 0.05
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: link.href,
                                        className: `block rounded-lg px-3 py-3 text-base font-medium transition-colors ${active ? "bg-primary-blue/8 text-primary-blue font-bold" : "text-text-heading/80 hover:bg-bg-light hover:text-text-heading"}`,
                                        children: link.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 226,
                                        columnNumber: 21
                                    }, this)
                                }, link.href, false, {
                                    fileName: "[project]/src/components/marketing/site-header.tsx",
                                    lineNumber: 220,
                                    columnNumber: 19
                                }, this);
                            }),
                            !isUserAuthenticated ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: reducedMotion ? undefined : {
                                    opacity: 0,
                                    x: -12
                                },
                                animate: reducedMotion ? undefined : {
                                    opacity: 1,
                                    x: 0
                                },
                                transition: {
                                    duration: 0.25,
                                    delay: 0.05 + navLinks.length * 0.05
                                },
                                className: "mt-2 border-t border-border pt-3 flex flex-col gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/login",
                                        className: "block rounded-lg px-3 py-2.5 text-base font-medium text-text-heading/80 hover:bg-bg-light hover:text-text-heading",
                                        children: "Log in"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 247,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: "/register",
                                        className: "block text-center rounded-xl bg-primary-blue py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-600",
                                        children: "Register"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 253,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                lineNumber: 241,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: reducedMotion ? undefined : {
                                    opacity: 0,
                                    x: -12
                                },
                                animate: reducedMotion ? undefined : {
                                    opacity: 1,
                                    x: 0
                                },
                                transition: {
                                    duration: 0.25,
                                    delay: 0.05 + navLinks.length * 0.05
                                },
                                className: "mt-2 border-t border-border pt-3 flex flex-col gap-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "px-3 py-2 bg-slate-50 rounded-xl mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-slate-900 truncate",
                                                children: userName
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 268,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[11px] text-slate-500 truncate",
                                                children: userEmail
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 269,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 267,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        href: dashboardHref,
                                        className: "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-blue",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 275,
                                                columnNumber: 21
                                            }, this),
                                            " Go to Dashboard"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 271,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleLogout,
                                        className: "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                                lineNumber: 282,
                                                columnNumber: 21
                                            }, this),
                                            " Sign out"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/marketing/site-header.tsx",
                                        lineNumber: 277,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/marketing/site-header.tsx",
                                lineNumber: 261,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/marketing/site-header.tsx",
                        lineNumber: 216,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/marketing/site-header.tsx",
                    lineNumber: 209,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/marketing/site-header.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/marketing/site-header.tsx",
        lineNumber: 97,
        columnNumber: 5
    }, this);
}
_s(SiteHeader, "gvC0pTmfVc5Q3YBSNTP/3lgA4Y4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$66XwX3F0$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__x__as__useAuth$3e$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__g$3e$__$3c$export__g__as__useUser$3e$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockSession"]
    ];
});
_c = SiteHeader;
var _c;
__turbopack_context__.k.register(_c, "SiteHeader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/auth/use-mock-auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "loginWithApi",
    ()=>loginWithApi,
    "loginWithMockCredentials",
    ()=>loginWithMockCredentials,
    "logoutMockSession",
    ()=>logoutMockSession,
    "registerWithApi",
    ()=>registerWithApi,
    "useMockSession",
    ()=>useMockSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$mock$2d$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/mock-users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/session.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$base$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api/base-url.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
const SESSION_CHANGE_EVENT = "jks-mock-session-change";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
function readCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return match?.[1];
}
function subscribe(callback) {
    window.addEventListener(SESSION_CHANGE_EVENT, callback);
    return ()=>window.removeEventListener(SESSION_CHANGE_EVENT, callback);
}
// useSyncExternalStore requires getSnapshot to return a referentially
// stable value when nothing has changed (it compares with Object.is).
// decodeSession() runs JSON.parse, which allocates a new object every call
// — returning that directly caused "getSnapshot should be cached" to fire
// on every render, since React always saw a "new" value. Cache the decoded
// session and only re-decode when the raw cookie string actually changes.
let cachedRaw;
let cachedSnapshot = null;
function getSnapshot() {
    const raw = readCookie(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"]);
    if (raw !== cachedRaw) {
        cachedRaw = raw;
        cachedSnapshot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["decodeSession"])(raw);
    }
    return cachedSnapshot;
}
function getServerSnapshot() {
    return null;
}
function useMockSession() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getSnapshot, getServerSnapshot);
}
_s(useMockSession, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
const INSTRUCTORS_STORAGE_KEY = "jks_admin_instructors_v1";
function getApprovedInstructors() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const stored = localStorage.getItem(INSTRUCTORS_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch  {
    // ignore
    }
    return [
        {
            name: "Dr. Rohit Kapoor",
            email: "instructor@jkslearning.dev",
            initials: "RK",
            role: "Lead Trainer, Java Full Stack"
        },
        {
            name: "Rohit Kapoor",
            email: "rohit.kapoor@jkslearning.com",
            initials: "RK",
            role: "Lead Trainer, Java Full Stack"
        },
        {
            name: "Meera Subramaniam",
            email: "meera.subramaniam@jkslearning.com",
            initials: "MS",
            role: "Lead Trainer, SAP"
        },
        {
            name: "Dev Patil",
            email: "dev.patil@jkslearning.com",
            initials: "DP",
            role: "Lead Trainer, Frontend"
        },
        {
            name: "Aisha Farooqui",
            email: "aisha.farooqui@jkslearning.com",
            initials: "AF",
            role: "AI Interview Design Lead"
        }
    ];
}
function loginWithMockCredentials(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    // First check static MOCK_USERS
    const staticUser = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$mock$2d$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_USERS"].find((u)=>u.email.toLowerCase() === normalizedEmail && u.password === password);
    if (staticUser) {
        // If it's an instructor account, double-check that they are in the approved instructors list
        if (staticUser.role === "instructor") {
            const approved = getApprovedInstructors();
            const isApproved = approved.some((inst)=>inst.email?.toLowerCase() === normalizedEmail || staticUser.email === "instructor@jkslearning.dev");
            if (!isApproved) {
                return {
                    ok: false,
                    error: "Access Denied: You have not been registered as an instructor by an Administrator."
                };
            }
        }
        const session = {
            email: staticUser.email,
            name: staticUser.name,
            initials: staticUser.initials,
            role: staticUser.role
        };
        document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"]}=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeSession"])(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
        window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
        return {
            ok: true,
            session
        };
    }
    // Check dynamically admin-added instructors in localStorage
    const dynamicInstructors = getApprovedInstructors();
    const matchedInstructor = dynamicInstructors.find((inst)=>inst.email?.toLowerCase() === normalizedEmail);
    if (matchedInstructor) {
        // Dynamic instructors accept default password 'instructor123' or 'admin123' or their password
        if (password === "instructor123" || password === "admin123" || password.length >= 6) {
            const session = {
                email: matchedInstructor.email,
                name: matchedInstructor.name,
                initials: matchedInstructor.initials || "IN",
                role: "instructor"
            };
            document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"]}=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeSession"])(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
            window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
            return {
                ok: true,
                session
            };
        }
    }
    return {
        ok: false,
        error: "Invalid email or password."
    };
}
async function loginWithApi(email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    try {
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$base$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: normalizedEmail,
                password
            })
        });
        if (res.ok) {
            const data = await res.json();
            const u = data.user;
            let role = "student";
            if (u.role === "SUPER_ADMIN" || u.role === "ADMIN") {
                role = "admin";
            } else if (u.role === "INSTRUCTOR") {
                role = "instructor";
            }
            const session = {
                email: u.email,
                name: u.name,
                initials: u.name.split(" ").map((n)=>n[0]).join("").toUpperCase().substring(0, 2) || "JK",
                role
            };
            document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"]}=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeSession"])(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
            try {
                localStorage.setItem("jks_auth_user", JSON.stringify({
                    email: u.email,
                    name: u.name,
                    role
                }));
            } catch  {}
            window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
            return {
                ok: true,
                session
            };
        }
        // If backend returned error, check demo accounts first (for offline/demo support)
        const mockRes = loginWithMockCredentials(email, password);
        if (mockRes.ok) return mockRes;
        const errData = await res.json().catch(()=>({}));
        const msg = errData?.message || (res.status === 401 ? "Invalid email or password." : "Login failed. Please check your credentials.");
        return {
            ok: false,
            error: Array.isArray(msg) ? msg.join(", ") : msg
        };
    } catch  {
        // If network or backend unreachable, try demo accounts
        const mockRes = loginWithMockCredentials(email, password);
        if (mockRes.ok) return mockRes;
        return {
            ok: false,
            error: "Could not connect to authentication server. Please check your internet connection."
        };
    }
}
async function registerWithApi(name, email, password) {
    const normalizedEmail = email.trim().toLowerCase();
    try {
        const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$base$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email: normalizedEmail,
                password
            })
        });
        if (res.ok) {
            const data = await res.json();
            const u = data.user;
            const session = {
                email: u.email,
                name: u.name,
                initials: u.name.split(" ").map((n)=>n[0]).join("").toUpperCase().substring(0, 2) || "ST",
                role: "student"
            };
            document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"]}=${(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["encodeSession"])(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
            try {
                localStorage.setItem("jks_auth_user", JSON.stringify({
                    email: u.email,
                    name: u.name,
                    role: "student"
                }));
            } catch  {}
            window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
            return {
                ok: true,
                session
            };
        }
        const errData = await res.json().catch(()=>({}));
        const msg = errData?.message || (res.status === 409 ? "An account with this email address already exists." : "Registration failed. Please try again.");
        return {
            ok: false,
            error: Array.isArray(msg) ? msg.join(", ") : msg
        };
    } catch  {
        return {
            ok: false,
            error: "Could not reach the authentication server. Please check your internet connection."
        };
    }
}
function logoutMockSession() {
    document.cookie = `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$session$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SESSION_COOKIE_NAME"]}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `__session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    document.cookie = `__client_uat=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    try {
        localStorage.removeItem("jks_auth_user");
        localStorage.removeItem("jks_student_avatar_v2");
    } catch  {}
    void (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2f$base$2d$url$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiFetch"])("/auth/logout", {
        method: "POST"
    }).catch(()=>{});
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/motion/gsap.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getGsap",
    ()=>getGsap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/gsap/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/gsap/ScrollTrigger.js [app-client] (ecmascript)");
"use client";
;
;
let registered = false;
function getGsap() {
    if (!registered && ("TURBOPACK compile-time value", "object") !== "undefined") {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"].registerPlugin(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollTrigger"]);
        // Mobile browsers resize the viewport (address bar show/hide) while the
        // user is mid-scroll. ScrollTrigger's default resize handling treats
        // that as a layout change and refreshes, which repins/re-measures
        // whatever is currently pinned (the about-page scroll-hero) mid-gesture
        // and desyncs its start/end from the actual scroll position — the page
        // reads as "stuck" right as the user scrolls into the next section.
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollTrigger"].config({
            ignoreMobileResize: true
        });
        registered = true;
    }
    return {
        gsap: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["gsap"],
        ScrollTrigger: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$gsap$2f$ScrollTrigger$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ScrollTrigger"]
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/motion/lenis-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LenisProvider",
    ()=>LenisProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lenis/dist/lenis.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$gsap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/motion/gsap.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/motion/use-reduced-motion.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function LenisProvider({ children }) {
    _s();
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const lenisRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LenisProvider.useEffect": ()=>{
            if (reducedMotion) return;
            const { gsap, ScrollTrigger } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$gsap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGsap"])();
            const lenis = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lenis$2f$dist$2f$lenis$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]({
                duration: 1.1,
                easing: {
                    "LenisProvider.useEffect": (t)=>1 - Math.pow(1 - t, 3)
                }["LenisProvider.useEffect"],
                smoothWheel: true,
                touchMultiplier: 1.2,
                // Clicking a link to another page while inertia is still running left
                // Lenis animating toward the OLD page's scroll target: onNativeScroll
                // ignores external jumps while isScrolling === "smooth", so Next.js's
                // scroll-to-top on navigation was overwritten next frame and the new
                // page landed mid-scroll, fighting further input ("stuck" scroll).
                // This makes Lenis kill its inertia the moment a same-host link to a
                // different path is clicked.
                stopInertiaOnNavigate: true,
                // Same-page #hash links: scroll smoothly through Lenis instead of the
                // browser's instant jump (which Lenis would ignore mid-animation).
                anchors: true
            });
            lenisRef.current = lenis;
            lenis.on("scroll", {
                "LenisProvider.useEffect": ()=>{
                    try {
                        ScrollTrigger.update();
                    } catch  {
                    // ignore
                    }
                }
            }["LenisProvider.useEffect"]);
            const onStRefresh = {
                "LenisProvider.useEffect.onStRefresh": ()=>{
                    try {
                        lenis.resize();
                    } catch  {
                    // ignore
                    }
                }
            }["LenisProvider.useEffect.onStRefresh"];
            ScrollTrigger.addEventListener("refresh", onStRefresh);
            const onTick = {
                "LenisProvider.useEffect.onTick": (time)=>{
                    try {
                        lenis.raf(time * 1000);
                    } catch  {
                    // ignore
                    }
                }
            }["LenisProvider.useEffect.onTick"];
            gsap.ticker.add(onTick);
            gsap.ticker.lagSmoothing(0);
            return ({
                "LenisProvider.useEffect": ()=>{
                    try {
                        ScrollTrigger.removeEventListener("refresh", onStRefresh);
                        gsap.ticker.remove(onTick);
                        lenis.destroy();
                    } catch  {
                    // ignore
                    }
                    lenisRef.current = null;
                }
            })["LenisProvider.useEffect"];
        }
    }["LenisProvider.useEffect"], [
        reducedMotion
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LenisProvider.useEffect": ()=>{
            const lenis = lenisRef.current;
            if (!lenis) return;
            try {
                lenis.scrollTo(window.scrollY, {
                    immediate: true,
                    force: true
                });
            } catch  {
            // ignore
            }
            const raf = requestAnimationFrame({
                "LenisProvider.useEffect.raf": ()=>{
                    try {
                        const { ScrollTrigger } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$gsap$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getGsap"])();
                        ScrollTrigger.refresh();
                        lenis.resize();
                    } catch  {
                    // ignore
                    }
                }
            }["LenisProvider.useEffect.raf"]);
            return ({
                "LenisProvider.useEffect": ()=>cancelAnimationFrame(raf)
            })["LenisProvider.useEffect"];
        }
    }["LenisProvider.useEffect"], [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/lib/motion/lenis-provider.tsx",
        lineNumber: 101,
        columnNumber: 10
    }, this);
}
_s(LenisProvider, "a8zrnU6CY5C3WOPpTO7UUetIMnE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = LenisProvider;
var _c;
__turbopack_context__.k.register(_c, "LenisProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/motion/use-media-query.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useMediaQuery",
    ()=>useMediaQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useMediaQuery(query) {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])({
        "useMediaQuery.useSyncExternalStore": (callback)=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || !window.matchMedia) {
                return ({
                    "useMediaQuery.useSyncExternalStore": ()=>{}
                })["useMediaQuery.useSyncExternalStore"];
            }
            try {
                const mql = window.matchMedia(query);
                mql.addEventListener("change", callback);
                return ({
                    "useMediaQuery.useSyncExternalStore": ()=>mql.removeEventListener("change", callback)
                })["useMediaQuery.useSyncExternalStore"];
            } catch  {
                return ({
                    "useMediaQuery.useSyncExternalStore": ()=>{}
                })["useMediaQuery.useSyncExternalStore"];
            }
        }
    }["useMediaQuery.useSyncExternalStore"], {
        "useMediaQuery.useSyncExternalStore": ()=>{
            if (("TURBOPACK compile-time value", "object") === "undefined" || !window.matchMedia) return false;
            try {
                return window.matchMedia(query).matches;
            } catch  {
                return false;
            }
        }
    }["useMediaQuery.useSyncExternalStore"], {
        "useMediaQuery.useSyncExternalStore": ()=>false
    }["useMediaQuery.useSyncExternalStore"]);
}
_s(useMediaQuery, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/motion/use-reduced-motion.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useReducedMotion",
    ()=>useReducedMotion
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/motion/use-media-query.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useReducedMotion() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"])("(prefers-reduced-motion: reduce)");
}
_s(useReducedMotion, "AGUsWXV/IGWEYGrGyhqugaEb9zc=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$media$2d$query$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMediaQuery"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0sr9gq2._.js.map