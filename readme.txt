The App is deployed to 
 
https://stormy-crag-16765.herokuapp.com/

you  should run app.js
the server is listening on port 1000

note that a midlle ware(isLogged) is invoked before entering any route to make sure that the user has signed in 

Functionality:log out
Route: /logout
Request type : post
response: a message that the user logged out successflly


Functionality:HR create a new faculty
Route: /faculty
Request type: post
body: name => required ,departments=>not required
Example of how to call the route: /faculty with body: name:"MET" , departments:[]
response: the created faculty


Functionality:HR delete an existing faculty
Route: '/faculty/:id'
Request type: delete
prarmentes : the deleted faculty id
Example of how to call the route: /faculty/5fde60fcabfcd14d78be23e3 
response: a message that the faculty was deleted succeffully


Functionality:HR update an existing faculty
Route: '/faculty/:id'
Request type: put
prarmentes : the updated faculty id
body : name =>nt required, department =>not required 
Example of how to call the route: /faculty/5fde60fcabfcd14d78be23e3 with body: name:"MET" , departments:[]
response: a message that the faculty was updated succeffully

Functionality:HR create a new department
Route: /department
Request type: post
body: name => required ,hod=> required , faculty_id=>required, course=>not required
Example of how to call the route: /department with body: name:"Math" , courser:[], hod:1 , faculty_id:5fde60fcabfcd14d78be23e3
response: the created department

Functionality:HR  delete an existing department
Route: '/department/:id'
Request type: delete
prarmentes : the deleted department id
Example of how to call the route: /department/5fde60fcabfcd14d78be23e3 
response: a message that the deartment was deleted succeffully


Functionality: HR update an existing department
Route: '/department/:id'
Request type: put
prarmentes : the updated department id
body : name => not required ,hod=> not required , faculty_id=>not required, course=>not required 
Example of how to call the route: /department/5fde60fcabfcd14d78be23e3 with body: name:"CS" 
response: a message that the deartment was updated succeffully

Functionality:HR create a new course
Route: /course
Request type: post
body: name => required ,coordinator =>not required , department_id=>required, slots =>not required , required slots=>required
Example of how to call the route: /course with body: name:"Math4" , department_id:5fde60fcabfcd14d78be23e3 ,  required_slots=>5
response: the created course

Functionality: HR delete an existing course
Route: '/course/:id'
Request type: delete
prarmentes : the deleted course id
Example of how to call the route: /course/5fde60fcabfcd14d78be23e3 
response: a message that the course was deleted succeffully


Functionality: HR update an existing course
Route: '/course/:id'
Request type: put
prarmentes : the updated course id
body: name => not required ,coordinator =>not required , department_id=>not required, slots =>not required , required slots=>not required
Example of how to call the route: /course/5fde60fcabfcd14d78be23e3 with body: name:"CS303" 
response: a message that the course was updated succeffully


functionality: HR add staff member
Route :/staff 
Request type: post
body: name => required , email => required ,day_off=>not required ,salary=>required ,role=>required ,office_id=>required ,gender=not required 
Example of how to call the route: /staff with body: name:"nour" , day_off:1 ,  emali: n@gmail.com,salary:200,role"HR",office_id:5fde9898bdc447375cdac786
response: the created user 

functionality: HR delete staff member
Route :/staff/:id
Request type: delete
params: id
Example of how to call the route: /staff/2
response: a message that the user was deleted succefully

functionality:HR edit staff member
Route :/staff/:id
Request type: put
params: id
body:day_off=>not required ,salary=>not required ,role=>not required ,office_id=>not required ,gender=not required 
Example of how to call the route: /staff/2
response: a message that the user was updated succefully


functionality:HR edit missing days for a staff member
Route :/removemissingdays/:id
Request type: put
params: id
body: date=>required
Example of how to call the route: /removemissingdays/2
response: a message that the missing date was removed succefully


functionality:HR view all the missing days of a staffmember 
Route :/viewstaffmissingdays
Request type: get
params: id
Example of how to call the route: /viewstaffmissingdays
response: json object containing both staf with missing days anf hours 


