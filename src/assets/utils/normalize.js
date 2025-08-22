function formatCategoryNo(no) {
  return `CA${String(no).padStart(3, "0")}`;
}

function formatActivityNo(no) {
  return `ACT${String(no).padStart(5, "0")}`;
}
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
function imageUrl(img) {
  if (!img) return "";
  if (/^https?:\/\//i.test(img)) return img;
  if (img.startsWith("/upload")) return `${VITE_API_BASE}${img}`;
  return `${VITE_API_BASE}/upload/activities-img/${img}`;
}

function normalizeActivity(r, baseUrl) {
  const img = r.ACTIVITY_IMG ?? r.activity_img ?? "";
  return {
    activity_no: formatActivityNo(r.ACTIVITY_NO ?? r.activity_no),
    activity_name: (r.ACTIVITY_NAME ?? r.activity_name ?? "").toLowerCase(),
    location: (r.LOCATION ?? r.location ?? "").toLowerCase(),
    activity_start_date: r.ACTIVITY_START_DATE ?? r.activity_start_date ?? "",
    activity_end_date: r.ACTIVITY_END_DATE ?? r.activity_end_date ?? "",
    category_no: formatCategoryNo(r.CATEGORY_NO ?? r.category_no ?? 0),
    activity_description: (r.ACTIVITY_DESCRIPTION ?? r.activity_description ?? "").toLowerCase(),
    activity_img: imageUrl(img, baseUrl),
     current_participant: r.CURRENT_PARTICIPANT ?? r.current_participant ?? null,
    max_participant: r.MAX_PARTICIPANT ?? r.max_participant ?? null,
    registration_deadline: r.REGISTRATION_DEADLINE ?? r.registration_deadline ?? "",
    participant_limitation: r.PARTICIPANT_LIMITATION ?? r.participant_limitation ?? "",
    host_member_id: r.HOST_MEMBER_ID ?? r.hoster_member_id ?? null,
    activity_status: r.ACTIVITY_STATUS ?? r.activity_status ?? "",
  };
}

export { formatCategoryNo, formatActivityNo, imageUrl, normalizeActivity };