# Wordle Application

## Overview
This project is a Wordle application that utilizes three databases: MongoDB for dynamic data storage, PostgreSQL for structured user data and rankings, and Redis for caching and real-time data handling.

## Technologies Used
- **Node.js**: JavaScript runtime for building the application.
- **Express**: Web framework for Node.js to handle routing and middleware.
- **MongoDB**: NoSQL database for storing word lists and player statistics.
- **PostgreSQL**: Relational database for managing user data and rankings.
- **Redis**: In-memory data structure store for caching and session management.


## Setup Instructions
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd wordle-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory and add your database connection strings and other environment variables:
   ```
   MONGODB_URI=<your_mongodb_uri>
   POSTGRESQL_URI=<your_postgresql_uri>
   REDIS_URL=<your_redis_url>
   ```
5. Start the application:
   ```
   npm start
   ```

## Usage
- Access the application at `http://localhost:3000`.
- Use the provided API endpoints for user authentication, game actions, and ranking management.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.