functionality: HOD assign an instructor to a certain course
Route :/courseinstructor
Request type: post
body: course_id => required, instructor_id=>required
Example of how to call the route: /courseinstructor with body course_id:5fde66dc3c9a502ea48ffa9b , instructor_id:10
response: the saved course assignment 

functionality: HOD modify an instructor course assignment
Route :/courseinstructor
Request type: put
body: course_id => required, instructor_id=>required
Example of how to call the route: /courseinstructor with body course_id:5fde66dc3c9a502ea48ffa9b , instructor_id:10
response: a message that the course assignment  was updated successfully 

functionality:HOD delete an instructor course assignment
Route :/courseinstructor
Request type: delete
body: course_id => required, instructor_id=>required
Example of how to call the route: /courseinstructor with body course_id:5fde66dc3c9a502ea48ffa9b , instructor_id:10
response: a message that the course assignment  was deleted successfully 

functionality:HOD view staff members in his courses/department
Route :/viewstaff
Request type: get
Example of how to call the route: /viewstaff
response: all staff members in his courses/department

functionality:HOD view staff members' dayoff in his courses/department
Route :/viewdayoff
Request type: get
Example of how to call the route: /viewdayoff
response: all staff members' dayoff in his courses/department

functionality:HOD view a staff member's dayoff in his courses/department
Route :/viewdayoff/:id
Request type: get
parameters: id represnts the staff member id
Example of how to call the route: /viewdayoff/2
response: the staff member's dayoff in his courses/department


functionality:HOD view  staff members' requests in his courses/department
Route :/viewrequest
Request type: get
Example of how to call the route: /viewrequest
response: all staff members' request in his courses/department

functionality:HOD reject a certain request made by a staff member in his department
Route :/rejectrequest/:id
Request type: put
parameter: id representing the request id
Example of how to call the route: /rejectrequest/5fde66dc3c9a502ea48ffa9b
response: a message that the request was rejected succeffully

functionality:HOD accept a certain request made by a staff member in his department
Route :/acceptrequest/:id
Request type: put
parameter: id representing the request id
Example of how to call the route: /acceptrequest/5fde66dc3c9a502ea48ffa9b
response: a message that the request was accepted succeffully

functionality:HOD view  course assignment for all course in his department
Route :/viewcourseassignment
Request type: get
Example of how to call the route: /viewcourseassignment
response:all course assignments in his department


functionality:HOD view a course coverage in his department
Route :/viewcoursecoverage/:id
Request type: get
parameters: id representing the course id
Example of how to call the route: /viewcoursecoverage/:id
response:the desired course coverage 


functionality:course instructor view instructors in the sae department
Route :/departement/fellas
Request type: get
Example of how to call the route: /departement/fellas
response:instructors in the same department


functionality:course instructor view instructors who give the same course
Route :/course/fellas/:id 
Request type: get
parameters: id representing course id
Example of how to call the route: /course/fellas/5fde66dc3c9a502ea48ffa9b
response:instructors in the same department


functionality:course instructor view all acadimic members assingend to his courses
Route :/acadimic/assigment/:id
Request type: get
parameters: id 
Example of how to call the route: /acadimic/assigment/5fde66dc3c9a502ea48ffa9b
response:instructors in the same department






================================== Staff Member Functionalities ==================================

==================================================================================================
                                            1
Functionality : Log in with a unique email and a password.
                        ===========
Route         :  /login
                        ===========
Request Type  : POST
                        ===========
Parameters    : No
                        ===========
Request Body  : {email : alekhsasy@gmail.com , password : "123456"}
                        ===========
Response      : No
==================================================================================================
                                            2
Functionality : View their profile.
                        ===========
Route         :  /viewprofile
                        ===========
Request Type  : GET
                        ===========
Parameters    : No
                        ===========
Request Body  : No
                        ===========
Response      : found JSON object of the profile .. EX >> found = {"name" : "Mohamed Ahmed" , "email" : "alekhsasy@gmail.com" , .. remaining of the profile}
==================================================================================================
                                            3
