"""
LinkedIn Carousel Slide Generator
Generates optimized carousel slides for posts 1-7 with:
- No company branding (as per updated guidelines)
- Better space utilization (no large empty gaps)
- Mobile-first typography (18pt+ body, 24pt+ headlines)
- 1080x1350 px (4:5 ratio) optimal LinkedIn format
"""

from PIL import Image, ImageDraw, ImageFont
import os
import textwrap

# === CONFIGURATION ===
SLIDE_WIDTH = 1080
SLIDE_HEIGHT = 1350

# Colors (neon cyberpunk aesthetic)
BG_PRIMARY = "#0a0a0f"
BG_SECONDARY = "#12121a"
BG_CARD_DARK = "#1a1a24"
BG_CARD_ACCENT = "#0d3d3d"
NEON_CYAN = "#00f0ff"
NEON_GREEN = "#00ff88"
NEON_PURPLE = "#a855f7"
NEON_PINK = "#ff0080"
TEXT_PRIMARY = "#ffffff"
TEXT_SECONDARY = "#a0a0b0"
TEXT_MUTED = "#606070"
WARNING_RED = "#ff4444"
WARNING_AMBER = "#ffaa00"

# Font paths - using system fonts
FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"
FONT_REGULAR = "C:/Windows/Fonts/arial.ttf"
FONT_MONO = "C:/Windows/Fonts/consola.ttf"

# Try to use better fonts if available
try:
    test_font = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 20)
    FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
    FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
except:
    pass

OUTPUT_DIR = "C:/Simplefysed/Web Development/Simplefysed/LinkedIn Marketing/Post Designs"


def create_slide(bg_color=BG_PRIMARY):
    """Create a new blank slide with background"""
    img = Image.new('RGB', (SLIDE_WIDTH, SLIDE_HEIGHT), bg_color)
    return img, ImageDraw.Draw(img)


def draw_accent_bar(draw, y=60, width=80, color=NEON_CYAN):
    """Draw the accent bar at top of slide"""
    draw.rectangle([60, y, 60 + width, y + 4], fill=color)


def draw_slide_number(draw, current, total):
    """Draw slide number in top right"""
    font = ImageFont.truetype(FONT_REGULAR, 28)
    text = f"{current:02d} / {total:02d}"
    draw.text((SLIDE_WIDTH - 60, 50), text, font=font, fill=TEXT_MUTED, anchor="ra")


def draw_category_tag(draw, text, y=100, color=NEON_CYAN):
    """Draw category tag like 'AI & MACHINE LEARNING'"""
    font = ImageFont.truetype(FONT_BOLD, 22)
    draw.text((60, y), text.upper(), font=font, fill=color)


def draw_headline(draw, text, y, color=TEXT_PRIMARY, max_width=960, font_size=72):
    """Draw large headline text with word wrap"""
    font = ImageFont.truetype(FONT_BOLD, font_size)
    lines = []
    words = text.split()
    current_line = ""

    for word in words:
        test_line = current_line + " " + word if current_line else word
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)

    line_height = font_size + 10
    for i, line in enumerate(lines):
        draw.text((60, y + i * line_height), line, font=font, fill=color)

    return y + len(lines) * line_height


def draw_body_text(draw, text, y, color=TEXT_SECONDARY, max_width=960, font_size=32, line_spacing=1.4):
    """Draw body text with word wrap"""
    font = ImageFont.truetype(FONT_REGULAR, font_size)
    lines = []

    # Handle explicit line breaks
    paragraphs = text.split('\n')
    for para in paragraphs:
        words = para.split()
        current_line = ""
        for word in words:
            test_line = current_line + " " + word if current_line else word
            bbox = draw.textbbox((0, 0), test_line, font=font)
            if bbox[2] - bbox[0] <= max_width:
                current_line = test_line
            else:
                if current_line:
                    lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)
        elif para == "":
            lines.append("")

    line_height = int(font_size * line_spacing)
    for i, line in enumerate(lines):
        draw.text((60, y + i * line_height), line, font=font, fill=color)

    return y + len(lines) * line_height


def draw_bullet_point(draw, text, y, bullet_color=NEON_CYAN, text_color=TEXT_PRIMARY, font_size=32):
    """Draw a bullet point with colored bullet"""
    font = ImageFont.truetype(FONT_REGULAR, font_size)
    bullet_font = ImageFont.truetype(FONT_BOLD, font_size)

    # Draw bullet
    draw.text((60, y), "→", font=bullet_font, fill=bullet_color)

    # Draw text with word wrap
    max_width = 880
    words = text.split()
    lines = []
    current_line = ""

    for word in words:
        test_line = current_line + " " + word if current_line else word
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = word
    if current_line:
        lines.append(current_line)

    line_height = int(font_size * 1.4)
    for i, line in enumerate(lines):
        x_offset = 110 if i == 0 else 110
        draw.text((x_offset, y + i * line_height), line, font=font, fill=text_color)

    return y + len(lines) * line_height + 10


def draw_big_stat(draw, number, label, y, number_color=NEON_CYAN, source=None):
    """Draw a large statistic with label"""
    # Large number
    font_big = ImageFont.truetype(FONT_BOLD, 180)
    bbox = draw.textbbox((0, 0), number, font=font_big)
    x = (SLIDE_WIDTH - (bbox[2] - bbox[0])) // 2
    draw.text((x, y), number, font=font_big, fill=number_color)

    # Label below
    y += 200
    font_label = ImageFont.truetype(FONT_REGULAR, 36)
    bbox = draw.textbbox((0, 0), label, font=font_label)
    x = (SLIDE_WIDTH - (bbox[2] - bbox[0])) // 2
    draw.text((x, y), label, font=font_label, fill=TEXT_SECONDARY)

    # Source if provided
    if source:
        y += 60
        font_source = ImageFont.truetype(FONT_REGULAR, 24)
        bbox = draw.textbbox((0, 0), source, font=font_source)
        x = (SLIDE_WIDTH - (bbox[2] - bbox[0])) // 2
        draw.text((x, y), source, font=font_source, fill=TEXT_MUTED)

    return y + 40


def draw_comparison_card(draw, title, subtitle, items, x, y, width, bg_color, accent_color, is_highlighted=False):
    """Draw a comparison card with title and bullet points"""
    height = 400
    padding = 30

    # Card background
    if is_highlighted:
        draw.rectangle([x, y, x + width, y + height], fill=bg_color, outline=accent_color, width=2)
    else:
        draw.rectangle([x, y, x + width, y + height], fill=bg_color)

    # Title
    font_title = ImageFont.truetype(FONT_BOLD, 20)
    draw.text((x + padding, y + padding), title.upper(), font=font_title, fill=accent_color)

    # Subtitle
    font_subtitle = ImageFont.truetype(FONT_BOLD, 32)
    draw.text((x + padding, y + padding + 40), subtitle, font=font_subtitle, fill=TEXT_PRIMARY)

    # Items
    font_item = ImageFont.truetype(FONT_REGULAR, 24)
    item_y = y + padding + 100
    for item in items:
        wrapped = textwrap.wrap(item, width=25)
        for line in wrapped:
            draw.text((x + padding, item_y), line, font=font_item, fill=TEXT_SECONDARY)
            item_y += 34
        item_y += 10

    return y + height + 30


def draw_quote_box(draw, quote, y, accent_color=NEON_CYAN):
    """Draw a quote with accent bar"""
    # Accent bar on left
    draw.rectangle([60, y, 66, y + 120], fill=accent_color)

    # Quote text in italic style
    font = ImageFont.truetype(FONT_BOLD, 36)
    lines = textwrap.wrap(quote, width=38)
    for i, line in enumerate(lines):
        draw.text((90, y + i * 50), line, font=font, fill=TEXT_PRIMARY)

    return y + len(lines) * 50 + 40


