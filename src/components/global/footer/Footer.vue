<template>
  <div id="footer">
    <div>联系QQ: 2821458718</div>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="less">
#footer {
  min-height: 100px;
  padding: 1.5rem 0;
  text-align: center;
  background: linear-gradient(45deg, #dbe4ff, #96f2d7, #90d7ec);
  background-size: 400%;
  background-position: 0 50%;
  color: #fff;
  letter-spacing: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: -2px 0 10px 1px #90d7ec;
  animation: toggleBg 10s ease infinite;
  @keyframes toggleBg {
    0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 50% 0;
    }
    100% {
      background-position: 0 50%;
    }
  }
}
</style>
