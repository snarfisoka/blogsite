Blog Application
A full-stack blog application built with Next.js for the frontend and Flask for the backend.

📝 Description
This project is a modern web application that allows users to create, view, edit, and delete blog posts and comments. It features server-side rendering for improved performance and SEO, along with a RESTful API.

🚀 Features
Frontend

Create, Read, Update, Delete (CRUD): Full functionality for managing blog posts.

Client-Side Rendering (CSR): Used for interactive components like the comments section and forms.

Server-Side Rendering (SSR): Used for fetching and displaying post data for fast initial loads.

Pagination: Navigate through blog posts.

Search: Filter posts by keyword.

Backend

RESTful API: Provides endpoints for all CRUD operations.

Post and Comment Models: Handles data storage and relationships.

🛠️ Installation & Setup
To run this project, you need to set up both the backend and the frontend.

Backend Setup (Flask)
Navigate to the backend directory:

Bash

cd blogsite/backend
Create and activate a virtual environment:

Bash

# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
Install the required packages:

Bash

pip install -r requirements.txt
Run the Flask development server:

Bash

flask run
The backend API will be available at http://127.0.0.1:5000.

Frontend Setup (Next.js)
Navigate to the frontend directory:

Bash

cd blogsite/frontend
Install the npm packages:

Bash

npm install
Create a .env.local file with your API URL:

NEXT_PUBLIC_API_URL=http://127.0.0.1:5000
Run the Next.js development server:

Bash

npm run dev
The frontend application will be available at http://localhost:3000.

🤝 Contribution
Feel free to contribute to this project. For major changes, please open an issue first to discuss what you would like to change.