def draw_cta_item(draw, emoji, text, y):
    """Draw a CTA item with emoji"""
    font = ImageFont.truetype(FONT_REGULAR, 32)
    # Using text emoji placeholder
    draw.text((60, y), emoji, font=font, fill=TEXT_PRIMARY)
    draw.text((120, y), text, font=font, fill=TEXT_SECONDARY)
    return y + 60


def draw_hashtags(draw, hashtags, y):
    """Draw hashtags at bottom"""
    font = ImageFont.truetype(FONT_MONO, 20)
    text = " ".join(hashtags)
    lines = textwrap.wrap(text, width=60)
    for i, line in enumerate(lines):
        draw.text((60, y + i * 30), line, font=font, fill=TEXT_MUTED)
    return y + len(lines) * 30


def draw_swipe_indicator(draw, text="SWIPE →"):
    """Draw swipe indicator at bottom right"""
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), text, font=font, fill=TEXT_MUTED, anchor="ra")


def draw_divider(draw, y, color=TEXT_MUTED, width=960):
    """Draw a horizontal divider line"""
    x_start = (SLIDE_WIDTH - width) // 2
    draw.rectangle([x_start, y, x_start + width, y + 1], fill=color)
    return y + 40


def save_slide(img, post_num, slide_num, post_name):
    """Save slide to appropriate directory"""
    dir_path = os.path.join(OUTPUT_DIR, f"Post{post_num}-{post_name}")
    os.makedirs(dir_path, exist_ok=True)
    file_path = os.path.join(dir_path, f"slide-{slide_num:02d}.png")
    img.save(file_path, "PNG")
    print(f"  Saved: {file_path}")


# === POST 1: The AI Partner Shift ===
def generate_post_1():
    print("Generating Post 1: The AI Partner Shift")
    post_num = 1
    post_name = "AI-Partner-Shift"
    total_slides = 10

    # Slide 1: Hook
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_category_tag(draw, "AI & Machine Learning")
    y = draw_headline(draw, "In 2025, AI was your", 160, TEXT_SECONDARY, font_size=48)
    y = draw_headline(draw, "Assistant.", y + 20, NEON_CYAN, font_size=96)
    y = draw_divider(draw, y + 40)
    y = draw_headline(draw, "In 2026, AI is your", y, TEXT_SECONDARY, font_size=48)
    draw_headline(draw, "Partner.", y + 20, TEXT_PRIMARY, font_size=96)
    # Add supporting text to fill space
    draw_body_text(draw, 'This isn\'t semantics. The shift from "copilot" to\nautonomous collaborator changes everything.', 950, TEXT_SECONDARY, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 1, post_name)

    # Slide 2: The Shift Explained
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 2, total_slides)
    y = draw_headline(draw, "The Shift Is", 120, TEXT_PRIMARY, font_size=64)
    y = draw_headline(draw, "Fundamental.", y + 10, NEON_CYAN, font_size=64)
    y = draw_body_text(draw, "The move from copilot to autonomous collaborator\nchanges how software gets built, deployed, and maintained.", y + 40, TEXT_SECONDARY, font_size=28)
    # Two comparison cards - stacked vertically for better readability
    y += 60
    draw_comparison_card(draw, "COPILOT MODEL", "You lead, AI follows",
                        ["AI waits for instructions", "Responds when asked", "Suggests when prompted"],
                        60, y, 450, BG_CARD_DARK, TEXT_MUTED)
    draw_comparison_card(draw, "PARTNER MODEL", "AI leads alongside you",
                        ["AI anticipates needs", "Acts proactively", "Collaborates as a peer"],
                        570, y, 450, BG_CARD_ACCENT, NEON_CYAN, is_highlighted=True)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 2, post_name)

    # Slide 3: What AI Does Now
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 3, total_slides)
    y = draw_headline(draw, "What AI Partners", 120, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "Actually Do", y + 10, NEON_CYAN, font_size=56)
    y += 60
    y = draw_bullet_point(draw, "AI doesn't just suggest code — it architects solutions", y)
    y += 20
    y = draw_bullet_point(draw, "It doesn't just flag bugs — it predicts where they'll appear", y)
    y += 20
    y = draw_bullet_point(draw, "It doesn't just process data — it makes decisions", y)
    # Add visual element
    y += 80
    draw_quote_box(draw, "The role shifted from assistant to autonomous decision-maker.", y)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 3, post_name)

    # Slide 4: The 40% Stat
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 4, total_slides)
    draw_big_stat(draw, "40%", "of enterprise applications will embed\ntask-specific AI agents by end of 2026", 350, NEON_CYAN, "— Gartner, 2026")
    # Add context below
    draw_body_text(draw, "This represents a fundamental shift in how\nsoftware is designed and deployed.", 950, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 4, post_name)

    # Slide 5: Up from 5%
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 5, total_slides)
    y = draw_headline(draw, "Up from", 150, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "less than 5%", y + 10, NEON_CYAN, font_size=72)
    y = draw_headline(draw, "just a year ago.", y + 10, TEXT_PRIMARY, font_size=56)
    y += 60
    draw_body_text(draw, "This is an 8x growth rate in one year.\n\nThe companies embedding AI agents now will\ndefine the competitive landscape for the next decade.", y, TEXT_SECONDARY, font_size=32)
    # Add emphasis box
    draw_quote_box(draw, "The question isn't whether to adopt AI agents. It's whether you'll lead or follow.", 950)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 5, post_name)

    # Slide 6: Tool vs Team Member
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 6, total_slides)
    y = draw_headline(draw, "Tool vs.", 150, TEXT_SECONDARY, font_size=64)
    y = draw_headline(draw, "Team Member", y + 10, NEON_CYAN, font_size=80)
    y += 60
    draw_body_text(draw, "The companies that treat AI as a tool\nwill be outpaced by those who treat it\nas a team member.", y, TEXT_PRIMARY, font_size=36)
    y += 200
    draw_body_text(draw, "Every solution built today should be\nAI-native by default.", y, TEXT_SECONDARY, font_size=32)
    y += 120
    draw_body_text(draw, "Not as a feature. As the foundation.", y, NEON_CYAN, font_size=36)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 6, post_name)

    # Slide 7: AI-Native by Default
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 7, total_slides)
    y = draw_headline(draw, "AI-Native", 150, NEON_CYAN, font_size=80)
    y = draw_headline(draw, "by Default", y + 10, TEXT_PRIMARY, font_size=80)
    y += 80
    draw_body_text(draw, "This means building with AI at every layer:", y, TEXT_SECONDARY, font_size=30)
    y += 80
    y = draw_bullet_point(draw, "Architecture designed for intelligent automation", y, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Testing that learns and adapts", y, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Deployment that self-optimizes", y, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Monitoring that predicts, not just reacts", y, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 7, post_name)

    # Slide 8: The Key Insight
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 8, total_slides)
    y = 200
    draw_quote_box(draw, "The shift from 'copilot' to autonomous collaborator changes everything about how software gets built.", y, NEON_CYAN)
    y += 250
    draw_body_text(draw, "It's not about replacing developers.\n\nIt's about amplifying their capabilities\nby orders of magnitude.", y, TEXT_SECONDARY, font_size=34)
    y += 220
    draw_body_text(draw, "AI as infrastructure, not feature.", y, NEON_CYAN, font_size=40)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 8, post_name)

    # Slide 9: Recap
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 9, total_slides)
    y = draw_headline(draw, "Key Takeaways", 120, TEXT_PRIMARY, font_size=56)
    y += 60
    y = draw_bullet_point(draw, "2025: AI as assistant | 2026: AI as partner", y, NEON_CYAN, font_size=30)
    y += 25
    y = draw_bullet_point(draw, "40% of enterprise apps will embed AI agents", y, NEON_CYAN, font_size=30)
    y += 25
    y = draw_bullet_point(draw, "8x growth rate from less than 5% last year", y, NEON_CYAN, font_size=30)
    y += 25
    y = draw_bullet_point(draw, "Treat AI as team member, not just tool", y, NEON_CYAN, font_size=30)
    y += 25
    y = draw_bullet_point(draw, "Build AI-native by default", y, NEON_CYAN, font_size=30)
    y += 80
    draw_divider(draw, y)
    draw_body_text(draw, "The companies that get this right now will\ndefine the next decade of software.", y + 60, TEXT_SECONDARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 9, post_name)

    # Slide 10: CTA
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 10, total_slides)
    y = draw_headline(draw, "Let's Talk.", 100, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "How is your organization making the shift from AI-as-tool to AI-as-partner?", y + 40, TEXT_SECONDARY, font_size=42)
    y += 80
    draw_cta_item(draw, "💬", "Comment your biggest takeaway", y)
    y += 70
    draw_cta_item(draw, "🔖", "Save this for your team", y)
    y += 70
    draw_cta_item(draw, "+", "Follow for more AI insights", y)
    y = 1100
    draw_hashtags(draw, ["#AI", "#ArtificialIntelligence", "#SoftwareDevelopment", "#Innovation", "#FutureOfWork"], y)
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), "← SWIPE BACK TO REVIEW", font=font, fill=TEXT_MUTED, anchor="ra")
    save_slide(img, post_num, 10, post_name)


