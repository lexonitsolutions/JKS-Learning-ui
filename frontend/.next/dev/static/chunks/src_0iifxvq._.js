(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CourseLearningHubPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-play.mjs [app-client] (ecmascript) <export default as PlayCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.mjs [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/award.mjs [app-client] (ecmascript) <export default as Award>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-client] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-check.mjs [app-client] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-check.mjs [app-client] (ecmascript) <export default as FileCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-tree.mjs [app-client] (ecmascript) <export default as FolderTree>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/book-open.mjs [app-client] (ecmascript) <export default as BookOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.mjs [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/calendar.mjs [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.mjs [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$captions$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Subtitles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/captions.mjs [app-client] (ecmascript) <export default as Subtitles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/smartphone.mjs [app-client] (ecmascript) <export default as Smartphone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-client] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/thumbs-up.mjs [app-client] (ecmascript) <export default as ThumbsUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/external-link.mjs [app-client] (ecmascript) <export default as ExternalLink>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2d$xml$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/code-xml.mjs [app-client] (ecmascript) <export default as Code2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$courses$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/courses-store.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$in$2d$app$2d$video$2d$player$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ui/in-app-video-player.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/enrollments-api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/auth/use-mock-auth.ts [app-client] (ecmascript)");
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
function TwitterIcon({ className = "h-4 w-4" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        }, void 0, false, {
            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
            lineNumber: 63,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_c = TwitterIcon;
function LinkedinIcon({ className = "h-4 w-4" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
        }, void 0, false, {
            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
            lineNumber: 71,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
_c1 = LinkedinIcon;
function YoutubeIcon({ className = "h-4 w-4" }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        fill: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
        }, void 0, false, {
            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
            lineNumber: 79,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
        lineNumber: 78,
        columnNumber: 5
    }, this);
}
_c2 = YoutubeIcon;
function CourseLearningHubPage({ params }) {
    _s();
    const resolvedParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["use"])(params);
    const slug = resolvedParams.slug;
    const session = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockSession"])();
    const [course, setCourse] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeVideo, setActiveVideo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeSectionId, setActiveSectionId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [completedVideoIds, setCompletedVideoIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [completedAssignmentIds, setCompletedAssignmentIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [assignmentScores, setAssignmentScores] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // Active Tab below Video (Udemy style)
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("overview");
    const [showSchedulerBanner, setShowSchedulerBanner] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showSchedulerModal, setShowSchedulerModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Q&A State
    const [qaSearch, setQaSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [showAskModal, setShowAskModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [newQuestionTitle, setNewQuestionTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [newQuestionBody, setNewQuestionBody] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [questionsList, setQuestionsList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: "q-1",
            author: "Rahul Sharma",
            avatar: "/images/hero-developer.png",
            title: "How does Virtual Thread scheduling differ from ForkJoinPool in Java 21?",
            timeAgo: "2 days ago",
            lecture: "02. Modern Java 21 Features",
            upvotes: 14,
            replies: 3,
            hasInstructorResponse: true
        },
        {
            id: "q-2",
            author: "Priya Patel",
            avatar: "/images/student-3d-developer.png",
            title: "Getting ClassNotFoundException when packaging Spring Boot JAR with custom dependencies",
            timeAgo: "4 days ago",
            lecture: "04. Spring Boot 3 Core",
            upvotes: 8,
            replies: 2,
            hasInstructorResponse: true
        }
    ]);
    // Notes State
    const [newNoteText, setNewNoteText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [notesList, setNotesList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            id: "note-1",
            timestamp: "01:24",
            lecture: "01. JVM Architecture & Memory",
            text: "JVM Heap vs Metaspace memory layout. Heap stores object instances, Metaspace stores class metadata."
        }
    ]);
    // Active assignment modal & cert modal
    const [activeAssignmentSection, setActiveAssignmentSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showCertModal, setShowCertModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load course & real-time progress on mount or slug change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CourseLearningHubPage.useEffect": ()=>{
            const userEmail = session?.email || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientSessionEmail"])();
            const loadData = {
                "CourseLearningHubPage.useEffect.loadData": async ()=>{
                    const loadedCourse = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$courses$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFullCourseBySlug"])(slug) || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$courses$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStoredCourses"])()[0];
                    if (loadedCourse) {
                        setCourse(loadedCourse);
                        // Fetch persisted video & assignment progress from Supabase DB
                        try {
                            const prog = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchCourseProgress"])(slug, userEmail);
                            let initialVideos = prog.completedVideoIds || [];
                            let initialAssignments = prog.completedAssignmentIds || [];
                            // Also check fallback local cache
                            if (initialVideos.length === 0 && ("TURBOPACK compile-time value", "object") !== "undefined") {
                                try {
                                    const localKey = `jks_prog_${slug}_${userEmail || "student"}`;
                                    const fallbackKey = `jks_prog_${slug}_student`;
                                    const cached = localStorage.getItem(localKey) || localStorage.getItem(fallbackKey);
                                    if (cached) {
                                        const parsed = JSON.parse(cached);
                                        if (parsed.completedVideoIds?.length > 0) {
                                            initialVideos = parsed.completedVideoIds;
                                        }
                                        if (parsed.completedAssignmentIds?.length > 0) {
                                            initialAssignments = parsed.completedAssignmentIds;
                                        }
                                    }
                                } catch  {}
                            }
                            if (initialVideos.length > 0) {
                                setCompletedVideoIds(initialVideos);
                            }
                            if (initialAssignments.length > 0) {
                                setCompletedAssignmentIds(initialAssignments);
                            }
                            // Batch sync to backend to ensure DB is current
                            if (userEmail && (initialVideos.length > 0 || initialAssignments.length > 0)) {
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncAllCourseProgress"])({
                                    courseSlug: slug,
                                    studentEmail: userEmail,
                                    completedVideoIds: initialVideos,
                                    completedAssignmentIds: initialAssignments
                                }).catch({
                                    "CourseLearningHubPage.useEffect.loadData": ()=>{}
                                }["CourseLearningHubPage.useEffect.loadData"]);
                            }
                        } catch (e) {
                            console.warn("Could not load backend progress:", e);
                        }
                        // Find first video
                        let firstVid = null;
                        let firstSecId = "";
                        for (const sec of loadedCourse.sections || []){
                            if (sec.subsections && sec.subsections.length > 0 && sec.subsections[0].videos.length > 0) {
                                firstVid = sec.subsections[0].videos[0];
                                firstSecId = sec.id;
                                break;
                            } else if (sec.directVideos && sec.directVideos.length > 0) {
                                firstVid = sec.directVideos[0];
                                firstSecId = sec.id;
                                break;
                            }
                        }
                        if (firstVid) {
                            setActiveVideo(firstVid);
                            setActiveSectionId(firstSecId);
                        }
                    }
                }
            }["CourseLearningHubPage.useEffect.loadData"];
            loadData();
        }
    }["CourseLearningHubPage.useEffect"], [
        slug,
        session?.email
    ]);
    if (!course) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#F8FAFC]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm font-semibold text-slate-600",
                children: "Loading course curriculum…"
            }, void 0, false, {
                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                lineNumber: 234,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
            lineNumber: 233,
            columnNumber: 7
        }, this);
    }
    // Calculate total items for overall progress (6 videos + 3 assignments = 9)
    const allVideos = [];
    const allSections = course.sections || [];
    allSections.forEach((sec)=>{
        if (sec.subsections) {
            sec.subsections.forEach((sub)=>{
                allVideos.push(...sub.videos);
            });
        }
        if (sec.directVideos) {
            allVideos.push(...sec.directVideos);
        }
    });
    const totalItems = allVideos.length + allSections.length;
    const completedCount = completedVideoIds.length + completedAssignmentIds.length;
    const overallPercent = totalItems > 0 ? Math.min(100, Math.round(completedCount / totalItems * 100)) : 0;
    const isCourseComplete = overallPercent >= 100;
    const handleVideoCompleted = async (vidId)=>{
        const userEmail = session?.email || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientSessionEmail"])();
        const updatedVideos = completedVideoIds.includes(vidId) ? completedVideoIds : [
            ...completedVideoIds,
            vidId
        ];
        setCompletedVideoIds(updatedVideos);
        // Persist real-time progress to Supabase Backend
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncAllCourseProgress"])({
                courseSlug: slug,
                studentEmail: userEmail,
                completedVideoIds: updatedVideos,
                completedAssignmentIds
            });
        } catch (err) {
            console.warn("Failed to persist video progress to backend:", err);
        }
    };
    const handleSelectVideo = (vid, secId)=>{
        setActiveVideo(vid);
        setActiveSectionId(secId);
    };
    const handleSubmitAssignment = async (sec)=>{
        const asgId = sec.assignment.id;
        const updatedAssignments = completedAssignmentIds.includes(asgId) ? completedAssignmentIds : [
            ...completedAssignmentIds,
            asgId
        ];
        setCompletedAssignmentIds(updatedAssignments);
        setAssignmentScores((prev)=>({
                ...prev,
                [asgId]: 94
            }));
        setActiveAssignmentSection(null);
        const userEmail = session?.email || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getClientSessionEmail"])();
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$enrollments$2d$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["syncAllCourseProgress"])({
                courseSlug: slug,
                studentEmail: userEmail,
                completedVideoIds,
                completedAssignmentIds: updatedAssignments
            });
        } catch (e) {
            console.warn("Failed to save assignment progress:", e);
        }
    };
    const handleAddNote = ()=>{
        if (!newNoteText.trim()) return;
        const note = {
            id: `note-${Date.now()}`,
            timestamp: "02:15",
            lecture: activeVideo?.title || "Current Lecture",
            text: newNoteText
        };
        setNotesList([
            note,
            ...notesList
        ]);
        setNewNoteText("");
    };
    const handlePostQuestion = (e)=>{
        e.preventDefault();
        if (!newQuestionTitle.trim()) return;
        const q = {
            id: `q-${Date.now()}`,
            author: "Jordan Dsouza",
            avatar: "/images/hero-developer.png",
            title: newQuestionTitle,
            timeAgo: "Just now",
            lecture: activeVideo?.title || "Current Lecture",
            upvotes: 1,
            replies: 0,
            hasInstructorResponse: false
        };
        setQuestionsList([
            q,
            ...questionsList
        ]);
        setNewQuestionTitle("");
        setNewQuestionBody("");
        setShowAskModal(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col bg-[#F8FAFC] text-slate-800 overflow-x-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-30 flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 sm:py-0 sm:px-6 sm:h-16 gap-3 backdrop-blur-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 sm:gap-4 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dashboard/courses",
                                className: "flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 348,
                                        columnNumber: 13
                                    }, this),
                                    " Courses"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 344,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-4 w-[1px] bg-slate-200 hidden sm:block"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md",
                                        children: course.title
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 352,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-400 font-medium",
                                        children: [
                                            allSections.length,
                                            " Sections · ",
                                            allVideos.length,
                                            " Video Lessons"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 355,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 351,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between sm:justify-end gap-3 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-left sm:text-right",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-extrabold text-slate-900",
                                        children: [
                                            overallPercent,
                                            "% Completed"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-500 font-medium",
                                        children: [
                                            completedCount,
                                            " of ",
                                            totalItems,
                                            " Milestones Completed"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 366,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 362,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-2 w-20 sm:w-32 rounded-full bg-slate-100 overflow-hidden shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500",
                                    style: {
                                        width: `${overallPercent}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 371,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 370,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                        lineNumber: 361,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                lineNumber: 342,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-1 min-w-0 flex-col lg:flex-row overflow-x-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-1 min-w-0 flex-col p-3 sm:p-5 lg:p-6 space-y-5",
                        children: [
                            activeVideo ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$in$2d$app$2d$video$2d$player$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["InAppVideoPlayer"], {
                                        title: activeVideo.title,
                                        videoUrl: activeVideo.videoUrl,
                                        videoType: activeVideo.videoType,
                                        durationFormatted: activeVideo.durationFormatted,
                                        antiSkip: true,
                                        onVideoCompleted: ()=>handleVideoCompleted(activeVideo.id)
                                    }, activeVideo.id, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 386,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-sm sm:text-base font-bold text-slate-900 truncate",
                                                        children: activeVideo.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 399,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-1 flex items-center gap-2 text-xs text-slate-500",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: [
                                                                    "Duration: ",
                                                                    activeVideo.durationFormatted
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "•"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-mono text-[11px] uppercase text-[#2563EB]",
                                                                children: activeVideo.videoType === "upload" ? "Uploaded Lecture" : "Private Stream"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 403,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 400,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 398,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 shrink-0",
                                                children: completedVideoIds.includes(activeVideo.id) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 412,
                                                            columnNumber: 23
                                                        }, this),
                                                        " Lesson Completed"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>handleVideoCompleted(activeVideo.id),
                                                    className: "flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 420,
                                                            columnNumber: 23
                                                        }, this),
                                                        " Mark Completed"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 409,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 397,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 385,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex aspect-video items-center justify-center rounded-2xl bg-slate-950 text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-400",
                                    children: "Select a video lesson from the curriculum to begin."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 428,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 427,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-[24px] border border-slate-200 bg-white shadow-xs overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1 border-b border-slate-200 px-4 sm:px-6 overflow-x-auto bg-slate-50/50",
                                        children: [
                                            {
                                                id: "curriculum",
                                                label: "Curriculum & Lessons",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"],
                                                mobileOnly: true
                                            },
                                            {
                                                id: "overview",
                                                label: "Overview",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$book$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BookOpen$3e$__["BookOpen"]
                                            },
                                            {
                                                id: "qa",
                                                label: "Q&A",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"]
                                            },
                                            {
                                                id: "notes",
                                                label: "Notes",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"]
                                            },
                                            {
                                                id: "announcements",
                                                label: "Announcements",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"]
                                            },
                                            {
                                                id: "reviews",
                                                label: "Reviews",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"]
                                            },
                                            {
                                                id: "tools",
                                                label: "Learning Tools",
                                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2d$xml$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code2$3e$__["Code2"]
                                            }
                                        ].map((tab)=>{
                                            const isActive = activeTab === tab.id;
                                            const Icon = tab.icon;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setActiveTab(tab.id),
                                                className: `flex items-center gap-2 border-b-2 px-4 py-3.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${tab.mobileOnly ? "lg:hidden " : ""}${isActive ? "border-[#2563EB] text-[#2563EB]" : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                                        className: "h-3.5 w-3.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 462,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: tab.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 463,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, tab.id, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 450,
                                                columnNumber: 19
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 sm:p-8",
                                        children: [
                                            activeTab === "curriculum" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "lg:hidden space-y-6 max-w-4xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-base sm:text-lg font-bold text-slate-900",
                                                                        children: "Course Curriculum & Video Lessons"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 476,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-slate-500 font-medium mt-0.5",
                                                                        children: [
                                                                            allSections.length,
                                                                            " Sections · ",
                                                                            allVideos.length,
                                                                            " Video Lessons · ",
                                                                            totalItems,
                                                                            " Milestones"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 479,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 475,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-left sm:text-right",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-xs font-bold text-[#2563EB]",
                                                                                children: [
                                                                                    overallPercent,
                                                                                    "% Completed"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 486,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-[10px] text-slate-400",
                                                                                children: [
                                                                                    completedCount,
                                                                                    "/",
                                                                                    totalItems,
                                                                                    " Done"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 487,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 485,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    isCourseComplete && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setShowCertModal(true),
                                                                        className: "flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs cursor-pointer",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                                                className: "h-4 w-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 495,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            " Certificate"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 490,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 484,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 474,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: allSections.map((sec, secIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between bg-slate-50/80 p-3.5 border-b border-slate-100",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB] text-[11px] font-bold text-white",
                                                                                        children: secIdx + 1
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 512,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs sm:text-sm font-bold text-slate-900",
                                                                                        children: sec.title
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 515,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 511,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] text-slate-400 font-medium",
                                                                                children: [
                                                                                    sec.subsections ? sec.subsections.reduce((acc, s)=>acc + s.videos.length, 0) : sec.directVideos?.length || 0,
                                                                                    " Lessons"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 519,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 510,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    sec.subsections && sec.subsections.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "divide-y divide-slate-100",
                                                                        children: sec.subsections.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "p-3.5 space-y-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "text-[11px] font-bold text-slate-500 uppercase tracking-wider",
                                                                                        children: sub.title
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 529,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "space-y-1.5 pl-2 sm:pl-3",
                                                                                        children: sub.videos.map((vid)=>{
                                                                                            const isSelected = activeVideo?.id === vid.id;
                                                                                            const isDone = completedVideoIds.includes(vid.id);
                                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                type: "button",
                                                                                                onClick: ()=>{
                                                                                                    handleSelectVideo(vid, sec.id);
                                                                                                    window.scrollTo({
                                                                                                        top: 0,
                                                                                                        behavior: "smooth"
                                                                                                    });
                                                                                                },
                                                                                                className: `flex w-full items-center justify-between gap-2 rounded-xl p-3 text-left text-xs sm:text-sm transition-all cursor-pointer ${isSelected ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200" : "text-slate-700 hover:bg-slate-50 border border-transparent"}`,
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex items-center gap-2.5 min-w-0",
                                                                                                        children: [
                                                                                                            isDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                                className: "h-4 w-4 text-emerald-600 shrink-0"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                                lineNumber: 554,
                                                                                                                columnNumber: 45
                                                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                                                                                                className: `h-4 w-4 shrink-0 ${isSelected ? "text-[#2563EB]" : "text-slate-400"}`
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                                lineNumber: 556,
                                                                                                                columnNumber: 45
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "truncate",
                                                                                                                children: vid.title
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                                lineNumber: 562,
                                                                                                                columnNumber: 43
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                        lineNumber: 552,
                                                                                                        columnNumber: 41
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-[11px] text-slate-400 shrink-0 font-mono",
                                                                                                        children: vid.durationFormatted
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                        lineNumber: 564,
                                                                                                        columnNumber: 41
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, vid.id, true, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 539,
                                                                                                columnNumber: 39
                                                                                            }, this);
                                                                                        })
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 533,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, sub.id, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 528,
                                                                                columnNumber: 31
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 526,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    sec.directVideos && sec.directVideos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "p-3.5 space-y-1.5",
                                                                        children: sec.directVideos.map((vid)=>{
                                                                            const isSelected = activeVideo?.id === vid.id;
                                                                            const isDone = completedVideoIds.includes(vid.id);
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>{
                                                                                    handleSelectVideo(vid, sec.id);
                                                                                    window.scrollTo({
                                                                                        top: 0,
                                                                                        behavior: "smooth"
                                                                                    });
                                                                                },
                                                                                className: `flex w-full items-center justify-between gap-2 rounded-xl p-3 text-left text-xs sm:text-sm transition-all cursor-pointer ${isSelected ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200" : "text-slate-700 hover:bg-slate-50 border border-transparent"}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "flex items-center gap-2.5 min-w-0",
                                                                                        children: [
                                                                                            isDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                                className: "h-4 w-4 text-emerald-600 shrink-0"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 601,
                                                                                                columnNumber: 39
                                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                                                                                className: `h-4 w-4 shrink-0 ${isSelected ? "text-[#2563EB]" : "text-slate-400"}`
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 603,
                                                                                                columnNumber: 39
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "truncate",
                                                                                                children: vid.title
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 609,
                                                                                                columnNumber: 37
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 599,
                                                                                        columnNumber: 35
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[11px] text-slate-400 shrink-0 font-mono",
                                                                                        children: vid.durationFormatted
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 611,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, vid.id, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 586,
                                                                                columnNumber: 33
                                                                            }, this);
                                                                        })
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 579,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "border-t border-slate-100 p-3 bg-slate-50/60 flex items-center justify-between text-xs",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-semibold text-emerald-800 flex items-center gap-1.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
                                                                                        className: "h-4 w-4"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 623,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    completedAssignmentIds.includes(sec.assignment.id) ? "Assignment Passed ✓" : "Section Assignment"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 622,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                type: "button",
                                                                                onClick: ()=>setActiveAssignmentSection(sec),
                                                                                className: "font-bold text-[#2563EB] hover:underline cursor-pointer",
                                                                                children: completedAssignmentIds.includes(sec.assignment.id) ? "View Solution" : "Open Assignment →"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 628,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 621,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, sec.id, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 505,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 503,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 473,
                                                columnNumber: 17
                                            }, this),
                                            activeTab === "overview" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-8 max-w-4xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                className: "text-xl sm:text-2xl font-black text-slate-900 leading-tight",
                                                                children: [
                                                                    course.title,
                                                                    " — Comprehensive Project-Based Enterprise Curriculum"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 648,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 font-medium",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1.5 text-amber-600 font-bold",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-sm font-extrabold",
                                                                                children: course.rating || 4.8
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 654,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center",
                                                                                children: [
                                                                                    ...Array(5)
                                                                                ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                                        className: "h-3.5 w-3.5 fill-amber-400 text-amber-400"
                                                                                    }, i, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 657,
                                                                                        columnNumber: 29
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 655,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-slate-500 font-normal",
                                                                                children: [
                                                                                    "(",
                                                                                    course.studentsEnrolled ? `${(course.studentsEnrolled * 6).toLocaleString()} ratings` : "1,240 ratings",
                                                                                    ")"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 660,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 653,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 663,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: course.studentsEnrolled ? `${course.studentsEnrolled.toLocaleString()} students` : "14,845 students"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 665,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: course.durationWeeks ? `${course.durationWeeks * 2} total hours` : "32 total hours"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 666,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 652,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                                className: "h-3.5 w-3.5 text-slate-400"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 671,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            " Last updated 08/2026"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 670,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 673,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                                                className: "h-3.5 w-3.5 text-slate-400"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 675,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            " English, Hindi"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 674,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "•"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 677,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$captions$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Subtitles$3e$__["Subtitles"], {
                                                                                className: "h-3.5 w-3.5 text-slate-400"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 679,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            " Subtitles Available"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 678,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 669,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 647,
                                                        columnNumber: 19
                                                    }, this),
                                                    showSchedulerBanner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col sm:flex-row items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-800 shadow-2xs",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                            className: "h-5 w-5 text-[#2563EB]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 689,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 688,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-xs sm:text-sm font-bold text-slate-900",
                                                                                children: "Schedule learning time"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 692,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-slate-600 leading-relaxed max-w-xl",
                                                                                children: "Learning a little each day adds up. Research shows that students who make learning a habit are more likely to reach their goals. Set time aside to learn and get reminders using your learning scheduler."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 695,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 691,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 687,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 self-end sm:self-center shrink-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setShowSchedulerModal(true),
                                                                        className: "rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors",
                                                                        children: "Get started"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 702,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>setShowSchedulerBanner(false),
                                                                        className: "rounded-xl px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-200/60 transition-colors",
                                                                        children: "Dismiss"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 709,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 701,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 686,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-t border-slate-100 pt-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-sm font-extrabold text-slate-900 mb-4",
                                                                children: "By the numbers"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 722,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs text-slate-700",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-slate-500 font-medium",
                                                                                        children: "Skill level:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 725,
                                                                                        columnNumber: 30
                                                                                    }, this),
                                                                                    " ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold text-slate-900",
                                                                                        children: course.level || "All Levels"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 725,
                                                                                        columnNumber: 95
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 725,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-slate-500 font-medium",
                                                                                        children: "Students:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 726,
                                                                                        columnNumber: 30
                                                                                    }, this),
                                                                                    " ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold text-slate-900",
                                                                                        children: course.studentsEnrolled || "14,845"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 726,
                                                                                        columnNumber: 92
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 726,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-slate-500 font-medium",
                                                                                        children: "Languages:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 727,
                                                                                        columnNumber: 30
                                                                                    }, this),
                                                                                    " ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold text-slate-900",
                                                                                        children: "English, Hindi"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 727,
                                                                                        columnNumber: 93
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 727,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-slate-500 font-medium",
                                                                                        children: "Captions:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 728,
                                                                                        columnNumber: 30
                                                                                    }, this),
                                                                                    " ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold text-slate-900",
                                                                                        children: "Yes"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 728,
                                                                                        columnNumber: 92
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 728,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 724,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-slate-500 font-medium",
                                                                                        children: "Lectures:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 731,
                                                                                        columnNumber: 30
                                                                                    }, this),
                                                                                    " ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold text-slate-900",
                                                                                        children: allVideos.length || 42
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 731,
                                                                                        columnNumber: 92
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 731,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-slate-500 font-medium",
                                                                                        children: "Video:"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 732,
                                                                                        columnNumber: 30
                                                                                    }, this),
                                                                                    " ",
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "font-bold text-slate-900",
                                                                                        children: "32 total hours"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 732,
                                                                                        columnNumber: 89
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 732,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 730,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 723,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 721,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-t border-slate-100 pt-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-sm font-extrabold text-slate-900 mb-2",
                                                                children: "Certificates"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 739,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-slate-600 mb-3",
                                                                children: "Get JKS Learning accredited certificate by completing the entire course and milestone assessments."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 740,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setShowCertModal(true),
                                                                className: "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                                        className: "h-4 w-4 text-[#2563EB]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 748,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "JKS Learning Certificate"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 749,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 743,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 738,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-t border-slate-100 pt-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-sm font-extrabold text-slate-900 mb-2",
                                                                children: "Features"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 755,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-xs text-slate-700",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$smartphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Smartphone$3e$__["Smartphone"], {
                                                                        className: "h-4 w-4 text-slate-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 757,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: [
                                                                            "Available on ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                className: "text-blue-600 hover:underline cursor-pointer",
                                                                                children: "iOS"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 758,
                                                                                columnNumber: 42
                                                                            }, this),
                                                                            " and ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                                className: "text-emerald-600 hover:underline cursor-pointer",
                                                                                children: "Android"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 758,
                                                                                columnNumber: 124
                                                                            }, this),
                                                                            " mobile devices"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 758,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 756,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 754,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-t border-slate-100 pt-6 space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-base font-extrabold text-slate-900",
                                                                children: "Description"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 764,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-slate-600 leading-relaxed",
                                                                children: [
                                                                    course.summary,
                                                                    " This master series takes you step-by-step from core syntax, fundamentals, architectural design patterns to enterprise-grade cloud deployments. Each section is reinforced with coding challenges, interactive stage assessments, and real-time AI interview practice."
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 765,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-5 mt-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        className: "text-xs font-bold text-slate-900 uppercase tracking-wider mb-3",
                                                                        children: "What you'll learn"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 771,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700",
                                                                        children: [
                                                                            "Full Stack Architecture & Microservices",
                                                                            "High-Performance Concurrency & Memory Model",
                                                                            "REST APIs & Authentication with JWT & OAuth2",
                                                                            "Modern React Component Design & State Management",
                                                                            "SQL & NoSQL Schema Design, Indexing & Optimization",
                                                                            "Docker Containerization & Kubernetes Cluster Setup",
                                                                            "CI/CD Automated Pipelines with GitHub Actions",
                                                                            "Scenario-based Technical & System Design Interviews"
                                                                        ].map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-start gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                                        className: "h-4 w-4 text-emerald-600 shrink-0 mt-0.5"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 786,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: item
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 787,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, idx, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 785,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 774,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 770,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-xs font-bold text-slate-900",
                                                                                children: "Are there any course requirements or prerequisites?"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 796,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                                className: "list-disc list-inside text-xs text-slate-600 space-y-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                        children: "Basic knowledge of computer operations"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 800,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                        children: "No prior professional programming experience required"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 801,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                        children: "A computer with internet connection (Windows, Mac, or Linux)"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 802,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 799,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 795,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-xs font-bold text-slate-900",
                                                                                children: "Who this course is for:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 807,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                                                className: "list-disc list-inside text-xs text-slate-600 space-y-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                        children: "Students seeking Tier-1 product company software engineering jobs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 811,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                        children: "Engineers wanting to transition into Full Stack & Cloud roles"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 812,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                                        children: "Anyone wanting a solid, project-centric coding foundation"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 813,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 810,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 806,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 794,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 763,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "border-t border-slate-100 pt-6 space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-sm font-extrabold text-slate-900",
                                                                children: "Instructor"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 821,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col sm:flex-row items-start gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "relative h-16 w-16 shrink-0 rounded-full border-2 border-slate-200 overflow-hidden bg-slate-900",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                            src: "/images/hero-developer.png",
                                                                            alt: "Shubham Saurav",
                                                                            width: 64,
                                                                            height: 64,
                                                                            unoptimized: true,
                                                                            className: "h-full w-full object-cover"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 825,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 824,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "space-y-2 flex-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                        className: "text-sm font-bold text-slate-900",
                                                                                        children: "Shubham Saurav & JKS Mentor Team"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 837,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                        className: "text-xs text-slate-500 font-medium",
                                                                                        children: "Lead Enterprise Architect & Engineering Educator (10+ Years Experience)"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 838,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 836,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        className: "flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TwitterIcon, {
                                                                                            className: "h-3.5 w-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                            lineNumber: 846,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 845,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        className: "flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LinkedinIcon, {
                                                                                            className: "h-3.5 w-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                            lineNumber: 849,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 848,
                                                                                        columnNumber: 27
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        type: "button",
                                                                                        className: "flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(YoutubeIcon, {
                                                                                            className: "h-3.5 w-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                            lineNumber: 852,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 851,
                                                                                        columnNumber: 27
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 844,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs text-slate-600 leading-relaxed",
                                                                                children: "Shubham Saurav is a senior software engineer and architect with a deep passion for teaching. Over the past decade, he has mentored over 50,000+ engineers globally, helping them secure high-impact roles at leading tech companies."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 856,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 835,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 823,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 820,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 645,
                                                columnNumber: 17
                                            }, this),
                                            activeTab === "qa" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6 max-w-3xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                                                        className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 870,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Search all course questions...",
                                                                        value: qaSearch,
                                                                        onChange: (e)=>setQaSearch(e.target.value),
                                                                        className: "w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 outline-none focus:border-[#2563EB]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 871,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 869,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setShowAskModal(true),
                                                                className: "flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 885,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Ask a new question"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 886,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 880,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 868,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: questionsList.filter((q)=>qaSearch ? q.title.toLowerCase().includes(qaSearch.toLowerCase()) : true).map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-2 hover:border-slate-300 transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-start justify-between gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-start gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "relative h-8 w-8 shrink-0 rounded-full overflow-hidden border border-slate-200",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                            src: q.avatar,
                                                                                            alt: q.author,
                                                                                            width: 32,
                                                                                            height: 32,
                                                                                            unoptimized: true,
                                                                                            className: "h-full w-full object-cover"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                            lineNumber: 904,
                                                                                            columnNumber: 33
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 903,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                                className: "text-xs font-bold text-slate-900",
                                                                                                children: q.title
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 914,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "mt-1 flex items-center gap-2 text-[11px] text-slate-400",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        children: q.author
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                        lineNumber: 916,
                                                                                                        columnNumber: 35
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        children: "•"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                        lineNumber: 917,
                                                                                                        columnNumber: 35
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        children: q.lecture
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                        lineNumber: 918,
                                                                                                        columnNumber: 35
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        children: "•"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                        lineNumber: 919,
                                                                                                        columnNumber: 35
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        children: q.timeAgo
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                        lineNumber: 920,
                                                                                                        columnNumber: 35
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 915,
                                                                                                columnNumber: 33
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 913,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 902,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 shrink-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$thumbs$2d$up$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ThumbsUp$3e$__["ThumbsUp"], {
                                                                                                className: "h-3 w-3"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 927,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            " ",
                                                                                            q.upvotes
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 926,
                                                                                        columnNumber: 31
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-50 px-2 py-1 rounded-lg border border-slate-200",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                                                                                className: "h-3 w-3"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                                lineNumber: 930,
                                                                                                columnNumber: 33
                                                                                            }, this),
                                                                                            " ",
                                                                                            q.replies
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 929,
                                                                                        columnNumber: 31
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 925,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 901,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    q.hasInstructorResponse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-2 rounded-xl bg-blue-50/70 border border-blue-100 p-2.5 text-[11px] text-slate-700 flex items-center gap-1.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                className: "h-3.5 w-3.5 text-[#2563EB] shrink-0"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 937,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                children: "Instructor verified answer available"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 938,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 936,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, q.id, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 897,
                                                                columnNumber: 25
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 891,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 867,
                                                columnNumber: 17
                                            }, this),
                                            activeTab === "notes" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6 max-w-3xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "rounded-2xl border border-slate-200 bg-slate-50/50 p-4 space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs font-bold text-slate-800",
                                                                        children: [
                                                                            "Take a note at ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[#2563EB] font-mono",
                                                                                children: "02:15"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 954,
                                                                                columnNumber: 40
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 953,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[11px] text-slate-400",
                                                                        children: activeVideo?.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 956,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 952,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                rows: 3,
                                                                value: newNoteText,
                                                                onChange: (e)=>setNewNoteText(e.target.value),
                                                                placeholder: "Type your notes or key takeaways here...",
                                                                className: "w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 outline-none focus:border-[#2563EB]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 959,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-end",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: handleAddNote,
                                                                    className: "flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 973,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        " Save Note"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 968,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 967,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 951,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "text-xs font-bold text-slate-700 uppercase tracking-wider",
                                                                children: [
                                                                    "Saved Notes (",
                                                                    notesList.length,
                                                                    ")"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 980,
                                                                columnNumber: 21
                                                            }, this),
                                                            notesList.map((n)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-1.5 shadow-2xs",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-between text-xs",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "rounded bg-blue-100 px-2 py-0.5 font-mono text-[11px] font-bold text-[#2563EB]",
                                                                                    children: n.timestamp
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 989,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[11px] text-slate-400",
                                                                                    children: n.lecture
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 992,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 988,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-slate-700 leading-relaxed font-medium",
                                                                            children: n.text
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 994,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, n.id, true, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 984,
                                                                    columnNumber: 23
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 979,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 949,
                                                columnNumber: 17
                                            }, this),
                                            activeTab === "announcements" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 max-w-3xl",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-2xl border border-slate-200 bg-white p-5 space-y-3 shadow-2xs",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-slate-200",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                        src: "/images/hero-developer.png",
                                                                        alt: "Instructor",
                                                                        width: 40,
                                                                        height: 40,
                                                                        unoptimized: true,
                                                                        className: "h-full w-full object-cover"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1007,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1006,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                            className: "text-xs font-bold text-slate-900",
                                                                            children: "Shubham Saurav (Instructor)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1017,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] text-slate-400",
                                                                            children: "Posted 3 days ago"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1018,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1016,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1005,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-sm font-bold text-slate-900",
                                                            children: "🚀 New Section on Spring Boot 3.3, Virtual Threads & Microservices Capstone Added!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1022,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs text-slate-600 leading-relaxed",
                                                            children: "Hello learners! We have just updated this course curriculum with 4 brand-new deep dive lectures and milestone challenges focusing on Java 21 Virtual Threads, reactive resilience patterns, and cloud containerization. Make sure to check them out in Section 2 and 3!"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1026,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1004,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1003,
                                                columnNumber: 17
                                            }, this),
                                            activeTab === "reviews" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-6 max-w-3xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "text-4xl font-black text-slate-900",
                                                                        children: "4.8"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1038,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-center gap-0.5 mt-1",
                                                                        children: [
                                                                            ...Array(5)
                                                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                                className: "h-4 w-4 fill-amber-400 text-amber-400"
                                                                            }, i, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1041,
                                                                                columnNumber: 27
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1039,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[11px] text-slate-500 font-medium",
                                                                        children: "Course Rating"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1044,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1037,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 space-y-1.5 text-xs text-slate-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-12 text-slate-500",
                                                                                children: "5 stars"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1049,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-2 flex-1 rounded-full bg-slate-200 overflow-hidden",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "h-full bg-amber-400 rounded-full",
                                                                                    style: {
                                                                                        width: "82%"
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 1051,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1050,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-8 text-right font-bold",
                                                                                children: "82%"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1053,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1048,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-12 text-slate-500",
                                                                                children: "4 stars"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1056,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-2 flex-1 rounded-full bg-slate-200 overflow-hidden",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "h-full bg-amber-400 rounded-full",
                                                                                    style: {
                                                                                        width: "14%"
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 1058,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1057,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-8 text-right font-bold",
                                                                                children: "14%"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1060,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1055,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-12 text-slate-500",
                                                                                children: "3 stars"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1063,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "h-2 flex-1 rounded-full bg-slate-200 overflow-hidden",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "h-full bg-amber-400 rounded-full",
                                                                                    style: {
                                                                                        width: "3%"
                                                                                    }
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 1065,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1064,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "w-8 text-right font-bold",
                                                                                children: "3%"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1067,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1062,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1047,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1036,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3",
                                                        children: [
                                                            {
                                                                name: "Ananya Roy",
                                                                date: "1 week ago",
                                                                rating: 5,
                                                                text: "Best course for Full Stack engineering! The JVM architecture explanation and live microservice project helped me crack my Tier-1 interview."
                                                            },
                                                            {
                                                                name: "Vikram Malhotra",
                                                                date: "2 weeks ago",
                                                                rating: 5,
                                                                text: "Crystal clear explanations. The combination of video lectures with anti-skip protection and realistic coding challenges made learning super effective."
                                                            }
                                                        ].map((rev, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "rounded-2xl border border-slate-200 bg-white p-4 space-y-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs font-bold text-slate-900",
                                                                                children: rev.name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1090,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[11px] text-slate-400",
                                                                                children: rev.date
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1091,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1089,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-0.5",
                                                                        children: [
                                                                            ...Array(rev.rating)
                                                                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                                className: "h-3 w-3 fill-amber-400 text-amber-400"
                                                                            }, i, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1095,
                                                                                columnNumber: 29
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1093,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-slate-600 leading-relaxed",
                                                                        children: rev.text
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1098,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1088,
                                                                columnNumber: 23
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1073,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1035,
                                                columnNumber: 17
                                            }, this),
                                            activeTab === "tools" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-4 max-w-3xl",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "rounded-2xl border border-slate-200 bg-white p-5 space-y-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "text-xs font-bold text-slate-900 uppercase tracking-wider",
                                                            children: "Downloadable Source Code & Repositories"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1109,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "space-y-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                    href: "https://github.com",
                                                                    target: "_blank",
                                                                    rel: "noopener noreferrer",
                                                                    className: "flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] bg-slate-50/50 text-xs font-semibold text-slate-800 transition-colors",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$code$2d$xml$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Code2$3e$__["Code2"], {
                                                                                    className: "h-4 w-4 text-[#2563EB]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 1120,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Course Complete GitHub Repository & Starter Boilerplate"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 1121,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1119,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$external$2d$link$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ExternalLink$3e$__["ExternalLink"], {
                                                                            className: "h-3.5 w-3.5 text-slate-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1123,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1113,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>alert("Downloading Cheatsheet PDF..."),
                                                                    className: "flex w-full items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#2563EB] bg-slate-50/50 text-xs font-semibold text-slate-800 transition-colors",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                                                                    className: "h-4 w-4 text-emerald-600"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 1132,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    children: "Download Java 21 & Spring Boot 3 Quick Reference PDF"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                    lineNumber: 1133,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1131,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] text-slate-400 font-mono",
                                                                            children: "2.4 MB"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1135,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1126,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1112,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1108,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1107,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 470,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 435,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-slate-900",
                                        children: "Section Assignments & Milestones"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1146,
                                        columnNumber: 13
                                    }, this),
                                    allSections.map((sec, secIdx)=>{
                                        const isSecAssignmentDone = completedAssignmentIds.includes(sec.assignment.id);
                                        const score = assignmentScores[sec.assignment.id];
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "rounded-[22px] border border-slate-200 bg-white p-5 shadow-xs space-y-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between border-b border-slate-100 pb-2.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white",
                                                                    children: secIdx + 1
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1158,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xs sm:text-sm font-bold text-slate-900",
                                                                    children: sec.title
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1161,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1157,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600",
                                                            children: [
                                                                "Section ",
                                                                secIdx + 1
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1163,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1156,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/40 p-3.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
                                                                            className: "h-4 w-4 text-emerald-700"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1171,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-bold text-emerald-950",
                                                                            children: sec.assignment.title
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                            lineNumber: 1172,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1170,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "mt-1 text-[11px] font-semibold text-emerald-800",
                                                                    children: [
                                                                        "Type: ",
                                                                        sec.assignment.type,
                                                                        " · Minimum Pass: ",
                                                                        sec.assignment.minPassingScore,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1176,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1169,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: isSecAssignmentDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1184,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " Passed (",
                                                                    score || 94,
                                                                    "/100)"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1183,
                                                                columnNumber: 25
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>setActiveAssignmentSection(sec),
                                                                className: "flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-all hover:scale-105 cursor-pointer",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck$3e$__["FileCheck"], {
                                                                        className: "h-4 w-4"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1192,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    " Take Assignment"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1187,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1181,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1168,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, sec.id, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1152,
                                            columnNumber: 17
                                        }, this);
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1145,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                        lineNumber: 382,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "hidden lg:block w-full shrink-0 border-t border-slate-200 bg-white p-4 sm:p-5 lg:w-[340px] xl:w-[380px] lg:border-t-0 lg:border-l space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-slate-900",
                                        children: "Curriculum & Video Lessons"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1208,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-slate-500 font-medium",
                                        children: "Structured sequential progression with in-app tracking"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1209,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1207,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: allSections.map((sec, secIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between bg-slate-50/80 p-3.5 border-b border-slate-100",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "flex h-6 w-6 items-center justify-center rounded-lg bg-[#2563EB] text-[11px] font-bold text-white",
                                                            children: secIdx + 1
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1224,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-bold text-slate-900 line-clamp-1",
                                                            children: sec.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1227,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1223,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1222,
                                                columnNumber: 17
                                            }, this),
                                            sec.subsections && sec.subsections.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 space-y-3 bg-slate-50/30 border-b border-slate-100",
                                                children: sec.subsections.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-1.5 text-[11px] font-bold text-slate-700",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$tree$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderTree$3e$__["FolderTree"], {
                                                                        className: "h-3.5 w-3.5 text-blue-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1239,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: sub.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1240,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1238,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "space-y-1.5 pl-3",
                                                                children: sub.videos.map((vid)=>{
                                                                    const isSelected = activeVideo?.id === vid.id;
                                                                    const isDone = completedVideoIds.includes(vid.id);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleSelectVideo(vid, sec.id),
                                                                        className: `flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left text-xs transition-all ${isSelected ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200" : "text-slate-700 hover:bg-slate-50 border border-transparent"}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 min-w-0",
                                                                                children: [
                                                                                    isDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                        className: "h-4 w-4 text-emerald-600 shrink-0"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 1261,
                                                                                        columnNumber: 37
                                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                                                                        className: `h-4 w-4 shrink-0 ${isSelected ? "text-[#2563EB]" : "text-slate-400"}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 1263,
                                                                                        columnNumber: 37
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "truncate",
                                                                                        children: vid.title
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                        lineNumber: 1269,
                                                                                        columnNumber: 35
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1259,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-slate-400 shrink-0 font-mono",
                                                                                children: vid.durationFormatted
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                                lineNumber: 1271,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, vid.id, true, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1249,
                                                                        columnNumber: 31
                                                                    }, this);
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1243,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, sub.id, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1237,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1235,
                                                columnNumber: 19
                                            }, this),
                                            sec.directVideos && sec.directVideos.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 space-y-1.5",
                                                children: sec.directVideos.map((vid)=>{
                                                    const isSelected = activeVideo?.id === vid.id;
                                                    const isDone = completedVideoIds.includes(vid.id);
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>handleSelectVideo(vid, sec.id),
                                                        className: `flex w-full items-center justify-between gap-2 rounded-xl p-2.5 text-left text-xs transition-all ${isSelected ? "bg-[#EFF6FF] text-[#2563EB] font-bold shadow-xs border border-blue-200" : "text-slate-700 hover:bg-slate-50 border border-transparent"}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 min-w-0",
                                                                children: [
                                                                    isDone ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        className: "h-4 w-4 text-emerald-600 shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1303,
                                                                        columnNumber: 31
                                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PlayCircle$3e$__["PlayCircle"], {
                                                                        className: `h-4 w-4 shrink-0 ${isSelected ? "text-[#2563EB]" : "text-slate-400"}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1305,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        children: vid.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                        lineNumber: 1311,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1301,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-slate-400 shrink-0 font-mono",
                                                                children: vid.durationFormatted
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1313,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, vid.id, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1291,
                                                        columnNumber: 25
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1285,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-slate-100 p-2.5 bg-slate-50/50 flex items-center justify-between text-[11px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "font-semibold text-emerald-800 flex items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
                                                                className: "h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                lineNumber: 1325,
                                                                columnNumber: 21
                                                            }, this),
                                                            completedAssignmentIds.includes(sec.assignment.id) ? "Assignment Passed ✓" : "Section Assignment"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1324,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setActiveAssignmentSection(sec),
                                                        className: "font-bold text-[#2563EB] hover:underline",
                                                        children: completedAssignmentIds.includes(sec.assignment.id) ? "View" : "Open"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1330,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1323,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, sec.id, true, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1217,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `rounded-2xl border p-5 transition-all duration-300 ${isCourseComplete ? "border-amber-300 bg-gradient-to-br from-amber-50 via-white to-blue-50 shadow-md" : "border-slate-200 bg-slate-50/70"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isCourseComplete ? "bg-amber-400 text-slate-950 shadow-xs" : "bg-slate-200 text-slate-500"}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1358,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1351,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "text-xs font-bold text-slate-900 uppercase tracking-wide",
                                                        children: "Accredited Certificate"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1361,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-0.5 text-xs text-slate-500",
                                                        children: isCourseComplete ? "Congratulations! All section videos and assignments are 100% completed." : "Complete all section video lectures and submit all assignments to unlock your verified credential."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                        lineNumber: 1364,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                lineNumber: 1360,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1350,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4",
                                        children: isCourseComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowCertModal(true),
                                            className: "flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-2.5 text-xs font-bold text-white shadow-md hover:from-amber-600 hover:to-amber-700 transition-all hover:scale-[1.02] cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1379,
                                                    columnNumber: 19
                                                }, this),
                                                " Download Verified Certificate"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1374,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between text-xs text-slate-400 font-medium",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Progress: ",
                                                        overallPercent,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1383,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        completedCount,
                                                        "/",
                                                        totalItems,
                                                        " Done"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1384,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1382,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1372,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1343,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                        lineNumber: 1204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            showSchedulerModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setShowSchedulerModal(false),
                            className: "absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1401,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1396,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1406,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1405,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-base font-bold text-slate-900",
                                            children: "Schedule Learning Time"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1409,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-500",
                                            children: "Build a daily routine and get automated reminders"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1410,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1408,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1404,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 pt-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-bold text-slate-700",
                                            children: "Frequency"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1416,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            className: "mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Every Day (30 mins)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1418,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Weekdays (Mon-Fri 45 mins)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1419,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Weekends (Sat-Sun 2 hours)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1420,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1417,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1415,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-bold text-slate-700",
                                            children: "Preferred Time"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1425,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "time",
                                            defaultValue: "19:00",
                                            className: "mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-semibold text-slate-800 outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1426,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1424,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1414,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2 pt-3 border-t border-slate-100",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowSchedulerModal(false),
                                    className: "rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1435,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>{
                                        setShowSchedulerModal(false);
                                        setShowSchedulerBanner(false);
                                    },
                                    className: "rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700",
                                    children: "Save Schedule"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1442,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1434,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                    lineNumber: 1395,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                lineNumber: 1394,
                columnNumber: 9
            }, this),
            showAskModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setShowAskModal(false),
                            className: "absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1466,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1461,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-base font-bold text-slate-900",
                            children: "Ask a Question"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1469,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-slate-500",
                            children: "Ask the mentor or community about this lecture"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1470,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handlePostQuestion,
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-bold text-slate-700",
                                            children: "Question Title / Summary"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1474,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: newQuestionTitle,
                                            onChange: (e)=>setNewQuestionTitle(e.target.value),
                                            placeholder: "e.g. Why does my Spring Boot application fail on port 8080?",
                                            className: "mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-900 outline-none focus:border-[#2563EB]",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1475,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1473,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "text-xs font-bold text-slate-700",
                                            children: "Details & Code Snippets"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1485,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            rows: 4,
                                            value: newQuestionBody,
                                            onChange: (e)=>setNewQuestionBody(e.target.value),
                                            placeholder: "Provide context, error stack traces or what you've tried...",
                                            className: "mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono text-slate-900 outline-none focus:border-[#2563EB]"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1486,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1484,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-2 pt-2 border-t border-slate-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setShowAskModal(false),
                                            className: "rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100",
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1496,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            className: "flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                    className: "h-3.5 w-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1507,
                                                    columnNumber: 19
                                                }, this),
                                                " Post Question"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1503,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1495,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1472,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                    lineNumber: 1460,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                lineNumber: 1459,
                columnNumber: 9
            }, this),
            activeAssignmentSection && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setActiveAssignmentSection(null),
                            className: "absolute top-4 right-4 text-slate-400 hover:text-slate-600",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1524,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1519,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2.5 border-b border-slate-100 pb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"], {
                                    className: "h-5 w-5 text-[#2563EB]"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1528,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-bold text-slate-900",
                                            children: activeAssignmentSection.assignment.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1530,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[11px] text-slate-500",
                                            children: [
                                                "Type: ",
                                                activeAssignmentSection.assignment.type,
                                                " · Minimum Pass:",
                                                " ",
                                                activeAssignmentSection.assignment.minPassingScore,
                                                "%"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1533,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1529,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1527,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3 text-xs text-slate-700",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "font-semibold text-slate-900",
                                    children: activeAssignmentSection.assignment.description
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1541,
                                    columnNumber: 15
                                }, this),
                                activeAssignmentSection.assignment.questions && activeAssignmentSection.assignment.questions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: activeAssignmentSection.assignment.questions.map((q, qIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2 rounded-xl bg-slate-50 p-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-bold text-slate-800",
                                                    children: [
                                                        "Question ",
                                                        qIdx + 1,
                                                        ": ",
                                                        q.prompt
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1550,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: q.choices?.map((choice, cIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white p-2.5 hover:bg-slate-50 cursor-pointer text-xs",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "radio",
                                                                    name: `quiz-${qIdx}`,
                                                                    defaultChecked: cIdx === 0,
                                                                    className: "accent-[#2563EB]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1557,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: choice
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                                    lineNumber: 1563,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, cIdx, true, {
                                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                            lineNumber: 1553,
                                                            columnNumber: 27
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1551,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, qIdx, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1549,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1547,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-bold text-slate-700",
                                            children: "Paste Project Git Repository URL or Solution Notes:"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1572,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            rows: 3,
                                            defaultValue: "https://github.com/student-workspace/jks-milestone-solution",
                                            className: "w-full rounded-xl border border-slate-200 p-3 text-xs font-mono text-slate-800 outline-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1575,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1571,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1540,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-2 border-t border-slate-100 pt-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setActiveAssignmentSection(null),
                                    className: "rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1585,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>handleSubmitAssignment(activeAssignmentSection),
                                    className: "flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCheck$3e$__["FileCheck"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1597,
                                            columnNumber: 17
                                        }, this),
                                        " Submit & Evaluate"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1592,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1584,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                    lineNumber: 1518,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                lineNumber: 1517,
                columnNumber: 9
            }, this),
            showCertModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl space-y-5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>setShowCertModal(false),
                            className: "absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-4 w-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                lineNumber: 1613,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1608,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "rounded-2xl border-4 border-double border-amber-300/80 bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 p-8 text-center text-white shadow-xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$award$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Award$3e$__["Award"], {
                                        className: "h-8 w-8"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                        lineNumber: 1618,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1617,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-4 text-xs font-bold tracking-widest text-amber-400 uppercase",
                                    children: "JKS Learning Institute of Technology"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1620,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl",
                                    children: "Official Certificate of Course Mastery"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1623,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 text-xs text-slate-300",
                                    children: "This certifies that"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1626,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-2xl font-extrabold text-blue-300",
                                    children: "Jordan Dsouza"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1627,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-4 text-xs text-slate-300",
                                    children: "has successfully completed all required video sections, subsections, and passed all milestone assignments for"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1630,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-1 text-base font-bold text-white",
                                    children: course.title
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1633,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-left text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-mono text-emerald-400",
                                                    children: [
                                                        "ID: JKS-CERT-2026-",
                                                        course.slug.toUpperCase().slice(0, 8)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1637,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-slate-400",
                                                    children: "Verified Authentic via JKS Ledger"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1638,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1636,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "font-semibold text-white",
                                                    children: "Authorized Signature"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1641,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-slate-400",
                                                    children: "Academic Director, JKS"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                                    lineNumber: 1642,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1640,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1635,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1616,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-end gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowCertModal(false),
                                    className: "rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100",
                                    children: "Close"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1648,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setShowCertModal(false),
                                    className: "flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                            lineNumber: 1660,
                                            columnNumber: 17
                                        }, this),
                                        " Download PDF Certificate"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                                    lineNumber: 1655,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                            lineNumber: 1647,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                    lineNumber: 1607,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
                lineNumber: 1606,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(student)/dashboard/my-courses/[slug]/page.tsx",
        lineNumber: 340,
        columnNumber: 5
    }, this);
}
_s(CourseLearningHubPage, "BtAAxq1LBlbi5xA8TxcAWIXzCeg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$auth$2f$use$2d$mock$2d$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockSession"]
    ];
});
_c3 = CourseLearningHubPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "TwitterIcon");
__turbopack_context__.k.register(_c1, "LinkedinIcon");
__turbopack_context__.k.register(_c2, "YoutubeIcon");
__turbopack_context__.k.register(_c3, "CourseLearningHubPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ui/in-app-video-player.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "InAppVideoPlayer",
    ()=>InAppVideoPlayer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-client] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/pause.mjs [app-client] (ecmascript) <export default as Pause>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-client] (ecmascript) <export default as RotateCcw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.mjs [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-x.mjs [app-client] (ecmascript) <export default as VolumeX>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/maximize-2.mjs [app-client] (ecmascript) <export default as Maximize2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.mjs [app-client] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tv$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tv$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tv.mjs [app-client] (ecmascript) <export default as Tv>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
// Utility to parse YouTube video IDs from various URL formats
function getYouTubeEmbedUrl(rawUrl) {
    if (!rawUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = rawUrl.match(regExp);
    if (match && match[2].length === 11) {
        const videoId = match[2];
        // Use youtube-nocookie and clean embed parameters to keep playback in-app
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`;
    }
    return null;
}
// Utility to parse Vimeo video IDs
function getVimeoEmbedUrl(rawUrl) {
    if (!rawUrl) return null;
    const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
    const match = rawUrl.match(regExp);
    if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;
    }
    return null;
}
function InAppVideoPlayer({ title, videoUrl, videoType, durationFormatted = "3:00", antiSkip = false, onVideoCompleted, onProgressChange, autoPlay = false, className = "" }) {
    _s();
    const videoRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [progressPercent, setProgressPercent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [currentTime, setCurrentTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [duration, setDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isMuted, setIsMuted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCompleted, setIsCompleted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [simulationTimerActive, setSimulationTimerActive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Check if URL is an external embed (YouTube / Vimeo)
    const isYouTube = videoType === "url" && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
    const isVimeo = videoType === "url" && videoUrl.includes("vimeo.com");
    const youTubeEmbedSrc = isYouTube ? getYouTubeEmbedUrl(videoUrl) : null;
    const vimeoEmbedSrc = isVimeo ? getVimeoEmbedUrl(videoUrl) : null;
    const isExternalEmbed = Boolean(youTubeEmbedSrc || vimeoEmbedSrc);
    // Reset when videoUrl or title changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InAppVideoPlayer.useEffect": ()=>{
            setIsPlaying(autoPlay);
            setProgressPercent(0);
            setCurrentTime(0);
            setIsCompleted(false);
        }
    }["InAppVideoPlayer.useEffect"], [
        videoUrl,
        title,
        autoPlay
    ]);
    // Simulation progress timer for external embedded frames (since iframes cannot emit cross-origin timeupdate directly without complex postMessage setup)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InAppVideoPlayer.useEffect": ()=>{
            let interval;
            if (isExternalEmbed && simulationTimerActive && progressPercent < 100) {
                interval = setInterval({
                    "InAppVideoPlayer.useEffect": ()=>{
                        setProgressPercent({
                            "InAppVideoPlayer.useEffect": (prev)=>{
                                const next = Math.min(prev + 2, 100);
                                onProgressChange?.(next);
                                if (next >= 100) {
                                    clearInterval(interval);
                                    setIsCompleted(true);
                                    setSimulationTimerActive(false);
                                    onVideoCompleted?.();
                                }
                                return next;
                            }
                        }["InAppVideoPlayer.useEffect"]);
                    }
                }["InAppVideoPlayer.useEffect"], 500);
            }
            return ({
                "InAppVideoPlayer.useEffect": ()=>{
                    if (interval) clearInterval(interval);
                }
            })["InAppVideoPlayer.useEffect"];
        }
    }["InAppVideoPlayer.useEffect"], [
        isExternalEmbed,
        simulationTimerActive,
        progressPercent,
        onProgressChange,
        onVideoCompleted
    ]);
    // HTML5 native video time update handler
    const handleTimeUpdate = ()=>{
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const dur = videoRef.current.duration || 1;
        setCurrentTime(current);
        setDuration(dur);
        const pct = Math.round(current / dur * 100);
        setProgressPercent(pct);
        onProgressChange?.(pct);
        if (pct >= 98 && !isCompleted) {
            setIsCompleted(true);
            onVideoCompleted?.();
        }
    };
    const togglePlay = ()=>{
        if (isExternalEmbed) {
            setSimulationTimerActive((prev)=>!prev);
            setIsPlaying((prev)=>!prev);
            return;
        }
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };
    const toggleMute = ()=>{
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };
    const handleRestart = ()=>{
        setProgressPercent(0);
        setCurrentTime(0);
        setIsCompleted(false);
        if (isExternalEmbed) {
            setSimulationTimerActive(true);
            setIsPlaying(true);
        } else if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    };
    const handleFullscreen = ()=>{
        if (containerRef.current) {
            if (!document.fullscreenElement) {
                containerRef.current.requestFullscreen?.();
            } else {
                document.exitFullscreen?.();
            }
        }
    };
    const formatSeconds = (sec)=>{
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };
    // When it's an external embed (YouTube / Vimeo), render the native iframe cleanly without duplicate template controls
    if (isExternalEmbed) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: containerRef,
            className: `relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl ${className}`,
            children: youTubeEmbedSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                src: youTubeEmbedSrc,
                title: title,
                allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
                allowFullScreen: true,
                className: "h-full w-full border-0"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                lineNumber: 193,
                columnNumber: 11
            }, this) : vimeoEmbedSrc ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("iframe", {
                src: vimeoEmbedSrc,
                title: title,
                allow: "autoplay; fullscreen; picture-in-picture",
                allowFullScreen: true,
                className: "h-full w-full border-0"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                lineNumber: 201,
                columnNumber: 11
            }, this) : null
        }, void 0, false, {
            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
            lineNumber: 188,
            columnNumber: 7
        }, this);
    }
    // HTML5 native video player with in-app tracking and custom controls
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: `group relative flex aspect-video w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-2xl ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-20 flex items-center justify-between bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent p-2.5 sm:p-4 transition-opacity",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 sm:gap-2 min-w-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 rounded-lg bg-blue-600/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-xs backdrop-blur-md shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tv$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tv$3e$__["Tv"], {
                                        className: "h-3 w-3 sm:h-3.5 sm:w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 223,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Protected Player"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 224,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "truncate text-[11px] sm:text-xs font-semibold text-slate-300 max-w-[140px] sm:max-w-md hidden sm:inline-block",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                lineNumber: 226,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1.5 sm:gap-2 shrink-0",
                        children: [
                            antiSkip && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 rounded-md bg-amber-500/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-300 border border-amber-500/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                        className: "h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 234,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "hidden xs:inline",
                                        children: "Anti-Skip"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 235,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                lineNumber: 233,
                                columnNumber: 13
                            }, this),
                            isCompleted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1 rounded-md bg-emerald-500/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-300 border border-emerald-500/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                        className: "h-2.5 w-2.5 sm:h-3 sm:w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 240,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Done"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 241,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                lineNumber: 239,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative flex flex-1 items-center justify-center overflow-hidden bg-black",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                        ref: videoRef,
                        src: videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                        onTimeUpdate: handleTimeUpdate,
                        onPlay: ()=>setIsPlaying(true),
                        onPause: ()=>setIsPlaying(false),
                        onEnded: ()=>{
                            setIsCompleted(true);
                            setIsPlaying(false);
                            onVideoCompleted?.();
                        },
                        playsInline: true,
                        className: "h-full w-full object-contain"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                        lineNumber: 249,
                        columnNumber: 9
                    }, this),
                    !isPlaying && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: togglePlay,
                        className: "absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]/90 text-white shadow-2xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                            className: "h-7 w-7 fill-white translate-x-0.5"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                            lineNumber: 274,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                        lineNumber: 269,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative z-20 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-3 sm:p-4 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative h-1.5 w-full rounded-full bg-white/20 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-[#2563EB] transition-all duration-300",
                            style: {
                                width: `${progressPercent}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                            lineNumber: 283,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between text-xs text-slate-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: togglePlay,
                                        className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer",
                                        children: isPlaying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$pause$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Pause$3e$__["Pause"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                            lineNumber: 297,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                                            className: "h-4 w-4 fill-white"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                            lineNumber: 299,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 291,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleRestart,
                                        className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer",
                                        title: "Restart Video",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                            lineNumber: 309,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-mono text-[11px] text-slate-400",
                                        children: duration > 0 ? `${formatSeconds(currentTime)} / ${formatSeconds(duration)}` : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: durationFormatted
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                            lineNumber: 316,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 312,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                lineNumber: 290,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[11px] font-semibold text-slate-400",
                                        children: [
                                            progressPercent,
                                            "% watched"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 322,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: toggleMute,
                                        className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer",
                                        children: isMuted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VolumeX$3e$__["VolumeX"], {
                                            className: "h-4 w-4 text-rose-400"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                            lineNumber: 332,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                            lineNumber: 334,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 326,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleFullscreen,
                                        className: "flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer",
                                        title: "Fullscreen",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$maximize$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Maximize2$3e$__["Maximize2"], {
                                            className: "h-3.5 w-3.5"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                            lineNumber: 344,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                        lineNumber: 338,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                                lineNumber: 321,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/in-app-video-player.tsx",
                lineNumber: 280,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/in-app-video-player.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
_s(InAppVideoPlayer, "ue3ZtHoFLpm+EhNdF2NUThfjRSs=");
_c = InAppVideoPlayer;
var _c;
__turbopack_context__.k.register(_c, "InAppVideoPlayer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/courses-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteCourse",
    ()=>deleteCourse,
    "enrollStudentCourse",
    ()=>enrollStudentCourse,
    "getFullCourseBySlug",
    ()=>getFullCourseBySlug,
    "getStoredCourses",
    ()=>getStoredCourses,
    "getStudentOwnedSlugs",
    ()=>getStudentOwnedSlugs,
    "saveCourse",
    ()=>saveCourse,
    "unenrollStudentCourse",
    ()=>unenrollStudentCourse,
    "useAllCourses",
    ()=>useAllCourses,
    "useStudentOwnedCourses",
    ()=>useStudentOwnedCourses
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
// Initial Seed Courses with Sections, Subsections, Videos and Section Assignments
const INITIAL_COURSES = [
    {
        id: "crs-java-fullstack",
        slug: "java-full-stack-mastery",
        title: "Java Full Stack Developer Mastery",
        track: "Full Stack",
        level: "Intermediate",
        durationWeeks: 16,
        price: 24999,
        rating: 4.8,
        studentsEnrolled: 2140,
        summary: "Core Java, Spring Boot, REST APIs, React, and production deployment — built around real enterprise project work.",
        createdAt: "2026-06-01T00:00:00Z",
        status: "Published",
        sections: [
            {
                id: "sec-1",
                title: "Section 1: Enterprise Java Foundations & Core Architecture",
                order: 1,
                description: "Master modern Java 21 features, memory layout, OOP patterns, and multithreading.",
                subsections: [
                    {
                        id: "sub-1-1",
                        title: "Subsection 1.1: Language Internals & JVM",
                        order: 1,
                        videos: [
                            {
                                id: "v-1",
                                title: "01. JVM Architecture, Garbage Collection & Memory Model",
                                durationSeconds: 180,
                                durationFormatted: "3:00",
                                videoType: "url",
                                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                                order: 1,
                                isFreeDemo: true,
                                completed: true
                            },
                            {
                                id: "v-2",
                                title: "02. Modern Java 21 Features: Records, Virtual Threads & Pattern Matching",
                                durationSeconds: 240,
                                durationFormatted: "4:00",
                                videoType: "url",
                                videoUrl: "https://www.youtube.com/watch?v=k1BneeJTDcU",
                                order: 2,
                                completed: true
                            }
                        ]
                    },
                    {
                        id: "sub-1-2",
                        title: "Subsection 1.2: Concurrency & Asynchronous Streams",
                        order: 2,
                        videos: [
                            {
                                id: "v-3",
                                title: "03. CompletableFuture, Reactive Streams & Thread Safety",
                                durationSeconds: 210,
                                durationFormatted: "3:30",
                                videoType: "url",
                                videoUrl: "https://www.youtube.com/watch?v=28aEWu_yV_c",
                                order: 3,
                                completed: false
                            }
                        ]
                    }
                ],
                assignment: {
                    id: "asg-1",
                    title: "Section 1 Assessment: High-Performance Concurrent Java",
                    description: "Build a lock-free thread-safe cache using concurrent collections and virtual threads.",
                    type: "Coding Challenge",
                    minPassingScore: 75,
                    questions: [
                        {
                            prompt: "Which Java 21 feature allows lightweight thread scheduling on top of carrier OS threads?",
                            choices: [
                                "Virtual Threads (Project Loom)",
                                "ForkJoinPool Executors",
                                "Reactive Mono Publisher",
                                "ThreadLocal Context"
                            ],
                            correctIndex: 0
                        },
                        {
                            prompt: "What is the primary advantage of Record patterns in modern Java switch statements?",
                            choices: [
                                "Deconstruct record components directly with type safety",
                                "Automatically implement serialization without reflection",
                                "Allocate records on the native stack",
                                "Bypass garbage collection cycles"
                            ],
                            correctIndex: 0
                        }
                    ],
                    completed: true,
                    score: 95
                }
            },
            {
                id: "sec-2",
                title: "Section 2: Spring Boot 3 & Microservice API Engineering",
                order: 2,
                description: "Design and implement production-ready REST services with Spring Data JPA and Security.",
                directVideos: [
                    {
                        id: "v-4",
                        title: "04. Spring Boot 3 Core: Dependency Injection & Auto-Configuration",
                        durationSeconds: 260,
                        durationFormatted: "4:20",
                        videoType: "url",
                        videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
                        order: 1,
                        completed: false
                    },
                    {
                        id: "v-5",
                        title: "05. Designing Resilient Microservices with Resilience4j & OpenFeign",
                        durationSeconds: 300,
                        durationFormatted: "5:00",
                        videoType: "url",
                        videoUrl: "https://www.youtube.com/watch?v=gq4S-ovwvL0",
                        order: 2,
                        completed: false
                    }
                ],
                assignment: {
                    id: "asg-2",
                    title: "Section 2 Assessment: Spring Boot Microservices API",
                    description: "Implement a rate-limited REST API with JWT authentication and circuit breakers.",
                    type: "Project Submission",
                    minPassingScore: 80,
                    submissionCriteria: [
                        "REST endpoint with HTTP 201/400/401/404 standard responses",
                        "Spring Security stateless JWT filter verification",
                        "Resilience4j CircuitBreaker fallback implementation"
                    ],
                    completed: false
                }
            },
            {
                id: "sec-3",
                title: "Section 3: Production Cloud & Kubernetes Capstone",
                order: 3,
                description: "Deploy multi-tier containerized architectures to cloud infrastructure with CI/CD.",
                directVideos: [
                    {
                        id: "v-6",
                        title: "06. Docker Multi-Stage Builds & Kubernetes Pod Orchestration",
                        durationSeconds: 320,
                        durationFormatted: "5:20",
                        videoType: "url",
                        videoUrl: "https://www.youtube.com/watch?v=X48VuDVv0do",
                        order: 1,
                        completed: false
                    }
                ],
                assignment: {
                    id: "asg-3",
                    title: "Section 3 Capstone: Enterprise Production Deployment",
                    description: "Submit GitHub repository and live deployment URL for the microservices cluster.",
                    type: "Project Submission",
                    minPassingScore: 85,
                    completed: false
                }
            }
        ]
    },
    {
        id: "crs-react-frontend",
        slug: "modern-frontend-engineering",
        title: "Modern Frontend Engineering with React",
        track: "Frontend",
        level: "Beginner",
        durationWeeks: 10,
        price: 15999,
        rating: 4.9,
        studentsEnrolled: 3020,
        summary: "HTML/CSS/JS fundamentals through advanced React, TypeScript, and performance optimization.",
        createdAt: "2026-07-01T00:00:00Z",
        status: "Published",
        sections: [
            {
                id: "sec-react-1",
                title: "Section 1: Modern JavaScript & TypeScript Foundations",
                order: 1,
                description: "ESNext syntax, asynchronous promises, and TypeScript generics.",
                directVideos: [
                    {
                        id: "v-r1",
                        title: "01. TypeScript Deep Dive: Generics, Discriminated Unions & Utility Types",
                        durationSeconds: 200,
                        durationFormatted: "3:20",
                        videoType: "url",
                        videoUrl: "https://www.youtube.com/watch?v=BCg4U1FzODs",
                        order: 1,
                        isFreeDemo: true,
                        completed: true
                    }
                ],
                assignment: {
                    id: "asg-r1",
                    title: "Section 1 Assessment: TypeScript Type Safety Challenge",
                    description: "Solve 5 advanced TypeScript utility type puzzles.",
                    type: "MCQ",
                    minPassingScore: 80,
                    questions: [
                        {
                            prompt: "Which TypeScript utility type constructs a type with all properties of T set to optional?",
                            choices: [
                                "Partial<T>",
                                "Required<T>",
                                "Record<K,T>",
                                "Readonly<T>"
                            ],
                            correctIndex: 0
                        }
                    ],
                    completed: false
                }
            },
            {
                id: "sec-react-2",
                title: "Section 2: React 19 Architecture & State",
                order: 2,
                description: "Server Actions, hooks, memoization, and custom hooks.",
                directVideos: [
                    {
                        id: "v-r2",
                        title: "02. React 19 Compiler, Actions, and optimistic state updates",
                        durationSeconds: 280,
                        durationFormatted: "4:40",
                        videoType: "url",
                        videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
                        order: 1,
                        completed: false
                    }
                ],
                assignment: {
                    id: "asg-r2",
                    title: "Section 2 Assessment: Real-Time Kanban Dashboard",
                    description: "Build an interactive optimistic UI board with drag-and-drop state.",
                    type: "Coding Challenge",
                    minPassingScore: 75,
                    completed: false
                }
            }
        ]
    },
    {
        id: "crs-sap-abap",
        slug: "sap-abap-professional",
        title: "SAP ABAP Professional Track",
        track: "SAP",
        level: "Intermediate",
        durationWeeks: 12,
        price: 28999,
        rating: 4.6,
        studentsEnrolled: 860,
        summary: "ABAP programming, module pool, RICEFW objects, and S/4HANA extensibility for enterprise consulting roles.",
        createdAt: "2026-08-01T00:00:00Z",
        status: "Published",
        sections: [
            {
                id: "sec-sap-1",
                title: "Section 1: ABAP Core Data Dictionary & Modularization",
                order: 1,
                description: "Data elements, domains, structures, transparent tables, and function modules.",
                directVideos: [
                    {
                        id: "v-s1",
                        title: "01. SAP Architecture & Data Dictionary Mastery",
                        durationSeconds: 220,
                        durationFormatted: "3:40",
                        videoType: "url",
                        videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
                        order: 1,
                        isFreeDemo: true,
                        completed: false
                    }
                ],
                assignment: {
                    id: "asg-s1",
                    title: "Section 1 Assessment: SAP Data Dictionary Design",
                    description: "Create a complete schema for Purchase Order header and item tables.",
                    type: "MCQ",
                    minPassingScore: 75,
                    completed: false
                }
            }
        ]
    }
];
const STORAGE_KEYS = {
    COURSES: "jks_courses_catalog_v2",
    ENROLLMENTS: "jks_student_enrollments_v2"
};
const STORE_EVENT = "jks-courses-store-change";
function safeLocalStorageGet(key, fallback) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch  {
        return fallback;
    }
}
function safeLocalStorageSet(key, value) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new Event(STORE_EVENT));
    } catch (err) {
        console.error("Failed to write to localStorage:", err);
    }
}
// Default student owned courses (empty by default for real authentication)
const DEFAULT_ENROLLED_SLUGS = [];
function getStoredCourses() {
    return safeLocalStorageGet(STORAGE_KEYS.COURSES, INITIAL_COURSES);
}
function saveCourse(newCourse) {
    const current = getStoredCourses();
    const index = current.findIndex((c)=>c.id === newCourse.id || c.slug === newCourse.slug);
    let updated;
    if (index >= 0) {
        updated = [
            ...current
        ];
        updated[index] = newCourse;
    } else {
        updated = [
            newCourse,
            ...current
        ];
    }
    safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);
    return newCourse;
}
function deleteCourse(courseId) {
    const current = getStoredCourses();
    const updated = current.filter((c)=>c.id !== courseId);
    safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);
}
function getStudentOwnedSlugs() {
    return safeLocalStorageGet(STORAGE_KEYS.ENROLLMENTS, DEFAULT_ENROLLED_SLUGS);
}
function enrollStudentCourse(slug) {
    const current = getStudentOwnedSlugs();
    if (!current.includes(slug)) {
        const updated = [
            ...current,
            slug
        ];
        safeLocalStorageSet(STORAGE_KEYS.ENROLLMENTS, updated);
        return updated;
    }
    return current;
}
function unenrollStudentCourse(slug) {
    const current = getStudentOwnedSlugs();
    const updated = current.filter((s)=>s !== slug);
    safeLocalStorageSet(STORAGE_KEYS.ENROLLMENTS, updated);
    return updated;
}
// Subscribe helper for React Hook
function subscribe(callback) {
    window.addEventListener(STORE_EVENT, callback);
    window.addEventListener("storage", callback);
    return ()=>{
        window.removeEventListener(STORE_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
}
let cachedCoursesSnapshot = null;
let cachedCoursesRaw = null;
function getCoursesSnapshot() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
    if (raw !== cachedCoursesRaw) {
        cachedCoursesRaw = raw;
        cachedCoursesSnapshot = raw ? JSON.parse(raw) : INITIAL_COURSES;
    }
    return cachedCoursesSnapshot ?? INITIAL_COURSES;
}
let cachedEnrollmentsSnapshot = null;
let cachedEnrollmentsRaw = null;
function getEnrollmentsSnapshot() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const raw = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
    if (raw !== cachedEnrollmentsRaw) {
        cachedEnrollmentsRaw = raw;
        cachedEnrollmentsSnapshot = raw ? JSON.parse(raw) : DEFAULT_ENROLLED_SLUGS;
    }
    return cachedEnrollmentsSnapshot ?? DEFAULT_ENROLLED_SLUGS;
}
function useAllCourses() {
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getCoursesSnapshot, {
        "useAllCourses.useSyncExternalStore": ()=>INITIAL_COURSES
    }["useAllCourses.useSyncExternalStore"]);
}
_s(useAllCourses, "FpwL93IKMLJZuQQXefVtWynbBPQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
function useStudentOwnedCourses() {
    _s1();
    const allCourses = useAllCourses();
    const ownedSlugs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"])(subscribe, getEnrollmentsSnapshot, {
        "useStudentOwnedCourses.useSyncExternalStore[ownedSlugs]": ()=>DEFAULT_ENROLLED_SLUGS
    }["useStudentOwnedCourses.useSyncExternalStore[ownedSlugs]"]);
    return allCourses.filter((course)=>ownedSlugs.includes(course.slug));
}
_s1(useStudentOwnedCourses, "xVcS4L4oPfAnOBYQN+A2ipgwwSQ=", false, function() {
    return [
        useAllCourses,
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSyncExternalStore"]
    ];
});
function getFullCourseBySlug(slug) {
    const courses = getStoredCourses();
    return courses.find((c)=>c.slug === slug);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/enrollments-api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "fetchCourseProgress",
    ()=>fetchCourseProgress,
    "fetchStudentEnrollments",
    ()=>fetchStudentEnrollments,
    "getClientSessionEmail",
    ()=>getClientSessionEmail,
    "saveVideoProgress",
    ()=>saveVideoProgress,
    "syncAllCourseProgress",
    ()=>syncAllCourseProgress
]);
function getClientSessionEmail() {
    if (typeof document !== "undefined") {
        try {
            const match = document.cookie.match(/(?:^|; )jks_mock_session=([^;]*)/);
            if (match?.[1]) {
                const decoded = JSON.parse(decodeURIComponent(match[1]));
                if (decoded?.email) return decoded.email.toLowerCase().trim();
            }
        } catch  {}
        try {
            const raw = localStorage.getItem("jks_auth_user");
            if (raw) {
                const u = JSON.parse(raw);
                if (u?.email) return u.email.toLowerCase().trim();
            }
        } catch  {}
    }
    return "";
}
async function fetchStudentEnrollments(userEmailOrId) {
    const emailToQuery = userEmailOrId || getClientSessionEmail();
    try {
        // 1. Try fetching via authenticated session /me
        const meRes = await fetch("http://localhost:4000/enrollments/me", {
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        });
        if (meRes.ok) {
            const data = await meRes.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
        // 2. Lookup by email or ID
        if (emailToQuery) {
            const studentRes = await fetch(`http://localhost:4000/enrollments/student/${encodeURIComponent(emailToQuery)}`, {
                headers: {
                    "Content-Type": "application/json"
                },
                cache: "no-store"
            });
            if (studentRes.ok) {
                const data = await studentRes.json();
                if (Array.isArray(data)) {
                    return data;
                }
            }
        }
    } catch (err) {
        console.warn("Failed to fetch student enrollments from backend:", err);
    }
    return [];
}
async function saveVideoProgress(params) {
    const effectiveEmail = params.studentEmail || getClientSessionEmail();
    const { courseSlug, videoId, videoTitle, userId, completed = true, positionSeconds = 180, percentWatched = 100 } = params;
    // 1. Update localStorage cache synchronously
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            const localKey = `jks_prog_${courseSlug}_${effectiveEmail || "student"}`;
            const existingRaw = localStorage.getItem(localKey);
            const existing = existingRaw ? JSON.parse(existingRaw) : {
                completedVideoIds: []
            };
            if (completed && !existing.completedVideoIds.includes(videoId)) {
                existing.completedVideoIds.push(videoId);
            }
            localStorage.setItem(localKey, JSON.stringify(existing));
            // Dispatch real-time global event
            window.dispatchEvent(new CustomEvent("jks_video_progress_changed", {
                detail: {
                    courseSlug,
                    videoId,
                    completedVideoIds: existing.completedVideoIds,
                    studentEmail: effectiveEmail
                }
            }));
        } catch (e) {
            console.warn("Could not save to localStorage:", e);
        }
    }
    // 2. Send request to Supabase API
    try {
        const res = await fetch("http://localhost:4000/enrollments/progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                courseSlug,
                videoId,
                videoTitle,
                studentEmail: effectiveEmail,
                userId,
                completed,
                positionSeconds,
                percentWatched
            })
        });
        if (res.ok) {
            const data = await res.json();
            return {
                success: true,
                enrollmentId: data.enrollmentId,
                progressPercent: data.progressPercent,
                completedVideoIds: data.completedVideoIds || [
                    videoId
                ],
                totalVideos: data.totalVideos
            };
        }
    } catch (err) {
        console.warn("Backend progress tracking call failed, utilizing cached state:", err);
    }
    return {
        success: true,
        progressPercent: 17,
        completedVideoIds: [
            videoId
        ]
    };
}
async function syncAllCourseProgress(params) {
    const effectiveEmail = params.studentEmail || getClientSessionEmail();
    // 1. Update local cache
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            const localKey = `jks_prog_${params.courseSlug}_${effectiveEmail || "student"}`;
            localStorage.setItem(localKey, JSON.stringify({
                completedVideoIds: params.completedVideoIds,
                completedAssignmentIds: params.completedAssignmentIds || []
            }));
            window.dispatchEvent(new CustomEvent("jks_video_progress_changed", {
                detail: {
                    courseSlug: params.courseSlug,
                    completedVideoIds: params.completedVideoIds,
                    completedAssignmentIds: params.completedAssignmentIds,
                    studentEmail: effectiveEmail
                }
            }));
        } catch  {}
    }
    // 2. Post to Supabase API
    try {
        const res = await fetch("http://localhost:4000/enrollments/sync-progress", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                courseSlug: params.courseSlug,
                studentEmail: effectiveEmail,
                completedVideoIds: params.completedVideoIds,
                completedAssignmentIds: params.completedAssignmentIds || []
            })
        });
        if (res.ok) {
            const data = await res.json();
            return data;
        }
    } catch (err) {
        console.warn("Failed to batch sync progress to backend:", err);
    }
    return null;
}
async function fetchCourseProgress(courseSlug, studentEmailOrId) {
    const effectiveEmail = studentEmailOrId || getClientSessionEmail();
    try {
        const url = effectiveEmail ? `http://localhost:4000/enrollments/student/${encodeURIComponent(effectiveEmail)}/course/${encodeURIComponent(courseSlug)}/progress` : `http://localhost:4000/enrollments/progress/${encodeURIComponent(courseSlug)}`;
        const res = await fetch(url, {
            headers: {
                "Content-Type": "application/json"
            },
            cache: "no-store"
        });
        if (res.ok) {
            const data = await res.json();
            return {
                completedVideoIds: data.completedVideoIds || [],
                completedAssignmentIds: data.completedAssignmentIds || [],
                overallPercent: data.overallPercent || 0
            };
        }
    } catch (err) {
        console.warn("Failed to fetch course progress from API:", err);
    }
    // Fallback to local storage if API is unreachable
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            const localKey = `jks_prog_${courseSlug}_${effectiveEmail || "student"}`;
            const cached = localStorage.getItem(localKey);
            if (cached) {
                const parsed = JSON.parse(cached);
                const count = (parsed.completedVideoIds?.length || 0) + (parsed.completedAssignmentIds?.length || 0);
                return {
                    completedVideoIds: parsed.completedVideoIds || [],
                    completedAssignmentIds: parsed.completedAssignmentIds || [],
                    overallPercent: Math.min(100, Math.round(count / 9 * 100))
                };
            }
        } catch  {}
    }
    return {
        completedVideoIds: [],
        completedAssignmentIds: [],
        overallPercent: 0
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_0iifxvq._.js.map