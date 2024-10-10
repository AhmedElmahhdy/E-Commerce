# E-Commerce web app
This project is a full-featured e-commerce platform designed to help businesses create an online store. It allows users to browse products, add them to a shopping cart, and complete purchases. The platform provides features like user authentication, product search and filtering, order management, and payment integration.
The project exists to simplify the process of setting up an online store, offering a scalable and customizable solution for businesses of all sizes to sell products online.


## Prerequisites
Before running the project, you need to have the following installed:
* Nodejs
* Expressjs
*  Mongoose

## Installation

1. Clone the repo
    ```bash
    git clone [https://github.com/AhmedElmahhdy/E-Commerce]
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Set up environment variables
    ```bash
    cp .env.example .env
    ```

4. Run the project
    ```bash
    npm start
    ```

## Usage

On the backend, the platform is powered by Node.js and Express.js for managing API requests and business logic,
while MongoDB is used to store product, user, and order data. The system incorporates role-based access control,
with two main roles: Admin and User.

Key Features:
* User Registration & Authentication: Secure signup and login functionality with JWT-based authentication.
* Product Catalog: Users can view detailed information about various products categorized into multiple categories and subcategories.
* Shopping Cart & Wish List: Users can add products to their shopping carts or wish lists for future purchases.
* Order Management: Users can place orders and track their purchase history, while admins can manage all orders.
* Admin Dashboard: Admins can add, update, and delete products, brands, sub-categories, coupons and categories, and manage user accounts.
* Corn Job : using node-schedule to create crons to able and disable coupons
  
## Folder Structure
The project is organized into a structured hierarchy to maintain scalability and readability. Below is an overview of the main directories and their purpose: 
```bash
ecommerce-project/
├── config/
│   │   └── dev.env       # Environment variables (API keys, DB credentials, etc.)
├── src/
│   ├── Middlewares/
│   │   └──  # all middlewares files 
│   ├── Moudles/
│   │   ├── each moudles
            └── moudle-name.controllers.js    # API controllers related to user operations
            └── moudle-name.routes.js    # API routes related to user operations
|   ├── services/
│   │   └── services-name.service.js   # Handles services
|   ├── paymant/
|   |   └── paymant.js  # Handles payment integration
│   ├── utils/
│       └──   # Utility functions like logging
│
├── Uploads/
|    └── # contain all images files 

├── package.json              # Project dependencies and scripts
└── README.md                 # Documentation for the project
```

## API Reference
postman DOC => https://documenter.getpostman.com/view/34113326/2sAXjRWq1i#intro


