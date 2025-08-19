import { defineStore } from "pinia";

const STORAGE_KEY = "groupForm:v1";
const MAX_AGE = 1000 * 60 * 60 * 72;

const emptyForm = () => ({
  activity_name: "",
  category_no: "",
  location: "",
  registration_deadline: null,
  activity_start_date: null,
  activity_end_date: null,
  max_participant: null,
  min_participant: 1,
  fee_notes: "",
  activity_description: "",
  address: "",
  dateRange: [],
  participant_limitation: "",
  activity_img: "",
   hasLimitation: false,   
   registration_start_date: null,
});

export const useGroupFormStore = defineStore("groupForm", {
  state: () => ({
    formData: emptyForm(),
    image: {
      // 專門處理圖片
      file: null, // File 物件（僅記憶體，刷新會消失）
      previewUrl: "", // base64（可存進 sessionStorage）
      filename: "",
      mime: "",
    },
    _savedAt: 0, // 存檔時間（用來判斷過期）
  }),

  actions: {
    resetForm() {
      this.formData = emptyForm();
      this.image = { file: null, previewUrl: "", filename: "", mime: "" };
      this._savedAt = 0;
      sessionStorage.removeItem(STORAGE_KEY);
    },
    setFormData(data) {
      this.formData = { ...this.formData, ...data };
    },
    async setImage(file) {
      // 檔案→base64，這樣刷新後預覽還在
      if (!file) {
        this.image = { file: null, previewUrl: "", filename: "", mime: "" };
        return;
      }
      const base64 = await fileToBase64(file);
      this.image = {
        file,
        previewUrl: base64,
        filename: file.name ?? "upload",
        mime: file.type ?? "image/*",
      };
    },
    saveDraft() {
      const payload = {
        formData: this.formData,
        image: {
          // 只存能序列化的資料（不要存 File）
          previewUrl: this.image.previewUrl,
          filename: this.image.filename,
          mime: this.image.mime,
        },
        _savedAt: Date.now(),
      };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        this._savedAt = payload._savedAt;
      } catch (e) {
        console.warn("sessionStorage 已滿或存檔失敗", e);
      }
    },
    _reviveDates(form) {
      const toDate = (v) => (v ? new Date(v) : null);
      const revived = { ...form };
      revived.registration_deadline = toDate(form.registration_deadline);
      revived.registration_start_date = toDate(form.registration_start_date);
      revived.activity_start_date = toDate(form.activity_start_date);
      revived.activity_end_date = toDate(form.activity_end_date);
      revived.dateRange = Array.isArray(form.dateRange)
        ? form.dateRange.map(toDate).filter(Boolean)
        : [];
      return revived;
    },
    loadDraft() {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      try {
        const data = JSON.parse(raw);
        if (MAX_AGE && Date.now() - (data._savedAt || 0) > MAX_AGE) {
          sessionStorage.removeItem(STORAGE_KEY);
          return false;
        }
        const merged = { ...emptyForm(), ...data.formData };
        this.formData = this._reviveDates(merged);
        this.image.previewUrl = data.image?.previewUrl || "";
        this.image.filename = data.image?.filename || "";
        this.image.mime = data.image?.mime || "";
        this._savedAt = data._savedAt || Date.now();
        return true;
      } catch (e) {
        sessionStorage.removeItem(STORAGE_KEY);
        return false;
      }
    },
  },
});

// 小工具：File -> base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
