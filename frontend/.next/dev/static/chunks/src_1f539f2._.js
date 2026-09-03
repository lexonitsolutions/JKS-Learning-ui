(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/common/chunk-error-handler.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ChunkErrorHandler",
    ()=>ChunkErrorHandler,
    "handleChunkRetry",
    ()=>handleChunkRetry,
    "isChunkLoadError",
    ()=>isChunkLoadError
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
"use client";
;
const CHUNK_RETRY_KEY = "jks_chunk_load_retry_ts";
const RETRY_THRESHOLD_MS = 10000; // 10 seconds cooldown to prevent reload loops
function isChunkLoadError(error) {
    if (!error) return false;
    const message = typeof error === "string" ? error : error?.message || error?.reason || "";
    const name = error?.name || "";
    return name === "ChunkLoadError" || message.includes("ChunkLoadError") || message.includes("Loading chunk") || message.includes("Failed to fetch dynamically imported module") || message.includes("Importing a module script failed") || message.includes("error loading dynamically imported module") || message.includes("missing required chunk") || message.includes("Cannot find module");
}
function handleChunkRetry() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const lastRetry = sessionStorage.getItem(CHUNK_RETRY_KEY);
        const now = Date.now();
        if (!lastRetry || now - parseInt(lastRetry, 10) > RETRY_THRESHOLD_MS) {
            sessionStorage.setItem(CHUNK_RETRY_KEY, String(now));
            // Force reload from server to get fresh HTML and fresh chunk hashes
            window.location.reload();
            return true;
        }
    } catch  {
        window.location.reload();
        return true;
    }
    return false;
}
function ChunkErrorHandler() {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChunkErrorHandler.useEffect": ()=>{
            const handleError = {
                "ChunkErrorHandler.useEffect.handleError": (event)=>{
                    if (isChunkLoadError(event.error) || isChunkLoadError(event.message) || event.target && event.target.tagName === "SCRIPT") {
                        const handled = handleChunkRetry();
                        if (handled) {
                            event.preventDefault();
                        }
                    }
                }
            }["ChunkErrorHandler.useEffect.handleError"];
            const handleUnhandledRejection = {
                "ChunkErrorHandler.useEffect.handleUnhandledRejection": (event)=>{
                    if (isChunkLoadError(event.reason)) {
                        const handled = handleChunkRetry();
                        if (handled) {
                            event.preventDefault();
                        }
                    }
                }
            }["ChunkErrorHandler.useEffect.handleUnhandledRejection"];
            window.addEventListener("error", handleError, true);
            window.addEventListener("unhandledrejection", handleUnhandledRejection);
            return ({
                "ChunkErrorHandler.useEffect": ()=>{
                    window.removeEventListener("error", handleError, true);
                    window.removeEventListener("unhandledrejection", handleUnhandledRejection);
                }
            })["ChunkErrorHandler.useEffect"];
        }
    }["ChunkErrorHandler.useEffect"], []);
    return null;
}
_s(ChunkErrorHandler, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = ChunkErrorHandler;
var _c;
__turbopack_context__.k.register(_c, "ChunkErrorHandler");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/page-transition-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PageTransitionProvider",
    ()=>PageTransitionProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function PageTransitionProvider({ children }) {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [navigating, setNavigating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PageTransitionProvider.useEffect": ()=>{
            // Subtle, non-blocking route indicator
            setNavigating(true);
            const timer = setTimeout({
                "PageTransitionProvider.useEffect.timer": ()=>{
                    setNavigating(false);
                }
            }["PageTransitionProvider.useEffect.timer"], 250);
            return ({
                "PageTransitionProvider.useEffect": ()=>clearTimeout(timer)
            })["PageTransitionProvider.useEffect"];
        }
    }["PageTransitionProvider.useEffect"], [
        pathname
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            navigating && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed top-0 left-0 right-0 z-[9999] h-[2.5px] bg-transparent overflow-hidden pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#818CF8] shadow-[0_0_8px_rgba(37,99,235,0.8)] animate-[progress_0.3s_ease-out_forwards] w-full"
                }, void 0, false, {
                    fileName: "[project]/src/components/common/page-transition-provider.tsx",
                    lineNumber: 25,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/page-transition-provider.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0 transition-opacity duration-200 ease-out",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/common/page-transition-provider.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/page-transition-provider.tsx",
        lineNumber: 21,
        columnNumber: 5
    }, this);
}
_s(PageTransitionProvider, "q3501p7iKEqFT6tuPr0NZTTgNt0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = PageTransitionProvider;
var _c;
__turbopack_context__.k.register(_c, "PageTransitionProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/common/website-chatbot.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WebsiteChatbot",
    ()=>WebsiteChatbot
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$leads$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/leads-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
const INITIAL_BOT_MESSAGES = [
    {
        id: "msg-1",
        sender: "bot",
        text: "Hello! 👋 Welcome to JKS Learning. I'm Jordan, your AI Admissions & Career Advisor. How can I help accelerate your tech career today?",
        timestamp: "Just now",
        options: [
            "Explore Top Courses 🚀",
            "Fee & Scholarship Info 💰",
            "Placement & Salary Hikes 💼",
            "Talk to Live Counselor 📞"
        ]
    }
];
function WebsiteChatbot() {
    _s();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasUnread, setHasUnread] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [showGuidanceTooltip, setShowGuidanceTooltip] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_BOT_MESSAGES);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isTyping, setIsTyping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Lead Form State inside chat
    const [leadForm, setLeadForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        name: "",
        phone: "",
        email: "",
        course: "Java Full Stack Developer Mastery"
    });
    const [isSubmittingLead, setIsSubmittingLead] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [leadSubmitted, setLeadSubmitted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const messagesEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Determine if current page is an allowed marketing/public page where chatbot is helpful
    const isAllowedPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "WebsiteChatbot.useMemo[isAllowedPage]": ()=>{
            if (!pathname) return false;
            // Disallow all admin, instructor, and dashboard workspaces
            if (pathname.startsWith("/admin") || pathname.startsWith("/instructor") || pathname.startsWith("/dashboard")) {
                return false;
            }
            // Disallow auth pages and checkout/invoice registration page
            if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || pathname.startsWith("/register-course")) {
                return false;
            }
            // Allowed public pages
            return pathname === "/" || pathname.startsWith("/courses") || pathname === "/about" || pathname === "/success-stories" || pathname === "/ai-mock-interview";
        }
    }["WebsiteChatbot.useMemo[isAllowedPage]"], [
        pathname
    ]);
    // Show the "Need Course Guidance?" tooltip for 3.5 seconds on mount/navigation, then smoothly hide it
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WebsiteChatbot.useEffect": ()=>{
            if (!isAllowedPage) return;
            setShowGuidanceTooltip(true);
            const timer = setTimeout({
                "WebsiteChatbot.useEffect.timer": ()=>{
                    setShowGuidanceTooltip(false);
                }
            }["WebsiteChatbot.useEffect.timer"], 3500);
            return ({
                "WebsiteChatbot.useEffect": ()=>clearTimeout(timer)
            })["WebsiteChatbot.useEffect"];
        }
    }["WebsiteChatbot.useEffect"], [
        pathname,
        isAllowedPage
    ]);
    const scrollToBottom = ()=>{
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WebsiteChatbot.useEffect": ()=>{
            if (isOpen) {
                scrollToBottom();
                setHasUnread(false);
                setShowGuidanceTooltip(false);
            }
        }
    }["WebsiteChatbot.useEffect"], [
        isOpen,
        messages
    ]);
    if (!isAllowedPage) {
        return null;
    }
    const handleSendMessage = (textToSend)=>{
        const text = textToSend || inputValue.trim();
        if (!text) return;
        const userMsg = {
            id: `msg-${Date.now()}`,
            sender: "user",
            text,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        };
        setMessages((prev)=>[
                ...prev,
                userMsg
            ]);
        if (!textToSend) setInputValue("");
        setIsTyping(true);
        setTimeout(()=>{
            generateBotResponse(text);
            setIsTyping(false);
        }, 800);
    };
    const generateBotResponse = (userQuery)=>{
        const q = userQuery.toLowerCase();
        let replyText = "";
        let options;
        let isLeadForm = false;
        if (q.includes("course") || q.includes("syllabus") || q.includes("program")) {
            replyText = "We offer 4 premier enterprise certification tracks:\n\n1. ☕ **Java Full Stack Mastery** (Spring Boot 3, Microservices, React 19, AWS)\n2. ⚛️ **Modern Frontend Engineering** (Next.js 16, TypeScript, Three.js 3D)\n3. 🏢 **SAP S/4HANA Enterprise Systems** (FI/CO, MM, SD & ABAP on Cloud)\n4. 🔷 **.NET 9 Enterprise Microservices** (C# 13, ASP.NET Core, Azure Cloud)\n\nWhich technology aligns with your career target?";
            options = [
                "Java Full Stack Details ☕",
                "Frontend Engineering ⚛️",
                "SAP S/4HANA 🏢",
                ".NET 9 Cloud 🔷"
            ];
        } else if (q.includes("fee") || q.includes("scholarship") || q.includes("discount") || q.includes("price") || q.includes("cost")) {
            replyText = "💎 Course Tuition starts from **₹29,999** (inclusive of live cohort classes, hands-on capstone projects, placement assistance, and tax invoice).\n\n🎉 **Early Admission Discount:** Use coupon `ADMISSION10` during registration for an instant 10% scholarship!\n\nWould you like to speak to an admissions advisor or register online?";
            options = [
                "Register for Cohort 📝",
                "Talk to Admissions Advisor 📞",
                "Check Placement Record 💼"
            ];
        } else if (q.includes("placement") || q.includes("job") || q.includes("salary") || q.includes("package") || q.includes("hike")) {
            replyText = "📈 **JKS Learning Placement Highlights:**\n• **94.8%** Verified Placement Rate within 180 days\n• **₹12.4 LPA** Average Starting Package for Full Stack graduates\n• **₹28.5 LPA** Highest CTC secured at Tier-1 MNCs & Product firms\n• 150+ Hiring Partners (Infosys, TCS, Cognizant, Wipro, Accenture, Thoughtworks)\n\nWould you like our career team to review your resume?";
            options = [
                "Book Free Career Call 📞",
                "Explore Course Tracks 🚀",
                "WhatsApp Direct 💬"
            ];
        } else if (q.includes("counselor") || q.includes("advisor") || q.includes("call") || q.includes("contact") || q.includes("talk")) {
            replyText = "Awesome! Our senior admissions counselors Sneha and Kavita can provide personalized 1-on-1 batch selection, syllabus breakdown, and scholarship advice.\n\nPlease fill out your details below to schedule an immediate call:";
            isLeadForm = true;
        } else if (q.includes("java")) {
            replyText = "🔥 **Java Full Stack Developer Mastery** is our flagship 24-week cohort.\n\n• Core Java 21, Spring Boot 3, Hibernate\n• Distributed Microservices, Kafka, Redis\n• React 19, Tailwind CSS, TypeScript\n• AWS Cloud Deployment & CI/CD Pipelines\n• 4 Production Grade Capstone Projects\n\nNext Cohort starts **Monday (Morning & Weekend Batches Available)**.";
            options = [
                "Register with Scholarship 📝",
                "Schedule Syllabus Walkthrough 📞"
            ];
        } else if (q.includes("frontend")) {
            replyText = "⚡ **Modern Frontend Engineering** covers:\n• React 19, Next.js 16 App Router, Server Actions\n• TypeScript strict typing, Tailwind CSS v4\n• Interactive Three.js / WebGL 3D experiences & Framer Motion\n• High performance state management & GraphQL\n\nPerfect for junior to mid-level engineers targeting product companies.";
            options = [
                "Register for Frontend 📝",
                "Talk to Admissions Team 📞"
            ];
        } else if (q.includes("register") || q.includes("admission") || q.includes("enroll")) {
            replyText = "You can register online directly through our automated enrollment portal! You'll select your batch timing, apply your discount coupon, and receive an instant GST Tax Invoice receipt.";
            options = [
                "Open Registration Portal 📝",
                "Talk to Counselor First 📞"
            ];
        } else {
            replyText = "Thank you for reaching out! I can help you with course curriculums, batch timings, early-bird scholarships, and scheduling a direct consultation with our academic team.\n\nWhat would you like to explore?";
            options = [
                "Explore Courses 🚀",
                "Fee & Scholarships 💰",
                "Speak to Advisor 📞"
            ];
        }
        const botMsg = {
            id: `msg-${Date.now()}`,
            sender: "bot",
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            }),
            options,
            isLeadForm
        };
        setMessages((prev)=>[
                ...prev,
                botMsg
            ]);
    };
    const handleLeadSubmit = async (e)=>{
        e.preventDefault();
        if (!leadForm.name || !leadForm.phone) return;
        setIsSubmittingLead(true);
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$leads$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addLead"])({
                name: leadForm.name,
                email: leadForm.email || `${leadForm.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
                phone: leadForm.phone,
                interestedCourse: leadForm.course,
                source: "website_chatbot",
                status: "new",
                priority: "high",
                notes: "Requested instant advisor callback via Website AI Chatbot"
            });
            setLeadSubmitted(true);
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: `msg-${Date.now()}`,
                        sender: "bot",
                        text: `🎉 Thank you **${leadForm.name}**! Your consultation request for **${leadForm.course}** has been assigned to our senior admissions counselor.\n\nYou will receive a call or WhatsApp message at **${leadForm.phone}** within 15 minutes!`,
                        timestamp: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        })
                    }
                ]);
        } catch (err) {
            console.error(err);
        } finally{
            setIsSubmittingLead(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-6 right-6 z-40 flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: !isOpen && (showGuidanceTooltip || isHovered) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0,
                                x: 15,
                                scale: 0.95
                            },
                            animate: {
                                opacity: 1,
                                x: 0,
                                scale: 1
                            },
                            exit: {
                                opacity: 0,
                                x: 10,
                                scale: 0.95
                            },
                            transition: {
                                duration: 0.25
                            },
                            className: "hidden sm:flex items-center gap-2.5 rounded-2xl border border-blue-100 bg-white/95 px-4 py-2.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group",
                            onClick: ()=>setIsOpen(true),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative flex h-2.5 w-2.5 shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 282,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 283,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1",
                                            children: [
                                                "Need Course Guidance?",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                    className: "h-3 w-3 text-amber-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 288,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 286,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-[10px] text-slate-500 font-medium",
                                            children: "Admissions Advisor Online"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 290,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 285,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                            lineNumber: 273,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setIsOpen(!isOpen),
                        onMouseEnter: ()=>setIsHovered(true),
                        onMouseLeave: ()=>setIsHovered(false),
                        className: "group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full shadow-[0_10px_35px_rgba(37,99,235,0.45)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ring-4 ring-white/90 hover:ring-cyan-300 bg-slate-900",
                        "aria-label": "Toggle Course Advisor Chatbot",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 opacity-40 blur-sm group-hover:opacity-80 transition-opacity"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 306,
                                columnNumber: 11
                            }, this),
                            isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative z-10 flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-white",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                    className: "h-6 w-6 transition-transform group-hover:rotate-90 duration-200"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 310,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 309,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative z-10 h-full w-full overflow-hidden rounded-full",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        src: "/software-agent.png",
                                        alt: "JKS AI Career Advisor",
                                        fill: true,
                                        sizes: "64px",
                                        className: "h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 314,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 rounded-full ring-1 ring-inset ring-white/20"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 321,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 313,
                                columnNumber: 13
                            }, this),
                            !isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute bottom-0 right-0 z-20 flex h-4 w-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 328,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 329,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 327,
                                columnNumber: 13
                            }, this),
                            hasUnread && !isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute -top-1 -right-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-white shadow-md",
                                children: "1"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 335,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/website-chatbot.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 24,
                        scale: 0.94
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: 20,
                        scale: 0.94
                    },
                    transition: {
                        duration: 0.25,
                        ease: [
                            0.16,
                            1,
                            0.3,
                            1
                        ]
                    },
                    className: "fixed bottom-24 right-4 sm:right-6 z-50 flex h-[620px] max-h-[85vh] w-[calc(100vw-2rem)] max-w-sm sm:max-w-[430px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35),0_0_0_1px_rgba(255,255,255,0.8)] backdrop-blur-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 text-white shrink-0 border-b border-white/10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-600/30 blur-2xl pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 355,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 356,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative z-10 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 min-w-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/30 ring-1 ring-white/20",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative h-full w-full rounded-[14px] overflow-hidden bg-slate-900",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: "/software-agent.png",
                                                                alt: "JKS AI Career Advisor",
                                                                fill: true,
                                                                sizes: "44px",
                                                                className: "h-full w-full object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 362,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 361,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-xs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 370,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-sm font-black tracking-tight truncate",
                                                                    children: "JKS AI Career Advisor"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                    lineNumber: 375,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-extrabold text-cyan-300 border border-cyan-400/30 shrink-0",
                                                                    children: "AI 2.0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                    lineNumber: 376,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 374,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "relative flex h-2 w-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                            lineNumber: 382,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "relative inline-flex rounded-full h-2 w-2 bg-emerald-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                            lineNumber: 383,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                    lineNumber: 381,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    children: "Admissions Team Online"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                    lineNumber: 385,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 380,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 373,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 359,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5 shrink-0",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses.",
                                                    target: "_blank",
                                                    rel: "noopener noreferrer",
                                                    className: "flex items-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all shadow-xs",
                                                    title: "Direct WhatsApp",
                                                    children: "WhatsApp"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setMessages(INITIAL_BOT_MESSAGES),
                                                    title: "Restart Conversation",
                                                    className: "flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 406,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 400,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: ()=>setIsOpen(false),
                                                    "aria-label": "Close Chat",
                                                    className: "flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                        className: "h-4 w-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 414,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 408,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 390,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 358,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative z-10 mt-3 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-slate-300",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "flex items-center gap-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                    className: "h-3 w-3 text-amber-300"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Ask fees, syllabus, or placement records"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 421,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-cyan-300 font-semibold",
                                            children: "24/7 Live"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 425,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 420,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                            lineNumber: 353,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-white",
                            children: [
                                messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`,
                                        children: [
                                            msg.sender === "bot" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative h-7 w-7 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 shadow-xs mb-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: "/software-agent.png",
                                                    alt: "AI",
                                                    fill: true,
                                                    sizes: "28px",
                                                    className: "h-full w-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 439,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 438,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%]`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${msg.sender === "user" ? "bg-gradient-to-r from-[#2563EB] to-blue-600 text-white rounded-br-xs shadow-blue-500/20" : "bg-white text-slate-800 border border-slate-100 rounded-bl-xs shadow-[0_2px_8px_rgba(0,0,0,0.04)]"}`,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "whitespace-pre-line font-medium",
                                                            children: msg.text
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 457,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 450,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "mt-1 text-[10px] text-slate-400 px-1 font-medium",
                                                        children: msg.timestamp
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 460,
                                                        columnNumber: 21
                                                    }, this),
                                                    msg.options && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-2.5 flex flex-wrap gap-1.5",
                                                        children: msg.options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    if (opt.includes("WhatsApp")) {
                                                                        window.open("https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses.", "_blank");
                                                                    } else if (opt.includes("Register") || opt.includes("Registration")) {
                                                                        window.location.href = "/register-course";
                                                                    } else {
                                                                        handleSendMessage(opt);
                                                                    }
                                                                },
                                                                className: "rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#2563EB] shadow-2xs hover:bg-blue-50 hover:border-blue-300 hover:shadow-xs transition-all active:scale-95 cursor-pointer",
                                                                children: opt
                                                            }, opt, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 466,
                                                                columnNumber: 27
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 464,
                                                        columnNumber: 23
                                                    }, this),
                                                    msg.isLeadForm && !leadSubmitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                        onSubmit: handleLeadSubmit,
                                                        className: "mt-3 w-full rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 p-4 shadow-md shadow-blue-500/10 space-y-3 text-xs",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-black text-slate-900 flex items-center gap-1.5 text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                        className: "h-4 w-4 text-blue-600"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 496,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Instant Advisor Callback"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 497,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 495,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[11px] font-bold text-slate-700",
                                                                        children: "Full Name *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 501,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        required: true,
                                                                        placeholder: "e.g. Ramesh Kumar",
                                                                        value: leadForm.name,
                                                                        onChange: (e)=>setLeadForm({
                                                                                ...leadForm,
                                                                                name: e.target.value
                                                                            }),
                                                                        className: "mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 502,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 500,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[11px] font-bold text-slate-700",
                                                                        children: "Mobile / WhatsApp *"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 513,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "tel",
                                                                        required: true,
                                                                        placeholder: "+91 98765 43210",
                                                                        value: leadForm.phone,
                                                                        onChange: (e)=>setLeadForm({
                                                                                ...leadForm,
                                                                                phone: e.target.value
                                                                            }),
                                                                        className: "mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 514,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 512,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-[11px] font-bold text-slate-700",
                                                                        children: "Preferred Course Track"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 525,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                        value: leadForm.course,
                                                                        onChange: (e)=>setLeadForm({
                                                                                ...leadForm,
                                                                                course: e.target.value
                                                                            }),
                                                                        className: "mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                children: "Java Full Stack Developer Mastery"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                                lineNumber: 531,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                children: "Modern Frontend Engineering (React 19 & Next.js)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                                lineNumber: 532,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                children: "SAP S/4HANA Enterprise Systems"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                                lineNumber: 533,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                children: ".NET 9 Enterprise Microservices & Cloud"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                                lineNumber: 534,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 526,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 524,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "submit",
                                                                disabled: isSubmittingLead,
                                                                className: "w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer disabled:opacity-50 active:scale-98",
                                                                children: [
                                                                    isSubmittingLead ? "Submitting Request..." : "Request Instant Callback",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                        className: "h-3.5 w-3.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 544,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 538,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 491,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 449,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, msg.id, true, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 432,
                                        columnNumber: 17
                                    }, this)),
                                isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs text-slate-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative h-7 w-7 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 shadow-xs",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/software-agent.png",
                                                alt: "AI",
                                                fill: true,
                                                sizes: "28px",
                                                className: "h-full w-full object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 555,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 554,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 shadow-2xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2 w-2 rounded-full bg-blue-600 animate-bounce"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 564,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2 w-2 rounded-full bg-cyan-500 animate-bounce delay-150"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 565,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-2 w-2 rounded-full bg-indigo-600 animate-bounce delay-300"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 566,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] text-slate-400 ml-1 font-medium",
                                                    children: "Advisor is typing..."
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 563,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 553,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messagesEndRef
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 572,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                            lineNumber: 430,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "border-t border-slate-100 bg-white p-3.5 space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                    onSubmit: (e)=>{
                                        e.preventDefault();
                                        handleSendMessage();
                                    },
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Ask about syllabus, fees, scholarships...",
                                            value: inputValue,
                                            onChange: (e)=>setInputValue(e.target.value),
                                            className: "flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-medium"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 584,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "submit",
                                            disabled: !inputValue.trim(),
                                            className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-cyan-500 text-white shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 596,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 591,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 577,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center text-[10px] text-slate-400 font-medium",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "⚡ Instant AI Career Guidance · JKS Learning"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 601,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 600,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                            lineNumber: 576,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                    lineNumber: 345,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/website-chatbot.tsx",
                lineNumber: 343,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/website-chatbot.tsx",
        lineNumber: 267,
        columnNumber: 5
    }, this);
}
_s(WebsiteChatbot, "ZzgCnUNWocQSwsrcnIok5JWFk5E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = WebsiteChatbot;
var _c;
__turbopack_context__.k.register(_c, "WebsiteChatbot");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/data/leads-store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "COUNSELORS",
    ()=>COUNSELORS,
    "addLead",
    ()=>addLead,
    "addLeadActivityNote",
    ()=>addLeadActivityNote,
    "assignLeadToCounselor",
    ()=>assignLeadToCounselor,
    "getStoredLeads",
    ()=>getStoredLeads,
    "saveStoredLeads",
    ()=>saveStoredLeads,
    "updateLeadStatus",
    ()=>updateLeadStatus
]);
const COUNSELORS = [
    {
        id: "c1",
        name: "Priya Sharma",
        email: "priya.s@jkslearning.com",
        phone: "+91 98765 43210",
        avatar: "PS",
        activeLeadsCount: 14
    },
    {
        id: "c2",
        name: "Rahul Verma",
        email: "rahul.v@jkslearning.com",
        phone: "+91 98765 43211",
        avatar: "RV",
        activeLeadsCount: 11
    },
    {
        id: "c3",
        name: "Ananya Iyer",
        email: "ananya.i@jkslearning.com",
        phone: "+91 98765 43212",
        avatar: "AI",
        activeLeadsCount: 18
    },
    {
        id: "c4",
        name: "Vikram Singh",
        email: "vikram.s@jkslearning.com",
        phone: "+91 98765 43213",
        avatar: "VS",
        activeLeadsCount: 9
    }
];
const INITIAL_LEADS = [
    {
        id: "LEAD-2026-101",
        name: "Rohan Kulkarni",
        email: "rohan.kulkarni@gmail.com",
        phone: "+91 98230 45678",
        interestedCourse: "Java Full Stack Developer Mastery",
        source: "meta_ads",
        campaignName: "FB_Ad_FullStack_Bangalore_Aug26",
        status: "new",
        priority: "high",
        budget: "₹45,000",
        createdDate: "2026-08-30T10:15:00Z",
        followUpDate: "2026-08-31T11:00:00Z",
        notes: "Saw FB video ad on Microservices & Cloud architecture. Wants morning batch.",
        activities: [
            {
                id: "act-1",
                type: "status_change",
                description: "Lead captured automatically from Meta Ads Campaign (FB_Ad_FullStack_Bangalore_Aug26)",
                author: "System Bot",
                timestamp: "2026-08-30T10:15:00Z"
            }
        ]
    },
    {
        id: "LEAD-2026-102",
        name: "Sneha Reddy",
        email: "sneha.reddy@outlook.com",
        phone: "+91 97012 34567",
        interestedCourse: "Modern Frontend Engineering (React 19 & Next.js)",
        source: "website_chatbot",
        status: "assigned",
        assignedTo: COUNSELORS[0],
        priority: "high",
        budget: "₹35,000",
        createdDate: "2026-08-30T09:40:00Z",
        followUpDate: "2026-08-31T14:30:00Z",
        notes: "Inquired about Weekend batch and placement assistance in Hyderabad.",
        activities: [
            {
                id: "act-2",
                type: "status_change",
                description: "Enquiry submitted via Website AI Chatbot",
                author: "AI Assistant",
                timestamp: "2026-08-30T09:40:00Z"
            },
            {
                id: "act-3",
                type: "assignment",
                description: "Assigned to counselor Priya Sharma",
                author: "Admin",
                timestamp: "2026-08-30T09:50:00Z"
            }
        ]
    },
    {
        id: "LEAD-2026-103",
        name: "Aditya Nair",
        email: "aditya.nair@yahoo.com",
        phone: "+91 98450 11223",
        interestedCourse: "SAP S/4HANA Enterprise Systems",
        source: "google_ads",
        campaignName: "Google_Search_SAP_India_TopTier",
        status: "follow_up",
        assignedTo: COUNSELORS[2],
        priority: "medium",
        budget: "₹65,000",
        createdDate: "2026-08-29T14:20:00Z",
        followUpDate: "2026-08-31T16:00:00Z",
        notes: "Has 2 years IT support experience; switching to SAP MM/FICO.",
        activities: [
            {
                id: "act-4",
                type: "status_change",
                description: "Captured via Google Search Ad",
                author: "System Bot",
                timestamp: "2026-08-29T14:20:00Z"
            },
            {
                id: "act-5",
                type: "call",
                description: "Called candidate: Shared SAP syllabus and requested previous experience certificate.",
                author: "Ananya Iyer",
                timestamp: "2026-08-30T11:00:00Z"
            }
        ]
    },
    {
        id: "LEAD-2026-104",
        name: "Karthik Sundaram",
        email: "karthik.sundaram@gmail.com",
        phone: "+91 99401 88990",
        interestedCourse: ".NET 9 Enterprise Microservices & Cloud",
        source: "meta_ads",
        campaignName: "Insta_Reels_DotNet_Cloud_Pro",
        status: "demo_scheduled",
        assignedTo: COUNSELORS[1],
        priority: "high",
        budget: "₹45,000",
        createdDate: "2026-08-28T11:00:00Z",
        followUpDate: "2026-09-01T10:00:00Z",
        notes: "Live demo session with Senior Architect booked for Sept 1st at 10 AM.",
        activities: [
            {
                id: "act-6",
                type: "status_change",
                description: "Demo class link sent via WhatsApp & Email",
                author: "Rahul Verma",
                timestamp: "2026-08-29T15:30:00Z"
            }
        ]
    },
    {
        id: "LEAD-2026-105",
        name: "Meera Patel",
        email: "meera.patel@gmail.com",
        phone: "+91 98980 12345",
        interestedCourse: "Java Full Stack Developer Mastery",
        source: "referral",
        status: "converted",
        assignedTo: COUNSELORS[0],
        priority: "high",
        budget: "₹45,000",
        createdDate: "2026-08-25T16:00:00Z",
        notes: "Enrolled in Batch #28! Payment verified (₹45,000).",
        activities: [
            {
                id: "act-7",
                type: "status_change",
                description: "Converted to Enrolled Student. Student ID: STU-2026-042 created.",
                author: "Priya Sharma",
                timestamp: "2026-08-29T18:00:00Z"
            }
        ]
    },
    {
        id: "LEAD-2026-106",
        name: "Vikas Choudhary",
        email: "vikas.c@gmail.com",
        phone: "+91 97110 99887",
        interestedCourse: "Modern Frontend Engineering (React 19 & Next.js)",
        source: "meta_ads",
        campaignName: "FB_Frontend_Retargeting",
        status: "lost",
        assignedTo: COUNSELORS[3],
        priority: "low",
        createdDate: "2026-08-24T12:00:00Z",
        notes: "Joined local offline coaching institute. Mark as lost.",
        activities: [
            {
                id: "act-8",
                type: "status_change",
                description: "Status changed to Lost / Not Interested",
                author: "Vikram Singh",
                timestamp: "2026-08-28T14:00:00Z"
            }
        ]
    }
];
const LEADS_STORAGE_KEY = "jks_leads_crm_store_v1";
function getStoredLeads() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(LEADS_STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
            return INITIAL_LEADS;
        }
        return JSON.parse(raw);
    } catch  {
        return INITIAL_LEADS;
    }
}
function saveStoredLeads(leads) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch (err) {
        console.error("Failed to save leads:", err);
    }
}
function addLead(newLeadData) {
    const current = getStoredLeads();
    const newLead = {
        ...newLeadData,
        id: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
        createdDate: new Date().toISOString(),
        activities: [
            {
                id: `act-${Date.now()}`,
                type: "status_change",
                description: `New lead created via ${newLeadData.source.replace("_", " ").toUpperCase()}`,
                author: "System Ingestion",
                timestamp: new Date().toISOString()
            }
        ]
    };
    const updated = [
        newLead,
        ...current
    ];
    saveStoredLeads(updated);
    return newLead;
}
function updateLeadStatus(leadId, status, note) {
    const current = getStoredLeads();
    const idx = current.findIndex((l)=>l.id === leadId);
    if (idx === -1) return null;
    const lead = {
        ...current[idx]
    };
    lead.status = status;
    lead.activities.unshift({
        id: `act-${Date.now()}`,
        type: "status_change",
        description: `Status updated to ${status.replace("_", " ").toUpperCase()}${note ? ` (${note})` : ""}`,
        author: "Admin / Counselor",
        timestamp: new Date().toISOString()
    });
    current[idx] = lead;
    saveStoredLeads(current);
    return lead;
}
function assignLeadToCounselor(leadId, counselorId) {
    const current = getStoredLeads();
    const counselor = COUNSELORS.find((c)=>c.id === counselorId);
    const idx = current.findIndex((l)=>l.id === leadId);
    if (idx === -1 || !counselor) return null;
    const lead = {
        ...current[idx]
    };
    lead.assignedTo = counselor;
    if (lead.status === "new") {
        lead.status = "assigned";
    }
    lead.activities.unshift({
        id: `act-${Date.now()}`,
        type: "assignment",
        description: `Lead assigned to counselor ${counselor.name}`,
        author: "Admin",
        timestamp: new Date().toISOString()
    });
    current[idx] = lead;
    saveStoredLeads(current);
    return lead;
}
function addLeadActivityNote(leadId, text, type = "note") {
    const current = getStoredLeads();
    const idx = current.findIndex((l)=>l.id === leadId);
    if (idx === -1) return null;
    const lead = {
        ...current[idx]
    };
    lead.activities.unshift({
        id: `act-${Date.now()}`,
        type,
        description: text,
        author: "Counselor",
        timestamp: new Date().toISOString()
    });
    current[idx] = lead;
    saveStoredLeads(current);
    return lead;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1f539f2._.js.map