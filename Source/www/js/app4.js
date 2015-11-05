var services = angular.module("mongoapp.services", []);
var url = "http://localhost:9080/MongoRestApp/user";

services.factory('MongoRESTService', function($http) {
    return {
        login: function(username, password, callback) {
            console.log("MongoRESTService: login: started");
            var res = $http.get(url+"?requesttype=1&username="+username+"&password="+password);
            res.success(function(data, status, headers, config) {
                console.log("MongoRESTService: login: Success: " + data);
                callback(data);
            });
            res.error(function(data, status, headers, config) {
                console.log("MongoRESTService: login: Error: " + data);
            });
        }, // end login
        register: function(uname, fname, lname, pword, email, callback) {
            var res = $http({
                method: 'POST',
                url : url + "?requesttype=2&username="+uname+"&password="+pword,
                data: JSON.stringify({
                    firstname:fname,
                    lastname:lname,
                    password2: pword,
                    email: email,
                }),
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "Access-Control-Max-Age": "86400"
                }
            });
            res.success(function(data, status, headers, config) {
                console.log("MongoRESTService: register: Success: "+data);
                callback(data);
            });
            res.error(function(data, status, headers, config) {
                console.log("MongoRESTService: register: Error: "+data);
            });
        }, //end register
        changePassword: function(username, password, newpassword, callback) {
            console.log("MongoRESTService: changePassword: started");
            var res = $http({
                method: 'POST',
                url : url + "?requesttype=3&username="+username+"&password="+password,
                data: JSON.stringify({
                    newpassword: newpassword
                }),
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "POST",
                    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
                    "Access-Control-Max-Age": "86400"
                }
            });
            res.success(function(data, status, headers, config) {
                console.log("MongoRESTService: changePassword: Success: "+data);
                callback(data);
            });
            res.error(function(data, status, headers, config) {
                console.log("MongoRESTService: changePassword: Error: "+data);
            });
        }, //end changePassword
        deleteAccount: function(username, password, callback) {
            console.log("MongoRESTService: deleteAccount: started");
            var res = $http.get(url+"?requesttype=4&username="+username+"&password="+password);
            res.success(function(data, status, headers, config) {
                console.log("MongoRESTService: deleteAccount: Success: " + data);
                callback(data);
            });
            res.error(function(data, status, headers, config) {
                console.log("MongoRESTService: deleteAccount: Error: " + data);
            });
        } //end deleteAccount
    }
});

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

app.controller("loginCtrl", function ($scope, $http, $httpParamSerializerJQLike,$window,MongoRESTService){

    $scope.loginUser = function(uname, pword) {
        console.log("RegisterCtrl: loginUser: Entered with: " + uname + ", " + pword);
        
        var result = MongoRESTService.login(uname, pword, function(result) {
            if (angular.fromJson(result).status == 'SUCCESS') {
                alert('Welcome : '+uname);
                localStorage.setItem("email", angular.fromJson(result).email);
                localStorage.setItem("username", uname);
                $window.location.href = "/index.html";
            } else {
                alert('Failed to authenticate user '+uname);
            }
        });

    };
});

app.controller("chgPasswordCtrl", function ($scope, $http, $httpParamSerializerJQLike,MongoRESTService){

    $scope.changePword = function(uname, oldpass, newpass, newpass2) {
        
        if (newpass != newpass2) {
            
            alert('New passwords do not match');
            return;
        }
        
        var result = MongoRESTService.changePassword(uname, oldpass, newpass, function(result) {
            if (angular.fromJson(result).status == 'SUCCESS') {
                $scope.displayMsg = "Password changed";
                alert($scope.displayMsg);
            } else {
                alert("Failed to update password");
            }
        });
    };

});
app.controller("rmUserController", function ($scope, $http, $httpParamSerializerJQLike,MongoRESTService){
    
    $scope.removeAcc = function(uname, pword) {
        
       var result = MongoRESTService.deleteAccount(uname, pword, function(result) {
            if (angular.fromJson(result).status == 'SUCCESS') {
                alert("User "+uname+" has been removed");
            } else {
                alert("Failed to remove user");
            }
        });

    };
});

app.controller("RegisterController", function ($scope, $http, $httpParamSerializerJQLike,MongoRESTService) {
    
    $scope.pageClass = 'register';
    $scope.register = function(uname, fname, lname, pword, email) {
        
    var result = MongoRESTService.register(uname, fname, lname, pword, email, function(result) {
            if (angular.fromJson(result).status == 'SUCCESS') {
                alert($scope.fname+" - User Registered Successfully");
                localStorage.setItem("email", email);
                localStorage.setItem("username", uname);
                localStorage.setItem("firstname", fname);
                localStorage.setItem("lastname", lname);
                localStorage.setItem("password", pword);
            } else {
                alert("Registration failed");
            }
        });
    }; 
});

