<script>
/**
 * Activity component
 */
export default {};
</script>

<template>
<div class="col-xl-4">
    <div class="card">
        <div class="card-body">
            <div class="float-end">
                <b-dropdown right toggle-class="p-0" variant="white" menu-class="dropdown-menu-end">
                    <template v-slot:button-content>
                        <span class="text-muted">
                           Yesterday
                            <i class="mdi mdi-chevron-down ms-1"></i>
                        </span>
                    </template>
                    <b-dropdown-item href="#">Yesterday</b-dropdown-item>
                    <b-dropdown-item href="#">Today</b-dropdown-item>
                    <b-dropdown-item href="#">Last Week</b-dropdown-item>
                </b-dropdown>
            </div>

            <h4 class="card-title mb-4">Payment History</h4>

            <ol class="activity-feed mb-0 ps-2" data-simplebar style="max-height: 336px;">
                <li class="feed-item">
                    <div class="feed-item-list">
                        <p class="text-muted mb-1 font-size-13">
                            Yesterday
                            <small class="d-inline-block ms-1">11:20 am</small>
                        </p>
                        <p class="mt-0 mb-0">
                            New parking fee paid - REF R7646576F
                            <span class="text-primary">
                               City Squre
                            </span>
                        </p>
                    </div>
                </li>
                <li class="feed-item">
                    <p class="text-muted mb-1 font-size-13">
                        17 May, 2022
                        <small class="d-inline-block ms-1">12:36 pm</small>
                    </p>
                    <p class="mt-0 mb-0">
                         New parking fee paid - REF R7646576F
                        <span class="text-primary">City Squre</span>
                    </p>
                </li>
                <li class="feed-item">
                    <p class="text-muted mb-1 font-size-13">
                         17 JMay, 2022
                        <small class="d-inline-block ms-1">07:56 am</small>
                    </p>
                    <p class="mt-0 mb-0">
                         New parking fee paid - REF R7646576F
                        <span class="text-primary">Agakhan Squre</span>
                    </p>
                </li>
                <li class="feed-item">
                    <p class="text-muted mb-1 font-size-13">
                        17 May, 2022
                        <small class="d-inline-block ms-1">08:42 pm</small>
                    </p>
                    <p class="mt-0 mb-0">
                         New parking fee paid - REF R7646576F
                        <span class="text-primary">Sports Ground</span>
                    </p>
                </li>

                <li class="feed-item">
                    <p class="text-muted mb-1 font-size-13">
                      17 May, 2022
                        <small class="d-inline-block ms-1">12:22 am</small>
                    </p>
                    <p class="mt-0 mb-0">
                         New parking fee paid - REF R7646576F
                        <span class="text-primary">City Squre</span>
                    </p>
                </li>
                <li class="feed-item pb-1">
                    <p class="text-muted mb-1 font-size-13">
                        17 May, 2022
                        <small class="d-inline-block ms-1">09:48 pm</small>
                    </p>
                    <p class="mt-0 mb-0">
                         New parking fee paid - REF R7646576F
                        <span class="text-primary">City Squre</span>
                    </p>
                </li>
            </ol>
        </div>
    </div>
</div>
</template>