# === POST 2: Document Processing at Scale ===
def generate_post_2():
    print("Generating Post 2: Document Processing at Scale")
    post_num = 2
    post_name = "Document-Processing"
    total_slides = 10

    # Slide 1: Hook
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_category_tag(draw, "AI & Automation")
    y = draw_headline(draw, "Document", 160, TEXT_PRIMARY, font_size=80)
    y = draw_headline(draw, "Processing", y + 10, TEXT_PRIMARY, font_size=80)
    y = draw_headline(draw, "at Scale.", y + 10, NEON_CYAN, font_size=80)
    y += 100
    draw_body_text(draw, "How one AI system turned thousands of manual\ndocuments per day into a competitive advantage.", y, TEXT_SECONDARY, font_size=30)
    # Before/After preview
    y += 140
    draw.rectangle([60, y, 480, y + 180], fill=BG_CARD_DARK)
    draw.text((270, y + 20), "BEFORE", font=ImageFont.truetype(FONT_BOLD, 20), fill=WARNING_RED, anchor="ma")
    draw.text((270, y + 90), "Manual. Slow.", font=ImageFont.truetype(FONT_BOLD, 32), fill=TEXT_SECONDARY, anchor="ma")
    draw.text((270, y + 140), "Error-prone.", font=ImageFont.truetype(FONT_BOLD, 32), fill=TEXT_SECONDARY, anchor="ma")

    draw.rectangle([540, y, 960, y + 180], fill=BG_CARD_ACCENT)
    draw.text((750, y + 20), "AFTER AI", font=ImageFont.truetype(FONT_BOLD, 20), fill=NEON_GREEN, anchor="ma")
    draw.text((750, y + 90), "Automated. Fast.", font=ImageFont.truetype(FONT_BOLD, 32), fill=TEXT_PRIMARY, anchor="ma")
    draw.text((750, y + 140), "99.5% accurate.", font=ImageFont.truetype(FONT_BOLD, 32), fill=TEXT_PRIMARY, anchor="ma")
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 1, post_name)

    # Slide 2: The Problem
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 2, total_slides)
    y = draw_headline(draw, "The Problem", 120, TEXT_PRIMARY, font_size=64)
    y += 60
    draw_body_text(draw, "A Fortune 500 company was manually processing\nthousands of documents every day.", y, TEXT_SECONDARY, font_size=32)
    y += 140
    y = draw_bullet_point(draw, "Errors were climbing", y, WARNING_RED, TEXT_PRIMARY, font_size=34)
    y += 20
    y = draw_bullet_point(draw, "Bottlenecks were constant", y, WARNING_RED, TEXT_PRIMARY, font_size=34)
    y += 20
    y = draw_bullet_point(draw, "People were burning out", y, WARNING_RED, TEXT_PRIMARY, font_size=34)
    y += 20
    y = draw_bullet_point(draw, "Costs were spiraling upward", y, WARNING_RED, TEXT_PRIMARY, font_size=34)
    y += 80
    draw_divider(draw, y)
    draw_body_text(draw, "Something had to change.", y + 40, TEXT_MUTED, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 2, post_name)

    # Slide 3: The Solution
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 3, total_slides)
    y = draw_headline(draw, "The Solution", 120, TEXT_PRIMARY, font_size=64)
    y += 60
    draw_body_text(draw, "An AI document processing system was built\nto handle the workload.", y, TEXT_SECONDARY, font_size=32)
    y += 140
    draw_body_text(draw, "The technology stack:", y, TEXT_MUTED, font_size=26)
    y += 60
    y = draw_bullet_point(draw, "Python + TensorFlow for ML models", y, NEON_CYAN, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "AWS Lambda for serverless processing", y, NEON_CYAN, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Custom ML pipelines for document types", y, NEON_CYAN, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Real-time validation and error handling", y, NEON_CYAN, font_size=30)
    y += 80
    draw_body_text(draw, "But the tech stack wasn't the real breakthrough...", y, TEXT_MUTED, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 3, post_name)

    # Slide 4: 90% Stat
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 4, total_slides)
    draw_big_stat(draw, "90%", "reduction in processing time", 350, NEON_CYAN)
    draw_body_text(draw, "Tasks that took hours now take minutes.\nTeams freed up for higher-value work.", 950, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 4, post_name)

    # Slide 5: 99.5% Stat
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 5, total_slides)
    draw_big_stat(draw, "99.5%", "accuracy rate", 350, NEON_GREEN)
    draw_body_text(draw, "Higher than human accuracy at scale.\nConsistent quality, every single document.", 950, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 5, post_name)

    # Slide 6: 50K+ Stat
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 6, total_slides)
    draw_big_stat(draw, "50K+", "documents processed daily — fully automated", 350, NEON_CYAN)
    draw_body_text(draw, "Scale that would be impossible manually.\nNo additional headcount required.", 950, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 6, post_name)

    # Slide 7: 400% ROI
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 7, total_slides)
    draw_big_stat(draw, "400%", "return on investment within the first year", 350, NEON_GREEN)
    draw_body_text(draw, "The system paid for itself multiple times over.\nAnd continues to deliver value.", 950, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 7, post_name)

    # Slide 8: The Real Breakthrough
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 8, total_slides)
    y = draw_headline(draw, "The Real", 150, TEXT_SECONDARY, font_size=56)
    y = draw_headline(draw, "Breakthrough", y + 10, NEON_CYAN, font_size=72)
    y += 60
    draw_body_text(draw, "The breakthrough wasn't the tech stack.\nIt was asking a better question:", y, TEXT_SECONDARY, font_size=32)
    y += 140
    draw_quote_box(draw, "What if humans only handled the exceptions?", y, NEON_CYAN)
    y += 180
    draw_body_text(draw, "That single reframe turned a cost center\ninto a competitive advantage.", y, TEXT_PRIMARY, font_size=34)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 8, post_name)

    # Slide 9: The Outcome
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 9, total_slides)
    y = draw_headline(draw, "The Outcome", 120, TEXT_PRIMARY, font_size=64)
    y += 60
    draw_body_text(draw, "Hundreds of hours returned to people who can\nnow focus on work that actually requires\nhuman judgment.", y, TEXT_SECONDARY, font_size=32)
    y += 180
    draw_body_text(draw, "Automation isn't about replacing people.", y, TEXT_PRIMARY, font_size=36)
    y += 60
    draw_body_text(draw, "It's about freeing them.", y, NEON_CYAN, font_size=44)
    y += 140
    draw_divider(draw, y)
    draw_body_text(draw, "If your team is still drowning in manual\ndocument work, there's a better way.", y + 40, TEXT_MUTED, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 9, post_name)

    # Slide 10: CTA
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 10, total_slides)
    y = draw_headline(draw, "Your Turn.", 100, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "What manual process in your organization is overdue for automation?", y + 40, TEXT_SECONDARY, font_size=42)
    y += 80
    draw_cta_item(draw, "💬", "Comment your answer below", y)
    y += 70
    draw_cta_item(draw, "🔖", "Save this for your team", y)
    y += 70
    draw_cta_item(draw, "+", "Follow for more AI insights", y)
    y = 1100
    draw_hashtags(draw, ["#AI", "#Automation", "#DocumentProcessing", "#MachineLearning", "#DigitalTransformation"], y)
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), "← SWIPE BACK TO REVIEW", font=font, fill=TEXT_MUTED, anchor="ra")
    save_slide(img, post_num, 10, post_name)


