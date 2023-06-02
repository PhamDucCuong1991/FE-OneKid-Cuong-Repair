export const dataTest = process.env.VUE_APP_API_TEST
export const dataApi = process.env.VUE_APP_API_BE
class BaseUrl {
    url = process.env.VUE_APP_API_BE
    mytest = dataTest
    myApi = dataApi
}
export default new BaseUrl();