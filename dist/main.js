const API_URL = "https://manti.vendicated.dev/api/reviewdb";
const USER = "1201415921802170388";
const LASTFM_API_KEY = "04f747e38bebf69efbbfab7b20612bac";
const LASTFM_USERNAME = "zyqunix";
//
const ageContainer = document.getElementById("age");
const reviewContainer = document.getElementById("reviews");
const recentContainer = document.getElementById("recentActivity");
//
async function fetchReviews(USER) {
    const response = await fetch(`${API_URL}/users/${USER}/reviews`);
    if (!response.ok)
        throw new Error(`Error fetching reviews: ${response.status} ${response.statusText}`);
    const data = await response.json();
    data.reviews = data.reviews.filter(r => r.id !== 0);
    return data.reviews;
}
//
const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: LASTFM_USERNAME,
    api_key: LASTFM_API_KEY,
    format: "json",
    limit: "4"
});
const url = `https://ws.audioscrobbler.com/2.0/?${params.toString()}`;
async function fetchLastfm(user) {
    let response = await fetch(url);
    if (!response.ok)
        throw new Error(`Eror fetching lastfm: ${response.status} ${response.statusText}`);
    response = response.json();
    return response;
}
//
let birthday = new Date('2008-12-13');
const now = new Date();
const diff = now.getTime() - birthday.getTime();
const age = diff / (1000 * 60 * 60 * 24 * 365.25);
const str = age.toFixed(2);
ageContainer.innerText = str.slice(0, 2);
//
let reviews = await fetchReviews(USER);
reviews.slice(0, 1).forEach(review => {
    const e = document.createElement("p");
    e.innerHTML = `“${review.comment}” – ${review.sender.username}`;
    reviewContainer.appendChild(e);
});
//
let lfm = await fetchLastfm(LASTFM_USERNAME);
lfm.recenttracks.track.slice(0, 4).forEach(track => {
    const e = document.createElement("p");
    e.style.borderColor = track["@attr"]?.nowplaying === "true" ? "#0176af" : "#e8e8e8";
    e.innerHTML = `
        <a href="${track.url}" target="_blank")>
            <div class="left-recent">
                <img style="width: 72px; border-radius: 4px" src="${track.image.find(img => img.size === "extralarge")?.["#text"] || "https://lastfm.freetls.fastly.net/i/u/64s/4128a6eb29f94943c9d206c08e625904.jpg"}">
            </div>
            <div class="right-recent">
                <strong>${track.artist["#text"]}</strong>
                <div class="track-name">${track.name}</div>
                <div>${track.album["#text"]}</div>
                <div style="font-size: 12px; font-weight: bold; color: #0176af)">${track["@attr"]?.nowplaying === "true" ? "Now Playing" : ""}</div>
            </div>
        </a>
    `;
    recentContainer.appendChild(e);
});
export {};
//# sourceMappingURL=main.js.map