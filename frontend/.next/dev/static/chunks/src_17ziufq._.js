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
"[project]/src/components/ui/travel-connect-signin-1.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TravelConnectSignIn",
    ()=>TravelConnectSignIn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.mjs [app-client] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.mjs [app-client] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hook-form/dist/index.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@hookform/resolvers/zod/dist/zod.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__ = __turbopack_context__.i("[project]/node_modules/zod/v4/classic/external.js [app-client] (ecmascript) <export * as z>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/use-mock-auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$mock$2d$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/mock-users.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/motion/use-reduced-motion.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$jks$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/jks-logo.tsx [app-client] (ecmascript)");
// `useSignIn` comes from /legacy on purpose — see handleSocialAuth below.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$66XwX3F0$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__x__as__useAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/react/dist/hooks-66XwX3F0.mjs [app-client] (ecmascript) <locals> <export x as useAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__g$3e$__$3c$export__g__as__useUser$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/react/index.mjs [app-client] (ecmascript) <export useUser as g> <export g as useUser>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$legacy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@clerk/react/dist/legacy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__isClerkAPIResponseError$3e$__ = __turbopack_context__.i("[project]/node_modules/@clerk/shared/dist/_chunks/error-CYyD2kei.mjs [app-client] (ecmascript) <export C as isClerkAPIResponseError>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature();
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
;
;
;
;
;
;
;
;
;
function DotMap() {
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [dimensions, setDimensions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        width: 0,
        height: 0
    });
    const routes = [
        {
            start: {
                x: 100,
                y: 150,
                delay: 0
            },
            end: {
                x: 200,
                y: 80,
                delay: 2
            },
            color: "#2563eb"
        },
        {
            start: {
                x: 200,
                y: 80,
                delay: 2
            },
            end: {
                x: 260,
                y: 120,
                delay: 4
            },
            color: "#2563eb"
        },
        {
            start: {
                x: 50,
                y: 50,
                delay: 1
            },
            end: {
                x: 150,
                y: 180,
                delay: 3
            },
            color: "#2563eb"
        },
        {
            start: {
                x: 280,
                y: 60,
                delay: 0.5
            },
            end: {
                x: 180,
                y: 180,
                delay: 2.5
            },
            color: "#2563eb"
        }
    ];
    function generateDots(width, height) {
        const dots = [];
        const gap = 12;
        const dotRadius = 1;
        for(let x = 0; x < width; x += gap){
            for(let y = 0; y < height; y += gap){
                const isInMapShape = x < width * 0.25 && x > width * 0.05 && y < height * 0.4 && y > height * 0.1 || x < width * 0.25 && x > width * 0.15 && y < height * 0.8 && y > height * 0.4 || x < width * 0.45 && x > width * 0.3 && y < height * 0.35 && y > height * 0.15 || x < width * 0.5 && x > width * 0.35 && y < height * 0.65 && y > height * 0.35 || x < width * 0.7 && x > width * 0.45 && y < height * 0.5 && y > height * 0.1 || x < width * 0.8 && x > width * 0.65 && y < height * 0.8 && y > height * 0.6;
                if (isInMapShape && Math.random() > 0.3) {
                    dots.push({
                        x,
                        y,
                        radius: dotRadius,
                        opacity: Math.random() * 0.5 + 0.2
                    });
                }
            }
        }
        return dots;
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DotMap.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas || !canvas.parentElement) return;
            const resizeObserver = new ResizeObserver({
                "DotMap.useEffect": (entries)=>{
                    const { width, height } = entries[0].contentRect;
                    setDimensions({
                        width,
                        height
                    });
                    canvas.width = width;
                    canvas.height = height;
                }
            }["DotMap.useEffect"]);
            resizeObserver.observe(canvas.parentElement);
            return ({
                "DotMap.useEffect": ()=>resizeObserver.disconnect()
            })["DotMap.useEffect"];
        }
    }["DotMap.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DotMap.useEffect": ()=>{
            if (!dimensions.width || !dimensions.height) return;
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const dots = generateDots(dimensions.width, dimensions.height);
            let animationFrameId;
            let startTime = Date.now();
            function drawDots() {
                ctx.clearRect(0, 0, dimensions.width, dimensions.height);
                dots.forEach({
                    "DotMap.useEffect.drawDots": (dot)=>{
                        ctx.beginPath();
                        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(37, 99, 235, ${dot.opacity})`;
                        ctx.fill();
                    }
                }["DotMap.useEffect.drawDots"]);
            }
            function drawRoutes() {
                const currentTime = (Date.now() - startTime) / 1000;
                routes.forEach({
                    "DotMap.useEffect.drawRoutes": (route)=>{
                        const elapsed = currentTime - route.start.delay;
                        if (elapsed <= 0) return;
                        const duration = 3;
                        const progress = Math.min(elapsed / duration, 1);
                        const x = route.start.x + (route.end.x - route.start.x) * progress;
                        const y = route.start.y + (route.end.y - route.start.y) * progress;
                        ctx.beginPath();
                        ctx.moveTo(route.start.x, route.start.y);
                        ctx.lineTo(x, y);
                        ctx.strokeStyle = route.color;
                        ctx.lineWidth = 1.5;
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.arc(route.start.x, route.start.y, 3, 0, Math.PI * 2);
                        ctx.fillStyle = route.color;
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(x, y, 3, 0, Math.PI * 2);
                        ctx.fillStyle = "#3b82f6";
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(x, y, 6, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
                        ctx.fill();
                        if (progress === 1) {
                            ctx.beginPath();
                            ctx.arc(route.end.x, route.end.y, 3, 0, Math.PI * 2);
                            ctx.fillStyle = route.color;
                            ctx.fill();
                        }
                    }
                }["DotMap.useEffect.drawRoutes"]);
            }
            function animate() {
                drawDots();
                drawRoutes();
                const currentTime = (Date.now() - startTime) / 1000;
                if (currentTime > 15) startTime = Date.now();
                animationFrameId = requestAnimationFrame(animate);
            }
            animate();
            return ({
                "DotMap.useEffect": ()=>cancelAnimationFrame(animationFrameId)
            })["DotMap.useEffect"];
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["DotMap.useEffect"], [
        dimensions
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative h-full w-full overflow-hidden",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
            ref: canvasRef,
            className: "absolute inset-0 h-full w-full"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
            lineNumber: 156,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 155,
        columnNumber: 5
    }, this);
}
_s(DotMap, "cXqnHzuOCnWBsFiNbRuo8tcLfC8=");
_c = DotMap;
const COPY = {
    login: {
        panelTitle: "JKS Learning",
        panelBody: "Sign in to continue your learning journey and pick up where you left off.",
        heading: "Welcome back",
        subheading: "Sign in to your account"
    },
    register: {
        panelTitle: "JKS Learning",
        panelBody: "Create an account for structured courses and AI-evaluated mock interviews.",
        heading: "Create your account",
        subheading: "Start with free demo lessons on any course"
    }
};
const loginSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Enter a valid email address"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(1, "Enter your password")
});
const registerSchema = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].object({
    name: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(2, "Enter your full name"),
    email: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().email("Enter a valid email address"),
    password: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string().min(8, "Password must be at least 8 characters"),
    confirmPassword: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zod$2f$v4$2f$classic$2f$external$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__z$3e$__["z"].string()
}).refine((data)=>data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: [
        "confirmPassword"
    ]
});
const PROVIDER_LABEL = {
    oauth_google: "Google",
    oauth_github: "GitHub"
};
function isClerkErrorLike(val) {
    return typeof val === "object" && val !== null && val.clerkError === true && typeof val.code === "string";
}
function readClerkError(err, strategy) {
    const provider = PROVIDER_LABEL[strategy] ?? "this provider";
    const code = isClerkErrorLike(err) ? err.code : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__isClerkAPIResponseError$3e$__["isClerkAPIResponseError"])(err) ? err.errors?.[0]?.code ?? "" : "";
    if (code === "oauth_provider_not_enabled" || code === "strategy_invalid" || code === "external_account_not_found") {
        return `${provider} sign-in is not enabled on this Clerk instance. Turn on the ${provider} SSO connection in the Clerk dashboard under User & Authentication -> SSO connections.`;
    }
    if (isClerkErrorLike(err)) {
        return err.longMessage || err.message || `Could not sign in with ${provider}.`;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$_chunks$2f$error$2d$CYyD2kei$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__C__as__isClerkAPIResponseError$3e$__["isClerkAPIResponseError"])(err)) {
        const first = err.errors?.[0];
        return first?.longMessage || first?.message || `Could not sign in with ${provider}.`;
    }
    if (err instanceof Error && err.message) {
        return `Could not sign in with ${provider}: ${err.message}`;
    }
    return `Could not sign in with ${provider}. Please try again.`;
}
function TravelConnectSignIn({ mode }) {
    _s1();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const from = searchParams?.get("from") || "/dashboard";
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const copy = COPY[mode];
    const { signIn, isLoaded: isSignInLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$legacy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignIn"])();
    const { isSignedIn, isLoaded: isAuthLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$66XwX3F0$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__x__as__useAuth$3e$__["useAuth"])();
    const { user: clerkUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__g$3e$__$3c$export__g__as__useUser$3e$__["useUser"])();
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockSession"])();
    const [oauthLoading, setOauthLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [oauthError, setOauthError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isAuthenticated = isAuthLoaded && isSignedIn || !!session;
    const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || session?.email || "";
    const userName = clerkUser?.fullName || clerkUser?.firstName || session?.name || "Student";
    // Auto-redirect if already signed in
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TravelConnectSignIn.useEffect": ()=>{
            if (isAuthenticated) {
                const timer = setTimeout({
                    "TravelConnectSignIn.useEffect.timer": ()=>{
                        window.location.assign(from);
                    }
                }["TravelConnectSignIn.useEffect.timer"], 500);
                return ({
                    "TravelConnectSignIn.useEffect": ()=>clearTimeout(timer)
                })["TravelConnectSignIn.useEffect"];
            }
        }
    }["TravelConnectSignIn.useEffect"], [
        isAuthenticated,
        from
    ]);
    // Auto-reset loading state if the redirect does not happen within 15s.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "TravelConnectSignIn.useEffect": ()=>{
            if (!oauthLoading) return;
            const timer = setTimeout({
                "TravelConnectSignIn.useEffect.timer": ()=>setOauthLoading(null)
            }["TravelConnectSignIn.useEffect.timer"], 15000);
            return ({
                "TravelConnectSignIn.useEffect": ()=>clearTimeout(timer)
            })["TravelConnectSignIn.useEffect"];
        }
    }["TravelConnectSignIn.useEffect"], [
        oauthLoading
    ]);
    const handleSocialAuth = async (strategy)=>{
        setOauthError(null);
        // If already signed in, immediately navigate to target
        if (isSignedIn || session) {
            window.location.assign(from);
            return;
        }
        if (!isSignInLoaded || !signIn) {
            setOauthError("Authentication is still loading. Please try again in a moment.");
            return;
        }
        setOauthLoading(strategy);
        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: from
            });
        // On success the browser navigates away; nothing runs after this.
        } catch (err) {
            setOauthLoading(null);
            setOauthError(readClerkError(err, strategy));
            console.error(`[SocialAuth] ${strategy} failed:`, err);
        }
    };
    const cardMotion = reducedMotion ? {} : {
        initial: {
            opacity: 0,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        transition: {
            duration: 0.5
        }
    };
    // If already authenticated, show friendly redirect card
    if (isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
            ...cardMotion,
            className: "flex w-full max-w-md flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-2xl border border-slate-100",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                        className: "h-8 w-8 text-[#2563EB]"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 320,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-xl font-black text-slate-900",
                    children: "Already Signed In"
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 323,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "mt-1 text-xs text-slate-500 font-medium",
                    children: [
                        "You are currently signed in as",
                        " ",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-bold text-slate-800",
                            children: userEmail || userName
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 326,
                            columnNumber: 11
                        }, this),
                        "."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 324,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 flex flex-col gap-3 w-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>window.location.assign(from),
                            className: "flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer",
                            children: [
                                "Go to Dashboard ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 334,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 329,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>{
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["logoutMockSession"])();
                                window.location.assign("/login");
                            },
                            className: "text-xs font-semibold text-slate-500 hover:text-slate-800 py-2 transition-colors cursor-pointer",
                            children: "Sign in with a different account"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 336,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 328,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
            lineNumber: 316,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        ...cardMotion,
        className: "flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-100",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative hidden h-[620px] w-1/2 overflow-hidden border-r border-slate-100 md:block",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-100/70",
                    children: [
                        !reducedMotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DotMap, {}, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 359,
                            columnNumber: 30
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 z-10 flex flex-col items-center justify-center p-8 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FadeIn, {
                                    reducedMotion: reducedMotion,
                                    delay: 0.6,
                                    className: "mb-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-indigo-600 shadow-xl shadow-blue-500/25",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                            className: "h-7 w-7 text-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                            lineNumber: 364,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                        lineNumber: 363,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 362,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FadeIn, {
                                    reducedMotion: reducedMotion,
                                    delay: 0.7,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "mb-2 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-3xl font-black text-transparent",
                                        children: copy.panelTitle
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                        lineNumber: 368,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 367,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FadeIn, {
                                    reducedMotion: reducedMotion,
                                    delay: 0.8,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "max-w-xs text-sm text-slate-600 font-medium leading-relaxed",
                                        children: copy.panelBody
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                        lineNumber: 373,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 372,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 358,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 357,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex w-full flex-col justify-center bg-white p-6 sm:p-8 md:w-1/2 md:p-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FadeIn, {
                    reducedMotion: reducedMotion,
                    delay: 0,
                    y: 20,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$jks$2d$logo$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JksLogo"], {
                                    size: "md"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 383,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-[11px] font-bold text-[#2563EB]",
                                    children: mode === "login" ? "Secure Login" : "New Account"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 384,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-black text-slate-900 tracking-tight",
                            children: copy.heading
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 389,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "mt-1 mb-6 text-xs text-slate-500 font-medium",
                            children: copy.subheading
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 390,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 grid grid-cols-2 gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: oauthLoading !== null,
                                    className: "flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all duration-300 hover:bg-slate-100 hover:border-slate-300 cursor-pointer disabled:opacity-60",
                                    onClick: ()=>handleSocialAuth("oauth_google"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GoogleIcon, {}, void 0, false, {
                                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                            lineNumber: 399,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: oauthLoading === "oauth_google" ? "Connecting…" : "Google"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                            lineNumber: 400,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 393,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    disabled: oauthLoading !== null,
                                    className: "flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 p-2.5 text-xs font-bold text-slate-700 shadow-xs transition-all duration-300 hover:bg-slate-100 hover:border-slate-300 cursor-pointer disabled:opacity-60",
                                    onClick: ()=>handleSocialAuth("oauth_github"),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GithubIcon, {}, void 0, false, {
                                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                            lineNumber: 411,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: oauthLoading === "oauth_github" ? "Connecting…" : "GitHub"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                            lineNumber: 412,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 405,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 392,
                            columnNumber: 11
                        }, this),
                        oauthError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            role: "alert",
                            className: "mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium leading-relaxed text-red-700",
                            children: oauthError
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 419,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative my-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 flex items-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-full border-t border-slate-200"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                        lineNumber: 429,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 428,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative flex justify-center text-xs uppercase font-bold tracking-wider",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "bg-white px-3 text-slate-400",
                                        children: "or"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                        lineNumber: 432,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                    lineNumber: 431,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 427,
                            columnNumber: 11
                        }, this),
                        mode === "login" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginFields, {}, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 436,
                            columnNumber: 31
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RegisterFields, {}, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 436,
                            columnNumber: 49
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            id: "clerk-captcha"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 437,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 381,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 352,
        columnNumber: 5
    }, this);
}
_s1(TravelConnectSignIn, "ECdZTG27ZLgv5LWl+oUFc6LfW+c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$legacy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSignIn"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$react$2f$dist$2f$hooks$2d$66XwX3F0$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__$3c$export__x__as__useAuth$3e$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$clerk$2f$shared$2f$dist$2f$react$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__useUser__as__g$3e$__$3c$export__g__as__useUser$3e$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockSession"]
    ];
});
_c1 = TravelConnectSignIn;
function FadeIn({ children, reducedMotion, delay, y = -20, className }) {
    if (reducedMotion) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 457,
        columnNumber: 29
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y
        },
        animate: {
            opacity: 1,
            y: 0
        },
        transition: {
            delay,
            duration: 0.5
        },
        className: className,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 459,
        columnNumber: 5
    }, this);
}
_c2 = FadeIn;
function PasswordInput({ id, visible, onToggle, className, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                id: id,
                type: visible ? "text" : "password",
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500", className),
                ...props
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 479,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                className: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700",
                onClick: onToggle,
                tabIndex: -1,
                children: visible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 494,
                    columnNumber: 20
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                    size: 18
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 494,
                    columnNumber: 43
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 488,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 478,
        columnNumber: 5
    }, this);
}
_c3 = PasswordInput;
function SubmitButton({ children, disabled }) {
    _s2();
    const reducedMotion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"])();
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
        whileHover: reducedMotion ? undefined : {
            scale: 1.01
        },
        whileTap: reducedMotion ? undefined : {
            scale: 0.98
        },
        onHoverStart: ()=>setIsHovered(true),
        onHoverEnd: ()=>setIsHovered(false),
        className: "pt-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "submit",
            disabled: disabled,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:from-blue-600 hover:to-indigo-700 disabled:pointer-events-none disabled:opacity-60", isHovered && !reducedMotion ? "shadow-lg shadow-blue-200" : ""),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "flex items-center justify-center",
                    children: [
                        children,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                            className: "ml-2 h-4 w-4"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 528,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 526,
                    columnNumber: 9
                }, this),
                isHovered && !reducedMotion && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                    initial: {
                        left: "-100%"
                    },
                    animate: {
                        left: "100%"
                    },
                    transition: {
                        duration: 1,
                        ease: "easeInOut"
                    },
                    className: "absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent",
                    style: {
                        filter: "blur(8px)"
                    }
                }, void 0, false, {
                    fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                    lineNumber: 531,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
            lineNumber: 518,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 511,
        columnNumber: 5
    }, this);
}
_s2(SubmitButton, "fUkXu1v+bAvB+mpv/Fa0o/0cjes=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$motion$2f$use$2d$reduced$2d$motion$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useReducedMotion"]
    ];
});
_c4 = SubmitButton;
// Hard navigation, not router.push() — see (auth)/layout.tsx / proxy.ts:
// /login, /admin, /dashboard are force-dynamic but the client Router Cache
// can still replay a stale prefetch captured under a different auth state.
// A full navigation always re-evaluates proxy.ts fresh.
function redirectAfterLogin(role, from) {
    const fallback = role === "admin" ? "/admin" : role === "instructor" ? "/instructor" : "/dashboard";
    window.location.assign(from ?? fallback);
}
function LoginFields() {
    _s3();
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const [visible, setVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [quickLoginRole, setQuickLoginRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(loginSchema)
    });
    const onSubmit = async (values)=>{
        setFormError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginWithApi"])(values.email, values.password);
        if (!result.ok) {
            setFormError(result.error);
            return;
        }
        redirectAfterLogin(result.session.role, searchParams.get("from"));
    };
    // Testing convenience — skip typing the demo credentials. Wired to the
    // same MOCK_USERS the real form validates against, so it can never drift
    // out of sync with what the demo-credentials hint below actually says.
    const quickLogin = (role)=>{
        const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$mock$2d$users$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MOCK_USERS"].find((u)=>u.role === role);
        if (!user) return;
        setQuickLoginRole(role);
        const result = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["loginWithMockCredentials"])(user.email, user.password);
        if (!result.ok) {
            setQuickLoginRole(null);
            setFormError(result.error);
            return;
        }
        redirectAfterLogin(result.session.role, searchParams.get("from"));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-2 text-center text-xs font-semibold tracking-wide text-gray-400 uppercase",
                        children: "Testing — instant demo access"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 594,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>quickLogin("student"),
                                disabled: quickLoginRole !== null,
                                className: "rounded-lg border border-gray-200 bg-gray-50 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-60",
                                children: quickLoginRole === "student" ? "Signing in…" : "Student"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 598,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>quickLogin("instructor"),
                                disabled: quickLoginRole !== null,
                                className: "rounded-lg border border-purple-200 bg-purple-50 py-2 text-xs font-semibold text-purple-700 transition-colors hover:bg-purple-100 disabled:pointer-events-none disabled:opacity-60",
                                children: quickLoginRole === "instructor" ? "Signing in…" : "Lecturer"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 606,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>quickLogin("admin"),
                                disabled: quickLoginRole !== null,
                                className: "rounded-lg border border-blue-200 bg-blue-50 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 disabled:pointer-events-none disabled:opacity-60",
                                children: quickLoginRole === "admin" ? "Signing in…" : "Admin"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 614,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 597,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 593,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full border-t border-gray-200"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 627,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 626,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative flex justify-center text-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "bg-white px-2 text-gray-500",
                            children: "or continue manually"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 630,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 629,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 625,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: "space-y-5",
                onSubmit: handleSubmit(onSubmit),
                noValidate: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "login-email",
                                className: "mb-1 block text-sm font-medium text-gray-700",
                                children: [
                                    "Email ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-500",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                        lineNumber: 637,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 636,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                id: "login-email",
                                type: "email",
                                autoComplete: "email",
                                placeholder: "Enter your email address",
                                className: "w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500",
                                ...register("email")
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 639,
                                columnNumber: 11
                            }, this),
                            errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-red-600",
                                children: errors.email.message
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 647,
                                columnNumber: 28
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 635,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                htmlFor: "login-password",
                                className: "mb-1 block text-sm font-medium text-gray-700",
                                children: [
                                    "Password ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-blue-500",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                        lineNumber: 652,
                                        columnNumber: 22
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 651,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PasswordInput, {
                                id: "login-password",
                                autoComplete: "current-password",
                                placeholder: "Enter your password",
                                visible: visible,
                                onToggle: ()=>setVisible((v)=>!v),
                                ...register("password")
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 654,
                                columnNumber: 11
                            }, this),
                            errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-1 text-sm text-red-600",
                                children: errors.password.message
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 663,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 650,
                        columnNumber: 9
                    }, this),
                    formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-red-600",
                        children: formError
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 667,
                        columnNumber: 23
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/forgot-password",
                            className: "text-sm text-blue-600 transition-colors hover:text-blue-700",
                            children: "Forgot password?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                            lineNumber: 670,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 669,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubmitButton, {
                        disabled: isSubmitting,
                        children: isSubmitting ? "Signing in…" : "Sign in"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 678,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-6 text-center text-sm text-gray-500",
                        children: [
                            "Don't have an account?",
                            " ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/register",
                                className: "font-semibold text-blue-600 hover:underline",
                                children: "Sign up"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 684,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 682,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 634,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 592,
        columnNumber: 5
    }, this);
}
_s3(LoginFields, "m6ITvuRwT5P2rD8UiIadWO2HFGQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c5 = LoginFields;
function RegisterFields() {
    _s4();
    const [passwordVisible, setPasswordVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [confirmVisible, setConfirmVisible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formError, setFormError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const searchParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"])();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"])({
        resolver: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$hookform$2f$resolvers$2f$zod$2f$dist$2f$zod$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["zodResolver"])(registerSchema)
    });
    const onSubmit = async (values)=>{
        setFormError(null);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["registerWithApi"])(values.name, values.email, values.password);
        if (!result.ok) {
            setFormError(result.error);
            return;
        }
        redirectAfterLogin("student", searchParams.get("from"));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        className: "space-y-5",
        onSubmit: handleSubmit(onSubmit),
        noValidate: true,
        children: [
            formError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-red-600",
                children: formError
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 716,
                columnNumber: 21
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "register-name",
                        className: "mb-1 block text-sm font-medium text-gray-700",
                        children: [
                            "Full name ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-blue-500",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 720,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 719,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "register-name",
                        type: "text",
                        autoComplete: "name",
                        placeholder: "Enter your full name",
                        className: "w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500",
                        ...register("name")
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 722,
                        columnNumber: 9
                    }, this),
                    errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-red-600",
                        children: errors.name.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 730,
                        columnNumber: 25
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 718,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "register-email",
                        className: "mb-1 block text-sm font-medium text-gray-700",
                        children: [
                            "Email ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-blue-500",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 735,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 734,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        id: "register-email",
                        type: "email",
                        autoComplete: "email",
                        placeholder: "Enter your email address",
                        className: "w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500",
                        ...register("email")
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 737,
                        columnNumber: 9
                    }, this),
                    errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-red-600",
                        children: errors.email.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 745,
                        columnNumber: 26
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 733,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "register-password",
                        className: "mb-1 block text-sm font-medium text-gray-700",
                        children: [
                            "Password ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-blue-500",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 750,
                                columnNumber: 20
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 749,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PasswordInput, {
                        id: "register-password",
                        autoComplete: "new-password",
                        placeholder: "Enter your password",
                        visible: passwordVisible,
                        onToggle: ()=>setPasswordVisible((v)=>!v),
                        ...register("password")
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 752,
                        columnNumber: 9
                    }, this),
                    errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-red-600",
                        children: errors.password.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 760,
                        columnNumber: 29
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 748,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "register-confirm",
                        className: "mb-1 block text-sm font-medium text-gray-700",
                        children: [
                            "Confirm password ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-blue-500",
                                children: "*"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                                lineNumber: 765,
                                columnNumber: 28
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 764,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PasswordInput, {
                        id: "register-confirm",
                        autoComplete: "new-password",
                        placeholder: "Re-enter your password",
                        visible: confirmVisible,
                        onToggle: ()=>setConfirmVisible((v)=>!v),
                        ...register("confirmPassword")
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 767,
                        columnNumber: 9
                    }, this),
                    errors.confirmPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mt-1 text-sm text-red-600",
                        children: errors.confirmPassword.message
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 776,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 763,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SubmitButton, {
                disabled: isSubmitting,
                children: isSubmitting ? "Creating account…" : "Create account"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 780,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-6 text-center text-sm text-gray-500",
                children: [
                    "Already have an account?",
                    " ",
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/login",
                        className: "font-semibold text-blue-600 hover:underline",
                        children: "Log in"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                        lineNumber: 786,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 784,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 715,
        columnNumber: 5
    }, this);
}
_s4(RegisterFields, "14SqaorQ4yEADjbj3PVfM4O4hAs=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSearchParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hook$2d$form$2f$dist$2f$index$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useForm"]
    ];
});
_c6 = RegisterFields;
function GoogleIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "h-5 w-5",
        viewBox: "0 0 24 24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "currentColor",
                fillOpacity: ".54",
                d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 797,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#4285F4",
                d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 802,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#34A853",
                d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 806,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#FBBC05",
                d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 810,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                fill: "#EA4335",
                fillOpacity: "0",
                d: "M1 1h22v22H1z"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
                lineNumber: 814,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 796,
        columnNumber: 5
    }, this);
}
_c7 = GoogleIcon;
function GithubIcon({ className = "h-5 w-5" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            fillRule: "evenodd",
            clipRule: "evenodd",
            d: "M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        }, void 0, false, {
            fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
            lineNumber: 822,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/travel-connect-signin-1.tsx",
        lineNumber: 821,
        columnNumber: 5
    }, this);
}
_c8 = GithubIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8;
__turbopack_context__.k.register(_c, "DotMap");
__turbopack_context__.k.register(_c1, "TravelConnectSignIn");
__turbopack_context__.k.register(_c2, "FadeIn");
__turbopack_context__.k.register(_c3, "PasswordInput");
__turbopack_context__.k.register(_c4, "SubmitButton");
__turbopack_context__.k.register(_c5, "LoginFields");
__turbopack_context__.k.register(_c6, "RegisterFields");
__turbopack_context__.k.register(_c7, "GoogleIcon");
__turbopack_context__.k.register(_c8, "GithubIcon");
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
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_17ziufq._.js.map