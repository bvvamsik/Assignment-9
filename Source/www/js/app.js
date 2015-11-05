// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','ngCordova']);
 
app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});
 
app.controller('ImagePickerController', function($scope, $cordovaImagePicker, $ionicPlatform, $cordovaContacts) {
    $scope.data = {}
    
    //Constructor Pattern Start
    $scope.collection = {
        selectedImage : ''
    };
    var ImageName = $scope.collection.selectedImage;
    console.log(ImageName);
    
    //Constructor Pattern End
    
    
    $ionicPlatform.ready(function() {
 
        $scope.getImageSaveContact = function() {       
            // Image picker will load images according to these settings
            var options = {
                maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 80            // Higher is better
            };
 
            $cordovaImagePicker.getPictures(options).then(function (results) {
                // Loop through acquired images
                for (var i = 0; i < results.length; i++) {
                    $scope.collection.selectedImage = results[i];   // We loading only one image so we can use it like this
                      
                    window.plugins.Base64.encodeFile($scope.collection.selectedImage, function(base64){  // Encode URI to Base64 needed for contacts plugin
                        $scope.collection.selectedImage = base64;
                        ImageName = $scope.collection.selectedImage;
                        //$scope.addContact();    // Save contact
                    });
                }
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error));    // In case of error
            });
        };  
 
    }); 
 
    $scope.addContact = function(contactname,emailid,number1,nickname,streetAddress,locality,region,postalCode,country) {
          
          $scope.contact = {     // We will use it to save a contact
          
            "displayName": contactname,
            "name": {
                "givenName"  : contactname,
                "familyName" : "",
                "formatted"  : contactname
            },
            "nickname": nickname,
            "phoneNumbers": [
                {
                    "value": number1,
                    "type": "mobile"
                }             
            ],
            "emails": [
                {
                    "value": emailid,
                    "type": "home"
                }
            ],
            "addresses": [
                {
                    "type": "home",
                    "formatted": streetAddress+","+locality+","+region+","+country,
                    "streetAddress": streetAddress,
                    "locality":locality,
                    "region":region,
                    "postalCode":postalCode,
                    "country":country
                }
            ],
            "ims": null,
            "organizations": [
                {
                    "type": "",
                    "name": "",
                    "department": "",
                    "title":""
                }
            ],
            "birthday": "",
            "note": "",
            "photos": [
                {
                    "type": "base64",
                    "value": $scope.collection.selectedImage
    
                }
            ],
            "categories": null,
            "urls": null
        };
        
        $cordovaContacts.save($scope.contact).then(function(result) {
            console.log('Contact Saved!');
            alert("Contact updated successfully");
        }, function(err) {
            console.log('An error has occured while saving contact data!');
            alert("Error saving contact");
        });
    };
    
    
      $scope.getAllContacts = function() {
        $cordovaContacts.find().then(function(allContacts) { //omitting parameter to .find() causes all contacts to be returned
          $scope.contacts1 = allContacts;
        })
      };
    
      $scope.findContactsBySearchTerm = function (searchTerm) {
        var opts = {                                           //search options
          filter : searchTerm,                                 // 'Bob'
          multiple: true,                                      // Yes, return any contact that matches criteria
          fields:  [ 'displayName', 'name' ],                   // These are the fields to search for 'bob'.
          desiredFields: [id],    //return fields.
        };
    
        if ($ionicPlatform.isAndroid()) {
          opts.hasPhoneNumber = true;         //hasPhoneNumber only works for android.
        };
    
        $cordovaContacts.find(opts).then(function (contactsFound) {
          $scope.contacts = contactsFound;
        });
      };
    
      $scope.pickContactUsingNativeUI = function () {
        $cordovaContacts.pickContact().then(function (contactPicked) {
          $scope.contact = contactPicked;
          
        })
      }
 
});