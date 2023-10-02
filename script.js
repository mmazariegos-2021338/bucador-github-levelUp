const API = 'https://api.github.com/users/'

const main = document.getElementById('main')
const form = document.getElementById('form')
const search = document.getElementById('search')

async function getUser(username){
    try {
        const { data } = await axios(API + username)
        createUserCard(data)
        getRepos(username)
    }catch(err) {
        if(err.response.status == 404 ) {
            createErrorCard('No se encuentra su  nombre de usuario.')
        }
    }
}

async function getRepos(username){
    try{
        const {data} = await axios(API + username + '/repos?sort=created');
        addReposToCard(data);
    }catch(err) {
        createErrorCard('Problemas Tecnicos.');
    }
}


function createUserCard(user){
    const userID = user.name || user.login
    const userBio = user.bio ? `<p>${user.bio}</p>` : ''
    const cardHTML = `
    <div class="card">
        <div>
        <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      </div> 
      <div class="user-info">
      <h2>${userID}</h2>
      ${userBio}
      <ul>
        <li>${user.followers} <strong>Followers</strong></li>
        <li>${user.following} <strong>Following</strong></li>
        <li>${user.public_repos} <strong>Repos</strong></li>
     </ul>

     <div id="repos"></div>
      </div>
      </div>   
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg){
    const cardHTML= 
    `
    <div class="card">
        <h1>${msg}</h1>
    </div>

    `
    main.innerHTML= cardHTML
}

function addReposToCard(repos){
    const reposT = document.getElementById('repos')

    repos
        .slice(0,5)
        .forEach(repo => {
            const repoT = document.createElement('a')
            repoT.classList.add('repo')
            repoT.href = repo.html_url
            repoT.target = '_blank'
            repoT.innerText = repo.name

            reposT.appendChild(repoT)
        })     
}


form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)

        search.value = ''
    }
})
