<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import Stat from "@/components/widgets/stat";
import DataAnalytics from "./data-analytics";
import TopCounties from "./TopCounties";
import News from "./news.vue";

export default {
  page: {
    title: "Dashboard",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {
    Layout,
    PageHeader,
    Stat,
    DataAnalytics,
    TopCounties,
    News,
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "Betahood",
        },
        {
          text: "Dashboard",
          active: true,
        },
      ],
    };
  },
  mounted(){
    const shouldReload = sessionStorage.getItem('reloadOnce');
      if (shouldReload !== 'true') {
        // Perform the reload
        window.location.reload();
        // Set the flag to indicate that the window has been reloaded once
        sessionStorage.setItem('reloadOnce', 'true');
      }
  }
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <Stat />
    <div class="row">
      <DataAnalytics />
      <div class="col-xl-4">
        <News />
        <TopCounties />
      </div>
    </div>
  </Layout>
</template>
