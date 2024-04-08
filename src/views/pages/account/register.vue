<script>
import { required, email } from "vuelidate/lib/validators";
import appConfig from "@/app.config";
import axios from "axios";
import Swal from "sweetalert2";

/**
 * Register component
 */
export default {
  page: {
    title: "Register",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      user: {
        username: "user@user.com",
        email: "user@user.com",
        password: "@Admin123",
      },
      submitted: false,
      tryingToRegister: false,
      isRegisterError: false,
      title: "Register",
    };
  },
  validations: {
    user: {
      username: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
      },
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
    // Try to register the user in with the email, username
    // and password they provided.
    tryToRegisterIn() {
      this.submitted = true;
      // stop here if form is invalid
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      } else {
        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          this.tryingToRegister = true;
          // Reset the regError if it existed.
          this.regError = null;
          return (
            this.$store
              .dispatch("auth/register", {
                email: this.user.email,
                password: this.user.password,
              })
              // eslint-disable-next-line no-unused-vars
              .then((token) => {
                this.tryingToRegister = false;
                this.isRegisterError = false;
                this.registerSuccess = true;
                if (this.registerSuccess) {
                  this.$router.push(
                    this.$route.query.redirectFrom || {
                      path: "/",
                    }
                  );
                }
              })
              .catch((error) => {
                this.tryingToRegister = false;
                this.regError = error ? error : "";
                this.isRegisterError = true;
              })
          );
        }
        // else if (process.env.VUE_APP_DEFAULT_AUTH === "fakebackend") {
        //   const { email, username, password } = this.user;
        //   if (email && username && password) {
        //     this.$store.dispatch("authfack/registeruser", this.user);
        //   }
        // }
        else {
          var data = {
            first_name: this.user.username,
            last_name: this.user.username,
            username: this.user.username,
            email: this.user.email,
            password: this.user.password,
          };

          axios
            .post(window.$http + "users/", data, { headers: window.$headers })
            .then((res) => {
              console.log(res.data);
              Swal.fire({
                position: "center",
                icon: "success",
                title: "User Account Created successfully!",
                showConfirmButton: false,
                timer: 1500,
              });
              this.$router.push({ name: "login" }); // route jump
            })
            .catch((res) => {
              console.log(res + ":error submit!!");
              return false;
            });
        }
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="account-pages my-5 pt-sm-5 bg-light bg-gradient">
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
          <div class="col-md-12 col-lg-8 col-xl-8">
            <div class="card">
              <div class="card-body p-4 bg-success bg-gradient">
                <div class="text-center mt-2">
                  <h5 class="text-white">Register Account</h5>
                  <p class="text-white-50">Get your free DM-IL account now.</p>
                </div>
                <div class="p-2 mt-4">
                  <div v-if="notification.message" :class="'alert ' + notification.type">
                    {{ notification.message }}
                  </div>

                  <b-form @submit.prevent="tryToRegisterIn">
                    <div class="row">
                      <div class="col-sm-6">
                        <b-form-group
                          id="email-group"
                          label="Username"
                          class="mb-3"
                          label-for="username"
                        >
                          <b-form-input
                            id="username"
                            v-model="user.username"
                            type="text"
                            placeholder="Enter username"
                            :class="{
                              'is-invalid': submitted && $v.user.username.$error,
                            }"
                          ></b-form-input>
                          <div
                            v-if="submitted && !$v.user.username.required"
                            class="invalid-feedback"
                          >
                            Username is required.
                          </div>
                        </b-form-group>

                        <b-form-group
                          id="fullname-group"
                          label="Email"
                          label-for="email"
                          class="mb-3"
                        >
                          <b-form-input
                            id="email"
                            v-model="user.email"
                            type="email"
                            placeholder="Enter email"
                            :class="{
                              'is-invalid': submitted && $v.user.email.$error,
                            }"
                          ></b-form-input>
                          <div
                            v-if="submitted && $v.user.email.$error"
                            class="invalid-feedback"
                          >
                            <span v-if="!$v.user.email.required">Email is required.</span>
                            <span v-if="!$v.user.email.email"
                              >Please enter valid email.</span
                            >
                          </div>
                        </b-form-group>

                        <b-form-group
                          id="password-group"
                          label="Password"
                          class="mb-3"
                          label-for="password"
                        >
                          <b-form-input
                            id="password"
                            v-model="user.password"
                            type="password"
                            placeholder="Enter password"
                            :class="{
                              'is-invalid': submitted && $v.user.password.$error,
                            }"
                          ></b-form-input>
                          <div
                            v-if="submitted && !$v.user.password.required"
                            class="invalid-feedback"
                          >
                            Password is required.
                          </div>
                        </b-form-group>
                        <div class="form-check">
                          <input
                            type="checkbox"
                            class="form-check-input"
                            id="auth-terms-condition-check"
                          />
                          <label class="form-check-label" for="auth-terms-condition-check"
                            >I accept
                            <a href="javascript: void(0);" class="text-dark"
                              >Terms and Conditions</a
                            ></label
                          >
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <b-form-group
                          id="email-group"
                          label="Firts Name"
                          class="mb-3"
                          label-for="fname"
                        >
                          <b-form-input
                            id="fname"
                            v-model="fname"
                            type="text"
                            placeholder="Enter First Name"
                          ></b-form-input>
                        </b-form-group>

                        <b-form-group
                          id="fullname-group"
                          label="Last Name"
                          label-for="lname"
                          class="mb-3"
                        >
                          <b-form-input
                            id="lname"
                            v-model="lname"
                            type="text"
                            placeholder="Enter Last Name"
                          ></b-form-input>
                        </b-form-group>

                        <b-form-group
                          id="phone-group"
                          label="Phone Number"
                          class="mb-3"
                          label-for="phone"
                        >
                          <b-form-input
                            id="phone"
                            v-model="phone"
                            type="text"
                            placeholder="+2547 43 793 901"
                          ></b-form-input>
                        </b-form-group>
                      </div>
                    </div>

                    <div class="mt-3 text-end">
                      <b-button type="submit" variant="danger" class="w-sm"
                        >Register</b-button
                      >
                    </div>

                    <div class="mt-4 text-center">
                      <div class="signin-other-title">
                        <h5 class="font-size-14 mb-3 title">Sign up using</h5>
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
                      <p class="text-white-50 mb-0">
                        Already have an account ?
                        <router-link to="/login" class="fw-medium text-danger"
                          >Login</router-link
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
                © {{ new Date().getFullYear() }} HealthIT. Crafted with
                <i class="mdi mdi-heart text-danger"></i> by HealthIT
              </p>
            </div>
          </div>
          <!-- end col -->
        </div>
      </div>
    </div>
    <!-- end row -->
  </div>
</template>

<style lang="scss" module></style>
