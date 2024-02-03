# Install 

You will need Docker in order to install the project
https://docs.docker.com/get-docker/

& a Huggingface client token

In order to create an access token, get an Huggingface account, go to your settings, then click on the Access Tokens tab. 
Click on the New token button to create a new User Access Token.

## Step 1

Clone the repository :
```
    git clone git@github.com:nlw14/llama-app
```

## Step 2
Create a .env file in back/ like .env.example and provide your Huggingface access token
what's a .env : https://www.armandphilippot.com/article/dotenv-variables-environnement

## Step 3
Build the project 
```
    cd llama-app && docker compose up -d  
```

## Step 4
Go to localhost:80/ to see running app