<script setup>
defineOptions({ inheritAttrs: false })
const props = defineProps({
  isOutline: {
    type: Boolean,
    default: false,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
  prefixIcon: {
    type: [String, Object],
  },
  suffixIcon: {
    type: [String, Object],
  },
  isFull: {
    type: Boolean,
    default: false,
  },
  onClick: {
    type: Function,
  },
  icon: {
    type: String,
    default: "",
  },
  theme: {
    type: String,
    default: "primary",
  },
  size: {
    type: String,
    default: "md",
  },
});
</script>

<template>
  <div class="button-wrapper">
    <button
      class="button"
      :type="$attrs.type || 'button'"
       v-bind="$attrs"
      :data-theme="theme"
      :data-size="size"
      :disabled="isDisabled"
      @click="onClick"
      :data-is-full="isFull"
      :data-is-outline="isOutline"
    >
      <div v-if="prefixIcon" class="icon prefix button-icon">
        <component :is="prefixIcon" />
      </div>
      <slot />
      <div v-if="suffixIcon" class="icon suffix button-icon">
        <component :is="suffixIcon" />
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
@use "sass:map";
// themes
$buttonThemes: (
  primary: (
    // 字體顏色
    color: $black,
    hover-color: $black,
    active-color: $white,
    // 背景顏色
    background-color: $color-highlight,
    hover-background-color: $yellow,
    active-background-color: $orange,
    // disabled設定
    disabled-background-color: $gray-disabled,
    disabled-font-color: $white,
    // 邊框色
    border-color: $black,
    // outline
    outline-border-color: $color-highlight,
    outline-background-color: $white,
    outline-color: $color-highlight,
    outline-hover-color: $yellow,
    outline-hover-border-color: $yellow,
    outline-hover-background-color: $white,
    outline-active-color: $orange,
    outline-active-border-color: $orange,
    outline-active-background-color: $white,
    outline-disabled-background-color: $white,
    outline-disabled-border-color: $gray-disabled,
    outline-disabled-color: $gray-disabled,

    // icon顏色
    icon-color: $black,
    icon-hover-color: $black,
    icon-active-color: $white,
    icon-disabled-color: $white,
    icon-outline-color: $color-highlight,
    icon-outline-hover-color: $yellow,
    icon-outline-active-color: $orange,
  ),

  secondary: (
    // 字體顏色
    color: $black,
    hover-color: $black,
    active-color: $white,
    // 背景顏色
    background-color: $color-primary,
    hover-background-color: $color-secondary,
    active-background-color: $blue,
    // disabled設定
    disabled-background-color: $gray-disabled,
    disabled-font-color: $white,
    // 邊框色
    border-color: $black,
    // outline
    outline-border-color: $blue,
    outline-background-color: $white,
    outline-color: $blue,
    outline-hover-color: $color-primary,
    outline-hover-border-color: $color-primary,
    outline-hover-background-color: $light-blue,
    outline-active-color: $blue,
    outline-active-border-color: $blue,
    outline-active-background-color: $light-blue,
    outline-disabled-background-color: $white,
    outline-disabled-border-color: $gray-disabled,
    outline-disabled-color: $gray-disabled,
    // icon顏色
    icon-color: $black,
    icon-hover-color: $black,
    icon-active-color: $white,
    icon-disabled-color: $white,
    icon-outline-color: $blue,
    icon-outline-hover-color: $color-primary,
    icon-outline-active-color: $blue,
  ),

  cancel: (
    // 字體顏色
    color: $black,
    hover-color: $black,
    active-color: $white,
    // 背景顏色
    background-color: $color-primary,
    hover-background-color: $color-secondary,
    active-background-color: $blue,
    // disabled設定
    disabled-background-color: $gray-disabled,
    disabled-font-color: $white,
    // 邊框色
    border-color: $black,
    // outline
    outline-border-color: $color-primary,     
    outline-background-color: $white,        
    outline-color: $color-primary,            
    outline-hover-color: $white,           
    outline-hover-border-color: $color-primary, 
    outline-hover-background-color: $color-primary,
    outline-disabled-color: $gray-disabled,
    // icon顏色
    icon-color: $black,
    icon-hover-color: $black,
    icon-active-color: $white,
    icon-disabled-color: $white,
    icon-outline-color: $blue,
    icon-outline-hover-color: $color-primary,
    icon-outline-active-color: $blue,
  ),

  info: (
    // 字體顏色
    color: $black,
    hover-color: $black,
    active-color: $white,
    // 背景顏色
    background-color: $lighter-yellow,
    hover-background-color: $light-yellow,
    active-background-color: $brown,
    // disabled設定
    disabled-background-color: $gray-disabled,
    disabled-font-color: $white,
    // 邊框色
    border-color: $black,
    // outline
    outline-border-color: $brown,
    outline-background-color: $white,
    outline-color: $brown,
    outline-hover-color: $color-highlight,
    outline-hover-border-color: $color-highlight,
    outline-hover-background-color: $light-orange,
    outline-active-color: $orange,
    outline-active-border-color: $orange,
    outline-active-background-color: $lighter-orange,
    outline-disabled-background-color: $white,
    outline-disabled-border-color: $gray-disabled,
    outline-disabled-color: $gray-disabled,
    // icon顏色
    icon-color: $black,
    icon-hover-color: $black,
    icon-active-color: $white,
    icon-disabled-color: $white,
    icon-outline-color: $brown,
    icon-outline-hover-color: $color-highlight,
    icon-outline-active-color: $orange,
  ),
);

// sizes
$buttonSizes: (
  sm: (
    font-size: $font-size-p,
    min-width: 86px,
    min-height: 38px,
    padding-horizontal: 10px,
    mobile-font-size: 14px,
    mobile-min-width: 86px,
    mobile-min-height: 38px,
    mobile-padding-horizontal: 10px,
    border-radius: 6px,
    mobile-border-radius: 3px,
  ),
  md: (
    font-size: $font-size-h4,
    min-width: 158px,
    min-height: 38px,
    padding-horizontal: 16px,
    mobile-font-size: 16px,
    mobile-min-width: 158px,
    mobile-min-height: 38px,
    mobile-padding-horizontal: 16px,
    border-radius: 6px,
    mobile-border-radius: 3px,
  ),
  lg: (
    font-size: $font-size-h4,
    min-width: 142px,
    min-height: 50px,
    padding-horizontal: 16px,
    mobile-font-size: 18px,
    mobile-min-width: 462px,
    mobile-min-height: 35px,
    mobile-padding-horizontal: 24px,
    border-radius: 6px,
    mobile-border-radius: 3px,
  ),
);

.button-wrapper {
  height: fit-content;
  width: auto;
}

.button {
  width: auto;
  @include flex-center;
  border: 1px solid;
  cursor: pointer;
  gap: 5px;
  transition: all 0.3s ease-in-out;

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    max-height: 20px;
    transition: all 0.3s ease-in-out;
  }
  @each $theme, $styles in $buttonThemes {
    &[data-theme="#{$theme}"] {
      color: map.get($styles, color);
      background-color: map.get($styles, background-color);
      border-color: map.get($styles, border-color);

      .button-icon {
        color: map.get($styles, icon-color);
      }
      &:hover {
        color: map.get($styles, hover-color);
        background-color: map.get($styles, hover-background-color);
        border-color: map.get($styles, border-color);
      }

      &:active {
        color: map.get($styles, active-color);
        background-color: map.get($styles, active-background-color);
        .button-icon {
          color: map.get($styles, icon-active-color);
        }
      }

      &:disabled {
        background-color: map.get($styles, disabled-background-color);
        color: map.get($styles, disabled-font-color);
        cursor: not-allowed;

        .button-icon {
          color: map.get($styles, icon-disabled-color);
        }
      }
    }
  }
  &[data-is-outline="true"] {
    @each $theme, $styles in $buttonThemes {
      &[data-theme="#{$theme}"] {
        color: map.get($styles, outline-color);
        background-color: map.get($styles, outline-background-color);
        border: 1px solid map.get($styles, outline-border-color);
        .button-icon {
          color: map.get($styles, icon-outline-color);
        }
      

        &:hover {
          color: map.get($styles, outline-hover-color);
          background-color: map.get($styles, outline-hover-background-color);
          border-color: map.get($styles, outline-hover-border-color);
          .button-icon {
            color: map.get($styles, icon-outline-hover-color);
          }
        }

        &:active {
          color: map.get($styles, outline-active-color);
          background-color: map.get($styles, outline-active-background-color);
          border-color: map.get($styles, outline-active-border-color);
          .button-icon {
            color: map.get($styles, icon-outline-active-color);
          }
        }
        &:disabled {
          cursor: not-allowed;
          color: map.get($styles, outline-disabled-color);
          border-color: map.get($styles, outline-disabled-border-color);
          background-color: map.get($styles, outline-disabled-background-color);
        }
      }
    }
  }

  @each $size, $sizeStyles in $buttonSizes {
    &[data-size="#{$size}"] {
      font-size: map.get($sizeStyles, font-size);
      min-width: map.get($sizeStyles, min-width);
      min-height: map.get($sizeStyles, min-height);
      padding: 0px map.get($sizeStyles, padding-horizontal);
      border-radius: map.get($sizeStyles, border-radius);
    }

    @include mobile {
      &[data-size="#{$size}"] {
        border-radius: map.get($sizeStyles, mobile-border-radius);
      }
    }
  }
}

.button[data-is-full="true"] {
  width: 100%;
  border-radius: 3px;
}
</style>
