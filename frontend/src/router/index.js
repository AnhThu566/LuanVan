import { createWebHistory, createRouter } from "vue-router";
import Login from "@/views/Login.vue";
import Home from "@/views/customer/Home.vue"; 

// ==========================================
// IMPORT CÁC TRANG CỦA ADMIN
// ==========================================
import AdminDashboard from "@/views/admin/AdminDashboard.vue"; 
import DogPage from "@/views/admin/dog/DogPage.vue";
import FarmPage from "@/views/admin/farm/FarmPage.vue";
import BreedPage from "@/views/admin/breed/BreedPage.vue";

// ==========================================
// IMPORT CÁC TRANG CỦA CHỦ TRẠI (FARM)
// ==========================================
import FarmDashboard from "@/views/farm/FarmDashboard.vue"; 
import FarmDogList from "@/views/farm/FarmDogList.vue";
import FarmDogForm from "@/views/farm/FarmDogForm.vue";
  // Trang form thêm chó

const routes = [
    { 
        path: "/", 
        name: "home", 
        component: Home 
    },
    { 
        path: "/login", 
        name: "login", 
        component: Login 
    },

    // ============================================================
    // CẤU TRÚC ROUTER LỒNG NHAU CHO CHỦ TRẠI (FARM)
    // ============================================================
    { 
        path: "/farm", 
        component: FarmDashboard, // Khung chứa Sidebar và Header của Trại
        children: [
            // Mặc định khi vào /farm sẽ tự động nhảy sang /farm/dashboard
            {
                path: "",
                redirect: "/farm/dashboard"
            },
           // 1. Trang danh sách thú cưng của trại
            {
                path: "dashboard",
                name: "farm-dog-list",
                component: FarmDogList
            },
            // 2. Trang đăng bán chó mới
            {
                path: "add-dog",
                name: "farm-dog-add",
                component: FarmDogForm
            }
        ]
    },

    // ============================================================
    // CẤU TRÚC ROUTER LỒNG NHAU CHO ADMIN (NESTED ROUTES)
    // ============================================================
    { 
        path: "/admin", 
        component: AdminDashboard, // Khung chứa Sidebar và Header của Admin
        children: [
            { 
                path: "", 
                redirect: "/admin/dog" 
            },
            { 
                path: "dog", 
                name: "admin-dog", 
                component: DogPage 
            },
            {
                path: "customer", 
                name: "admin-customer",
                component: () => import("@/views/admin/customer/CustomerPage.vue"),
            },
            { 
                path: "farm", 
                name: "admin-farm", 
                component: FarmPage 
            },
            { 
                path: "breed", 
                name: "admin-breed", 
                component: BreedPage 
            },
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;