<script>
import simplebar from "simplebar-vue";
import { menuItems } from "./horizontal-menu";
import store from "@/state/store";
import { layoutComputed, dataILMethods } from "@/state/helpers";

/**
 * Horizontal-topbar component
 */
export default {
  components: { simplebar },
  props: {
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      menuItems: menuItems,
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "spanish",
        },
        {
          flag: require("@/assets/images/flags/china.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      current_language: this.$i18n.locale,
      text: null,
      flag: null,
      value: null,
      user: null,
      username: "",
      notifications: [],
      showbar: false,
    };
  },
  computed: {
    ...layoutComputed,
  },
  mounted() {
    this.value = this.languages.find((x) => x.language === this.$i18n.locale);
    this.text = this.value.title;
    this.flag = this.value.flag;
    this.activateParentDropdown();

    this.$router.afterEach(() => {
      this.activateParentDropdown();
    });
    if (localStorage.getItem('user')) {
      let usr = JSON.parse(localStorage.user);
      this.useranme = usr.username.charAt(0)
        .toUpperCase() + usr.username.slice(1);
      this.showbar = true;
      this.notifications = usr.notifications;
      ///console.log(localStorage.user)
    }
  },
  methods: {
    ...dataILMethods,
    /**
     * remove active and mm-active class
     */
    _removeAllClass(className) {
      const els = document.getElementsByClassName(className);
      while (els[0]) {
        els[0].classList.remove(className);
      }
    },

    activateParentDropdown() {
      const resetParent = (el) => {
        const parent = el.parentElement;
        this._removeAllClass("mm-active");
        this._removeAllClass("mm-show");
        if (parent) {
          parent.classList.remove("active");
          const parent2 = parent.parentElement;
          if (parent2) {
            parent2.classList.remove("active");
            const parent3 = parent2.parentElement;
            if (parent3) {
              parent3.classList.remove("active");
              const parent4 = parent3.parentElement;
              if (parent4) {
                parent4.classList.remove("active");
                const parent5 = parent4.parentElement;
                if (parent5) {
                  parent5.classList.remove("active");
                  const menuelement = document.getElementById(
                    "topnav-menu-content"
                  );
                  if (menuelement !== null)
                    if (menuelement.classList.contains("show"))
                      document
                        .getElementById("topnav-menu-content")
                        .classList.remove("show");
                }
              }
            }
          }
        }
      };
      var links = document.getElementsByClassName("side-nav-link-ref");
      var matchingMenuItem = null;
      for (let i = 0; i < links.length; i++) {
        // reset menu
        resetParent(links[i]);
      }
      for (var i = 0; i < links.length; i++) {
        if (window.location.pathname === links[i].pathname) {
          matchingMenuItem = links[i];
          break;
        }
      }
      if (matchingMenuItem) {
        matchingMenuItem.classList.add("active");
        var parent = matchingMenuItem.parentElement;
        if (parent) {
          parent.classList.add("active");
          const parent2 = parent.parentElement;
          if (parent2) {
            parent2.classList.add("active");
          }
          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add("active");
            var childAnchor = parent3.querySelector(".has-dropdown");
            if (childAnchor) childAnchor.classList.add("active");
          }

          const parent4 = parent3.parentElement;
          if (parent4) parent4.classList.add("active");
          const parent5 = parent4.parentElement;
          if (parent5) parent5.classList.add("active");
        }
      }
    },
    /**
     * Full-screen
     */
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */
        !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    /**
     * Toggle right-sidebar
     */
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    /**
     * Menu clicked show the submenu
     */
    onMenuClick(event) {
      event.preventDefault();
      const nextEl = event.target.nextElementSibling;
      if (nextEl) {
        const parentEl = event.target.parentNode;
        if (parentEl) {
          parentEl.classList.remove("show");
        }
        nextEl.classList.toggle("show");
      }
      return false;
    },

    /**
     * Returns true or false if given menu item has child or not
     * @param item menuItem
     */
    hasItems(item) {
      return item.subItems !== undefined ? item.subItems.length > 0 : false;
    },
    /**
     * Language set
     */
    setLanguage(locale, country, flag) {
      this.$i18n.locale = locale;
      this.current_language = locale;
      this.text = country;
      this.flag = flag;
    },
    toggleMenu() {
      let element = document.getElementById("topnav-menu-content");
      element.classList.toggle("show");
    },
    logoutUser() {
      store.dispatch("authfack/logout");
    },
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-topbar", "dark");
              break;
            case "light":
              document.body.setAttribute("data-topbar", "light");
              document.body.removeAttribute("data-layout-size", "boxed");
              break;
            case "colored":
              document.body.setAttribute("data-topbar", "colored");
              document.body.removeAttribute("data-layout-size", "boxed");
              break;
            default:
              document.body.setAttribute("data-topbar", "dark");
              break;
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "boxed":
              document.body.setAttribute("data-layout-size", "boxed");
              break;
            case "fluid":
              document.body.setAttribute("data-layout-mode", "fluid");
              document.body.removeAttribute("data-layout-size");
              break;
            default:
              document.body.setAttribute("data-layout-mode", "fluid");
              break;
          }
        }
      },
    },
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="float-left">
         <!-- LOGO -->
          <div class="navbar-brand-box float-left mr-4 pr-4 mt-2">
            <router-link to="/" class="logo logo-dark">
              <span class="logo-sm">
                <img src="@/assets/HealthITLogo.png" alt height="100" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/HealthITLogo.png" alt height="100" />
              </span>
            </router-link>

            <router-link to="/" class="logo logo-light">
              <span class="logo-sm">
                <img src="@/assets/HealthITLogo.png" alt height="100" />
              </span>
              <span class="logo-lg">
                <img src="@/assets/HealthITLogo.png" alt height="100" />
              </span>
            </router-link>
          </div>

        <button type="button" class="btn btn-sm px-3 font-size-16 d-lg-none header-item" data-toggle="collapse"
          data-target="#topnav-menu-content" @click="toggleMenu">
          <i class="fa fa-fw fa-bars"></i>
        </button>

        <!-- App Search
        <form class="app-search d-none">
          <div class="position-relative">
            <input type="text" class="form-control" :placeholder="$t('navbar.search.text')" />
            <span class="uil-search"></span>
          </div>
        </form>-->
      </div>
       <div class="mt-2">
          <h2 class="text-white font-size-22">
           HEALTH-IT DATA IL
          </h2>
        </div>
      <div class="d-flex">
        <b-dropdown variant="white" class="d-inline-block d-lg-none ms-2" toggle-class="header-item noti-icon" right
          menu-class="dropdown-menu-lg p-0">
          <template v-slot:button-content>
            <i class="uil-search"></i>
          </template>
          <form class="p-3">
            <div class="form-group m-0">
              <div class="input-group">
                <input type="text" class="form-control" :placeholder="$t('navbar.search.text')"
                  aria-label="Recipient's username" />
                <div class="input-group-append">
                  <button class="btn btn-primary" type="submit">
                    <i class="mdi mdi-magnify"></i>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </b-dropdown>

        <div class="dropdown d-none d-lg-inline-block ms-1" v-if="showbar">
          <button type="button" class="btn header-item noti-icon waves-effect" data-toggle="fullscreen"
            @click="initFullScreen">
            <i class="uil-minus-path"></i>
          </button>
        </div>
        <div class="d-none d-lg-inline-block ms-1 m-auto" v-if="!showbar">
          <router-link class="btn btn-primary waves-effect" :to="{ name: 'login' }">Login
            <i class=""></i>
          </router-link>
        </div>
        <b-dropdown variant="white" class="dropdown d-inline-block" toggle-class="header-item noti-icon" right
          menu-class="dropdown-menu-lg p-0 dropdown-menu-end" v-if="showbar">
          <template v-slot:button-content>
            <i class="uil-bell"></i>
            <span class="badge bg-danger rounded-pill">{{ notifications.length }}</span>
          </template>

          <div class="p-3">
            <div class="row align-items-center">
              <div class="col">
                <h5 class="m-0 font-size-16">
                  {{ $t("navbar.dropdown.notification.text") }}
                </h5>
              </div>
              <div class="col-auto">
                <a href="#!" class="small">{{
                  $t("navbar.dropdown.notification.subtext")
                }}</a>
              </div>
            </div>
          </div>
          <simplebar style="max-height: 230px" data-simplebar>
            <a href class="text-reset notification-item" v-for="notice in notifications" :key="notice">
              <div class="media">
                <img src="@/assets/user.png" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                <div class="media-body">
                  <h6 class="mt-0 mb-1">
                    {{ $t(notice.created_by) }}
                  </h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-1">
                      {{ $t(notice.message) }}
                    </p>
                    <p class="mb-0">
                      <i class="mdi mdi-clock-outline"></i>
                      {{ $t(new Date(notice.date).toLocaleDateString()) }}
                    </p>
                  </div>
                </div>
              </div>
            </a>
            <a href="#" v-if="notifications.length == 0" class="text-muted p-2 m-2">You do not have any notifications
              yet...</a>
          </simplebar>
          <div class="p-2 border-top">
            <a class="btn btn-sm btn-link font-size-14 btn-block text-center" href="javascript:void(0)">
              <i class="uil-arrow-circle-right me-1"></i>
              {{ $t("navbar.dropdown.notification.button") }}
            </a>
          </div>
        </b-dropdown>

        <b-dropdown class="d-inline-block" toggle-class="header-item" right variant="white" v-if="showbar">
          <template v-slot:button-content>
            <img class="rounded-circle header-profile-user" src="@/assets/user.png" alt="Header Avatar" />
            <span class="d-none d-xl-inline-block ms-1 fw-medium font-size-15">{{ useranme }}</span>
            <i class="uil-angle-down d-none d-xl-inline-block font-size-15"></i>
          </template>

          <!-- item-->
          <a class="dropdown-item" href="#">
            <i class="uil uil-user-circle font-size-18 align-middle text-muted me-1"></i>
            <span class="align-middle">{{
              $t("navbar.dropdown.marcus.list.profile")
            }}</span>
          </a>
          <a class="dropdown-item d-block" href="#">
            <i class="uil uil-cog font-size-18 align-middle me-1 text-muted"></i>
            <span class="align-middle">{{
              $t("navbar.dropdown.marcus.list.settings")
            }}</span>
            <span class="badge badge-soft-success badge-pill mt-1 ms-2">03</span>
          </a>
          <a class="dropdown-item" href="#">
            <i class="uil uil-lock-alt font-size-18 align-middle me-1 text-muted"></i>
            <span class="align-middle">{{
              $t("navbar.dropdown.marcus.list.lockscreen")
            }}</span>
          </a>
          <a class="dropdown-item" href="javascript: void(0);" @click="logoutUser">
            <i class="uil uil-sign-out-alt font-size-18 align-middle me-1 text-muted"></i>
            <span class="align-middle">{{
              $t("navbar.dropdown.marcus.list.logout")
            }}</span>
          </a>
        </b-dropdown>

        <div class="dropdown d-inline-block">
          <button type="button" class="btn header-item noti-icon right-bar-toggle toggle-right"
            @click="toggleRightSidebar">
            <i class="uil-cog toggle-right"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="container-fluid bg-secondary">
      <div class="topnav bg-light text-white">
        <nav class="navbar navbar-light navbar-expand-lg topnav-menu">
          <div class="collapse navbar-collapse text-white" id="topnav-menu-content">
            <ul class="navbar-nav text-white">
              <li class="nav-item dropdown text-white \" v-for="(item, index) of menuItems" :key="index">
                <router-link tag="a" v-if="!item.subItems" :to="item.link"
                  class="nav-link dropdown-toggle arrow-none side-nav-link-ref">
                  <i :class="`${item.icon} me-2`"></i>
                  {{ $t(item.label) }}
                </router-link>

                <a v-if="item.subItems" class="nav-link dropdown-toggle arrow-none" @click="onMenuClick"
                  href="javascript: void(0);" id="topnav-components" role="button">
                  <i :class="`${item.icon} me-2`"></i>
                  {{ $t(item.label) }}
                  <div class="arrow-down"></div>
                </a>
                <div class="dropdown-menu" aria-labelledby="topnav-dashboard" v-if="hasItems(item)">
                  <template v-for="(subitem, index) of item.subItems">
                    <router-link :key="index" class="col dropdown-item side-nav-link-ref" v-if="!hasItems(subitem)"
                      :to="subitem.link">{{ $t(subitem.label) }}</router-link>
                    <div class="dropdown" v-if="hasItems(subitem)" :key="index">
                      <a class="dropdown-item" href="javascript: void(0);" @click="onMenuClick">
                        {{ $t(subitem.label) }}
                        <div class="arrow-down"></div>
                      </a>
                      <div class="dropdown-menu">
                        <router-link v-for="(subSubitem, index) of subitem.subItems" :key="index" :to="subSubitem.link"
                          class="dropdown-item side-nav-link-ref">{{ $t(subSubitem.label) }}</router-link>
                      </div>
                    </div>
                  </template>
                </div>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
