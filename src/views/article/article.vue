<script setup>


import Button from "@/components/Button.vue";

import { ref, computed ,watch} from "vue";
import konanImage from '@/assets/img/article/movie_konan.jpg';
import ArticleDetail from "./article-detail.vue";


//banner的跑馬燈

// ==========================================================
//  Banner 跑馬燈的最終解決方案：使用 import.meta.glob
// ==========================================================

// 1. 使用 `@` 別名同步載入 banner 資料夾下的所有圖片模組。
//    { eager: true } 是關鍵，它確保我們能立即拿到 URL。
const imageModules = import.meta.glob('@/assets/img/article/banner/*', { eager: true });
console.log("【Vite 找到的 Banner 圖片列表】:", imageModules);


// 2. 建立一個新的 getImageUrl 函式，用來從上面的對照表中查找路徑。
function getImageUrl(name) {
  // 根據 console.log 的結果，我們知道 key 的格式是 `/src/assets/...`
  // 所以我們拼接路徑時，也要使用相同的格式！
  const path = `/src/assets/img/article/banner/${name}`; // <--- 這是唯一的修改！

  // 後面的邏輯保持不變
  return imageModules[path]?.default || '';
}

  const baseActivities = [
  { label: "登山", color: "#56DD61", img: getImageUrl("banner_climbing.png") },
  { label: "水上活動", color: "#81BFDA", img: getImageUrl("banner_diving.png") },
  { label: "運動", color: "#567ADD", img: getImageUrl("banner_sports.png") },
  { label: "露營", color: "#F05ECC", img: getImageUrl("banner_camping.png") },
  { label: "唱歌", color: "#FADA7A", img: getImageUrl("banner_sing.png") },
  { label: "展覽", color: "#FF7F5B", img: getImageUrl("banner_exhibition.png") },
  { label: "聚餐", color: "#FFB65D", img: getImageUrl("banner_Dinner.png") },
  { label: "桌遊", color: "#F5F0CD", img: getImageUrl("banner_board_games.png") },
  { label: "電影", color: "#B1F0F7", img: getImageUrl("banner_movie.png") },
  { label: "手作", color: "#DBF964", img: getImageUrl("banner_Handmade.png") },
  { label: "文化體驗", color: "#6AF6C5", img: getImageUrl("banner_culturalHxperience.png") },
  { label: "演出表演", color: "#EA64FF", img: getImageUrl("banner_live.png") },
  { label: "其他", color: "#969696", img: getImageUrl("cpboy.svg") }
];
const activities = [...baseActivities, ...baseActivities, ...baseActivities];

