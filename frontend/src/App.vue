<template>
  <div id="app">
    <nav v-if="showPublicNavbar" class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <router-link to="/" class="navbar-brand font-weight-bold" style="font-size: 1.5rem;">
          <i class="fas fa-paw text-warning"></i> PetShop
        </router-link>

        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav mr-auto">
            <li class="nav-item">
              <router-link to="/" class="nav-link">
                <i class="fas fa-home"></i> Trang Chủ
              </router-link>
            </li>
          </ul>

          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link to="/login" class="btn btn-outline-warning btn-sm mt-1 px-3">
                <i class="fas fa-sign-in-alt"></i> Đăng Nhập
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div :class="{ 'mt-4': showPublicNavbar }">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: "App",
computed: {
    showPublicNavbar() {
      // Các trang đơn lẻ cần ẩn
      const isolatedPages = ['login', 'register'];
      const isIsolated = isolatedPages.includes(this.$route.name);

      // Kiểm tra xem có đang ở trong khu vực Admin hoặc Farm không
      const isAdminOrFarm = this.$route.path.startsWith('/admin') || this.$route.path.startsWith('/farm');

      // Nếu không phải trang đơn lẻ VÀ không phải khu vực quản trị thì mới hiện Navbar
      return !isIsolated && !isAdminOrFarm;
    }
  }
};
</script>

<style>
body {
  background-color: #f8f9fa; 
  margin: 0;
  padding: 0;
}
</style>