Functionality : Update their profile except for the id and the name. Academic members can’t update
their salary, faculty and department.
                        ===========
Route         :  /updateprofile
                        ===========
Request Type  : PUT
                        ===========
Parameters    : No
                        ===========
Request Body  : sample of things should be updated >> {email : alekhsasy2@gmail.com}
                        ===========
Response      : updated JSON object of the profile .. EX >> updated = {"name" : "Mohamed Ahmed" , "email" : "alekhsasy2@gmail.com" , .. remaining of the profile}
==================================================================================================
                                            4
Functionality : Reset their passwords.
                        ===========
Route         :  /resetPassword
                        ===========
Request Type  : POST
                        ===========
Parameters    : No
                        ===========
Request Body  : {password : "okay" , confirm : "okay"}
                        ===========
Response      : String Message .
==================================================================================================
                                            5
Functionality : Sign in. This should simulate a staff signing in(entering the campus).
                        ===========
Route         :  /signin
                        ===========
Request Type  : POST
                        ===========
Parameters    : No
                        ===========
Request Body  : No
                        ===========
Response      : updated JSON object of the profile with log updated .. EX >> updated = {"name" : "Mohamed Ahmed" , "email" : "alekhsasy2@gmail.com" , .. remaining of the profile}
==================================================================================================
                                            6
Functionality : Sign out. This should simulate a staff signing out(leaving the campus).
                        ===========
Route         :  /signout
                        ===========
Request Type  : POST
                        ===========
Parameters    : No
                        ===========
Request Body  : No
                        ===========
Response      : updated JSON object of the profile with log updated .. EX >> updated = {"name" : "Mohamed Ahmed" , "email" : "alekhsasy2@gmail.com" , .. remaining of the profile}
==================================================================================================
                                            7.a
Functionality : View all their attendance records.
                        ===========
Route         :  /viewAttendance
                        ===========
Request Type  : GET
                        ===========
Parameters    : No
                        ===========
Request Body  : No
                        ===========
Response      : Array of  his/her all logs .. EX for Array ["start" , {signin : specific Date , signout : specific Date} , {absent : specific Date}]
==================================================================================================
                                            7.b
Functionality : or they can specify exactly which month to view attendance.
                        ===========
Route         :  /viewMonthAttendance
                        ===========
Request Type  : GET
                        ===========
Parameters    : No
                        ===========
Request Body  : {month : (0 .. 11) }
                        ===========
Response      : Array of  his/her all logs in that month .. EX for Array [{signin : specific Date , signout : specific Date} , {absent : specific Date}]
==================================================================================================
                                            8
Functionality : View if they have missing days. Missing days are days where the staff member don’t have
any attendance record, is not a Friday nor his/her day off, and there is no accepted leave
for this day.
                        ===========
Route         :  /viewMissingDays
                        ===========
Request Type  : GET
                        ===========
Parameters    : No
                        ===========
Request Body  : No
                        ===========
Response      : Array of  his/her Missing Days .. EX for Array [{absent : specific Date} , {absent : specific Date}]
==================================================================================================
                                            9
Functionality : View if they are having missing hours or extra hours.
                        ===========
Route         :  /viewMissingHours
                        ===========
Request Type  : GET
                        ===========
Parameters    : No
                        ===========
Request Body  : No
                        ===========
Response      : Message of his missing hours or (extra hours if he/she has)



//=============viewSchedule==============

Functionality: view schedule of academic member
Route: /academicMember/viewSchedule
Request type: GET
Response : Array of Objects . Example of a single Object : {day : "Thu" , slots : "5fe44ba458727c4b68e91132"}
each slot references the _id of slot




//===============viewReplacement===========

Functionality: view replacement requests of academic member
Route: /academicMember/viewReplacement
Request type: GET
Response : Array of references requests, example :

[
    "5fe430abdadf5e4e3c67034c",
    "5fe430c4dadf5e4e3c67034d",
    "5fe443c41c12fe44f08466af"
] 





//============sendReplacementMEM=====

