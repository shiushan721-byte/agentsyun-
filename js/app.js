(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const BP = window.AgentsyunBP;
  if (!BP) {
    throw new Error("AgentsyunBP missing: load js/breakpoints.js before js/app.js");
  }
  const isMobileLayout = () => BP.isMobile();
  const isTabletLayout = () => BP.isTablet();
  const isDesktopLayout = () => BP.isDesktop();
  const isCompactNavLayout = () => BP.isCompact();
  const PRESS_FEEDBACK_SEL = [
    "button:not(.primary-button):not(.nav-button-brand):not(.login-submit):not(.download-button-windows):not(.spaces-login):not(.settings-save):not(.logout-dialog-confirm)",
    "a.secondary-button",
    "a.download-button-mac",
    ".download-menu-item",
    ".tablet-menu-row",
    ".tablet-menu-product",
    ".tablet-menu-action",
    ".tablet-menu-product-sm",
    ".tablet-menu-login",
    ".switch-item",
    ".switch-flyout-action",
    ".space-item",
    ".lang-toggle",
    ".menu-toggle",
    ".login-close-abs",
    ".spaces-close",
    ".spaces-apply",
    ".spaces-enter",
  ].join(",");
  let pressClearTimer = 0;

  function clearPressFeedback(delay = 0) {
    window.clearTimeout(pressClearTimer);
    const run = () => {
      $$(".is-pressed").forEach((el) => el.classList.remove("is-pressed"));
      pressClearTimer = 0;
    };
    if (delay > 0) pressClearTimer = window.setTimeout(run, delay);
    else run();
  }

  function bindTabletPressFeedback() {
    document.addEventListener(
      "pointerdown",
      (event) => {
        if (!isTabletLayout()) return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        const target = event.target;
        if (!(target instanceof Element)) return;
        const el = target.closest(PRESS_FEEDBACK_SEL);
        if (!el || el.disabled || el.getAttribute("aria-disabled") === "true") return;
        window.clearTimeout(pressClearTimer);
        clearPressFeedback(0);
        el.classList.add("is-pressed");
      },
      true
    );
    ["pointerup", "pointercancel", "dragstart"].forEach((type) => {
      document.addEventListener(
        type,
        () => {
          if (!isTabletLayout()) return;
          // keep pressed tone briefly so tap feedback is visible
          clearPressFeedback(type === "pointerup" ? 100 : 0);
        },
        true
      );
    });
    // Enable :active styling on iOS WebKit for non-link controls.
    document.addEventListener("touchstart", () => {}, { passive: true });
  }
  bindTabletPressFeedback();

  const toastEl = document.createElement("div");
  toastEl.className = "toast";
  toastEl.setAttribute("role", "status");
  toastEl.setAttribute("aria-live", "polite");
  document.body.appendChild(toastEl);
  let toastTimer;

  const LANG_KEY = "agentsyun_lang";
  const zhToEn = {
    "AI工作站": "AI Workstations",
    "AI智能体平台": "AI agent platform",
    "AI算力平台": "AI compute platform",
    "AI算力调度平台": "AI compute orchestration platform",
    "一句话创建工作流": "Create workflows from one sentence",
    "培训中心": "Training Center",
    "AI培训，从入门到实践": "AI training, from basics to practice",
    "使用手册": "Guide",
    "企业版": "Enterprise",
    "登录注册": "Log in / Sign up",
    "登录/注册": "Log in / Sign up",
    "前往工作台": "Go to Workspace",
    "点击登录": "Click to log in",
    "Agentsyun 首页": "Agentsyun home",
    "主导航": "Main navigation",
    "打开菜单": "Open menu",
    "切换语言": "Switch language",
    "关闭": "Close",
    "登录": "Log in",
    "登 录": "Log in",
    "微信登录": "Log in with WeChat",
    "输入手机号": "Enter phone number",
    "输入验证码": "Enter verification code",
    "输入邀请码（非必填）": "Enter invite code (optional)",
    "发送验证码": "Send code",
    "后获取": "s later",
    "请输入手机号": "Enter phone number",
    "请输入正确的手机号": "Enter a valid phone number",
    "请输入验证码": "Enter verification code",
    "登录即代表同意": "By logging in, you agree to",
    "《隐私政策》": "Privacy Policy",
    "《服务条款》": "Terms of Service",
    "和": "and",
    "，未注册绑定的手机号验证成功后将自动注册": ". Unregistered phone numbers will be registered automatically after verification.",
    "让AI能力": "Make AI capability",
    "成为每个人的天赋": "everyone's native talent",
    "让AI力量成为每个人的天赋": "Make AI power everyone's native talent",
    "江苏汇智智能数字科技有限公司": "Jiangsu Huizhi Intelligent Digital Technology Co., Ltd.",
    "请输入昵称": "Enter nickname",
    "验证码第1位": "Verification code digit 1",
    "验证码第2位": "Verification code digit 2",
    "验证码第3位": "Verification code digit 3",
    "验证码第4位": "Verification code digit 4",
    "验证码第5位": "Verification code digit 5",
    "验证码第6位": "Verification code digit 6",
    "预设头像": "Preset avatars",
    "HZ HERMES 桌面工作台界面": "HZ HERMES desktop workspace interface",
    "侧边导航": "Sidebar navigation",
    "主功能": "Primary features",
    "产品数据": "Product metrics",
    "Hz-Hermes 能力资产": "Hz-Hermes capability assets",
    "发送演示任务": "Send demo task",
    "添加": "Add",
    "语音输入": "Voice input",
    "你的AI智能体管家": "Your AI Agent Butler",
    "帮你搞定电脑上的事": "Helps you get desktop work done",
    "你的 AI 智能体管家，帮你": "Your AI agent butler",
    "搞定电脑上的事": "gets desktop work done",
    "发号施令，坐等成果": "Give the command. Get the result.",
    "Hz-Hermes 是你桌面上的 AI 助手——你告诉它做什么，它帮你完成。写报告、做数据、管客户、自动填表，你不用动手，它替你跑腿。": "Hz-Hermes is the AI assistant on your desktop. Tell it what to do and it gets the work done: reports, data, customer follow-up, forms, and everyday tasks.",
    "Windows 免费下载": "Free Windows Download",
    "macOS 免费下载": "Free macOS Download",
    "Windows 下载": "Windows Download",
    "macOS 下载": "macOS Download",
    "macOS 下载版本": "macOS download options",
    "Apple 芯片": "Apple silicon",
    "Intel芯片": "Intel chip",
    "支持 Windows / macOS": "Windows / macOS supported",
    "本地运行，数据不出域": "Runs locally, data stays in your domain",
    "一键安装，开箱即用": "One-click install, ready to use",
    "新对话": "New chat",
    "搜索对话": "Search chats",
    "消息平台": "Messages",
    "技能": "Skills",
    "定时任务": "Scheduled tasks",
    "文件库": "File library",
    "项目": "Projects",
    "暂无项目": "No projects yet",
    "对话": "Chats",
    "暂无对话": "No chats yet",
    "充值额度": "Top up credits",
    "设置": "Settings",
    "今天想做点什么？": "What would you like to do today?",
    "输入消息，继续提问": "Enter a message to continue",
    "任务描述": "Task description",
    "默认权限": "Default permissions",
    "员工": "Staff",
    "越用越聪明": "Smarter with use",
    "越跑越高效": "Faster with every run",
    "平台渠道接入": "Platform integrations",
    "预置技能包": "Built-in skill packs",
    "不是聊天机器人": "Not a chatbot",
    "是你的数字员工": "Your digital employee",
    "Hz-Hermes 通过深度工程化封装，将配置、部署与技能管理等复杂环节整合优化。你只需要告诉它“做什么”，剩下的交给它。": "Hz-Hermes packages configuration, deployment, and skill management into a streamlined product. Tell it what to do, and hand off the rest.",
    "自主学习进化": "Self-learning evolution",
    "每次执行都自动学习，沉淀为可复用的技能，让团队经验持续变成可调用能力。": "Every run learns and turns team know-how into reusable skills.",
    "跨软件协作": "Cross-app collaboration",
    "在你授权下完成跨越不同桌面应用的多步骤工作，把消息、文档、表格与系统连接起来。": "With your permission, it connects messages, docs, sheets, and systems across desktop apps.",
    "多智能体协同": "Multi-agent collaboration",
    "多个 AI 分工协作，并行处理复杂任务，适合复杂任务的并行推进。": "Multiple AI agents split work and process complex tasks in parallel.",
    "长期记忆": "Long-term memory",
    "记住你的偏好、习惯和历史知识，累积成团队专属上下文。": "It remembers preferences, habits, and history to build team-specific context.",
    "从一句话到一个结果": "From one sentence to one result",
    "从一句话": "From one sentence",
    "到一个结果": "to one result",
    "你给出指令，Hz-Hermes 自主完成全部执行链路": "Give an instruction. Hz-Hermes completes the execution chain.",
    "你给出指令，Hz-Hermes 自主完成全部执行链路。": "Give an instruction. Hz-Hermes completes the execution chain.",
    "任务接收": "Task intake",
    "理解真实意图": "Understand intent",
    "任务拆解": "Task breakdown",
    "解析执行步骤": "Parse steps",
    "流程调度": "Workflow scheduling",
    "编排顺序与资源": "Orchestrate sequence and resources",
    "工具调用": "Tool calling",
    "激活专业能力": "Activate specialized tools",
    "协助执行": "Assisted execution",
    "跨应用完成操作": "Operate across apps",
    "结果交付": "Result delivery",
    "输出可用成品": "Deliver usable output",
    "让 AI 能力": "Make AI capabilities",
    "真正融入日常工作": "part of everyday work",
    "从日常办公到专业领域，一个 AI 搞定。": "From office work to specialized workflows, one AI handles it.",
    "深度研究": "Deep research",
    "给一个主题，它会自主搜索、交叉验证、整理输出结构化报告。做完直接生成网页或文档，拿来就能用。": "Give it a topic. It searches, cross-checks, and produces a structured report, webpage, or document.",
    "AI 智能客服": "AI customer service",
    "对接微信与公众号，自动识别客户意图并回复。常见问题自动处理，复杂情况升级人工。": "Connect WeChat and official accounts, identify intent, answer common questions, and escalate complex cases.",
    "内容创作": "Content creation",
    "写文案、做 PPT、生成宣传图、剪视频脚本、设计网页，从文字到视觉完成高质量交付。": "Write copy, make slides, generate campaign visuals, draft video scripts, and design web pages.",
    "数据分析": "Data analysis",
    "上传 Excel 或 CSV，完成探索性分析、可视化图表与洞察报告，不用写代码也能拿到结论。": "Upload Excel or CSV files to get exploratory analysis, charts, and insight reports without coding.",
    "文档撰写": "Document writing",
    "标书、报告、论文、方案，从深度研究、整理框架到撰写排版，一条任务完整推进。": "For bids, reports, papers, and proposals, it handles research, structure, writing, and formatting.",
    "定时自动化": "Scheduled automation",
    "日报生成、竞品监控、数据巡检。设置一次，每日自动执行并推送到微信或钉钉。": "Generate daily reports, monitor competitors, and inspect data on schedule, then push updates to WeChat or DingTalk.",
    "跨应用协作": "Cross-app collaboration",
    "你下指令": "You give the command",
    "它跑腿": "it does the legwork",
    "Hz-Hermes 能理解你的工作场景和需求，在你授权和控制下，协助完成电脑上的各类操作。": "Hz-Hermes understands your work context and helps complete desktop tasks under your authorization and control.",
    "你不需要自己打开软件、点击按钮或填写表格。告诉它要什么结果，它来执行过程；每一步清晰透明，可随时查看、暂停或调整。": "You no longer need to open apps, click buttons, or fill forms manually. Tell it the result you want; every step stays visible and adjustable.",
    "全程可控": "Fully controllable",
    "所有操作经你授权，每一步可查看、可撤回": "Every action is authorized by you, visible, and reversible",
    "安全隔离": "Secure isolation",
    "在独立沙箱中执行，不影响系统安全": "Runs in an isolated sandbox to protect your system",
    "后台运行": "Runs in the background",
    "不打扰当前工作，默默完成任务": "Completes tasks without interrupting your work",
    "一条指令串起消息、数据与报表": "One instruction connects messages, data, and reports",
    "客户消息": "Customer messages",
    "3 条咨询已回复": "3 inquiries answered",
    "1 条需要确认 · 已标记": "1 needs confirmation · flagged",
    "销售周报": "Sales weekly",
    "第 30 周": "Week 30",
    "较上周增长": "vs. last week",
    "任务已完成": "Task completed",
    "销售报表已生成并发送": "Sales report generated and sent",
    "一个 AI": "One AI",
    "能顶半个团队": "covers half a team",
    "已经落地的真实场景——招投标、办公软件、数据填报、论文撰写、GEO 优化。": "Real deployed scenarios: bidding, office automation, data entry, paper writing, and GEO optimization.",
    "招投标文件处理": "Bid document processing",
    "自动下载标书、解析条款、提取资质并生成应答文档，投标流程更快完成。": "Download bid docs, parse clauses, extract requirements, and generate responses faster.",
    "自动下载标书、解析关键条款、提取资质要求并生成应答文档。以前团队干三天的工作，现在一个人加 AI 两小时完成。": "Automatically download tender docs, parse key clauses, extract qualification requirements, and generate responses.",
    "了解更多": "Learn more",
    "7×24 自动巡检客户消息，理解意图后精准回复。常见问题秒回，复杂情况升级人工。": "Monitor customer messages 24/7, reply precisely, and escalate complex cases to humans.",
    "自动填表与数据录入": "Auto form filling and data entry",
    "从 Excel、PDF、邮件提取数据，自动填入 ERP、OA、CRM 等系统，告别重复复制粘贴。": "Extract data from Excel, PDFs, and emails, then fill ERP, OA, and CRM systems automatically.",
    "论文与研究撰写": "Papers and research writing",
    "深度检索学术资源、梳理文献综述、组织论证结构并输出完整论文，自动处理格式与参考文献。": "Search academic sources, organize literature reviews, structure arguments, and format references.",
    "GEO 搜索优化": "GEO search optimization",
    "分析品牌在豆包、Kimi、DeepSeek 等 AI 搜索中的可见度，生成优化策略与 AI 友好内容。": "Analyze brand visibility in AI search and generate optimization strategies and AI-friendly content.",
    "竞品监控与日报": "Competitor monitoring and daily reports",
    "每天自动搜集竞品动态与行业新闻，整理摘要报告并推送到企业群。": "Collect competitor and industry updates daily, summarize them, and push reports to company groups.",
    "越用越聪明": "Smarter with use",
    "越用越值钱": "more valuable over time",
    "Hz-Hermes 不是用完即走的工具，而是能持续成长的数字员工。": "Hz-Hermes is not a one-off tool. It is a digital employee that keeps improving.",
    "模板化执行": "Templated execution",
    "标准化任务流程，同类任务秒级启动": "Standardize workflows and start similar tasks in seconds",
    "学习偏好": "Preference learning",
    "逐渐理解你的使用习惯与工作风格": "Gradually learns your habits and work style",
    "智能预填推荐": "Smart prefill suggestions",
    "主动推荐参数，减少重复输入和选择": "Suggests parameters to reduce repeated input and choices",
    "主动预判需求": "Proactive needs prediction",
    "从“你告诉它”到“它知道你要什么”": "From “you tell it” to “it knows what you need”",
    "最终成为你专属的 SOP 专家，团队经验永不流失。": "It becomes your dedicated SOP expert, preserving team experience.",
    "为团队打造的": "Built for teams",
    "AI 生产力平台": "AI productivity platform",
    "私有部署、团队协作、权限管理、技能沉淀，让 AI 真正成为组织的数字劳动力。": "Private deployment, team collaboration, permission management, and reusable skills turn AI into digital labor.",
    "预约企业演示": "Book enterprise demo",
    "私有化部署": "Private deployment",
    "数据不出域，支持内网部署。任务在自有服务器或工作站执行，并可对接企业 OAuth / AD 统一认证。": "Keep data in your domain with intranet deployment and enterprise OAuth / AD authentication.",
    "团队技能库": "Team skill library",
    "把财务对账、客户 SOP、质检标准等团队经验沉淀为可复用技能包。": "Turn finance reconciliation, customer SOPs, and QA standards into reusable skill packs.",
    "多级权限": "Multi-level permissions",
    "管理员、操作员、审计员三层权限体系，所有操作可追溯、可审计、可回放。": "Admin, operator, and auditor roles make every action traceable, auditable, and replayable.",
    "多系统集成": "Multi-system integration",
    "对接企业微信、钉钉、飞书，打通 ERP、CRM、OA，让 AI 在多个系统间协作。": "Connect WeCom, DingTalk, Feishu, ERP, CRM, and OA so AI can work across systems.",
    "内置任务调度，日报、数据巡检与系统健康检查自动执行并推送结果。": "Built-in scheduling runs reports, data checks, and health checks automatically.",
    "安全沙箱": "Secure sandbox",
    "所有代码执行在隔离 Docker 沙箱中进行；敏感操作可以设置审批流。": "Code runs in isolated Docker sandboxes, with approval flows for sensitive operations.",
    "现在就拥有你的": "Get your",
    "现在，就拥有你的": "Get your",
    "AI 智能体管家": "AI agent butler",
    "免费下载，5 分钟完成安装。你只需告诉它“做什么”，剩下的交给它。": "Download for free and install in 5 minutes. Tell it what to do, then hand off the rest.",
    "免费下载，5分钟完成安装。你只需告诉它“做什么”，剩下的交给它。": "Download for free and install in 5 minutes. Tell it what to do, then hand off the rest.",
    "下载 Windows 版": "Download for Windows",
    "下载 macOS 版": "Download for macOS",
    "Linux 版即将上线 · 企业版可预约演示": "Linux coming soon · Enterprise demos available",
    "Linux版即将上线·企业版可预约演示": "Linux coming soon · Enterprise demos available",
    "© 2026 汇智智能 · Hz-Hermes 出品": "© 2026 Huizhi Intelligence · Hz-Hermes",
    "技术文档": "Docs",
    "导航": "Navigation",
    "词元(Token)工场": "Token Factory",
    "词元（Token）工厂": "Token Factory",
    "资源": "Resources",
    "联系": "Contact",
    "联系我们": "Contact",
    "南京市雨花台区软件大道178号软件谷产业基地C座3F": "3F, Building C, Software Valley Industrial Base, No. 178 Software Avenue, Yuhuatai District, Nanjing",
    "Copyright 2023 江苏汇智智能数字科技有限公司": "Copyright 2023 Jiangsu Huizhi Intelligent Digital Technology Co., Ltd.",
    "苏ICP备2023021414号-14": "Jiangsu ICP No. 2023021414-14",
    "苏公网安备32011402012641号": "Jiangsu public security registration No. 32011402012641",
    "算法备案号:Jiangsu-CarrotAI-202407030002": "Algorithm filing No. Jiangsu-CarrotAI-202407030002",
    "登录 Agentsyun": "Log in to Agentsyun",
    "输入手机号，登录或注册 Agentsyun": "Enter your phone number to log in or sign up",
    "手机号": "Phone number",
    "我已阅读并同意《服务协议》和《隐私政策》": "I have read and agree to the Terms of Service and Privacy Policy",
    "下一步": "Next",
    "演示账号尾号：0/1 仅个人 · 2 个人+1企业 · 3 审核中 · 4 未通过 · 5 待加入邀请 · 6–9 多企业": "Demo account endings: 0/1 personal only · 2 personal + 1 enterprise · 3 pending · 4 rejected · 5 invited · 6-9 multiple enterprises",
    "输入手机验证码": "Enter SMS code",
    "验证码已发送至": "Code sent to",
    "重新获取验证码": "Resend code",
    "使用其他手机号": "Use another phone number",
    "选择要进入的工作台": "Choose a workspace",
    "选择要登录的账号": "Select an account to sign in",
    "可以进入以下个人或企业工作台": "can enter these personal or enterprise workspaces",
    "申请企业认证": "Apply for Enterprise",
    "进入工作台": "Workspace",
    "登录工作台": "Enter Workspace",
    "登录并前往工作台": "Enter Workspace",
    "确认登录": "Log in",
    "登录更多账号": "Add Account",
    "下次默认进入该工作台": "Use this workspace by default next time",
    "账号设置": "Account settings",
    "个人资料": "Profile",
    "管理你的头像与昵称，手机号仅用于登录不可修改": "Manage your avatar and nickname. Phone number is only used for login and cannot be changed.",
    "头像": "Avatar",
    "点击自定义头像": "Click to customize avatar",
    "上传图片": "Upload image",
    "支持 JPG / PNG，将自动压缩": "Supports JPG / PNG, compressed automatically",
    "手机号不可修改": "Phone number cannot be changed",
    "昵称": "Nickname",
    "用户昵称": "Nickname",
    "长度1-15个字符，支持中文、英文、数字、“_”": "1-15 characters. Chinese, English, numbers, and “_” are supported.",
    "取消": "Cancel",
    "确定": "Confirm",
    "保存": "Save",
    "默认": "Default",
    "蓝色": "Blue",
    "青色": "Teal",
    "暖黄": "Amber",
    "玫红": "Rose",
    "我": "Me",
    "用户": "User",
    "丸子": "Wanzi",
    "成员": "Member",
    "管理员": "Admin",
    "申请人": "Applicant",
    "审核中": "Pending review",
    "未通过": "Rejected",
    "认证未通过": "Verification rejected",
    "待加入": "Pending invite",
    "待确认加入": "Invitation pending",
    "企业已认证": "Enterprise verified",
    "确认": "Confirm",
    "个人工作台": "Personal workspace",
    "我的个人工作台": "My personal workspace",
    "待认证企业申请": "Enterprise verification application",
    "汇智数字（认证未通过）": "Huizhi Digital (verification rejected)",
    "汇智互娱网络科技有限公司": "Huizhi Interactive Entertainment Network Technology Co., Ltd.",
    "南京汇智互娱有限公司": "Nanjing Huizhi Interactive Entertainment Co., Ltd.",
    "江苏汇智智能数字科技有限公司": "Jiangsu Huizhi Intelligent Digital Technology Co., Ltd.",
    "已认证": "Verified",
    "个人": "Personal",
    "企业": "Enterprise",
    "拥有": "Owner",
    "切换工作台": "Switch workspace",
    "切换账号": "Switch account",
    "联系客服": "Contact support",
    "使用微信扫码，联系客服": "Scan with WeChat to contact support",
    "退出登录": "Log out",
    "退出登录？": "Log out?",
    "退出后账号数据不会清空！": "Your account data will not be cleared after logging out!",
    "敬请期待": "Coming soon",
    "该功能": "This feature",
    "前往下载体验": "Go to download",
    "切换到：": "Switched to: ",
    "先输入你想让 Hz-Hermes 做的事": "Enter what you want Hz-Hermes to do first",
    "任务已提交，演示界面开始执行…": "Task submitted. The demo is starting...",
    "正在执行": "Running",
    "正在打开邮件客户端…": "Opening mail client...",
    "已加入企业工作台": "Joined enterprise workspace",
    "认证未通过，请重新提交资料": "Verification failed. Please resubmit your information.",
    "已进入个人工作台": "Entered personal workspace",
    "尚未有可进入的企业工作台": "No enterprise workspace is available yet",
    "企业认证申请（演示） · 后续可替换为正式表单": "Enterprise verification request demo. Replace later with the official form.",
    "请填写昵称": "Please enter a nickname",
    "昵称最多 20 个字": "Nickname can be up to 20 characters",
    "请输入用户昵称": "Enter a nickname",
    "昵称长度不能超过15个字符": "Nickname can be up to 15 characters",
    "仅支持中文、英文、数字、“_”": "Only Chinese, English, numbers, and “_” are supported",
    "账号设置已保存": "Account settings saved",
    "已退出登录": "Logged out",
    "客服通道（演示）": "Support channel demo",
    "请输入正确的 11 位手机号": "Enter a valid 11-digit phone number",
    "请先勾选服务协议与隐私政策": "Please agree to the Terms of Service and Privacy Policy first",
    "验证码已发送（演示）": "Verification code sent demo",
    "验证码已重新发送（演示）": "Verification code resent demo",
    "请输入 6 位验证码": "Enter the 6-digit code",
    "前往申请企业认证": "Go to enterprise verification",
    "头像已更新，点击保存生效": "Avatar updated. Click Save to apply.",
    "图片过大，请选择 8MB 以内的图片": "Image is too large. Choose an image under 8 MB.",
    "图片读取失败，请换一张试试": "Could not read the image. Try another one.",
    "登录并申请": "Log in and apply",
    "认证审核中": "Verification pending",
    "进入企业版": "Enter enterprise",
    "用/skill-creator 创建一个技能，你先问我技能应该做什么吧。": "Use /skill-creator to create a skill. Ask me what the skill should do first.",
    "每日简报": "Daily brief",
    "每日收集10条最热门简报，发送到我的邮箱 📮xiaoyun@mail.com": "Collect 10 trending briefs daily and send them to my mailbox 📮xiaoyun@mail.com",
    "默认目录": "Default folder",
    "工作日09:00": "Weekdays 09:00",
    "默认模型": "Default model",
    "已设2项": "2 items set",
    "HZ HERMES 侧边导航": "HZ HERMES sidebar navigation",
    "Hz-Hermes 执行链路": "Hz-Hermes execution chain"
  };
  const enToZh = Object.fromEntries(Object.entries(zhToEn).map(([zh, en]) => [en, zh]));
  // Legacy EN copy that may still sit in the DOM after dictionary updates.
  const enAliasesToZh = {
    "Apply for enterprise verification": "申请企业认证",
    "Apply for Enterprise Verification": "申请企业认证",
    "Sign in and go to workspace": "登录工作台",
    "Sign In to Workspace": "登录工作台",
    "Sign in to more accounts": "登录更多账号",
    "Confirm Sign In": "确认登录",
    "Confirm sign in": "确认登录",
  };
  Object.assign(enToZh, enAliasesToZh);

  const currentLangFromStorage = () => {
    try {
      return localStorage.getItem(LANG_KEY) === "en" ? "en" : "zh";
    } catch (_) {
      return "zh";
    }
  };
  let currentLang = currentLangFromStorage();
  const capabilityVisualImages = Array.from({ length: 5 }, (_, index) => ({
    zh: `assets/capabilities/bento-visual-${index + 1}.png?v=20260817b`,
    en: `assets/capabilities/bento-visual-en-${index + 1}.png?v=20260817`
  }));

  function canonicalZh(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) return "";
    if (zhToEn[trimmed]) return trimmed;
    if (enToZh[trimmed]) return enToZh[trimmed];
    return trimmed;
  }

  function translatePhrase(value, lang = currentLang) {
    const source = String(value || "");
    const trimmed = source.trim();
    if (!trimmed) return source;
    const zh = canonicalZh(trimmed);
    const next = lang === "en" ? (zhToEn[zh] || trimmed) : zh;
    if (next === trimmed) return source;
    const leading = source.match(/^\s*/)?.[0] || "";
    const trailing = source.match(/\s*$/)?.[0] || "";
    return `${leading}${next}${trailing}`;
  }

  function applyLanguage(lang = currentLang) {
    currentLang = lang === "en" ? "en" : "zh";
    document.documentElement.lang = currentLang === "en" ? "en" : "zh-CN";
    $$("[data-lang-toggle]").forEach((btn) => {
      btn.setAttribute("aria-label", currentLang === "en" ? "Switch to Chinese" : "切换到英文");
      btn.setAttribute("aria-pressed", String(currentLang === "en"));
      btn.classList.toggle("is-zh", currentLang === "zh");
      btn.classList.toggle("is-en", currentLang === "en");
    });
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest("[data-lang-toggle]")) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      node.nodeValue = translatePhrase(node.nodeValue, currentLang);
    });
    $$("[placeholder], [aria-label], [title]").forEach((el) => {
      ["placeholder", "aria-label", "title"].forEach((attr) => {
        if (el.hasAttribute(attr)) el.setAttribute(attr, translatePhrase(el.getAttribute(attr), currentLang));
      });
    });
    $$("textarea").forEach((el) => {
      el.value = translatePhrase(el.value, currentLang);
    });
    $$(".capabilities-bento .capability-visual-image").forEach((img, index) => {
      const asset = capabilityVisualImages[index];
      if (!asset) return;
      img.setAttribute("src", currentLang === "en" ? asset.en : asset.zh);
    });
    const dailyTitle = $(".capabilities-bento .cap-daily-title");
    if (dailyTitle) dailyTitle.textContent = currentLang === "en" ? "Daily brief" : "每日简报";
    const dailyContent = $(".capabilities-bento .cap-daily-content p");
    if (dailyContent) {
      dailyContent.innerHTML = currentLang === "en"
        ? 'Collect 10 trending briefs daily and send them to my mailbox <span>📮</span>xiaoyun@mail.com'
        : '每日收集10条最热门简报，发送到我的邮箱 <span>📮</span>xiaoyun@mail.com';
    }
    // Keep spaces-actions labels in sync even if stale EN copy is stuck in the DOM.
    const spacesApplyLabel = document.querySelector("#login-overlay .spaces-actions .spaces-apply:not(.spaces-more-account) span");
    if (spacesApplyLabel) spacesApplyLabel.textContent = translatePhrase("申请企业认证", currentLang);
    const spacesEnterLabel = document.querySelector("#spaces-enter span");
    if (spacesEnterLabel) spacesEnterLabel.textContent = translatePhrase("登录工作台", currentLang);
    const spacesLoginLabel = document.querySelector("#spaces-login span");
    if (spacesLoginLabel) spacesLoginLabel.textContent = translatePhrase("确认登录", currentLang);
    const spacesMoreLabel = document.querySelector("#spaces-more-account span");
    if (spacesMoreLabel) spacesMoreLabel.textContent = translatePhrase("登录更多账号", currentLang);
    renderAvatarPresets();
    if (draftAvatar) setDraftAvatar(draftAvatar);
    updateAuthButtonCompression();
  }

  function bindLanguageToggle() {
    $$("[data-lang-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const next = currentLang === "en" ? "zh" : "en";
        try {
          localStorage.setItem(LANG_KEY, next);
        } catch (_) {}
        applyLanguage(next);
      });
    });
  }

  function toast(message) {
    toastEl.textContent = translatePhrase(message);
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2400);
  }

  // Mobile / tablet menu
  const toggle = $(".menu-toggle");
  const mobileNav = $("#mobile-nav");
  const compactTopbar = toggle?.closest(".topbar");
  let authCompressionFrame = 0;
  let menuCloseTimer = 0;

  function updateAuthButtonCompression() {
    if (!compactTopbar) return;
    window.cancelAnimationFrame(authCompressionFrame);
    authCompressionFrame = window.requestAnimationFrame(() => {
      compactTopbar.classList.remove("is-auth-icon-only");
      compactTopbar.classList.remove("is-actions-compressed");
      if (!isMobileLayout()) return;
      const logo = $(".logo", compactTopbar);
      const right = $(".topbar-right", compactTopbar);
      const langButton = $(".lang-toggle", compactTopbar);
      if (!logo || !right || !langButton) return;
      const authButton = $(".nav-button-brand", compactTopbar);
      const authVisible = !!(authButton && authButton.offsetParent);
      if (!authVisible) return;
      const minSide = 16;
      const minGap = 8;
      const contentWidth = compactTopbar.clientWidth - minSide * 2;
      const fitsDefault = logo.scrollWidth + right.scrollWidth + minGap <= contentWidth;
      if (fitsDefault) return;
      compactTopbar.classList.add("is-actions-compressed");
      const compressedFits = logo.scrollWidth + right.scrollWidth + minGap <= contentWidth;
      const needsIcon = !compressedFits;
      compactTopbar.classList.toggle("is-auth-icon-only", needsIcon);
    });
  }

  function lockCompactMenuScroll() {
    if (!isMobileLayout()) return;
    document.documentElement.classList.add("is-compact-menu-open");
    document.body.classList.add("is-compact-menu-open");
  }

  function unlockCompactMenuScroll() {
    document.documentElement.classList.remove("is-compact-menu-open");
    document.body.classList.remove("is-compact-menu-open");
  }

  let mobileLoginScrollY = 0;

  function lockMobileLoginScroll() {
    if (!isMobileLayout()) return;
    if (document.body.classList.contains("is-mobile-login-scroll-locked")) return;
    mobileLoginScrollY = window.scrollY || document.documentElement.scrollTop || 0;
    document.documentElement.classList.add("is-mobile-login-scroll-locked");
    document.body.classList.add("is-mobile-login-scroll-locked");
    document.body.style.position = "fixed";
    document.body.style.top = `-${mobileLoginScrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function unlockMobileLoginScroll() {
    const wasLocked = document.body.classList.contains("is-mobile-login-scroll-locked");
    document.documentElement.classList.remove("is-mobile-login-scroll-locked");
    document.body.classList.remove("is-mobile-login-scroll-locked");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    if (wasLocked) window.scrollTo(0, mobileLoginScrollY);
  }

  function setMobileLoginNavState(active) {
    document.body.classList.toggle("is-mobile-login-page-open", !!active);
    compactTopbar?.classList.toggle("is-login-page-open", !!active);
    if (active) {
      lockMobileLoginScroll();
    } else {
      unlockMobileLoginScroll();
    }
    if (!toggle) return;
    toggle.classList.toggle("is-login-close", !!active);
    if (active) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "关闭登录页");
      return;
    }
    if (mobileNav?.hidden) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "打开菜单");
    }
  }

  function resetTabletAccordion() {
    if (!mobileNav) return;
    const accordion = $("[data-tablet-accordion]", mobileNav);
    if (!accordion) return;
    accordion.classList.remove("is-open");
    const trigger = $("[data-tablet-accordion-trigger]", accordion);
    if (trigger) trigger.setAttribute("aria-expanded", "false");
  }
  function closeMenu() {
    if (!toggle || !mobileNav) return;
    if (mobileNav.hidden && !mobileNav.classList.contains("is-closing")) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开菜单");
    compactTopbar?.classList.remove("is-menu-open");
    mobileNav.classList.remove("is-open");
    mobileNav.classList.add("is-closing");
    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = window.setTimeout(() => {
      mobileNav.classList.remove("is-closing");
      mobileNav.hidden = true;
      resetTabletAccordion();
      $$("[data-mobile-switch]", mobileNav).forEach((el) => el.remove());
      const switchBtn = $("[data-tablet-menu-logged] [data-action='switch']", mobileNav);
      switchBtn?.setAttribute("aria-expanded", "false");
      switchBtn?.classList.remove("is-active");
      unlockCompactMenuScroll();
      menuCloseTimer = 0;
    }, 150);
  }
  function forceCloseMenu() {
    if (!toggle || !mobileNav) return;
    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = 0;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "打开菜单");
    compactTopbar?.classList.remove("is-menu-open");
    mobileNav.classList.remove("is-open", "is-closing");
    mobileNav.hidden = true;
    resetTabletAccordion();
    $$("[data-mobile-switch]", mobileNav).forEach((el) => el.remove());
    const switchBtn = $("[data-tablet-menu-logged] [data-action='switch']", mobileNav);
    switchBtn?.setAttribute("aria-expanded", "false");
    switchBtn?.classList.remove("is-active");
    unlockCompactMenuScroll();
  }
  function openMenu() {
    if (!toggle || !mobileNav) return;
    if (!isCompactNavLayout()) return;
    window.clearTimeout(menuCloseTimer);
    menuCloseTimer = 0;
    const guestMenu = $("[data-tablet-menu-guest]", mobileNav);
    const loggedMenu = $("[data-tablet-menu-logged]", mobileNav);
    const isLogged = !!session?.phone && !!session?.space;
    if (guestMenu) guestMenu.hidden = isLogged;
    if (loggedMenu) loggedMenu.hidden = !isLogged;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "关闭菜单");
    if (isMobileLayout()) {
      compactTopbar?.classList.add("is-menu-open");
      lockCompactMenuScroll();
    }
    mobileNav.hidden = false;
    mobileNav.classList.remove("is-closing");
    // ensure opening transition runs after display switches on
    requestAnimationFrame(() => {
      mobileNav.classList.add("is-open");
    });
  }
  if (toggle && mobileNav) {
    const menuWrap = toggle.closest(".menu-toggle-wrap");
    toggle.addEventListener("click", (event) => {
      event.stopPropagation();
      if (document.body.classList.contains("is-mobile-login-page-open")) {
        closeLogin();
        return;
      }
      if (!isCompactNavLayout()) {
        forceCloseMenu();
        return;
      }
      const open = toggle.getAttribute("aria-expanded") === "true";
      open ? closeMenu() : openMenu();
    });
    const accordionTrigger = $("[data-tablet-accordion-trigger]", mobileNav);
    if (accordionTrigger) {
      accordionTrigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const accordion = accordionTrigger.closest("[data-tablet-accordion]");
        if (!accordion) return;
        const nextOpen = !accordion.classList.contains("is-open");
        accordion.classList.toggle("is-open", nextOpen);
        accordionTrigger.setAttribute("aria-expanded", String(nextOpen));
      });
    }
    $$("a", mobileNav).forEach((a) => a.addEventListener("click", closeMenu));
    document.addEventListener("pointerdown", (event) => {
      if (!isCompactNavLayout()) return;
      if (mobileNav.hidden) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (menuWrap?.contains(target) || mobileNav.contains(target) || toggle.contains(target)) return;
      closeMenu();
    });
    const onLayoutMeasure = () => updateAuthButtonCompression();
    window.addEventListener("resize", onLayoutMeasure, { passive: true });
    let lastLayoutTier = BP.current();
    BP.onChange((tier) => {
      updateAuthButtonCompression();
      // Leaving tablet always closes; leaving compact into desktop also closes.
      if (tier === "desktop" || lastLayoutTier === "tablet") forceCloseMenu();
      if (tier === "desktop") closeSwitchAccountPickerForDesktop();
      lastLayoutTier = tier;
    });
    updateAuthButtonCompression();

    const preventBackgroundMenuScroll = (event) => {
      if (!isMobileLayout()) return;
      if (mobileNav.hidden) return;
      const target = event.target;
      if (target instanceof Node && mobileNav.contains(target)) return;
      event.preventDefault();
    };
    document.addEventListener("wheel", preventBackgroundMenuScroll, { passive: false });
    document.addEventListener("touchmove", preventBackgroundMenuScroll, { passive: false });
  }

  // Header line appears only after the page starts scrolling.
  const topbar = $(".topbar");
  function syncTopbarLine() {
    if (!topbar) return;
    topbar.classList.toggle("is-scrolled", window.scrollY > 4);
  }
  syncTopbarLine();
  window.addEventListener("scroll", syncTopbarLine, { passive: true });

  // AI工作站: mouse hover-opens; click toggles while pointer stays; finger tap is one click.
  const dropdowns = $$("[data-nav-dropdown]");
  const navDropdownClosers = new WeakMap();
  function closeDropdown(dropdown) {
    const menu = $(".nav-dropdown-menu", dropdown);
    const btn = $(".nav-dropdown-trigger", dropdown);
    if (!menu || !menu.classList.contains("is-open")) return;
    const previousTimer = navDropdownClosers.get(dropdown);
    if (previousTimer) window.clearTimeout(previousTimer);
    menu.classList.remove("is-open");
    menu.classList.add("is-closing");
    dropdown.classList.remove("is-open");
    if (btn) btn.setAttribute("aria-expanded", "false");
    const timer = window.setTimeout(() => {
      menu.classList.remove("is-closing");
      navDropdownClosers.delete(dropdown);
    }, 150);
    navDropdownClosers.set(dropdown, timer);
  }
  function openDropdown(dropdown) {
    const menu = $(".nav-dropdown-menu", dropdown);
    const btn = $(".nav-dropdown-trigger", dropdown);
    if (!menu) return;
    const previousTimer = navDropdownClosers.get(dropdown);
    if (previousTimer) {
      window.clearTimeout(previousTimer);
      navDropdownClosers.delete(dropdown);
    }
    menu.classList.remove("is-closing");
    menu.classList.add("is-open");
    dropdown.classList.add("is-open");
    if (btn) btn.setAttribute("aria-expanded", "true");
  }
  function closeDropdowns(except) {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      closeDropdown(dd);
    });
  }
  dropdowns.forEach((dd) => {
    const btn = $(".nav-dropdown-trigger", dd);
    if (!btn) return;
    let lastTouchAt = 0;
    const TOUCH_GUARD_MS = 1000;
    const isTouchLike = (event) =>
      event.pointerType === "touch" || Date.now() - lastTouchAt < TOUCH_GUARD_MS;
    dd.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") lastTouchAt = Date.now();
    });
    dd.addEventListener("pointerenter", (event) => {
      if (isTouchLike(event)) return;
      closeDropdowns(dd);
      openDropdown(dd);
    });
    dd.addEventListener("pointerleave", (event) => {
      if (isTouchLike(event)) return;
      closeDropdown(dd);
    });
    dd.addEventListener("focusin", () => {
      if (Date.now() - lastTouchAt < TOUCH_GUARD_MS) return;
      closeDropdowns(dd);
      openDropdown(dd);
    });
    dd.addEventListener("focusout", (event) => {
      if (Date.now() - lastTouchAt < TOUCH_GUARD_MS) return;
      if (!dd.contains(event.relatedTarget)) closeDropdown(dd);
    });
    btn.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      event.preventDefault();
    });
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = dd.classList.contains("is-open");
      closeDropdowns();
      if (!open) openDropdown(dd);
      else closeDropdown(dd);
      btn.blur();
    });
    $$(".nav-dropdown-item", dd).forEach((item) => {
      item.addEventListener("click", () => {
        closeDropdown(dd);
      });
    });
  });
  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;
    dropdowns.forEach((dd) => {
      if (!dd.classList.contains("is-open")) return;
      if (dd.contains(target)) return;
      closeDropdown(dd);
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMenu();
      closeDropdowns();
    }
  });

  // Product menu items

  // Coming soon links
  $$("[data-coming-soon]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      toast(`${translatePhrase(a.getAttribute("data-coming-soon"))} · ${translatePhrase("敬请期待")}`);
      closeMenu();
      closeDropdowns();
    });
  });

  // Active nav: Hz-Hermes is the default page
  const hermesLink = $('.topbar nav > a[data-nav="hermes"]');
  function syncActiveNav() {
    if (hermesLink) hermesLink.classList.add("is-active");
    $$(".topbar nav > a[href^='#']:not([data-nav='hermes'])").forEach((link) => {
      link.classList.remove("is-active");
    });
  }
  syncActiveNav();

  // Smooth anchor focus
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href")?.slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      closeMenu();
      closeDropdowns();
    });
  });

  // Clickable grids → scroll to download / highlight
  $$("[data-clickable-grid] article").forEach((card) => {
    if (card.closest(".flow-track")) return;
    if (card.closest(".capabilities-section, .cases-section, .enterprise-section")) return;
    card.setAttribute("tabindex", "0");
    const go = () => {
      const title = $("h3", card)?.textContent?.trim() || "该功能";
      const link = $("a[href]", card);
      if (link) {
        link.click();
        return;
      }
      toast(`${translatePhrase(title)} · ${translatePhrase("前往下载体验")}`);
      document.getElementById("download")?.scrollIntoView({ behavior: "smooth" });
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      go();
    });
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
  });

  // Branch-style sticky flow card convergence
  const flowSection = $(".flow-section");
  if (flowSection) {
    const flowStage = $(".flow-multi-stage", flowSection) || flowSection;
    let ticking = false;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const getTopbarHeight = () => {
      const header = $(".topbar");
      return header ? Math.round(header.getBoundingClientRect().height) : 0;
    };
    const updateFlowProgress = () => {
      const rect = flowSection.getBoundingClientRect();
      const fullViewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const navHeight = getTopbarHeight();
      const viewportHeight = Math.max(1, fullViewportHeight - navHeight);
      const sectionTop = rect.top - navHeight;
      flowSection.style.setProperty("--flow-nav-height", `${navHeight}px`);
      flowSection.style.setProperty("--flow-vh", `${viewportHeight / 100}px`);
      const scrollable = flowSection.offsetHeight - viewportHeight;
      const progress = clamp((-sectionTop) / Math.max(1, scrollable), 0, 1);
      const pre = clamp((viewportHeight * .5 - sectionTop) / Math.max(1, viewportHeight * .5), 0, 1);
      const cardRaw = clamp((progress - .22) / .7, 0, 1);
      const cardInv = 1 - cardRaw;
      const cardEased = 1 - (cardInv * cardInv * cardInv);
      const rowCount = 7;
      const flowCardHeight = 56;
      const desiredOuterGap = 160;
      const desiredInnerGap = 80;
      const minOuterGap = 64;
      const minInnerGap = 16;
      const contentHeight = rowCount * flowCardHeight;
      const desiredInnerSpace = contentHeight + (rowCount - 1) * desiredInnerGap;
      let innerGap = desiredInnerGap;
      let outerGap = (viewportHeight - desiredInnerSpace) / 2;
      if (outerGap >= desiredOuterGap) {
        outerGap = desiredOuterGap;
        innerGap = (viewportHeight - contentHeight - desiredOuterGap * 2) / (rowCount - 1);
      } else if (outerGap < minOuterGap) {
        outerGap = minOuterGap;
        innerGap = Math.max(
          minInnerGap,
          (viewportHeight - contentHeight - minOuterGap * 2) / (rowCount - 1)
        );
      }
      for (let index = 0; index < rowCount; index += 1) {
        const rowY = outerGap + flowCardHeight / 2 + index * (flowCardHeight + innerGap) - viewportHeight / 2;
        const value = `${rowY.toFixed(2)}px`;
        flowSection.style.setProperty(`--flow-row-${index}`, value);
        flowStage.style.setProperty(`--flow-row-${index}`, value);
      }
      const setMetric = (name, start, end) => {
        const value = start + (end - start) * cardEased;
        flowSection.style.setProperty(name, `${value.toFixed(2)}px`);
        flowStage.style.setProperty(name, `${value.toFixed(2)}px`);
      };
      const nextProgress = progress.toFixed(4);
      const nextPre = pre.toFixed(4);
      setMetric("--flow-title-size", 48, 36);
      setMetric("--flow-title-line", 56, 48);
      setMetric("--flow-subtitle-size", 24, 16);
      setMetric("--flow-subtitle-line", 32, 24);
      flowSection.style.setProperty("--flow-p", nextProgress);
      flowSection.style.setProperty("--flow-pre", nextPre);
      flowStage.style.setProperty("--flow-p", nextProgress);
      flowStage.style.setProperty("--flow-pre", nextPre);
      flowSection.classList.toggle("is-flow-fixed", rect.top <= navHeight && rect.bottom > fullViewportHeight);
      flowSection.classList.toggle("is-flow-after", rect.bottom <= fullViewportHeight);
      ticking = false;
    };
    const requestFlowProgress = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateFlowProgress);
    };
    updateFlowProgress();
    window.addEventListener("scroll", requestFlowProgress, { passive: true });
    window.addEventListener("resize", requestFlowProgress);
  }

  // Scroll-pinned horizontal capability cards
  const capabilitiesSection = $(".capabilities-section");
  if (capabilitiesSection && !capabilitiesSection.classList.contains("capabilities-bento")) {
    const title = $(".section-title", capabilitiesSection);
    const sourceList = $(".capability-list", capabilitiesSection);
    if (title && sourceList && !$(".capabilities-sticky", capabilitiesSection)) {
      const sticky = document.createElement("div");
      sticky.className = "capabilities-sticky";
      const viewport = document.createElement("div");
      viewport.className = "capability-viewport";
      const scrollbar = document.createElement("div");
      scrollbar.className = "capability-scrollbar";
      scrollbar.setAttribute("aria-hidden", "true");
      scrollbar.appendChild(document.createElement("span"));

      capabilitiesSection.appendChild(sticky);
      sticky.appendChild(title);
      sticky.appendChild(viewport);
      viewport.appendChild(sourceList);
      sticky.appendChild(scrollbar);
    }

    const sticky = $(".capabilities-sticky", capabilitiesSection);
    const viewport = $(".capability-viewport", capabilitiesSection);
    const trackList = $(".capability-list", capabilitiesSection);
    let ticking = false;
    let dragState = null;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const cssPx = (name, fallback) => {
      const value = parseFloat(getComputedStyle(capabilitiesSection).getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };
    const measureCapabilities = () => {
      if (!sticky || !viewport || !trackList) return;
      const isDesktopRail = isDesktopLayout();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const sectionPadding = cssPx("--cap-section-padding", 160);
      const desktopSide = cssPx("--desktop-side", 64);
      const containerWidth = Math.min(1280, Math.max(0, window.innerWidth - desktopSide * 2));
      const distance = Math.max(0, trackList.scrollWidth - containerWidth);
      const scrollLength = isDesktopRail ? distance : 0;
      capabilitiesSection.style.setProperty("--cap-scroll-distance", `${distance}px`);
      capabilitiesSection.style.setProperty("--cap-scroll-length", `${scrollLength}px`);
      capabilitiesSection.style.minHeight = isDesktopRail
        ? `${viewportHeight + scrollLength + sectionPadding}px`
        : "";
      return { distance, scrollLength };
    };
    const getCapabilityScrollBounds = () => {
      const metrics = measureCapabilities();
      const scrollLength = metrics?.scrollLength || 0;
      const rect = capabilitiesSection.getBoundingClientRect();
      const start = window.scrollY + rect.top;
      const end = start + scrollLength;
      return { start, end, scrollLength };
    };
    const scrollCapabilityTo = (nextScrollY) => {
      const { start, end, scrollLength } = getCapabilityScrollBounds();
      if (!isDesktopLayout() || scrollLength <= 0) return false;
      const target = clamp(nextScrollY, start, end);
      const root = document.documentElement;
      const previousRootScrollBehavior = root.style.scrollBehavior;
      const previousBodyScrollBehavior = document.body.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      window.scrollTo(0, target);
      root.style.scrollBehavior = previousRootScrollBehavior;
      document.body.style.scrollBehavior = previousBodyScrollBehavior;
      requestCapabilities();
      return true;
    };

    const updateCapabilities = () => {
      const metrics = measureCapabilities();
      const rect = capabilitiesSection.getBoundingClientRect();
      const isDesktopRail = isDesktopLayout();
      const scrollLength = metrics?.scrollLength || 0;
      const sectionTop = window.scrollY + rect.top;
      const scrollPosition = window.scrollY;
      let progress = 0;

      capabilitiesSection.classList.remove("is-cap-fixed", "is-cap-after");
      if (isDesktopRail && scrollLength > 0) {
        const sectionEnd = sectionTop + scrollLength;
        progress = clamp((scrollPosition - sectionTop) / scrollLength, 0, 1);
        if (scrollPosition >= sectionEnd) {
          capabilitiesSection.classList.add("is-cap-after");
        } else if (scrollPosition >= sectionTop) {
          capabilitiesSection.classList.add("is-cap-fixed");
        }
      }
      capabilitiesSection.style.setProperty("--cap-progress", progress.toFixed(4));
      ticking = false;
    };

    const requestCapabilities = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateCapabilities);
    };

    updateCapabilities();
    window.addEventListener("scroll", requestCapabilities, { passive: true });
    window.addEventListener("resize", requestCapabilities);
    BP.onChange(() => requestCapabilities());

    if (viewport) {
      viewport.addEventListener("wheel", (event) => {
        if (!isDesktopLayout()) return;
        const horizontalDelta = event.deltaX || (event.shiftKey ? event.deltaY : 0);
        if (Math.abs(horizontalDelta) <= Math.abs(event.deltaY) && !event.shiftKey) return;
        if (!horizontalDelta) return;
        if (scrollCapabilityTo(window.scrollY + horizontalDelta)) {
          event.preventDefault();
        }
      }, { passive: false });

      viewport.addEventListener("pointerdown", (event) => {
        if (!isDesktopLayout() || event.button !== 0) return;
        const { scrollLength } = getCapabilityScrollBounds();
        if (scrollLength <= 0) return;
        dragState = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startScrollY: window.scrollY
        };
        capabilitiesSection.classList.add("is-cap-dragging");
        viewport.setPointerCapture?.(event.pointerId);
        event.preventDefault();
      });

      viewport.addEventListener("pointermove", (event) => {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        const dragDelta = dragState.startX - event.clientX;
        scrollCapabilityTo(dragState.startScrollY + dragDelta);
        event.preventDefault();
      });

      const endCapabilityDrag = (event) => {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        viewport.releasePointerCapture?.(event.pointerId);
        dragState = null;
        capabilitiesSection.classList.remove("is-cap-dragging");
      };
      viewport.addEventListener("pointerup", endCapabilityDrag);
      viewport.addEventListener("pointercancel", endCapabilityDrag);
      viewport.addEventListener("lostpointercapture", () => {
        dragState = null;
        capabilitiesSection.classList.remove("is-cap-dragging");
      });
    }
  }

  // Sidebar demo
  $$(".app-sidebar .side-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".app-sidebar .side-item").forEach((b) => {
        b.classList.remove("side-active");
        b.setAttribute("aria-pressed", "false");
      });
      btn.classList.add("side-active");
      btn.setAttribute("aria-pressed", "true");
      toast(`${translatePhrase("切换到：")}${translatePhrase(btn.getAttribute("aria-label"))}`);
    });
  });

  // Demo prompt
  const input = $("#demo-prompt");
  const send = $("#demo-send");
  function sendDemo() {
    const text = (input?.value || "").trim();
    if (!text) {
      toast("先输入你想让 Hz-Hermes 做的事");
      input?.focus();
      return;
    }
    toast("任务已提交，演示界面开始执行…");
    input.value = "";
    const running = $(".running");
    if (running) {
      running.innerHTML = `<i></i> ${translatePhrase("正在执行")}`;
    }
  }
  send?.addEventListener("click", sendDemo);
  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendDemo();
  });

  // Download / mailto buttons feedback
  $$('a[href^="mailto:"]').forEach((a) => {
    a.addEventListener("click", () => {
      toast("正在打开邮件客户端…");
    });
  });

  // Finger tap must not leave sticky :hover (mouse hover still applies).
  // Real mouse hover is marked with .is-mouse-hover so CSS fill does not rely on sticky :hover.
  function bindHoverResetOnTouch(els) {
    els.forEach((el) => {
      let lastTouchAt = 0;
      const TOUCH_GUARD_MS = 1000;
      const isTouchLike = (event) =>
        event.pointerType === "touch" || Date.now() - lastTouchAt < TOUCH_GUARD_MS;
      el.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") lastTouchAt = Date.now();
      });
      const markHoverReset = (event) => {
        if (!isTouchLike(event)) return;
        el.classList.add("is-hover-reset");
        el.classList.remove("is-mouse-hover");
      };
      el.addEventListener("pointerup", markHoverReset);
      el.addEventListener("pointercancel", markHoverReset);
      el.addEventListener("click", markHoverReset);
      el.addEventListener("pointerenter", (event) => {
        if (isTouchLike(event)) return;
        el.classList.remove("is-hover-reset");
        el.classList.add("is-mouse-hover");
      });
      el.addEventListener("pointerleave", () => {
        el.classList.remove("is-mouse-hover");
      });
    });
  }
  bindHoverResetOnTouch($$("a.download-button-windows, .lang-toggle, .nav-dropdown-trigger, #mobile-nav .tablet-menu-login, #mobile-nav .tablet-menu-action, #mobile-nav .tablet-menu-product-sm, #mobile-nav .tablet-menu-row, #login-overlay .login-submit, #login-overlay .login-wechat-mobile"));

  // macOS download dropdown (all endpoints):
  // mouse hover-opens; click toggles while pointer stays; finger tap is one click;
  // outside pointerdown closes; option clicks keep existing download behavior.
  $$(".download-menu-wrap").forEach((wrap) => {
    const trigger = $(".download-button-mac", wrap);
    const menu = $(".download-dropdown-menu", wrap);
    if (!trigger || !menu) return;
    let closeTimer = null;
    let lastTouchAt = 0;
    const TOUCH_GUARD_MS = 1000;
    const isTouchLike = (event) =>
      event.pointerType === "touch" || Date.now() - lastTouchAt < TOUCH_GUARD_MS;

    const openMenu = () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      menu.classList.remove("is-closing");
      menu.classList.add("is-open");
      wrap.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      if (!menu.classList.contains("is-open") && !wrap.classList.contains("is-open")) return;
      menu.classList.remove("is-open");
      wrap.classList.remove("is-open");
      menu.classList.add("is-closing");
      trigger.setAttribute("aria-expanded", "false");
      closeTimer = window.setTimeout(() => {
        menu.classList.remove("is-closing");
        closeTimer = null;
      }, 150);
    };

    wrap.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") lastTouchAt = Date.now();
    });
    wrap.addEventListener("pointerenter", (event) => {
      if (isTouchLike(event)) return;
      openMenu();
    });
    wrap.addEventListener("pointerleave", (event) => {
      if (isTouchLike(event)) return;
      closeMenu();
    });
    trigger.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;
      event.preventDefault();
    });
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (menu.classList.contains("is-open")) closeMenu();
      else openMenu();
      trigger.blur();
    });
    document.addEventListener("pointerdown", (event) => {
      if (!(event.target instanceof Node)) return;
      if (wrap.contains(event.target)) return;
      closeMenu();
    });
    $$(".download-menu-item", menu).forEach((item) => {
      item.addEventListener("click", () => {
        closeMenu();
      });
    });
  });

  // Unified Feishu-style auth: one login → choose space
  const SESSION_KEY = "agentsyun_auth_v2";
  const authActions = $("#auth-actions");
  const mobileAuth = $("#mobile-auth");
  const loginOverlay = $("#login-overlay");
  const loginModal = $("#login-overlay .login-modal");
  const settingsOverlay = $("#settings-overlay");
  const logoutOverlay = $("#logout-overlay");
  const supportOverlay = $("#support-overlay");
  const settingsPhone = $("#settings-phone");
  const settingsNickname = $("#settings-nickname");
  const settingsNicknameCount = $("#settings-nickname-count");
  const settingsNicknameHint = $("#settings-nickname-hint");
  const settingsNicknameWrap = $("#settings-overlay .settings-input-wrap");
  const settingsAvatarImg = $("#settings-avatar-img");
  const settingsAvatarPreview = $("#settings-avatar-preview");
  const settingsPresets = $("#settings-presets");
  const settingsUploadInput = $("#settings-upload-input");
  const AVATAR_POOL = [
    "./assets/avatars/avatar-female-1.png",
    "./assets/avatars/avatar-female-2.png",
    "./assets/avatars/avatar-female-3.png",
    "./assets/avatars/avatar-female-4.png",
    "./assets/avatars/avatar-male-1.png",
    "./assets/avatars/avatar-male-2.png",
    "./assets/avatars/avatar-male-3.png",
    "./assets/avatars/avatar-male-4.png",
  ];
  const LEGACY_DEFAULT_AVATAR = "./assets/default-avatar.png";
  const DEFAULT_AVATAR = AVATAR_POOL[0];
  const AVATAR_PRESETS = AVATAR_POOL.map((src, index) => ({
    id: `avatar-${index + 1}`,
    src,
    label: `默认头像 ${index + 1}`,
  }));
  const SETTINGS_NICKNAME_HINT = "长度1-15个字符，支持中文、英文、数字、“_”";
  let draftAvatar = DEFAULT_AVATAR;
  const phoneInput = $("#login-phone");
  const agreeInput = $("#login-agree");
  const rememberInput = $("#remember-space");
  const spaceList = $("#space-list");
  const spacesEnterBtn = $("#spaces-enter");
  const spacesLoginBtn = $("#spaces-login");
  const spacesMoreAccountBtn = $("#spaces-more-account");
  let selectedSpaceId = null;
  let spacePickerMode = "login"; // login | switch
  const enterpriseCta = $("#enterprise-cta");
  const codeInput = $("#login-code");
  const phoneField = $("[data-field='phone']");
  const codeField = $("[data-field='code']");
  const phoneError = $("#login-phone-error");
  const codeError = $("#login-code-error");
  const sendCodeBtn = $("#login-send-code");
  const otpCells = $$(".otp-cell");
  let codeTimer = null;
  let codeLeft = 0;
  let pendingPhone = "";
  let loginIntent = "default"; // default | enterprise
  let availableSpaces = [];
  let session = loadSession();
  let loginOverlayPointerStartedOnBackdrop = false;
  let settingsOverlayPointerStartedOnBackdrop = false;
  let logoutOverlayPointerStartedOnBackdrop = false;
  let supportOverlayPointerStartedOnBackdrop = false;

  function loadSession() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY) || "null") || null;
    } catch (_) {
      return null;
    }
  }
  function saveSession(next) {
    session = next;
    if (!next) localStorage.removeItem(SESSION_KEY);
    else localStorage.setItem(SESSION_KEY, JSON.stringify(next));
    renderAuth();
    renderEnterpriseCta();
  }
  function maskPhone(phone) {
    const p = String(phone || "");
    return p.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  }
  function phoneOk(v) {
    return /^1[3-9]\d{9}$/.test(String(v || "").trim());
  }
  function userDisplayName(phone) {
    const p = String(phone || "").trim();
    return p.length >= 4 ? `用户${p.slice(-4)}` : "用户";
  }
  function avatarForPhone(phone) {
    const seed = String(phone || Date.now());
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return AVATAR_POOL[hash % AVATAR_POOL.length];
  }
  function getAvatarSrc(s = session) {
    if (s?.avatar && s.avatar !== LEGACY_DEFAULT_AVATAR) return s.avatar;
    return avatarForPhone(s?.phone);
  }
  function getDisplayName(s = session) {
    const raw = s && s.displayName;
    if (raw && raw !== "丸子") return raw;
    return userDisplayName(s?.phone) || "用户";
  }
  function orgAvatar(name) {
    return (name || "企").trim().slice(0, 1);
  }
  function letterAvatarDataUrl(letter) {
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, 160, 160);
    ctx.fillStyle = "#fff";
    ctx.font = '600 72px "PingFang SC", "Microsoft YaHei", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(letter || "企").slice(0, 1), 80, 84);
    return canvas.toDataURL("image/png");
  }
  function defaultNameForSpace(space, s = session) {
    if (!space) return getDisplayName(s);
    if (space.type === "personal") return getDisplayName(s);
    const title = String(space.title || "").replace(/[^\u4e00-\u9fa5A-Za-z0-9_]/g, "").trim();
    return (title.slice(0, 15) || getDisplayName(s));
  }
  function defaultAvatarForSpace(space, s = session) {
    if (!space || space.type === "personal") return getAvatarSrc(s);
    return letterAvatarDataUrl(orgAvatar(space.title));
  }
  function getSpaceProfile(space = session?.space, s = session) {
    if (!s?.phone) return { displayName: "", avatar: DEFAULT_AVATAR };
    const target = space || s.space;
    const saved = target?.id ? s.profiles?.[target.id] : null;
    return {
      displayName: (saved?.displayName && String(saved.displayName).trim()) || defaultNameForSpace(target, s),
      avatar: (saved?.avatar && saved.avatar !== LEGACY_DEFAULT_AVATAR) ? saved.avatar : defaultAvatarForSpace(target, s),
    };
  }
  function getActiveSpaceProfile(s = session) {
    return getSpaceProfile(s?.space, s);
  }

  function resolveAccount(phone) {
    const last = String(phone).slice(-1);
    const personal = {
      id: "personal",
      type: "personal",
      title: "我的个人工作台",
      name: userDisplayName(phone),
      role: "",
      status: "ok",
    };
    const orgHz = {
      id: "org-hz",
      type: "enterprise",
      title: "江苏汇智智能数字科技有限公司",
      name: userDisplayName(phone),
      role: "拥有",
      status: "ok",
      certified: true,
    };
    const orgNj = {
      id: "org-game",
      type: "enterprise",
      title: "南京汇智互娱有限公司",
      name: userDisplayName(phone),
      role: "",
      status: "ok",
      certified: false,
    };
    if (last === "3") {
      return {
        spaces: [
          personal,
          {
            id: "org-pending",
            type: "enterprise",
            title: "待认证企业申请",
            name: userDisplayName(phone),
            role: "申请人",
            status: "pending",
            certified: false,
          },
        ],
      };
    }
    if (last === "4") {
      return {
        spaces: [
          personal,
          {
            id: "org-rejected",
            type: "enterprise",
            title: "汇智数字（认证未通过）",
            name: userDisplayName(phone),
            role: "申请人",
            status: "rejected",
            certified: false,
          },
        ],
      };
    }
    if (last === "5") {
      return {
        spaces: [
          personal,
          {
            id: "org-invite",
            type: "enterprise",
            title: "汇智互娱网络科技有限公司",
            name: userDisplayName(phone),
            role: "待加入",
            status: "invite",
            certified: true,
          },
        ],
      };
    }
    return { spaces: [personal, orgHz, orgNj] };
  }

  function openOverlay(el) {
    if (!el) return;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-open"));
    closeMenu();
    closeDropdowns();
    closeAccountMenus();
  }
  function closeOverlay(el) {
    if (!el) return;
    el.classList.remove("is-open");
    setTimeout(() => { el.hidden = true; }, 200);
  }
  function closeOverlays() {
    closeOverlay(loginOverlay);
    closeOverlay(settingsOverlay);
    closeOverlay(logoutOverlay);
    closeOverlay(supportOverlay);
    resetLoginCountdown();
    spacePickerMode = "login";
    loginOverlay?.classList.remove("is-switch-account", "is-spaces-step");
    setMobileLoginNavState(false);
  }
  function closeLogin() {
    closeOverlays();
  }
  function closeSwitchAccountPickerForDesktop() {
    if (!isDesktopLayout()) return;
    if (!loginOverlay?.classList.contains("is-switch-account")) return;
    closeOverlay(loginOverlay);
    spacePickerMode = "login";
    loginOverlay.classList.remove("is-switch-account", "is-spaces-step");
    loginModal?.classList.remove("is-spaces", "is-entering");
    $$(".login-step").forEach((step) => {
      step.classList.toggle("is-active", step.getAttribute("data-step") === "phone");
    });
  }
  let accountMenuCloseTimer = null;
  function clearAccountMenuCloseTimer() {
    if (!accountMenuCloseTimer) return;
    clearTimeout(accountMenuCloseTimer);
    accountMenuCloseTimer = null;
  }
  function closeAccountMenus() {
    clearAccountMenuCloseTimer();
    $$(".account-menu").forEach((m) => {
      m.classList.remove("is-open", "has-switch-open");
      const switchBtn = $("[data-action='switch']", m);
      switchBtn?.classList.remove("is-active");
      switchBtn?.setAttribute("aria-expanded", "false");
      const flyout = $("[data-switch-flyout]", m);
      if (flyout) {
        flyout.setAttribute("aria-hidden", "true");
        flyout.hidden = true;
      }
    });
    $$(".account-trigger").forEach((t) => t.setAttribute("aria-expanded", "false"));
  }

  function showStep(name) {
    $$(".login-step").forEach((step) => {
      step.classList.toggle("is-active", step.getAttribute("data-step") === name);
    });
    loginModal?.classList.toggle("is-spaces", name === "spaces");
    loginOverlay?.classList.toggle("is-spaces-step", name === "spaces");
    setMobileLoginNavState(name === "phone");
    if (name !== "spaces") loginModal?.classList.remove("is-entering");
  }

  function playSpacesModalEnter() {
    if (!loginModal) return;
    loginModal.classList.remove("is-entering");
    void loginModal.offsetWidth;
    loginModal.classList.add("is-entering");
    const onEnd = (e) => {
      if (e.target !== loginModal) return;
      loginModal.classList.remove("is-entering");
      loginModal.removeEventListener("animationend", onEnd);
    };
    loginModal.addEventListener("animationend", onEnd);
  }

  function setLoginError(target, message) {
    const isPhone = target === "phone";
    const errorEl = isPhone ? phoneError : codeError;
    const fieldEl = isPhone ? phoneField : codeField;
    const otherError = isPhone ? codeError : phoneError;
    const otherField = isPhone ? codeField : phoneField;
    if (otherError) {
      otherError.classList.remove("is-visible");
      const text = $("span", otherError);
      if (text) text.textContent = "";
    }
    otherField?.classList.remove("is-error");
    if (!errorEl || !fieldEl) return;
    const text = $("span", errorEl);
    if (text) text.textContent = translatePhrase(message);
    errorEl.classList.add("is-visible");
    fieldEl.classList.add("is-error");
  }

  function clearLoginError(target) {
    const errorEl = target === "phone" ? phoneError : codeError;
    const fieldEl = target === "phone" ? phoneField : codeField;
    if (errorEl) {
      errorEl.classList.remove("is-visible");
      const text = $("span", errorEl);
      if (text) text.textContent = "";
    }
    fieldEl?.classList.remove("is-error");
  }

  function updateLoginInputs() {
    const phone = (phoneInput?.value || "").trim();
    const code = (codeInput?.value || "").trim();
    phoneField?.classList.toggle("has-value", phone.length > 0);
    codeField?.classList.toggle("has-value", code.length > 0);
    const enableCode = phoneOk(phone);
    if (codeInput) codeInput.disabled = !enableCode;
    if (sendCodeBtn) {
      const canSend = enableCode && codeLeft <= 0;
      sendCodeBtn.disabled = !canSend;
      sendCodeBtn.classList.toggle("is-enabled", canSend);
    }
    codeField?.classList.toggle("is-disabled", !enableCode);
    if (!enableCode && codeInput) {
      codeInput.value = "";
      codeField?.classList.remove("has-value");
      clearLoginError("code");
    }
  }

  function resetLoginCountdown() {
    clearInterval(codeTimer);
    codeTimer = null;
    codeLeft = 0;
    if (sendCodeBtn) {
      sendCodeBtn.textContent = translatePhrase("发送验证码");
    }
  }

  function codeCountdownText(seconds) {
    return currentLang === "en" ? `Get in ${seconds}s` : `${seconds}s后获取`;
  }

  function getOtp() {
    if (codeInput) return codeInput.value;
    return otpCells.map((c) => c.value).join("");
  }
  function clearOtp() {
    otpCells.forEach((c) => { c.value = ""; });
    if (codeInput) codeInput.value = "";
    updateLoginInputs();
  }
  function focusOtp() {
    codeInput?.focus();
    otpCells[0]?.focus();
  }

  function startResendCountdown() {
    codeLeft = 60;
    const btn = $("#login-resend") || sendCodeBtn;
    if (!btn) return;
    btn.disabled = true;
    btn.textContent = codeCountdownText(codeLeft);
    btn.classList.remove("is-enabled");
    clearInterval(codeTimer);
    codeTimer = setInterval(() => {
      codeLeft -= 1;
      if (codeLeft <= 0) {
        clearInterval(codeTimer);
        const canSend = phoneOk(phoneInput?.value || "");
        btn.disabled = !canSend;
        btn.textContent = translatePhrase("发送验证码");
        btn.classList.toggle("is-enabled", canSend);
        return;
      }
      btn.textContent = codeCountdownText(codeLeft);
    }, 1000);
  }

  function openLogin(intent = "default") {
    loginIntent = intent;
    spacePickerMode = "login";
    loginOverlay?.classList.remove("is-switch-account", "is-spaces-step");
    pendingPhone = session?.phone || "";
    if (phoneInput && pendingPhone) phoneInput.value = pendingPhone;
    resetLoginCountdown();
    clearOtp();
    clearLoginError("phone");
    clearLoginError("code");
    updateLoginInputs();
    showStep("phone");
    setMobileLoginNavState(true);
    openOverlay(loginOverlay);
  }

  function openSpacePicker(phone, spaces, preferEnterprise) {
    spacePickerMode = "login";
    loginOverlay?.classList.remove("is-switch-account");
    availableSpaces = spaces;
    pendingPhone = phone;
    renderSpaceCards(spaces, preferEnterprise);
    showStep("spaces");
    openOverlay(loginOverlay);
    playSpacesModalEnter();
  }

  function openSwitchAccountPicker() {
    if (!session?.phone) {
      openLogin("default");
      return;
    }
    spacePickerMode = "switch";
    loginOverlay?.classList.add("is-switch-account");
    const spaces = session.spaces || resolveAccount(session.phone).spaces;
    availableSpaces = spaces;
    pendingPhone = session.phone;
    renderSpaceCards(spaces, false);
    if (session.space?.id) {
      selectedSpaceId = session.space.id;
      updateSpaceSelectionUI();
    }
    showStep("spaces");
    openOverlay(loginOverlay);
    playSpacesModalEnter();
  }

  function spaceItemTags(space) {
    const tags = [];
    if (space.type === "personal") {
      tags.push('<span class="space-item-tag">个人</span>');
      return tags.join("");
    }
    if (space.certified && (space.status === "ok" || space.status === "invite")) {
      tags.push(`
        <span class="space-item-tag is-certified">
          <img src="./assets/space-picker/icon-badge-check.svg" alt="" />
          <span>已认证</span>
        </span>
      `);
    }
    tags.push('<span class="space-item-tag">企业</span>');
    if (space.role === "拥有" || space.role === "拥有者") {
      tags.push('<span class="space-item-tag">所有者</span>');
    } else if (space.status === "pending") {
      tags.push('<span class="space-item-tag">审核中</span>');
    } else if (space.status === "rejected") {
      tags.push('<span class="space-item-tag">未通过</span>');
    } else if (space.status === "invite") {
      tags.push('<span class="space-item-tag">待加入</span>');
    } else if (space.status === "ok") {
      tags.push('<span class="space-item-tag">成员</span>');
    }
    return tags.join("");
  }

  function updateSpaceSelectionUI() {
    if (!spaceList) return;
    $$("[data-space-id]", spaceList).forEach((btn) => {
      const id = btn.getAttribute("data-space-id");
      const selected = id === selectedSpaceId;
      btn.classList.toggle("is-selected", selected);
      const mark = $("[data-space-mark]", btn);
      if (mark) {
        mark.src = selected
          ? "./assets/space-picker/icon-circle-check.svg"
          : "./assets/space-picker/icon-circle.svg";
        mark.alt = selected ? "已选中" : "";
      }
    });
    const selected = availableSpaces.find((s) => s.id === selectedSpaceId);
    const canConfirm = !!selected && selected.status !== "pending" && selected.status !== "rejected";
    if (spacesEnterBtn) spacesEnterBtn.disabled = !canConfirm;
    if (spacesLoginBtn) spacesLoginBtn.disabled = !canConfirm;
  }

  function confirmSelectedSpace() {
    const space = availableSpaces.find((s) => s.id === selectedSpaceId);
    if (!space) return;
    if (space.status === "invite") {
      space.status = "ok";
      space.role = "成员";
      toast("已加入企业工作台");
      enterSpace(space, true);
      return;
    }
    if (space.status === "rejected") {
      toast("认证未通过，请重新提交资料");
      goEnterpriseIntro(true);
      return;
    }
    if (space.status === "pending") return;
    enterSpace(space, !!rememberInput?.checked);
  }

  function renderSpaceCards(spaces, preferEnterprise) {
    const ordered = [...spaces];
    if (preferEnterprise) {
      ordered.sort((a, b) => Number(b.type === "enterprise") - Number(a.type === "enterprise"));
    }
    const phone = String(pendingPhone || "");
    const firstSelectable = ordered.find((s) => s.status !== "pending" && s.status !== "rejected") || ordered[0];
    selectedSpaceId = firstSelectable?.id || null;

    spaceList.innerHTML = ordered.map((space, index) => {
      const disabled = space.status === "pending" || space.status === "rejected";
      const isPersonal = space.type === "personal";
      const phoneSuffix = phone.length >= 4 ? phone.slice(-4) : "";
      const personalNameHtml = `<span>用户</span>${phoneSuffix}`;
      const displayTitle = isPersonal
        ? `用户${phoneSuffix}`
        : space.title;
      const nameHtml = isPersonal
        ? `<span class="space-item-name" title="${displayTitle}">${personalNameHtml}</span>`
        : `<span class="space-item-name" title="${displayTitle}">${displayTitle}</span>`;
      const avatarHtml = isPersonal
        ? `<span class="space-item-avatar is-personal"><img src="${avatarForPhone(phone)}" alt="" /></span>`
        : `<span class="space-item-avatar" aria-hidden="true">${orgAvatar(space.title)}</span>`;
      const sep = '<div class="space-item-sep" aria-hidden="true"></div>';
      return `
        <div class="space-item-wrap">
          <button type="button" class="space-item" data-space-id="${space.id}" ${disabled ? "disabled" : ""}>
            ${avatarHtml}
            <span class="space-item-info">
              <span class="space-item-title-block">
                ${nameHtml}
                <span class="space-item-phone">${phone}</span>
              </span>
              <span class="space-item-tags">${spaceItemTags(space)}</span>
            </span>
            <img class="space-item-mark" data-space-mark src="./assets/space-picker/icon-circle.svg" alt="" />
          </button>
        </div>
        ${sep}`;
    }).join("");
    applyLanguage(currentLang);
    updateSpaceSelectionUI();

    $$("[data-space-id]", spaceList).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.disabled) return;
        selectedSpaceId = btn.getAttribute("data-space-id");
        updateSpaceSelectionUI();
        if (spacePickerMode !== "switch") return;
        const space = availableSpaces.find((s) => s.id === selectedSpaceId);
        if (!space) return;
        if (space.id === session?.space?.id) {
          closeOverlays();
          return;
        }
        if (space.status === "invite") {
          space.status = "ok";
          space.role = "成员";
          toast("已加入企业工作台");
        }
        pendingPhone = session.phone;
        enterSpace(space, !!session.rememberSpaceId, { scroll: false });
      });
    });
  }

  function enterSpace(space, remember, options = {}) {
    const phone = pendingPhone || session?.phone;
    const shouldScroll = options.scroll !== false;
    const next = {
      phone,
      displayName: (session?.phone === phone && session?.displayName) ? session.displayName : userDisplayName(phone),
      avatar: (session?.phone === phone && session?.avatar && session.avatar !== LEGACY_DEFAULT_AVATAR) ? session.avatar : avatarForPhone(phone),
      space,
      spaces: availableSpaces.length ? availableSpaces : session?.spaces || [space],
      rememberSpaceId: remember ? space.id : (session?.rememberSpaceId || null),
    };
    saveSession(next);
    closeOverlays();
    if (space.type === "personal") {
      toast("已进入个人工作台");
      if (shouldScroll) document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
    } else {
      toast(currentLang === "en" ? `Entered “${translatePhrase(space.title)}” enterprise workspace demo` : `已进入「${space.title}」企业工作台（演示）`);
      if (shouldScroll) document.getElementById("enterprise")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function afterVerified(phone) {
    const account = resolveAccount(phone);
    availableSpaces = account.spaces;
    pendingPhone = phone;

    const enterableEnterprise = account.spaces.filter((s) => s.type === "enterprise" && s.status === "ok");
    const preferEnterprise = loginIntent === "enterprise";

    // remembered space
    if (session?.rememberSpaceId) {
      const remembered = account.spaces.find((s) => s.id === session.rememberSpaceId && (s.status === "ok" || s.type === "personal"));
      if (remembered && !(preferEnterprise && remembered.type === "personal" && enterableEnterprise.length)) {
        enterSpace(remembered, true);
        return;
      }
    }

    if (preferEnterprise) {
      if (enterableEnterprise.length === 1 && account.spaces.length === 2) {
        // still show picker so user can choose personal or enterprise
        openSpacePicker(phone, account.spaces, true);
        return;
      }
      if (enterableEnterprise.length >= 1) {
        openSpacePicker(phone, account.spaces, true);
        return;
      }
      openSpacePicker(phone, account.spaces, true);
      toast("尚未有可进入的企业工作台");
      return;
    }

    if (account.spaces.length === 1) {
      enterSpace(account.spaces[0], false);
      return;
    }
    openSpacePicker(phone, account.spaces, false);
  }

  function goEnterpriseIntro(focusApply) {
    closeOverlays();
    closeMenu();
    document.getElementById("enterprise")?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", "#enterprise");
    if (focusApply) setTimeout(() => enterpriseCta?.focus(), 350);
  }

  function renderEnterpriseCta() {
    if (!enterpriseCta) return;
    const spaces = session?.spaces || [];
    const enterprises = spaces.filter((s) => s.type === "enterprise");
    const okOrgs = enterprises.filter((s) => s.status === "ok");
    const pending = enterprises.some((s) => s.status === "pending");

    enterpriseCta.onclick = null;
    if (!session?.phone) {
      enterpriseCta.innerHTML = `${translatePhrase("登录并申请")} <span aria-hidden="true">↗</span>`;
      enterpriseCta.onclick = () => openLogin("enterprise");
      return;
    }
    if (pending && !okOrgs.length) {
      enterpriseCta.innerHTML = translatePhrase("认证审核中");
      enterpriseCta.onclick = () => {
        openSpacePicker(session.phone, session.spaces || resolveAccount(session.phone).spaces, true);
      };
      return;
    }
    if (okOrgs.length === 1) {
      enterpriseCta.innerHTML = `${translatePhrase("进入企业版")} <span aria-hidden="true">↗</span>`;
      enterpriseCta.onclick = () => enterSpace(okOrgs[0], false);
      return;
    }
    if (okOrgs.length > 1) {
      enterpriseCta.innerHTML = `${translatePhrase("进入企业版")} <span aria-hidden="true">↗</span>`;
      enterpriseCta.onclick = () => openSpacePicker(session.phone, session.spaces, true);
      return;
    }
    enterpriseCta.innerHTML = `${translatePhrase("申请企业认证")} <span aria-hidden="true">↗</span>`;
    enterpriseCta.onclick = () => {
      toast("企业认证申请（演示） · 后续可替换为正式表单");
    };
  }

  function setDraftAvatar(src) {
    draftAvatar = src || DEFAULT_AVATAR;
    if (settingsAvatarImg) settingsAvatarImg.src = draftAvatar;
    if (settingsPresets) {
      $$(".settings-preset", settingsPresets).forEach((btn) => {
        const id = btn.getAttribute("data-preset-id");
        const preset = AVATAR_PRESETS.find((p) => p.id === id);
        btn.classList.toggle("is-selected", !!preset && preset.src === draftAvatar);
      });
    }
  }

  function updateSettingsCount() {
    if (!settingsNicknameCount || !settingsNickname) return;
    settingsNicknameCount.textContent = `${settingsNickname.value.length}/15`;
  }

  function setSettingsNicknameError(message) {
    settingsNicknameWrap?.classList.add("is-error");
    if (settingsNicknameHint) {
      settingsNicknameHint.textContent = translatePhrase(message);
      settingsNicknameHint.classList.add("is-error");
    }
  }

  function clearSettingsNicknameError() {
    settingsNicknameWrap?.classList.remove("is-error");
    if (settingsNicknameHint) {
      settingsNicknameHint.textContent = translatePhrase(SETTINGS_NICKNAME_HINT);
      settingsNicknameHint.classList.remove("is-error");
    }
  }

  function avatarPresetLabel(index) {
    return currentLang === "en" ? `Default avatar ${index + 1}` : `默认头像 ${index + 1}`;
  }

  function renderAvatarPresets() {
    if (!settingsPresets) return;
    settingsPresets.innerHTML = AVATAR_PRESETS.map((p, index) => {
      const label = avatarPresetLabel(index);
      return `
      <button type="button" class="settings-preset" data-preset-id="${p.id}" title="${label}" aria-label="${label}">
        <img alt="" />
      </button>`;
    }).join("");
    $$(".settings-preset", settingsPresets).forEach((btn) => {
      const preset = AVATAR_PRESETS.find((p) => p.id === btn.getAttribute("data-preset-id"));
      const img = $("img", btn);
      if (img && preset) img.src = preset.src;
      btn.addEventListener("click", () => {
        if (preset) setDraftAvatar(preset.src);
      });
    });
  }

  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith("image/")) {
        reject(new Error("invalid"));
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        reject(new Error("too-large"));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("read"));
      reader.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error("img"));
        img.onload = () => {
          const size = 160;
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext("2d");
          const min = Math.min(img.width, img.height);
          const sx = (img.width - min) / 2;
          const sy = (img.height - min) / 2;
          ctx.drawImage(img, sx, sy, min, min, 0, 0, size, size);
          resolve(canvas.toDataURL("image/jpeg", 0.86));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function openSettings() {
    if (!session?.phone) {
      openLogin("default");
      return;
    }
    const profile = getActiveSpaceProfile();
    if (settingsPhone) settingsPhone.value = session.phone;
    if (settingsNickname) settingsNickname.value = profile.displayName || "";
    clearSettingsNicknameError();
    updateSettingsCount();
    renderAvatarPresets();
    setDraftAvatar(profile.avatar || DEFAULT_AVATAR);
    openOverlay(settingsOverlay);
    requestAnimationFrame(() => document.activeElement?.blur?.());
  }

  function saveSettings() {
    if (!session?.phone) return;
    const nickname = (settingsNickname?.value || "").trim();
    if (!nickname) {
      setSettingsNicknameError("请输入用户昵称");
      settingsNickname?.focus();
      return;
    }
    if (nickname.length > 15) {
      setSettingsNicknameError("昵称长度不能超过15个字符");
      settingsNickname?.focus();
      return;
    }
    if (!/^[\u4e00-\u9fa5A-Za-z0-9_]+$/.test(nickname)) {
      setSettingsNicknameError("仅支持中文、英文、数字、“_”");
      settingsNickname?.focus();
      return;
    }
    const spaceId = session.space?.id || "personal";
    const nextAvatar = draftAvatar || DEFAULT_AVATAR;
    const profiles = {
      ...(session.profiles || {}),
      [spaceId]: {
        displayName: nickname,
        avatar: nextAvatar,
      },
    };
    const next = {
      ...session,
      profiles,
    };
    if (!session.space || session.space.type === "personal") {
      next.displayName = nickname;
      next.avatar = nextAvatar;
    }
    saveSession(next);
    closeOverlays();
    toast("账号设置已保存");
  }

  function truncTitle(title, n = 16) {
    const t = String(title || "");
    return t.length > n ? t.slice(0, n) + "…" : t;
  }

  function renderSwitchFlyout(flyout, menu) {
    if (!flyout || !session) return;
    const spaces = resolveAccount(session.phone).spaces || session.spaces || [];
    availableSpaces = spaces;
    session.spaces = spaces;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch (_) {}
    const currentId = session.space?.id;
    const phone = String(session.phone || "");
    const sep = '<div class="switch-flyout-sep" aria-hidden="true"></div>';
    const items = spaces.map((space) => {
      const disabled = space.status === "pending" || space.status === "rejected";
      const isCurrent = space.id === currentId;
      const isPersonal = space.type === "personal";
      const showCertified = !!space.certified && (space.status === "ok" || space.status === "invite");
      const spaceProfile = getSpaceProfile(space);
      const savedSpaceProfile = session.profiles?.[space.id];
      const displayTitle = isPersonal
        ? (savedSpaceProfile?.displayName || getDisplayName() || (phone ? `用户${phone.slice(-4)}` : "用户"))
        : (savedSpaceProfile?.displayName || space.title);
      const hasCustomEntAvatar = !isPersonal && !!savedSpaceProfile?.avatar;
      const avatarHtml = isPersonal || hasCustomEntAvatar
        ? `<span class="switch-avatar is-personal"><img src="${spaceProfile.avatar}" alt="" /></span>`
        : `<span class="switch-avatar" aria-hidden="true">${orgAvatar(space.title)}</span>`;
      const tags = [];
      if (showCertified) {
        tags.push(`<span class="switch-tag is-certified"><img src="./assets/account-switch/icon-badge-check.svg" alt="" /><span>已认证</span></span>`);
      }
      if (isPersonal) {
        tags.push('<span class="switch-tag">个人</span>');
      } else {
        tags.push('<span class="switch-tag">企业</span>');
        if (space.role === "拥有" || space.role === "拥有者") {
          tags.push(`<span class="switch-tag">${space.role === "拥有者" ? "拥有" : space.role}</span>`);
        }
      }
      let right = "";
      if (isCurrent) {
        right = '<span class="switch-mark-wrap"><img class="switch-mark" src="./assets/account-switch/icon-check.svg" alt="" aria-hidden="true" /></span>';
      } else if (space.status === "pending") {
        right = '<span class="switch-hint">审核中</span>';
      } else if (space.status === "rejected") {
        right = '<span class="switch-hint">未通过</span>';
      } else if (space.status === "invite") {
        right = '<span class="switch-hint">待加入</span>';
      }
      return `
        <button type="button" class="switch-item${isCurrent ? " is-current" : ""}" data-switch-space="${space.id}" ${disabled ? "disabled" : ""}>
          ${avatarHtml}
          <span class="switch-info">
            <span class="switch-title-block">
              <span class="switch-name" title="${displayTitle}">${displayTitle}</span>
              <span class="switch-phone">${phone}</span>
            </span>
            <span class="switch-tags">${tags.join("")}</span>
          </span>
          ${right}
        </button>`;
    }).join(sep);
    flyout.innerHTML = `
      ${items}
      ${sep}
      <button type="button" class="switch-flyout-action" data-switch-apply>
        <img class="switch-action-icon" src="./assets/account-switch/icon-building.svg" alt="" />
        <span>申请企业认证</span>
      </button>
      <button type="button" class="switch-flyout-action" data-switch-more-account>
        <img class="switch-action-icon" src="./assets/account-switch/icon-plus.svg" alt="" />
        <span>登录更多账号</span>
      </button>`;
    flyout.hidden = false;
    flyout.setAttribute("aria-hidden", "false");
    applyLanguage(currentLang);

    $$("[data-switch-space]", flyout).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const space = spaces.find((s) => s.id === btn.getAttribute("data-switch-space"));
        if (!space) return;
        if (space.id === currentId) {
          closeAccountMenus();
          closeMenu();
          return;
        }
        if (space.status === "invite") {
          space.status = "ok";
          space.role = "成员";
          toast("已加入企业工作台");
        }
        pendingPhone = session.phone;
        availableSpaces = spaces;
        closeAccountMenus();
        closeMenu();
        enterSpace(space, !!session.rememberSpaceId, { scroll: false });
      });
    });
    $("[data-switch-apply]", flyout)?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAccountMenus();
      closeMenu();
      goEnterpriseIntro(true);
      toast("企业认证申请（演示）");
    });
    $("[data-switch-more-account]", flyout)?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeAccountMenus();
      closeMenu();
      openLogin("default");
    });
  }

  function openSwitchFlyout(menu) {
    if (!menu) return;
    const switchBtn = $("[data-action='switch']", menu);
    const flyout = $("[data-switch-flyout]", menu);
    clearAccountMenuCloseTimer();
    switchBtn?.classList.add("is-active");
    switchBtn?.setAttribute("aria-expanded", "true");
    renderSwitchFlyout(flyout, menu);
    requestAnimationFrame(() => {
      menu.classList.add("has-switch-open");
    });
  }

  function closeSwitchFlyout(menu) {
    if (!menu) return;
    const switchBtn = $("[data-action='switch']", menu);
    const flyout = $("[data-switch-flyout]", menu);
    menu.classList.remove("has-switch-open");
    switchBtn?.classList.remove("is-active");
    switchBtn?.setAttribute("aria-expanded", "false");
    if (flyout) {
      flyout.setAttribute("aria-hidden", "true");
      flyout.hidden = true;
    }
  }

  function renderTabletLoggedMenu({ profileName, phone, isEnt, hasCustomEntAvatar, activeProfile, space, isCertified }) {
    const guestMenu = $("[data-tablet-menu-guest]");
    const loggedMenu = $("[data-tablet-menu-logged]");
    const topbarEl = $(".topbar");
    if (!loggedMenu) return;
    const avatarHost = $("[data-tablet-user-avatar]", loggedMenu);
    const nameEl = $("[data-tablet-user-name]", loggedMenu);
    const phoneEl = $("[data-tablet-user-phone]", loggedMenu);
    const badgeEl = $("[data-tablet-user-badge]", loggedMenu);
    if (avatarHost) {
      avatarHost.outerHTML = isEnt && !hasCustomEntAvatar
        ? `<span class="tablet-menu-user-avatar is-org" data-tablet-user-avatar aria-hidden="true">${orgAvatar(space.title)}</span>`
        : `<img class="tablet-menu-user-avatar" data-tablet-user-avatar src="${activeProfile.avatar}" alt="" />`;
    }
    if (nameEl) nameEl.textContent = profileName;
    if (phoneEl) phoneEl.textContent = phone;
    if (badgeEl) badgeEl.hidden = !isCertified;
    if (guestMenu) guestMenu.hidden = true;
    loggedMenu.hidden = false;
    topbarEl?.classList.add("is-auth-logged");
    $$("[data-mobile-switch]", loggedMenu).forEach((el) => el.remove());
  }

  function renderTabletGuestMenu() {
    const guestMenu = $("[data-tablet-menu-guest]");
    const loggedMenu = $("[data-tablet-menu-logged]");
    const topbarEl = $(".topbar");
    if (guestMenu) guestMenu.hidden = false;
    if (loggedMenu) {
      loggedMenu.hidden = true;
      $$("[data-mobile-switch]", loggedMenu).forEach((el) => el.remove());
    }
    topbarEl?.classList.remove("is-auth-logged");
  }

  function renderHeroLoginCta(isLoggedIn) {
    const labelText = isLoggedIn ? "前往工作台" : "登录/注册";
    $$(".hero-cta-login").forEach((btn) => {
      const label = $("span", btn);
      btn.hidden = false;
      btn.classList.toggle("is-workspace-link", isLoggedIn);
      btn.setAttribute("aria-label", labelText);
      if (label) label.textContent = labelText;
    });
  }

  function renderAuth() {
    const guest = `<button type="button" class="nav-button-brand" data-open-login>登录/注册</button>`;
    if (!session?.phone || !session?.space) {
      if (authActions) authActions.innerHTML = guest;
      if (mobileAuth) mobileAuth.innerHTML = guest;
      renderTabletGuestMenu();
      renderHeroLoginCta(false);
      bindAuthButtons();
      applyLanguage(currentLang);
      return;
    }
    const space = session.space;
    const phone = String(session.phone || "");
    const isEnt = space.type === "enterprise";
    const isCertified = !!space.certified && (space.status === "ok" || space.status === "invite");
    const savedProfile = session.profiles?.[space.id];
    const activeProfile = getActiveSpaceProfile();
    const profileName = isEnt
      ? (savedProfile?.displayName || space.title)
      : (savedProfile?.displayName || getDisplayName() || (phone ? `用户${phone.slice(-4)}` : "用户"));
    const shortOrg = isEnt ? space.title.replace(/有限公司|股份有限公司/g, "").slice(0, 6) : "";
    const label = isEnt ? `${savedProfile?.displayName || getDisplayName()} · ${shortOrg}` : profileName;
    const hasCustomEntAvatar = isEnt && !!savedProfile?.avatar;
    const triggerAvatar = isEnt && !hasCustomEntAvatar
      ? `<span class="account-trigger-letter" aria-hidden="true">${orgAvatar(space.title)}</span>`
      : `<img class="account-trigger-avatar" src="${activeProfile.avatar}" alt="" />`;
    const panelAvatar = isEnt && !hasCustomEntAvatar
      ? `<span class="account-user-avatar is-org" aria-hidden="true">${orgAvatar(space.title)}</span>`
      : `<img class="account-user-avatar" src="${activeProfile.avatar}" alt="" />`;
    const certifiedBadge = isCertified
      ? `<img class="account-user-badge" src="./assets/account-switch/icon-badge-check.svg" alt="" />`
      : "";
    const menu = `
      <div class="account-menu" data-account-menu>
        <button type="button" class="account-trigger" aria-label="${label}" title="${label}" aria-haspopup="true" aria-expanded="false">
          ${triggerAvatar}
        </button>
        <div class="account-panel" role="menu">
          <div class="account-user">
            <div class="account-user-inner">
              ${panelAvatar}
              <div class="account-user-text">
                <div class="account-user-name-row">
                  <div class="account-user-name">${profileName}</div>
                  ${certifiedBadge}
                </div>
                <div class="account-user-phone">${phone}</div>
              </div>
            </div>
          </div>
          <div class="account-panel-sep" aria-hidden="true"></div>
          <div class="account-menu-item account-switch-wrap">
            <button type="button" data-action="switch" aria-haspopup="true" aria-expanded="false">
              <img class="account-item-icon" src="./assets/account-menu/icon-switch.svg" alt="" />
              <span class="account-item-label">切换账号</span>
              <span class="menu-chevron" aria-hidden="true">›</span>
            </button>
            <div class="account-switch-flyout" data-switch-flyout hidden></div>
          </div>
          <div class="account-menu-item">
            <button type="button" data-action="settings">
              <img class="account-item-icon" src="./assets/account-menu/icon-user-pen.svg" alt="" />
              <span class="account-item-label">账号设置</span>
            </button>
          </div>
          <div class="account-menu-item">
            <button type="button" data-action="support">
              <img class="account-item-icon" src="./assets/account-menu/icon-headset.svg" alt="" />
              <span class="account-item-label">联系客服</span>
            </button>
          </div>
          <div class="account-menu-item">
            <button type="button" class="danger" data-action="logout">
              <img class="account-item-icon" src="./assets/account-menu/icon-logout.svg" alt="" />
              <span class="account-item-label">退出登录</span>
            </button>
          </div>
        </div>
      </div>`;
    if (authActions) authActions.innerHTML = menu;
    if (mobileAuth) {
      mobileAuth.innerHTML = `
        <div style="padding:8px 12px;color:#6e6e76;font-size:12px">${label}</div>
        <button type="button" class="nav-button-ghost" data-action="switch">切换账号</button>
        <button type="button" class="nav-button-ghost" data-action="settings">账号设置</button>
        <button type="button" class="nav-button-ghost" data-action="support">联系客服</button>
        <button type="button" class="nav-button" data-action="logout">退出登录</button>`;
    }
    renderTabletLoggedMenu({
      profileName,
      phone,
      isEnt,
      hasCustomEntAvatar,
      activeProfile,
      space,
      isCertified,
    });
    renderHeroLoginCta(true);
    bindAccountMenus();
    bindAuthButtons();
    applyLanguage(currentLang);
  }

  function bindAuthButtons() {
    $$("[data-open-login]").forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        closeMenu();
        if (btn.classList.contains("hero-cta-login") && session?.phone && session?.space) {
          enterSpace(session.space, !!session.rememberSpaceId);
          return;
        }
        openLogin("default");
      };
    });
    $$("[data-open-support]").forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        closeMenu();
        openOverlay(supportOverlay);
      };
    });
  }

  function bindAccountMenus() {
    $$("[data-account-menu]").forEach((menu) => {
      menu.addEventListener("click", (e) => e.stopPropagation());
      const trigger = $(".account-trigger", menu);
      const switchWrap = $(".account-switch-wrap", menu);
      let lastTouchAt = 0;
      let lastSwitchTouchAt = 0;
      const TOUCH_GUARD_MS = 1000;
      const isTouchLike = (event, stamp) =>
        event.pointerType === "touch" || Date.now() - stamp < TOUCH_GUARD_MS;
      const openAccountMenu = () => {
        clearAccountMenuCloseTimer();
        closeAccountMenus();
        menu.classList.add("is-open");
        trigger?.setAttribute("aria-expanded", "true");
      };
      const scheduleAccountMenuClose = (event) => {
        if (event && isTouchLike(event, lastTouchAt)) return;
        clearAccountMenuCloseTimer();
        accountMenuCloseTimer = setTimeout(() => {
          if (!menu.matches(":hover")) closeAccountMenus();
        }, 120);
      };
      if (trigger) bindHoverResetOnTouch([trigger]);
      menu.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") lastTouchAt = Date.now();
      });
      menu.addEventListener("pointerenter", (event) => {
        if (isTouchLike(event, lastTouchAt)) return;
        openAccountMenu();
      });
      menu.addEventListener("pointerleave", scheduleAccountMenuClose);
      trigger?.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") return;
        event.preventDefault();
      });
      trigger?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = menu.classList.contains("is-open");
        if (open) closeAccountMenus();
        else openAccountMenu();
        trigger.blur();
      });
      switchWrap?.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") lastSwitchTouchAt = Date.now();
      });
      switchWrap?.addEventListener("pointerenter", (event) => {
        if (isTouchLike(event, lastSwitchTouchAt)) return;
        openSwitchFlyout(menu);
      });
      switchWrap?.addEventListener("pointerleave", (event) => {
        if (isTouchLike(event, lastSwitchTouchAt)) return;
        setTimeout(() => {
          if (!switchWrap.matches(":hover")) closeSwitchFlyout(menu);
        }, 60);
      });
      const switchBtn = $("[data-action='switch']", menu);
      switchBtn?.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "touch") return;
        event.preventDefault();
      });
      switchBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (menu.classList.contains("has-switch-open")) closeSwitchFlyout(menu);
        else openSwitchFlyout(menu);
        switchBtn.blur();
      });
    });
    if (!window.__accountMenuOutsideBound) {
      window.__accountMenuOutsideBound = true;
      document.addEventListener("pointerdown", (event) => {
        if (!(event.target instanceof Node)) return;
        const openMenus = $$("[data-account-menu].is-open");
        if (!openMenus.length) return;
        if (openMenus.some((menu) => menu.contains(event.target))) return;
        closeAccountMenus();
      });
    }
    $$("[data-action]").forEach((btn) => {
      if (btn.dataset.actionBound === "1") return;
      btn.dataset.actionBound = "1";
      btn.addEventListener("click", (e) => {
        const action = btn.getAttribute("data-action");
        const menu = btn.closest("[data-account-menu]");
        if (action === "switch") {
          e.preventDefault();
          e.stopPropagation();
          const inTabletLogged = !!btn.closest("[data-tablet-menu-logged]");
          if (inTabletLogged || (isTabletLayout() && !menu)) {
            closeAccountMenus();
            closeMenu();
            openSwitchAccountPicker();
            return;
          }
          if (!menu) {
            availableSpaces = session?.spaces || resolveAccount(session.phone).spaces;
            const host = btn.parentElement;
            let fly = host?.querySelector("[data-mobile-switch]");
            if (fly) {
              fly.remove();
              btn.setAttribute("aria-expanded", "false");
              btn.classList.remove("is-active");
              return;
            }
            fly = document.createElement("div");
            fly.setAttribute("data-mobile-switch", "");
            fly.className = "account-switch-flyout";
            fly.hidden = false;
            fly.style.cssText = "display:flex;opacity:1;visibility:visible;position:static;width:calc(100% - 16px);transform:none;pointer-events:auto;";
            btn.insertAdjacentElement("afterend", fly);
            btn.setAttribute("aria-expanded", "true");
            btn.classList.add("is-active");
            renderSwitchFlyout(fly, null);
          }
          return;
        }
        closeAccountMenus();
        closeMenu();
        if (action === "logout") {
          openOverlay(logoutOverlay);
          return;
        }
        if (action === "settings") {
          openSettings();
          return;
        }
        if (action === "support") {
          openOverlay(supportOverlay);
          return;
        }
      });
    });
  }

  // Login form UX
  phoneInput?.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 11);
    clearLoginError("phone");
    updateLoginInputs();
  });
  codeInput?.addEventListener("input", () => {
    codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
    clearLoginError("code");
    updateLoginInputs();
  });
  sendCodeBtn?.addEventListener("click", () => {
    if (sendCodeBtn.disabled || codeLeft > 0) return;
    startResendCountdown();
    toast("验证码已发送（演示）");
    setTimeout(() => codeInput?.focus(), 40);
  });

  $("#login-next-phone")?.addEventListener("click", () => {
    const phone = (phoneInput?.value || "").trim();
    const code = (codeInput?.value || "").trim();
    if (!phone) {
      setLoginError("phone", "请输入手机号");
      phoneInput?.focus();
      return;
    }
    if (!phoneOk(phone)) {
      setLoginError("phone", "请输入正确的手机号");
      phoneInput?.focus();
      return;
    }
    if (!code) {
      setLoginError("code", "请输入验证码");
      codeInput?.focus();
      return;
    }
    if (!/^\d{6}$/.test(code)) {
      setLoginError("code", "请输入 6 位验证码");
      codeInput?.focus();
      return;
    }
    pendingPhone = phone;
    afterVerified(pendingPhone);
  });

  $$("[data-action-apply]").forEach((btn) => {
    btn.addEventListener("click", () => {
      closeOverlays();
      goEnterpriseIntro(true);
      toast("前往申请企业认证");
    });
  });
  spacesEnterBtn?.addEventListener("click", () => confirmSelectedSpace());
  spacesLoginBtn?.addEventListener("click", () => confirmSelectedSpace());
  spacesMoreAccountBtn?.addEventListener("click", () => {
    spacePickerMode = "login";
    loginOverlay?.classList.remove("is-switch-account");
    loginIntent = "default";
    pendingPhone = "";
    if (phoneInput) phoneInput.value = "";
    resetLoginCountdown();
    clearOtp();
    clearLoginError("phone");
    clearLoginError("code");
    updateLoginInputs();
    showStep("phone");
  });

  $$("[data-close-overlays]").forEach((btn) => {
    btn.addEventListener("click", () => closeOverlays());
  });
  loginOverlay?.addEventListener("pointerdown", (e) => {
    loginOverlayPointerStartedOnBackdrop = e.target === loginOverlay;
  });
  loginOverlay?.addEventListener("click", (e) => {
    if (e.target === loginOverlay && loginOverlayPointerStartedOnBackdrop) closeOverlays();
    loginOverlayPointerStartedOnBackdrop = false;
  });
  loginModal?.addEventListener("pointerdown", (e) => {
    if (e.target.closest("input, textarea")) return;
    phoneInput?.blur();
    codeInput?.blur();
  });
  settingsOverlay?.addEventListener("pointerdown", (e) => {
    settingsOverlayPointerStartedOnBackdrop = e.target === settingsOverlay;
  });
  settingsOverlay?.addEventListener("click", (e) => {
    if (e.target === settingsOverlay && settingsOverlayPointerStartedOnBackdrop) closeOverlays();
    settingsOverlayPointerStartedOnBackdrop = false;
  });
  logoutOverlay?.addEventListener("pointerdown", (e) => {
    logoutOverlayPointerStartedOnBackdrop = e.target === logoutOverlay;
  });
  logoutOverlay?.addEventListener("click", (e) => {
    if (e.target === logoutOverlay && logoutOverlayPointerStartedOnBackdrop) closeOverlays();
    logoutOverlayPointerStartedOnBackdrop = false;
  });
  supportOverlay?.addEventListener("pointerdown", (e) => {
    supportOverlayPointerStartedOnBackdrop = e.target === supportOverlay;
  });
  supportOverlay?.addEventListener("click", (e) => {
    if (e.target === supportOverlay && supportOverlayPointerStartedOnBackdrop) closeOverlays();
    supportOverlayPointerStartedOnBackdrop = false;
  });
  $("#logout-confirm")?.addEventListener("click", () => {
    closeOverlays();
    saveSession(null);
    toast("已退出登录");
  });
  $("#settings-save")?.addEventListener("click", saveSettings);
  settingsAvatarPreview?.addEventListener("click", () => settingsUploadInput?.click());
  settingsAvatarPreview?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    settingsUploadInput?.click();
  });
  settingsUploadInput?.addEventListener("change", async () => {
    const file = settingsUploadInput.files?.[0];
    settingsUploadInput.value = "";
    if (!file) return;
    try {
      const dataUrl = await compressImageFile(file);
      setDraftAvatar(dataUrl);
      toast("头像已更新，点击保存生效");
    } catch (err) {
      if (String(err?.message) === "too-large") toast("图片过大，请选择 8MB 以内的图片");
      else toast("图片读取失败，请换一张试试");
    }
  });
  settingsNickname?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") saveSettings();
  });
  settingsNickname?.addEventListener("input", () => {
    clearSettingsNicknameError();
    updateSettingsCount();
  });

  document.addEventListener("click", () => closeAccountMenus());
  phoneInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#login-next-phone")?.click();
  });
  codeInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#login-next-phone")?.click();
  });
  $$("[data-legal-link]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
  updateLoginInputs();

  bindLanguageToggle();
  renderAuth();
  renderEnterpriseCta();
  renderAvatarPresets();
  applyLanguage(currentLang);

  // Download / mailto buttons feedback
  $$('a[href^="mailto:"]').forEach((a) => {
    a.addEventListener("click", () => {
      toast("正在打开邮件客户端…");
    });
  });
})();
