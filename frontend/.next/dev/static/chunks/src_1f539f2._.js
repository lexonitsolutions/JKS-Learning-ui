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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sparkles.mjs [app-client] (ecmascript) <export default as Sparkles>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bot.mjs [app-client] (ecmascript) <export default as Bot>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$leads$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/data/leads-store.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [hasUnread, setHasUnread] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
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
            }
        }
    }["WebsiteChatbot.useEffect"], [
        isOpen,
        messages
    ]);
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
        let botReplyText = "";
        let options = undefined;
        let isLeadForm = false;
        if (q.includes("course") || q.includes("explore")) {
            botReplyText = "We offer enterprise-grade job-ready programs across: \n• **Java Full Stack Developer Mastery** (Spring Boot 3, Microservices, AWS)\n• **Modern Frontend Engineering** (React 19, Next.js 15, TypeScript)\n• **SAP S/4HANA Enterprise Systems**\n• **.NET 9 Enterprise Microservices**\n\nAll programs include real capstone projects and AI Mock Interviews!";
            options = [
                "Fee & Scholarship Info 💰",
                "Book a Free Demo Class 🎓",
                "Request Callback 📞"
            ];
        } else if (q.includes("fee") || q.includes("scholarship") || q.includes("cost") || q.includes("discount")) {
            botReplyText = "Our comprehensive 16–24 week accelerator tracks range from ₹35,000 to ₹65,000 with flexible 0% EMI options. We also offer merit-based scholarships up to 30% off based on our diagnostic test!";
            options = [
                "Claim Scholarship 🎁",
                "Talk to Live Counselor 📞",
                "Explore Courses 🚀"
            ];
        } else if (q.includes("placement") || q.includes("salary") || q.includes("hike") || q.includes("job")) {
            botReplyText = "Our graduates achieve an average **75% salary hike** with top placement packages reaching **₹16.5 LPA** at companies like Infosys, Capgemini, TCS, and high-growth product startups. We provide 100% placement assistance, resume reviews, and adaptive AI mock interview practice.";
            options = [
                "Talk to Live Counselor 📞",
                "Explore Top Courses 🚀",
                "Book a Free Demo Class 🎓"
            ];
        } else if (q.includes("counselor") || q.includes("talk") || q.includes("call") || q.includes("demo") || q.includes("scholarship")) {
            botReplyText = "Great! Please share your contact details below, and our senior academic counselor will connect with you immediately via Call or WhatsApp with personalized syllabus and discount details:";
            isLeadForm = true;
        } else {
            botReplyText = "Thanks for reaching out! Would you like to speak with our admissions team, explore our course syllabus, or check your eligibility for our placement guarantee?";
            options = [
                "Explore Top Courses 🚀",
                "Fee & Scholarship Info 💰",
                "Talk to Live Counselor 📞"
            ];
        }
        const botMsg = {
            id: `bot-${Date.now()}`,
            sender: "bot",
            text: botReplyText,
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
    const handleLeadSubmit = (e)=>{
        e.preventDefault();
        if (!leadForm.name || !leadForm.phone) return;
        setIsSubmittingLead(true);
        try {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$data$2f$leads$2d$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["addLead"])({
                name: leadForm.name,
                phone: leadForm.phone,
                email: leadForm.email || `${leadForm.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
                interestedCourse: leadForm.course,
                source: "website_chatbot",
                campaignName: "Website_Chatbot_Enquiry",
                status: "new",
                priority: "high",
                notes: `Enquiry submitted via Chatbot for ${leadForm.course}`
            });
            setLeadSubmitted(true);
            setMessages((prev)=>[
                    ...prev,
                    {
                        id: `bot-${Date.now()}`,
                        sender: "bot",
                        text: `🎉 Thank you, ${leadForm.name}! Your enquiry has been registered. Our senior admissions counselor has been assigned and will call you at ${leadForm.phone} shortly.`,
                        timestamp: new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                        }),
                        options: [
                            "Connect on WhatsApp Now 💬",
                            "Explore Courses 🚀"
                        ]
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
                className: "fixed bottom-6 right-6 z-50 flex items-center gap-3",
                children: [
                    !isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0,
                            x: 20
                        },
                        animate: {
                            opacity: 1,
                            x: 0
                        },
                        className: "hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 transition-transform",
                        onClick: ()=>setIsOpen(true),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 187,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-xs font-bold text-slate-900",
                                        children: "Need Course Guidance?"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 189,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] text-slate-500",
                                        children: "Admissions Advisor Online"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 190,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                        lineNumber: 181,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>setIsOpen(!isOpen),
                        className: "relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-cyan-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform cursor-pointer",
                        "aria-label": "Toggle Course Advisor Chatbot",
                        children: [
                            hasUnread && !isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute -top-1 -right-1 flex h-4 w-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 203,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center",
                                        children: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 204,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 202,
                                columnNumber: 13
                            }, this),
                            isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                className: "h-6 w-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 209,
                                columnNumber: 21
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"], {
                                className: "h-6 w-6"
                            }, void 0, false, {
                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                lineNumber: 209,
                                columnNumber: 49
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/common/website-chatbot.tsx",
                lineNumber: 179,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0,
                        y: 20,
                        scale: 0.95
                    },
                    animate: {
                        opacity: 1,
                        y: 0,
                        scale: 1
                    },
                    exit: {
                        opacity: 0,
                        y: 20,
                        scale: 0.95
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "fixed bottom-24 right-4 sm:right-6 z-50 flex h-[580px] w-[calc(100vw-2rem)] max-w-sm sm:max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between bg-gradient-to-r from-[#0B1120] via-slate-900 to-[#1E3A8A] p-4 text-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                    className: "h-5 w-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 227,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 226,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            className: "text-sm font-bold",
                                                            children: "JKS Career Advisor"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 232,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "rounded bg-blue-500/30 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300",
                                                            children: "AI Powered"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 231,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-1 text-[11px] text-emerald-400",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Admissions Team Online"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 230,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-1.5",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses.",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors",
                                            title: "Direct WhatsApp",
                                            children: "WhatsApp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 245,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setIsOpen(false),
                                            className: "flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 259,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 254,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 244,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                            lineNumber: 224,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70",
                            children: [
                                messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.sender === "user" ? "bg-[#2563EB] text-white rounded-br-xs shadow-xs" : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs"}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "whitespace-pre-line",
                                                    children: msg.text
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 278,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 271,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "mt-1 text-[10px] text-slate-400 px-1",
                                                children: msg.timestamp
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 281,
                                                columnNumber: 19
                                            }, this),
                                            msg.options && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]",
                                                children: msg.options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>{
                                                            if (opt.includes("WhatsApp")) {
                                                                window.open("https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses.", "_blank");
                                                            } else {
                                                                handleSendMessage(opt);
                                                            }
                                                        },
                                                        className: "rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-semibold text-[#2563EB] shadow-2xs hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer",
                                                        children: opt
                                                    }, opt, false, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 287,
                                                        columnNumber: 25
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 285,
                                                columnNumber: 21
                                            }, this),
                                            msg.isLeadForm && !leadSubmitted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                                onSubmit: handleLeadSubmit,
                                                className: "mt-3 w-full max-w-[90%] rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/50 p-4 shadow-sm space-y-3 text-xs",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "font-bold text-slate-900 flex items-center gap-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sparkles$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sparkles$3e$__["Sparkles"], {
                                                                className: "h-3.5 w-3.5 text-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 315,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Instant Advisor Callback"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 314,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold text-slate-700",
                                                                children: "Full Name *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 320,
                                                                columnNumber: 25
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
                                                                className: "mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 321,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 319,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold text-slate-700",
                                                                children: "Mobile / WhatsApp *"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 25
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
                                                                className: "mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-600"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 333,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 331,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-[11px] font-bold text-slate-700",
                                                                children: "Preferred Course"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 344,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: leadForm.course,
                                                                onChange: (e)=>setLeadForm({
                                                                        ...leadForm,
                                                                        course: e.target.value
                                                                    }),
                                                                className: "mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Java Full Stack Developer Mastery"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 350,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "Modern Frontend Engineering (React 19 & Next.js)"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 351,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: "SAP S/4HANA Enterprise Systems"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 352,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        children: ".NET 9 Enterprise Microservices & Cloud"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                        lineNumber: 353,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 345,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 343,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        disabled: isSubmittingLead,
                                                        className: "w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50",
                                                        children: [
                                                            isSubmittingLead ? "Submitting..." : "Get Free Syllabus & Callback",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                className: "h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                                lineNumber: 363,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 310,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, msg.id, true, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 267,
                                        columnNumber: 17
                                    }, this)),
                                isTyping && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-xs text-slate-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bot$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Bot$3e$__["Bot"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                lineNumber: 373,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 372,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 376,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce delay-100"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 377,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce delay-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                                    lineNumber: 378,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                                            lineNumber: 375,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 371,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    ref: messagesEndRef
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 383,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                            lineNumber: 265,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: (e)=>{
                                e.preventDefault();
                                handleSendMessage();
                            },
                            className: "border-t border-slate-200 bg-white p-3 flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    placeholder: "Ask about syllabus, fees, placements...",
                                    value: inputValue,
                                    onChange: (e)=>setInputValue(e.target.value),
                                    className: "flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 placeholder:text-slate-400"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 394,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: !inputValue.trim(),
                                    className: "flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 transition-colors disabled:opacity-40 cursor-pointer shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/common/website-chatbot.tsx",
                                        lineNumber: 406,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                                    lineNumber: 401,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/common/website-chatbot.tsx",
                            lineNumber: 387,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/common/website-chatbot.tsx",
                    lineNumber: 216,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/common/website-chatbot.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/common/website-chatbot.tsx",
        lineNumber: 177,
        columnNumber: 5
    }, this);
}
_s(WebsiteChatbot, "WXyEa32AJQ62IFZ4yy7/3CIZN6k=");
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