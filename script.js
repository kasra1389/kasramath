// =====================================================================================
// شروع اسکریپت اصلی اپلیکیشن "کسری ریاضی" - نسخه 4.0
// این اسکریپت شامل تمام منطق و پویایی وب‌سایت است.
// کامنت‌گذاری گسترده فارسی برای درک بهتر کد انجام شده است.
// =====================================================================================

// --- وضعیت‌ها و تنظیمات گلوبال ---
let currentLanguage = 'fa'; // زبان پیش‌فرض برنامه (فارسی)
let currentTheme = 'classic'; // تم پیش‌فرض برنامه (کلاسیک)
let activeSection = 'home'; // بخشی که در ابتدا نمایش داده می‌شود (صفحه اصلی)
let currentFontFarsi = "'Vazirmatn', Arial, sans-serif"; // فونت فارسی پیش‌فرض
let currentFontEnglish = "'Inter', 'Vazirmatn', sans-serif"; // فونت انگلیسی پیش‌فرض

// متغیرهای مربوط به تخته سفید دیجیتال
let whiteboardCtx, isDrawing = false, lastX, lastY; 
let wbBrushColor = 'black', wbBrushSize = 5, currentTool = 'draw', wbEraserColor = 'white'; 

// متغیرها برای ذخیره عبارات در بخش ساده‌سازی (برای ارسال به Gemini API)
let originalExpressionForAI = '', simplifiedExpressionForAI = ''; 

let currentTimeIntervalId = null; // شناسه‌ی اینتروال برای به‌روزرسانی ساعت در تقویم
let pageLoadTime = new Date(); // زمان بارگذاری صفحه برای محاسبه مدت زمان آنلاین بودن
let onlineDurationIntervalId = null; // شناسه‌ی اینتروال برای به‌روزرسانی مدت زمان آنلاین بودن

let tempGuestId = `guest_${crypto.randomUUID()}`; // ایجاد یک شناسه موقت و تصادفی برای کاربر مهمان
let userData = { name: '', interest: '' }; // برای ذخیره موقت اطلاعات کاربر از فرم

let collectedErrors = []; // آرایه‌ای برای نگهداری پیام‌های خطا
let displayedNotes = []; // آرایه‌ای برای نگهداری یادداشت‌های موقت نمایش داده شده
let noteToEditDisplayOnly = null; // برای نگهداری یادداشتی که قرار است به صورت نمایشی ویرایش شود
let noteToDeleteDisplayOnlyId = null; // برای نگهداری شناسه یادداشتی که قرار است به صورت نمایشی حذف شود
let isErrorModalOpen = false; // برای پیگیری وضعیت باز بودن مودال خطا

