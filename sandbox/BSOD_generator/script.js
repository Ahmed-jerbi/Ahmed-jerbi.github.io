function generateWallpaper() {
    var mainText = document.getElementById("mainTextInput").value;
    document.getElementById("mainText").textContent = mainText;

    var qrLink = document.getElementById("qrLinkInput").value;
    QRCode.toDataURL(qrLink, {
        width: 150,
        height: 150,
        color: {
            dark: "#0050A0", // Blue color for the QR code
            light: "#FFFFFF" // White background
        }
    }, function (err, url) {
        if (!err) {
            document.getElementById("qrCode").style.backgroundImage = 'url(' + url + ')';
        }
    });
}

function downloadImage() {
    var canvas = document.getElementById('canvas');
    var wallpaper = document.getElementById('wallpaper');
    
    html2canvas(wallpaper, {
        width: 1920,
        height: 1080,
        useCORS: true
    }).then(canvas => {
        var link = document.createElement('a');
        link.download = 'blue_screen_wallpaper.png';
        link.href = canvas.toDataURL();
        link.click();
    });
}

function toggleFullScreen() {
    var elem = document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
        document.getElementById('controls').style.display = 'none';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        document.getElementById('controls').style.display = 'flex';
    }
}

document.addEventListener('fullscreenchange', (event) => {
    var controls = document.getElementById('controls');
    if (document.fullscreenElement) {
        controls.style.display = 'none';
    } else {
        controls.style.display = 'flex';
    }
});

// Initialize default QR code
window.onload = function() {
    generateWallpaper();
};
