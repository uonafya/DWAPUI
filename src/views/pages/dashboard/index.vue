<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";

import Stat from "@/components/widgets/stat";
import SalesAnalytics from "./sales-analytics";
import SellingProduct from "./selling-product";
import TopUsers from "./top-users";
import Activity from "./activity";
import SocialSource from "./social-source";

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
    SalesAnalytics,
    SellingProduct,
    TopUsers,
    Activity,
    SocialSource,
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
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <Stat />
    <div class="row">
      <SalesAnalytics />
      <div class="col-xl-4">
        <div class="card bg-success bg-gradient">
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-sm-8">
                <p class="text-white font-size-18">
                  Enhanced
                  <b>Hospital Systems</b>
                  <i class="mdi mdi-arrow-right"></i>
                </p>
              </div>
              <div class="col-sm-4 bg-primary bg-success bg-gradient">
                <div class="mt-4 mt-sm-0">
                  <img src="@/assets/HealthITLogo.png" class="img-fluid bg-success bg-gradient" alt />
                </div>
              </div>
            </div>
          </div>
          <!-- end card-body-->
        </div>
        <!-- end card-->
        <SellingProduct />
      </div>
    </div>
    <div class="row">
      <TopUsers />
      <Activity />
      <SocialSource />
    </div>
  </Layout>
</template>
