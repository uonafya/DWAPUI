<script>
import { required, email } from "vuelidate/lib/validators";
import appConfig from "@/app.config";
import axios from "axios";
import Swal from "sweetalert2";
/**
 * Login component
 */
export default {
  page: {
    title: "Login",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      email: "admin@admin.com",
      password: "@Admin123",
      username: "admin",
      submitted: false,
      authError: null,
      tryingToLogIn: false,
      isAuthError: false,
    };
  },
  validations: {
    email: {
      required,
      email,
    },
    password: {
      required,
    },
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
    notificationAutoCloseDuration() {
      return this.$store && this.$store.state.notification ? 5 : 0;
    },
  },
  mounted() {
    document.body.classList.add("authentication-bg");
  },
  methods: {
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          this.tryingToLogIn = true;
          // Reset the authError if it existed.
          this.authError = null;
          return (
            this.$store
              .dispatch("auth/logIn", {
                email: this.email,
                password: this.password,
              })
              // eslint-disable-next-line no-unused-vars
              .then((token) => {
                this.tryingToLogIn = false;
                this.isAuthError = false;
                // Redirect to the originally requested page, or to the home page
                this.$router.push(
                  this.$route.query.redirectFrom || {
                    path: "/",
                  }
                );
              })
              .catch((error) => {
                this.tryingToLogIn = false;
                this.authError = error ? error : "";
                this.isAuthError = true;
              })
          );
        } else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
          axios
            .post(
              window.$http + "login/",
              { username: this.username, password: this.password },
              { headers: window.$headers }
            )
            .then((res) => {
              console.log(res.data);
              // const user = res.data.filter(
              //   (item) =>
              //     item.email === this.email && item.password === this.password
              // );
              if (res.data.token) {
                const token = res.data.token;
                axios.defaults.headers.common["Authorization"] =
                  "Token " + token;
                localStorage.setItem("token", token);
                const email = "admin@admin.com";
                const password = "@Admin123";
                if (email && password) {
                  this.$store.dispatch("authfack/login", {
                    email,
                    password,
                  });
                }
              } else {
                Swal.fire({
                  position: "center",
                  icon: "danger",
                  title: "Failde!",
                  html: "Wrong Username or Password!",
                  showConfirmButton: false,
                  timer: 1500,
                });
              }

              //}
            })
            .catch((res) => {
              console.log(res + ":error submit!!");
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "Faild!",
                html: res,
                showConfirmButton: false,
                timer: 1500,
              });
              return false;
            });
        }
      }
    },
  },
};
</script>

<template>
  <div class="bg-light m-0">
    <div class="account-pages my-5 pt-sm-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
              <router-link to="/" class="mb-5 d-block auth-logo">
                <h1>HealthIT DM-IL</h1>
              </router-link>
            </div>
          </div>
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card">
              <div class="card-body p-4 bg-success bg-gradient">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Welcome Back !</h5>
                  <p class="text-muted">Sign in to continue to DM-IL.</p>
                </div>
                <div class="p-2 mt-4">
                  <b-alert
                    v-model="isAuthError"
                    variant="danger"
                    class="mt-3"
                    dismissible
                    >{{ authError }}</b-alert
                  >

                  <div
                    v-if="notification.message"
                    :class="'alert ' + notification.type"
                  >
                    {{ notification.message }}
                  </div>

                  <b-form @submit.prevent="tryToLogIn">
                    <b-form-group
                      id="input-group-1"
                      class="mb-3"
                      label="Email"
                      label-for="input-1"
                    >
                      <b-form-input
                        id="input-1"
                        v-model="username"
                        type="text"
                        placeholder="Enter username"
                      ></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-2" class="mb-3">
                      <div class="float-end">
                        <router-link
                          to="/account/forgot-password"
                          class="text-muted"
                          >Forgot password?</router-link
                        >
                      </div>
                      <label for="input-2">Password</label>
                      <b-form-input
                        id="input-2"
                        v-model="password"
                        type="password"
                        placeholder="Enter password"
                        :class="{
                          'is-invalid': submitted && $v.password.$error,
                        }"
                      ></b-form-input>
                      <div
                        v-if="submitted && !$v.password.required"
                        class="invalid-feedback"
                      >
                        Password is required.
                      </div>
                    </b-form-group>
                    <div class="form-check">
                      <input
                        type="checkbox"
                        class="form-check-input"
                        id="auth-remember-check"
                      />
                      <label class="form-check-label" for="auth-remember-check"
                        >Remember me</label
                      >
                    </div>
                    <div class="mt-3 text-end">
                      <b-button type="submit" variant="primary" class="w-sm"
                        >Log In</b-button
                      >
                    </div>
                    <div class="mt-4 text-center">
                      <div class="signin-other-title">
                        <h5 class="font-size-14 mb-3 title">Sign in with</h5>
                      </div>

                      <ul class="list-inline">
                        <li class="list-inline-item">
                          <a
                            href="javascript:void()"
                            class="social-list-item bg-primary text-white border-primary"
                          >
                            <i class="mdi mdi-facebook"></i>
                          </a>
                        </li>
                        <li class="list-inline-item">
                          <a
                            href="javascript:void()"
                            class="social-list-item bg-info text-white border-info"
                          >
                            <i class="mdi mdi-twitter"></i>
                          </a>
                        </li>
                        <li class="list-inline-item">
                          <a
                            href="javascript:void()"
                            class="social-list-item bg-danger text-white border-danger"
                          >
                            <i class="mdi mdi-google"></i>
                          </a>
                        </li>
                      </ul>
                    </div>

                    <div class="mt-4 text-center">
                      <p class="mb-0">
                        Don't have an account ?
                        <router-link
                          to="/register"
                          class="fw-medium text-primary"
                          >Signup now</router-link
                        >
                      </p>
                    </div>
                  </b-form>
                </div>
                <!-- end card-body -->
              </div>
              <!-- end card -->
            </div>
            <div class="mt-5 text-center">
              <p>
                © {{ new Date().getFullYear() }} TDBSoft. Crafted with
                <i class="mdi mdi-heart text-danger"></i> by TDBSoft
              </p>
            </div>
            <!-- end row -->
          </div>
          <!-- end col -->
        </div>
        <!-- end row -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" module></style>