Functionality: send replacement request to another academic member
Route: /academicMember/sendReplacementMEM
Request type: POST
Request body : {
	"theAcademicMemberReplacementID" : reference of academic member,
	"course_id" : reference of course_id,
	"targetedDay": "12/31/2021",
	"reason" : "My Wife is Sick" //optional
	}
	
	
Response : message, example :

{
    "message": "Request has been sent successfully"
}




//==============sendReplacementHOD=========


Functionality: send replacement request to HOD
Route: /academicMember/sendReplacementHOD
Request type: POST
Request body : {
	"theAcademicMemberReplacementID" : reference of academic member, //if found
	"targetedDay": "12/31/2021",
	"reason" : "My Wife is Sick" //optional
	}
	
	
Response : message, example :

{
    "message": "Request has been sent successfully"
}




//================sendSlotLinking=============


Functionality: send slot linking request to HOD
Route: /academicMember/sendSlotLinking
Request type: POST
Request body : {
	"desiredSlot" : "123"
	}
	
	
Response : message, example :

{
    "message": "Request has been sent successfully"
}



//=======================Change day off request=======

Functionality: send slot linking request to HOD
Route: /academicMember/changeDayOff
Request type: POST
Request body : {
	"desiredDayOff" : "Thursday",
	}
	
Response : message, example :

{
    "message": "Request has been sent successfully"
}





//==================leaveRequests==============


Functionality: send any type of leave requests to HOD
Route: /academicMember/leaveRequests
Request type: POST
Request body : {

	"type" :One Of ("accidental" OR "sick" OR "maternity" OR "compensation" ),
	"targetedDay" : "12/31/2021"
	}
	
Response : message, example :

{
    "message": "Request has been sent successfully"
}





//===============viewStatus==============

Functionality: View the status sent requests
Route: /academicMember/leaveRequests/:status
Request type: GET
Parameters: status is the status of the request we are getting its status
			status has only one of these values (all , pending , accepted ,rejected)
Example of how to call the route: /academicMember/leaveRequests/pending
	
Response : Array of references of (pending) requests, example :

[
    "5fe430abdadf5e4e3c67034c",
    "5fe430c4dadf5e4e3c67034d",
    "5fe443c41c12fe44f08466af",
    "5fe46fdf5ef4d72988b9d9ea",
    "5fe46ff65ef4d72988b9d9ec",
    "5fe46fff5ef4d72988b9d9ed",
    "5fe470a0c01a9647681f94b8",
    "5fe64675e3d9e54d98a648c8",
    "5fe6497ce3d9e54d98a648c9",
    "5fe64a27200436551ce4ddef",
    "5fe64a3c84eae55d4878f0a5",
    "5fe64c4fd707971078eb630c",
    "5fe64dc5c67a825d18385cfd"
]






//================cancelRequest=========


Functionality: Cancel a still pending request or a request whose day is yet to come.
Route: /academicMember/cancelRequest
Request type: DELETE
Request body : {
    "requestID" : "5fe4708ac01a9647681f94b7"
}
	
Response : message, example :

{
    "message": `request 5fe4708ac01a9647681f94b7 has been cancelled`
}







//=======================Notifications========


Functionality: Send notifications for accepted or rejected requests
Route: /academicMember/notifications
Request type: PUT	

Response : Array of notification string, example :

[
    "your request 5fe44ba458727c4b68e91132 has been accepted",
    "your request 5fe451392ca4fe3444f36db5 has been accepted",
    "your request 5fe46feb5ef4d72988b9d9eb has been rejected",
    "your request 5fe470d59938151bcccb60e0 has been rejected"
]

//=================

Functionality: View notifications for accepted or rejected requests
Route: /academicMember/notifications
Request type: GET	
Response : Array of notification string, example :

[
    "your request 5fe44ba458727c4b68e91132 has been accepted",
    "your request 5fe451392ca4fe3444f36db5 has been accepted",
    "your request 5fe46feb5ef4d72988b9d9eb has been rejected",
    "your request 5fe470d59938151bcccb60e0 has been rejected"
]














	





















