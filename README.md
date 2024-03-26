# Warehouse
***Overview***<br/>

This project is aimed at developing a robust and secure API solution that facilitates user authentication, token-based authorization, and CRUD (Create, Read, Update, Delete) operations for a single entity. Leveraging token-based authentication ensures secure access to the API endpoints, while DynamoDB serves as the backend data storage solution for efficient data management.<br/>

***Features***<br/>
* Authentication Flow: Implements a comprehensive authentication flow including user signup, login, and password reset functionalities. Token-based authentication mechanism ensures secure access to API endpoints.
* CRUD Operations: Allows for the creation, retrieval, updating, and deletion of data for a single entity. Designed following RESTful principles to ensure consistency and scalability.
* DynamoDB Integration: Utilizes Amazon DynamoDB for seamless data storage and retrieval. DynamoDB offers scalability, reliability, and low-latency performance, ideal for handling varying workloads.
* Postman Collections: Includes Postman collections containing a comprehensive suite of test cases. Test scenarios cover positive and negative results, ensuring thorough validation of API endpoints under various conditions.

***Technologies***<br/>
Typescript, Express, Webpack, AWS Dynamodb, Postman<br/>

***Set up project***
```
npm i
npm run build
```
***Start project***<br/>
First you need to set up env (you can see .env.example)
```
PORT=8000
ENV=development
AWS_REGION=
AWS_ACCESS_ID=
AWS_SECRET_KEY=
```
```
npm start
```
***Collection***<br/>
You can import my collection from folder ./postman<br/>
Also need to set up env<br/> 
url http://localhost:8000<br/>
token - you will get when you will singin
