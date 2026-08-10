import type { Topic } from "../types";

export const uxUiTopics: Record<string, Topic[]> = {
  "introduction": [
    { title: "UX Design Fundamentals", subTopics: ["Definition of User Experience (UX)", "Importance of UX in product development", "UX vs UI: Key differences", "UX design principles", "UX maturity model"] },
    { title: "UI Design Fundamentals", subTopics: ["Definition of User Interface (UI)", "Types of user interfaces (GUI, VUI, CLI)", "Visual design principles", "UI design patterns", "Industry relevance and career paths"] },
    { title: "Design Thinking Process", subTopics: ["Empathize phase", "Define phase", "Ideate phase", "Prototype phase", "Test phase"] },
  ],
  "user-interaction-design": [
    { title: "Interaction Principles", subTopics: ["Affordances and signifiers", "Feedback and response time", "Consistency and standards", "Error prevention and recovery", "User control and freedom"] },
    { title: "User Goals and Mental Models", subTopics: ["Understanding user goals", "Task analysis", "Mental models vs conceptual models", "Interaction paradigms", "Cognitive load theory"] },
    { title: "Task Flows and Navigation", subTopics: ["User flow diagrams", "Task flow mapping", "Information architecture", "Navigation patterns", "Wayfinding principles"] },
  ],
  "user-interface-design": [
    { title: "Visual Design Principles", subTopics: ["Balance and symmetry", "Contrast and emphasis", "Repetition and pattern", "Proximity and grouping", "Alignment and grid systems"] },
    { title: "Typography", subTopics: ["Typeface vs font", "Font pairing", "Hierarchy and scale", "Readability and legibility", "Responsive typography"] },
    { title: "Color Theory", subTopics: ["Color wheel and relationships", "Color psychology", "Color harmony rules", "Accessibility and contrast ratios", "Creating color palettes"] },
    { title: "Visual Hierarchy", subTopics: ["Size and scale", "Color and contrast", "White space usage", "F-pattern and Z-pattern", "Gestalt principles"] },
  ],
  "ui-components": [
    { title: "Basic Components", subTopics: ["Buttons and CTAs", "Input fields and forms", "Checkboxes and radio buttons", "Dropdowns and selects", "Toggle switches"] },
    { title: "Navigation Components", subTopics: ["Navigation bars", "Breadcrumbs", "Tabs and pills", "Pagination", "Sidebars and drawers"] },
    { title: "Content Components", subTopics: ["Cards and tiles", "Lists and tables", "Accordions and collapsibles", "Tooltips and popovers", "Modals and dialogs"] },
    { title: "Component Libraries", subTopics: ["Design systems", "Material Design", "Apple Human Interface Guidelines", "Building custom component libraries", "Component documentation"] },
  ],
  "ui-design-considerations": [
    { title: "Accessibility", subTopics: ["WCAG guidelines", "Screen reader compatibility", "Keyboard navigation", "Color blindness considerations", "Accessible forms and inputs"] },
    { title: "Responsive Design", subTopics: ["Mobile-first approach", "Breakpoints and media queries", "Flexible grids and layouts", "Responsive images", "Touch targets and gestures"] },
    { title: "Cross-Platform Design", subTopics: ["Web vs mobile vs desktop", "Platform-specific patterns", "Adaptive vs responsive design", "Progressive enhancement", "Design tokens"] },
    { title: "Performance and Design Systems", subTopics: ["Performance budgets", "Design system architecture", "Atomic design methodology", "Version control for design", "Design-to-development handoff"] },
  ],
  "wireframing-prototyping": [
    { title: "Wireframing", subTopics: ["Low-fidelity wireframes", "Mid-fidelity wireframes", "High-fidelity wireframes", "Wireframing tools (Figma, Sketch, Adobe XD)", "Annotation and documentation"] },
    { title: "Prototyping", subTopics: ["Low-fidelity prototypes", "High-fidelity prototypes", "Interactive prototypes", "Click-through prototypes", "Animated prototypes"] },
    { title: "User Testing of Prototypes", subTopics: ["Usability testing methods", "A/B testing prototypes", "Gathering feedback", "Iterating on designs", "Prototype fidelity selection"] },
  ],
  "design-evaluations": [
    { title: "Usability Testing", subTopics: ["Planning usability tests", "Moderated vs unmoderated testing", "Think-aloud protocol", "Task-based testing", "Analyzing usability test results"] },
    { title: "Heuristic Evaluation", subTopics: ["Nielsen's 10 heuristics", "Severity ratings", "Expert review process", "Heuristic evaluation vs user testing", "Reporting findings"] },
    { title: "Analytics and Iteration", subTopics: ["Quantitative vs qualitative data", "Heatmaps and click tracking", "Conversion rate optimization", "A/B testing", "Iterative design improvement"] },
  ],
  "advanced-techniques-vui-nlp": [
    { title: "Voice User Interfaces (VUI)", subTopics: ["VUI design principles", "Voice assistants and smart speakers", "Conversational design patterns", "Speech recognition basics", "VUI best practices"] },
    { title: "NLP-Based UI", subTopics: ["Natural language processing basics", "Chatbot design", "Intent recognition", "Entity extraction", "Conversational UI patterns"] },
    { title: "Emerging Interaction Patterns", subTopics: ["Gesture-based interfaces", "AR/VR interfaces", "Haptic feedback", "Multimodal interfaces", "Future of interaction design"] },
  ],
};
