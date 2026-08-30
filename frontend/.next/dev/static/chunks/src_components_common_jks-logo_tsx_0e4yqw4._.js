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
function JksLogo({ size = "md", href = "/", className = "", imgClassName = "", showSubtitle, priority = true }) {
    const dim = SIZE_MAP[size] || SIZE_MAP.md;
    const content = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `inline-flex items-center gap-2.5 select-none ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: "/images/jks-logo.png",
                alt: "JKS Learning",
                width: dim.width,
                height: dim.height,
                priority: priority,
                className: `object-contain transition-transform duration-200 hover:opacity-95 ${dim.class} ${imgClassName}`
            }, void 0, false, {
                fileName: "[project]/src/components/common/jks-logo.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            showSubtitle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1 border-l border-slate-200 hidden sm:inline-block",
                children: showSubtitle
            }, void 0, false, {
                fileName: "[project]/src/components/common/jks-logo.tsx",
                lineNumber: 44,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/jks-logo.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
    if (href) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: href,
            className: "inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] rounded-lg",
            children: content
        }, void 0, false, {
            fileName: "[project]/src/components/common/jks-logo.tsx",
            lineNumber: 53,
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
]);

//# sourceMappingURL=src_components_common_jks-logo_tsx_0e4yqw4._.js.map