# === POST 3: AI-Native vs AI-Added ===
def generate_post_3():
    print("Generating Post 3: AI-Native vs AI-Added")
    post_num = 3
    post_name = "AI-Native-vs-Added"
    total_slides = 10

    # Slide 1: Hook
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_category_tag(draw, "Software Architecture")
    y = draw_headline(draw, "AI-Native", 160, NEON_CYAN, font_size=90)
    y = draw_headline(draw, "vs.", y + 20, TEXT_MUTED, font_size=64)
    y = draw_headline(draw, "AI-Added", y + 10, TEXT_SECONDARY, font_size=90)
    y += 100
    draw_body_text(draw, "There's a massive difference between\nbuilding with AI and bolting it on after.", y, TEXT_SECONDARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 1, post_name)

    # Slide 2: The Two Approaches
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 2, total_slides)
    y = draw_headline(draw, "Two Approaches", 120, TEXT_PRIMARY, font_size=56)
    y += 60
    y = draw_bullet_point(draw, "Building software and then adding AI features", y, WARNING_AMBER, TEXT_SECONDARY, font_size=32)
    y += 40
    y = draw_bullet_point(draw, "Building software with AI as the foundation", y, NEON_CYAN, TEXT_PRIMARY, font_size=32)
    y += 80
    draw_body_text(draw, "The difference isn't incremental.\nIt's exponential.", y, TEXT_PRIMARY, font_size=40)
    y += 160
    draw_divider(draw, y)
    draw_body_text(draw, "Let's break down what each actually means...", y + 40, TEXT_MUTED, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 2, post_name)

    # Slide 3: AI-Added Defined
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_AMBER)
    draw_slide_number(draw, 3, total_slides)
    y = draw_headline(draw, "AI-Added", 120, WARNING_AMBER, font_size=72)
    y += 60
    draw_body_text(draw, 'You bolt on a chatbot after launch\nand call it "AI-powered."', y, TEXT_SECONDARY, font_size=34)
    y += 140
    draw_body_text(draw, "The reality:", y, TEXT_MUTED, font_size=26)
    y += 50
    y = draw_bullet_point(draw, "AI is an afterthought, not core architecture", y, WARNING_AMBER, TEXT_SECONDARY, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Limited to surface-level features", y, WARNING_AMBER, TEXT_SECONDARY, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Can't leverage AI for infrastructure", y, WARNING_AMBER, TEXT_SECONDARY, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Expensive to retrofit AI capabilities", y, WARNING_AMBER, TEXT_SECONDARY, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 3, post_name)

    # Slide 4: AI-Native Defined
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_CYAN)
    draw_slide_number(draw, 4, total_slides)
    y = draw_headline(draw, "AI-Native", 120, NEON_CYAN, font_size=72)
    y += 60
    draw_body_text(draw, "Every layer — from architecture to testing to\ndeployment to monitoring — is designed around\nintelligent automation from day one.", y, TEXT_PRIMARY, font_size=32)
    y += 180
    draw_body_text(draw, "AI isn't a feature. It's the foundation.", y, NEON_CYAN, font_size=36)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 4, post_name)

    # Slide 5: What AI-Native Means
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 5, total_slides)
    y = draw_headline(draw, "AI-Native Software:", 120, TEXT_PRIMARY, font_size=52)
    y += 60
    y = draw_bullet_point(draw, "Self-heals when infrastructure fails", y, NEON_CYAN, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "Auto-scales based on predicted demand, not reactive thresholds", y, NEON_CYAN, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "Tests itself continuously, not just when developers push code", y, NEON_CYAN, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "Learns from user behavior to optimize its own performance", y, NEON_CYAN, font_size=32)
    y += 80
    draw_body_text(draw, "This is proactive intelligence, not reactive automation.", y, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 5, post_name)

    # Slide 6: Self-Healing
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 6, total_slides)
    y = draw_headline(draw, "Self-Healing", 180, NEON_CYAN, font_size=80)
    y = draw_headline(draw, "Infrastructure", y + 10, TEXT_PRIMARY, font_size=80)
    y += 100
    draw_body_text(draw, "When something breaks, AI-native systems:", y, TEXT_SECONDARY, font_size=30)
    y += 80
    y = draw_bullet_point(draw, "Detect the failure before alerts fire", y, NEON_GREEN, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Diagnose the root cause", y, NEON_GREEN, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Apply the fix automatically", y, NEON_GREEN, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Verify the solution works", y, NEON_GREEN, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 6, post_name)

    # Slide 7: Predictive Scaling
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 7, total_slides)
    y = draw_headline(draw, "Predictive", 180, TEXT_PRIMARY, font_size=80)
    y = draw_headline(draw, "Scaling", y + 10, NEON_CYAN, font_size=80)
    y += 100
    draw_body_text(draw, "Traditional: Scale when CPU hits 80%\n(reactive, often too late)", y, TEXT_SECONDARY, font_size=30)
    y += 120
    draw_body_text(draw, "AI-Native: Scale before traffic spikes\nbased on predicted demand patterns", y, NEON_CYAN, font_size=30)
    y += 140
    draw_body_text(draw, "The difference between scrambling\nand being ready.", y, TEXT_PRIMARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 7, post_name)

    # Slide 8: The Exponential Difference
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 8, total_slides)
    y = draw_headline(draw, "The Difference", 150, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "Isn't Incremental.", y + 10, TEXT_SECONDARY, font_size=56)
    y += 60
    draw_headline(draw, "It's Exponential.", y, NEON_CYAN, font_size=72)
    y += 200
    draw_body_text(draw, "AI-added gives you features.\nAI-native gives you capabilities\nthat compound over time.", y, TEXT_SECONDARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 8, post_name)

    # Slide 9: The Question
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 9, total_slides)
    y = 200
    draw_quote_box(draw, "AI-added is a feature. AI-native is a competitive moat.", y, NEON_CYAN)
    y += 250
    draw_body_text(draw, "One gives you a checkbox.\nThe other gives you an edge that\ncompetitors can't easily replicate.", y, TEXT_SECONDARY, font_size=32)
    y += 200
    draw_body_text(draw, "Which approach is your team taking?", y, TEXT_PRIMARY, font_size=36)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 9, post_name)

    # Slide 10: CTA
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 10, total_slides)
    y = draw_headline(draw, "Your Move.", 100, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "Which approach is your team taking?", y + 40, TEXT_SECONDARY, font_size=44)
    y += 80
    draw_cta_item(draw, "💬", "AI-Added or AI-Native? Comment below", y)
    y += 70
    draw_cta_item(draw, "🔖", "Save for your architecture discussions", y)
    y += 70
    draw_cta_item(draw, "+", "Follow for more tech strategy", y)
    y = 1100
    draw_hashtags(draw, ["#AIEngineering", "#SoftwareArchitecture", "#Innovation", "#AI", "#TechLeadership"], y)
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), "← SWIPE BACK TO REVIEW", font=font, fill=TEXT_MUTED, anchor="ra")
    save_slide(img, post_num, 10, post_name)


