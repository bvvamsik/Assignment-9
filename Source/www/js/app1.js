//Module Pattern Start

var app=angular.module("myApp", []);


app.controller("RegisterCtrl", function($scope, $http, $httpParamSerializerJQLike, $window) {
    prompt("in here1");
    //api key : txrusPCK4DZrtU0mq2_bsKgxb2FgvGyP
    // https://api.mongolab.com/api/1/databases/facecom2/collections/users?apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ

    
    $scope.changeEmail = function(uname, pword, newemail) {
        
        $http({
            method: 'GET',
            url: 'https://api.mongolab.com/api/1/databases/facecom2/collections/users?q={"name":"'+uname+'"}&f={"_id":1}&fo=true&apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ'
        })
        .success(function(dat) {
            
                $http({
                    method: 'PUT',
                    url: 'https://api.mongolab.com/api/1/databases/facecom2/collections/users?q={"name":"'+uname+'"}&apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ',
                    data: JSON.stringify({ "$set" : { "email": newemail } }),
                    contentType: 'Application/json'
                })
                .success(function() {
                    $scope.displayEMsg = "Email changed";
                })
                .error(function() {
                    alert('Failed to update email');
                });
        })
        .error(function() {
            alert('Failed to find existing info for ' + uname);
        });
        
    };
    
    
});

app.controller("loginCtrl", function ($scope, $http, $httpParamSerializerJQLike, $window){

    $scope.loginUser = function(uname, pword) {
        console.log("RegisterCtrl: loginUser: Entered with: " + uname + ", " + pword);
        $http({
            method: 'GET',
            url : 'https://api.mongolab.com/api/1/databases/facecom2/collections/users?q={"username":"'+uname+'"}&f={"password":1}&fo=true&apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ'
        })
        .success(function(data) {
            if (data.password == pword) {
                $window.location.href = "/index.html";
            } else {
                alert("Invalid password");
            }
        })
        .error(function() {
            alert('Failed to authenticate user '+uname);
        });
        console.log("RegisterCtrl: loginUser: Finished");
    };
});

app.controller("chgPasswordCtrl", function ($scope, $http, $httpParamSerializerJQLike){

    $scope.changePword = function(uname, oldpass, newpass, newpass2) {
        
        if (newpass != newpass2) {
            
            alert('New passwords do not match');
            return;
        }
        $http({
            method: 'GET',
            url: 'https://api.mongolab.com/api/1/databases/facecom2/collections/users?q={"username":"'+uname+'"}&f={"password":1}&fo=true&apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ'
        })
        .success(function(dat) {
            if (dat.password == oldpass) {
                $http({
                    method: 'PUT',
                    url: 'https://api.mongolab.com/api/1/databases/facecom2/collections/users?q={"username":"'+uname+'"}&apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ',
                    data: JSON.stringify({ "$set" : { "password": newpass } }),
                    contentType: 'Application/json'
                })
                .success(function() {
                    $scope.displayMsg = "Password changed";
                    alert($scope.displayMsg);
                })
                .error(function() {
                    alert('Failed to update password');
                });
                        
            } else {
                
                alert('Old password is invalid');
            }
        })
        .error(function() {
            alert('Failed to authenticate existing info for ' + uname);
        });
        
    };

});
app.controller("rmUserController", function ($scope, $http, $httpParamSerializerJQLike){
    
    $scope.removeAcc = function(uname, pword) {
        
        $http({
            method: 'GET',
            url : 'https://api.mongolab.com/api/1/databases/facecom2/collections/users?q={"username":"'+uname+'"}&f={"password":1,"_id":1}&fo=true&apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ'
        })
        .success(function(data) {
            
            if (data.password == pword) {
                
                $http({
                    method: 'DELETE',
                    url: 'https://api.mongolab.com/api/1/databases/facecom2/collections/users/'+data._id.$oid+'?apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ',
                    async: true
                })
                .success(function() {
                    $scope.displayRMsg = "User "+uname+" has been removed";
                    alert("User "+uname+" has been removed");
                })
                .error(function() {
                    alert("Failed to remove user");
                });
            } else {
                alert("Invalid password");
            }
        })
        .error(function() {
            alert('Failed to find user '+uname);
        });
        
        //Constructor Pattern Start
        
        function StatusUpdate( name1, username ) {
 
            this.name1 = name1;
            this.username = username;
            
            this.toString = function () {
                return this.name1 + " has removed " + this.username + " user";
            };
            }
            

            var admin = new StatusUpdate( "Admin ", uname );

            console.log( admin.toString() );
         
        //Constructor Pattern End
    };
});

app.controller("RegisterController", function ($scope, $http, $httpParamSerializerJQLike) {
    
    $scope.pageClass = 'register';
    $scope.register = function(uname, fname, lname, pword, email) {
    console.log("inside register function");
    $http({
        method: 'POST',
        url : 'https://api.mongolab.com/api/1/databases/facecom2/collections/users?apiKey=osDL6aZehdu2rFRlWBc6z2HhoStllGkZ',
        data: JSON.stringify({
                    username: uname,
                    firstname: fname,
                    lastname: lname,
                    password: pword,
                    email: email
                }),
        contentType: "application/json"
    }).success(function() {    
        alert($scope.fname+" - User Registered Successfully");
        $scope.uname ="";
        $scope.pword ="";
        $scope.email ="";
        $scope.lname="";
        $scope.fname="";
        
            });
            
            
    //Decorator Pattern Start 
    
    function StatusUpdate() {
 
        this.state = function () { return "User is registered successfully with username : "; };
        
        }
        
        // Decorator 1
        function Update( statusupdate ) {
        
        var v = statusupdate.state();
        statusupdate.state = function() {
            return v + uname;
        };
        
        }
               
        var su = new StatusUpdate();
        Update( su );
        
        console.log( su.state() );
     
     //Decorator Pattern End
     
    }; 
});