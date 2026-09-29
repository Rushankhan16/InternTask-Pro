# InternTask Pro

A clean, professional task management dashboard created for internship/project submission.

## Features
- Add, edit and delete tasks
- Mark tasks as completed
- Search and filter tasks
- Priority and category labels
- Dashboard statistics
- Progress tracking
- Dark/light theme
- Data saved automatically using browser localStorage
- Responsive design
- Simple Node.js + Express server

## Technology Stack
- HTML5
- CSS3
- JavaScript (ES6)
- Node.js
- Express.js
- Browser LocalStorage

## How to Run

### 1. Open the project folder
Open `InternTask_Pro` in VS Code.

### 2. Install dependencies
Open the VS Code terminal and run:

```bash
npm install
```

### 3. Start the project

```bash
npm start
```

### 4. Open in browser

Go to:

`http://localhost:3000`

No MongoDB, MongoDB Atlas, Python, database configuration, API keys, or environment variables are required.

## Project Structure

```text
InternTask_Pro/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── package.json
├── server.js
└── README.md
```

## Note
Tasks are stored in the browser's localStorage, so the application works without an external database.