# === POST 4: The Real Cost of Not Using AI ===
def generate_post_4():
    print("Generating Post 4: The Real Cost of Not Using AI")
    post_num = 4
    post_name = "Cost-of-Not-Using-AI"
    total_slides = 10

    # Slide 1: Hook
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_RED)
    draw_category_tag(draw, "Tech Strategy", color=WARNING_RED)
    y = draw_headline(draw, "The Real Cost", 160, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "of NOT", y + 10, WARNING_RED, font_size=72)
    y = draw_headline(draw, "Using AI", y + 10, TEXT_PRIMARY, font_size=72)
    y += 120
    draw_body_text(draw, 'Companies ask: "What\'s the ROI of AI?"\n\nThe better question:', y, TEXT_SECONDARY, font_size=30)
    y += 120
    draw_body_text(draw, '"What\'s the cost of NOT using AI?"', y, WARNING_AMBER, font_size=36)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 1, post_name)

    # Slide 2: The Hidden Costs
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_RED)
    draw_slide_number(draw, 2, total_slides)
    y = draw_headline(draw, "The Hidden Costs", 120, TEXT_PRIMARY, font_size=56)
    y += 60
    draw_body_text(draw, "While you're calculating AI ROI,\nyour competitors are pulling ahead:", y, TEXT_SECONDARY, font_size=30)
    y += 120
    y = draw_bullet_point(draw, "They're shipping features 3x faster with AI-assisted development", y, WARNING_RED, TEXT_PRIMARY, font_size=30)
    y += 25
    y = draw_bullet_point(draw, "Manual processes costing you 10x what automation would", y, WARNING_RED, TEXT_PRIMARY, font_size=30)
    y += 25
    y = draw_bullet_point(draw, "Customer churn because your product doesn't personalize", y, WARNING_RED, TEXT_PRIMARY, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 2, post_name)

    # Slide 3: More Costs
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_RED)
    draw_slide_number(draw, 3, total_slides)
    y = draw_headline(draw, "The Costs", 120, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "Keep Adding Up", y + 10, WARNING_RED, font_size=56)
    y += 80
    y = draw_bullet_point(draw, "Security vulnerabilities that AI would catch before deployment", y, WARNING_RED, TEXT_PRIMARY, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "Developer burnout from repetitive tasks AI could handle", y, WARNING_RED, TEXT_PRIMARY, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "Missed opportunities because analysis takes too long", y, WARNING_RED, TEXT_PRIMARY, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "Talent leaving for companies that embrace AI tools", y, WARNING_RED, TEXT_PRIMARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 3, post_name)

    # Slide 4: 84% Stat
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 4, total_slides)
    draw_big_stat(draw, "84%", "of developers are now using\nAI tools daily", 350, NEON_CYAN)
    draw_body_text(draw, "This isn't early adopters anymore.\nThis is the new normal.", 980, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 4, post_name)

    # Slide 5: The Real Question
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_RED)
    draw_slide_number(draw, 5, total_slides)
    y = draw_headline(draw, "If your team", 180, TEXT_PRIMARY, font_size=52)
    y = draw_headline(draw, "isn't among them...", y + 10, TEXT_SECONDARY, font_size=52)
    y += 100
    draw_body_text(draw, "You're not saving money.", y, TEXT_SECONDARY, font_size=36)
    y += 80
    draw_body_text(draw, "You're accumulating debt —", y, WARNING_AMBER, font_size=40)
    y += 60
    draw_body_text(draw, "technical and competitive.", y, WARNING_RED, font_size=40)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 5, post_name)

    # Slide 6: The Scale Metaphor
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 6, total_slides)
    y = 150
    # Draw a simple scale visual
    draw.rectangle([200, y + 200, 400, y + 400], fill=BG_CARD_DARK)
    draw.text((300, y + 250), "Cost of AI", font=ImageFont.truetype(FONT_BOLD, 24), fill=NEON_CYAN, anchor="ma")
    draw.text((300, y + 300), "Adoption", font=ImageFont.truetype(FONT_BOLD, 24), fill=NEON_CYAN, anchor="ma")
    draw.text((300, y + 360), "MONTHS", font=ImageFont.truetype(FONT_BOLD, 20), fill=TEXT_MUTED, anchor="ma")

    draw.rectangle([680, y + 100, 880, y + 500], fill="#331111")
    draw.text((780, y + 200), "Cost of AI", font=ImageFont.truetype(FONT_BOLD, 24), fill=WARNING_RED, anchor="ma")
    draw.text((780, y + 250), "Avoidance", font=ImageFont.truetype(FONT_BOLD, 24), fill=WARNING_RED, anchor="ma")
    draw.text((780, y + 420), "MARKET", font=ImageFont.truetype(FONT_BOLD, 20), fill=TEXT_MUTED, anchor="ma")
    draw.text((780, y + 450), "POSITION", font=ImageFont.truetype(FONT_BOLD, 20), fill=TEXT_MUTED, anchor="ma")

    y += 550
    draw_body_text(draw, "The scales aren't balanced.\nAvoidance costs compound.", y, TEXT_SECONDARY, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 6, post_name)

    # Slide 7: The Punchline
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 7, total_slides)
    y = 200
    draw_body_text(draw, "The cost of AI adoption\nis measured in", y, TEXT_SECONDARY, font_size=40)
    y += 140
    draw_headline(draw, "months.", y, NEON_CYAN, font_size=80)
    y += 150
    draw_body_text(draw, "The cost of AI avoidance\nis measured in", y, TEXT_SECONDARY, font_size=40)
    y += 140
    draw_headline(draw, "market position.", y, WARNING_RED, font_size=80)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 7, post_name)

    # Slide 8: What You Lose
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_RED)
    draw_slide_number(draw, 8, total_slides)
    y = draw_headline(draw, "What You Lose", 120, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "By Waiting", y + 10, WARNING_RED, font_size=56)
    y += 80
    y = draw_bullet_point(draw, "Developer productivity gains (3x faster shipping)", y, WARNING_RED, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Early mover advantage in AI-powered features", y, WARNING_RED, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Talent who want to work with modern tools", y, WARNING_RED, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Time — your competitors are moving now", y, WARNING_RED, font_size=30)
    y += 80
    draw_divider(draw, y)
    draw_body_text(draw, "Every month of delay widens the gap.", y + 40, TEXT_MUTED, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 8, post_name)

    # Slide 9: The Reframe
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 9, total_slides)
    y = 180
    draw_quote_box(draw, "Stop asking 'What's the ROI of AI?'", y, TEXT_MUTED)
    y += 180
    draw_quote_box(draw, "Start asking 'What's the cost of not having it?'", y, NEON_CYAN)
    y += 200
    draw_body_text(draw, "The answer will move you to action\nfaster than any ROI calculation.", y, TEXT_SECONDARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 9, post_name)

    # Slide 10: CTA
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 10, total_slides)
    y = draw_headline(draw, "Time to Act.", 100, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "What's AI avoidance costing your team right now?", y + 40, TEXT_SECONDARY, font_size=40)
    y += 80
    draw_cta_item(draw, "💬", "Share your cost-of-delay story", y)
    y += 70
    draw_cta_item(draw, "🔖", "Save this for stakeholder conversations", y)
    y += 70
    draw_cta_item(draw, "+", "Follow for more strategy insights", y)
    y = 1100
    draw_hashtags(draw, ["#AI", "#ROI", "#TechStrategy", "#CompetitiveAdvantage", "#SoftwareDevelopment"], y)
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), "← SWIPE BACK TO REVIEW", font=font, fill=TEXT_MUTED, anchor="ra")
    save_slide(img, post_num, 10, post_name)


