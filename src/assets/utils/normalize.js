
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
function imageUrl(img) {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith("/upload")) return `${VITE_API_BASE}${img}`;
  return `${VITE_API_BASE}/upload/activities-img/${img}`;
}

function userImg(img) {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith("/upload")) return `${VITE_API_BASE}${img}`;
  return `${VITE_API_BASE}/upload/member/${img}`;
}

export { imageUrl, userImg};