# Project-Skuji
    Base Url: https://project-skuji-api.herokuapp.com


## Endpoints

# Course

### POST /course - create a new course 

#### Request 
    {
    "Title":String
    }

#### Response

    {
        message:String,
        code:Number,
        data : {
            "Id": ObjectId,
           "Title":String 
        }
    }


### GET /course - Get all courses 


#### Response

    {
        message:String,
        code:Number,
        data : [{
            "Id": ObjectId,
           "Title":String 
        }]
    }

###  PUT /course/{courseId} - Edit a course


#### Request 
    {
    "Title":String
    }

#### Response

    {
        message:String,
        code:Number,
        data : {
            "Id": ObjectId,
           "Title":String 
        }
    }


###  GET /course/{courseId} - Get a single course

#### Response

    {
        message:String,
        code:Number,
        data : {
            "Id": ObjectId,
           "Title":String 
        }
    }

#### Delete works the same way  



# Question

### POST /course/{courseId}/addquestion - create a new question for a course  

#### Request 
      {   
        "Title":String,
        "Options":[
            {
            "Title":String,
            "IsCorrect":Bool
            }
        ]
      }
#### Response

    {
        message:String,
        code:Number,
        data : {
            "Id":ObjectId
            "Title":String,
             "Questions":[
            {
                "Id":ObjectId,
                "Title":String,
                "Options":[
                {"Title":String,
                "IsCorrect":Bool,
                "Index":Number}
                ]
            }
            ],
            "Tests":[{

            }]
        }
    }


### PUT /question/{questionId} - Edit Question

#### Request 
      {   
        "Title":String,
        "Options":[
            {
            "Title":String,
            "IsCorrect":Bool,
             "Index":Number
            }
        ]
      }

> NB:You cannot edit a single option.You should send the edited option along with the unchanged ones 

#### Response
     {   
        "Title":String,
        "Options":[
            {
            "Title":String,
            "IsCorrect":Bool,
             "Index":Number
            }
        ]
      }

### GET /question/{questionId} - Get Question,
#### The Same With Delete

#### Response
     {   
        "Id" : ObjectId
        "Title":String,
        "Options":[
            {
            "Title":String,
            "IsCorrect":Bool,
             "Index":Number
            }
        ]
      }









# Test



### POST /course/{courseId}/addtest - create a new test for a course  

#### Request 
      {   
        "Title":String,
        "NumberOfQuestions":Number,
        "DurationInMinutes":Number
      }

#### Response
    {
        message:String,
        code:Number,
        data : {  
            "Id":ObjectId 
            "Title":String,
            "Questions":[
            {
                "Id":ObjectId
                "Title":String,
                "Options":[
                {"Title":String,
                "IsCorrect":Bool}
                ]
            }
            ],
            "Tests":[{
                "Title":String,
                "NumberOfQuestions":Number,
                "DurationInMinutes":Number,
                "Course":{},
                "IsClosed":bool
            }]
        }
    }





### Get /test/{testId} - Get Id   


#### Response
    {
        message:String,
        code:Number,
        data : {  
                "Title":String,
                "NumberOfQuestions":Number,
                "DurationInMinutes":Number,
                "Course":{},
                "IsClosed":bool
        }
    }



### POST /test/{testId}/close - closes the test so nobody can attempt

#### Response
    {
        message:String,
        code:Number,
    }



### POST /test/{testId}/open - opens the test to attempts

#### Response
    {
        message:String,
        code:Number,
    }


### DELETE /test/{testId} - Delete test 

#### Response
    {
        message:String,
        code:Number,
    }



# Attempts 

### POST /start - Starts an attempt for a test 

#### Request
    {
        "Email":String,
        "Test": ObjectId
    }

#### Response
    {
        message:String,
        code:Number,
        data:{
            "Email":String,
            "QuestionsAttempted":[
            {"question":ObjectId},
            "AnswerPickedIndex":Number
            }],
            "Score":Number,
            "HasSubmitted":bool,
            "Test":ObjectId,
            "StartTime":String ,
            "StopTime":String,
            "CourseTitle":String
        }
    }


### POST attempt/start - Starts an attempt for a test 

#### Request
    {
        "Email":String,
        "Test": ObjectId
    }

#### Response
    {
        message:String,
        code:Number,
        data:{
            "Id":ObjectId
            "Email":String,
            "QuestionsAttempted":[

            {"question":ObjectId},
            "AnswerPickedIndex":Number
            }
            ],
            "Score":Number,
            "HasSubmitted":bool,
            "Test":ObjectId,
            "StartTime":String ,
            "StopTime":String,
            "CourseTitle":String
        }
    }


### PUT /attempt/{attemptId}/addbatch - Starts an attempt for a test 

#### Request
    {
      "QuestionsAttempted":[
        {            
            "question":ObjectId,          
            "AnswerPickedIndex":Number
        }]
    }

#### Response
    {
        
        message:String,
        code:Number,
        data:{
            "Id":ObjectId
            "Email":String,
            "QuestionsAttempted":[
            {{"question":ObjectId},
            "AnswerPickedIndex":Number
            }],
            "Score":Number,
            "HasSubmitted":bool,
            "Test":ObjectId,
            "StartTime":String ,
            "StopTime":String,
            "CourseTitle":String
    }



### PUT /attempt/{attemptId}/submit - submits the attempt
> NB: After this request the attempt cannot be edited again
#### Request
>NB: If all answers have been added the request body is not needed

    {
      "QuestionsAttempted":[
        {            
            "question":ObjectId,          
            "AnswerPickedIndex":Number
        }]
    }

#### Response
    {
        
        message:String,
        code:Number,
        data:{
            "Id":ObjectId
            "Email":String,
            "QuestionsAttempted":[
            {{"question":ObjectId},
            "AnswerPickedIndex":Number
            }],
            "Score":Number,
            "HasSubmitted":bool,
            "Test":ObjectId,
            "StartTime":String ,
            "StopTime":String,
            "CourseTitle":String
    }
    
    


