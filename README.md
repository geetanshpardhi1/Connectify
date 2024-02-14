# Connectify

Connectify is a modern social media web application built using the React JavaScript library for the frontend and Django REST Framework for the backend, featuring a RESTful API. This repository contains the full stack codebase for the application, including frontend components, backend models, views, serializers, and API endpoints. The frontend is developed using React to provide a dynamic and interactive user interface, while the backend is powered by Django REST Framework to handle data storage, retrieval, and authentication. With this repository, you can explore the source code, contribute enhancements, and deploy your own instance of the social media platform.

## Key Features

- **React Frontend**: Utilizes React to create a dynamic and interactive user interface.
- **Django REST Framework Backend**: Powered by Django REST Framework to handle data storage, retrieval, and authentication.
- **User Authentication**: Implements user authentication and authorization mechanisms using Django's authentication system and JWT tokens.
- **RESTful API Endpoints**: Provides RESTful API endpoints for user profiles, posts, comments, likes, and other social media functionalities.
- **Modern Web Development Practices**: Follows modern web development practices and technologies for efficient development and scalability.

## Technologies Used

- React
- Django REST Framework
- Python
- JavaScript
- HTML/CSS
- MySQL (or any compatible database)
- JWT Authentication

## Getting Started

To get started with Connectify development or deployment, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/connectify.git
2. Install dependencies for the frontend and backend:
  - cd connectify/frontend
  - npm install

  - cd ../backend
  - pip install -r requirements.txt

3. Set up the database:
   - Create a MySQL database and update the database settings in connectify/backend/connectify/settings.py.
   - Run migrations to apply database changes:

     - cd connectify/backend
     - python manage.py migrate

4. Run the development server:
   - In one terminal tab/window, start the backend server
    - cd connectify/backend
    - python manage.py runserver

   - In another terminal tab/window, start the frontend server
    - cd connectify/frontend
    - npm start

5. Access Connectify:
   - Open a web browser and visit http://localhost:3000 to access the Connectify web application.

Contributing
Contributions to Connectify are welcome! Whether you're fixing a bug, implementing a new feature, or improving documentation, feel free to submit pull requests. Please follow the project's coding style and guidelines when contributing.

License
This project is licensed under the MIT License.
