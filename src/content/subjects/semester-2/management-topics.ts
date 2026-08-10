import type { Topic } from "../types";

export const managementTopics: Record<string, Topic[]> = {
  "intro-management": [
    { title: "Fundamentals of Management", subTopics: ["Definition of management", "Nature and scope of management", "Management as an art and science", "Role of managers", "Effectiveness vs efficiency"] },
    { title: "Functions of Management", subTopics: ["Planning function", "Organizing function", "Leading function", "Controlling function", "Coordinating function"] },
    { title: "Management Levels and Skills", subTopics: ["Top-level management", "Middle-level management", "First-line management", "Technical, human, and conceptual skills", "Managerial roles (Mintzberg)"] },
    { title: "Evolution of Management Thought", subTopics: ["Classical approach (Taylor, Fayol, Weber)", "Behavioral approach (Hawthorne studies)", "Quantitative approach", "Systems approach", "Contingency approach"] },
  ],
  "planning-decision-making": [
    { title: "Planning Process", subTopics: ["Nature and importance of planning", "Types of plans (strategic, tactical, operational)", "Steps in planning process", "MBO (Management by Objectives)", "Planning tools and techniques"] },
    { title: "Strategic Planning", subTopics: ["Mission, vision, and values", "SWOT analysis", "PESTEL analysis", "Porter's five forces", "Competitive advantage"] },
    { title: "Decision Making", subTopics: ["Rational decision-making model", "Bounded rationality", "Types of decisions (programmed vs non-programmed)", "Decision-making conditions (certainty, risk, uncertainty)", "Group decision-making techniques"] },
    { title: "Forecasting and Policies", subTopics: ["Qualitative forecasting methods", "Quantitative forecasting methods", "Types of policies", "Procedures and rules", "Budgeting as planning tool"] },
  ],
  "organizing": [
    { title: "Organizational Structure", subTopics: ["Functional structure", "Divisional structure", "Matrix structure", "Flat vs tall structures", "Virtual organizations"] },
    { title: "Authority and Delegation", subTopics: ["Authority and responsibility", "Centralization vs decentralization", "Delegation of authority", "Span of control", "Line and staff relationships"] },
    { title: "Departmentalization", subTopics: ["Functional departmentalization", "Product departmentalization", "Geographic departmentalization", "Customer departmentalization", "Process departmentalization"] },
    { title: "Organizational Culture", subTopics: ["Definition and elements of culture", "Types of organizational culture", "Strong vs weak cultures", "Creating and maintaining culture", "Impact of culture on performance"] },
  ],
  "leading": [
    { title: "Leadership", subTopics: ["Leadership vs management", "Trait theory of leadership", "Behavioral theories (Ohio State, Michigan)", "Contingency theories (Fiedler, Hersey-Blanchard)", "Transformational vs transactional leadership"] },
    { title: "Motivation Theories", subTopics: ["Maslow's hierarchy of needs", "Herzberg's two-factor theory", "McClelland's theory of needs", "Vroom's expectancy theory", "Equity theory"] },
    { title: "Communication", subTopics: ["Communication process", "Formal vs informal communication", "Communication networks", "Barriers to effective communication", "Active listening techniques"] },
    { title: "Team Building and Conflict", subTopics: ["Stages of team development", "Characteristics of effective teams", "Conflict sources and types", "Conflict resolution strategies", "Negotiation techniques"] },
  ],
};