//靜態資料文章分類
const categories = [
  "全部",
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
//靜態資料-文章內容
const articleList = [

    {
    postId:"PST-000001",
    userId:	"M001",
    date: '2025/3/15 PM11:48 ',
    title: '第一次夜衝合歡山！星星多到爆炸',
    event:'登山',
   image: konanImage, 
    content: '昨天晚上跟幾個大學同學衝上合歡山看星星，本來還擔心會不會太冷、太累，結果完全值得！！<br>半夜開車有點刺激哈哈，一邊聽歌一邊聊天就到了。<br>最驚喜的是凌晨三點多，整個天空滿滿的銀河，完全沒有光害，超壯觀，人生第一次看到這麼清楚的星空。<br>大家還帶了泡麵跟熱可可，坐在車旁邊邊吃邊看星星，有種小時候看動畫的感覺不過提醒大家，上山真的要注意保暖，我穿了發熱衣+羽絨外套還是有點抖…<br>如果你也想體驗什麼叫做「被星星包圍」，真的可以試一次夜衝！'
  },
   {
    postId:"PST-000002",
    userId:	"M0002",
    date: '2025/4/20 PM9:07',
    title: '陌生人也能變朋友！第一次桌遊揪團超出預期'
,event:'桌遊',
image: konanImage, 
    content: '身為業務員，平常接觸超多人，但很多時候反而更想認識一些**「無壓力的新朋友」**。<br>上週剛好在 Juika 上看到有人發起桌遊揪團，我就鼓起勇氣報名了～<br>結果整個過程超級驚喜我們約在中山站附近的桌遊店，空間舒適又不限時，一開始還有點尷尬，<br>但只要開始玩狼人殺，氣氛馬上破冰！<br>大家超有戲，還有一個設計師大哥模仿警長口條笑死我玩到最後還交換了 IG，有人說下次想開個「劇本殺主題場」，我馬上說+1！如果你也想拓展生活圈、又不想太有壓力，真的可以試試 JOIKA 上的這種主題揪團，跟網路交友完全不同的感覺，而且安全又安心！'
  },
  { postId:"PST-000003",
    userId:	"M0003",
    date:"2025/4/20 PM9:07",
    title:"我不懂為什麼要那麼嚴格，只是晚到一下也要罵人？",
    event:"其他",
image: konanImage, 
    content:'上週六參加了一場登山跟團，是在這個平台上報名的。活動整體不錯，但我必須說，有些帶團的人態度真的可以不要那麼兇。我只是因為公車誤點，遲到了大概30分鐘，一到現場就一直被帶隊的大哥念：「下次別來了」「你這樣很自私」。這到底什麼態度？我也是花錢報名的，難道參加活動就要被羞辱？而且我們最後還不是照原定路線出發？一點都沒耽誤時間。為什麼揪團變成一種壓力來源？我覺得這樣的團不如不要辦，如果不能包容一點小狀況，那乾脆寫清楚遲到就會被罵、被趕走。我只是把自己遇到的狀況說出來，可能很多人會覺得我不對，但我不覺得有必要為了30分鐘被羞辱整路。'
  },
 {postId:"PST-000004", 
    userId:	"M0004",
    date:"2025/6/2 PM2:10",
    title:"【新手必讀】淺水潛水三大關鍵技巧，一次上手不慌張！",
    event:"水上活動",
image: konanImage,     content:'這幾年台灣越來越多人對潛水有興趣，但很多初學者會在第一次下水時緊張或手忙腳亂，甚至對「自由潛水」和「水肺潛水」分不清楚。我從 2018 年開始教學生潛水課程，累積不少經驗，也觀察到新手常見的三個問題。<br>今天簡單整理一下，給想入門的你參考：<br>一、別忽略耳壓平衡淺水不代表風險低，下潛過程中若不及時做耳壓平衡，耳膜會感到刺痛甚至受傷。每下潛一公尺，請主動捏鼻子輕輕出氣。<br>二、呼吸要穩定，別憋氣很多人緊張就憋氣，其實這是最危險的反應。穩定呼吸才是安全下潛的關鍵，就算在水下感覺心跳加快，也要專注放鬆節奏。<br>三、潛伴制度一定要記得永遠不要一個人下水。即便是在岸邊練習，也需要有潛伴互相注意狀況，這是國際潛水守則中最基本的一條。<br>這篇文章是給完全沒學過但想試試的人看的，如果你也有類似問題，歡迎留言我會回覆；另外我近期會開一場「基礎淺水體驗團」，有興趣也可以預約參加。'
  },
   {postId:"PST-000006", 
    userId:	"M0006",
    date:"2025/3/24 PM8:55",
    title:"久違了的全場籃球！運動揪團真的找對地方了",
    event:"運動",
image: konanImage,     content:'研究所生活忙碌到快忘了什麼叫運動，還好這陣子朋友推薦我用 JOIKA 找運動團，意外發現每週都有固定的籃球揪團，地點就在師大體育館，超方便！一開始還有點擔心氣氛會不會太競技，但其實大家都滿有共識，屬於「能認真打、也能放鬆玩」的那種風格。報名制度也很清楚，額滿就關團，不會現場一堆人卡位。<br>這次打的是全場 5v5，隊友配合默契不錯，而且完全不會有那種「只傳給朋友」的現象，大家互傳互動滿流暢。中場休息時也會聊一下各自怎麼知道這個揪團的，才知道有不少人其實是工程師或研究員，甚至有兩個是第一次參加。蠻推薦這種半固定的揪團，適合想保持運動習慣又不想太競爭的朋友。有興趣的人可以在活動分類裡搜尋「每週籃球週五夜場」，真的值得試一次！'
  },{postId:"PST-000007", 
    userId:	"M0007",
    date:"2025/7/15 PM4:30",
    title:"午後老屋，光影與味蕾的對話",
    event:"聚餐",
image: konanImage,     content:'走進這間藏身巷弄的老屋餐廳，像是穿越了時光隧道。斑駁的木門輕輕推開，陽光從窗櫺灑落，斑駁光影在桌面上跳動，像是在講述一段被時間遺忘的故事。座位旁擺放著老式收音機和幾本泛黃的書籍，空氣中混合著淡淡的咖啡香與陳年的木頭味。這裡的招牌手作鹹派，是一場味覺的旅行。酥脆的派皮裡包裹著溫潤的奶油和香濃的菠菜，搭配一杯微酸的黑咖啡，簡單卻滿足。作為攝影師，最愛捕捉這種光影與空間的細膩變化。旅途中偶然發現的這片靜謐，是讓心靈得以喘息的港灣。<br>若你也喜歡細細品味生活，不妨來這裡坐坐，感受老屋的溫度，聽聽時間的聲音。'
  },
  {postId:"PST-000008", 
    userId:	"M0008",
    date:"2025/7/20 AM10:45",
    title:"第一次露營團體驗：學會和自然一起呼吸",
    event:"聚餐",
image: konanImage,     content:'身為工程師，平常大多時間坐在電腦前，<br>這次報名了JOIKA的新手露營團，完全是想要跳脫日常，親近大自然。<br>雖然對露營一竅不通，但幸好團裡有經驗豐富的夥伴，讓我快速學會搭帳篷、整理裝備。<br>夜晚圍著營火聊天，聽著蟲鳴鳥叫，感覺整個世界都安靜了下來。第一次在戶外睡覺，雖然有點冷，但卻特別自在。還嘗試了自己生火煮泡麵，成就感滿滿。<br>這次團體裡大家都很友善，互相幫忙、分享裝備，讓新手感覺不到壓力。<br>最喜歡的是大家一起觀察星空，那片無垠的銀河，比城市裡看到的星星多上好幾倍。<br>新手露營團絕對推薦給想試試看又怕麻煩的人，JOIKA的活動安排很貼心，讓我這種小白也能輕鬆上手。期待下一次露營，再更自在地和自然相處。'
  },
    {postId:"PST-000009", 
    userId:	"M0009",
    date:"2025/7/20 AM10:45",
    title:"台南淨灘初體驗：從海岸線開始守護家鄉",
    event:"水上活動",
image: konanImage,     content:'身為土生土長的台南人，長年習慣在海邊散步，這次參加JOIKA組織的淨灘活動，才真正感受到保護環境的重要性。沿著台南安平海岸線，我們一群志同道合的朋友，拿著手套和垃圾袋，仔細地將塑膠瓶、菸蒂、包裝紙等垃圾一一撿起。看著平時美麗的海岸線被這些不起眼的垃圾侵蝕，心裡不免有些沉重。作為設計師，我也在想，或許我們可以用創意來提醒更多人愛護海洋，比如設計更友善環境的包裝，或是創作宣導海洋保護的插畫。淨灘不只是撿垃圾，更是一場與大自然的對話，提醒自己從生活小事做起，才能守護我們共有的家園。很感謝JOIKA提供這樣的平台，讓台南人能凝聚力量，一起為環境盡一份力。期待未來還有更多這樣有意義的活動，一起加入吧！'
  },
      {postId:"PST-00010", 
    userId:	"M0010",
    date:"2025/7/20 AM10:45",
    title:"登山紀錄 — 普普通通的一次爬山",
    event:"登山",
image: konanImage,     content:'這次去爬了附近的一座山，路線還算簡單。<br>天氣還行，沒下雨也沒太陽。<br>走路的時候沒什麼特別的感覺，<br>也沒看到什麼特別的風景，偶爾聽到幾隻鳥叫聲。<br>休息的地方挺普通，沒什麼特別好說的。<br>帶的水和點心都吃完了。<br>整體來說，就是一次平淡無奇的登山經驗。'
  },
        {postId:"PST-00011", 
    userId:	"M0011",
    date:"2025/7/20 AM10:45",
    title:"今年的柯南電影值得看嗎？",
    event:"電影",
image: konanImage,     content:'身為一個每年都會朝聖名偵探柯南劇場版的老觀眾，我今年還是乖乖地走進了電影院。這次的劇場版《名偵探柯南：紅之狙擊者》，主打的是懸疑與爆破場面雙強結合，劇情圍繞一樁暗殺事件與新角色的登場。整體來說，我認為劇情節奏是OK的，該緊湊的地方也有緊湊，不過在情感層面的鋪陳稍微弱了一些，柯南與灰原的互動也偏少（有點小失望）。但畫面質感比往年還更有電影感，特別是動作場面和音樂搭配非常有張力。值得一提的是，這次的主題曲我很喜歡，搭配片尾畫面會讓人稍微感動一下。整體而言，雖然不是我心目中的Top 3，但對於系列粉絲來說，還是值得一看。如果你不是很熟柯南系列，也能看懂大部分劇情，但要有心理準備，人物真的很多。今年這部，我給 7.5分/10。'
  },
          {postId:"PST-00011", 
    userId:	"M0012",
    date:"2025/5/8 AM7:22",
    title:"陽明山七星山日出團大推",
    event:"登山",
image: konanImage,     content:'第二次參加Kevin的登山團了！上次爬大屯山就覺得他很專業，這次七星山也沒讓人失望。凌晨3點集合確實辛苦，但Kevin準備的路線圖和注意事項都很詳細。同團有個阿姨腳力比我還好，真的很佩服！日出時刻大家一起在山頂看台北甦醒的感覺超棒，Kevin還帶了保溫瓶請大家喝熱咖啡。雖然下山後腿軟了一整天，但這種體驗真的無價'
  },

          {postId:"PST-000019", 
    userId:	"M0013",
    date:"2025/3/22 PM8:15",
    title:"德式桌遊工作坊超值體驗！",
    event:"桌遊",
image: konanImage,     content:'在西門町的桌遊咖啡廳參加了6小時的德式桌遊工作坊，真的收穫滿滿！團主阿華是資深玩家，規則講解很清楚，還會分析每個遊戲的策略重點。玩了《農家樂》、《電力公司》、《波多黎各》三款經典，每款都有不同的樂趣。同團的人都很Nice，大家互相討論策略，氣氛很棒。雖然6小時下來有點累，但學到很多，現在已經買了《農家樂》準備跟朋友玩啦！450元真的很值得'
  },
        
         {postId:"PST-000020", 
    userId:	"M0015",
    date:"2025/4/17 PM11:55",
    title:"狼人殺新手被虐記",
    event:"桌遊",
image: konanImage,     content:'說是新手友善結果完全不是這樣！團主Linda雖然人很好，但同團有幾個老鳥玩家完全不給新手機會，一直用很複雜的進階技巧。我第一輪就被票出去，後面幾乎都在旁邊看戲...雖然有學到一些，但整體體驗不太好。建議團主之後可以把新手和老手分開，或是多控制一下遊戲節奏。不過KTV包廂的環境不錯，飲料零食也夠，就是遊戲體驗需要改進。'
  },

         {postId:"PST-000028", 
    userId:	"M0017",
    date:"2025/4/15 PM7:55",
    title:"攀岩體驗課程推薦！",
    event:"運動",
image: konanImage,     content:'第一次嘗試攀岩就愛上了！<br>團主阿翔是認證教練，安全講習很仔細，裝備檢查也很確實。<br>從最簡單的路線開始，循序漸進讓我們建立信心。同團有個女生一開始很害怕，但在大家鼓勵下最後也成功攻頂，超感動的！<br>3小時的課程安排得很充實，既有挑戰性又很安全。雖然手臂痠痛了幾天，但那種克服恐懼的感覺真的很棒！已經決定要繼續學下去了'
  },
 
  {postId:"PST-000031", 
    userId:	"M0019",
    date:"2025/4/15 PM7:55",
    title:"瑜珈日出團心靈療癒之旅",
    event:"運動",
image: konanImage, 
    content:'在陽明山頂看日出做瑜珈，真的是很特別的體驗！<br>凌晨5點集合雖然辛苦，但看到太陽緩緩升起的瞬間，所有疲累都消失了。<br>老師Sophie引導得很好，呼吸配合動作，整個人都很放鬆。<br>山頂的空氣超棒，做完瑜珈後享用簡單早餐，感覺身心靈都被療癒了。<br>同團的姊妹們也都很正面，大家一起看日出的畫面超美<br>雖然要早起，但這種體驗真的值得！'
    },
      {postId:"PST-000038", 
    userId:	"M0020",
    date:"2025/5/16 PM8:08",
    title:"親子露營樂園超適合帶小孩",
    event:"露營",
image: konanImage, 
    content:'帶5歲女兒參加的親子露營，安排得很棒！<br>營區有完善的遊樂設施和戲水池，小朋友玩得超開心。<br>晚上的DIY活動很有趣，我們一起做了風鈴，女兒很有成就感。<br>其他家庭的小朋友也很好相處，大家一起玩得很融洽。<br>營火晚會時間，小朋友們圍成圈唱歌跳舞，畫面超溫馨<br>團主考慮得很周到，連兒童餐具都有準備。<br>這種親子活動真的很棒，增進了我們的感情！'
    },
              {postId:"PST-000036", 
    userId:	"M0020",
    date:"2025/3/10 AM9:15",
    title:"森林秘境露營超療癒！",
    event:"露營",
image: konanImage, 
    content:'太平山的檜木林真的太美了！<br>一進到森林就聞到清香的木頭味，整個人都放鬆下來。<br>團主小綠很有經驗，帶我們認識各種植物，還教了很多野外知識。<br>晚上的篝火談心時間超棒，大家分享人生故事，感覺心靈都被洗滌了。雖然山上比較冷，但準備的裝備很齊全。清晨被鳥鳴聲喚醒的感覺真的很幸福<br> 已經跟幾個團員約好下次再一起露營！<br>'
    },
  
     {postId:"PST-000044", 
    userId:	"M0020",
    date:"2025/3/18 PM11:20",
    title:"KTV歡唱聚會認識新朋友！",
    event:"唱歌",
image: konanImage, 
    content:'信義區KTV包廂4小時唱到爽！<br>團主Amy很會炒氣氛，選的歌單也很棒，從經典老歌到最新流行歌都有。同團的人都很放得開，大家輪流當麥霸超好笑😂特別是有個大哥唱台語歌超有感情，整個包廂都被他感動。<br>酒水飲料無限暢飲，小點心也不錯。雖然隔天喉嚨有點沙啞，但真的很開心！<br>已經加了大家LINE群組，約好下次再來！'
    },
         {postId:"PST-000045", 
    userId:	"M0020",
    date:"2025/4/12 PM9:45",
    title:"Live House駐唱初體驗緊張刺激",
    event:"唱歌",
image: konanImage, 
    content:'第一次在Live House表演，超級緊張但也很興奮！<br>團主小傑很貼心，會事先教大家怎麼使用音響設備。<br>雖然只有5分鐘表演時間，但準備過程就很有趣。<br>現場觀眾很友善，會給掌聲鼓勵。<br>我唱了《擁抱》，雖然有點小失誤但整體還不錯。<br>看其他人表演也很精彩，有唱有彈有說話，每個人都有不同風格。<br>這種體驗真的很特別，推薦給想挑戰舞台的朋友'
    },
             {postId:"PST-000052", 
    userId:	"M0020",
    date:"2025/3/25 PM4:42",
    title:"當代藝術館導覽大開眼界！",
    event:"展覽",
image: konanImage, 
    content:'完全沒想到現代藝術可以這麼有趣！<br>導覽員Sister真的很專業，把每件作品的創作理念解釋得很清楚。特別是那個互動式裝置藝術，親自體驗後才理解藝術家想表達的意境。<br>同團的人提出的問題也很有深度，導覽員都能詳細回答。心得分享時間讓大家交流不同的感受，很有收穫。展覽手冊做得很精美，回家還可以慢慢回味'
    },
                 {postId:"PST-000054", 
    userId:	"M0020",
    date:"2025/5/12 PM2:25",
    title:"科學教育館互動超好玩",
    event:"展覽",
image: konanImage, 
    content:'帶著好奇心去參加，結果玩得比小朋友還瘋😂各種科學實驗裝置都很有趣，特別是那個電磁實驗，看到磁力線瞬間覺得物理變有趣了！導覽員會鼓勵大家動手操作，不只是看而已。<br>同團有幾個理工背景的人，會補充一些專業知識，學到更多。科學小禮品是個可愛的萬花筒，現在放在桌上當裝飾。這種寓教於樂的活動真的很棒！'
    },
                     {postId:"PST-000060", 
    userId:	"M0020",
    date:"2025/3/20 PM6:55",
    title:"SUP立槳衝浪初體驗超讚！",
    event:"水上活動",
image: konanImage, 
    content:'在墾丁南灣的SUP體驗真的太棒了！教練阿海很有耐心，從基礎平衡開始教，讓我這個旱鴨子也能站在板上划行。一開始一直掉下水，但教練和同團的人都很鼓勵我。當我第一次成功站穩划出去的時候，真的超有成就感！<br>夕陽時分在海上看風景，整個心情都被療癒了!海鮮BBQ也很棒，新鮮又好吃。雖然全身痠痛，但這種體驗真的值得！'
    },

                     {postId:"PST-000061", 
    userId:	"M0020",
    date:"2025/3/20 PM6:55",
    title:"溯溪探險刺激過癮",
    event:"水上活動",
image: konanImage, 
    content:'花蓮三棧溪的溯溪真的是腎上腺素飆升！<br>天然滑水道超刺激，一開始有點害怕但試過一次就上癮了<br>跳水的部分更是考驗膽量，雖然教練確保安全，但站在石頭上往下看還是會腿軟。<br>同團的人都很勇敢，大家互相鼓勵挑戰極限。<br>峽谷風景美到不行，清澈的溪水和巨大岩石形成天然美景。<br>雖然裝備有點重，但專業教練讓人很安心。<br>推薦給喜歡刺激的朋友！'},
                     {postId:"PST-000071", 
    userId:	"M0020",
    date:"2025/3/20 PM6:55",
    title:"素食料理聚會意外好吃",
    event:"聚餐",
image: konanImage, 
    content:'原本對素食沒什麼期待，但這家有機餐廳真的改變了我的想法！創意蔬食料理做得比肉還香，特別是那道素食牛排，口感層次很豐富。營養師的健康講座也很實用，學到很多飲食知識。同桌都是健康意識很高的人，聊天內容很正面。養生茶飲也很棒，喝起來很清香~雖然份量不算大，但營養均衡，吃完身體很輕盈！'},
  {postId:"PST-000074", 
    userId:	"M0020",
    date:"2025/3/31 PM10:15",
    title:"某餐廳根本是詐騙集團！",
    event:"聚餐",
image: konanImage, 
    content:'參加聚餐活動被帶到雷店！！！<br>菜單上寫龍蝦結果上來是龍蝦風味蟹肉棒 <br>服務費15%但服務爆差，上菜慢到不行，問個問題還要翻白眼！<br>最誇張的是結帳時還要加收什麼包廂清潔費，根本沒寫在菜單上！<br>團主說跟餐廳有合作關係，感覺就是在坑團員的錢！<br>這種黑心餐廳建議大家列入拒絕往來戶！'},

      {postId:"PST-000077", 
    userId:	"M0020",
    date:"2025/3/16 PM10:45",
    title:"經典老片欣賞會很有深度",
    event:"電影",
image: konanImage, 
    content:'光點台北重映黑澤明的《七武士》，真的是電影史上的經典！影評人的導讀分析很精彩，讓我對電影美學有了更深的理解。同場的電影愛好者提出的觀點都很有見地，討論過程很有收穫。<br>雖然是黑白片而且很長，但劇情緊湊完全不會無聊。映後座談讓大家交流感想，氣氛很棒<br>推薦給喜歡藝術電影的朋友！'},

 {postId:"PST-000085", 
    userId:	"M0020",
    date:"2025/3/30 PM5:20",
    title:"陶藝拉坯體驗超療癒",
    event:"手作",
image: konanImage, 
    content:'在鶯歌老街的陶藝工坊體驗拉坯，真的很有禪意！<br>陶藝師一對一指導很有耐心，看著泥土在手中慢慢成形，整個人都很放鬆。<br>雖然我做出來的碗歪七扭八，但老師說這就是手作的魅力<br>同團的阿姨們手很巧，做出來的作品都很美。<br>老街導覽也很有趣，了解了陶瓷的歷史文化。<br>作品要等一個月燒製完成，很期待收到成品！'},

     {postId:"PST-000086", 
    userId:	"M0020",
    date:"2025/4/19 PM9:33",
    title:"皮革工藝製作有成就感",
    event:"手作",
image: konanImage, 
    content:'手縫皮革錢包真的需要很大的耐心！義大利進口真皮質感很好，老師教的裁切和縫製技巧很實用。雖然手縫很累，但看著錢包一針一線成形很有成就感。同班的人都很認真，大家互相幫忙穿線打洞。<br>染色的部分很有趣，可以調出自己喜歡的顏色。雖然花了一整天，但完成的作品真的很有紀念價值，現在每天都在用自己做的錢包！'},

      {postId:"PST-000093", 
    userId:	"M0020",
    date:"2025/3/21 PM3:42",
    title:"文學館作家講座很有深度",
    event:"文化體驗",
image: konanImage, 
    content:'知名作家親自分享創作歷程真的很難得！<br>從文學發展脈絡到個人創作理念，每個部分都很精彩。<br>Q&A時間作家回答問題很用心，還分享了很多寫作技巧。<br>同場的文學愛好者提出的問題都很有深度，討論很熱烈<br>簽書會排隊人很多，但作家很親切，還會跟每個人聊幾句。<br>文學紀念品質感不錯，整體活動很值得！'},

    {postId:"PST-000094", 
    userId:	"M0020",
    date:"2025/4/16 PM8:25",
    title:"新媒體藝術體驗前衛有趣",
    event:"文化體驗",
image: konanImage, 
    content:'VR和AR藝術體驗真的開了眼界！<br>科技與藝術結合產生的效果超乎想像，互動投影讓人感覺置身另一個世界。技術講解很專業，了解了很多新媒體藝術的創作原理。工作坊讓我們親自操作設備，雖然有點複雜但很有趣同團的年輕人對科技都很敏感，交流起來很有趣。<br>這種前衛藝術確實需要時間消化理解'},

      {postId:"PST-000101", 
    userId:	"M0020",
    date:"2025/4/16 PM8:25",
    title:"街頭音樂會氣氛超棒",
    event:"演出表演",
    image: konanImage, 
    content:'西門町的街頭音樂表演真的很有活力！<br>各種音樂風格都有，從民謠到搖滾應有盡有。<br>表演者都很有才華，現場演奏的感染力比錄音強太多<br>觀眾互動很熱烈，大家一起打拍子唱歌很嗨。<br>雖然站了兩小時有點累，但這種現場音樂的魅力無法抵擋。<br>小費箱裡投了200元支持音樂人，希望他們繼續創作！'},

          {postId:"PST-000102", 
    userId:	"M0020",
    date:"2025/4/11 PM10:15",
    title:"小劇場演出很有創意",
    event:"演出表演",
    image: konanImage, 
    content:'黑盒子劇場的實驗性戲劇真的很前衛！<br>演員的表演很投入，雖然劇情有點抽象但很有想像空間。舞台設計簡約但很有意境，燈光音效配合得很好!同場觀眾的反應很熱烈，散場後大家都在討論劇情含義。雖然票價不便宜，但支持原創戲劇很有意義。演後座談讓觀眾和創作者直接對話，很珍貴的體驗！'},


  ]
//分類顏色
  const eventColorMap = {
  "登山": "#56DD61",
  "水上活動": "#81BFDA",
  "運動": "#567ADD",
  "露營": "#F05ECC",
  "唱歌": "#FADA7A",
  "展覽": "#FF7F5B",
  "聚餐": "#FFB65D",
  "桌遊": "#F5F0CD",
  "電影": "#B1F0F7",
  "手作": "#DBF964",
  "文化體驗": "#6AF6C5",
  "演出表演": "#EA64FF",
  "其他": "#969696"
};

const getEventColor = (eventName) => {
  return eventColorMap[eventName] || '#adb5bd';
};

//  狀態
const activeCategory = ref("全部");
const currentPage = ref(1); // 預設第 1 頁
const articlesPerPage = 4;
//計算文章分類並排序
const filteredArticles = computed(() => {
  const filtered = (activeCategory.value === "全部")
    ? articleList
    : articleList.filter(a => a.event === activeCategory.value);
    
  return filtered.slice().sort((a, b) => {
    // 輔助函式：用來將 'YYYY/M/D PMH:MM' 格式重組為 'YYYY/M/D H:MM PM'
    const reformatDate = (dateString) => {
      // 1. 去掉前後空格，並用空白分割字串
      const parts = dateString.trim().split(' '); // e.g., ["2025/3/15", "PM11:48"]
      
      // 2. 處理時間部分
      const timeStr = parts[1]; // e.g., "PM11:48"
      const indicator = timeStr.substring(0, 2); // "PM"
      const time = timeStr.substring(2); // "11:48"

      // 3. 重新組合成 new Date() 可以解析的標準格式
      const standardFormat = `${parts[0]} ${time} ${indicator}`; // "2025/3/15 11:48 PM"
      
      return new Date(standardFormat);
    };

    return reformatDate(b.date) - reformatDate(a.date);
  });
});
// 計算頁數
const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / articlesPerPage)
);


