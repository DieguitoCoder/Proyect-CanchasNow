
# CanchasNow

Welcome to CanchasNow! This project is a web platform for booking premium sports courts in Barranquilla. It allows users and owners to manage reservations, payments, schedules, and court administration easily and efficiently.

---

## Table of Contents
- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Installation & Usage](#installation--usage)
- [Project Structure](#project-structure)
- [ER Model](#er-model)
- [Contributing](#contributing)
- [License](#license)

---

## Description
CanchasNow is a Multi-Page Application (MPA) web app that allows you to:
- Search and book sports courts.
- Make online payments.
- Manage schedules, users, and court owners.
- View information and gallery for each court.

---

## Features
- User and owner registration/login.
- Quick booking and schedule management.
- Integrated payments (PayPal, Credit Card, Google Pay, Apple Pay).
- Admin panel for court owners.
- Image gallery and detailed info for each court.
- Responsive and modern design.

---

## Technologies
- **Frontend:** HTML, CSS (Tailwind & custom), Vanilla JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT
- **Other:** LocalStorage/sessionStorage for session, payment integration

---

## Installation & Usage

### Requirements
- Node.js >= 14
- MySQL

### Steps
1. Clone the repository:
	```bash
	git clone https://github.com/youruser/CanchasNow.git
	```
2. Install backend dependencies:
	```bash
	cd CanchasNow/backend
	npm install
	```
3. Set up the database:
	- Create a MySQL database and run the `sql/schema.sql` script.
	- Configure credentials in `backend/db.js`.
4. Start the backend server:
	```bash
	npm start
	```
5. Open the frontend:
	- You can use an extension like Live Server in VS Code or serve the file `frontend/src/views/website/index.html`.

---

## Project Structure
```
CanchasNow/
├── backend/
│   ├── db.js
│   ├── server.js
│   ├── routes/
│   ├── middleware/
│   ├── sql/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── views/
│   │   ├── js/
│   │   ├── css/
│   │   ├── assets/
│   │   ├── courts/
│   │   └── data/
│   └── ...
└── README.md
```

---

## ER Model
![ER-Model](ModeloER.png)

---


## Contributing
Want to contribute? You're welcome! Fork the repo, create your branch, and submit a pull request. For suggestions or issues, open an issue.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

**Developed by [Your Name/Team]**