// الكلمات الدلالية والصيغ الشائعة للبث المباشر والمسلسلات
const streamKeywords = [".m3u8", ".mp4", ".mkv", ".mpd", "playlist", "manifest", "/hls/", "stream", "get_video"];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    
    // فحص ما إذا كان الرابط يحتوي على أي كلمة دلالية للبث
    const isStream = streamKeywords.some(keyword => url.toLowerCase().includes(keyword));
    
    // استبعاد الروابط الإعلانية الشائعة أو ملفات الـ الجافاسكريبت والصور لعدم ملء القائمة بالقمامة
    const isGarbage = url.includes(".js") || url.includes(".css") || url.includes(".png") || url.includes(".jpg") || url.includes("google-analytics");

    if (isStream && !isGarbage) {
      chrome.storage.local.get({ capturedLinks: [] }, function(result) {
        let links = result.capturedLinks;
        
        // منع التكرار وحفظ الرابط
        if (!links.includes(url)) {
          links.push(url);
          chrome.storage.local.set({ capturedLinks: links });
          
          // تغيير أيقونة الإضافة أو إرسال إشعار صغير في الكونسول للتأكد من أنه يعمل
          console.log("🎯 تم اصطياد رابط بنجاح: ", url);
        }
      });
    }
  },
  { urls: ["<all_urls>"] }
);
