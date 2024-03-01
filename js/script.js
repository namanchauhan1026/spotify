// Initialize variables
let currentSong = new Audio();
let songs;
let currentFolder;

// Function to format seconds into time
function formatSecondsToTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currentFolder = folder;

    try {
        let response = await fetch(`/${folder}/`);
        if (!response.ok) {
            throw new Error(`Failed to fetch songs. Status: ${response.status}`);
        }

        let html = await response.text();
        let div = document.createElement("div");
        div.innerHTML = html;
        let anchors = div.getElementsByTagName("a");

        songs = Array.from(anchors)
            .filter(element => element.href.endsWith(".mp3"))
            .map(element => element.href.split(`/${folder}/`)[1]);

        // Display songs in the playlist
        displayPlaylist();

        console.log("Songs fetched successfully:", songs);

        return songs; // return the songs array
    } catch (error) {
        console.error("Error fetching songs:", error);
        throw error;
    }
}

// Function to display songs in the playlist
function displayPlaylist() {
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";

    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                    <div>${song.replace(/%20/g, " ")}</div>
                    <div>Unknown</div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                </div>
            </li>`;
    }

    // Attach event listener to each song
    songUL.querySelectorAll("li").forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div:first-child").innerHTML);
        });
    });
}

// Function to play music with optional pause flag
function playMusic(track, pause = false) {
    // Pause the current song if it is playing
    if (!pause && !currentSong.paused) {
        currentSong.pause();
        play.src = "img/play.svg"; // Assuming play.svg is the play button icon
    }

    // Set the source for the new song
    currentSong.src = `/${currentFolder}/` + track;

    // Update song info
    document.querySelector(".songinfo").innerHTML = track;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

    // If not paused, play the new song
    if (!pause) {
        currentSong.play();
        play.src = "img/pause.svg"; // Assuming pause.svg is the pause button icon
    }

    // Add an event listener for the 'ended' event
    currentSong.addEventListener('ended', () => playNextSong());
}

// Listen for time update
currentSong.addEventListener('timeupdate', function () {
    document.querySelector('.songtime').innerHTML = `${formatSecondsToTime(currentSong.currentTime)}/${formatSecondsToTime(currentSong.duration)}`;
    document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';

    // Check if the current time is equal to the duration
    if (currentSong.currentTime >= currentSong.duration - 1) {
        // Simulate a click on the next button
        next.click();
    }

    // Check if the last song is played completely
    let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
    if (index === songs.length - 1 && currentSong.currentTime >= currentSong.duration - 1) {
        // Pause the song
        currentSong.pause();
        play.src = 'img/play.svg'; // Assuming play.svg is the play button icon
    }
});

// Function to load songs for a folder and play the first song
async function loadAndPlaySongs(folder) {
    // Load songs for the clicked folder
    songs = await getSongs(folder);
    // Play the first song in the new folder
    playMusic(songs[0], false);
    // Update the playlist display
    displayPlaylist();
}


















async function displayAlbums() {
    try {
        let a = await fetch(`/songs/`);
        let response = await a.text();
        let div = document.createElement("div");
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a");
        let cardContainer = document.querySelector(".cardContainer");
        let array = Array.from(anchors);

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
                let folder = e.href.split("/").slice(-2)[0];
                // Get the metadata of the folder
                let a = await fetch(`/songs/${folder}/info.json`);
                let response = await a.json();
                cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                stroke-linejoin="round" />
                        </svg>
                    </div>

                    <img src="/songs/${folder}/cover.jpeg" alt="">
                    <h2>${response.title}</h2>
                    <p>${response.description}</p>
                </div>`;
            }
        }

        // Add the "about" div after all cards
        let aboutDiv = document.createElement("div");
        aboutDiv.className = "about";
        aboutDiv.innerHTML = `
            <div class="dinoplay">
                <h1>About Dino Play</h1>
                <p>DinoPlay, a personal project and Spotify-inspired music website, is crafted for the sheer joy of learning and experimentation in web development. In this musical realm, users can explore a curated selection of songs, immersing themselves in the experience of playing and enjoying music. The creation of DinoPlay serves as a hands-on learning endeavor, allowing for the application of web development skills in a fun and functional context.</p>
            </div>
            <div class="developer">
                <h1>Developer</h1>
                <a href="https://namanchauhan1026.github.io/my-portfolio/">
                    <div class="dev-img">
                        <img src="img/dev.jpg" alt="">
                    </div>
                </a>
                <a target="_blank" href="https://namanchauhan1026.github.io/my-portfolio/"><h3>Naman Kumar</h3></a>
            </div>
            <div class="links">
                <h1>Contact Links</h1>
                <ul>
                    <li><img class="invert" src="img/gmail.svg" alt=""> namanchauhanvv@gmail.com</li>
                    <a target="_blank" href="https://www.instagram.com/naman.___chauhan/"><li><img class="invert" src="img/insta.svg" alt=""> Instagram</li></a>
                    <a target="_blank" href="https://www.linkedin.com/in/naman-kumar-015546231/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"><li><img class="invert" height="24px" src="img/linkdin.svg" alt=""> linkedin</li></a>
                    <a target="_blank" href="https://twitter.com/Naman___chauhan?t=K5CvVgIdb_LAd-0cAdv3kQ&s=09"><li><img class="invert" src="img/x.svg" alt=""> X</li></a>
                </ul>
            </div>
        `;

        cardContainer.appendChild(aboutDiv);

        // Load the playlist whenever a card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async () => {
                try {
                    if (e.classList.contains("about")) {
                        // Load songs from the "about" class
                        console.log("Loading songs from about class");
                        // You can add your logic for loading songs from the "about" class here
                    } else {
                        // Load songs from the clicked card
                        console.log("Fetching Songs");
                        songs = await getSongs(`songs/${e.dataset.folder}`);
                        playMusic(songs[0]);
                    }
                } catch (error) {
                    console.error("Error fetching songs:", error);
                }
            });
        });
    } catch (error) {
        console.error("Error displaying albums:", error);
    }
}






















