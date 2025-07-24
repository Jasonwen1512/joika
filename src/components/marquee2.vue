<script setup>
import { computed } from 'vue'

const rawTags = [
    {
        text: '#JOIKA',
        colors: ['#81BFDA', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    },
    {
        text: '#JOIKA',
        colors: ['#FB900C', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    },
    {
        text: '#JOIKA',
        colors:['#81BFDA', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    },
    {
        text: '#JOIKA',
        colors:  ['#FB400C', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    },
    {
        text: '#JOIKA',
        colors: ['#1FB92C', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    },
    {
        text:'#JOIKA',
        colors: ['#F315BB', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    },
    {   text:'#JOIKA',
        colors: ['#FFE100', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    },
    {   text:'#JOIKA',
        colors: ['#1A00FF', '#4F8DA8', '#FADA7A',  '#4F8DA8', '#FADA7A', '#4F8DA8']
    }
]
const colorfulLetters = computed(() => {
    return rawTags.flatMap((tag, index) => {
        const letterSpans = tag.text.split('').map((ch, i) => ({
            ch,
            color: tag.colors[i % tag.colors.length]
        }));
        return index < rawTags.length - 1 ? [...letterSpans, { ch: ' ', color: 'transparent' }] : letterSpans;
    }).filter(item => item.ch !== '' || item.color === 'transparent'); 
});
</script>

<template>
    <div class="marquee-wrapper">
        <div class="marquee-content">
            <div class="marquee-item">
                <template v-for="(item, i) in colorfulLetters" :key="i">
                    <span
                        v-if="item.ch !== ' '"
                        class="color-letter"
                        :style="{ '--color': item.color }"
                    >
                        {{ item.ch }}
                    </span>
                    <span v-else class="tag-spacer"></span> </template>
            </div>
            <div class="marquee-item">
                <template v-for="(item, i) in colorfulLetters" :key="'clone-' + i">
                    <span
                        v-if="item.ch !== ' '"
                        class="color-letter"
                        :style="{ '--color': item.color }"
                    >
                        {{ item.ch }}
                    </span>
                    <span v-else class="tag-spacer"></span> </template>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.marquee-wrapper {
    overflow: hidden;          
    white-space: nowrap;       
    width: 100%;               
    background-color: transparent; 
    box-sizing: border-box;
}
.marquee-content {
    display: inline-flex;           
    animation: marquee-right 20s linear infinite; 
    min-width: fit-content;
}

.marquee-item {
    margin: 0;
    padding: 0;
    flex-shrink: 0;                
    display: flex;                
    margin-right: 2rem; 
    align-items: center;          
}

.color-letter {
    color: var(--color);         
    font-weight: bold;
    font-size: 3rem;
    margin-right: 0.15em;        
    transform: skewX(-25deg);
    font-family: 'Baloo 2', cursive; 
    text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
}

@keyframes marquee-right {
    0% {
        transform: translateX(-50%);
    }
    100% {
        transform: translateX(0%);
    }
}
.tag-spacer {
    display: inline-block;
    width: 2rem; 
}
</style>