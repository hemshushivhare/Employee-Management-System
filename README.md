**Employee Management System**

**Project Overview:**
The Employee Management System is a web application designed to streamline employee management tasks within an organization. It includes features for user authentication, employee listing, employee details, profile management, and leave management. The system is built using React for the frontend, and a RESTful API backend built with technologies like Node.js and Express.js. Data is stored in a relational database, and the project follows a modular architecture to maintain scalability and code organization.

**UI - UI App architecture:**
- Built with React to ensure a dynamic and interactive user interface.
- Follows a component-based architecture for modularity and reusability.

**UI - Login/signup:**
- Allows users to log in using their username and password.
- User credentials are verified against a JSON file.
- Upon successful verification, the user is authorized and their information is stored in local storage.

**UI - Employee list:**
- Displays a list of employees.
- Provides functionality to add new employees to the list.

**UI - Employee details:**
- Displays detailed information about each employee.
- Utilizes cards to present employee details in a visually appealing manner.

**UI - Profile:**
- Allows users to view and edit their profile information.
- Provides basic UI for profile display and edit functionality.

**API - App architecture:**
- Backend API built using Node.js and Express.js.
- Follows a modular architecture with separate controllers, models, repositories, and services.
- Controllers include AuthController and EmployeeController for handling authentication and employee-related operations.
- Models consist of AuthEntity, EmployeeEntity, and others to define data structures.
- Repositories manage database operations.
- Services contain business logic for various operations.

**API - Employees APIs:**
- Provides endpoints for user authentication such as signup, login, and logout.
- Includes endpoints for CRUD operations on employees (get by id, get all, get by name, add, delete, update).
- Implements leave management functionalities such as applying for leave, checking leave status, and managing leave requests.

**Employees business logic:**
- Manages connections to the database and collection methods.
- Implements authentication using username and password.
- Allows employees to sign up and add themselves to the system.
- Controls employee listing and deletion, restricting deletion to administrators only.
- Enforces rules for leave management, ensuring employees can only apply for leave if they have pending leaves available.

**DB – Table Design:**
- **Employee Table:**
  - Fields: Id, Name, EmpId, Age, Email, Department, Mobile, Address Type, Address, Created_At, Created_By, Modified_At, Modified_By, IsActive, Remaining Leaves

- **User Table:**
  - Fields: Id, Email, Password, Role, Token, Created_At, Created_By, Modified_At, Modified_By, IsActive

- **Leave Table:**
  - Fields: Id, EmpId, StartDate, EndDate, Reason, LeaveStatus, Created_At, Created_By, Modified_At, Modified_By, IsActive

**Conclusion:**
The Employee Management System is a comprehensive solution for managing employees and their associated tasks. With its user-friendly interface, robust backend, and efficient database design, it aims to streamline HR processes and enhance organizational efficiency.