// Function to filter search results
function filterSearchResults() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filteredSongs = songs.filter(song => song.toLowerCase().includes(searchTerm));

    if (searchTerm === '') {
        // If search field is blank, revert to the original state
        displayPlaylist();
    } else if (filteredSongs.length > 0) {
        // Display filtered songs
        songs = filteredSongs;
        displayPlaylist();
    } else {
        // No results found
        displayNoResults();
    }
}

// Function to display "No Results Found" message
function displayNoResults() {
    let songUL = document.querySelector('.songList ul');
    songUL.innerHTML = '<li class="no-match">No match found</li>';
}

// Function to handle keydown event
function handleKeyDown(event) {
    const searchInput = document.getElementById('searchInput');
    if (event.key === 'Backspace' && searchInput.value === '') {
        // If backspace is pressed and search input is empty, revert to the original state
        getSongs(currentFolder).then(displayPlaylist);
    }
}

// Function to handle search icon click
function handleSearchIconClick() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput.value !== '') {
        // If search input is not empty, filter the search results
        filterSearchResults();
    }
}

// Add event listeners for the search input and search icon
document.getElementById('searchInput').addEventListener('input', filterSearchResults);
document.getElementById('searchIcon').addEventListener('click', handleSearchIconClick);
document.getElementById('searchInput').addEventListener('keydown', handleKeyDown);

// Main function to set up the application
async function main() {
    // Get list of all the songs for the default playlist
    songs = await getSongs("songs/bhajan");

    // Play the first song in the playlist
    playMusic(songs[0], true);

    // Display all the albums on the page
    displayAlbums();

    // Attach event listeners
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        } else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    });

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${formatSecondsToTime(currentSong.currentTime)}/${formatSecondsToTime(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    });

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index - 1 >= 0) {
            playMusic(songs[index - 1]);
        }
    });

    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) {
            playMusic(songs[index + 1]);
        }
    });

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    });

    // Load the playlist whenever a card is clicked
    // ...

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async () => {
            try {
                console.log("Fetching Songs");
                songs = await getSongs(`songs/${e.dataset.folder}`);
                playMusic(songs[0]);
            } catch (error) {
                console.error("Error fetching songs:", error);
            }
        });
    });

    // ...

    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("img/volume.svg")) {
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg");
            currentSong.volume = 0.2;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 20;
        }
    });
}

// Run the main function to set up the application
main();
