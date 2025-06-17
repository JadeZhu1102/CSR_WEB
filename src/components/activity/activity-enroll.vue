<template>
    <view>
        <view v-if="isJoined === false" class="enroll-view">
            <view class="enroll-tips">
                <text>You have not yet taken part in the activity.</text>
            </view>
            <button @click="onEnroll">
                {{ $t('activity.button.enroll') }}
            </button>
        </view>
        <view v-if="isJoined === true" class="contribution-view">
            <view class="event-list">
                <view class="event-item" v-for="event in eventList">
                    <image class="event-icon" :src="event.inactiveIcon" />
                    <view>{{ event.name }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { ref } from "vue";
import type { IActivityEvent } from "@/models/event";
import enrollActivityListApi from "@/api/activity-enroll";
import fetchActivityEventsApi from "@/api/activity-events";

export default {
    props: {
        activityId: {
            type: Number,
            required: true,
        }
    },
    setup(props, { expose }) {
        expose()
        const isJoined = ref<boolean | null>(true);
        const eventList = ref<IActivityEvent[]>([]);

        return {
            isJoined,
            eventList,
        }
    },
    methods: {
        async onEnroll() {
            try {
                uni.showLoading()
                const res = await enrollActivityListApi(this.activityId);
                if (res) {
                    uni.showToast({
                        icon: 'success',
                    });
                }
            } catch (error) {
                uni.showToast({
                    icon: 'error',
                });
            } finally {
                uni.hideLoading();
            }
        },
        async refreshEventList() {
            const newEventList = await fetchActivityEventsApi(this.activityId);
            this.eventList = newEventList;
        },
    },
    mounted() {
        if (this.isJoined === true) {
            this.refreshEventList();
        }
    },
};
</script>

<style lang="scss">
.enroll-view {
    padding: 16px;
    .enroll-tips {
        margin-bottom: 24px;
    }
}

.event-list {
    display: flex;
}

.event-item {
    display: inline-flex;
    align-items: center;
    font-size: 14px;
    padding: 12px;
}

.event-icon {
    display: inline-block;
    width: 18px;
    height: 18px;
    margin-right: 4px;
}
</style>