# === POST 5: Predictive Analytics for Logistics ===
def generate_post_5():
    print("Generating Post 5: Predictive Analytics for Logistics")
    post_num = 5
    post_name = "Predictive-Logistics"
    total_slides = 10

    # Slide 1: Hook
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_category_tag(draw, "Predictive Analytics")
    y = draw_headline(draw, "Predictive", 160, NEON_CYAN, font_size=80)
    y = draw_headline(draw, "Analytics", y + 10, TEXT_PRIMARY, font_size=80)
    y = draw_headline(draw, "Changed", y + 10, TEXT_SECONDARY, font_size=64)
    y = draw_headline(draw, "Everything", y + 10, TEXT_PRIMARY, font_size=80)
    y += 80
    draw_body_text(draw, "How AI turned route optimization from\nreactive guesswork into predictive intelligence.", y, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 1, post_name)

    # Slide 2: The Problem
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_RED)
    draw_slide_number(draw, 2, total_slides)
    y = draw_headline(draw, "The Problem", 120, TEXT_PRIMARY, font_size=64)
    y += 60
    draw_body_text(draw, "A logistics company was hemorrhaging money\non inefficient delivery routes.", y, TEXT_SECONDARY, font_size=32)
    y += 140
    draw_body_text(draw, "The traditional approach:", y, TEXT_MUTED, font_size=26)
    y += 60
    y = draw_bullet_point(draw, "Crunch historical data", y, WARNING_RED, TEXT_SECONDARY, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Build static routes", y, WARNING_RED, TEXT_SECONDARY, font_size=30)
    y += 15
    y = draw_bullet_point(draw, "Hope for the best", y, WARNING_RED, TEXT_SECONDARY, font_size=30)
    y += 80
    draw_body_text(draw, 'The "hope for the best" part was the problem.', y, TEXT_MUTED, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 2, post_name)

    # Slide 3: The AI Approach
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 3, total_slides)
    y = draw_headline(draw, "The AI", 120, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "Approach", y + 10, NEON_CYAN, font_size=72)
    y += 60
    draw_body_text(draw, "A PyTorch model trained on:", y, TEXT_SECONDARY, font_size=30)
    y += 70
    y = draw_bullet_point(draw, "Real-time traffic patterns", y, NEON_CYAN, font_size=32)
    y += 25
    y = draw_bullet_point(draw, "Weather data and forecasts", y, NEON_CYAN, font_size=32)
    y += 25
    y = draw_bullet_point(draw, "Historical delivery patterns", y, NEON_CYAN, font_size=32)
    y += 25
    y = draw_bullet_point(draw, "Delivery constraints and windows", y, NEON_CYAN, font_size=32)
    y += 80
    draw_body_text(draw, "Not just analyzing the past —\npredicting the future.", y, TEXT_PRIMARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 3, post_name)

    # Slide 4: 30% Cost Reduction
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 4, total_slides)
    draw_big_stat(draw, "30%", "cost reduction", 350, NEON_GREEN)
    draw_body_text(draw, "Fuel, labor, and vehicle wear —\nall significantly reduced.", 980, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 4, post_name)

    # Slide 5: 25% Faster
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 5, total_slides)
    draw_big_stat(draw, "25%", "faster deliveries", 350, NEON_CYAN)
    draw_body_text(draw, "Customers happier. Drivers less stressed.\nMore deliveries per day.", 980, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 5, post_name)

    # Slide 6: 1M+ Routes
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 6, total_slides)
    draw_big_stat(draw, "1M+", "routes optimized daily", 350, NEON_CYAN)
    draw_body_text(draw, "Scale that would be impossible\nwith manual route planning.", 980, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 6, post_name)

    # Slide 7: The Key Difference
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 7, total_slides)
    y = draw_headline(draw, "The Key", 150, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "Difference", y + 10, NEON_CYAN, font_size=72)
    y += 80
    draw_body_text(draw, "The model doesn't just react to conditions.", y, TEXT_SECONDARY, font_size=34)
    y += 80
    draw_body_text(draw, "It predicts them.", y, NEON_CYAN, font_size=48)
    y += 120
    draw_body_text(draw, "Routes adjust before traffic jams form,\nbefore weather hits,\nbefore delays cascade.", y, TEXT_PRIMARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 7, post_name)

    # Slide 8: Analytics vs Intelligence
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 8, total_slides)
    y = 180
    draw_quote_box(draw, "This is the difference between analytics and predictive intelligence.", y, NEON_CYAN)
    y += 200
    draw_body_text(draw, "Analytics tells you what happened.\n\nPredictive intelligence tells you\nwhat's about to happen.", y, TEXT_SECONDARY, font_size=34)
    y += 220
    draw_body_text(draw, "One is a rearview mirror.\nThe other is a radar.", y, TEXT_PRIMARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 8, post_name)

    # Slide 9: The Question
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 9, total_slides)
    y = draw_headline(draw, "The Question", 150, TEXT_PRIMARY, font_size=56)
    y += 80
    draw_body_text(draw, "What process in your business is still\nrunning on historical data...", y, TEXT_SECONDARY, font_size=36)
    y += 140
    draw_body_text(draw, "...when it could be running on", y, TEXT_PRIMARY, font_size=36)
    y += 60
    draw_headline(draw, "foresight?", y, NEON_CYAN, font_size=80)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 9, post_name)

    # Slide 10: CTA
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 10, total_slides)
    y = draw_headline(draw, "Your Turn.", 100, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "Where could predictive analytics transform your operations?", y + 40, TEXT_SECONDARY, font_size=38)
    y += 80
    draw_cta_item(draw, "💬", "Share your prediction opportunity", y)
    y += 70
    draw_cta_item(draw, "🔖", "Save for your analytics roadmap", y)
    y += 70
    draw_cta_item(draw, "+", "Follow for more AI insights", y)
    y = 1100
    draw_hashtags(draw, ["#PredictiveAnalytics", "#AI", "#Logistics", "#MachineLearning", "#Optimization"], y)
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), "← SWIPE BACK TO REVIEW", font=font, fill=TEXT_MUTED, anchor="ra")
    save_slide(img, post_num, 10, post_name)


