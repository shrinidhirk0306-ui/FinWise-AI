"""
FinWise AI - Presentation Generator
Creates a professional 10-slide academic presentation for CIA-2: Artificial Intelligence for Finance.
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    # 16:9 widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    DARK_NAVY = RGBColor(15, 23, 42)       # #0F172A
    SLATE_NAVY = RGBColor(30, 41, 59)      # #1E293B
    EMERALD = RGBColor(5, 150, 105)        # #059669
    MINT = RGBColor(16, 185, 129)          # #10B981
    BG_LIGHT = RGBColor(251, 251, 250)     # #FBFBFA
    WHITE = RGBColor(255, 255, 255)
    CARD_BG = RGBColor(248, 250, 252)      # #F8FAFC
    BORDER_COLOR = RGBColor(226, 232, 240) # #E2E8F0
    TEXT_MUTED = RGBColor(100, 116, 139)   # #64748B
    TEXT_DARK = RGBColor(15, 23, 42)

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    def add_header(slide, category_tag, title_text, subtitle_text=""):
        # Category Tag Pill
        tag_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(2.8), Inches(0.32))
        tag_box.fill.solid()
        tag_box.fill.fore_color.rgb = RGBColor(236, 253, 245)
        tag_box.line.color.rgb = RGBColor(167, 243, 208)
        tf_tag = tag_box.text_frame
        tf_tag.word_wrap = True
        tf_tag.margin_top = Inches(0.04)
        tf_tag.margin_bottom = Inches(0.04)
        p_tag = tf_tag.paragraphs[0]
        p_tag.alignment = PP_ALIGN.CENTER
        run_tag = p_tag.add_run()
        run_tag.text = category_tag.upper()
        run_tag.font.name = "Arial"
        run_tag.font.size = Pt(10)
        run_tag.font.bold = True
        run_tag.font.color.rgb = EMERALD

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.7))
        tf = title_box.text_frame
        tf.word_wrap = True
        tf.margin_top = Inches(0)
        tf.margin_left = Inches(0)
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = title_text
        run.font.name = "Arial"
        run.font.size = Pt(22)
        run.font.bold = True
        run.font.color.rgb = DARK_NAVY

        if subtitle_text:
            p2 = tf.add_paragraph()
            run2 = p2.add_run()
            run2.text = subtitle_text
            run2.font.name = "Arial"
            run2.font.size = Pt(12)
            run2.font.color.rgb = TEXT_MUTED

        # Subtle bottom line
        divider = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.5), Inches(11.733), Inches(0.02))
        divider.fill.solid()
        divider.fill.fore_color.rgb = BORDER_COLOR
        divider.line.fill.background()

    def add_footer(slide, slide_num):
        # Footer text
        footer_box = slide.shapes.add_textbox(Inches(0.8), Inches(7.05), Inches(8.0), Inches(0.3))
        tf = footer_box.text_frame
        tf.margin_left = Inches(0)
        p = tf.paragraphs[0]
        run = p.add_run()
        run.text = "FinWise AI – Artificial Intelligence for Finance (CIA-2) | Shrinidhi Kotagiri"
        run.font.name = "Arial"
        run.font.size = Pt(9.5)
        run.font.color.rgb = TEXT_MUTED

        # Slide Number
        num_box = slide.shapes.add_textbox(Inches(11.5), Inches(7.05), Inches(1.0), Inches(0.3))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.alignment = PP_ALIGN.RIGHT
        run_num = p_num.add_run()
        run_num.text = f"{slide_num} / 10"
        run_num.font.name = "Arial"
        run_num.font.size = Pt(9.5)
        run_num.font.bold = True
        run_num.font.color.rgb = DARK_NAVY

    # =========================================================================
    # SLIDE 1: Title Slide (Dark Executive Fintech Design)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, DARK_NAVY)

    # Accent decorative block
    accent_bar = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(1.0), Inches(1.2), Inches(0.12), Inches(4.8))
    accent_bar.fill.solid()
    accent_bar.fill.fore_color.rgb = MINT
    accent_bar.line.fill.background()

    # Title & Subtitle Frame
    title_box1 = slide1.shapes.add_textbox(Inches(1.3), Inches(1.2), Inches(11.0), Inches(3.2))
    tf1 = title_box1.text_frame
    tf1.word_wrap = True

    # Pill tag
    p1_tag = tf1.paragraphs[0]
    run_tag1 = p1_tag.add_run()
    run_tag1.text = "ACADEMIC PROJECT: CIA-2 ASSIGNMENT • AI FOR FINANCE\n"
    run_tag1.font.name = "Arial"
    run_tag1.font.size = Pt(11)
    run_tag1.font.bold = True
    run_tag1.font.color.rgb = MINT

    # Main Title
    p1_title = tf1.add_paragraph()
    run_title1 = p1_title.add_run()
    run_title1.text = "FinWise AI"
    run_title1.font.name = "Arial"
    run_title1.font.size = Pt(44)
    run_title1.font.bold = True
    run_title1.font.color.rgb = WHITE

    # Subtitle
    p1_sub = tf1.add_paragraph()
    run_sub1 = p1_sub.add_run()
    run_sub1.text = "AI-Powered Personal Finance Management System"
    run_sub1.font.name = "Arial"
    run_sub1.font.size = Pt(22)
    run_sub1.font.color.rgb = RGBColor(226, 232, 240)

    # Description
    p1_desc = tf1.add_paragraph()
    run_desc1 = p1_desc.add_run()
    run_desc1.text = "Automated Transaction Categorisation, Predictive Cashflow Analytics & 50/30/20 Savings Optimization"
    run_desc1.font.name = "Arial"
    run_desc1.font.size = Pt(13)
    run_desc1.font.color.rgb = RGBColor(148, 163, 184)

    # Presenter Details Card
    card1 = slide1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.3), Inches(4.7), Inches(10.8), Inches(1.5))
    card1.fill.solid()
    card1.fill.fore_color.rgb = SLATE_NAVY
    card1.line.color.rgb = RGBColor(51, 65, 85)
    tf_card1 = card1.text_frame
    tf_card1.margin_left = Inches(0.4)
    tf_card1.margin_top = Inches(0.25)
    tf_card1.word_wrap = True

    p_c1 = tf_card1.paragraphs[0]
    p_c1.add_run().text = "STUDENT NAME:  "
    p_c1.runs[0].font.size = Pt(11)
    p_c1.runs[0].font.bold = True
    p_c1.runs[0].font.color.rgb = MINT
    p_c1.add_run().text = "Shrinidhi Kotagiri       |       "
    p_c1.runs[1].font.size = Pt(12)
    p_c1.runs[1].font.bold = True
    p_c1.runs[1].font.color.rgb = WHITE
    p_c1.add_run().text = "DEGREE:  "
    p_c1.runs[2].font.size = Pt(11)
    p_c1.runs[2].font.bold = True
    p_c1.runs[2].font.color.rgb = MINT
    p_c1.add_run().text = "B.Tech Computer Science & Engineering (AI / ML)"
    p_c1.runs[3].font.size = Pt(12)
    p_c1.runs[3].font.color.rgb = WHITE

    p_c2 = tf_card1.add_paragraph()
    p_c2.add_run().text = "COURSE:  "
    p_c2.runs[0].font.size = Pt(11)
    p_c2.runs[0].font.bold = True
    p_c2.runs[0].font.color.rgb = MINT
    p_c2.add_run().text = "Artificial Intelligence for Finance (CIA-2)       |       "
    p_c2.runs[1].font.size = Pt(12)
    p_c2.runs[1].font.color.rgb = WHITE
    p_c2.add_run().text = "ACADEMIC YEAR:  "
    p_c2.runs[2].font.size = Pt(11)
    p_c2.runs[2].font.bold = True
    p_c2.runs[2].font.color.rgb = MINT
    p_c2.add_run().text = "2026–2027"
    p_c2.runs[3].font.size = Pt(12)
    p_c2.runs[3].font.color.rgb = WHITE

    # =========================================================================
    # SLIDE 2: Problem Statement
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, BG_LIGHT)
    add_header(slide2, "Background & Motivation", "Problem Statement: Challenges in Personal Bookkeeping", "Why traditional financial tracking fails and creates user abandonment")
    add_footer(slide2, 2)

    # 3 Problem Cards
    card_w = Inches(3.64)
    card_h = Inches(4.8)
    gap = Inches(0.4)
    top_pos = Inches(1.8)

    cards_data = [
        ("01", "Manual Entry Friction", "High Cognitive Overhead",
         ["Users process 30-50+ digital micro-transactions weekly (UPI, food delivery, ride-hailing).",
          "Selecting categories from dropdown menus for every small coffee or cab ride causes fatigue.",
          "Over 65% of personal budgeting attempts are abandoned within the first two weeks."]),
        ("02", "Category Drift & Noise", "Inconsistent Historical Records",
         ["Manual classification leads to inconsistent human tagging over time.",
          "Identical purchases (e.g. food apps) are logged under 'Food', 'Entertainment', or 'Other'.",
          "Corrupts analytics, rendering monthly historical comparisons inaccurate."]),
        ("03", "Passive Data vs. Action", "Absence of Proactive Intelligence",
         ["Spreadsheets and traditional apps only display retrospective numbers after money is spent.",
          "No real-time warnings when discretionary spending spikes unsustainably.",
          "Generic advice like 'save more' fails to provide concrete, category-specific spending caps."])
    ]

    for idx, (num, title, subtitle, points) in enumerate(cards_data):
        x_pos = Inches(0.8) + idx * (card_w + gap)
        box = slide2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x_pos, top_pos, card_w, card_h)
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = BORDER_COLOR
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_right = Inches(0.3)
        tf.margin_top = Inches(0.35)

        # Number pill
        p_num = tf.paragraphs[0]
        r_num = p_num.add_run()
        r_num.text = num
        r_num.font.name = "Arial"
        r_num.font.size = Pt(20)
        r_num.font.bold = True
        r_num.font.color.rgb = EMERALD

        p_t = tf.add_paragraph()
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.name = "Arial"
        r_t.font.size = Pt(16)
        r_t.font.bold = True
        r_t.font.color.rgb = DARK_NAVY

        p_sub = tf.add_paragraph()
        r_sub = p_sub.add_run()
        r_sub.text = subtitle + "\n"
        r_sub.font.name = "Arial"
        r_sub.font.size = Pt(11)
        r_sub.font.bold = True
        r_sub.font.color.rgb = TEXT_MUTED

        for pt in points:
            p_pt = tf.add_paragraph()
            p_pt.level = 0
            r_pt = p_pt.add_run()
            r_pt.text = "•  " + pt
            r_pt.font.name = "Arial"
            r_pt.font.size = Pt(11.5)
            r_pt.font.color.rgb = SLATE_NAVY

    # =========================================================================
    # SLIDE 3: Project Objectives
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, BG_LIGHT)
    add_header(slide3, "Core Goals & Scope", "Project Objectives: What FinWise AI Aims to Achieve", "Delivering automated NLP categorization, live assistance, and actionable savings benchmarks")
    add_footer(slide3, 3)

    obj_w = Inches(5.66)
    obj_h = Inches(2.25)

    objectives = [
        ("Automated NLP Transaction Classification",
         "Implement genuine machine learning using TF-IDF and Multinomial Naive Bayes to classify arbitrary descriptions across 10 financial categories without hardcoded if-else statements.",
         "Machine Learning"),
        ("Real-Time Interactive Form Assistance",
         "Connect a 400ms debounced prediction hook to provide live category suggestions and confidence ratings directly as users type before transaction submission.",
         "Interactive UX"),
        ("Comprehensive Visual Analytics & Trends",
         "Aggregate inflows and outflows into interactive Recharts visualisations: Cashflow Area Charts, Category Donut Charts, and side-by-side Monthly Inflow vs Outflow bars.",
         "Data Analytics"),
        ("Data-Driven 50/30/20 Savings Optimization",
         "Evaluate actual database transaction history against the 50/30/20 guideline (Needs, Wants, Savings) to compute guaranteed positive monthly savings and category caps.",
         "Financial Intelligence")
    ]

    positions = [
        (Inches(0.8), Inches(1.8)),
        (Inches(6.86), Inches(1.8)),
        (Inches(0.8), Inches(4.35)),
        (Inches(6.86), Inches(4.35))
    ]

    for (title, desc, badge), (x, y) in zip(objectives, positions):
        box = slide3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, obj_w, obj_h)
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = BORDER_COLOR
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.25)
        tf.margin_right = Inches(0.3)

        p_b = tf.paragraphs[0]
        r_b = p_b.add_run()
        r_b.text = f"[{badge.upper()}]\n"
        r_b.font.name = "Arial"
        r_b.font.size = Pt(10)
        r_b.font.bold = True
        r_b.font.color.rgb = EMERALD

        p_t = tf.add_paragraph()
        r_t = p_t.add_run()
        r_t.text = title
        r_t.font.name = "Arial"
        r_t.font.size = Pt(15)
        r_t.font.bold = True
        r_t.font.color.rgb = DARK_NAVY

        p_d = tf.add_paragraph()
        r_d = p_d.add_run()
        r_d.text = desc
        r_d.font.name = "Arial"
        r_d.font.size = Pt(11.5)
        r_d.font.color.rgb = SLATE_NAVY

    # =========================================================================
    # SLIDE 4: Proposed Solution & Workflow
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4, BG_LIGHT)
    add_header(slide4, "End-to-End Workflow", "Proposed Solution: System Flow & Operational Pipeline", "Tracing a transaction from user entry to real-time ML classification and analytics update")
    add_footer(slide4, 4)

    steps = [
        ("Step 1", "User Input", "User types description e.g. 'Swiggy lunch order' into modal."),
        ("Step 2", "Frontend Hook", "React 400ms debounce dispatches POST /api/ai/predict."),
        ("Step 3", "NLP Pipeline", "TF-IDF converts tokens to unigrams/bigrams feature vector x."),
        ("Step 4", "Naive Bayes", "MultinomialNB evaluates P(Category | x) with Laplace alpha=0.1."),
        ("Step 5", "Auto-Select", "Frontend displays green AI badge & auto-selects Food & Dining."),
        ("Step 6", "DB Commit", "Transaction committed to SQLite data/finwise.db with confidence."),
        ("Step 7", "Analytics Engine", "50/30/20 engine updates budget meter, Recharts & savings advice.")
    ]

    step_w = Inches(1.52)
    step_gap = Inches(0.18)
    for idx, (st_num, st_name, st_desc) in enumerate(steps):
        x = Inches(0.8) + idx * (step_w + step_gap)
        box = slide4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.85), step_w, Inches(4.7))
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE if idx % 2 == 0 else RGBColor(241, 245, 249)
        box.line.color.rgb = BORDER_COLOR
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.12)
        tf.margin_right = Inches(0.12)
        tf.margin_top = Inches(0.2)

        p1 = tf.paragraphs[0]
        r1 = p1.add_run()
        r1.text = st_num
        r1.font.name = "Arial"
        r1.font.size = Pt(12)
        r1.font.bold = True
        r1.font.color.rgb = EMERALD

        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = st_name + "\n"
        r2.font.name = "Arial"
        r2.font.size = Pt(13)
        r2.font.bold = True
        r2.font.color.rgb = DARK_NAVY

        p3 = tf.add_paragraph()
        r3 = p3.add_run()
        r3.text = st_desc
        r3.font.name = "Arial"
        r3.font.size = Pt(10.5)
        r3.font.color.rgb = SLATE_NAVY

    # =========================================================================
    # SLIDE 5: Technology Stack
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5, BG_LIGHT)
    add_header(slide5, "Technical Foundation", "Technology Stack: Robust Full-Stack & Machine Learning", "Clean separation of presentation, asynchronous API routing, relational storage, and ML")
    add_footer(slide5, 5)

    stack_cards = [
        ("Frontend Presentation", "React 19 + TypeScript + Tailwind",
         [("React 19", "Reactive component hierarchy and state management"),
          ("TypeScript", "Compile-time static type contracts and safety"),
          ("Tailwind CSS", "Utility-first fintech design system (Cream/Navy/Emerald)"),
          ("Recharts", "Interactive SVG visualisations (Area, Donut, Bar)"),
          ("Lucide React", "Icon system for KPIs and transaction categories")]),
        ("Backend & API Layer", "FastAPI + Uvicorn (Python 3.13)",
         [("FastAPI", "High-performance async REST framework with auto OpenAPI"),
          ("Uvicorn", "Production ASGI server executing non-blocking requests"),
          ("Pydantic v2", "Strict schema validation, typing, and serialization"),
          ("CORS Middleware", "Secure cross-origin communication with Vite"),
          ("Modular Routers", "Dedicated endpoints for transactions, AI, analytics")]),
        ("Machine Learning Engine", "Scikit-learn + NumPy + Pandas",
         [("TfidfVectorizer", "Sublinear term-frequency scaling & unigram/bigram n-grams"),
          ("MultinomialNB", "Probabilistic classifier with Laplace smoothing alpha=0.1"),
          ("Joblib", "Binary serialization & disk persistence for model weights"),
          ("Dynamic Retraining", "Live retraining pipeline incorporating user records"),
          ("Softmax Normalizer", "Calibrated confidence percentage outputs")]),
        ("Database & Persistence", "SQLite 3 + SQLAlchemy ORM",
         [("SQLite 3", "Serverless, zero-configuration local ACID database"),
          ("SQLAlchemy 2.0", "Declarative ORM mapping for schema safety"),
          ("transactions Table", "Stores ledger records with classification metadata"),
          ("settings Table", "Stores user profile, currency & budget preferences"),
          ("Data Privacy", "100% local persistence with zero third-party leakage")])
    ]

    for (cat_name, cat_sub, tools), (x, y) in zip(stack_cards, positions):
        box = slide5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, obj_w, obj_h)
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = BORDER_COLOR
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.25)
        tf.margin_top = Inches(0.18)
        tf.margin_right = Inches(0.25)

        p_t = tf.paragraphs[0]
        r_t = p_t.add_run()
        r_t.text = cat_name + "  "
        r_t.font.name = "Arial"
        r_t.font.size = Pt(14)
        r_t.font.bold = True
        r_t.font.color.rgb = DARK_NAVY

        r_sub = p_t.add_run()
        r_sub.text = f"• {cat_sub}\n"
        r_sub.font.name = "Arial"
        r_sub.font.size = Pt(10)
        r_sub.font.bold = True
        r_sub.font.color.rgb = EMERALD

        for tool, purpose in tools:
            p = tf.add_paragraph()
            r_tool = p.add_run()
            r_tool.text = f"•  {tool}: "
            r_tool.font.name = "Arial"
            r_tool.font.size = Pt(10.5)
            r_tool.font.bold = True
            r_tool.font.color.rgb = SLATE_NAVY

            r_purp = p.add_run()
            r_purp.text = purpose
            r_purp.font.name = "Arial"
            r_purp.font.size = Pt(10.5)
            r_purp.font.color.rgb = TEXT_MUTED

    # =========================================================================
    # SLIDE 6: System Architecture
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6, BG_LIGHT)
    add_header(slide6, "Architectural Blueprint", "System Architecture: Decoupled Three-Tier Design", "Seamless integration between client presentation, asynchronous API routing, and local persistence")
    add_footer(slide6, 6)

    # 3 Layers horizontally/vertically
    tier_w = Inches(3.64)
    tier_h = Inches(4.8)
    tier_gap = Inches(0.4)

    tiers = [
        ("Presentation Tier", "Client Layer (Browser)", EMERALD,
         ["React 19 Single Page Application",
          "FinanceContext Global State",
          "Recharts Responsive Visualisations",
          "Debounced Auto-Categorise Form",
          "CSV Spreadsheet Exporter",
          "Tailwind Fintech Design Tokens"]),
        ("Application Tier", "API & Intelligence Layer", DARK_NAVY,
         ["FastAPI Asynchronous Web Engine",
          "Pydantic Validation & Serialization",
          "Scikit-learn ExpenseClassifier Singleton",
          "TF-IDF Vectorizer & MultinomialNB",
          "50/30/20 Heuristic Savings Engine",
          "On-Demand Dynamic Retraining Route"]),
        ("Data Tier", "Persistence Layer (Local)", SLATE_NAVY,
         ["SQLite 3 (data/finwise.db)",
          "SQLAlchemy Declarative Models",
          "transactions Table (Indexed records)",
          "settings Table (Profile & Budgets)",
          "naive_bayes_model.joblib (Trained weights)",
          "100% Offline Private Execution"])
    ]

    for idx, (t_name, t_sub, color, items) in enumerate(tiers):
        x = Inches(0.8) + idx * (tier_w + tier_gap)
        box = slide6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), tier_w, tier_h)
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = BORDER_COLOR
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.3)
        tf.margin_top = Inches(0.3)
        tf.margin_right = Inches(0.3)

        p1 = tf.paragraphs[0]
        r1 = p1.add_run()
        r1.text = t_name + "\n"
        r1.font.name = "Arial"
        r1.font.size = Pt(17)
        r1.font.bold = True
        r1.font.color.rgb = color

        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = t_sub + "\n"
        r2.font.name = "Arial"
        r2.font.size = Pt(11)
        r2.font.bold = True
        r2.font.color.rgb = TEXT_MUTED

        for it in items:
            p_it = tf.add_paragraph()
            r_it = p_it.add_run()
            r_it.text = "✓  " + it
            r_it.font.name = "Arial"
            r_it.font.size = Pt(11.5)
            r_it.font.color.rgb = SLATE_NAVY

    # =========================================================================
    # SLIDE 7: AI/ML Implementation
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7, BG_LIGHT)
    add_header(slide7, "Machine Learning Deep Dive", "AI/ML Implementation: Multinomial Naive Bayes & TF-IDF", "Probabilistic natural language classification with sublinear term-weighting and Laplace smoothing")
    add_footer(slide7, 7)

    col_w = Inches(5.66)
    col_h = Inches(4.8)

    # Left Column: Theory & Mathematics
    b_left = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), col_w, col_h)
    b_left.fill.solid()
    b_left.fill.fore_color.rgb = WHITE
    b_left.line.color.rgb = BORDER_COLOR
    tf_l = b_left.text_frame
    tf_l.word_wrap = True
    tf_l.margin_left = Inches(0.3)
    tf_l.margin_top = Inches(0.3)
    tf_l.margin_right = Inches(0.3)

    p_lt = tf_l.paragraphs[0]
    r_lt = p_lt.add_run()
    r_lt.text = "Mathematical Formulation\n"
    r_lt.font.name = "Arial"
    r_lt.font.size = Pt(16)
    r_lt.font.bold = True
    r_lt.font.color.rgb = DARK_NAVY

    math_points = [
        ("Text Preprocessing", "Lowercase conversion, regex symbol stripping [^a-z0-9], whitespace collapse."),
        ("Sublinear TF-IDF", "TF = 1 + log(count) to prevent large counts from dominating; multiplied by IDF."),
        ("Bayes' Theorem", "P(C_k | x) proportional to P(C_k) * Product( P(x_i | C_k)^x_i )."),
        ("Laplace Smoothing", "Additive alpha = 0.1 prevents zero-probability errors on unseen tokens."),
        ("Softmax Confidence", "Exponentials normalized to output calibrated probability % (0.0 to 1.0).")
    ]

    for title, formula in math_points:
        p = tf_l.add_paragraph()
        r1 = p.add_run()
        r1.text = f"• {title}: "
        r1.font.name = "Arial"
        r1.font.size = Pt(11)
        r1.font.bold = True
        r1.font.color.rgb = EMERALD
        r2 = p.add_run()
        r2.text = formula
        r2.font.name = "Arial"
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = SLATE_NAVY

    # Right Column: Empirical Results
    b_right = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.86), Inches(1.8), col_w, col_h)
    b_right.fill.solid()
    b_right.fill.fore_color.rgb = WHITE
    b_right.line.color.rgb = BORDER_COLOR
    tf_r = b_right.text_frame
    tf_r.word_wrap = True
    tf_r.margin_left = Inches(0.3)
    tf_r.margin_top = Inches(0.3)
    tf_r.margin_right = Inches(0.3)

    p_rt = tf_r.paragraphs[0]
    r_rt = p_rt.add_run()
    r_rt.text = "Empirical Results & Test Cases\n"
    r_rt.font.name = "Arial"
    r_rt.font.size = Pt(16)
    r_rt.font.bold = True
    r_rt.font.color.rgb = DARK_NAVY

    p_stats = tf_r.add_paragraph()
    r_s = p_stats.add_run()
    r_s.text = "Dataset: 258 descriptions across 10 classes | Holdout Accuracy: 78.85%\n"
    r_s.font.name = "Arial"
    r_s.font.size = Pt(11)
    r_s.font.bold = True
    r_s.font.color.rgb = MINT

    cases = [
        ("Swiggy lunch order", "Food & Dining", "97.4%"),
        ("Uber ride", "Transportation", "94.0%"),
        ("Amazon purchase", "Shopping & Retail", "83.6%"),
        ("Electricity payment", "Bills & Utilities", "95.1%"),
        ("Netflix monthly subscription", "Entertainment", "97.2%"),
        ("Apollo Pharmacy medicine", "Healthcare & Medical", "95.2%"),
        ("Coursera specialization fee", "Education", "82.2%"),
        ("Zerodha mutual fund SIP", "Investment", "99.7%")
    ]

    for desc, cat, conf in cases:
        p = tf_r.add_paragraph()
        r = p.add_run()
        r.text = f"✓ \"{desc}\"  →  {cat} ({conf})"
        r.font.name = "Arial"
        r.font.size = Pt(10)
        r.font.bold = True
        r.font.color.rgb = SLATE_NAVY

    # =========================================================================
    # SLIDE 8: Application Demonstration (Screenshots)
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8, BG_LIGHT)
    add_header(slide8, "Visual Demonstration", "Application Demonstration: Modern Fintech User Interface", "Live production screenshots displaying Dashboard, Transaction Ledger, and AI Inference Engine")
    add_footer(slide8, 8)

    # 3 Screenshots side-by-side
    img_w = Inches(3.64)
    img_h = Inches(2.2)
    img_gap = Inches(0.4)

    img_paths = [
        ("docs/screenshots/01_dashboard.png", "Financial Dashboard",
         "KPI Stat Cards, Monthly Budget Consumption Meter, Recharts Cashflow Trend Area Chart & Category Donut."),
        ("docs/screenshots/03_add_transaction_modal.png", "Real-Time AI Auto-Categorisation",
         "Live 400ms debounced hook detects category and confidence as user types before submission."),
        ("docs/screenshots/04_ai_categorisation.png", "AI Diagnostics Playground",
         "Interactive test workbench with posterior class probability bars and live Scikit-learn diagnostics.")
    ]

    for idx, (path, cap_title, cap_desc) in enumerate(img_paths):
        x = Inches(0.8) + idx * (img_w + img_gap)
        if os.path.exists(path):
            slide8.shapes.add_picture(path, x, Inches(1.8), img_w, img_h)

        # Caption Card below image
        caption_box = slide8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.2), img_w, Inches(2.4))
        caption_box.fill.solid()
        caption_box.fill.fore_color.rgb = WHITE
        caption_box.line.color.rgb = BORDER_COLOR
        tf_c = caption_box.text_frame
        tf_c.word_wrap = True
        tf_c.margin_left = Inches(0.2)
        tf_c.margin_top = Inches(0.18)
        tf_c.margin_right = Inches(0.2)

        p1 = tf_c.paragraphs[0]
        r1 = p1.add_run()
        r1.text = cap_title + "\n"
        r1.font.name = "Arial"
        r1.font.size = Pt(13)
        r1.font.bold = True
        r1.font.color.rgb = DARK_NAVY

        p2 = tf_c.add_paragraph()
        r2 = p2.add_run()
        r2.text = cap_desc
        r2.font.name = "Arial"
        r2.font.size = Pt(10.5)
        r2.font.color.rgb = SLATE_NAVY

    # =========================================================================
    # SLIDE 9: Testing and Results
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, BG_LIGHT)
    add_header(slide9, "Quality Assurance", "Testing & Verification: 33/33 QA Audit Tests Passed", "Automated end-to-end verification covering database integrity, boundary cases, and ML inference")
    add_footer(slide9, 9)

    # Top highlight banner
    banner = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.733), Inches(0.95))
    banner.fill.solid()
    banner.fill.fore_color.rgb = DARK_NAVY
    banner.line.color.rgb = EMERALD
    tf_b = banner.text_frame
    tf_b.margin_left = Inches(0.3)
    tf_b.margin_top = Inches(0.15)
    p_b = tf_b.paragraphs[0]
    r_b = p_b.add_run()
    r_b.text = "AUDIT VERDICT: 33 TESTS EXECUTED • 33 PASSED • 0 FAILED (100% SUCCESS RATE)\n"
    r_b.font.name = "Arial"
    r_b.font.size = Pt(14)
    r_b.font.bold = True
    r_b.font.color.rgb = MINT

    p_sub = tf_b.add_paragraph()
    r_sub = p_sub.add_run()
    r_sub.text = "Verified via automated test script backend/test_audit.py against live FastAPI backend and SQLite database."
    r_sub.font.name = "Arial"
    r_sub.font.size = Pt(10.5)
    r_sub.font.color.rgb = RGBColor(226, 232, 240)

    # 4 Test Category Cards
    t_card_w = Inches(2.72)
    t_card_h = Inches(3.7)
    t_gap = Inches(0.28)

    test_categories = [
        ("Dashboard Calculations", "Financial Integrity",
         ["Total Income calculation matches DB inflows (Delta = 0.00).",
          "Total Expenses calculation matches DB outflows (Delta = 0.00).",
          "Net Balance and Total Savings calculations mathematically accurate.",
          "Savings rate percentage verified against formulas."]),
        ("Transactions CRUD", "Database Operations",
         ["Income creation verified (ID #59).",
          "Expense auto-categorisation verified.",
          "Update and edit operation verified.",
          "Delete transaction and cascade refresh.",
          "Full-text search (?q=Swiggy) verified.",
          "Category and type filters verified."]),
        ("AI Model & Boundary", "Inference & Validation",
         ["8 benchmark test cases classified with >80-99% confidence.",
          "Accuracy verified at 78.85% across 258 training descriptions.",
          "404 error returned on invalid ID.",
          "422 validation error on negative amount.",
          "400 validation error on blank text."]),
        ("Frontend & Persistence", "Code & UI Quality",
         ["TypeScript compiled with 0 errors via tsc -b && vite build.",
          "Multi-currency toggle (INR/USD) persisted to SQLite settings table.",
          "Positive savings guarantee verified (Potential savings > 0).",
          "CSV transaction export validated."])
    ]

    for idx, (tc_title, tc_sub, tc_points) in enumerate(test_categories):
        x = Inches(0.8) + idx * (t_card_w + t_gap)
        box = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(2.95), t_card_w, t_card_h)
        box.fill.solid()
        box.fill.fore_color.rgb = WHITE
        box.line.color.rgb = BORDER_COLOR
        tf = box.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.18)
        tf.margin_top = Inches(0.2)
        tf.margin_right = Inches(0.18)

        p1 = tf.paragraphs[0]
        r1 = p1.add_run()
        r1.text = tc_title + "\n"
        r1.font.name = "Arial"
        r1.font.size = Pt(12)
        r1.font.bold = True
        r1.font.color.rgb = DARK_NAVY

        p2 = tf.add_paragraph()
        r2 = p2.add_run()
        r2.text = tc_sub + "\n"
        r2.font.name = "Arial"
        r2.font.size = Pt(10)
        r2.font.bold = True
        r2.font.color.rgb = EMERALD

        for pt in tc_points:
            p_pt = tf.add_paragraph()
            r_pt = p_pt.add_run()
            r_pt.text = "✓ " + pt
            r_pt.font.name = "Arial"
            r_pt.font.size = Pt(9.5)
            r_pt.font.color.rgb = SLATE_NAVY

    # =========================================================================
    # SLIDE 10: Conclusion and Future Scope
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10, DARK_NAVY)

    # Title on Dark Slide
    tag_box10 = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.5), Inches(2.8), Inches(0.32))
    tag_box10.fill.solid()
    tag_box10.fill.fore_color.rgb = SLATE_NAVY
    tag_box10.line.color.rgb = MINT
    tf_tag10 = tag_box10.text_frame
    p_tag10 = tf_tag10.paragraphs[0]
    p_tag10.alignment = PP_ALIGN.CENTER
    r_tag10 = p_tag10.add_run()
    r_tag10.text = "PROJECT SUMMARY & ROADMAP"
    r_tag10.font.name = "Arial"
    r_tag10.font.size = Pt(10)
    r_tag10.font.bold = True
    r_tag10.font.color.rgb = MINT

    title_box10 = slide10.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(0.6))
    tf10 = title_box10.text_frame
    p10 = tf10.paragraphs[0]
    r10 = p10.add_run()
    r10.text = "Conclusion and Future Scope"
    r10.font.name = "Arial"
    r10.font.size = Pt(24)
    r10.font.bold = True
    r10.font.color.rgb = WHITE

    # Left Card: Key Achievements
    c_left = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(5.66), Inches(4.8))
    c_left.fill.solid()
    c_left.fill.fore_color.rgb = SLATE_NAVY
    c_left.line.color.rgb = RGBColor(51, 65, 85)
    tf_cl = c_left.text_frame
    tf_cl.word_wrap = True
    tf_cl.margin_left = Inches(0.35)
    tf_cl.margin_top = Inches(0.3)
    tf_cl.margin_right = Inches(0.35)

    p_cl = tf_cl.paragraphs[0]
    r_cl = p_cl.add_run()
    r_cl.text = "Key Project Achievements\n"
    r_cl.font.name = "Arial"
    r_cl.font.size = Pt(18)
    r_cl.font.bold = True
    r_cl.font.color.rgb = MINT

    achievements = [
        "Frictionless Bookkeeping: Solved user dropout by automating category selection using genuine machine learning.",
        "High Predictive Confidence: Achieved 78.85% test accuracy across 10 classes, with 83-99% confidence on benchmark test cases.",
        "Interactive Real-Time UX: Integrated debounced NLP suggestions and responsive Recharts visualisations.",
        "Actionable Recommendations: Built a 50/30/20 heuristic engine calculating guaranteed positive savings.",
        "Verified Quality: 100% pass rate on 33 automated QA audit test cases."
    ]

    for ach in achievements:
        p = tf_cl.add_paragraph()
        r = p.add_run()
        r.text = "★  " + ach
        r.font.name = "Arial"
        r.font.size = Pt(11.5)
        r.font.color.rgb = RGBColor(226, 232, 240)

    # Right Card: Future Scope
    c_right = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.86), Inches(1.8), Inches(5.66), Inches(4.8))
    c_right.fill.solid()
    c_right.fill.fore_color.rgb = SLATE_NAVY
    c_right.line.color.rgb = RGBColor(51, 65, 85)
    tf_cr = c_right.text_frame
    tf_cr.word_wrap = True
    tf_cr.margin_left = Inches(0.35)
    tf_cr.margin_top = Inches(0.3)
    tf_cr.margin_right = Inches(0.35)

    p_cr = tf_cr.paragraphs[0]
    r_cr = p_cr.add_run()
    r_cr.text = "Future Scope & Enhancements\n"
    r_cr.font.name = "Arial"
    r_cr.font.size = Pt(18)
    r_cr.font.bold = True
    r_cr.font.color.rgb = WHITE

    future_points = [
        "Multi-Tenant User Authentication: Implement OAuth2 / JWT bearer authentication with bcrypt password hashing.",
        "Automated Statement Parsing: Ingest PDF/Excel bank statements via pdfplumber to bulk-categorize hundreds of transactions.",
        "Hybrid LLM Architecture: Combine local Naive Bayes with Gemini API for conversational explanations and zero-shot fallback.",
        "Automated Tax & Audit Reports: Generate downloadable PDF audit summaries with tax exemption schedules.",
        "Progressive Web App (PWA): Package for offline mobile installation."
    ]

    for fp in future_points:
        p = tf_cr.add_paragraph()
        r = p.add_run()
        r.text = "➜  " + fp
        r.font.name = "Arial"
        r.font.size = Pt(11.5)
        r.font.color.rgb = RGBColor(203, 213, 225)

    # Output file
    output_filename = "FinWise_AI_Presentation.pptx"
    prs.save(output_filename)
    print(f"Presentation successfully created and saved to {output_filename}")
    print(f"Total slides: {len(prs.slides)}")

if __name__ == "__main__":
    build_presentation()

