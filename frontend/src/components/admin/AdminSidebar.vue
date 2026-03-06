<template>
  <div class="sidebar bg-dark text-white p-3 shadow" style="width: 260px; min-height: 100vh;">
    <div class="text-center mb-4 mt-2 border-bottom border-secondary pb-3">
      <h4 class="text-warning font-weight-bold mb-0"><i class="fas fa-paw"></i> PetShop</h4>
      <small class="text-muted">Quản trị viên</small>
    </div>

<ul class="nav flex-column">
  <p class="text-muted text-uppercase font-weight-bold mb-2 mt-3" style="font-size: 0.8rem;">Quản lý hệ thống</p>
  
  <li class="nav-item mb-2">
    <router-link to="/admin/dog" class="nav-link text-white rounded menu-item" active-class="bg-primary">
      <i class="fas fa-check-circle mr-2 w-20"></i> Duyệt Thú Cưng
    </router-link>
  </li>
  
  <li class="nav-item mb-2">
    <router-link :to="{ name: 'admin-customer' }" class="nav-link text-white rounded menu-item" active-class="bg-danger">
      <i class="fas fa-users mr-2 w-20"></i> Quản Lý Khách Hàng
    </router-link>
  </li>

  <li class="nav-item mb-2">
    <router-link :to="{ name: 'admin-farm' }" class="nav-link text-white rounded menu-item" active-class="bg-success">
      <i class="fas fa-house-user mr-2 w-20"></i> Quản Lý Trang Trại
    </router-link>
  </li>

  <li class="nav-item mb-2">
    <router-link to="/admin/breed" class="nav-link text-white rounded menu-item" active-class="bg-info">
      <i class="fas fa-dna mr-2 w-20"></i> Quản Lý Giống Chó
    </router-link>
  </li>
</ul>
  </div>
</template>

<style scoped>
.menu-item:hover { background-color: #495057; transition: 0.3s; }
.w-20 { width: 25px; text-align: center; }
/* Đảm bảo icon và chữ không bị dính sát nhau */
.nav-link i {
  display: inline-block;
}
</style>