# === POST 6: Agentic AI Is Here ===
def generate_post_6():
    print("Generating Post 6: Agentic AI Is Here")
    post_num = 6
    post_name = "Agentic-AI"
    total_slides = 10

    # Slide 1: Hook
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_category_tag(draw, "Future of AI", color=NEON_PURPLE)
    y = draw_headline(draw, "Agentic AI", 180, NEON_PURPLE, font_size=90)
    y = draw_headline(draw, "Is Here.", y + 20, TEXT_PRIMARY, font_size=90)
    y += 120
    draw_body_text(draw, "The biggest AI shift in 2026 isn't better models.\nIt's AI that acts independently.", y, TEXT_SECONDARY, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 1, post_name)

    # Slide 2: What's Different
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 2, total_slides)
    y = draw_headline(draw, "What's Different", 120, TEXT_PRIMARY, font_size=56)
    y += 60
    draw_body_text(draw, "AI systems that don't just respond to prompts —", y, TEXT_SECONDARY, font_size=32)
    y += 60
    draw_body_text(draw, "They independently plan, execute, and\noptimize complex workflows.", y, TEXT_PRIMARY, font_size=36)
    y += 160
    draw_body_text(draw, "From reactive assistant to proactive agent.", y, NEON_PURPLE, font_size=32)
    y += 100
    draw_divider(draw, y)
    draw_body_text(draw, "Let's see what this looks like in practice...", y + 40, TEXT_MUTED, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 2, post_name)

    # Slide 3: Example 1
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 3, total_slides)
    y = draw_headline(draw, "Example 1:", 120, TEXT_MUTED, font_size=36)
    y = draw_headline(draw, "Production", y + 20, TEXT_PRIMARY, font_size=64)
    y = draw_headline(draw, "Self-Healing", y + 10, NEON_PURPLE, font_size=64)
    y += 80
    draw_body_text(draw, "An AI agent that:", y, TEXT_SECONDARY, font_size=30)
    y += 60
    y = draw_bullet_point(draw, "Monitors production systems", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Identifies a performance bottleneck", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Writes and tests a fix", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Deploys it — all while you sleep", y, NEON_PURPLE, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 3, post_name)

    # Slide 4: Example 2
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 4, total_slides)
    y = draw_headline(draw, "Example 2:", 120, TEXT_MUTED, font_size=36)
    y = draw_headline(draw, "Product", y + 20, TEXT_PRIMARY, font_size=64)
    y = draw_headline(draw, "Intelligence", y + 10, NEON_PURPLE, font_size=64)
    y += 80
    draw_body_text(draw, "An agent that:", y, TEXT_SECONDARY, font_size=30)
    y += 60
    y = draw_bullet_point(draw, "Analyzes customer feedback", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Identifies feature requests", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Prioritizes by business impact", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Drafts product specs", y, NEON_PURPLE, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 4, post_name)

    # Slide 5: Example 3
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 5, total_slides)
    y = draw_headline(draw, "Example 3:", 120, TEXT_MUTED, font_size=36)
    y = draw_headline(draw, "CI/CD", y + 20, TEXT_PRIMARY, font_size=64)
    y = draw_headline(draw, "Guardian", y + 10, NEON_PURPLE, font_size=64)
    y += 80
    draw_body_text(draw, "An agent that:", y, TEXT_SECONDARY, font_size=30)
    y += 60
    y = draw_bullet_point(draw, "Manages CI/CD pipelines", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Detects bad deployments", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Rolls back before alerts fire", y, NEON_PURPLE, font_size=30)
    y += 20
    y = draw_bullet_point(draw, "Learns from each incident", y, NEON_PURPLE, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 5, post_name)

    # Slide 6: Not Science Fiction
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 6, total_slides)
    y = draw_headline(draw, "This Isn't", 180, TEXT_SECONDARY, font_size=56)
    y = draw_headline(draw, "Science Fiction.", y + 10, TEXT_PRIMARY, font_size=72)
    y += 120
    draw_body_text(draw, "These agents exist today.\nThey're deployed in production.\nThey're delivering results.", y, TEXT_SECONDARY, font_size=34)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 6, post_name)

    # Slide 7: The 40% Stat
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 7, total_slides)
    draw_big_stat(draw, "40%", "of enterprise apps will embed\nagentic AI by end of 2026", 350, NEON_PURPLE, "— Gartner")
    draw_body_text(draw, "The transition is happening now.", 980, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 7, post_name)

    # Slide 8: Lead or Follow
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 8, total_slides)
    y = 200
    draw_quote_box(draw, "The question isn't whether to adopt agentic AI.", y, TEXT_MUTED)
    y += 180
    draw_quote_box(draw, "It's whether you'll lead or follow.", y, NEON_PURPLE)
    y += 200
    draw_body_text(draw, "Early adopters are already seeing:\n• Reduced operational overhead\n• Faster incident response\n• Compounding efficiency gains", y, TEXT_SECONDARY, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 8, post_name)

    # Slide 9: The Agent Loop
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 9, total_slides)
    y = draw_headline(draw, "The Agent Loop", 120, TEXT_PRIMARY, font_size=56)
    y += 60
    # Draw circular workflow
    steps = ["Monitor", "Detect", "Diagnose", "Fix", "Verify", "Learn"]
    for i, step in enumerate(steps):
        num = i + 1
        step_y = y + (i * 70)
        draw.text((60, step_y), f"{num}.", font=ImageFont.truetype(FONT_BOLD, 36), fill=NEON_PURPLE)
        draw.text((120, step_y), step, font=ImageFont.truetype(FONT_BOLD, 36), fill=TEXT_PRIMARY)
    y += 500
    draw_body_text(draw, "Continuous improvement without human intervention.", y, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 9, post_name)

    # Slide 10: CTA
    img, draw = create_slide()
    draw_accent_bar(draw, color=NEON_PURPLE)
    draw_slide_number(draw, 10, total_slides)
    y = draw_headline(draw, "Your Move.", 100, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "How is your team experimenting with AI agents?", y + 40, TEXT_SECONDARY, font_size=42)
    y += 80
    draw_cta_item(draw, "💬", "Share your agent experiments", y)
    y += 70
    draw_cta_item(draw, "🔖", "Save for your AI roadmap", y)
    y += 70
    draw_cta_item(draw, "+", "Follow for more on agentic AI", y)
    y = 1100
    draw_hashtags(draw, ["#AgenticAI", "#EnterpriseAI", "#Automation", "#FutureOfWork", "#Technology"], y)
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), "← SWIPE BACK TO REVIEW", font=font, fill=TEXT_MUTED, anchor="ra")
    save_slide(img, post_num, 10, post_name)