// 取得當前頁要顯示的文章

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * articlesPerPage;
  return filteredArticles.value.slice(start, start + articlesPerPage);
});


// 換頁 function
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}
//換分類
function setActive(category) {
  activeCategory.value = category;
}
//回第一頁
watch(activeCategory, () => {
  currentPage.value = 1;
});


//我要發文按鈕
const ula = () => {
  alert('我要發文烏拉');
  // 在這裡可以加入跳轉到發文頁面的邏輯，例如使用 Vue Router
  // router.push('/create-post');
  }

</script>

<template>
  <!-- 熱門文章頁 -->
  <div>這是熱門文章頁</div>
  <!-- banner的跑馬燈 -->
    <section id="marquee">
    <div class="view">
      <div class="pic-container">
        <div
          class="pic"
          v-for="(item, index) in activities"
          :key="index"
          :style="{ backgroundColor: item.color }"

        >
                <h3>{{ item.label }}</h3>

          <img :src="item.img" :alt="item.label" />
        </div>
      </div>
    </div>
  </section>

  <main class="artic">
    <div class="title">
      <h2>文章列表</h2>
    </div>
<!-- 文章類別 -->
    <section class="articleCategory">
      <div class="categoryList">
        <div
          v-for="(cat, index) in categories"
          :key="index"
          :class="['categoryLabel', { active: cat === activeCategory }]"
          @click="setActive(cat)"
        >
          {{ cat }}
        </div>
      </div>

      <Button :onClick="ula" theme="primary" size="sm">我要發文</Button>
    </section>
    <hr/>
    <!-- 文章列表 -->
   <section class="articleList">
    <div
