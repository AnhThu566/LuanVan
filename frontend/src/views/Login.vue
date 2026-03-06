    <template>
    <div class="page mt-5">
        <h3 class="text-center mb-4">Đăng Nhập Hệ Thống</h3>
        <Form @submit="handleLogin" :validation-schema="loginFormSchema">
        
        <div class="form-group">
            <label for="username">Tên đăng nhập</label>
            <Field name="username" type="text" class="form-control" v-model="user.username" />
            <ErrorMessage name="username" class="error-feedback" />
        </div>

        <div class="form-group">
            <label for="password">Mật khẩu</label>
            <Field name="password" type="password" class="form-control" v-model="user.password" />
            <ErrorMessage name="password" class="error-feedback" />
        </div>

        <div class="form-group text-center">
            <button class="btn btn-primary btn-block" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm"></span>
            Đăng nhập
            </button>
        </div>

        <div class="form-group" v-if="message">
            <div class="alert alert-danger" role="alert">{{ message }}</div>
        </div>

        </Form>
    </div>
    </template>

    <script>
    import { Form, Field, ErrorMessage } from "vee-validate";
    import * as yup from "yup";
    import AuthService from "@/services/auth.service";

    export default {
    components: { Form, Field, ErrorMessage },
    data() {
        const loginFormSchema = yup.object().shape({
        username: yup.string().required("Tên đăng nhập không được để trống."),
        password: yup.string().required("Mật khẩu không được để trống."),
        });
        
        return {
        user: { username: "", password: "" },
        loginFormSchema,
        message: "",
        loading: false,
        };
    },
    methods: {
        async handleLogin() {
        this.loading = true;
        this.message = "";
        try {
            const response = await AuthService.login(this.user);
            
            localStorage.setItem("user", JSON.stringify(response.user));
            alert("Đăng nhập thành công! Vai trò: " + response.user.role);
            
            // HỆ THỐNG BẺ LÁI:
            const role = response.user.role;
            if (role === "farm") {
                this.$router.push("/farm");
            } else if (role === "admin") {
                this.$router.push("/admin");
            } else {
                this.$router.push("/");
            }
            
        } catch (error) {
            this.message = error.response?.data?.message || "Lỗi đăng nhập. Vui lòng thử lại!";
        } finally {
            this.loading = false;
        }
        },
    },
    };
    </script>

    <style scoped>
    .page { max-width: 400px; margin: auto; }
    .error-feedback { color: red; font-size: 0.9em; }
    </style>