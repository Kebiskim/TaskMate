### App 설명
이 앱은 달력기능을 이용한 Todo 할일관리 앱입니다.

[[[Calendar]]]
- Calendar 탭에서 달력을 이용할 수 있습니다.

[할일]
1. 달력에서 날짜를 클릭하고, 하단 Enter Todo 란에 내용을 입력한 뒤 Enter 입력 혹은 Add Todo 버튼을 클릭하여 새로운 할일을 추가할 수 있습니다. 
(해당 일자에 할일이 존재하는 경우, 날짜 상단에 초록색 동그라미가 표시됩니다.)
1-1. 생성된 할일에 대해서는 좌측 체크박스를 통해 완료 표시가 가능합니다.
1-2. 우측 Delete 버튼을 통해 삭제가 가능합니다.
1-3. 우측 Priority 버튼을 클릭하여 3단계로 우선순위 지정이 가능합니다.

### 소스 빌드 및 실행 방법
1. VSCode 설치
2. NodeJS 설치 (v20.17.0)
3. 루트폴더/package.json 내 dependencies에서 항목 및 버전 참고하여 각각 npm install 진행
   (혹은 이 터미널에서 명령어 실행: npm install @ant-design/icons@^5.6.1 @testing-library/dom@^10.4.0 @testing-library/jest-dom@^6.6.3 @testing-library/react@^16.2.0 @testing-library/user-event@^13.5.0 antd@^5.24.2 axios@^1.8.1 react@^19.0.0 react-dom@^19.0.0 react-router-dom@^7.2.0 react-scripts@5.0.1 web-vitals@^2.1.4)
4. VSCode 터미널에서 npm start 명령어 입력하여 실행

### 주력으로 사용한 컴포넌트
1. 달력(Calendar 컴포넌트)
핵심 기능이기에, 사용자 편의성에 초점을 맞추고 작업하였습니다. 
오늘 날짜로 이동, 이전/다음 월로 이동, 할일 존재하는 날짜 표시 기능을 구현했습니다.

2. Todo(List 컴포넌트)
할일 입력 작업에 반복성을 더하기 위해 사용했습니다.
완료 여부, 삭제, 우선순위 지정 기능을 직관적으로 사용하게끔 하는 데 초점을 두었습니다.


### 폴더구조
taskmate/                           # Root Folder
├── node_modules/                   # Dependencies (automatically created after npm install)
├── public/
│   ├── assets/                     # Images or other static files
│   ├── index.html                  # Main HTML file
│   ├── favicon.ico                 # Favicon
│   └── manifest.json               # Web app manifest
│
├── src/
│   ├── components/                 # Reusable React components
│   │   ├── Calendar.js             # Calendar & Todo page
│   │   ├── Home.js                 # The main page
│   │   └── Navbar.js               # Navigation bar above
│   ├── context/                    # React Contexts for state management
│   │   └── ThemeContext.js
│   ├── App.css                     # Main React component
│   ├── App.js                      # Global styles
│   ├── index.css                   # Entry point for React app
│   └── index.js                    # Entry point for React app
│
├── .gitignore                      # Git ignore file
├── package.json                    # Project metadata and dependencies
└── README.md                       # description