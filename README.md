# ordering-system  
## Default Creds  
### Admin:  
- Email Id: admin.neptune@restaurant.com  
- Mobile No.: 0000000000  
- Password: Wowwhatagreatandsecurepassword123  
  
### Chef 1 (John Doe):  
- Email Id: johndoe@restaurant.com  
- Mobile No.: 0000000001  
- Password: Thisisjohnspwd123  
  
### Chef 2 (Jane Doe):  
- Email Id: janedoe@restaurant.com  
- Mobile No.: 0000000002  
- Password: Thisisjanespwd456  
  
## Setting UP  
- Clone the repo  
```
cd ordering-system
npm install  
```  
- Set up the env variables  
- DB_NAME = food_sys 
```
mysql -u root -p < neptune.sql
npm run app
```
## Introduction  
This is a website to serve as a Food Ordering Management System.  
It will offer customers a quick way to browse through the menu and ordering food without any hassle.  
The website also contains a chef-side portal, providing the chefs to efficiently track the orders and dividing the work between themselves.  
A third portal is for the admin, allowing maximum customisability, helping create an individual identity for each restaurant. Add new dishes, remove old ones, custom discounts, a customer reward scheme and much more.  
  
## Customer Portal  
Upon logging in/signing up with your email and/or contact number, the portal shows the customer the entire menu subdivided by food categories.  
Allows the customer to provide the chefs with any special instructions.  
The portal remembers the previous visits and puts in a special customer discount scheme, depending on the customer's frequency of visits  
It provides a seamless option for payment, with the bill readily available a single click away
  
## Chefs' Portal  
This side of the website offers the chefs a wide array of options.  
It shows them a list of all ongoing orders, with the name of the chef who is currently preparing it. If not assigned to any chef, the chef can take up the dish for themselves.  
The portal will also show the chef all their current orders, and a facility to label it "Done" upon the dish's completion.  
  
## Admin Portal  
It allows the admin, owner, to customize the website to their requirements.  
Options to add dishes, remove them, add categories, and many more features for the admin to utilise.  
It shows the admin a dynamic list of all the orders, completed or otherwise, to keep a check on the restaurant's working.  

