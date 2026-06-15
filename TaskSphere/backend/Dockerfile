# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Set working directory
WORKDIR /app

# Install system dependencies
# curl is installed to support health check requests if needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . /app/

# Create a non-privileged user and group to run the app securely
# UID/GID 10001 is standard for container security constraints (e.g. Kubernetes, AWS ECS)
RUN groupadd -g 10001 django && \
    useradd -u 10001 -g django -d /app -s /sbin/nologin django

# Transfer directory ownership to the non-root user
# SQLite requires write permissions on the directory containing the db file to manage lock files (.journal/.wal)
RUN chown -R django:django /app

# Switch to the non-root user
USER django

# Expose port
EXPOSE 8000

# Run gunicorn to serve the WSGI application
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "3", "core.wsgi:application"]
