- This Project is tiny modified clone of HaikuJam app

Databse used - > MongoDb (download and follow the installation procedure from official website ->  https://www.mongodb.com/try/download/community )

Technologies
- project is created with :
    "connect-flash": "^0.1.1",
    "connect-mongo": "^3.2.0",
    "dotenv": "^8.2.0",
    "ejs": "^3.1.5",
    "ejs-mate": "^3.0.0",
    "express": "^4.17.1",
    "express-session": "^1.17.1",
    "joi": "^17.3.0",
    "method-override": "^3.0.0",
    "mongoose": "^5.11.6",
    "passport": "^0.4.1",
    "passport-local": "^1.0.0",
    "passport-local-mongoose": "^6.0.1"
    
 - To run this project:
 
  -> npm init -y (to create the project)
  ->  then install all the above dependencies using npm and download the code in same directory
 
  -> to get the initial data in Database, simply run "node seeds/index.js" and it will insert the sufficient data in database
 
  -> then at the end
  -> run -> node app.js 
   and open browser and hit this url -> http://localhost:3000/
