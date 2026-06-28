const SKILLS = [
  {
    id: "react",
    name: "React",
    tag: "Frontend Library",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/512px-React-icon.svg.png",
    color: "#61dafb",
  },
  {
    id: "javascript",
    name: "JavaScript",
    tag: "Programming Language",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/512px-Unofficial_JavaScript_logo_2.svg.png",
    color: "#f7df1e",
  },
  {
    id: "htmlcss",
    name: "HTML & CSS",
    tag: "Web Fundamentals",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png",
    color: "#e34c26",
  },
  {
    id: "python",
    name: "Python",
    tag: "Programming Language",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/512px-Python-logo-notext.svg.png",
    color: "#3776ab",
  },
  {
    id: "uiux",
    name: "UI/UX Design",
    tag: "Product Design",
    image: "https://cdn.dribbble.com/userupload/16012745/file/original-e6e34e5c0a6a0e2e8a7afae6b49d76c0.png",
    color: "#a855f7",
  },
  {
    id: "photography",
    name: "Photography",
    tag: "Visual Arts",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
    color: "#f59e0b",
  },
  {
    id: "datascience",
    name: "Data Science",
    tag: "Analytics & ML",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&q=80",
    color: "#10b981",
  },
  {
    id: "nodejs",
    name: "Node.js",
    tag: "Backend Runtime",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/512px-Node.js_logo.svg.png",
    color: "#68a063",
  },
];

const QUESTIONS = {
  react: [
    { question: "What hook manages local component state in React?", options: ["useEffect", "useState", "useRef", "useContext"], correct: 1 },
    { question: "Which hook runs side effects after render?", options: ["useState", "useMemo", "useCallback", "useEffect"], correct: 3 },
    { question: "What does JSX stand for?", options: ["Java Syntax Extension", "JavaScript XML", "JSON XML", "JavaScript Extra"], correct: 1 },
    { question: "Which prop passes children into a React component?", options: ["data", "props", "children", "content"], correct: 2 },
    { question: "What does the `key` prop help React do?", options: ["Style elements", "Pass data down", "Efficiently re-render lists", "Handle events"], correct: 2 },
  ],
  javascript: [
    { question: "Which keyword declares a block-scoped variable?", options: ["var", "let", "const", "def"], correct: 1 },
    { question: "What does `===` check in JavaScript?", options: ["Value only", "Type only", "Reference", "Value and type"], correct: 3 },
    { question: "What is a Promise in JavaScript?", options: ["A loop", "A CSS property", "An async operation result", "A data type"], correct: 2 },
    { question: "Which method adds an item to the end of an array?", options: ["pop()", "shift()", "push()", "splice()"], correct: 2 },
    { question: "What does `typeof null` return?", options: ['"null"', '"undefined"', '"boolean"', '"object"'], correct: 3 },
  ],
  htmlcss: [
    { question: "Which tag defines the root of an HTML page?", options: ["<body>", "<head>", "<main>", "<html>"], correct: 3 },
    { question: "Which CSS property controls spacing inside an element?", options: ["margin", "border", "padding", "gap"], correct: 2 },
    { question: "What does `display: flex` do?", options: ["Hides the element", "Adds animation", "Centers text", "Creates a flex container"], correct: 3 },
    { question: "Which HTML attribute links an external stylesheet?", options: ["src", "rel", "link", "href"], correct: 3 },
    { question: "Which CSS unit is relative to viewport width?", options: ["em", "px", "rem", "vw"], correct: 3 },
  ],
  python: [
    { question: "Which keyword defines a function in Python?", options: ["func", "function", "fn", "def"], correct: 3 },
    { question: "What is a Python list comprehension?", options: ["A loop decorator", "A class method", "A data import", "A concise way to create lists"], correct: 3 },
    { question: "Which method removes whitespace from string ends?", options: [".trim()", ".clean()", ".remove()", ".strip()"], correct: 3 },
    { question: "What does `len()` return?", options: ["Last element", "First element", "Data type", "Number of items"], correct: 3 },
    { question: "How do you define a child class in Python?", options: ["class Child extends Parent", "class Child: Parent", "inherit(Parent)", "class Child(Parent)"], correct: 3 },
  ],
  uiux: [
    { question: "What does UX stand for?", options: ["Uniform Exchange", "UI Experience", "User Extension", "User Experience"], correct: 3 },
    { question: "What is a wireframe?", options: ["A high-fidelity mockup", "A CSS grid", "A color palette", "A low-fidelity layout sketch"], correct: 3 },
    { question: "What is contrast used for in design?", options: ["Decoration", "Animation timing", "Grid spacing", "Visual hierarchy and readability"], correct: 3 },
    { question: "What is a design system?", options: ["A software framework", "A version control tool", "A project timeline", "A reusable component library"], correct: 3 },
    { question: "What does A/B testing compare?", options: ["Two codebases", "Two user accounts", "Two databases", "Two design variants"], correct: 3 },
  ],
  photography: [
    { question: "What does ISO control in photography?", options: ["Lens focus", "Shutter speed", "Color balance", "Camera sensor sensitivity"], correct: 3 },
    { question: "What is the rule of thirds?", options: ["A lighting technique", "A color theory", "An exposure rule", "A composition guideline"], correct: 3 },
    { question: "Which aperture lets in more light?", options: ["f/22", "f/11", "f/8", "f/1.8"], correct: 3 },
    { question: "What is the golden hour?", options: ["Best time for studio shots", "Midday sunlight", "Artificial lighting time", "Light just after sunrise or before sunset"], correct: 3 },
    { question: "What does saving in RAW format preserve?", options: ["Smaller file size", "Compressed JPEG", "Edited color grading", "Unprocessed image data"], correct: 3 },
  ],
  datascience: [
    { question: "What does CSV stand for?", options: ["Coded System Values", "Computer Science Variable", "Calculated Sum Values", "Comma-Separated Values"], correct: 3 },
    { question: "Which Python library is used for dataframes?", options: ["NumPy", "Matplotlib", "Seaborn", "Pandas"], correct: 3 },
    { question: "What is overfitting in machine learning?", options: ["Model too simple", "Missing data", "Wrong loss function", "Model too specific to training data"], correct: 3 },
    { question: "What does the mean represent in statistics?", options: ["Most frequent value", "Middle value", "Range of values", "Average of values"], correct: 3 },
    { question: "What is a confusion matrix used for?", options: ["Debugging code", "Sorting data", "Feature scaling", "Evaluating classification models"], correct: 3 },
  ],
  nodejs: [
    { question: "What is Node.js?", options: ["A CSS framework", "A database", "A React library", "Server-side JavaScript runtime"], correct: 3 },
    { question: "Which built-in module handles HTTP in Node.js?", options: ["net", "server", "request", "http"], correct: 3 },
    { question: "What does `npm install` do?", options: ["Starts a server", "Runs tests", "Builds the project", "Installs project dependencies"], correct: 3 },
    { question: "What is `package.json`?", options: ["A JSON database", "A build config", "An API response", "Project metadata and dependencies file"], correct: 3 },
    { question: "Which keyword imports a CommonJS module in Node.js?", options: ["import", "include", "fetch", "require"], correct: 3 },
  ],
};

function getQuestionsForSkill(skillId) {
  return QUESTIONS[skillId] ?? QUESTIONS.react;
}

module.exports = {
  SKILLS,
  getQuestionsForSkill,
};
