import { defineStore } from "pinia";

export const useGroupFormStore = defineStore("groupForm", {
  state: () => ({
    formData: {
      activity_name: '',
  category_no: '',
  location: '',
  registration_deadline: '',
  activity_start_date: null,
  activity_end_date: null,
  max_participant: null,
  min_participant: 1,
  fee_notes: '',
  activity_description: '',
  address: '',
  dateRange: [],
  participant_limitation:'',
  activity_img: null,
  image: {
      file: null,         // 原始 File 物件（之後上傳用）
      previewUrl: ''      // 預覽用的 Object URL 或 base64
    }    
, editCount: 0

    },
  }),
  actions: {
    setFormData(data) {
  Object.assign(this.formData, data)
  if (data?.image) {
    this.formData.image = data.image
  }
},
      setImage(file) {
    const img = this.formData.image
    if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl)

    if (!file) {
      this.formData.image = { file: null, previewUrl: '' }
      this.formData.activity_img = null
      return
    }

    this.formData.image.file = file
    this.formData.image.previewUrl = URL.createObjectURL(file)
    // 如果有另一個欄位存原檔，也在這裡同步
    this.formData.activity_img = file
  },

  clearImage() {
    const img = this.formData.image
    if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl)
    this.formData.image = { file: null, previewUrl: '' }
    this.formData.activity_img = null
  },
    
    resetFormData() {
  // 先釋放舊的預覽 URL，避免記憶體漏
  const img = this.formData.image
  if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl)

  // 不要換 reference，用 assign 重設內容
  Object.assign(this.formData, {
    activity_name: '',
    category_no: '',
    location: '',
    registration_deadline: '',
    activity_start_date: null,
    activity_end_date: null,
    max_participant: null,
    min_participant: 1,
    fee_notes: '',
    activity_description: '',
    address: '',
    dateRange: [],
    participant_limitation: '',
    activity_img: null,
    image: {
      file: null,
      previewUrl: ''
   }
      })
    },
     markEdited() { this.editCount++ }
  }
})
  
    
