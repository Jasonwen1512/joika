<script setup>
const props = defineProps({
  isOutline: {
    type: Boolean,
    default: faulse,
  },
  prefixIcon: {
    type: String,
  },
  suffixIcon: {
    type: String,
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
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div class="button-wrapper">
    <button
      class="button"
      :data-theme="theme"
      :data-size="size"
      :disabled="disabled"
      @click="onClick"
      :data-is-full="isFull"
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
    outline-color: outline-hover-color: $black,
    outline-hover-border-color: $black,
    outline-hover-background-color: $white,
    outline-disabled-background-color: $gray-disabled,
    outline-disabled-border-color: transparent,

    // icon顏色
    icon-color: $black,
    icon-hover-color: $black,
    icon-active-color: $white,
    icon-disabled-color: $white,
    icon-outline-color: $color-highlight,
    icon-outline-hover-color: $black,
  ),

  info: (
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
    outline-border-color: $color-highlight,
    outline-background-color: $white,
    outline-color: outline-hover-color: $black,
    outline-hover-border-color: $black,
    outline-hover-background-color: $white,
    outline-disabled-background-color: $gray-disabled,
    outline-disabled-border-color: transparent,
    // icon顏色
    icon-color: $black,
    icon-hover-color: $black,
    icon-active-color: $white,
    icon-disabled-color: $white,
    icon-outline-color: $color-primary,
    icon-outline-hover-color: $black,
  ),

  secondary: (
    // 字體顏色
    color: $black,
    hover-color: $black,
    active-color: $white,
    // 背景顏色
    background-color: $color-neutral,
    hover-background-color: $light-yellow,
    active-background-color: $brown,
    // disabled設定
    disabled-background-color: $gray-disabled,
    disabled-font-color: $white,
    // 邊框色
    border-color: $black,
    // outline
    outline-border-color: outline-background-color: outline-color:
      outline-hover-color: outline-hover-border-color:
      outline-hover-background-color: outline-disabled-background-color:
      $gray-disabled,
    outline-disabled-border-color: transparent,
    // icon顏色
    icon-color: $black,
    icon-hover-color: $black,
    icon-active-color: $white,
    icon-disabled-color: $white,
    icon-outline-color: $color-neutral,
    icon-outline-hover-color: $black,
  ),
);

// sizes
$buttonSizes: (
  sm: (
    font-size: $font-size-p,
    min-width: 86px,
    min-height: 38px,
    padding-horizontal: 16px,
    mobile-font-size: 14px,
    mobile-min-width: 86px,
    mobile-min-height: 38px,
    mobile-padding-horizontal: 16px,
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
  ),
);

.button-wrapper {
  height: fit-content;
  width: auto;

  .button {
    @each $theme, $styles in $buttonThemes {
      &[data-theme="#{$theme}"] {
        &:hover {
          color: map-get($styles, hover-color);
          background-color: map-get($styles, hover-background-color);
          border-color: map-get($styles, border-color);
        }

        &:active {
          color: map-get($styles, active-color);
          background-color: map-get($styles, active-background-color);
          .button-icon {
            color: map-get($styles, icon-active-color);
          }
        }

        &:disabled {
          background-color: map-get($styles, disabled-background-color);
          color: map-get($styles, disabled-font-color);
          cursor: default;

          .button-icon {
            color: map-get($styles, icon-disabled-color);
          }
        }
      }
    }
  }
}

.button {
  width: auto;
  @include flex-center;
  border: 1px solid;
  cursor: pointer;
  gap: 5px;

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: auto;
    max-height: 20px;
  }

  @each $theme, $styles in $buttonThemes {
    &[data-theme="#{$theme}"] {
      color: map-get($styles, color);
      background-color: map-get($styles, background-color);
      border-color: map-get($styles, border-color);

      .button-icon {
        color: map-get($styles, icon-color);
      }

      &:disabled {
        background-color: map-get($styles, disabled-background-color);
        color: map-get($styles, disabled-font-color);
        cursor: not-allowed;
        .button-icon {
          color: map-get($styles, icon-disabled-color);
        }
      }
    }
  }

  @each $size, $sizeStyles in $buttonSizes {
    &[data-size="#{$size}"] {
      font-size: map-get($sizeStyles, font-size);
      min-width: map-get($sizeStyles, min-width);
      min-height: map-get($sizeStyles, min-height);
      padding: 0 map-get($sizeStyles, padding-horizontal);
    }
  }
}

&[data-is-outline="true"] {
  @each $theme, $styles in $buttonThemes {
    &[data-theme="#{$theme}"] {
      color: map-get($styles, outline-color);
      background-color: map-get($styles, outline-background-color);
      border: 1px solid map-get($styles, outline-border-color);

      &:disabled {
        cursor: not-allowed;
        color: map-get($styles, disabled-font-color);
        border-color: map-get($styles, outline-disabled-border-color);
        background-color: $white;
      }
    }
  }
}

.button[data-is-full="true"] {
  width: 100%;
  border: 2px solid black;
  height: auto;
}
</style>
