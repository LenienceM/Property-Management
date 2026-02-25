# Rental Property Management Platform

## Summary

A full-stack rental property management platform built with Spring Boot and React.

This project demonstrates secure JWT authentication, role-based authorisation, database migration management with Flyway, environment-based configuration, and Docker containerisation. It reflects real-world backend architecture practices including layered design, profile-based configuration, and secure secret handling.

## Project Overview

### The Problem
An emerging real estate agency needed a centralised digital platform to establish an online presence, attract potential tenants, and manage property listings efficiently.

### The Solution
A scalable web platform that streamlines property searching for users and simplifies listing management for administrators.

### My Role — Full-Stack Developer
* Gathered technical and business requirements directly from the client.
* Designed and implemented a RESTful backend using Spring Boot.
* Built a responsive frontend using React, TypeScript, and Tailwind CSS.
* Implemented multi-criteria filtering (suburb, price range, bedrooms).
* Integrated JWT-based authentication with role-based authorisation.
* Containerised the backend using Docker.

## Core Features

* **Admin Dashboard:** Secure portal with full CRUD operations for property management.
* **Role-Based Access Control:** Separate permissions for Users and Administrators.
* **Database Versioning:** Managed schema migrations using Flyway.
* **Property Browsing:** Users can search and filter properties by suburb, price, and bedrooms.
* **Sorting:** Properties can be sorted by price (ascending or descending).
* **Containerised Deployment:** Docker-based backend for consistent development and production environments.

## Architecture Overview



The application follows an MVC architecture to ensure maintainability and separation of concerns.

* **Frontend:** React + TypeScript + Tailwind CSS
  ↓ *(REST API / Fetch API)*
* **Backend Controllers:** Spring Boot / Java 21
  ↓
* **Service Layer:** Business Logic & Security
  ↓
* **Repository Layer:** Spring Data JPA
  ↓
* **Database:** PostgreSQL (managed via Flyway)

### Backend Structure
* `/controller` - REST endpoints
* `/service` - Business logic
* `/repository` - Data access layer
* `/security` - JWT authentication & filters
* `/config` - Environment & profile configuration

## Tech Stack

* **Backend:** Java 21, Spring Boot, Spring Security, JWT Authentication, Spring Data JPA, PostgreSQL, Flyway, Maven, Docker
* **Frontend:** React, TypeScript, Tailwind CSS, Fetch API, React Router
* **DevOps & Configuration:** Docker & Docker Compose, Multi-stage container builds, Spring Profiles (dev / prod), Environment-based configuration

## Security

* JWT-based authentication
* Role-based authorisation
* Secrets managed via environment variables
* No hardcoded credentials in source code