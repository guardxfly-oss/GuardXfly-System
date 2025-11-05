const CACHE_NAME = 'guardxfly-cache-v3'; // قم بتغيير الإصدار عند كل تحديث
const urlsToCache = [
    '/',
    'index.html',
    'manifest.json',
    '1.png',
    'https://fonts.googleapis.com/css2?family=Cairo:wght@700&display=swap',
    'https://i.pinimg.com/originals/a9/78/f0/a978f0f468660c3606ae57e635f0e3fe.gif', // loading gif
    'https://i.pinimg.com/originals/de/05/62/de0562e878a0311809c7f4325b6fcc85.gif', // attendance icon
    'https://i.pinimg.com/originals/f7/a7/37/f7a737bf63222fbf1eab122722dead5a.gif', // task icon
    'https://i.pinimg.com/originals/9c/fa/ff/9cfaffa1d831c52c90b3ba40536cdc1d.gif', // complaint icon
    'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif', // checkin success
    'https://i.pinimg.com/originals/85/35/46/853546ca4c9050eee517c7b803dcc9ae.gif', // checkout success
    'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif', // task success
    'https://i.pinimg.com/originals/74/cc/be/74ccbec32fe85564ab6599488d7294ad.gif'  // complaint success
];

// 1. تثبيت عامل الخدمة وتخزين الملفات
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                // استخدام addAll يتطلب أن تنجح جميع الطلبات. قد تحتاج إلى معالجة الأخطاء هنا.
                return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})));
            })
    );
});

// 2. تقديم الملفات من ذاكرة التخزين المؤقت
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // إذا وجد الملف في الكاش، قم بإرجاعه
                if (response) {
                    return response;
                }
                // وإلا، اطلبه من الشبكة
                return fetch(event.request);
            })
    );
});

// 3. حذف ذاكرة التخزين المؤقت القديمة عند التفعيل
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => Promise.all(
            cacheNames.map(cacheName => (cacheWhitelist.indexOf(cacheName) === -1) ? caches.delete(cacheName) : null)
        ))
    );
});