const streamExtensions = [".m3u8", ".mp4", ".mkv", ".mpd"];
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    const isStream = streamExtensions.some(ext => url.includes(ext));
    if (isStream) {
      chrome.storage.local.get({ capturedLinks: [] }, function(result) {
        let links = result.capturedLinks;
        if (!links.includes(url)) {
          links.push(url);
          chrome.storage.local.set({ capturedLinks: links });
        }
      });
    }
  },
  { urls: ["<all_urls>"] }
);