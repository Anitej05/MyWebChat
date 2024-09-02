const chatwindow = document.querySelector('#ChatWindow');
const username = prompt("Enter your name (This name will be displayed in the chat): ") || 'Anonymous';
const submitbtn = document.querySelector('#submitbtn');
const messagebox = document.querySelector('#messagebox');
let lastTimestamp = 0;

function addMessage(name, content){
    const messagediv = document.createElement('div');
    messagediv.classList.add('message');

    const dis_sender = document.createElement('p');
    dis_sender.classList.add('sender');
    dis_sender.textContent = name;

    if(name === username){
        messagediv.classList.add('self');
    }
    else{
        messagediv.classList.add('others');
    }

    const dis_content = document.createElement('p');
    dis_content.textContent = content;
    dis_content.classList.add('content');

    messagediv.appendChild(dis_sender);
    messagediv.appendChild(dis_content);
    chatwindow.appendChild(messagediv);
    console.log("Message added!");

    scrollToBottom();
}

function send_message(content){
    return fetch('http://localhost:8000/send_message', {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({content: content, timestamp: Date.now(), sender: username})
        })
        .then((response) => {
            if(!response.ok)
            {
                console.log("Failed to send a message!");
            }
        })
        .catch((error) => console.log(error))
}

function scrollToBottom() {
    chatwindow.scrollTop = chatwindow.scrollHeight;
}

function get_message(){
    return fetch(`http://localhost:8000/get_messages?after=${lastTimestamp}`, {method: 'GET'})
    .then((response) => response.json())
    .then((data) => {
        data.forEach(msg => {
            addMessage(msg.sender, msg.content);
            lastTimestamp = Math.max(lastTimestamp,msg.timestamp);
        });
    })
    .catch((error) => console.log(error))
}

submitbtn.addEventListener('click', (event) => {
    event.preventDefault();
    if(messagebox.value != ''){
        send_message(messagebox.value);
    }
    messagebox.value = '';
})

setInterval(get_message, 100);

get_message();