const PageUrl = {
    auth: {
        login: '/pages/auth/login',
    },
    activity: {
        detail: (id: number) => '/pages/activity/detail?id=' + id,
    }
};
export default PageUrl;