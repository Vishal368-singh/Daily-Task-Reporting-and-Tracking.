# ML Task Management System - Data Flow Documentation

## Overview

This document provides comprehensive documentation of all data flows in the ML Task Management System, including request/response patterns, data transformations, and change impact analysis.

## System Architecture

### Backend Architecture

- **Framework**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **API Structure**: RESTful APIs with role-based access control

### Frontend Architecture

- **Framework**: React 18 with Vite
- **State Management**: React Context API
- **HTTP Client**: Axios with interceptors
- **UI Components**: Material-UI icons with Tailwind CSS

### Registration Flow

\\\Frontend (AddResource.jsx) → Auth API → Backend (authController.js) → Database (User.js)\\\`n
**Request Flow:**

1. User submits registration data
2. \uthApi.jsx\ sends POST request to \/api/auth/register\`n3. \uthController.js\ creates new user
3. Database save operation to \User.js\ model

## 2. Task Management Data Flow

### Task Creation Flow

\\\Frontend (DailyTaskForm.jsx) → Task API → Backend (taskController.js) → Database (Task.js)\\\`n
**Request Flow:**

1. User fills task form in \DailyTaskForm.jsx\`n2. Form validation and data preparation
2. \ askApi.jsx\ sends POST request to \/api/tasks\`n4. \ askController.js\ validates required fields
3. Database save operation with pre-save middleware

**Data Transformation:**

- Task status calculated based on remarks
- Visibility determined by remark status
- Total time calculated from remark minutes
- Cumulative duration tracking

### Task Update Flow (Remark Updates)

\\\Frontend (TaskTable.jsx) → Task API → Backend (taskController.js) → Database (Task.js)\\\`n
**Request Flow:**

1. User edits remark in \TaskTable.jsx\`n2. Edit state managed locally in component
2. \ askApi.jsx\ sends PUT request to \/api/tasks/:taskId/remark/:remarkIndex\`n4. \ askController.js\ updates specific remark
3. Database update with automatic recalculation

**Data Transformation:**

- Minutes added to existing values
- Task visibility recalculated based on remark status
- Overall task status updated
- Work date timestamp updated

### Task Retrieval Flow

#### User Tasks Flow

\\\Frontend (TaskTable.jsx) → Task API → Backend (taskController.js) → Database (Task.js)\\\`n
**Request Flow:**

1. Component mounts or updates trigger
2. \ askApi.jsx\ sends GET request to \/api/tasks/me\`n3. \ askController.js\ filters by employeeId and visibility
3. Database query with sorting by date

**Response Flow:**

1. Tasks filtered by visibility status
2. Component state updated
3. UI renders visible tasks only

#### Admin Tasks Flow

\\\Frontend (DailyReport.jsx) → Task API → Backend (taskController.js) → Database (Task.js)\\\`n
**Request Flow:**

1. Admin accesses daily report in \DailyReport.jsx\`n2. \ askApi.jsx\ sends GET request to \/api/tasks\ with filters
2. \ askController.js\ validates admin role and applies filters
3. Database query with optional filtering

**Response Flow:**

1. All tasks returned based on filters
2. Component processes and displays data
3. TaskFilters component manages filter state

## 3. Change Impact Analysis

### Where Changes Should Be Applied

#### 1. Database Schema Changes

- **Location**: \Backend/src/models/Task.js\`n- **Impact**: Affects all task-related operations
- **Testing Required**: All task CRUD operations, remark calculations
- **Files to Update**: \ askController.js\, \ askApi.jsx\, \TaskTable.jsx\`n

#### 2. API Endpoint Changes

- **Location**: \Backend/src/controllers/taskController.js\`n- **Impact**: Affects frontend API calls and data processing
- **Testing Required**: API integration tests, frontend components
- **Files to Update**: \ askRoutes.js\, \ askApi.jsx\, related frontend components

#### 3. Frontend Component Changes

- **Location**: \Frontend/src/report/TaskTable.jsx\, \Frontend/src/report/DailyReport.jsx\`n- **Impact**: Affects user interface and data display
- **Testing Required**: UI rendering, user interactions, data filtering
- **Files to Update**: Related API files, context providers

#### 4. Authentication Changes

- **Location**: \Backend/src/middleware/authMiddleware.js\`n- **Impact**: Affects all protected routes and user sessions
- **Testing Required**: Login/logout flows, role-based access
- **Files to Update**: All API files, frontend auth components

#### 5. Data Processing Logic Changes

- **Location**: \Backend/src/models/Task.js\ (pre-save middleware)
- **Impact**: Affects automatic calculations and data consistency
- **Testing Required**: Task creation, updates, status calculations
- **Files to Update**: Controllers that create/update tasks

## 4. Testing Considerations

### Unit Testing

- **Backend Models**: Test data validation, pre-save middleware
- **Controllers**: Test business logic, error handling
- **API Routes**: Test route handlers, middleware integration

### Integration Testing

- **API Endpoints**: Test complete request/response cycles
- **Database Operations**: Test CRUD operations with test data
- **Authentication Flow**: Test login, registration, token validation

### Frontend Testing

- **Component Testing**: Test UI rendering, user interactions
- **API Integration**: Test frontend API calls and responses
- **State Management**: Test context providers and state updates

### End-to-End Testing

- **User Workflows**: Test complete user journeys
- **Data Flow Testing**: Test data consistency across the system
- **Role-based Access**: Test different user roles and permissions
