export const layout = {
    namespaced: true,
    state: {
        isOpenClose: false,
        breadcrumbList: [],
    },
    mutations: {
        SET_IS_OPEN_MENU(state, isOpenClose) {
            state.isOpenClose = isOpenClose
        },
        SET_BREADCRUMB_MUTATIONS(state, bcList) {
            state.breadcrumbList = bcList
        },
    },
    actions: {
        setIsOpenCloseMenu({ commit }, isOpenClose) {
            setTimeout(() => {
                commit('SET_IS_OPEN_MENU', isOpenClose)
            }, 10)
        },
        setBreadcrumbActions({ commit }, bcList) {
            setTimeout(() => {
                commit('SET_BREADCRUMB_MUTATIONS', bcList)
            }, 10);
        }
    },
    getters: {
        getIsOpenClose: state => {
            return state.isOpenClose
        },
        getBreadcrumbList: state => {
            return state.breadcrumbList
        }
    }

}