# === POST 7: Why Most AI Projects Fail ===
def generate_post_7():
    print("Generating Post 7: Why Most AI Projects Fail")
    post_num = 7
    post_name = "Why-AI-Projects-Fail"
    total_slides = 10

    # Slide 1: Hook
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_AMBER)
    draw_category_tag(draw, "AI Strategy", color=WARNING_AMBER)
    y = draw_headline(draw, "Why Most", 160, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "AI Projects", y + 10, WARNING_AMBER, font_size=72)
    y = draw_headline(draw, "Fail", y + 10, TEXT_PRIMARY, font_size=96)
    y += 120
    draw_body_text(draw, "80% of AI projects fail to reach production.\nNot because the technology doesn't work.", y, TEXT_SECONDARY, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 1, post_name)

    # Slide 2: The 80% Stat
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_RED)
    draw_slide_number(draw, 2, total_slides)
    draw_big_stat(draw, "80%", "of AI projects fail to reach production", 350, WARNING_RED)
    draw_body_text(draw, "This isn't a technology problem.\nIt's an approach problem.", 980, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 2, post_name)

    # Slide 3: The Real Reason
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_AMBER)
    draw_slide_number(draw, 3, total_slides)
    y = draw_headline(draw, "The Real Reason", 120, TEXT_PRIMARY, font_size=56)
    y += 60
    draw_body_text(draw, "Organizations make the same three mistakes:", y, TEXT_SECONDARY, font_size=32)
    y += 100
    # Draw three numbered cards
    draw.rectangle([60, y, 1020, y + 240], fill=BG_CARD_DARK)
    draw.text((100, y + 30), "1", font=ImageFont.truetype(FONT_BOLD, 48), fill=WARNING_AMBER)
    draw.text((170, y + 30), "Starting with technology,", font=ImageFont.truetype(FONT_BOLD, 36), fill=TEXT_PRIMARY)
    draw.text((170, y + 80), "not problems", font=ImageFont.truetype(FONT_BOLD, 36), fill=TEXT_PRIMARY)
    draw.text((170, y + 140), '"We need AI" is not a strategy.', font=ImageFont.truetype(FONT_REGULAR, 26), fill=TEXT_SECONDARY)
    draw.text((170, y + 180), '"We need to reduce processing time by 80%" is.', font=ImageFont.truetype(FONT_REGULAR, 26), fill=TEXT_SECONDARY)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 3, post_name)

    # Slide 4: Mistake 2
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_AMBER)
    draw_slide_number(draw, 4, total_slides)
    y = 200
    draw.rectangle([60, y, 1020, y + 300], fill=BG_CARD_DARK)
    draw.text((100, y + 30), "2", font=ImageFont.truetype(FONT_BOLD, 48), fill=WARNING_AMBER)
    draw.text((170, y + 30), "Underestimating", font=ImageFont.truetype(FONT_BOLD, 40), fill=TEXT_PRIMARY)
    draw.text((170, y + 85), "data quality", font=ImageFont.truetype(FONT_BOLD, 40), fill=TEXT_PRIMARY)
    draw.text((170, y + 160), "The most sophisticated model produces", font=ImageFont.truetype(FONT_REGULAR, 28), fill=TEXT_SECONDARY)
    draw.text((170, y + 200), "garbage if fed garbage.", font=ImageFont.truetype(FONT_REGULAR, 28), fill=TEXT_SECONDARY)
    draw.text((170, y + 250), "Data preparation isn't the boring prerequisite — ", font=ImageFont.truetype(FONT_BOLD, 26), fill=WARNING_AMBER)
    y += 360
    draw_body_text(draw, "It IS the project.", y, WARNING_AMBER, font_size=44)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 4, post_name)

    # Slide 5: Mistake 3
    img, draw = create_slide()
    draw_accent_bar(draw, color=WARNING_AMBER)
    draw_slide_number(draw, 5, total_slides)
    y = 200
    draw.rectangle([60, y, 1020, y + 300], fill=BG_CARD_DARK)
    draw.text((100, y + 30), "3", font=ImageFont.truetype(FONT_BOLD, 48), fill=WARNING_AMBER)
    draw.text((170, y + 30), "Building in", font=ImageFont.truetype(FONT_BOLD, 40), fill=TEXT_PRIMARY)
    draw.text((170, y + 85), "isolation", font=ImageFont.truetype(FONT_BOLD, 40), fill=TEXT_PRIMARY)
    draw.text((170, y + 160), "AI solutions built by a separate", font=ImageFont.truetype(FONT_REGULAR, 28), fill=TEXT_SECONDARY)
    draw.text((170, y + 200), '"innovation team" rarely survive', font=ImageFont.truetype(FONT_REGULAR, 28), fill=TEXT_SECONDARY)
    draw.text((170, y + 240), "contact with real operations.", font=ImageFont.truetype(FONT_REGULAR, 28), fill=TEXT_SECONDARY)
    y += 360
    draw_body_text(draw, "Integration from day one is non-negotiable.", y, WARNING_AMBER, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 5, post_name)

    # Slide 6: The Right Approach
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 6, total_slides)
    y = draw_headline(draw, "The Right", 120, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "Approach", y + 10, NEON_CYAN, font_size=72)
    y += 60
    draw_body_text(draw, "Every AI discovery phase should avoid\nthese traps by starting with:", y, TEXT_SECONDARY, font_size=30)
    y += 120
    y = draw_bullet_point(draw, "The business problem, not the technology", y, NEON_CYAN, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "A data quality audit before model selection", y, NEON_CYAN, font_size=32)
    y += 30
    y = draw_bullet_point(draw, "Integration planning from the first line of code", y, NEON_CYAN, font_size=32)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 6, post_name)

    # Slide 7: The Key Question
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 7, total_slides)
    y = draw_headline(draw, "The Key", 150, TEXT_PRIMARY, font_size=56)
    y = draw_headline(draw, "Question", y + 10, NEON_CYAN, font_size=72)
    y += 80
    draw_quote_box(draw, "What decision does this system need to make, and what happens if it gets it wrong?", y, NEON_CYAN)
    y += 220
    draw_body_text(draw, "That single question shapes everything:\n• Model selection\n• Training data strategy\n• Confidence thresholds\n• Human-in-the-loop design", y, TEXT_SECONDARY, font_size=28)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 7, post_name)

    # Slide 8: Build Backwards
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 8, total_slides)
    y = 200
    draw_quote_box(draw, "AI that ships is AI that's built backwards from the business outcome...", y, TEXT_SECONDARY)
    y += 180
    draw_quote_box(draw, "...not forward from the algorithm.", y, NEON_CYAN)
    y += 200
    draw_body_text(draw, "Start with what success looks like.\nWork backwards from there.", y, TEXT_PRIMARY, font_size=34)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 8, post_name)

    # Slide 9: AI Works
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 9, total_slides)
    y = draw_headline(draw, "AI Works.", 200, NEON_CYAN, font_size=90)
    y += 100
    draw_body_text(draw, "But only when the approach is as\nintelligent as the technology.", y, TEXT_PRIMARY, font_size=40)
    y += 180
    draw_body_text(draw, "The 20% of AI projects that succeed\ndon't have better algorithms.\n\nThey have better problem framing.", y, TEXT_SECONDARY, font_size=30)
    draw_swipe_indicator(draw)
    save_slide(img, post_num, 9, post_name)

    # Slide 10: CTA
    img, draw = create_slide()
    draw_accent_bar(draw)
    draw_slide_number(draw, 10, total_slides)
    y = draw_headline(draw, "Your Turn.", 100, TEXT_PRIMARY, font_size=72)
    y = draw_headline(draw, "What's the biggest lesson you've learned from an AI project?", y + 40, TEXT_SECONDARY, font_size=40)
    y += 80
    draw_cta_item(draw, "💬", "Share your AI project lesson", y)
    y += 70
    draw_cta_item(draw, "🔖", "Save for your project kickoffs", y)
    y += 70
    draw_cta_item(draw, "+", "Follow for more AI strategy", y)
    y = 1100
    draw_hashtags(draw, ["#AI", "#MachineLearning", "#DigitalTransformation", "#ProjectManagement", "#TechStrategy"], y)
    font = ImageFont.truetype(FONT_REGULAR, 20)
    draw.text((SLIDE_WIDTH - 60, SLIDE_HEIGHT - 60), "← SWIPE BACK TO REVIEW", font=font, fill=TEXT_MUTED, anchor="ra")
    save_slide(img, post_num, 10, post_name)


# === MAIN ===
if __name__ == "__main__":
    print("=" * 60)
    print("LinkedIn Carousel Generator")
    print("Generating slides for Posts 1-7")
    print("=" * 60)

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Generate all posts
    generate_post_1()
    generate_post_2()
    generate_post_3()
    generate_post_4()
    generate_post_5()
    generate_post_6()
    generate_post_7()

    print("=" * 60)
    print("Generation complete!")
    print(f"Output directory: {OUTPUT_DIR}")
    print("=" * 60)
