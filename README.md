### To test the project in the local

## run mongodb to the local

# you can download and install mongodb in the local

# run mongodb server in the local

## run the project in the local

# download the whole project in the github

# check your node version is equal to `14.15.0` (if not then please install it on your local and control version with nvm)

# `npm install`

# `npm run development`

# after running in local, for test you can run `npm run test`

# before testing you have to call the signup endpoint with this credential

{
email: "test@lahore.com",
password: "SuperUser123$",
};

### api structure

You can test api by using postman

## auth (user signup, signin, signOut)

# for signup and signin

url: http://localhost:3000/auth/signup, http://localhost:3000/auth/signin
body: json
{
"email": "test@lahore.com",
"password": "SuperTest1234"
}
As the response you can get the token.
Then you have to put it as the bearer token for all other api request

# for signout

url: http://localhost:3000/signOut

## notes (restapi)

url: http://localhost:3000/notes
You can use the apis list in the problem for testing rest api
body: json
{
"title": "test",
"content": "test",
}
The userid is automatically parsed in the backend by using bearer token for the signin user.
