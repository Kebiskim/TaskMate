### 폴더구조
taskmate/                           # 루트 폴더
│
├── public/
│   ├── assets/                     # Images or other static files
│   ├── index.html                  # Main HTML file
│   ├── favicon.ico                 # Favicon
│   └── manifest.json               # Web app manifest
│
├── src/
│   ├── components/                 # Reusable React components
│   │   ├── Calendar.js
│   │   ├── Home.js
│   │   └── Navbar.js
│   ├── context/                    # React Contexts for state management
│   │   └── ThemeContext.js
│   ├── App.css                     # Main React component
│   ├── App.js                      # Global styles
│   ├── index.css                   # Entry point for React app
│   ├── index.js                    # Entry point for React app
│   └── serviceWorker.js            # For progressive web apps (optional)
│
├── node_modules/                   # Dependencies (automatically created after npm install)
├── package.json                    # Project metadata and dependencies
└── .gitignore                      # Git ignore file