v-for="(article, index) in paginatedArticles"
      :key="index"
      class="articleItem"
    >
      <div class="articleImg">
        <img :src="article.image" :alt="article.title" />
      </div>

      <router-link :to="`/article/${article-ArticleDetail}`" class="articleText-link">

     <div class="articleText">
        <div class="articleHeader">
          <div class="articleDate">
          <span
  class="eventLabel"
  :style="{ backgroundColor: getEventColor(article.event) }"
>
  {{ article.event }}
</span> <p>{{ article.date }}</p>
          </div>
          <div class="articleTitle">
            <h3>{{ article.title }}</h3>
          </div>
        </div>
        <div class="articleBody">
<p v-html="article.content"></p>

        </div>
      </div>
      </router-link>
    </div>
  </section>
  <!-- 分頁按鈕 -->
<div class="pagination">
  <button 
    v-for="page in totalPages" 
    :key="page" 
    @click="goToPage(page)"
    :class="{ active: currentPage === page }"
  >
    {{ page }}
  </button>
</div>  </main>
</template>

<style scoped lang="scss">
#marquee .view {
  overflow: hidden;
  width: 100%;
}

.pic-container {
  display: flex;
  width: max-content;
  animation: marquee 60s linear infinite;
}

.pic {
  padding: 20px;
    flex-shrink: 0;
    width: 300px;
    height: 300px;
    margin-right: 10px;
    border-radius: 10px;
    color: #000000;
    display: flex
;
    justify-content: space-evenly;
    text-align: center;
    border-radius: 6px;
    align-items: center;
    flex-direction: column;
}

