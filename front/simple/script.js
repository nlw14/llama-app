let bgColor = 0;
let titleColor = 0;

function getRandomInt(max) 
{
    return Math.floor(Math.random() * max);
}

window.onload = () => {
    emptyInput();

    //set bg color
    let red = getRandomInt(255);
    let green = getRandomInt(255);
    let blue = getRandomInt(255);

    let mix = red + green + blue;
    
    titleColor = (mix < 300) ? 'white' : 'black';
    bgColor = `rgb(${red.toString()},${green.toString()},${blue.toString()})`;

    let body = document.getElementsByTagName('body');
    body[0].style.backgroundColor = bgColor;

    let colors = document.getElementsByClassName("color-change");
    let borders = document.getElementsByClassName("border-change");
    for(let i = 0; i < colors.length; i++){
        colors[i].style.color = titleColor
    }
    for(let i = 0; i < borders.length; i++){
        borders[i].style.borderColor = titleColor
    }

    //set listeners
    let send = document.getElementById("send");
    send.onclick = handleClick
    window.onkeydown = handleKeydown
}

function emptyInput()
{
    let input = document.getElementById("user-input");
    input.value = "";
}

function handleKeydown(e)
{
    if(e.key == 'Enter')
    {
        handleClick(e);
    }
}

async function fetchData(ask)
{
    const userAsking = {
        'user_message' : ask
    }

    const params = {
        method : 'POST',
        mode : 'cors',
        headers : {
            'Content-Type' : 'application/json',
        },
        body : JSON.stringify(userAsking),
    }

    const response = await fetch('http://localhost:5000/llama', params);
    return await response.json();
}

function parseResponse(response)
{
    let res = response.choices[0].text.split('[/INST]')[1].split(/(?=[*])|(?<=[*])/g);
    for(let i = 0; i < res.length; i++)
    {
        res[i] = res[i].trim();
    }
    let result = res.filter((w) => w.length > 0);
    let count = 0;
    let save = [];
    let s = 0;
    for(let i = 0; i < result.length; i++)
    {
        if(result[i] == '*')
        {
            count += 1;
            if(count%2 !== 0)
            {
                save[s] = result[i-1];
                s++;

            }else
            {
                save[s] = '*'+result[i-1];
                s++;
            }
        }else if(count > 0 && count%2 == 0)
        {
            save[s] = result[i];
        }
    }

    return save.filter((w) => w !== '*' && w !== undefined);
}

function isString(value)
{
    return typeof value === 'string' || value instanceof String;
}

function isArray(value)
{
    return typeof value === 'array' || value instanceof Array;
}

function loading(bool)
{
    let loadStyle = document.getElementById("loader").style;
    let inputStyle = document.getElementById("bottom-chat").style;
    if(bool){
        loadStyle.display = "block"
        inputStyle.display = "none"
    }else{
        loadStyle.display = "none"
        inputStyle.display = "flex"
    }
}

function errorInput(bool){
    let inputStyle = document.getElementById("user-input").style;
    if(bool){
        inputStyle.borderColor = "darkred";
    }else{
        inputStyle.borderColor = "black";
    }
}

function updateChat(conv){
    
    let chatBloc = document.getElementById("chat-response");

    let message, youMess, llamaChat, llamaMess, chat;

    for(let i = 0; i < conv.length; i++)
    {
        message = document.createElement("div")
        message.classList.add("message-chat");

        if(isString(conv[i]) && conv[i].substring(0,6) == "You : "){

            youMess = document.createElement("div")
            youMess.classList.add("you-chat");

            chat = document.createElement("div");
            chat.classList.add("chat")
            chat.innerText = conv[i].substring(6);

            youMess.appendChild(chat);
            message.appendChild(youMess);
            chatBloc.appendChild(message);

        }else if(isArray(conv[i]))
        {
            conv[i].forEach(llchat => {

                llamaMess = document.createElement("div");
                llamaMess.classList.add("chat");

                if(llchat.substring(0,1) == "*")
                {
                    llamaMess.style.cssText = `
                        color: black;
                        font-weight : bold; 
                        backgroung-color: none; 
                        margin-left : 5px !important; 
                        font-style: italic;
                    `
                    llamaMess.innerText = llchat.substring(1,llchat.length);
                    message.appendChild(llamaMess);
                }else
                {
                    llamaChat = document.createElement("div");
                    llamaChat.classList.add("llama-chat");
                    llamaChat.style.backgroundColor = bgColor

                    llamaMess.innerText = llchat;
                    llamaMess.style.color = titleColor;
                    llamaChat.appendChild(llamaMess);
                    message.appendChild(llamaChat);
                }
                chatBloc.appendChild(message);   
            });
        }
    }
    scrollDownChat();
}

async function handleClick(e)
{
    e.preventDefault()
    errorInput(false);

    let userInput = document.getElementById("user-input").value;

    if(userInput.length > 0)
    {
        loading(true);

        let userMessage = userInput;
        let response = {};

        updateChat(['You : '+userInput]);
        emptyInput();

        //post user message
        response = await fetchData(userMessage);
        let res = parseResponse(response);

        if(response)
        {
            loading(false);
            updateChat([ res ]);
        }
    } else 
    {
        errorInput(true);
    }
}

function scrollDownChat()
{
    let resChat = document.getElementById('chat-response');
    let computedStyle = window.getComputedStyle(resChat);
    let nbPix = parseInt(computedStyle.height.substring(0,computedStyle.height.length-2));
    resChat.scrollBy(0,nbPix);
}

function chatHandler() 
{
    scrollDownChat();
}