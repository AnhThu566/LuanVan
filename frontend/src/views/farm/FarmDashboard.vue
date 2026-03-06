<template>
  <div class="d-flex" style="min-height: 100vh; overflow-x: hidden;">
    
    <FarmSidebar />

    <div class="flex-grow-1 bg-light d-flex flex-column">
      
      <FarmHeader />

      <div class="p-4 flex-grow-1">
        <router-view></router-view>
      </div>

      <FarmFooter />
      
    </div>
  </div>
</template>

<script>
// Nhúng 3 Component từ thư mục components/farm/
import FarmSidebar from "@/components/farm/FarmSidebar.vue";
import FarmHeader from "@/components/farm/FarmHeader.vue";
import FarmFooter from "@/components/farm/FarmFooter.vue";

export default {
  components: {
    FarmSidebar,
    FarmHeader,
    FarmFooter
  },
  created() {
    // Kiểm tra đăng nhập
    if (!localStorage.getItem("user")) {
      this.$router.push("/");
    }
  }
};
</script>