.pic img {
    width: 100%;
    height: auto;
    object-fit: cover;
    overflow: inherit;
    transform: scale(0.8);
    transition: transform 0.5s ease, width 0.5s ease;
}
.pic img:hover {
  width: 100%;
  height: auto;
  transform: scale(1);

}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.3333%);
  }
}

/*.banner {
  width: 100%;
}
*/
.imglist {
  display: flex;
  gap: 1vw;
  margin: 4vw 2vw;
  height: 30vh;
}

.activity {
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  font-weight: bold;
  border-radius: 10px;
  text-align: center;
}

.categoryLabel {
  padding: 10px 12px;
  background-color: #81bfda;
  border: 1px black solid;
}

.active {
  background-color: #4f8da8;
  color: #fff;
}
.categoryList {
  display: flex;
  gap: 10px;
}
.title {
  margin-block: 3vh;
}

section.articleCategory {
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
  width: 100%;
  align-items: center;
}

main.artic {
  max-width: 1200px;
  align-content: center;
  margin: auto;
}
hr {
  margin-block: 5vh;
}
.articleBody p {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; 
    line-clamp: 2;          /* 新標準寫法（新版瀏覽器） */

  -webkit-box-orient: vertical;
  
 
}
.articleItem {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin: 10vh auto;
}

section.articleList {
    margin: 5vh;
}


.articleText {
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
}
.eventLabel {
    text-align: center;
    padding: 5px;
    margin: 5px;
    background-color: #FADA7A;
    color: #000;
    border: #000 solid 1px;
    border-radius: 3px;
    width: 80px;
}
.articleDate {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
} 
.pagination {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 5vh;

  button {
    padding: 5px 10px;
    border: 1px solid #000;
    background: #eee;
    cursor: pointer;

    &.active {
      background: #81bfda;
      color: #000;
    }
  }
}
.articleImg{
  margin: 10px;
}

</style>
