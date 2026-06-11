# Bloom Testing Guide - A Complete Learning Resource

Welcome to the Bloom Testing Guide! This document will teach you **what testing is**, **why it's important**, and **exactly how your Bloom application is tested**.

---

## Table of Contents

1. [What is Testing & Why Do It?](#what-is-testing--why-do-it)
2. [Types of Software Testing](#types-of-software-testing)
3. [Your Bloom Application Tests](#your-bloom-application-tests)
4. [Running All Tests](#running-all-tests)
5. [Test Configuration Files](#test-configuration-files)

---

## 1. What is Testing & Why Do It?

Testing is the process of checking if a piece of software works as intended. Think of it like quality control for code!

**Why test?**

- 🏗️ **Catch bugs early**: Fix issues before users see them
- 🧱 **Build confidence**: Know your code is reliable before deploying
- 📝 **Document behavior**: Tests show how code _should_ work
- 🔄 **Prevent regressions**: Make sure new changes don't break old features

---

## 2. Types of Software Testing

There are many test types! We'll focus on the main ones in your project:

| Test Type                  | What it tests?                               | Isolation Level | Speed  |
| -------------------------- | -------------------------------------------- | --------------- | ------ |
| **Unit Tests**             | Individual components in isolation           | High            | Fast   |
| **Repository (DAO) Tests** | Data access layer with a test database       | Medium          | Medium |
| **Integration Tests**      | Full stack (Controller → Service → Database) | Low             | Slow   |

---

## 3. Your Bloom Application Tests

Let's look at **every test file in your project** and explain what it does!

### Backend Test Files

#### 3.1 Unit Tests (`backend/src/test/java/derfeb/bloom/`)

Unit tests check individual, independent components (usually Services or Controllers) in complete isolation using **Mockito** to "mock" (fake) dependencies.

##### 📄 `BloomApplicationTests.java`

- **What it does**: The simplest possible test! Just checks if the Spring Boot application starts up without throwing errors.
- **Why it's useful**: Catches major configuration issues early.

##### 📄 `AuthResourceTest.java`

- **What it does**: Tests the `AuthResource` (authentication REST controller) by mocking the `EmployeeService`. Verifies login and signup endpoints return correct HTTP statuses.
- **Why it's useful**: Ensures auth endpoints handle invalid inputs correctly without needing a real database.

##### 📄 `EmployeeServiceTest.java`

- **What it does**: Tests the `EmployeeService` business logic (adding employees, updating them, finding them, etc.) by mocking the `EmployeeRepo`.
- **Tests included**:
  - `addEmployee`: Creates a new employee
  - `updateEmployee`: Updates an existing employee
- **Why it's useful**: Tests core business logic quickly and reliably.

##### 📄 `TaskServiceTest.java`

- **What it does**: Tests the `TaskService` business logic (adding/updating/deleting tasks, filtering tasks) by mocking the `TaskRepo`.
- **Tests included**:
  - `addTask`: Creates a new task
  - `updateTask`: Updates an existing task
  - `deleteTask`: Removes a task
  - `findAllTasks`: Retrieves all tasks
- **Why it's useful**: Validates complex task management logic.

---

#### 3.2 Repository Tests (`backend/src/test/java/derfeb/bloom/repo/`)

Repository tests (also called DAO tests) test data access logic using an **in-memory H2 database** (fast, temporary, and won't mess with your real data!).

##### 📄 `EmployeeRepoTest.java`

- **What it does**: Tests custom `EmployeeRepo` queries using Spring's `@DataJpaTest` (automatically sets up an H2 test DB).
- **Tests included**:
  - `findByEmail`: Finds employees by their email address
  - `findAllActiveEmployees`: Finds only active employees
- **Why it's useful**: Makes sure your database queries return the right data.

##### 📄 `TaskRepoTest.java`

- **What it does**: Tests custom `TaskRepo` queries for filtering tasks.
- **Tests included**:
  - `findByStatus`: Finds tasks by their status (PENDING, IN_PROGRESS, DONE)
  - `findByAssignedEmployees_Id`: Finds tasks assigned to a specific employee
- **Why it's useful**: Validates your task filtering logic is working as intended.

---

#### 3.3 Integration Tests (`backend/src/test/java/derfeb/bloom/controller/`)

Integration tests check the **entire stack** working together (Controller → Service → Repository → Database) using a running server and `MockMvc`.

##### 📄 `EmployeeResourceIntegrationTest.java`

- **What it does**: Sends real HTTP requests to your `/employee` endpoints and verifies the responses are correct.
- **Tests included**:
  1. `testGetAllEmployees_ReturnsEmptyListWhenNoEmployees`: Verifies GET `/employee` returns an empty list when no employees exist
  2. `testAddEmployee_SuccessfullyCreatesEmployee`: Verifies POST `/employee` creates a new employee
  3. `testGetEmployeeById_FindsExistingEmployee`: Verifies GET `/employee/{id}` finds a specific employee
  4. `testUpdateEmployee_SuccessfullyUpdatesDetails`: Verifies PUT `/employee` updates an employee's details
  5. `testDeleteEmployee_RemovesEmployee`: Verifies DELETE `/employee/{id}` removes an employee
- **Why it's useful**: Ensures your entire API works correctly from start to finish!

##### 📄 `TaskResourceIntegrationTest.java`

- **What it does**: Sends real HTTP requests to your `/task` endpoints and verifies the responses are correct.
- **Tests included**:
  1. `testGetAllTasks_ReturnsEmptyListWhenNoTasks`: Verifies GET `/task/all` returns an empty list when no tasks exist
  2. `testCreateTask_SuccessfullyCreatesTask`: Verifies POST `/task/add` creates a new task
  3. `testCreateTask_WithAssignedEmployees`: Verifies you can create a task with assigned employees
  4. `testGetTaskById_FindsExistingTask`: Verifies GET `/task/all` returns the created task
- **Why it's useful**: Validates your task API works end-to-end!

---

## 4. Frontend Testing

Your Angular frontend has a built-in testing setup using **Karma** (test runner) and **Jasmine** (testing framework).

### Example Test: `app.spec.ts`

```typescript
// app.spec.ts - tests AppComponent
import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
```

---

## 5. Running All Tests

### Backend Tests

- **Run all tests**:
  ```bash
  cd backend
  mvn test
  ```
- **Run a specific test class**:
  ```bash
  mvn test -Dtest=EmployeeServiceTest
  ```
- **Run a specific test method**:
  ```bash
  mvn test -Dtest=EmployeeServiceTest#testAddEmployee
  ```

### Frontend Tests

- **Run all tests**:
  ```bash
  cd frontend
  npm test
  ```

---

## 6. Test Configuration Files

### Backend

- **`backend/src/test/resources/application.properties`**:
  Configures H2 in-memory database for tests and disables Spring Security.

- **`backend/pom.xml`**:
  Includes dependencies for testing: JUnit 5, Mockito, Spring Boot Test, H2 Database.

### Frontend

- **`frontend/angular.json`**: Configures Karma test runner
- **`frontend/src/test.ts`**: Entry point for Angular tests

---

🎉 **You now have a complete testing setup!**