// --- رشته‌های ترجمه ---
// این آبجکت بزرگ شامل تمام متن‌های قابل ترجمه در برنامه است.
const translations = {
    "fa": { 
        "siteTitle": "کسری ریاضی", "navHome": "🏠 صفحه اصلی", "navSimplify": "📉 ساده‌سازی", "navSolve": "🧮 حل معادله", "navNotes": "🗒️ یادداشت", "navWhiteboard": "🎨 تخته سفید", "navSearch": "🔍 جستجو",
        "navInfoDropdown": "👤 اطلاعات", "navCalendarDropdown": "📅 تقویم", "navArticlesDropdown": "📚 مقالات", "navBlogDropdown": "📝 وبلاگ", "navVideosDropdown": "🎬 ویدیوها", "navToolsDropdown": "🛠️ ابزارک‌ها", "navSoftwareDropdown": "💻 نرم‌افزارها", "navProductsDropdown": "🛍️ محصولات", "navAdsDropdown": "📢 تبلیغات", "navContactDropdown": "📞 تماس با ما", "navAboutDropdown": "ℹ️ درباره ما",
        "settingsTitle": "⚙️ تنظیمات", "themeLabel": "🎨 تم", "fontFarsiLabel": "🇮🇷 فونت فارسی", "fontEnglishLabel": "🇬🇧 فونت انگلیسی", "languageLabel": "🌍 زبان", "languageToggleButton": "Switch to English", "helpButtonTitle": "راهنما", 
        "loaderText": "بارگذاری اولیه کسری ریاضی...",
        "welcomeOverlayTitle": "به دنیای کسری ریاضی قدم بگذارید!", 
        "welcomeOverlayText": "جایی که پیچیدگی‌ها ساده می‌شوند و یادگیری ریاضیات به یک ماجراجویی هیجان‌انگیز تبدیل می‌شود. آماده‌اید؟", 
        "proceedToFormButton": "شروع کنیم!",
        "userInfoFormTitle": "اطلاعات شما", "userFormNameLabel": "نام (اختیاری):", "userFormInterestLabel": "حوزه علاقه (اختیاری):", "skipUserFormButton": "رد شدن", "submitUserFormButton": "ثبت و ادامه",
        "welcomeTitle": "به کسری ریاضی خوش آمدید! 👋", "appDescription": "ابزاری جامع و قدرتمند برای ساده‌سازی عبارات جبری، حل معادلات، یادداشت‌برداری هوشمند، نقاشی روی تخته سفید دیجیتال و کاوش در دنیای ریاضیات. 🚀",
        "simplifyTitle": "📉 ساده‌سازی عبارات جبری", "expressionPlaceholder": "عبارت جبری را وارد کنید (مثال: 2x^2 + 3x - x^2 + 7 - 2x)", "simplifyButton": "ساده کن", "resultLabel": "نتیجه:", "copyResultButton": "کپی",
        "explainSimplifyButton": "توضیح مراحل ✨",
        "solveTitle": "🧮 حل معادلات", "solveButtonInternalLabel": "حل کن (به زودی)", "equationPlaceholder": "معادله را وارد کنید (مثال: 2*x + 5 = 13  یا  x^2 - 5*x + 6 = 0  یا  sin(x) = 0.5)", "solveButtonInternal": "حل کن (به زودی)", "solutionLabel": "جواب(ها):",
        "aiSolveButton": "حل با هوش مصنوعی ✨", "solveInternalComingSoon": "قابلیت حل معادله با کتابخانه داخلی به زودی اضافه خواهد شد. فعلاً می‌توانید از گزینه \"حل با هوش مصنوعی\" استفاده کنید.",
        "notesTitle": "🗒️ یادداشت‌ها و چک‌لیست‌ها (نمایشی)", "noteTitlePlaceholder": "عنوان یادداشت...", "noteContentPlaceholder": "محتوای اصلی یادداشت...", "checklistHeader": "☑️ آیتم‌های چک‌لیست:", "addChecklistItemButton": "افزودن آیتم چک‌لیست", "saveNoteButtonAdd": "افزودن یادداشت (نمایشی)", "saveNoteButtonEdit": "ذخیره تغییرات (نمایشی)", "editButton": "ویرایش (نمایشی)", "deleteButton": "حذف (نمایشی)", "clearNoteFormButton": "پاک کردن فرم",
        "notesDisabledMessage": "یادداشت‌های نمایش داده شده در زیر موقتی هستند و با رفرش صفحه پاک می‌شوند.",
        "whiteboardTitle": "🎨 تخته سفید دیجیتال", "wbToolLabel": "ابزار:", "wbPencilTool": "قلم", "wbEraserTool": "پاک‌کن", "wbColorLabel": "رنگ:", "wbSizeLabel": "اندازه:", "wbClearBtnText": "پاک کردن کل",
        "infoTitle": "👤 اطلاعات", "userInfoTab": "اطلاعات کاربر", "systemInfoTab": "اطلاعات سیستم", "devInfoTab": "اطلاعات سازنده", "siteStatsTab": "آمار سایت", "userInfoHeader": "اطلاعات کاربری شما", "userIdLabel": "شناسه کاربری شما:", "userNameLabel": "نام کاربر:", "userInterestLabel": "حوزه علاقه:", "systemInfoHeader": "اطلاعات سیستم شما", "devInfoHeader": "درباره سازنده 💎", "siteStatsHeader": "آمار و اطلاعات سایت", "loginTimeLabel": "تاریخ ورود به سایت:", "onlineDurationLabel": "مدت زمان آنلاین بودن:",
        "devInfoText": "این اپلیکیشن توسط کسری شیر علی زاده و با الهام از قدرت هوش مصنوعی جمنای (Gemini) و با هدف ارائه ابزاری کاربردی و زیبا برای علاقه‌مندان به ریاضیات طراحی و پیاده‌سازی شده است. امیدواریم از کار با آن لذت ببرید!",
        "siteCreationDate": "تاریخ ایجاد سایت: خرداد ۱۴۰۳ (ژوئن ۲۰۲۵) - (نمایشی)", "siteDevTime": "مدت زمان توسعه: چندین هفته تلاش و کدنویسی! - (نمایشی)", "sitePowerDesc": "قدرت سایت: ارائه مجموعه‌ای از ابزارهای ریاضی کاربردی با رابط کاربری مدرن و واکنش‌گرا، همراه با قابلیت‌های هوش مصنوعی.",
        "calendarTitle": "📅 تقویم امروز", "calendarPlaceholder": "نمایش تاریخ میلادی به همراه روز هفته و ساعت.", "currentTimeLabel": "ساعت جاری:",
        "articlesTitle": "📚 مقالات ریاضی", "blogTitle": "📝 وبلاگ کسری ریاضی", "videosTitle": "🎬 ویدیوهای آموزشی ریاضی در آپارات", "toolsTitle": "🛠️ ابزارک‌های کاربردی", "softwareTitle": "💻 نرم‌افزارهای مفید", "productsTitle": "🛍️ محصولات و خدمات ما", "adsTitle": "📢 بخش ویژه تبلیغات", "contactTitle": "📞 ارتباط با کسری ریاضی", "aboutTitle": "ℹ️ درباره پروژه \"کسری ریاضی\"", 
        "aboutIntroTitle": "معرفی پروژه", "aboutMissionVisionTitle": "ماموریت و چشم‌انداز ما", "aboutMathUniverseTitle": "ریاضیات: زبان شگفت‌انگیز کائنات", "aboutDevelopmentFutureTitle": "توسعه مداوم و نگاه به آینده",
        "contactDirectTitle": "راه‌های ارتباط مستقیم", "contactSocialTitle": "ما را دنبال کنید", "contactFormSubtitle": "سوالات، پیشنهادات و انتقادات خود را از طریق فرم زیر با ما در میان بگذارید. (این فرم نمایشی است)",
        "contactNameLabel": "نام شما:", "contactEmailLabel": "ایمیل شما:", "contactMessageLabel": "پیام شما:", "contactSubmitButton": "ارسال پیام", "contactFormNoteGoftino": "این فرم صرفاً جهت نمایش است. برای تماس واقعی، لطفاً از اطلاعات تماس ارائه شده (تلفن، تلگرام، ایمیل) استفاده کنید.",
        "footerText": `&copy; ${new Date().getFullYear()} کسری ریاضی. تمامی حقوق محفوظ است. 💎`, 
        "copyrightText": "طراحی و توسعه با افتخار توسط کسری شیر علی زاده.",
        "helpModalTitle": "راهنمای جامع کسری ریاضی", "helpIntro": "به «کسری ریاضی» خوش آمدید! 🥳 این راهنما به شما در استفاده از تمامی امکانات سایت کمک می‌کند:",
        "helpNavigationTitle": "ناوبری در سایت:", "helpNavigationText": "شما می‌توانید از منوی اصلی در بالای صفحه (یا منوی کشویی در موبایل) برای دسترسی به بخش‌های مختلف استفاده کنید. همچنین، یک منوی دسترسی سریع در سمت راست صفحه (در دسکتاپ) برای پرش به ابزارهای اصلی تعبیه شده است.",
        "helpSimplifyTitle": "📉 ساده‌سازی عبارات:", "helpSimplifyText": "در این بخش، عبارت جبری خود را در کادر مربوطه وارد کرده و دکمه \"ساده کن\" را بزنید. نتیجه ساده‌شده به سرعت نمایش داده می‌شود. برای درک بهتر فرآیند ساده‌سازی، می‌توانید از دکمه \"توضیح مراحل ✨\" استفاده کنید که با کمک هوش مصنوعی، مراحل را به صورت گام به گام شرح می‌دهد.",
        "helpSolveTitle": "🧮 حل معادلات:", "helpSolveText": "معادله مورد نظر خود را در کادر وارد کنید. برای دریافت راه‌حل‌های تشریحی و گام‌به‌گام، از دکمه \"حل با هوش مصنوعی ✨\" استفاده نمایید. قابلیت حل مستقیم با کتابخانه داخلی (دکمه \"حل کن (به زودی)\") در به‌روزرسانی‌های آینده به سایت اضافه خواهد شد.",
        "helpNotesTitle": "🗒️ یادداشت و چک‌لیست (نمایشی):", "helpNotesText": "این بخش به شما امکان ایجاد یادداشت‌های موقت را می‌دهد. عنوان، محتوای اصلی و آیتم‌های چک‌لیست (با قابلیت تیک زدن) را وارد کنید. با کلیک روی \"افزودن یادداشت (نمایشی)\"، یادداشت شما در پایین فرم نمایش داده می‌شود. می‌توانید یادداشت‌های نمایش داده شده را به صورت نمایشی \"ویرایش\" (اطلاعات به فرم بازمی‌گردد) یا \"حذف\" کنید. توجه: این یادداشت‌ها با رفرش کردن صفحه پاک خواهند شد.",
        "helpWhiteboardTitle": "🎨 تخته سفید دیجیتال:", "helpWhiteboardText": "با انتخاب ابزار (قلم برای نوشتن یا پاک‌کن)، رنگ دلخواه و اندازه مناسب برای قلم/پاک‌کن، ایده‌ها، فرمول‌ها و نمودارهای خود را روی بوم دیجیتال پیاده کنید. با استفاده از دکمه \"پاک کردن کل\"، می‌توانید تمام محتوای تخته را پاک کرده و از نو شروع کنید.",
        "helpSettingsTitle": "⚙️ تنظیمات شخصی‌سازی:", "helpSettingsText": "از منوی تنظیمات (آیکن چرخ‌دنده در بالای صفحه) برای شخصی‌سازی ظاهر سایت استفاده کنید. شما می‌توانید تم کلی سایت (کلاسیک، فضایی، مدرن، نئونی، هکری)، فونت فارسی و فونت انگلیسی مورد علاقه خود و همچنین زبان برنامه (فارسی/انگلیسی) را تغییر دهید. این تنظیمات در مرورگر شما ذخیره می‌شوند تا در بازدیدهای بعدی نیز اعمال گردند.",
        "helpSearchTitle": "🔍 جستجوی هوشمند:", "helpSearchText": "در بخش جستجو (قابل دسترس از منوی اصلی)، عبارت یا کلمه کلیدی مورد نظر خود را تایپ کنید. سیستم به طور هوشمند در محتوای متنی بخش‌های مختلف سایت (مانند عناوین، توضیحات مقالات، و ...) جستجو کرده و نتایج مرتبط را به همراه یک قطعه کوتاه از متن برای شما نمایش می‌دهد. با کلیک روی هر نتیجه، به بخش مربوطه هدایت خواهید شد.",
        "helpInfoTitle": "👤 بخش اطلاعات:", "helpInfoText": "در این بخش می‌توانید اطلاعات کاربری (نمایشی)، اطلاعات سیستم خود، اطلاعاتی درباره سازنده سایت و آمار کلی سایت (نمایشی) را مشاهده کنید.",
        "helpErrorsTitle": "🐞 مشاهده خطاها:", "helpErrorsText": "اگر در هنگام بارگذاری اولیه برنامه یا استفاده از قابلیت‌هایی که به کتابخانه‌های خارجی یا سرویس‌های آنلاین (مانند Gemini API) وابسته‌اند مشکلی پیش بیاید، یک دکمه کوچک با آیکون هشدار در پایین-چپ صفحه ظاهر می‌شود. با کلیک روی این دکمه، می‌توانید لیست خطاهای رخ داده را مشاهده کنید. این دکمه در صورت بروز خطای جدید، برجسته‌تر خواهد شد.",
        "helpEnjoy": "امیدواریم از کار با امکانات متنوع \"کسری ریاضی\" لذت ببرید و این ابزار برای شما مفید واقع شود! ✨",
        "errorSimplifying": "خطا در ساده‌سازی عبارت.", "errorSolving": "خطا در حل معادله یا فرمت نامعتبر.", "noSolution": "جوابی یافت نشد یا معادله پیچیده‌تر از حد پشتیبانی شده است.",
        "confirmDeleteTitle": "تایید حذف", "confirmDeleteText": "آیا از حذف این یادداشت نمایشی مطمئن هستید؟", "cancelButton": "انصراف", "confirmButton": "حذف",
        "loading": "در حال بارگذاری...", "fetchingAIResponse": "در حال دریافت پاسخ از هوش مصنوعی...", "noteSaved": "یادداشت (نمایشی) افزوده شد.", "noteDeleted": "یادداشت (نمایشی) حذف شد.", "noteUpdated": "یادداشت (نمایشی) برای ویرایش در فرم قرار گرفت.", "noteFormCleared": "فرم یادداشت پاک شد.",
        "emptyExpression": "لطفا یک عبارت وارد کنید.", "emptyEquation": "لطفا یک معادله وارد کنید.", "emptyNote": "عنوان یا محتوای یادداشت یا حداقل یک آیتم چک‌لیست نمی‌تواند خالی باشد.",
        "yes": "بله", "no": "خیر", "noNotesYet": "هنوز یادداشتی (نمایشی) اضافه نشده است.", "errorSavingNote": "خطا در ذخیره یادداشت.", "errorDeletingNote": "خطا در حذف یادداشت.",
        "equationSolved": "معادله با موفقیت حل شد.",
        "deleteChecklistItem": "حذف آیتم",
        "aiResponseModalTitle": "پاسخ هوش مصنوعی ✨",
        "errorCallingAI": "خطا در ارتباط با سرویس هوش مصنوعی. لطفا بعدا تلاش کنید.",
        "noAIResponse": "پاسخی از سرویس هوش مصنوعی دریافت نشد.",
        "systemMessageTitle": "پیام سیستم", "okButton": "باشه", "contactFormSuccess": "پیام شما (نمایشی) دریافت شد! از اطلاعات تماس واقعی برای ارتباط استفاده کنید.",
        "copiedToClipboard": "نتیجه در کلیپ‌بورد کپی شد!",
        "guestUser": "کاربر مهمان",
        "errorDisplayModalTitle": "خطاهای رخ داده",
        "noErrorsToDisplay": "در حال حاضر خطایی گزارش نشده است.",
        "searchTitle": "🔍 جستجوی هوشمند در سایت", "searchPlaceholder": "کلمه یا عبارت مورد نظر را جستجو کنید...", "searchNoResults": "موردی یافت نشد.", "searchMinChars": "لطفا حداقل ۲ کاراکتر برای جستجو وارد کنید."
            },
            "en": { // English translations - abbreviated for brevity, will be fully implemented
                "siteTitle": "Kasra Mathematics", "navHome": "🏠 Home", "navSimplify": "📉 Simplify", "navSolve": "🧮 Solve", "navNotes": "🗒️ Notes", "navWhiteboard": "🎨 Whiteboard", "navSearch": "🔍 Search",
                "navInfoDropdown": "👤 Info", "navCalendarDropdown": "📅 Calendar", "navArticlesDropdown": "📚 Articles", "navBlogDropdown": "📝 Blog", "navVideosDropdown": "🎬 Videos", "navToolsDropdown": "🛠️ Tools", "navSoftwareDropdown": "💻 Software", "navProductsDropdown": "🛍️ Products", "navAdsDropdown": "📢 Ads", "navContactDropdown": "📞 Contact", "navAboutDropdown": "ℹ️ About",
                "settingsTitle": "⚙️ Settings", "themeLabel": "🎨 Theme", "fontFarsiLabel": "🇮🇷 Farsi Font", "fontEnglishLabel": "🇬🇧 English Font", "languageLabel": "🌍 Language", "languageToggleButton": "تغییر به فارسی", "helpButtonTitle": "Help",
                "loaderText": "Initializing Kasra Mathematics...",
                "welcomeOverlayTitle": "Step into the World of Kasra Mathematics!", 
                "welcomeOverlayText": "Where complexities are simplified and learning math becomes an exciting adventure. Ready?", 
                "proceedToFormButton": "Let's Start!",
                "userInfoFormTitle": "Your Information", "userFormNameLabel": "Name (Optional):", "userFormInterestLabel": "Area of Interest (Optional):", "skipUserFormButton": "Skip", "submitUserFormButton": "Submit & Continue",
                "welcomeTitle": "Welcome to Kasra Mathematics! 👋", "appDescription": "A comprehensive and powerful tool for simplifying algebraic expressions, solving equations, smart note-taking, drawing on a digital whiteboard, and exploring the world of mathematics. 🚀",
                "simplifyTitle": "📉 Algebraic Expression Simplification", "expressionPlaceholder": "Enter algebraic expression (e.g., 2x^2 + 3x - x^2 + 7 - 2x)", "simplifyButton": "Simplify", "resultLabel": "Result:", "copyResultButton": "Copy",
                "explainSimplifyButton": "Explain Steps ✨",
                "solveTitle": "🧮 Equation Solver", "solveButtonInternalLabel": "Solve (Coming Soon)", "equationPlaceholder": "Enter equation (e.g., 2*x + 5 = 13  or  x^2 - 5*x + 6 = 0  or  sin(x) = 0.5)", "solveButtonInternal": "Solve (Coming Soon)", "solutionLabel": "Solution(s):",
                "aiSolveButton": "Solve with AI ✨", "solveInternalComingSoon": "Internal equation solver will be added soon. Please use AI solver for now.",
                "notesTitle": "🗒️ Notes & Checklists (Display Only)", "noteTitlePlaceholder": "Note title...", "noteContentPlaceholder": "Main note content...", "checklistHeader": "☑️ Checklist Items:", "addChecklistItemButton": "Add Checklist Item", "saveNoteButtonAdd": "Add Note (Display Only)", "saveNoteButtonEdit": "Save Changes (Display Only)", "editButton": "Edit (Display Only)", "deleteButton": "Delete (Display Only)", "clearNoteFormButton": "Clear Form",
                "notesDisabledMessage": "Displayed notes below are temporary and will be cleared on page refresh. Permanent saving is not available in this version.",
                "whiteboardTitle": "🎨 Digital Whiteboard", "wbToolLabel": "Tool:", "wbPencilTool": "Pencil", "wbEraserTool": "Eraser", "wbColorLabel": "Color:", "wbSizeLabel": "Size:", "wbClearBtnText": "Clear All",
                "infoTitle": "👤 Information", "userInfoTab": "User Info", "systemInfoTab": "System Info", "devInfoTab": "Developer Info", "siteStatsTab": "Site Stats", "userInfoHeader": "Your User Information", "userIdLabel": "Your User ID:", "userNameLabel": "User Name:", "userInterestLabel": "Area of Interest:", "systemInfoHeader": "Your System Information", "devInfoHeader": "About The Creator 💎", "siteStatsHeader": "Site Stats & Info", "loginTimeLabel": "Site Entry Time:", "onlineDurationLabel": "Time Online:",
                "devInfoText": "This application was designed and implemented by Kasra Shir Alizadeh, inspired by the power of Gemini AI, with the goal of providing a practical and beautiful tool for mathematics enthusiasts. We hope you enjoy using it!",
                "siteCreationDate": "Site Creation Date: June 2025 (Demo)", "siteDevTime": "Development Time: Several weeks of effort and coding! (Demo)", "sitePowerDesc": "Site Power: Providing a suite of useful mathematical tools with a modern, responsive UI, enhanced by AI capabilities.",
                "calendarTitle": "📅 Today's Calendar", "calendarPlaceholder": "Displaying Gregorian date with day of the week and time.", "currentTimeLabel": "Current Time:",
                "articlesTitle": "📚 Math Articles", "blogTitle": "📝 Kasra Math Blog", "videosTitle": "🎬 Tutorial Videos (Aparat)", "toolsTitle": "🛠️ Useful Widgets", "softwareTitle": "💻 Useful Software", "productsTitle": "🛍️ Our Products & Services", "adsTitle": "📢 Special Advertising Section", "contactTitle": "📞 Contact Us", "aboutTitle": "ℹ️ About Kasra Mathematics Project",
                "aboutIntroTitle": "Project Introduction", "aboutMissionVisionTitle": "Our Mission & Vision", "aboutMathUniverseTitle": "Mathematics: The Amazing Language of the Universe", "aboutDevelopmentFutureTitle": "Continuous Development & Future Outlook",
                "contactDirectTitle": "Direct Contact Methods", "contactSocialTitle": "Follow Us", "contactFormSubtitle": "Share your questions, suggestions, and feedback with us using the form below. (This form is for demonstration only)",
                "contactNameLabel": "Your Name:", "contactEmailLabel": "Your Email:", "contactMessageLabel": "Your Message:", "contactSubmitButton": "Send Message", "contactFormNoteGoftino": "This form is for demonstration only. For actual contact, please use the provided contact information (phone, Telegram, email).",
                "footerText": `&copy; ${new Date().getFullYear()} Kasra Mathematics. All rights reserved. 💎`, 
                "copyrightText": "Proudly designed and developed by Kasra Shir Alizadeh.",
                "helpModalTitle": "Kasra Mathematics Comprehensive Guide", "helpIntro": "Welcome to Kasra Mathematics! 🥳 This guide will help you use all the site's features:",
                "helpNavigationTitle": "Site Navigation:", "helpNavigationText": "You can use the main menu at the top of the page (or the dropdown menu on mobile) to access different sections. Additionally, a quick access menu is provided on the right side of the screen (on desktop) to jump to main tools.",
                "helpSimplifyTitle": "📉 Expression Simplification:", "helpSimplifyText": "Enter your algebraic expression in the respective field and click 'Simplify'. The simplified result will be displayed quickly. To better understand the simplification process, you can use the 'Explain Steps ✨' button, which uses AI to describe the steps.",
                "helpSolveTitle": "🧮 Equation Solver:", "helpSolveText": "Enter your equation. For descriptive, step-by-step solutions, use the 'Solve with AI ✨' button. The internal library solving feature ('Solve (Coming Soon)' button) will be added in future updates.",
                "helpNotesTitle": "🗒️ Notes & Checklists (Display Only):", "helpNotesText": "This section allows you to create temporary notes. Enter a title, main content, and checklist items (with a checkbox). Clicking 'Add Note (Display Only)' will display your note below the form. You can 'edit' (re-populates the form) or 'delete' these displayed notes. Note: These notes are cleared on page refresh.",
                "helpWhiteboardTitle": "🎨 Digital Whiteboard:", "helpWhiteboardText": "Select your tool (pencil or eraser), desired color, and appropriate size for the brush/eraser, then bring your ideas, formulas, and diagrams to life on the digital canvas. Use the 'Clear All' button to erase all content and start anew.",
                "helpSettingsTitle": "⚙️ Personalization Settings:", "helpSettingsText": "Use the settings menu (gear icon at the top) to customize the site's appearance. You can change the overall theme (Classic, Space, Modern, Neon, Hacker), your preferred Farsi and English fonts, and the application language (Farsi/English). These settings are saved in your browser for future visits.",
                "helpSearchTitle": "🔍 Smart Search:", "helpSearchText": "In the search section (accessible from the main menu), type your query or keyword. The system will intelligently search through the textual content of various site sections (like titles, article descriptions, etc.) and display relevant results with a short snippet of text. Clicking on a result will navigate you to the corresponding section.",
                "helpInfoTitle": "👤 Information Section:", "helpInfoText": "In this section, you can view your user information (display-only), your system details, information about the site creator, and general site statistics (display-only).",
                "helpErrorsTitle": "🐞 View Errors:", "helpErrorsText": "If an issue occurs during the initial loading of the application or when using features dependent on external libraries or online services (like the Gemini API), a small button with an alert icon will appear at the bottom-left of the page. Clicking this button allows you to see a list of encountered errors. This button will become more prominent if a new error occurs.",
                "helpEnjoy": "We hope you enjoy using the diverse features of Kasra Mathematics and find this tool beneficial! ✨",
                "errorSimplifying": "Error simplifying expression.", "errorSolving": "Error solving equation or invalid format.", "noSolution": "No solution found or equation is too complex for the current solver.",
                "confirmDeleteTitle": "Confirm Deletion", "confirmDeleteText": "Are you sure you want to delete this displayed note?", "cancelButton": "Cancel", "confirmButton": "Delete",
                "loading": "Loading...", "fetchingAIResponse": "Fetching response from AI...", "noteSaved": "Note added (display only).", "noteDeleted": "Displayed note deleted.", "noteUpdated": "Note form populated for editing (display only).", "noteFormCleared": "Note form cleared.",
                "emptyExpression": "Please enter an expression.", "emptyEquation": "Please enter an equation.", "emptyNote": "Note title, content, or at least one checklist item cannot be empty.",
                "yes": "Yes", "no": "No", "noNotesYet": "No (temporary) notes added yet.", "errorSavingNote": "Error saving note.", "errorDeletingNote": "Error deleting note.",
                "equationSolved": "Equation solved successfully.",
                "deleteChecklistItem": "Delete Item",
                "aiResponseModalTitle": "AI Response ✨",
                "errorCallingAI": "Error contacting the AI service. Please try again later.",
                "noAIResponse": "No response received from the AI service.",
                "systemMessageTitle": "System Message", "okButton": "OK", "contactFormSuccess": "Your message (demo) was received! Please use the actual contact info to reach out.",
                "copiedToClipboard": "Result copied to clipboard!",
                "guestUser": "Guest User",
                "errorDisplayModalTitle": "Encountered Errors",
                "noErrorsToDisplay": "No loading errors reported at the moment.",
                "searchTitle": "🔍 Smart Site Search", "searchPlaceholder": "Enter keyword or phrase to search...", "searchNoResults": "No matches found.", "searchMinChars": "Please enter at least 2 characters to search."
            }
        };
        
        // --- توابع اصلی برنامه ---

        /**
         * @function escapeHTML
         * @description Escapes HTML special characters to prevent XSS.
         * @param {string} str - The string to escape.
         * @returns {string} The escaped string.
         */
        function escapeHTML(str) {
            if (typeof str !== 'string') return '';
            return str.replace(/[&<>"']/g, function (match) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[match];
            });
        }

        /**
         * @function applyTranslations
         * @description Applies translations to all visible elements on the page.
         */
        function applyTranslations() {
            const S = translations[currentLanguage]; 
            document.documentElement.lang = currentLanguage; 
            document.documentElement.dir = currentLanguage === 'fa' ? 'rtl' : 'ltr'; 

            const translatableElements = {
                'site-title': 'siteTitle', 'nav-home': 'navHome', 'nav-simplify': 'navSimplify', 'nav-solve': 'navSolve', 'nav-notes': 'navNotes', 'nav-whiteboard': 'navWhiteboard', 'nav-search': 'navSearch',
                'nav-info-dropdown': 'navInfoDropdown', 'nav-calendar-dropdown': 'navCalendarDropdown', 'nav-articles-dropdown': 'navArticlesDropdown', 'nav-blog-dropdown': 'navBlogDropdown', 'nav-videos-dropdown': 'navVideosDropdown', 'nav-tools-dropdown': 'navToolsDropdown', 'nav-software-dropdown': 'navSoftwareDropdown', 'nav-products-dropdown': 'navProductsDropdown', 'nav-ads-dropdown': 'navAdsDropdown', 'nav-contact-dropdown': 'navContactDropdown', 'nav-about-dropdown': 'navAboutDropdown',
                'settings-title': 'settingsTitle', 'theme-label': 'themeLabel', 'font-farsi-label': 'fontFarsiLabel', 'font-english-label': 'fontEnglishLabel', 'language-label': 'languageLabel', 'language-toggle-button': 'languageToggleButton', 
                'loader-text': 'loaderText',
                'welcome-overlay-title': 'welcomeOverlayTitle', 'welcome-overlay-text': 'welcomeOverlayText', 'proceed-to-form-button': 'proceedToFormButton',
                'user-info-form-title': 'userInfoFormTitle', 'user-form-name-label': 'userFormNameLabel', 'user-form-interest-label': 'userFormInterestLabel', 'skip-user-form-button': 'skipUserFormButton', 'submit-user-form-button': 'submitUserFormButton',
                'welcome-title': 'welcomeTitle', 'app-description': 'appDescription',
                'simplify-title': 'simplifyTitle', 'simplify-button': 'simplifyButton', 'explain-simplify-button': 'explainSimplifyButton', 'result-label': 'resultLabel', 'copy-simplify-result-button': 'copyResultButton',
                'solve-title': 'solveTitle', 'solve-button': 'solveButtonInternalLabel', 'ai-solve-button': 'aiSolveButton', 'solution-label': 'solutionLabel',
                'notes-title': 'notesTitle', 'checklist-header': 'checklistHeader', 'add-checklist-item-button': 'addChecklistItemButton', 'notes-disabled-message': 'notesDisabledMessage', 'clear-note-form-button': 'clearNoteFormButton',
                'whiteboard-title': 'whiteboardTitle', 'wb-tool-label':'wbToolLabel', 'wb-color-label': 'wbColorLabel', 'wb-size-label': 'wbSizeLabel', 'wb-clear-btn-text': 'wbClearBtnText',
                'search-title': 'searchTitle',
                'info-title': 'infoTitle', 'user-info-tab': 'userInfoTab', 'system-info-tab': 'systemInfoTab', 'developer-info-tab': 'devInfoTab', 'site-stats-tab': 'siteStatsTab', 'user-info-header': 'userInfoHeader', 'system-info-header': 'systemInfoHeader', 'dev-info-header': 'devInfoHeader', 'site-stats-header': 'siteStatsHeader', 'dev-info-text': 'devInfoText',
                'login-time-info': 'loginTimeLabel', 'online-duration-info': 'onlineDurationLabel', 'site-creation-date': 'siteCreationDate', 'site-dev-time': 'siteDevTime', 'site-power-desc': 'sitePowerDesc',
                'calendar-title': 'calendarTitle', 'calendar-placeholder-text': 'calendarPlaceholder',
                'articles-title': 'articlesTitle', 'blog-title': 'blogTitle', 'videos-title': 'videosTitle', 'tools-title': 'toolsTitle', 'software-title': 'softwareTitle', 'products-title': 'productsTitle', 'ads-title': 'adsTitle', 'contact-title': 'contactTitle', 
                'about-title': 'aboutTitle', 'about-intro-title': 'aboutIntroTitle', 'about-mission-vision-title': 'aboutMissionVisionTitle', 'about-math-universe-title': 'aboutMathUniverseTitle', 'about-development-future-title': 'aboutDevelopmentFutureTitle',
                'contact-direct-title': 'contactDirectTitle', 'contact-social-title': 'contactSocialTitle', 'contact-form-subtitle': 'contactFormSubtitle',
                'contact-name-label-el': 'contactNameLabel', 'contact-email-label-el': 'contactEmailLabel', 'contact-message-label-el': 'contactMessageLabel',
                'submit-contact-form': 'contactSubmitButton', 'contact-form-note-display': 'contactFormNoteGoftino', 
                'footer-text': 'footerText', 'copyright-text':'copyrightText', 'help-modal-title': 'helpModalTitle', 'ai-response-modal-title': 'aiResponseModalTitle',
                'help-intro': 'helpIntro', 'help-navigation-title':'helpNavigationTitle', 'help-navigation-text':'helpNavigationText', 'help-simplify-title': 'helpSimplifyTitle', 'help-simplify-text': 'helpSimplifyText',
                'help-solve-title': 'helpSolveTitle', 'help-solve-text': 'helpSolveText',
                'help-notes-title': 'helpNotesTitle', 'help-notes-text': 'helpNotesText',
                'help-whiteboard-title': 'helpWhiteboardTitle', 'help-whiteboard-text': 'helpWhiteboardText',
                'help-settings-title': 'helpSettingsTitle', 'help-settings-text': 'helpSettingsText',
                'help-search-title': 'helpSearchTitle', 'help-search-text': 'helpSearchText',
                'help-info-title': 'helpInfoTitle', 'help-info-text': 'helpInfoText',
                'help-errors-title': 'helpErrorsTitle', 'help-errors-text':'helpErrorsText', 'help-enjoy':'helpEnjoy',
                'confirm-delete-title': 'confirmDeleteTitle', 'confirm-delete-text': 'confirmDeleteText',
                'cancel-delete-button': 'cancelButton', 'confirm-delete-button': 'confirmButton',
                'error-display-modal-title': 'errorDisplayModalTitle', 'no-errors-message': 'noErrorsToDisplay'
            };
            
            for (const id in translatableElements) {
                const element = document.getElementById(id);
                if (element) {
                     if (S[translatableElements[id]] !== undefined) {
                        element.innerHTML = S[translatableElements[id]]; // Use innerHTML to render icons in buttons
                    }
                } else {
                    // console.warn(`Translation: Element with ID "${id}" not found.`);
                }
            }
            const helpButton = document.getElementById('help-button');
            if (helpButton && S.helpButtonTitle) helpButton.title = S.helpButtonTitle;

            const placeholders = { 
                'expression-input': 'expressionPlaceholder', 'equation-input': 'equationPlaceholder', 
                'note-title-input': 'noteTitlePlaceholder', 'note-content-input': 'noteContentPlaceholder',
                'smart-search-input': 'searchPlaceholder',
                'user-name-input': S.userFormNameLabel ? S.userFormNameLabel.replace(' (اختیاری):','').replace(' (Optional):','') : 'نام',
                'contact-name': S.contactNameLabel ? S.contactNameLabel.replace(':','') : '',
                'contact-email': S.contactEmailLabel ? S.contactEmailLabel.replace(':','') : '',
                'contact-message': S.contactMessageLabel ? S.contactMessageLabel.replace(':','') : ''
            };
            for (const id in placeholders) {
                const element = document.getElementById(id);
                if (element) { 
                    if (id.startsWith('contact-') || id.startsWith('user-name-input')) {
                        element.placeholder = placeholders[id];
                    } else if (S[placeholders[id]] !== undefined) {
                        element.placeholder = S[placeholders[id]];
                    }
                }
            }

            // به‌روزرسانی متن دکمه ذخیره یادداشت و نمایش اطلاعات کاربر
            updateSaveNoteButtonText(); 
            displayUserDataInInfoSection(); // نمایش اطلاعات کاربر (از فرم) در بخش اطلاعات
            displayUserId(); // نمایش شناسه کاربر مهمان و زمان ورود
            displaySystemInfo(); 
            updateCalendarDates(); 
            
            const currentYearEl = document.getElementById('current-year'); 
            if (currentYearEl) { 
                currentYearEl.textContent = new Date().getFullYear();
            }

            applyFont(); 
            updateWhiteboardControlsText(); 
            const loaderTextEl = document.getElementById('loader-text');
            if (loaderTextEl && S.loaderText) loaderTextEl.textContent = S.loaderText; 
            if (typeof lucide !== 'undefined') lucide.createIcons(); // رندر مجدد آیکون‌ها پس از تغییر متن
        }

        /**
         * @function toggleLanguage
         * @description Toggles the application language and saves preferences.
         */
        window.toggleLanguage = function() {
            currentLanguage = (currentLanguage === 'fa') ? 'en' : 'fa'; 
            applyTranslations(); 
            savePreferences(); 
        }

        /**
         * @function applyTheme
         * @description Applies the selected theme to the page.
         * @param {string} themeName - The name of the theme.
         */
        function applyTheme(themeName) {
            document.body.className = ''; 
            document.body.classList.add(`theme-${themeName}`); 
            currentTheme = themeName; 
            if (whiteboardCtx) {
                const themeVars = getComputedStyle(document.body); 
                wbEraserColor = themeVars.getPropertyValue('--card-bg').trim(); 
                clearWhiteboard(false); 
            }
        }
        
        /**
         * @function applyFont
         * @description Applies the selected font based on the current language.
         */
        function applyFont() {
            const effectiveFont = (currentLanguage === 'fa') ? currentFontFarsi : currentFontEnglish;
            document.body.style.fontFamily = effectiveFont; 
            if (whiteboardCtx) clearWhiteboard(false);
        }

        /**
         * @function savePreferences
         * @description Saves user preferences (theme, fonts, language) to localStorage.
         */
        function savePreferences() {
            try {
                localStorage.setItem('kasraRiaziPrefs', JSON.stringify({
                    theme: currentTheme,
                    fontFarsi: currentFontFarsi,
                    fontEnglish: currentFontEnglish,
                    language: currentLanguage
                }));
            } catch (error) {
                console.warn("Could not save preferences to localStorage:", error);
            }
        }

        /**
         * @function loadPreferences
         * @description Loads and applies user preferences from localStorage.
         */
        function loadPreferences() {
            try {
                const savedPrefs = localStorage.getItem('kasraRiaziPrefs');
                if (savedPrefs) {
                    const prefs = JSON.parse(savedPrefs);
                    currentTheme = prefs.theme || 'classic';
                    currentFontFarsi = prefs.fontFarsi || "'Vazirmatn', Arial, sans-serif";
                    currentFontEnglish = prefs.fontEnglish || "'Inter', 'Vazirmatn', sans-serif";
                    currentLanguage = prefs.language || 'fa';

                    const themeSelect = document.getElementById('theme-select');
                    const fontFarsiSelect = document.getElementById('font-farsi-select');
                    const fontEnglishSelect = document.getElementById('font-english-select');

                    if(themeSelect) themeSelect.value = currentTheme;
                    if(fontFarsiSelect) fontFarsiSelect.value = currentFontFarsi;
                    if(fontEnglishSelect) fontEnglishSelect.value = currentFontEnglish;
                }
            } catch (error) {
                 console.warn("Could not load preferences from localStorage:", error);
            }
            applyTheme(currentTheme);
            applyFont(); // applyFont will be called inside applyTranslations
            // applyTranslations will be called after the initial sequence
        }
        
        /**
         * @function toggleSettings
         * @description Toggles the visibility of the settings menu.
         */
        window.toggleSettings = () => {
            const menu = document.getElementById('settings-menu');
            if (!menu) return; 
            const isHidden = menu.classList.contains('hidden');
            if (isHidden) {
                menu.classList.remove('hidden');
                requestAnimationFrame(() => { 
                    menu.style.opacity = 1;
                });
            } else {
                menu.style.opacity = 0;
                menu.addEventListener('transitionend', () => {
                    menu.classList.add('hidden');
                }, { once: true });
            }
        }

        /**
         * @function navigateTo
         * @description Navigates to a specific section of the page.
         * @param {string} sectionId - The ID of the section to navigate to.
         */
        window.navigateTo = function(sectionId) {
            const currentActive = document.querySelector('.section-content.active');
            if (currentActive) {
                currentActive.style.animationName = 'sectionFadeOutDown'; 
                currentActive.classList.remove('active');
            }
            
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) {
                setTimeout(() => { 
                    targetSection.classList.add('active');
                    targetSection.style.animationName = 'sectionFadeInUp';
                    activeSection = sectionId; 

                    document.querySelectorAll('.nav-button, .dropdown-menu-item').forEach(b => {
                        b.classList.remove('active'); 
                        // برای دکمه‌های اصلی ناوبری، کلاس primary و text-accent-text را هم مدیریت کن
                        if (b.classList.contains('nav-button') && !b.closest('.group')) {
                            b.classList.remove('primary', 'text-accent-text');
                        }
                        if (b.id === `nav-${sectionId}` || b.id === `nav-${sectionId}-dropdown`) {
                            b.classList.add('active'); 
                            if(b.classList.contains('nav-button') && !b.closest('.group')) {
                                b.classList.add('primary', 'text-accent-text'); 
                            }
                        }
                    });
                    const mobileNavSelect = document.getElementById('mobile-nav-select');
                    if (mobileNavSelect) mobileNavSelect.value = sectionId;
                    
                    if (sectionId === 'whiteboard') initWhiteboard();
                    if (sectionId === 'calendar') updateCalendarDates(); 
                    if (sectionId === 'info') {
                        showInfoTab('user'); 
                        displaySiteStats(); 
                        displayUserDataInInfoSection();
                    }
                     window.scrollTo({ top: 0, behavior: 'smooth' }); // اسکرول به بالای صفحه هنگام ناوبری
                }, currentActive && currentActive.id !== targetSection.id ? 300 : 0); 
            } else { 
                console.warn(`Section with ID "${sectionId}-section" not found. Navigating to home.`);
                if (sectionId !== 'home') navigateTo('home'); 
            }
            const settingsMenu = document.getElementById('settings-menu');
            if (settingsMenu && !settingsMenu.classList.contains('hidden')) {
                toggleSettings(); // بستن منوی تنظیمات اگر باز باشد
            }
        }
        
        /**
         * @function simplifyExpression
         * @description Simplifies the algebraic expression entered by the user.
         */
        window.simplifyExpression = function() {
            const S = translations[currentLanguage]; 
            const exprInput = document.getElementById('expression-input');
            const resultEl = document.getElementById('simplify-result');
            const errorEl = document.getElementById('simplify-error');
            const resultContainer = document.getElementById('simplify-result-container');
            const explainButton = document.getElementById('explain-simplify-button');
            const copyButton = document.getElementById('copy-simplify-result-button');

            if (!exprInput || !resultEl || !errorEl || !resultContainer || !explainButton || !copyButton) return;

            errorEl.textContent = ''; resultEl.textContent = ''; 
            resultContainer.classList.add('hidden'); 
            explainButton.classList.add('hidden');
            copyButton.classList.add('hidden');

            originalExpressionForAI = exprInput.value.trim(); 
            if (!originalExpressionForAI) { errorEl.textContent = S.emptyExpression; return; } 

            if (typeof math === 'undefined' || typeof math.simplify !== 'function') { 
                // خطا دیگر به صورت خودکار نمایش داده نمی‌شود، فقط در کنسول لاگ می‌شود
                console.error(S.errorMathLibraryNotLoaded + " (Math.js)");
                errorEl.textContent = S.errorMathLibraryNotLoaded + " (Math.js)";
                // addCollectedError(S.errorMathLibraryNotLoaded + " (Math.js)"); // حذف شد
                return;
            }

            try {
                simplifiedExpressionForAI = math.simplify(originalExpressionForAI).toString(); 
                resultEl.textContent = simplifiedExpressionForAI; 
                resultContainer.classList.remove('hidden'); 
                explainButton.classList.remove('hidden'); 
                copyButton.classList.remove('hidden'); 
            } catch (e) { 
                errorEl.textContent = S.errorSimplifying + (e.message ? ` (${e.message})` : ''); 
                console.error("Simplification error:", e);
                addCollectedError(S.errorSimplifying + (e.message ? ` (${e.message})` : ''));
            }
        }

        /**
         * @function solveSingleVariableEquation
         * @description Placeholder for internal equation solver. Shows a "coming soon" message.
         */
        window.solveSingleVariableEquation = function() {
            const S = translations[currentLanguage];
            const errorEl = document.getElementById('solve-error');
            const resultContainer = document.getElementById('solve-result-container');
            
            if (resultContainer) resultContainer.classList.add('hidden'); 
            if (errorEl) {
                errorEl.textContent = S.solveInternalComingSoon;
                showMessageModal(S.solveInternalComingSoon, S.solveTitle.split('(')[0].trim());
            }
             if (typeof algebra === 'undefined' || typeof algebra.parse !== 'function') { 
                console.error(S.errorMathLibraryNotLoaded + " (Algebra.js)");
                // addCollectedError(S.errorMathLibraryNotLoaded + " (Algebra.js)"); // حذف شد
            }
        }
        
        /**
         * @function addChecklistItemToForm
         * @description Adds an empty checklist item to the note input form.
         */
        window.addChecklistItemToForm = function() {
            addChecklistItem('', false, true, null, true); 
        }

        /**
         * @function addChecklistItem
         * @description Adds a new checklist item to the note form or display.
         */
        function addChecklistItem(itemText = '', isChecked = false, focusNew = true, noteIdForUpdate = null, isNewNoteForm = false) {
            const S = translations[currentLanguage];
            const container = isNewNoteForm ? document.getElementById('checklist-items-container') : document.querySelector(`[data-note-display-id="${noteIdForUpdate}"] .notes-list-item-checklist ul`);
            
            if (!container) {
                console.warn("Checklist container not found for:", isNewNoteForm ? "new note form" : noteIdForUpdate);
                return;
            }

            const newItemDiv = document.createElement('div'); 
            newItemDiv.className = 'checklist-item'; 

            const checkbox = document.createElement('input'); 
            checkbox.type = 'checkbox';
            checkbox.checked = isChecked;
            checkbox.disabled = !isNewNoteForm; 

            const label = document.createElement('label'); 
            const textInput = document.createElement('input'); 
            textInput.type = 'text';
            textInput.className = 'checklist-item-text';
            textInput.value = itemText;
            textInput.placeholder = S.noteTitlePlaceholder ? S.noteTitlePlaceholder.replace('...','') + ' آیتم' : "متن آیتم..."; 
            textInput.readOnly = !isNewNoteForm; 

            label.appendChild(textInput); 
            newItemDiv.appendChild(checkbox); 
            newItemDiv.appendChild(label); 
            
            if (isNewNoteForm) { 
                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = `<i data-lucide="x-circle" class="w-4 h-4"></i>`;
                deleteButton.className = 'delete-checklist-item';
                deleteButton.title = S.deleteChecklistItem;
                deleteButton.type = 'button'; 
                deleteButton.onclick = () => newItemDiv.remove(); 
                newItemDiv.appendChild(deleteButton);
            }
            
            container.appendChild(newItemDiv); 
            
            if (typeof lucide !== 'undefined') lucide.createIcons({context: newItemDiv}); 
            if (focusNew && itemText === '' && isNewNoteForm) textInput.focus(); 
        }
        
        /**
         * @function saveNoteDisplayOnly
         * @description Saves or updates a note for display-only purposes.
         */
        window.saveNoteDisplayOnly = function() {
            const S = translations[currentLanguage];
            const titleInput = document.getElementById('note-title-input');
            const contentInput = document.getElementById('note-content-input');
            const title = titleInput.value.trim();
            const content = contentInput.value.trim();

            const checklistItems = [];
            document.querySelectorAll('#checklist-items-container .checklist-item').forEach(itemEl => {
                const textInput = itemEl.querySelector('.checklist-item-text');
                const checkbox = itemEl.querySelector('input[type="checkbox"]');
                if (textInput && checkbox) {
                    const text = textInput.value.trim();
                    const checked = checkbox.checked;
                    if (text) { 
                        checklistItems.push({ text: text, checked: checked, id: `chk-${crypto.randomUUID()}` }); 
                    }
                }
            });

            if (!title && !content && checklistItems.length === 0) { 
                showMessageModal(S.emptyNote); 
                return; 
            }
            
            const noteId = noteToEditDisplayOnly ? noteToEditDisplayOnly.id : `note-temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            
            const noteData = {
                id: noteId,
                title: title || (S.noteTitlePlaceholder ? S.noteTitlePlaceholder.replace('...','') : 'یادداشت بدون عنوان'),
                content: content,
                checklist: checklistItems,
                timestamp: new Date() 
            };
            
            if (noteToEditDisplayOnly) {
                const index = displayedNotes.findIndex(n => n.id === noteToEditDisplayOnly.id);
                if (index !== -1) {
                    displayedNotes[index] = noteData;
                } else { 
                    displayedNotes.unshift(noteData);
                }
            } else {
                displayedNotes.unshift(noteData); 
            }
            
            renderDisplayedNotes(); 
            clearNoteForm(false); 
            noteToEditDisplayOnly = null; 
            updateSaveNoteButtonText(); 
            showMessageModal(S.noteSaved); 
        }

        /**
         * @function renderDisplayedNotes
         * @description Renders the list of display-only notes.
         */
        function renderDisplayedNotes() {
            const S = translations[currentLanguage];
            const notesListContainer = document.getElementById('notes-list');
            if (!notesListContainer) return;
            notesListContainer.innerHTML = ''; 

            if (displayedNotes.length === 0) {
                const noNotesEl = document.createElement('p');
                noNotesEl.className = 'text-center opacity-70';
                noNotesEl.textContent = S.noNotesYet;
                notesListContainer.appendChild(noNotesEl);
                return;
            }

            displayedNotes.forEach(note => {
                const noteEl = document.createElement('div');
                noteEl.className = 'p-5 rounded-xl border-color shadow-lg bg-secondary mt-4 relative'; 
                noteEl.dataset.noteDisplayId = note.id; 

                let checklistHTML = '';
                if (note.checklist && note.checklist.length > 0) {
                    checklistHTML += `<div class="notes-list-item-checklist mt-3 pt-3 border-t border-color"><h5 class="text-md font-medium mb-2">${S.checklistHeader}</h5><ul class="space-y-1.5 pl-1">`;
                    note.checklist.forEach(item => {
                        checklistHTML += `<li class="flex items-center text-sm ${item.checked ? 'opacity-70 line-through' : ''}">
                                            <i data-lucide="${item.checked ? 'check-square' : 'square'}" class="w-4 h-4 ltr:mr-2 rtl:ml-2 ${item.checked ? 'text-green-500' : 'text-gray-400'}"></i>
                                            ${escapeHTML(item.text)}
                                         </li>`;
                    });
                    checklistHTML += `</ul></div>`;
                }

                noteEl.innerHTML = `
                    <div class="flex justify-between items-start mb-2">
                        <h4 class="font-semibold text-xl break-words">${escapeHTML(note.title)}</h4>
                        <div class="flex space-x-1 rtl:space-x-reverse">
                            <button onclick="editNoteDisplayOnly('${note.id}')" class="text-sm primary p-1.5 rounded-lg hover:opacity-80" title="${S.editButton}" aria-label="${S.editButton}">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <button onclick="confirmDeleteNoteDisplayOnly('${note.id}')" class="text-sm bg-red-500 text-white p-1.5 rounded-lg hover:bg-red-600" title="${S.deleteButton}" aria-label="${S.deleteButton}">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </div>
                    </div>
                    ${note.content ? `<p class="text-base opacity-80 break-words whitespace-pre-wrap mb-2">${escapeHTML(note.content)}</p>` : ''}
                    ${checklistHTML}
                    <p class="text-xs opacity-60 mt-3 pt-2 border-t border-color">${note.timestamp.toLocaleString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US', {dateStyle:'short', timeStyle:'short'})}</p>
                `;
                notesListContainer.appendChild(noteEl);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons({context: notesListContainer});
        }
        
        /**
         * @function clearNoteForm
         * @description Clears the note input form and resets edit state.
         */
        window.clearNoteForm = function(showMessage = true) {
            document.getElementById('note-title-input').value = '';
            document.getElementById('note-content-input').value = '';
            document.getElementById('checklist-items-container').innerHTML = '';
            noteToEditDisplayOnly = null; 
            updateSaveNoteButtonText(); 
            if (showMessage) {
                showMessageModal(translations[currentLanguage].noteFormCleared);
            }
        }

        /**
         * @function editNoteDisplayOnly
         * @description Populates the note form with data from a display-only note for editing.
         */
        window.editNoteDisplayOnly = (noteId) => {
            const note = displayedNotes.find(n => n.id === noteId);
            if (!note) return;

            noteToEditDisplayOnly = note; 

            document.getElementById('note-title-input').value = note.title;
            document.getElementById('note-content-input').value = note.content;
            
            const checklistContainer = document.getElementById('checklist-items-container');
            checklistContainer.innerHTML = ''; 
            if (note.checklist) {
                note.checklist.forEach(item => addChecklistItem(item.text, item.checked, false, null, true)); 
            }
            
            updateSaveNoteButtonText(); 
            document.getElementById('note-title-input').focus(); 
            document.getElementById('notes-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            showMessageModal(translations[currentLanguage].noteUpdated);
        };

        /**
         * @function confirmDeleteNoteDisplayOnly
         * @description Opens the confirmation modal for deleting a display-only note.
         */
        window.confirmDeleteNoteDisplayOnly = (noteId) => { 
            noteToDeleteDisplayOnlyId = noteId; 
            openModal('confirm-delete-modal-overlay'); 
        };
        
        /**
         * @function executeDeleteNoteDisplayOnly
         * @description Deletes the selected display-only note.
         */
        window.executeDeleteNoteDisplayOnly = () => { 
            const S = translations[currentLanguage];
            if (!noteToDeleteDisplayOnlyId) return;
            
            displayedNotes = displayedNotes.filter(note => note.id !== noteToDeleteDisplayOnlyId); 
            renderDisplayedNotes(); 
            
            showMessageModal(S.noteDeleted); 
            closeConfirmDeleteModal(); 
            noteToDeleteDisplayOnlyId = null; 
        };

        /** Updates the text of the save/add note button based on edit state. */
        function updateSaveNoteButtonText() { 
            const S = translations[currentLanguage];
            const btnTextEl = document.querySelector('#save-note-button span');
            if (btnTextEl) {
                btnTextEl.textContent = noteToEditDisplayOnly ? S.saveNoteButtonEdit : S.saveNoteButtonAdd;
            }
        }
        
        /**
         * @function displayUserId
         * @description Displays guest user ID, login time, and online duration.
         */
        function displayUserId() { 
            const S = translations[currentLanguage];
            const idDisplaySettings = document.getElementById('user-id-display'); // In settings menu
            const idDisplayInfo = document.getElementById('user-id-info'); // In info section
            const loginTimeInfoEl = document.getElementById('login-time-info');
            const onlineDurationInfoEl = document.getElementById('online-duration-info');

            const guestUserText = (S.userIdLabel || "User ID:") + " " + (S.guestUser || "Guest User");
            
            if(idDisplaySettings) idDisplaySettings.textContent = guestUserText;
            if(idDisplayInfo) idDisplayInfo.innerHTML = `${guestUserText} <span class="font-mono text-xs opacity-70">(${tempGuestId.substring(0,12)}...)</span>`;
            
            if (loginTimeInfoEl && S.loginTimeLabel) {
                loginTimeInfoEl.textContent = `${S.loginTimeLabel} ${pageLoadTime.toLocaleString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US', {dateStyle:'medium', timeStyle:'short'})}`;
            }

            if (onlineDurationInfoEl && S.onlineDurationLabel) {
                if (onlineDurationIntervalId) clearInterval(onlineDurationIntervalId); 
                onlineDurationIntervalId = setInterval(() => {
                    const now = new Date();
                    const durationMs = now - pageLoadTime;
                    const seconds = Math.floor((durationMs / 1000) % 60);
                    const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
                    const hours = Math.floor((durationMs / (1000 * 60 * 60)) % 24);
                    const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    onlineDurationInfoEl.textContent = `${S.onlineDurationLabel} ${formattedDuration}`;
                }, 1000);
            }
        }

        /**
         * @function displayUserDataInInfoSection
         * @description Displays the (display-only) user data collected from the form in the "User Info" tab.
         */
        function displayUserDataInInfoSection() {
            const S = translations[currentLanguage];
            const userNameDisplayEl = document.getElementById('user-name-display');
            const userInterestDisplayEl = document.getElementById('user-interest-display');

            if (userNameDisplayEl) {
                if (userData.name) {
                    userNameDisplayEl.textContent = `${S.userNameLabel || 'User Name:'} ${escapeHTML(userData.name)}`;
                    userNameDisplayEl.classList.remove('hidden');
                } else {
                    userNameDisplayEl.classList.add('hidden');
                }
            }

            if (userInterestDisplayEl) {
                if (userData.interest) {
                    // Translate interest value if needed (assuming keys match select options)
                    let interestText = userData.interest;
                    // Example: if (S[`interest_${userData.interest}`]) interestText = S[`interest_${userData.interest}`];
                    // For now, just display the value
                    userInterestDisplayEl.textContent = `${S.userInterestLabel || 'Area of Interest:'} ${escapeHTML(interestText.replace(/_/g, ' '))}`;
                    userInterestDisplayEl.classList.remove('hidden');
                } else {
                    userInterestDisplayEl.classList.add('hidden');
                }
            }
        }

        /** Displays user's system information. */
        function displaySystemInfo() { 
            const S = translations[currentLanguage];
            const listEl = document.getElementById('system-info-list');
            if (!listEl) return;
            listEl.innerHTML = ''; 
            const info = {
                [S.languageLabel || "Language"]: navigator.language, 
                "User Agent": navigator.userAgent, 
                "Platform": navigator.platform,
                "Online": navigator.onLine ? (S.yes || "Yes") : (S.no || "No"), 
                "Cookies Enabled": navigator.cookieEnabled ? (S.yes || "Yes") : (S.no || "No"),
                "Screen Resolution": `${window.screen.width} x ${window.screen.height}`
            };
            for (const key in info) {
                const li = document.createElement('li');
                li.innerHTML = `<strong class="font-medium">${escapeHTML(key)}:</strong> ${escapeHTML(info[key])}`;
                listEl.appendChild(li);
            }
        }

        /**
         * @function displaySiteStats
         * @description Displays demo site statistics.
         */
        function displaySiteStats() {
            const S = translations[currentLanguage];
            const creationDateEl = document.getElementById('site-creation-date');
            const devTimeEl = document.getElementById('site-dev-time');
            const powerDescEl = document.getElementById('site-power-desc');

            if (creationDateEl && S.siteCreationDate) creationDateEl.textContent = S.siteCreationDate;
            if (devTimeEl && S.siteDevTime) devTimeEl.textContent = S.siteDevTime;
            if (powerDescEl && S.sitePowerDesc) powerDescEl.textContent = S.sitePowerDesc;
        }
        
        /**
         * @function showInfoTab
         * @description Shows the selected tab in the information section.
         */
        window.showInfoTab = function(tabName) { 
            document.querySelectorAll('.info-tab-content').forEach(c => c.style.display = 'none');
            document.querySelectorAll('.info-tab-button').forEach(b => b.classList.remove('active'));
            
            const contentEl = document.getElementById(`${tabName}-info-content`);
            const tabEl = document.getElementById(`${tabName}-info-tab`); 

            if (contentEl) {
                contentEl.style.display = 'block';
                if (tabName === 'site-stats') displaySiteStats();
                if (tabName === 'user') {
                    displayUserId(); 
                    displayUserDataInInfoSection();
                }
                if (tabName === 'system') displaySystemInfo();
            }
            if (tabEl) tabEl.classList.add('active');
        };

        /**
         * @function updateCalendarDates
         * @description Updates the Gregorian date and current time in the calendar section.
         */
        function updateCalendarDates() { 
            const S = translations[currentLanguage];
            const today = new Date();
            const gregorianEl = document.getElementById('gregorian-date-display');
            const shamsiEl = document.getElementById('shamsi-date-display'); 
            const timeEl = document.getElementById('current-time-display');

            if (gregorianEl) gregorianEl.textContent = today.toLocaleDateString(currentLanguage === 'fa' ? 'fa-IR-u-nu-latn' : 'en-US', 
                { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
            );
            
            if (shamsiEl) shamsiEl.classList.add('hidden'); 

            if (timeEl && S.currentTimeLabel) { 
                 timeEl.textContent = `${S.currentTimeLabel} ${today.toLocaleTimeString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US')}`;
            }
            
            if (currentTimeIntervalId) clearInterval(currentTimeIntervalId); 
            currentTimeIntervalId = setInterval(() => { 
                const now = new Date();
                if (timeEl && S.currentTimeLabel) timeEl.textContent = `${S.currentTimeLabel} ${now.toLocaleTimeString(currentLanguage === 'fa' ? 'fa-IR' : 'en-US')}`;
            }, 1000);
        }
        
        /**
         * @function openModal
         * @description Opens a modal with the specified overlay ID.
         */
        function openModal(overlayId) {
            const overlay = document.getElementById(overlayId);
            if (!overlay) { 
                console.warn(`Modal overlay with ID "${overlayId}" not found.`);
                return; 
            } 
            overlay.classList.add('active'); 
            if (overlayId === 'error-display-modal-overlay') isErrorModalOpen = true;

            const modalContent = overlay.querySelector('.modal-content');
            if (modalContent) {
                requestAnimationFrame(() => {
                    modalContent.style.transform = 'translateY(0) scale(1)';
                    modalContent.style.opacity = '1';
                });
            }
        }

        /**
         * @function closeModal
         * @description Closes a modal with the specified overlay ID.
         */
        function closeModal(overlayId) {
            const overlay = document.getElementById(overlayId);
            if (!overlay || !overlay.classList.contains('active')) { return; }
            if (overlayId === 'error-display-modal-overlay') isErrorModalOpen = false;

            const modalContent = overlay.querySelector('.modal-content');
            if (modalContent) {
                modalContent.style.transform = 'translateY(20px) scale(0.95)';
                modalContent.style.opacity = '0';
            }
            overlay.addEventListener('transitionend', () => {
                 if (!overlay.classList.contains('active')) return; 
                 overlay.classList.remove('active');
            }, { once: true });
            setTimeout(() => {
                if (overlay.classList.contains('active')) { 
                    overlay.classList.remove('active');
                }
            }, 350); 
        }
        
        window.openHelpModal = (isFirstTime = false) => { 
            openModal('help-modal-overlay');
            if (isFirstTime) { 
                try { localStorage.setItem('kasraRiaziHelpShown', 'true'); } catch(e) { console.warn("Could not save helpShown to localStorage", e); }
            }
        }
        window.closeHelpModal = () => closeModal('help-modal-overlay');
        window.closeAIResponseModal = () => closeModal('ai-response-modal-overlay');
        window.closeConfirmDeleteModal = () => closeModal('confirm-delete-modal-overlay');
        
        /**
         * @function showMessageModal
         * @description Displays a generic message modal.
         */
        function showMessageModal(message, title) {
            const S = translations[currentLanguage];
            const titleEl = document.getElementById('message-modal-title');
            const textEl = document.getElementById('message-modal-text');
            const okButtonEl = document.getElementById('message-modal-ok-button');

            if (titleEl) titleEl.textContent = title || (S.systemMessageTitle || "System Message");
            if (textEl) textEl.textContent = message;
            if (okButtonEl && S.okButton) okButtonEl.textContent = S.okButton;
            
            openModal('message-modal-overlay');
        }
        window.closeMessageModal = () => closeModal('message-modal-overlay');

        /**
         * @function addCollectedError
         * @description Adds an error message to the collected errors list and updates the UI.
         * Error modal will NOT open automatically.
         */
        function addCollectedError(errorMessage) {
            if (!collectedErrors.includes(errorMessage)) { 
                collectedErrors.push(errorMessage);
            }
            const errorButton = document.getElementById('show-errors-button');
            if (errorButton) {
                errorButton.classList.remove('hidden'); 
                errorButton.classList.add('has-errors'); 
            }
        }

        /**
         * @function openErrorDisplayModal
         * @description Opens the modal to display collected loading errors.
         */
        window.openErrorDisplayModal = function() {
            const S = translations[currentLanguage];
            const errorListEl = document.getElementById('error-display-list');
            const noErrorsEl = document.getElementById('no-errors-message');
            if (!errorListEl || !noErrorsEl) return;

            errorListEl.innerHTML = ''; 
            if (collectedErrors.length > 0) {
                collectedErrors.forEach(err => {
                    const li = document.createElement('li');
                    li.textContent = err;
                    errorListEl.appendChild(li);
                });
                noErrorsEl.classList.add('hidden');
                errorListEl.classList.remove('hidden');
            } else {
                noErrorsEl.textContent = S.noErrorsToDisplay || "No loading errors reported.";
                noErrorsEl.classList.remove('hidden');
                errorListEl.classList.add('hidden');
            }
            openModal('error-display-modal-overlay');
        }
        window.closeErrorDisplayModal = function() {
            closeModal('error-display-modal-overlay');
        }


        /** Whiteboard digital functions. */
        function initWhiteboard() { 
            const canvas = document.getElementById('whiteboard-canvas');
            if (!canvas) { 
                console.warn("Whiteboard canvas not found.");
                return; 
            } 
            // Only re-initialize if the canvas context is not set or if the active section is indeed whiteboard
            // This prevents re-initialization if navigateTo is called for whiteboard while it's already active.
            if (whiteboardCtx && canvas === whiteboardCtx.canvas && activeSection === 'whiteboard' && canvas.width > 0) return; 
            
            if (activeSection !== 'whiteboard') return; 

            whiteboardCtx = canvas.getContext('2d', {willReadFrequently: true}); 
            
            const resizeCanvas = () => {
                const parent = canvas.parentElement;
                if (!parent) return;
                const cs = getComputedStyle(parent);
                const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
                const desiredHeight = Math.max(300, Math.min(550, window.innerHeight * 0.5)); 
                
                let tempImageData = null;
                if (canvas.width > 0 && canvas.height > 0) { 
                    try { tempImageData = whiteboardCtx.getImageData(0, 0, canvas.width, canvas.height); } catch(e) { console.warn("Could not get whiteboard image data:", e); }
                }

                canvas.width = parent.clientWidth - paddingX; 
                canvas.height = desiredHeight; 

                const themeVars = getComputedStyle(document.body); 
                wbEraserColor = themeVars.getPropertyValue('--card-bg').trim(); 
                clearWhiteboard(false); 

                if (tempImageData) {
                    try { whiteboardCtx.putImageData(tempImageData, 0, 0); } catch(e) { console.warn("Could not put whiteboard image data:", e); }
                }
            };

            resizeCanvas(); 
            
            if (!window.whiteboardResizeListenerAdded) {
                window.addEventListener('resize', () => {
                    if (activeSection === 'whiteboard') resizeCanvas(); 
                });
                window.whiteboardResizeListenerAdded = true;
            }

            // Remove old listeners before adding new ones to prevent duplicates
            canvas.removeEventListener('mousedown', startDrawing); canvas.removeEventListener('mousemove', draw);
            canvas.removeEventListener('mouseup', stopDrawing); canvas.removeEventListener('mouseleave', stopDrawing);
            canvas.removeEventListener('touchstart', startDrawing); canvas.removeEventListener('touchmove', draw);
            canvas.removeEventListener('touchend', stopDrawing);

            canvas.addEventListener('mousedown', startDrawing); canvas.addEventListener('mousemove', draw);
            canvas.addEventListener('mouseup', stopDrawing); canvas.addEventListener('mouseleave', stopDrawing);
            canvas.addEventListener('touchstart', startDrawing, {passive: false}); canvas.addEventListener('touchmove', draw, {passive: false});
            canvas.addEventListener('touchend', stopDrawing);

            document.querySelectorAll('#whiteboard-controls .tool-option').forEach(btn => {
                btn.removeEventListener('click', selectToolHandler); // Remove previous if any
                btn.addEventListener('click', selectToolHandler);
            });
            document.querySelectorAll('#whiteboard-controls .color-option').forEach(btn => {
                btn.removeEventListener('click', selectBrushColorHandler);
                btn.addEventListener('click', selectBrushColorHandler);
            });
            document.querySelectorAll('#whiteboard-controls .size-option').forEach(btn => {
                btn.removeEventListener('click', selectBrushSizeHandler);
                btn.addEventListener('click', selectBrushSizeHandler);
            });
            const clearButton = document.getElementById('clear-whiteboard-button');
            if (clearButton) {
                clearButton.removeEventListener('click', clearWhiteboardHandler);
                clearButton.addEventListener('click', clearWhiteboardHandler);
            }
            
            updateWhiteboardControlsText(); 
            if (typeof lucide !== 'undefined') lucide.createIcons({context: document.getElementById('whiteboard-controls')}); 
        }
        // Handlers for whiteboard controls to be used with add/removeEventListener
        function selectToolHandler(e) { selectTool(e.currentTarget); }
        function selectBrushColorHandler(e) { selectBrushColor(e.currentTarget); }
        function selectBrushSizeHandler(e) { selectBrushSize(e.currentTarget); }
        function clearWhiteboardHandler() { clearWhiteboard(true); }

        function updateWhiteboardControlsText() { 
             const S = translations[currentLanguage];
            const toolLabel = document.getElementById('wb-tool-label');
            const colorLabel = document.getElementById('wb-color-label');
            const sizeLabel = document.getElementById('wb-size-label');
            const clearBtnText = document.getElementById('wb-clear-btn-text');
            const pencilBtn = document.querySelector('.tool-option[data-tool="draw"]');
            const eraserBtn = document.querySelector('.tool-option[data-tool="erase"]');

            if(toolLabel && S.wbToolLabel) toolLabel.textContent = S.wbToolLabel;
            if(pencilBtn && S.wbPencilTool) pencilBtn.title = S.wbPencilTool;
            if(eraserBtn && S.wbEraserTool) eraserBtn.title = S.wbEraserTool;
            if(colorLabel && S.wbColorLabel) colorLabel.textContent = S.wbColorLabel;
            if(sizeLabel && S.wbSizeLabel) sizeLabel.textContent = S.wbSizeLabel;
            if(clearBtnText && S.wbClearBtnText) clearBtnText.textContent = S.wbClearBtnText;
        }
        function selectTool(selectedButton) { 
            currentTool = selectedButton.dataset.tool;
            document.querySelectorAll('#whiteboard-controls .tool-option').forEach(b => b.classList.remove('active'));
            selectedButton.classList.add('active');
        }
        function selectBrushColor(selectedButton) { 
            wbBrushColor = selectedButton.dataset.color;
            document.querySelectorAll('#whiteboard-controls .color-option').forEach(b => b.classList.remove('active'));
            selectedButton.classList.add('active');
        }
        function selectBrushSize(selectedButton) { 
            wbBrushSize = parseInt(selectedButton.dataset.size);
            document.querySelectorAll('#whiteboard-controls .size-option').forEach(b => b.classList.remove('active'));
            selectedButton.classList.add('active');
        }
        function startDrawing(e) { 
            e.preventDefault(); isDrawing = true;
            [lastX, lastY] = getMousePos(e);
            if (!whiteboardCtx) return;
            whiteboardCtx.beginPath();
            whiteboardCtx.strokeStyle = (currentTool === 'erase') ? wbEraserColor : wbBrushColor;
            whiteboardCtx.lineWidth = wbBrushSize;
            whiteboardCtx.lineCap = 'round'; whiteboardCtx.lineJoin = 'round';
            if (currentTool === 'draw') { 
                whiteboardCtx.fillStyle = wbBrushColor; 
                whiteboardCtx.beginPath(); 
                whiteboardCtx.arc(lastX, lastY, wbBrushSize / 2, 0, Math.PI * 2);
                whiteboardCtx.fill(); 
            }
            whiteboardCtx.beginPath(); 
            whiteboardCtx.moveTo(lastX, lastY);
        }
        function draw(e) { 
            e.preventDefault(); if (!isDrawing || !whiteboardCtx) return;
            const [currentX, currentY] = getMousePos(e);
            whiteboardCtx.lineTo(currentX, currentY); whiteboardCtx.stroke();
            whiteboardCtx.beginPath(); whiteboardCtx.moveTo(currentX, currentY);
            [lastX, lastY] = [currentX, currentY];
        }
        function stopDrawing() { 
            if (isDrawing && whiteboardCtx) { whiteboardCtx.beginPath(); isDrawing = false; }
        }
        function getMousePos(e) { 
            if (!whiteboardCtx || !whiteboardCtx.canvas) return [0,0];
            const canvas = whiteboardCtx.canvas; const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width; const scaleY = canvas.height / rect.height;
            let clientX, clientY;
            if (e.touches && e.touches.length > 0) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
            else { clientX = e.clientX; clientY = e.clientY; }
            return [(clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY];
        }
        function clearWhiteboard(fullClear = true) { 
            if (!whiteboardCtx) return; const canvas = whiteboardCtx.canvas;
            const themeVars = getComputedStyle(document.body);
            const currentCardBg = themeVars.getPropertyValue('--card-bg').trim() || '#ffffff'; 
            whiteboardCtx.fillStyle = currentCardBg;
            if (currentTool === 'erase' || !fullClear) wbEraserColor = currentCardBg; 
            whiteboardCtx.fillRect(0, 0, canvas.width, canvas.height);
        }

        /** Gemini API functions. */
        function showAIResponseLoading(title) {
            const S = translations[currentLanguage];
            const titleEl = document.getElementById('ai-response-modal-title');
            const textEl = document.getElementById('ai-response-text');
            const loaderEl = document.getElementById('ai-response-loader');
            const textContainerEl = document.getElementById('ai-response-text-container');

            if(titleEl) titleEl.textContent = title || S.aiResponseModalTitle;
            if(textEl) textEl.textContent = ''; 
            if(loaderEl) loaderEl.classList.remove('hidden'); 
            if(textContainerEl) textContainerEl.classList.add('hidden'); 
            openModal('ai-response-modal-overlay');
        }
        
        function showAIResponseData(responseText) {
            const S = translations[currentLanguage];
            const textEl = document.getElementById('ai-response-text');
            const loaderEl = document.getElementById('ai-response-loader');
            const textContainerEl = document.getElementById('ai-response-text-container');

            if(textEl) textEl.textContent = responseText || S.noAIResponse;
            if(loaderEl) loaderEl.classList.add('hidden'); 
            if(textContainerEl) textContainerEl.classList.remove('hidden'); 
        }

        async function callGeminiApi(promptText) {
            const S = translations[currentLanguage];
            showAIResponseLoading(S.fetchingAIResponse); 

            const payload = { contents: [{ role: "user", parts: [{ text: promptText }] }] };
            const apiKey = ""; 
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({})); 
                    console.error("Gemini API Error Response:", errorData);
                    throw new Error(`HTTP error ${response.status}: ${errorData.error?.message || response.statusText}`);
                }
                const result = await response.json();
                if (result.candidates && result.candidates.length > 0 &&
                    result.candidates[0].content && result.candidates[0].content.parts &&
                    result.candidates[0].content.parts.length > 0) {
                    return result.candidates[0].content.parts[0].text;
                } else {
                    console.warn("Unexpected Gemini API response structure:", result);
                    return S.noAIResponse;
                }
            } catch (error) {
                console.error("Error calling Gemini API:", error);
                addCollectedError(`${S.errorCallingAI} (${error.message})`); 
                return `${S.errorCallingAI} (${error.message})`;
            }
        }

        window.solveWithAI = async function() {
            const S = translations[currentLanguage];
            const equationInputEl = document.getElementById('equation-input');
            if (!equationInputEl) return;
            const equationInput = equationInputEl.value.trim();
            if (!equationInput) { showMessageModal(S.emptyEquation); return; }
            
            let promptLang = currentLanguage === 'fa' ? 'فارسی' : 'English';
            const prompt = `Please solve the following mathematical equation step-by-step and explain each step in simple ${promptLang}. If the equation has multiple solutions, specify all of them. If the equation has no solution or its format is incorrect, please state that as well. Equation: "${equationInput}"`;
            
            const aiResponse = await callGeminiApi(prompt);
            showAIResponseData(aiResponse);
            const solveResultEl = document.getElementById('solve-result');
            const solveResultContainer = document.getElementById('solve-result-container');
            const solveErrorEl = document.getElementById('solve-error');
            if (solveResultEl && solveResultContainer && solveErrorEl) {
                if (aiResponse.startsWith(S.errorCallingAI) || aiResponse === S.noAIResponse) {
                    solveErrorEl.textContent = aiResponse;
                    solveResultContainer.classList.add('hidden');
                } else {
                    solveErrorEl.textContent = '';
                    solveResultEl.textContent = aiResponse; 
                    solveResultContainer.classList.remove('hidden');
                }
            }
        }

        window.explainSimplification = async function() {
            const S = translations[currentLanguage];
            if (!originalExpressionForAI || !simplifiedExpressionForAI) { showMessageModal(S.emptyExpression); return; }
            let promptLang = currentLanguage === 'fa' ? 'فارسی' : 'English';
            const prompt = `The algebraic expression "${originalExpressionForAI}" was simplified to "${simplifiedExpressionForAI}". Please explain the steps of this simplification in detail, in simple ${promptLang}.`;
            const aiResponse = await callGeminiApi(prompt);
            showAIResponseData(aiResponse);
        }
        
        /**
         * @function copyToClipboard
         * @description Copies text from an element to the clipboard.
         */
        window.copyToClipboard = function(elementId) {
            const S = translations[currentLanguage];
            const textToCopy = document.getElementById(elementId)?.textContent;
            if (textToCopy) {
                try {
                        const textArea = document.createElement("textarea");
                        textArea.value = textToCopy;
                        document.body.appendChild(textArea);
                        textArea.select();
                        document.execCommand('copy'); 
                        document.body.removeChild(textArea);
                        showToast(S.copiedToClipboard || "Copied!");
                } catch (err) {
                    showMessageModal('خطا در کپی کردن متن.');
                    console.error("Clipboard copy error:", err);
                    addCollectedError('خطا در کپی کردن متن: ' + err.message);
                }
            }
        }
         /**
         * @function showToast
         * @description Displays a toast notification.
         */
        function showToast(message) {
            const toastContainer = document.getElementById('toast-container');
            const toastMessage = document.getElementById('toast-message');
            if (!toastContainer || !toastMessage) return;

            toastMessage.textContent = message;
            toastContainer.classList.remove('hidden');
            requestAnimationFrame(() => { 
                toastContainer.classList.add('opacity-100');
            });

            setTimeout(() => {
                toastContainer.classList.remove('opacity-100');
                toastContainer.classList.add('opacity-0');
                toastContainer.addEventListener('transitionend', () => {
                    toastContainer.classList.add('hidden');
                    toastContainer.classList.remove('opacity-0'); 
                }, { once: true });
            }, 3000); 
        }
        
        // --- Back to Top Button Logic ---
        const backToTopButton = document.getElementById('back-to-top');
        if (backToTopButton) {
            window.onscroll = function() {
                if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                    backToTopButton.style.opacity = "1";
                    backToTopButton.style.pointerEvents = "auto";
                } else {
                    backToTopButton.style.opacity = "0";
                    backToTopButton.style.pointerEvents = "none";
                }
            };
        }
        window.scrollToTop = function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- Smart Search Function ---
        /**
         * @function performSmartSearch
         * @description Searches site content for the given term.
         */
        function performSmartSearch() {
            const S = translations[currentLanguage];
            const searchInput = document.getElementById('smart-search-input');
            const resultsContainer = document.getElementById('smart-search-results');
            const noResultsMessage = document.getElementById('smart-search-no-results');

            if (!searchInput || !resultsContainer || !noResultsMessage) return;

            const searchTerm = searchInput.value.trim().toLowerCase();
            resultsContainer.innerHTML = ''; 
            noResultsMessage.classList.add('hidden'); 

            if (searchTerm.length < 2) { 
                if (searchTerm.length > 0) resultsContainer.innerHTML = `<p class="text-sm opacity-70">${S.searchMinChars || "Please enter at least 2 characters."}</p>`;
                return;
            }

            let foundItems = 0;
            const sectionsToSearch = [
                { id: 'home', titleKey: 'navHome', contentIds: ['welcome-title', 'app-description'] },
                { id: 'simplify', titleKey: 'navSimplify', contentIds: ['simplify-title'], placeholderIds: ['expression-input'] },
                { id: 'solve', titleKey: 'navSolve', contentIds: ['solve-title'], placeholderIds: ['equation-input'] },
                { id: 'notes', titleKey: 'navNotes', contentIds: ['notes-title', 'notes-disabled-message'], placeholderIds: ['note-title-input', 'note-content-input'] },
                { id: 'whiteboard', titleKey: 'navWhiteboard', contentIds: ['whiteboard-title'] },
                { id: 'info', titleKey: 'navInfoDropdown', contentIds: ['info-title', 'user-info-header', 'system-info-header', 'dev-info-header', 'dev-info-text', 'site-stats-header', 'site-creation-date', 'site-dev-time', 'site-power-desc'] },
                { id: 'calendar', titleKey: 'navCalendarDropdown', contentIds: ['calendar-title', 'calendar-placeholder-text'] },
                { id: 'articles', titleKey: 'navArticlesDropdown', contentIds: ['articles-title', 'article1-title', 'article1-desc', 'article2-title', 'article2-desc', 'article3-title', 'article3-desc'] },
                { id: 'blog', titleKey: 'navBlogDropdown', contentIds: ['blog-title'] }, 
                { id: 'videos', titleKey: 'navVideosDropdown', contentIds: ['videos-title', 'video-title-1', 'video-desc-1', 'video-title-2', 'video-desc-2', 'video-title-3', 'video-desc-3', 'video-title-4', 'video-desc-4', 'video-title-5', 'video-desc-5', 'video-title-6', 'video-desc-6', 'video-title-7', 'video-desc-7', 'video-title-8', 'video-desc-8'] }, 
                { id: 'tools', titleKey: 'navToolsDropdown', contentIds: ['tools-title', 'tools-section-note'] },
                { id: 'software', titleKey: 'navSoftwareDropdown', contentIds: ['software-title'] }, 
                { id: 'contact', titleKey: 'navContactDropdown', contentIds: ['contact-title', 'contact-direct-title', 'contact-social-title', 'contact-form-subtitle'], placeholderIds: ['contact-name', 'contact-email', 'contact-message'] },
                { id: 'about', titleKey: 'navAboutDropdown', contentIds: ['about-title', 'about-intro-title', 'about-intro-p1', 'about-intro-p2', 'about-mission-vision-title', 'about-mission-p1', 'about-vision-p1', 'about-math-universe-title', 'about-math-p1', 'about-math-p2', 'about-development-future-title', 'site-creation-info'] }
            ];

            sectionsToSearch.forEach(sectionData => {
                const sectionElement = document.getElementById(`${sectionData.id}-section`);
                if (sectionElement) {
                    let sectionTextContent = S[sectionData.titleKey] ? S[sectionData.titleKey].toLowerCase() : ''; 
                    
                    (sectionData.contentIds || []).forEach(contentId => {
                        const contentElement = document.getElementById(contentId);
                        if (contentElement) {
                            sectionTextContent += " " + contentElement.textContent.toLowerCase();
                        }
                    });
                    (sectionData.placeholderIds || []).forEach(placeholderId => {
                        const inputElement = document.getElementById(placeholderId);
                        if (inputElement && inputElement.placeholder) {
                            sectionTextContent += " " + inputElement.placeholder.toLowerCase();
                        }
                    });
                    if (['about-section', 'articles-section', 'blog-section'].includes(sectionElement.id)) {
                        sectionElement.querySelectorAll('p, h3').forEach(el => {
                            sectionTextContent += " " + el.textContent.toLowerCase();
                        });
                    }

                    if (sectionTextContent.includes(searchTerm)) {
                        foundItems++;
                        const resultItem = document.createElement('div');
                        resultItem.className = 'result-item p-3 border-b border-color cursor-pointer hover:bg-secondary transition-colors duration-200';
                        let itemTitle = S[sectionData.titleKey] || sectionData.id.replace('-section', '').replace(/-/g, ' ');
                        itemTitle = itemTitle.replace(/[🏠📉🧮🗒️🎨🔍👤📅📚📝🎬🛠️💻🛍️📢📞ℹ️✨]/g, '').trim(); 

                        resultItem.innerHTML = `<h4 class="font-semibold text-lg text-accent-bg">${escapeHTML(itemTitle)}</h4>`;
                        const snippetIndex = sectionTextContent.indexOf(searchTerm);
                        const snippetStart = Math.max(0, snippetIndex - 30);
                        const snippetEnd = Math.min(sectionTextContent.length, snippetIndex + searchTerm.length + 70);
                        let snippet = sectionTextContent.substring(snippetStart, snippetEnd);
                        snippet = escapeHTML(snippet).replace(new RegExp(escapeHTML(searchTerm), 'gi'), `<strong class="bg-yellow-200 dark:bg-yellow-700 p-0.5 rounded">${escapeHTML(searchTerm)}</strong>`);
                        resultItem.innerHTML += `<p class="text-sm opacity-80 mt-1">${snippetStart > 0 ? '...' : ''}${snippet}${snippetEnd < sectionTextContent.length ? '...' : ''}</p>`;
                        
                        resultItem.onclick = () => {
                            navigateTo(sectionData.id);
                        };
                        resultsContainer.appendChild(resultItem);
                    }
                }
            });

            if (foundItems === 0) {
                noResultsMessage.textContent = S.searchNoResults || "No matches found.";
                noResultsMessage.classList.remove('hidden');
            }
        }
        
        // --- Initial Setup Sequence Functions ---
        function showWelcomeOverlay() {
            const S = translations[currentLanguage]; // اطمینان از استفاده از ترجمه صحیح
            const welcomeOverlay = document.getElementById('welcome-overlay');
            if (welcomeOverlay) {
                document.getElementById('welcome-overlay-title').textContent = S.welcomeOverlayTitle;
                document.getElementById('welcome-overlay-text').textContent = S.welcomeOverlayText;
                document.getElementById('proceed-to-form-button').textContent = S.proceedToFormButton;
                openModal('welcome-overlay');
            }
        }

        function showUserInfoForm() {
            const S = translations[currentLanguage];
            const formModal = document.getElementById('user-info-form-modal-overlay');
            if (formModal) {
                document.getElementById('user-info-form-title').textContent = S.userInfoFormTitle;
                document.getElementById('user-form-name-label').textContent = S.userFormNameLabel;
                document.getElementById('user-form-interest-label').textContent = S.userFormInterestLabel;
                document.getElementById('skip-user-form-button').textContent = S.skipUserFormButton;
                document.getElementById('submit-user-form-button').textContent = S.submitUserFormButton;
                openModal('user-info-form-modal-overlay');
            }
        }
        
        window.closeUserInfoFormModal = (proceedToSite = false) => { 
            closeModal('user-info-form-modal-overlay');
            if (proceedToSite) {
                const welcomeOverlay = document.getElementById('welcome-overlay');
                if (welcomeOverlay && welcomeOverlay.classList.contains('active')) { // فقط اگر صفحه خوش‌آمدگویی هنوز فعال است، آن را ببند
                     closeModal('welcome-overlay');
                }
                navigateTo(activeSection || 'home'); 
            }
        };
        window.skipUserInfoForm = () => {
            closeModal('user-info-form-modal-overlay');
            const welcomeOverlay = document.getElementById('welcome-overlay');
            if (welcomeOverlay && welcomeOverlay.classList.contains('active')) {
                closeModal('welcome-overlay');
            }
            navigateTo(activeSection || 'home');
        };


        // --- Initial Setup on DOMContentLoaded ---
        document.addEventListener('DOMContentLoaded', async () => {
            loadPreferences(); // بارگذاری تنظیمات قبل از هر چیز دیگر برای زبان و تم
            applyTranslations(); // اعمال ترجمه‌ها بر اساس تنظیمات بارگذاری شده
            
            const S_initial = translations[currentLanguage]; 
            const loaderTextEl = document.getElementById('loader-text');
            if(loaderTextEl && S_initial.loaderText) loaderTextEl.textContent = S_initial.loaderText; 

            // عدم افزودن خطای کتابخانه به لیست خطاها
            if (typeof math === 'undefined' || typeof math.simplify !== 'function') {
                 console.error("Math.js library not loaded or incomplete.");
            }
            if (typeof algebra === 'undefined' || typeof algebra.parse !== 'function') {
                 console.error("Algebra.js library not loaded or incomplete.");
            }

            if (typeof lucide !== 'undefined') { 
                lucide.createIcons(); 
            } else {
                console.error("Lucide icons library not loaded.");
                addCollectedError("خطا: کتابخانه آیکون‌ها (Lucide) بارگذاری نشده است.");
            }
            
            displayUserId(); 
            renderDisplayedNotes(); 
            
            const initialLoader = document.getElementById('initial-loader-overlay');
            if (initialLoader) {
                setTimeout(() => {
                    initialLoader.style.opacity = '0'; 
                    initialLoader.addEventListener('transitionend', () => {
                         if (initialLoader) initialLoader.style.display = 'none'; 
                         showWelcomeOverlay(); // نمایش صفحه خوش‌آمدگویی پس از لودر
                    }, { once: true });
                }, 1500); // زمان نمایش لودر اولیه
            }

            // رویدادهای دکمه‌های صفحه خوش‌آمدگویی و فرم اطلاعات کاربر
            const proceedButton = document.getElementById('proceed-to-form-button');
            if (proceedButton) {
                proceedButton.addEventListener('click', () => {
                    closeModal('welcome-overlay');
                    showUserInfoForm(); 
                });
            }
            const userInfoForm = document.getElementById('user-info-form');
            if (userInfoForm) {
                userInfoForm.addEventListener('submit', (e) => {
                    e.preventDefault(); 
                    userData.name = document.getElementById('user-name-input').value.trim();
                    userData.interest = document.getElementById('user-interest-select').value;
                    displayUserDataInInfoSection(); // به‌روزرسانی نمایش اطلاعات کاربر
                    closeUserInfoFormModal(true); 
                });
            }
            const skipFormButton = document.getElementById('skip-user-form-button');
            if(skipFormButton) {
                skipFormButton.addEventListener('click', skipUserInfoForm);
            }


            // افزودن شنونده‌های رویداد به عناصر تنظیمات
            const themeSelectEl = document.getElementById('theme-select');
            if (themeSelectEl) themeSelectEl.addEventListener('change', (e) => { applyTheme(e.target.value); savePreferences(); });
            
            const fontFarsiSelectEl = document.getElementById('font-farsi-select');
            if (fontFarsiSelectEl) fontFarsiSelectEl.addEventListener('change', (e) => { currentFontFarsi = e.target.value; applyFont(); savePreferences(); });
            
            const fontEnglishSelectEl = document.getElementById('font-english-select');
            if (fontEnglishSelectEl) fontEnglishSelectEl.addEventListener('change', (e) => { currentFontEnglish = e.target.value; applyFont(); savePreferences(); });

            // افزودن شنونده رویداد به فیلد جستجوی هوشمند
            const smartSearchInputEl = document.getElementById('smart-search-input');
            if (smartSearchInputEl) {
                smartSearchInputEl.addEventListener('input', performSmartSearch);
            }

            // بستن منوی تنظیمات با کلیک بیرون از آن
            document.addEventListener('click', (event) => {
                const menu = document.getElementById('settings-menu'); 
                const btn = document.getElementById('settings-button');
                if (menu && btn && !menu.classList.contains('hidden') && !menu.contains(event.target) && !btn.contains(event.target) && !(event.target.closest('#settings-button'))) {
                    toggleSettings(); 
                }
            });
            // بستن مودال‌ها با کلید Escape
            document.addEventListener('keydown', (e) => { 
                if (e.key === "Escape") { 
                    // بستن مودال‌ها به ترتیب اولویت نمایش
                    if (document.getElementById('user-info-form-modal-overlay')?.classList.contains('active')) {
                        closeUserInfoFormModal(true); // اگر فرم باز است، آن را ببند و به سایت برو
                    } else if (document.getElementById('welcome-overlay')?.classList.contains('active')) {
                        closeModal('welcome-overlay'); // اگر صفحه خوش‌آمدگویی باز است، آن را ببند
                        navigateTo('home'); // و به صفحه اصلی برو
                    } else if (document.getElementById('error-display-modal-overlay')?.classList.contains('active')) {
                        closeErrorDisplayModal();
                    } else if (document.getElementById('message-modal-overlay')?.classList.contains('active')) {
                        closeMessageModal();
                    } else if (document.getElementById('ai-response-modal-overlay')?.classList.contains('active')) {
                        closeAIResponseModal();
                    } else if (document.getElementById('confirm-delete-modal-overlay')?.classList.contains('active')) {
                        closeConfirmDeleteModal();
                    } else if (document.getElementById('help-modal-overlay')?.classList.contains('active')) {
                        closeHelpModal();
                    }
                    
                    const settingsMenu = document.getElementById('settings-menu');
                    if (settingsMenu && !settingsMenu.classList.contains('hidden')) {
                        toggleSettings();
                    }
                }
            });

            // بستن مودال‌ها با کلیک روی پس‌زمینه تیره (overlay)
            ['help-modal-overlay', 'confirm-delete-modal-overlay', 'ai-response-modal-overlay', 'message-modal-overlay', 'error-display-modal-overlay', 'user-info-form-modal-overlay', 'welcome-overlay'].forEach(id => {
                const overlay = document.getElementById(id);
                if (overlay) {
                    overlay.addEventListener('click', (e) => {
                        if (e.target.id === id) { 
                            if (id === 'user-info-form-modal-overlay') {
                                closeUserInfoFormModal(true); // اگر روی پس‌زمینه فرم کلیک شد، ببند و به سایت برو
                            } else if (id === 'welcome-overlay') {
                                // معمولا صفحه خوش‌آمدگویی با کلیک روی پس‌زمینه بسته نمی‌شود، مگر اینکه دکمه‌ای داشته باشد
                            } else {
                                closeModal(id);
                            }
                        }
                    });
                }
            });
             // جلوگیری از بسته شدن مودال با کلیک روی محتوای آن
             ['help-modal-content', 'confirm-delete-modal-content', 'ai-response-modal-content', 'message-modal-content', 'error-display-modal-content', 'user-info-form-modal-content'].forEach(id => {
                const content = document.getElementById(id);
                if (content) content.addEventListener('click', e => e.stopPropagation());
            });
            // برای صفحه خوش‌آمدگویی، کلیک روی محتوا (غیر از دکمه) نباید آن را ببندد
            const welcomeContent = document.querySelector('#welcome-overlay > div:not(button)'); // انتخاب محتوای داخلی غیر از دکمه
            if (welcomeContent) welcomeContent.addEventListener('click', e => e.stopPropagation());

            
            // فرم تماس (فقط نمایشی)
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault(); 
                    const S = translations[currentLanguage];
                    showMessageModal(S.contactFormSuccess);
                    e.target.reset(); 
                });
            }

            // نمایش اولیه تب اطلاعات کاربر در بخش اطلاعات
            if (document.getElementById('info-section')) {
                 showInfoTab('user');
            }
            // اطمینان از اینکه اولین بخش (معمولاً خانه) به درستی فعال است اگر هیچ چیز دیگری در ابتدا فعال نشده باشد
            if (!document.querySelector('.section-content.active')) {
                navigateTo('home');
            }

        });
