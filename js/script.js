function shortenUrl() {
    let urlInput = document.getElementById("urlInput");
    let expirationSelect = document.getElementById("expirationSelect");
    let urlListContainer = document.getElementById("urlListContainer");
    
    let originalUrl = urlInput.value.trim();
    let expirationTime = expirationSelect.value;

    if (originalUrl === "" || !originalUrl.startsWith("https://")) {
        alert("Please enter a valid URL starting with 'https://'.");
    return;
    }

    let domain = new URL(originalUrl).origin;
    let shortenedPathAndQuery = shortenPathAndQuery(new URL(originalUrl).pathname + new URL(originalUrl).search);
    let shortenedUrl = domain + shortenedPathAndQuery;
    let listItem = createListItem(originalUrl, shortenedUrl, shortenedPathAndQuery, expirationTime);
    urlListContainer.appendChild(listItem);

    saveToLocalStorage(urlListContainer.innerHTML);

    urlInput.value = "";

    if (expirationTime > 0) {
        setTimeout(function () {
            deleteListItem(listItem.querySelector("i"));
        }, expirationTime * 1000);
    }
    expirationSelect.selectedIndex = 0;
}

function createListItem(originalUrl, shortenedUrl, shortenedPathAndQuery, expirationTime) {
    let listItem = document.createElement("li");
    listItem.innerHTML = `<div class="link-item"><span onclick="displayOriginalUrl('${originalUrl}')">${shortenedUrl}</span><i class="fa fa-trash text-danger p-2 pointer" onclick="deleteListItem(this)"></i></div>`;
    listItem.setAttribute("data-original-url", originalUrl);
    listItem.setAttribute("data-shortened-path-query", shortenedPathAndQuery);
    listItem.setAttribute("data-expiration-time", expirationTime);
    return listItem;
}

function saveToLocalStorage(data) {
    localStorage.setItem("urlList", data);
}

function shortenPathAndQuery(pathAndQuery) {
    let desiredLength = 8;
    let pathSegments = pathAndQuery.split("/");
    let shortenedPath = pathSegments.length > 1 ? "/" + pathSegments[1] : "";
    if (shortenedPath.length < desiredLength) {
        shortenedPath += "0".repeat(desiredLength - shortenedPath.length);
    } else if (shortenedPath.length > desiredLength) {
        shortenedPath = shortenedPath.substring(0, desiredLength);
    }
    return shortenedPath;
}

function displayOriginalUrl(originalUrl) {
    document.getElementById("urlInput").value = originalUrl;
}

function deleteListItem(element) {
    let listItem = element.closest("li");
    let urlListContainer = document.getElementById("urlListContainer");
    urlListContainer.removeChild(listItem);
    saveToLocalStorage(urlListContainer.innerHTML);
}

function clearInput() {
    document.getElementById("urlInput").value = "";
}

window.onload = function () {
    let urlListContainer = document.getElementById("urlListContainer");
    let savedUrls = localStorage.getItem("urlList");
    if (savedUrls) {
        urlListContainer.innerHTML = savedUrls;
        let links = urlListContainer.querySelectorAll("li i");
        links.forEach(function (link) {
            let expirationTime = link.closest("li").getAttribute("data-expiration-time");
            if (expirationTime > 0) {
                setTimeout(function () {
                    deleteListItem(link);
                }, expirationTime * 1000);
            }
        });
    }
};