const express = require('express');
const app = express();
const mongodb = require('mongodb').MongoClient;
mongodb.connect('mongodb://localhost:27017', (err, dbo) => {
    if (err) {
        console.log('there is a database error');
        return;
    }
    console.log('connected to DB successfully');
    const db = dbo.db("company");

    db.createCollection('employee',{
        validator: {
            $jsonSchema: {
                bsonType: "object",
                properties: {
                    Ename: {
                        bsonType: "string",
                        description: "must be a string and is requried"
                    },
                    department: {
                        bsonType: "string",
                        enum: ["clerical staff", "support staff", "ops staff", "development staff", "management staff", "logistic staff"],
                        description: "department must be under the mentioned names"
                    },
                    salary: {
                       bsonType: "int",
                       min: 3000,
                       max: 50000,
                       description: "salary must be between 3000 to 50000" 
                    },
                    designation: {
                        bsonType: "string",
                        enum: ["clerical", "support", "ops", "development", "management", "logistic"],
                        description: "designation must be under the mentioned names"
                    },
                    cities: {
                        bsonType: "string",
                        enum: ["Bangalore", "Delhi", "New York", "California", "Singapore"],
                        description: "cities must be under the mentioned names"
                    }
                }
            }
        }
    });
    // insert records to database
    function insetToDatabase() {
        db.collection('employee').insertMany([
            {
                Ename: "charan",
                department: "non staff",
                designation: "Developer",
                salary: 50000,
                dateofjoining: '03/09/2016',
                city: "Delhi"
            },
            {
                Ename: "Tom Curse",
                department: "clerical staff",
                designation: "clerical",
                salary: 20000,
                dateofjoining: '25/09/2012',
                city: "Bangalore"
            },
            {
                Ename: "James Bond",
                department: "support staff",
                designation: "support",
                salary: 10000,
                dateofjoining: '25/09/2018',
                city: "New York"
            },
            {
                Ename: "Andy Bran",
                department: "ops staff",
                designation: "ops",
                salary: 3000,
                dateofjoining: '22/09/2014',
                city: "California"
            },
            {
                Ename: "Raj Kumar",
                department: "management staff",
                designation: "management",
                salary: 40000,
                dateofjoining: '25/09/2018',
                city: "Singapore"
            },
            {
                Ename: "Lisa",
                department: "logistic staff",
                designation: "logistic",
                salary: 35000,
                dateofjoining: '25/09/2018',
                city: "Bangalore"
            }
        ]);
    }
    // Uncomment to insert duplicate data
    // insetToDatabase();

    // 1. find and Display only designation of an Employee
    db.collection('employee').distinct('designation').then(res => console.log(res));
   
    // 2. find and Display the records of employee whose salary is greater than 7000
    db.collection('employee').find({salary: {$lt: 7000}})

    // 3. Sort and Display the records of an employee based on the date of joining
    db.collection('employee').find().sort({dateofjoining: 1})

    // 4. Sort and Display the records of an employee based on the salary in ascending order
    db.collection('employee').find().sort({salary: 1});

    // 5. find and Display the records of an employee whose salary in between 5000 to 40000
    db.collection('employee').find({salary: {$gte:5000, $lte: 40000}});

    // 6. find and display all the records of an employee except whose designation is developer.
    db.collection('employee').find({designation: {$ne: "Developer"}});

    // 7. Sort and display the records of an employee's city in descending order
    db.collection('employee').find().sort({city: -1});

    // 8. find and display the records of an employee's whose city starts with Singapore and salary is greater than 8000
    db.collection('employee').find({$and: [{city: 'Singapore'}, {salary: {$gt: 8000}}]});
    
    // 9. Drop the employee records and display
    db.collection('employee').deleteMany({});
});
app.listen(8080);