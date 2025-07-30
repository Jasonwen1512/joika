<script setup>
import { reactive, ref, watch, toRefs } from 'vue';
import tinymce from 'tinymce/tinymce.js'
// import 'tinymce/models/dom'; (TinyMCE 6)
import Button from "@/components/Button.vue";


// 外觀
import 'tinymce/skins/ui/oxide/skin.css'
import 'tinymce/themes/silver'

// Icon
import 'tinymce/icons/default'

// 用到的外掛
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/emoticons/js/emojis.js';
import 'tinymce/plugins/table';
import 'tinymce/plugins/quickbars';

// 語言包
import 'tinymce-i18n/langs5/zh_TW.js'
// import 'tinymce-i18n/langs/zh_Hans.js' (TinyMCE 6 的簡體中文)

// TinyMCE-Vue
import Editor from '@tinymce/tinymce-vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  plugins: {
    type: [String, Array],
    default: 'quickbars emoticons table',
  },
  toolbar: {
    type: [String, Array],
    default:
      ' bold italic underline strikethrough | fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify|bullist numlist |outdent indent blockquote | undo redo | axupimgs | removeformat | table | emoticons',
  },
});

const emit = defineEmits(['update:modelValue']);

const init = reactive({
  language: 'zh_TW',
  height: 500,
  menubar: false,
  content_css: false,
  skin: false,
  plugins: props.plugins,
  toolbar: props.toolbar,
  quickbars_insert_toolbar: false,
  branding: false,
  placeholder: '請遵守社群規定，不得發表違規言論或進行違反法律之相關情事，如有違規需自負法律責任',

});

const { modelValue } = toRefs(props);
const editorValue = ref(modelValue.value);
const selectedCategory = ref('');

watch(modelValue, (newValue) => {
  editorValue.value = newValue;
});

watch(editorValue, (newValue) => {
  emit('update:modelValue', newValue);
});



const categories = [
  "登山",
  "水上活動",
  "運動",
  "露營",
  "唱歌",
  "展覽",
  "聚餐",
  "桌遊",
  "電影",
  "手作",
  "文化體驗",
  "演出表演",
  "其他"
];
</script>



<template>
  <main class="create">

<input class="titlebox" type="text" placeholder="請輸入文章標題" />
  <div class="category-btn-list">
      <Button :suffixIcon="no" theme="secondary" size="sm">揪團心得</Button>  
         <Button :suffixIcon="no" theme="info" size="sm">揪團心得</Button>
            <Button :suffixIcon="no" theme="info" size="sm">揪團心得</Button>
  </div>
  <div class="topic-category">
    <label >文章分類：</label>

    <select id="topic-category" name="category" v-model="selectedCategory">
        <option disabled value="">活動類型</option>
        <option v-for="(category, index) in categories" :key="index" :value="category">
          {{ category }}
        </option>
    </select>

  </div>
  <div class="text-editor">
  <editor v-model="editorValue" :init="init"></editor>
 </div>
 <div class="btn"><Button :suffixIcon="no" theme="info" size="md">送出</Button></div>
 </main>
</template>

<style scoped>
.create{
display: grid;
margin: 20px auto;
    max-width: 1200px;
    gap: 25px;
    align-content: space-around;
    justify-items: stretch;
    justify-content: center;
}
.titlebox {
    background-color: #fff;
    width: 100%;
    padding: 10px;
    border: 1px solid;
    border-radius: 3px;
    box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.2);
  
  
  }
 
  select{
     background-color: #fff;
    width: 100%;
    padding: 10px;
    border: 1px solid;
    border-radius: 3px;
  }
  .category-btn-list{

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
}
.button-wrapper {
    height: fit-content;
    width: auto;
    display: flex
;
    justify-content: center;
}



</style>