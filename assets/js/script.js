const correctPassword = "Jesus";
const EXPIRATION_TIME = 60 * 60 * 1000;

// Função para validar a senha
function validatePassword() {
    const passwordInput = document.getElementById("password").value.trim();

    if (passwordInput === correctPassword) {
        // Salva o login no localStorage com tempo de expiração
        const now = new Date().getTime();
        const loginData = {
            expiration: now + EXPIRATION_TIME
        };
        localStorage.setItem('loginData', JSON.stringify(loginData));

        // Esconde a tela de login e mostra o conteúdo principal
        document.getElementById("login-screen").style.display = "none";
        document.getElementById("main-content").style.display = "block";

        carregarVideos();

    } else if (passwordInput.toLowerCase() === "jesus") {

        Toastify({
            text: "Jesus é um Nome Próprio!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #ff6ec4, #ec33a5)",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "14px",
            },
            offset: {
                x: 0,
                y: 50
            },
            onClick: function(){}
        }).showToast();

        document.getElementById("password").value = "";

    } else {
        document.getElementById("password").value = "";

        Toastify({
            text: "Nome do Autor do Amor!",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #ff6ec4, #ec33a5)",
                borderRadius: "10px",
                padding: "10px",
                fontSize: "14px",
            },
            offset: {
                x: 0,
                y: 50
            },
            onClick: function(){}
        }).showToast();
    }
}

// Função para verificar se o login ainda é válido
function checkLogin() {
    const loginScreen = document.getElementById("login-screen");
    const mainContent = document.getElementById("main-content");

    const loginData = localStorage.getItem('loginData');
    if (loginData) {
        const parsed = JSON.parse(loginData);
        const now = new Date().getTime();

        if (now < parsed.expiration) {
            // Login válido
            loginScreen.style.display = "none";
            mainContent.style.display = "block";

            carregarVideos();
            return;

        } else {
            localStorage.removeItem('loginData'); // Se expirou
        }
    }
    // Não logado ou expirado: mostra login
    loginScreen.style.display = "flex";
    mainContent.style.display = "none";

    carregarLoginScreen();
}

// Depois de decidir, mostra o login-screen corretamente
function carregarLoginScreen() {
    const loginScreen = document.getElementById("login-screen");
    loginScreen.style.visibility = "visible";
    loginScreen.style.opacity = "1";
}

// Verifica o login ao carregar a página
window.onload = function() {
    checkLogin();

    const passwordInput = document.getElementById("password");
    passwordInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            validatePassword();
        }
    });
};

function showPasswordHint() {
    var hintText = document.getElementById('passwordHintText');
    hintText.classList.toggle('hidden');
}

function extractVideoId(url) {
    if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/watch")) {
        const params = new URLSearchParams(new URL(url).search);
        return params.get("v");
    }
    return null;
}

function changeVideo(videoUrl, title, description) {
    const videoId = extractVideoId(videoUrl);
    if (!videoId) return;

    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0&modestbranding=1`;

    const player = document.getElementById("youtube-player");
    const titleEl = document.getElementById("video-title");
    const descEl = document.getElementById("video-description");
    // const spinner = document.getElementById("spinner");

    // Mostrar o spinner
    // spinner.classList.remove("hidden");

    // Apaga fade
    player.classList.remove("show");
    titleEl.classList.remove("show");
    descEl.classList.remove("show");

    // Aguardar um pouquinho para dar tempo do spinner aparecer
    setTimeout(() => {
        player.src = embedUrl;
        titleEl.textContent = title;
        descEl.textContent = description;
    }, 300);

    // Espera carregar o novo iframe
    player.onload = () => {
        // spinner.classList.add("hidden");
        player.classList.add("show");
        titleEl.classList.add("show");
        descEl.classList.add("show");
    };
}

function carregarVideos() {
    const ul = document.querySelector(".video-list ul");
    ul.innerHTML = "";

    videos.forEach((video, index) => {
        const li = document.createElement("li");
        li.classList.add("video-item");
        if (index === 0) li.classList.add("ativo");
        li.dataset.url = video.url;
        li.dataset.title = video.titulo;
        li.dataset.number = video.number;
        li.dataset.description = video.descricao;

        li.innerHTML = `
            <img src="${video.thumb}" alt="${video.titulo}" />
            <span>${video.number}</span>
        `;

        li.addEventListener("click", () => {
            changeVideo(video.url, video.titulo, video.descricao);
            document
                .querySelectorAll(".video-item")
                .forEach((item) => item.classList.remove("ativo"));
            li.classList.add("ativo");
        });

        ul.appendChild(li);
    });

    // Iniciar com o primeiro vídeo
    if (videos.length > 0) {
        changeVideo(videos[0].url, videos[0].titulo, videos[0].descricao);
    }
}

// window.addEventListener("DOMContentLoaded", carregarVideos);
