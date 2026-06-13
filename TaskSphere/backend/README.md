# TaskSphere Backend

This is the Django REST Framework backend for the TaskSphere project.

## Prerequisites

- Python 3.10+
- pip (Python package installer)

## Development Setup

1. **Navigate to the backend directory**
   ```bash
   cd TaskSphere/backend
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - On Windows (PowerShell):
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - On Windows (Command Prompt):
     ```cmd
     .\venv\Scripts\activate.bat
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Start the development server**
   ```bash
   python manage.py runserver
   ```

The API will now be accessible at `http://127.0.0.1:8000/`.

## Base Configuration

- **Django**: The latest stable version 5.x.
- **Django REST Framework**: Configured and added to `INSTALLED_APPS`.
- **django-cors-headers**: Installed and configured for local development.

*Note: Authentication APIs have not been created yet.*
